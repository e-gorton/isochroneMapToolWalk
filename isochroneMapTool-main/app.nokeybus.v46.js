#!/usr/bin/env node
/*
  BODS Overpass timeout fix v66

  Run from the repository root. It patches both:
    - isochroneMapTool-main/app.nokeybus.v46.js
    - isochroneMapTool-main/dist/app.nokeybus.v46.js

  What it does:
    - caps BODS stop enrichment Overpass work;
    - reduces the broad 45 km stop-enrichment query;
    - disables the direct NaPTAN API loop that was returning repeated 400s;
    - bumps the BODS cache schema to force a fresh run.
*/

const fs = require("fs");
const path = require("path");

const TARGETS = [
  path.join("isochroneMapTool-main", "app.nokeybus.v46.js"),
  path.join("isochroneMapTool-main", "dist", "app.nokeybus.v46.js"),
  "app.nokeybus.v46.js",
  path.join("dist", "app.nokeybus.v46.js"),
];

function replaceFunction(source, functionName, replacement) {
  const marker = `async function ${functionName}(`;
  const start = source.indexOf(marker);
  if (start === -1) {
    throw new Error(`Could not find ${functionName}()`);
  }

  const braceStart = source.indexOf("{", start);
  if (braceStart === -1) {
    throw new Error(`Could not find opening brace for ${functionName}()`);
  }

  let depth = 0;
  let inString = false;
  let stringQuote = "";
  let inLineComment = false;
  let inBlockComment = false;
  let escaped = false;

  for (let index = braceStart; index < source.length; index += 1) {
    const char = source[index];
    const next = source[index + 1];

    if (inLineComment) {
      if (char === "\n") inLineComment = false;
      continue;
    }

    if (inBlockComment) {
      if (char === "*" && next === "/") {
        inBlockComment = false;
        index += 1;
      }
      continue;
    }

    if (inString) {
      if (escaped) {
        escaped = false;
        continue;
      }
      if (char === "\\") {
        escaped = true;
        continue;
      }
      if (char === stringQuote) {
        inString = false;
        stringQuote = "";
      }
      continue;
    }

    if (char === "/" && next === "/") {
      inLineComment = true;
      index += 1;
      continue;
    }

    if (char === "/" && next === "*") {
      inBlockComment = true;
      index += 1;
      continue;
    }

    if (char === '"' || char === "'" || char === "`") {
      inString = true;
      stringQuote = char;
      continue;
    }

    if (char === "{") depth += 1;
    if (char === "}") {
      depth -= 1;
      if (depth === 0) {
        return `${source.slice(0, start)}${replacement}${source.slice(index + 1)}`;
      }
    }
  }

  throw new Error(`Could not find closing brace for ${functionName}()`);
}

const replacementFetchBodsStopCoordinatesFromOsmByStopIds = String.raw`async function fetchBodsStopCoordinatesFromOsmByStopIds(stopIds, options = {}) {
  if (!Array.isArray(stopIds) || stopIds.length === 0 || !options.originCoordinates) {
    return new Map();
  }

  const cappedStopIds = stopIds.slice(0, BODS_STOP_ENRICHMENT_MAX_IDS);
  const originalIdByNormalised = buildBodsStopIdLookup(cappedStopIds);
  const resolved = new Map();
  const regexChunks = getBodsStopIdRegexChunks(
    cappedStopIds,
    BODS_OSM_EXACT_STOP_ID_CHUNK_SIZE
  ).slice(0, BODS_MAX_EXACT_OSM_STOP_ID_CHUNKS);

  const radius = Math.round(BODS_STOP_ENRICHMENT_RADIUS_METRES);
  const origin = options.originCoordinates;

  for (const regex of regexChunks) {
    if (options.signal?.aborted) {
      throw createServiceError(
        BODS_TIMETABLE_SERVICE_NAME,
        "cancelled",
        "BODS stop enrichment was cancelled."
      );
    }

    if (!regex) {
      continue;
    }

    const query = `
[out:json][timeout:12];
(
  node(around:${radius},${origin.latitude},${origin.longitude})["naptan:AtcoCode"~"^(${regex})$",i];
  node(around:${radius},${origin.latitude},${origin.longitude})["naptan:NaptanCode"~"^(${regex})$",i];
  node(around:${radius},${origin.latitude},${origin.longitude})["ref:GB:naptan"~"^(${regex})$",i];
  node(around:${radius},${origin.latitude},${origin.longitude})["ref"~"^(${regex})$",i];

  way(around:${radius},${origin.latitude},${origin.longitude})["naptan:AtcoCode"~"^(${regex})$",i];
  way(around:${radius},${origin.latitude},${origin.longitude})["naptan:NaptanCode"~"^(${regex})$",i];
  way(around:${radius},${origin.latitude},${origin.longitude})["ref:GB:naptan"~"^(${regex})$",i];
  way(around:${radius},${origin.latitude},${origin.longitude})["ref"~"^(${regex})$",i];
);
out center tags;
    `;

    try {
      const payload = await fetchOsmBusRouteOverpassPayload(
        query,
        { signal: options.signal },
        BODS_STOP_ENRICHMENT_OVERPASS_TIMEOUT_MS
      );

      (payload.elements || []).forEach((element) => {
        const latitude = Number.isFinite(Number(element.lat))
          ? Number(element.lat)
          : Number(element.center?.lat);
        const longitude = Number.isFinite(Number(element.lon))
          ? Number(element.lon)
          : Number(element.center?.lon);

        if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
          return;
        }

        const tags = element.tags || {};
        [
          tags["naptan:AtcoCode"],
          tags["naptan:NaptanCode"],
          tags["ref:GB:naptan"],
          tags.atco_code,
          tags.AtcoCode,
          tags.ref,
          tags.local_ref,
        ].filter(Boolean).forEach((candidate) => {
          const originalId = originalIdByNormalised.get(
            normaliseBodsStopIdentifier(candidate)
          );

          if (originalId && !resolved.has(originalId)) {
            resolved.set(originalId, { latitude, longitude });
          }
        });
      });
    } catch (error) {
      if (error?.kind === "cancelled") {
        throw error;
      }

      console.warn(
        "[BODS diagnostics] capped OSM stop-id enrichment failed",
        error?.message || String(error)
      );
    }
  }

  return resolved;
}`;

function patchSource(source) {
  let patched = source;

  patched = patched.replace(
    /const BODS_CACHE_SCHEMA_VERSION = "[^"]+";/,
    'const BODS_CACHE_SCHEMA_VERSION = "v66-capped-bods-stop-enrichment";'
  );

  patched = patched.replace(
    /const BODS_STOP_ENRICHMENT_RADIUS_METRES = \d+;\s*\nconst BODS_STOP_ENRICHMENT_MAX_IDS = \d+;/,
    [
      "const BODS_STOP_ENRICHMENT_RADIUS_METRES = 18000;",
      "const BODS_STOP_ENRICHMENT_MAX_IDS = 500;",
      "const BODS_OSM_EXACT_STOP_ID_CHUNK_SIZE = 80;",
      "const BODS_MAX_EXACT_OSM_STOP_ID_CHUNKS = 3;",
      "const BODS_STOP_ENRICHMENT_OVERPASS_TIMEOUT_MS = 12000;",
      "const BODS_MAX_NAPTAN_API_LOOKUPS = 0;",
    ].join("\n")
  );

  patched = replaceFunction(
    patched,
    "fetchBodsStopCoordinatesFromOsmByStopIds",
    replacementFetchBodsStopCoordinatesFromOsmByStopIds
  );

  patched = patched.replace(
    /if \(unresolved\.size > 0 && options\.allowExternalStopEnrichment !== false\) \{\s*\n\s*const directIds = Array\.from\(unresolved\.keys\(\)\)\.slice\(0, Math\.min\(450, BODS_STOP_ENRICHMENT_MAX_IDS\)\);/,
    `if (\n  unresolved.size > 0 &&\n  options.allowExternalStopEnrichment !== false &&\n  BODS_MAX_NAPTAN_API_LOOKUPS > 0\n) {\n  const directIds = Array.from(unresolved.keys()).slice(\n    0,\n    Math.min(BODS_MAX_NAPTAN_API_LOOKUPS, BODS_STOP_ENRICHMENT_MAX_IDS)\n  );`
  );

  patched = patched.replace(
    /const payload = await fetchOsmBusRouteOverpassPayload\(query, \{ signal: options\.signal \}, 45000\);/,
    `const payload = await fetchOsmBusRouteOverpassPayload(\n    query,\n    { signal: options.signal },\n    BODS_STOP_ENRICHMENT_OVERPASS_TIMEOUT_MS\n  );`
  );

  if (!patched.includes('BODS_CACHE_SCHEMA_VERSION = "v66-capped-bods-stop-enrichment"')) {
    throw new Error("Cache schema version was not patched.");
  }
  if (!patched.includes("BODS_MAX_NAPTAN_API_LOOKUPS = 0")) {
    throw new Error("NaPTAN lookup cap constant was not inserted.");
  }
  if (!patched.includes("BODS_MAX_EXACT_OSM_STOP_ID_CHUNKS")) {
    throw new Error("OSM stop-id chunk cap constant was not inserted.");
  }
  if (!patched.includes("BODS_STOP_ENRICHMENT_OVERPASS_TIMEOUT_MS")) {
    throw new Error("Overpass timeout constant was not inserted.");
  }

  return patched;
}

let patchedCount = 0;
const seen = new Set();

for (const target of TARGETS) {
  const absolute = path.resolve(process.cwd(), target);
  if (seen.has(absolute) || !fs.existsSync(absolute)) {
    continue;
  }
  seen.add(absolute);

  const original = fs.readFileSync(absolute, "utf8");
  const patched = patchSource(original);
  if (patched !== original) {
    fs.writeFileSync(absolute, patched, "utf8");
    patchedCount += 1;
    console.log(`Patched ${target}`);
  } else {
    console.log(`No changes needed for ${target}`);
  }
}

if (patchedCount === 0) {
  throw new Error(
    "No app.nokeybus.v46.js files were patched. Run this from the repository root or check the file paths."
  );
}

console.log("BODS Overpass enrichment fix v66 applied. Rebuild/deploy, then hard refresh the site.");
