import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import vm from "node:vm";

const projectRoot = dirname(dirname(fileURLToPath(import.meta.url)));
const appSource = readFileSync(join(projectRoot, "app.nokeybus.v46.js"), "utf8");
const htmlSource = readFileSync(join(projectRoot, "index.html"), "utf8");

assert.doesNotMatch(htmlSource, /id="busMethod"/, "Bus method selector should be removed from the public UI once BODS-only mode is active.");
assert.match(htmlSource, /id="busSpeedMph"/, "Bus speed input should be present in the UI.");
assert.match(htmlSource, /id="busMaxWalkMetres"/, "Bus maximum walk input should be present in the UI.");
assert.match(htmlSource, /Maximum walk to bus stop \(m\)/, "Bus maximum walk input should be labelled in metres.");
assert.match(htmlSource, /id="busSpeedModel"/, "Bus speed model select should be present in the UI.");
assert.match(htmlSource, /Road-type weighted speed/, "Road-type weighted speed option should be present in the UI.");
assert.match(htmlSource, /Average bus speed \/ fallback speed \(mph\)/, "Bus speed input should be labelled in mph.");

assert.match(appSource, /const BUS_DEFAULT_SPEED_KPH = 18;/, "Default bus speed should preserve the v28 18 kph assumption.");
assert.match(appSource, /extent: "BODS timetable-based bus catchment"/, "Bus mode report wording should describe the default BODS timetable catchment, not an indicative OSM corridor.");
assert.doesNotMatch(appSource, /Indicative bus route corridor catchments generated/, "Successful default bus generation should not describe BODS output as an indicative OSM corridor.");
assert.match(appSource, /const BODS_MAX_TRANSFERS = 4;/, "BODS routing should allow controlled multi-leg transfer paths without falling back to OSM corridors.");
assert.match(appSource, /const BODS_LOOKAHEAD_MINUTES = 240;/, "BODS routing should use the extended timetable look-ahead window.");
assert.match(appSource, /const BODS_MAX_DATASETS = 96;/, "BODS discovery should inspect a broad but capped dataset page.");
assert.match(appSource, /BODS_TIMETABLE_ZONE_MAX_METRICS_PER_BAND = 4500/, "BODS timetable whole-zone geometry should have a hard per-band metric cap.");
assert.match(appSource, /buildBodsReachableRouteMetrics\(cappedStopMetrics, bandSegments, bandTime\)/, "BODS timetable catchments should use reachable route samples rather than drawing boxed link buffers first.");
assert.match(appSource, /buildBodsWholeZoneCatchmentRings\(routeMetrics, searchResult\.originCoordinates\)/, "BODS timetable catchments should draw a coherent origin-connected whole-zone envelope.");
assert.match(appSource, /capPolygonRings\(rings, 1\)/, "BODS timetable whole-zone outputs should keep a single origin-connected component per band.");
assert.match(appSource, /const BUS_MAX_WALK_TO_STOP_DEFAULT_METRES = 400;/, "Default maximum bus stop walk distance should be 400 m.");
assert.match(appSource, /const BUS_MAX_WALK_TO_STOP_MIN_METRES = 50;/, "Bus stop walk distance should have a lower validation bound.");
assert.match(appSource, /const BUS_MAX_WALK_TO_STOP_MAX_METRES = 2000;/, "Bus stop walk distance should have an upper validation bound.");
assert.match(appSource, /const BUS_ACCESS_WALK_DETOUR_FACTOR = 1\.3;/, "Bus access walk detour factor should be defined globally.");
assert.match(appSource, /const BUS_ACCESS_WALK_SPEED_METRES_PER_MINUTE = \(BUS_ACCESS_WALK_SPEED_KPH \* 1000\) \/ 60;/, "Bus access walking speed should remain 80 m per minute.");
assert.match(appSource, /function estimateBusWalkTimeMinutes\(straightLineDistanceMetres\)/, "Shared bus walk time helper should be defined.");
assert.match(appSource, /const MPH_TO_KPH = 1\.609344;/, "mph to kph conversion should use the standard conversion factor.");
assert.match(appSource, /return BUS_DEFAULT_SPEED_KPH;/, "Displayed default mph should resolve back to exactly 18 kph internally.");
assert.doesNotMatch(appSource, /BUS_ASSUMED_SPEED_METRES_PER_MINUTE/, "Bus speed should no longer be fixed at module load.");

assert.match(appSource, /const BUS_SPEED_MODEL_ROAD_TYPE = "road-type";/, "Road-type weighted speed mode should be defined.");
assert.match(appSource, /const BUS_ROAD_TYPE_SPEED_KPH = {/, "Road-type speed profile should be defined.");
assert.match(appSource, /function classifyBusRouteHighwayClass/, "OSM highway classes should be classified for bus timing.");
assert.match(appSource, /function parseOsmMaxspeedToKph/, "OSM maxspeed tags should be parsed for diagnostic/capping use.");
assert.match(
  appSource,
  /async function handleBusSpeedChange\(\)/,
  "Changing bus speed should have a dedicated refresh handler."
);
assert.match(
  appSource,
  /async function handleBusMaxWalkChange\(\)/,
  "Changing maximum walk to bus stop should have a dedicated refresh handler."
);
assert.match(
  appSource,
  /No substitute corridor estimate is shown when BODS timetable generation fails\./,
  "BODS failure states should no longer instruct the user to switch back to an OSM fallback."
);
assert.match(
  appSource,
  /estimateBusWalkTimeMinutes\(distance\)/,
  "BODS timetable initial walk calculations should use the shared straight-line walk helper."
);
assert.match(
  appSource,
  /estimateBusWalkTimeMinutes\(anchor\.straightLineDistanceMetres\)/,
  "Straight-line fallback access walk timing should use the shared walk helper."
);
assert.match(
  appSource,
  /transferWalkEdgeCount/,
  "BODS timetable metadata should include transfer walk edge diagnostics."
);

assert.match(appSource, /BUS_LONG_RUNNING_NOTICE_MS = 45000/, "Bus mode should show a long-running notice before the page appears locked.");
assert.match(
  appSource,
  /Bus isochrone calculation is still running\. Large catchments, lower average bus speeds or complex networks can take several minutes\./,
  "Bus mode should explain long-running calculations clearly."
);
assert.match(appSource, /BUS_RELATION_PAYLOAD_CACHE = new Map\(\)/, "Bus relation payloads should be cached.");
assert.match(appSource, /BUS_RELATION_GEOMETRY_CACHE = new Map\(\)/, "Bus relation geometry should be cached by relation id.");
assert.match(appSource, /BUS_ACCESSIBLE_ROUTES_CACHE = new Map\(\)/, "Prepared accessible bus routes should be cached.");
assert.match(appSource, /BUS_ISOCHRONE_RESULT_CACHE = new Map\(\)/, "Completed bus isochrone results should be cached.");
assert.match(appSource, /BUS_ROUTE_GEOMETRY_INITIAL_CHUNK_SIZE = 6/, "OSM geometry loading should remain tightly capped because it is not the report-output engine.");
assert.match(appSource, /BUS_ROUTE_GEOMETRY_MIN_CHUNK_SIZE = 3/, "Bus geometry loading should retain a safe smaller fallback chunk size.");
assert.match(appSource, /BUS_ROUTE_GEOMETRY_CONCURRENCY = 1/, "Bus geometry loading should use conservative single-worker concurrency.");
assert.doesNotMatch(appSource, /BUS_ROUTE_GEOMETRY_CHUNK_SIZE = 3/, "Bus geometry loading should not use the old fixed small sequential chunk size.");
assert.match(appSource, /function fetchOsmBusRouteGeometryChunkWithFallback/, "Bus geometry loading should split failed large chunks into smaller fallbacks.");
assert.match(appSource, /function logBusGeometryDiagnostics/, "Bus geometry diagnostics should log cache use, timings and fallback behaviour.");
assert.match(appSource, /function selectBalancedOsmBusRouteCandidates/, "Bus route candidates should use balanced geographic selection.");
assert.match(appSource, /function logBusCandidateSelectionDiagnostics/, "Bus candidate diagnostics should be available in development mode.");
assert.match(appSource, /function buildBusCandidateStops/, "Candidate bus stops should be pre-filtered once per calculation.");
assert.match(appSource, /BUS_ACCESS_DISTANCE_CONCURRENCY = 3/, "Bus access routing should use conservative limited concurrency.");
assert.match(appSource, /function yieldToBrowser\(\)/, "Long bus geometry work should yield to the browser.");
assert.doesNotMatch(appSource, /two minutes/i, "User-facing two-minute bus calculation warnings should not be present.");

const fakeElement = (id) => ({
  id,
  value: id === "busSpeedMph" ? "11.1847" : id === "busMaxWalkMetres" ? "400" : "",
  textContent: "",
  innerHTML: "",
  disabled: false,
  style: {},
  className: "",
  classList: { add() {}, remove() {}, toggle() {} },
  setAttribute(name, value) { this[name] = value; },
  addEventListener() {},
  appendChild() {},
  querySelectorAll() { return []; },
});

class SimpleXmlNode {
  constructor(name, attributes = {}) {
    this.name = name;
    this.attributes = attributes;
    this.children = [];
    this.parent = null;
    this.textParts = [];
  }

  appendChild(child) {
    child.parent = this;
    this.children.push(child);
  }

  appendText(text) {
    if (text) {
      this.textParts.push(text);
    }
  }

  get textContent() {
    return `${this.textParts.join("")}${this.children.map((child) => child.textContent).join("")}`;
  }

  getAttribute(name) {
    return this.attributes[name] || "";
  }

  get localName() {
    return this.name.split(":").pop();
  }

  getElementsByTagName(tagName) {
    const matches = [];
    const visit = (node) => {
      node.children.forEach((child) => {
        if (tagName === "*" || child.name === tagName) {
          matches.push(child);
        }
        visit(child);
      });
    };
    visit(this);
    return matches;
  }

  querySelector(selector) {
    return this.getElementsByTagName(selector)[0] || null;
  }
}

class SimpleDOMParser {
  parseFromString(xmlText) {
    const root = new SimpleXmlNode("#document");
    const stack = [root];
    const tokenPattern = /<[^>]+>|[^<]+/g;
    let token;
    while ((token = tokenPattern.exec(xmlText))) {
      const value = token[0];
      if (value.startsWith("<?") || value.startsWith("<!--")) {
        continue;
      }
      if (value.startsWith("</")) {
        if (stack.length > 1) {
          stack.pop();
        }
        continue;
      }
      if (value.startsWith("<")) {
        const selfClosing = /\/>$/.test(value);
        const inner = value.replace(/^</, "").replace(/\/?>$/, "").trim();
        const [name] = inner.split(/\s+/, 1);
        const attributes = {};
        inner.replace(/([A-Za-z_:][\w:.-]*)="([^"]*)"/g, (_match, key, attributeValue) => {
          attributes[key] = attributeValue;
          return "";
        });
        const node = new SimpleXmlNode(name, attributes);
        stack[stack.length - 1].appendChild(node);
        if (!selfClosing) {
          stack.push(node);
        }
        continue;
      }
      stack[stack.length - 1].appendText(value.replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">"));
    }
    return root;
  }
}

const sandbox = {
  window: {
    location: { protocol: "file:", origin: "file://" },
    localStorage: { getItem() { return null; }, setItem() {}, removeItem() {} },
  },
  document: {
    body: { classList: { toggle() {} } },
    getElementById: fakeElement,
    querySelector() { return fakeElement("query"); },
    querySelectorAll() { return []; },
    createElement() { return fakeElement("created"); },
  },
  localStorage: { getItem() { return null; }, setItem() {}, removeItem() {} },
  console,
  URL,
  DOMParser: SimpleDOMParser,
  performance,
  Blob: function Blob() {},
  setTimeout,
  clearTimeout,
  AbortController: class AbortController {
    constructor() {
      this.signal = {};
    }
    abort() {}
  },
  fetch: async () => ({ ok: false, json: async () => ({}) }),
};

vm.createContext(sandbox);
vm.runInContext(
  `${appSource.replace(/\ninit\(\);\s*$/, "")}
  globalThis.__selectBalancedOsmBusRouteCandidates = selectBalancedOsmBusRouteCandidates;
  globalThis.__getBusBearingSector = getBusBearingSector;
  globalThis.__getBusSegmentSpeedKph = getBusSegmentSpeedKph;
  globalThis.__normaliseBusSpeedSettings = normaliseBusSpeedSettings;
  globalThis.__getBusStopSearchRadiusMetres = getBusStopSearchRadiusMetres;
  globalThis.__estimateBusWalkTimeMinutes = estimateBusWalkTimeMinutes;
  globalThis.__BUS_ACCESS_WALK_DETOUR_FACTOR = BUS_ACCESS_WALK_DETOUR_FACTOR;
  globalThis.__BUS_ACCESS_WALK_SPEED_METRES_PER_MINUTE = BUS_ACCESS_WALK_SPEED_METRES_PER_MINUTE;
  globalThis.__parseTransXChangeTimetable = parseTransXChangeTimetable;
  globalThis.__runBodsEarliestArrivalSearch = runBodsEarliestArrivalSearch;
  globalThis.__buildBodsTimetableIsochronesFromSearch = buildBodsTimetableIsochronesFromSearch;
  globalThis.__diagnoseBodsTimetableSearchFailure = diagnoseBodsTimetableSearchFailure;
  globalThis.__buildSparseBodsCatchmentRings = buildSparseBodsCatchmentRings;
  globalThis.__isBodsInitialStopWithinSelectedWalkLimit = isBodsInitialStopWithinSelectedWalkLimit;
  globalThis.__convertBritishNationalGridToWgs84 = convertBritishNationalGridToWgs84;
  globalThis.__buildBodsDatasetQuerySpecs = buildBodsDatasetQuerySpecs;
  globalThis.__selectBodsDatasetQuerySpecsForAttempt = selectBodsDatasetQuerySpecsForAttempt;
  globalThis.__addBodsTransportAreaAliasTerms = addBodsTransportAreaAliasTerms;
  globalThis.__cleanBodsSearchTerm = cleanBodsSearchTerm;
  globalThis.__extractBodsDatasetDownloadUrls = extractBodsDatasetDownloadUrls;
  globalThis.__enrichBodsMissingStopCoordinates = enrichBodsMissingStopCoordinates;
  globalThis.__BODS_STOP_COORDINATE_CACHE = BODS_STOP_COORDINATE_CACHE;
  globalThis.__extractCoordinateFromNaptanPayload = extractCoordinateFromNaptanPayload;
  globalThis.__getNearestBodsStopDistanceMetres = getNearestBodsStopDistanceMetres;
  globalThis.__getNearestRealBodsStopDistanceMetres = getNearestRealBodsStopDistanceMetres;
  globalThis.__countBodsRealLocalStopsNearOrigin = countBodsRealLocalStopsNearOrigin;
  globalThis.__isBodsTimetableModelLocalToOrigin = isBodsTimetableModelLocalToOrigin;
  `,
  sandbox
);

const flatSettings = sandbox.__normaliseBusSpeedSettings(18);
assert.equal(sandbox.__BUS_ACCESS_WALK_DETOUR_FACTOR, 1.3, "Bus access walk detour factor should evaluate to 1.3.");
assert.equal(sandbox.__BUS_ACCESS_WALK_SPEED_METRES_PER_MINUTE, 80, "4.8 kph should evaluate to 80 m per minute.");
assert.ok(Math.abs(sandbox.__estimateBusWalkTimeMinutes(400) - 6.5) < 0.000001, "400 m straight-line bus access walk should evaluate to 6.5 minutes.");
assert.equal(sandbox.__cleanBodsSearchTerm("50"), "", "Short service refs should remain excluded from generic text searches.");
assert.equal(sandbox.__cleanBodsSearchTerm("50", { keepShortCodes: true }), "", "Short service refs should not pollute BODS discovery even when a caller asks to keep short codes.");
const motorwaySegment = sandbox.__getBusSegmentSpeedKph(
  { latitude: 0, longitude: 0, highwayClass: "motorway", maxspeed: "70 mph" },
  { latitude: 0, longitude: 0.01, highwayClass: "motorway", maxspeed: "70 mph" },
  { mode: "road-type", flatSpeedKph: 18, roadTypeSpeedsKph: { motorway: 72, trunk: 55, primary: 38, secondary: 30, tertiary: 26, unclassified: 22, residential: 22, living_street: 12, service: 14, busway: 32, unknown: 18 } }
);
const residentialSegment = sandbox.__getBusSegmentSpeedKph(
  { latitude: 0, longitude: 0, highwayClass: "residential", maxspeed: "20 mph" },
  { latitude: 0, longitude: 0.01, highwayClass: "residential", maxspeed: "20 mph" },
  { mode: "road-type", flatSpeedKph: 18, roadTypeSpeedsKph: { motorway: 72, trunk: 55, primary: 38, secondary: 30, tertiary: 26, unclassified: 22, residential: 22, living_street: 12, service: 14, busway: 32, unknown: 18 } }
);
assert.equal(flatSettings.mode, "flat", "Numeric speed input should preserve flat speed behaviour.");
assert.equal(sandbox.__getBusStopSearchRadiusMetres(400), 700, "400 m maximum walk should use a local pre-filter rather than the old full-band walking radius.");
assert.ok(motorwaySegment.appliedSpeedKph > residentialSegment.appliedSpeedKph, "Road-type mode should apply faster speeds on motorway segments than residential streets.");

const leedsOrigin = { latitude: 53.801672, longitude: -1.548567 };
assert.ok(leedsOrigin.latitude > 53 && leedsOrigin.longitude < -1, "Leeds regression origin should be explicit.");

const localCandidates = Array.from({ length: 70 }, (_, index) => ({
  id: 1000 + index,
  bestStopDistanceMetres: 100 + index,
  score: 100 + index,
  bearing: index % 2 === 0 ? 20 : 70,
  sector: sandbox.__getBusBearingSector(index % 2 === 0 ? 20 : 70),
  routeKey: `local:${index}`,
  name: `Leeds local route ${index}`,
  ref: `L${index}`,
  source: "stop-relation lookup",
}));

const brighouseCandidate = {
  id: 254254,
  bestStopDistanceMetres: 1850,
  score: 1850,
  bearing: 225,
  sector: sandbox.__getBusBearingSector(225),
  routeKey: "ref:254",
  name: "254 Leeds - Brighouse - Halifax",
  ref: "254",
  source: "stop-relation lookup",
};

const selectedCandidates = sandbox.__selectBalancedOsmBusRouteCandidates(
  [...localCandidates, brighouseCandidate],
  60
);
assert.equal(selectedCandidates.length, 60, "Balanced selector should still respect the configured cap.");
assert.ok(
  selectedCandidates.some((candidate) => candidate.id === brighouseCandidate.id),
  "Leeds/Brighouse south-west route candidate should not be dropped purely because nearer local routes fill the cap."
);

const syntheticTxc = `<?xml version="1.0" encoding="UTF-8"?>
<TransXChange>
  <StopPoints>
    <AnnotatedStopPointRef>
      <StopPointRef>STOP1</StopPointRef>
      <CommonName>Origin Stop</CommonName>
      <Location><Latitude>53.800000</Latitude><Longitude>-1.550000</Longitude></Location>
    </AnnotatedStopPointRef>
    <StopPoint id="STOP2">
      <AtcoCode>STOP2</AtcoCode>
      <Descriptor><CommonName>Destination Stop</CommonName></Descriptor>
      <Place><Location><Latitude>53.802000</Latitude><Longitude>-1.548000</Longitude></Location></Place>
    </StopPoint>
  </StopPoints>
  <Lines>
    <Line id="LINE1"><LineName>10</LineName></Line>
  </Lines>
  <JourneyPatternSections>
    <JourneyPatternSection id="JPS1">
      <JourneyPatternTimingLink id="JPTL1">
        <From><StopPointRef>STOP1</StopPointRef></From>
        <To><StopPointRef>STOP2</StopPointRef></To>
        <RunTime>PT5M</RunTime>
      </JourneyPatternTimingLink>
    </JourneyPatternSection>
  </JourneyPatternSections>
  <JourneyPatterns>
    <JourneyPattern id="JP1">
      <JourneyPatternSectionRefs>JPS1</JourneyPatternSectionRefs>
    </JourneyPattern>
  </JourneyPatterns>
  <VehicleJourneys>
    <VehicleJourney>
      <VehicleJourneyCode>VJ1</VehicleJourneyCode>
      <LineRef>LINE1</LineRef>
      <JourneyPatternRef>JP1</JourneyPatternRef>
      <DepartureTime>08:05:00</DepartureTime>
    </VehicleJourney>
  </VehicleJourneys>
</TransXChange>`;

const parsedTxc = sandbox.__parseTransXChangeTimetable(syntheticTxc, "synthetic.xml");
assert.equal(parsedTxc.stops.length, 2, "Synthetic TransXChange should parse two stops.");
assert.equal(parsedTxc.connections.length, 1, "Synthetic TransXChange should parse one stop-to-stop connection.");
assert.ok(parsedTxc.stops.every((stop) => !(stop.latitude === 0 && stop.longitude === 0)), "BODS parser should not create fake Null Island stops.");

const namespacedTxc = `<?xml version="1.0" encoding="UTF-8"?>
<txc:TransXChange xmlns:txc="http://www.transxchange.org.uk/">
  <txc:StopPoints>
    <txc:AnnotatedStopPointRef>
      <txc:StopPointRef>NS1</txc:StopPointRef>
      <txc:CommonName>Namespaced Origin</txc:CommonName>
      <txc:Location><txc:Latitude>53.801000</txc:Latitude><txc:Longitude>-1.548000</txc:Longitude></txc:Location>
    </txc:AnnotatedStopPointRef>
    <txc:AnnotatedStopPointRef>
      <txc:StopPointRef>NS2</txc:StopPointRef>
      <txc:CommonName>Namespaced Destination</txc:CommonName>
      <txc:Location><txc:Latitude>53.803000</txc:Latitude><txc:Longitude>-1.546000</txc:Longitude></txc:Location>
    </txc:AnnotatedStopPointRef>
  </txc:StopPoints>
  <txc:Lines>
    <txc:Line id="NSLINE"><txc:LineName>NS10</txc:LineName></txc:Line>
  </txc:Lines>
  <txc:JourneyPatternSections>
    <txc:JourneyPatternSection id="NSJPS">
      <txc:JourneyPatternTimingLink>
        <txc:From><txc:StopPointRef>NS1</txc:StopPointRef></txc:From>
        <txc:To><txc:StopPointRef>NS2</txc:StopPointRef></txc:To>
        <txc:RunTime>PT6M</txc:RunTime>
      </txc:JourneyPatternTimingLink>
    </txc:JourneyPatternSection>
  </txc:JourneyPatternSections>
  <txc:JourneyPatterns>
    <txc:JourneyPattern id="NSJP"><txc:JourneyPatternSectionRefs>NSJPS</txc:JourneyPatternSectionRefs></txc:JourneyPattern>
  </txc:JourneyPatterns>
  <txc:VehicleJourneys>
    <txc:VehicleJourney>
      <txc:VehicleJourneyCode>NSVJ1</txc:VehicleJourneyCode>
      <txc:LineRef>NSLINE</txc:LineRef>
      <txc:JourneyPatternRef>NSJP</txc:JourneyPatternRef>
      <txc:DepartureTime>08:10:00</txc:DepartureTime>
    </txc:VehicleJourney>
  </txc:VehicleJourneys>
</txc:TransXChange>`;
const namespacedParsedTxc = sandbox.__parseTransXChangeTimetable(namespacedTxc, "namespaced.xml");
assert.equal(namespacedParsedTxc.stops.length, 2, "Namespaced TransXChange should parse stop coordinates by local tag name.");
assert.equal(namespacedParsedTxc.connections.length, 1, "Namespaced TransXChange should parse vehicle journeys and timing links by local tag name.");

const missingCoordinateTxc = `<?xml version="1.0" encoding="UTF-8"?>
<TransXChange>
  <StopPoints>
    <AnnotatedStopPointRef>
      <StopPointRef>MISSING1</StopPointRef>
      <CommonName>Missing Coordinate Stop</CommonName>
      <Location><Latitude></Latitude><Longitude></Longitude></Location>
    </AnnotatedStopPointRef>
  </StopPoints>
</TransXChange>`;
const missingCoordinateParsed = sandbox.__parseTransXChangeTimetable(missingCoordinateTxc, "missing-coordinate.xml");
assert.equal(missingCoordinateParsed.stops.length, 0, "Blank TransXChange latitude/longitude should be rejected rather than parsed as 0,0.");
assert.equal(missingCoordinateParsed.missingCoordinateStops.length, 1, "ATCO/StopPointRef-only stops should be retained for coordinate enrichment.");

const stopPointWithPlaceCoordinateTxc = `<?xml version="1.0" encoding="UTF-8"?>
<TransXChange>
  <StopPoints>
    <StopPoint id="SP1">
      <AtcoCode>450000123</AtcoCode>
      <Descriptor><CommonName>Place Coordinate Stop</CommonName></Descriptor>
      <Place>
        <Location><Latitude>53.8010</Latitude><Longitude>-1.5480</Longitude></Location>
      </Place>
    </StopPoint>
  </StopPoints>
</TransXChange>`;
const stopPointWithPlaceCoordinateParsed = sandbox.__parseTransXChangeTimetable(stopPointWithPlaceCoordinateTxc, "stop-point-place.xml");
assert.equal(stopPointWithPlaceCoordinateParsed.stops.length, 1, "StopPoint elements with nested Place/Location WGS84 coordinates should parse.");
assert.equal(stopPointWithPlaceCoordinateParsed.stops[0].id, "SP1", "StopPoint id attributes should be preserved as the primary stop id.");
assert.ok(stopPointWithPlaceCoordinateParsed.stops[0].latitude > 53 && stopPointWithPlaceCoordinateParsed.stops[0].longitude < -1, "Nested Place/Location coordinates should produce usable WGS84 values.");

const linkOnlyStopRefsTxc = `<?xml version="1.0" encoding="UTF-8"?>
<TransXChange>
  <JourneyPatternSections>
    <JourneyPatternSection id="JPS1">
      <JourneyPatternTimingLink>
        <From><StopPointRef>LINKONLY1</StopPointRef></From>
        <To><StopPointRef>LINKONLY2</StopPointRef></To>
        <RunTime>PT4M</RunTime>
      </JourneyPatternTimingLink>
    </JourneyPatternSection>
  </JourneyPatternSections>
  <JourneyPatterns>
    <JourneyPattern id="JP1">
      <JourneyPatternSectionRef>JPS1</JourneyPatternSectionRef>
    </JourneyPattern>
  </JourneyPatterns>
  <VehicleJourneys>
    <VehicleJourney>
      <JourneyPatternRef>JP1</JourneyPatternRef>
      <LineRef>L1</LineRef>
      <DepartureTime>08:00:00</DepartureTime>
    </VehicleJourney>
  </VehicleJourneys>
</TransXChange>`;
const linkOnlyStopRefsParsed = sandbox.__parseTransXChangeTimetable(linkOnlyStopRefsTxc, "link-only-stop-refs.xml");
assert.equal(linkOnlyStopRefsParsed.connections.length, 1, "Link-only TransXChange stop references should still create timetable links.");
assert.deepEqual(
  Array.from(linkOnlyStopRefsParsed.missingCoordinateStops, (stop) => stop.id).sort(),
  ["LINKONLY1", "LINKONLY2"],
  "StopPointRef values present only in timing links should be retained for coordinate enrichment."
);

const routeLinkGeometryTxc = `<?xml version="1.0" encoding="UTF-8"?>
<TransXChange>
  <StopPoints>
    <AnnotatedStopPointRef>
      <StopPointRef>GEOM1</StopPointRef>
      <CommonName>Geometry Stop One</CommonName>
    </AnnotatedStopPointRef>
    <AnnotatedStopPointRef>
      <StopPointRef>GEOM2</StopPointRef>
      <CommonName>Geometry Stop Two</CommonName>
    </AnnotatedStopPointRef>
  </StopPoints>
  <RouteSections>
    <RouteSection id="RS1">
      <RouteLink id="RL1">
        <From><StopPointRef>GEOM1</StopPointRef></From>
        <To><StopPointRef>GEOM2</StopPointRef></To>
        <Track>
          <Mapping>
            <Location><Translation><Longitude>-1.5480</Longitude><Latitude>53.8010</Latitude></Translation></Location>
            <Location><Translation><Longitude>-1.5400</Longitude><Latitude>53.8060</Latitude></Translation></Location>
          </Mapping>
        </Track>
      </RouteLink>
    </RouteSection>
  </RouteSections>
  <JourneyPatternSections>
    <JourneyPatternSection id="JPS1">
      <JourneyPatternTimingLink>
        <From><StopPointRef>GEOM1</StopPointRef></From>
        <To><StopPointRef>GEOM2</StopPointRef></To>
        <RunTime>PT5M</RunTime>
      </JourneyPatternTimingLink>
    </JourneyPatternSection>
  </JourneyPatternSections>
  <JourneyPatterns>
    <JourneyPattern id="JP1"><JourneyPatternSectionRef>JPS1</JourneyPatternSectionRef></JourneyPattern>
  </JourneyPatterns>
  <VehicleJourneys>
    <VehicleJourney>
      <JourneyPatternRef>JP1</JourneyPatternRef>
      <LineRef>L1</LineRef>
      <DepartureTime>08:00:00</DepartureTime>
    </VehicleJourney>
  </VehicleJourneys>
</TransXChange>`;
const routeLinkGeometryParsed = sandbox.__parseTransXChangeTimetable(routeLinkGeometryTxc, "route-link-geometry.xml");
assert.equal(routeLinkGeometryParsed.stops.length, 2, "BODS stop refs without embedded coordinates should resolve from in-file RouteLink geometry where present.");
assert.equal(routeLinkGeometryParsed.routeLinkCoordinateStopCount, 2, "RouteLink geometry coordinate resolutions should be counted separately from embedded stop coordinates.");
assert.equal(routeLinkGeometryParsed.missingCoordinateStops.length, 0, "RouteLink-resolved stop refs should not remain in the missing-coordinate list.");
assert.ok(routeLinkGeometryParsed.stops.every((stop) => stop.coordinateSource === "route_link_geometry"), "RouteLink-resolved stops should record their coordinate source.");
assert.equal(routeLinkGeometryParsed.parsedRuntimeConnectionCount, 1, "Connections with TransXChange RunTime should be counted as parsed-runtime links.");
assert.equal(routeLinkGeometryParsed.estimatedRuntimeConnectionCount, 0, "Connections with TransXChange RunTime should not be counted as estimated-runtime links.");
assert.ok(routeLinkGeometryParsed.connections[0].geometry.length >= 2, "RouteLink geometry should be attached to the parsed timetable connection.");

const missingRuntimeLongLinkTxc = `<?xml version="1.0" encoding="UTF-8"?>
<TransXChange>
  <StopPoints>
    <AnnotatedStopPointRef>
      <StopPointRef>LONG1</StopPointRef>
      <CommonName>Long Link One</CommonName>
      <Location><Latitude>53.8010</Latitude><Longitude>-1.5480</Longitude></Location>
    </AnnotatedStopPointRef>
    <AnnotatedStopPointRef>
      <StopPointRef>LONG2</StopPointRef>
      <CommonName>Long Link Two</CommonName>
      <Location><Latitude>53.8010</Latitude><Longitude>-1.2480</Longitude></Location>
    </AnnotatedStopPointRef>
  </StopPoints>
  <JourneyPatternSections>
    <JourneyPatternSection id="JPS1">
      <JourneyPatternTimingLink>
        <From><StopPointRef>LONG1</StopPointRef></From>
        <To><StopPointRef>LONG2</StopPointRef></To>
      </JourneyPatternTimingLink>
    </JourneyPatternSection>
  </JourneyPatternSections>
  <JourneyPatterns>
    <JourneyPattern id="JP1"><JourneyPatternSectionRef>JPS1</JourneyPatternSectionRef></JourneyPattern>
  </JourneyPatterns>
  <VehicleJourneys>
    <VehicleJourney>
      <JourneyPatternRef>JP1</JourneyPatternRef>
      <LineRef>L1</LineRef>
      <DepartureTime>08:00:00</DepartureTime>
    </VehicleJourney>
  </VehicleJourneys>
</TransXChange>`;
const missingRuntimeLongLinkParsed = sandbox.__parseTransXChangeTimetable(missingRuntimeLongLinkTxc, "missing-runtime-long-link.xml");
assert.equal(missingRuntimeLongLinkParsed.connections.length, 1, "Missing TransXChange runtime should use a conservative estimated fallback when stop coordinates are available.");
assert.equal(missingRuntimeLongLinkParsed.estimatedRuntimeConnectionCount, 1, "Estimated runtime links should be counted explicitly.");
assert.ok(
  missingRuntimeLongLinkParsed.connections[0].arrivalMinutes - missingRuntimeLongLinkParsed.connections[0].departureMinutes > 20,
  "Long missing-runtime links should not be capped by the old optimistic 20-minute fallback."
);

const implausibleSpeedTxc = missingRuntimeLongLinkTxc.replace(
  "<To><StopPointRef>LONG2</StopPointRef></To>",
  "<To><StopPointRef>LONG2</StopPointRef></To><RunTime>PT5M</RunTime>"
);
const implausibleSpeedParsed = sandbox.__parseTransXChangeTimetable(implausibleSpeedTxc, "implausible-speed.xml");
assert.equal(implausibleSpeedParsed.connections.length, 0, "Parsed BODS links with implausible implied speed should be rejected.");
assert.equal(implausibleSpeedParsed.rejectedImplausibleConnectionCount, 1, "Rejected implausible-speed links should be counted for diagnostics.");

sandbox.__BODS_STOP_COORDINATE_CACHE.set("MISSING1", {
  id: "MISSING1",
  name: "Cached Missing Stop",
  latitude: 53.8012,
  longitude: -1.5481,
  coordinateSource: "test_cache",
});
const cachedEnrichment = await sandbox.__enrichBodsMissingStopCoordinates(
  new Map(missingCoordinateParsed.missingCoordinateStops.map((stop) => [stop.id, stop])),
  new Map(),
  {}
);
assert.equal(cachedEnrichment.resolvedStops.length, 1, "ATCO/StopPointRef-only stops should resolve through cached enrichment metadata.");
assert.equal(cachedEnrichment.unresolvedStopIds.length, 0, "Resolved ATCO-code-only stops should not remain unresolved.");

const unresolvedEnrichment = await sandbox.__enrichBodsMissingStopCoordinates(
  new Map([["UNRESOLVED1", { id: "UNRESOLVED1", name: "Unresolved" }]]),
  new Map(),
  { allowExternalStopEnrichment: false }
);
assert.equal(unresolvedEnrichment.resolvedStops.length, 0, "Unresolved ATCO-code-only stops should not create fake coordinates.");
assert.deepEqual(Array.from(unresolvedEnrichment.unresolvedStopIds), ["UNRESOLVED1"], "Unresolved ATCO-code-only stops should be reported explicitly.");
assert.match(unresolvedEnrichment.warnings.join(" "), /could not be resolved from local or external stop metadata/, "Unresolved stop-coordinate enrichment should return a clear diagnostic warning.");

const naptanPayloadCoordinate = sandbox.__extractCoordinateFromNaptanPayload({
  atcoCode: "4500001",
  location: { easting: 429700, northing: 433800 },
});
assert.ok(naptanPayloadCoordinate.latitude > 53 && naptanPayloadCoordinate.longitude < -1, "NaPTAN enrichment payloads with BNG coordinates should convert to WGS84.");

const convertedLeedsCoordinate = sandbox.__convertBritishNationalGridToWgs84(429700, 433800);
assert.ok(convertedLeedsCoordinate.latitude > 53 && convertedLeedsCoordinate.latitude < 54, "BNG easting/northing should convert to a plausible Leeds latitude.");
assert.ok(convertedLeedsCoordinate.longitude > -2 && convertedLeedsCoordinate.longitude < -1, "BNG easting/northing should convert to a plausible Leeds longitude.");

const bngTxc = `<?xml version="1.0" encoding="UTF-8"?>
<TransXChange>
  <StopPoints>
    <AnnotatedStopPointRef>
      <StopPointRef>BNG1</StopPointRef>
      <CommonName>BNG Stop</CommonName>
      <Location><Easting>429700</Easting><Northing>433800</Northing></Location>
    </AnnotatedStopPointRef>
  </StopPoints>
</TransXChange>`;
const bngParsed = sandbox.__parseTransXChangeTimetable(bngTxc, "bng.xml");
assert.equal(bngParsed.stops.length, 1, "BODS parser should support stops supplied with British National Grid coordinates.");
assert.ok(bngParsed.stops[0].latitude > 53 && bngParsed.stops[0].longitude < -1, "BNG stop should parse to plausible WGS84 coordinates.");

const timetable = {
  stops: parsedTxc.stops,
  stopsById: new Map(parsedTxc.stops.map((stop) => [stop.id, stop])),
  connections: parsedTxc.connections,
};
const bodsBands = [{ label: "15 min", time: 15, fill: "#2f80ed" }];
const bodsOrigin = { latitude: 53.8, longitude: -1.55 };
const bodsSearch = sandbox.__runBodsEarliestArrivalSearch(timetable, bodsOrigin, bodsBands, 15, 400, 8 * 60);
assert.ok(bodsSearch.reachableSegments.length > 0, "Synthetic BODS timetable should produce a reachable scheduled segment.");
const bodsIsochrones = sandbox.__buildBodsTimetableIsochronesFromSearch(bodsSearch, bodsBands);
assert.ok(bodsIsochrones.length > 0, "Synthetic BODS timetable should produce a drawable catchment.");
assert.ok(bodsIsochrones[0].geometry.coordinates.length > 0, "Synthetic BODS catchment should include polygon geometry.");

const defaultLeedsAccessOrigin = { latitude: 53.801155, longitude: -1.54786 };
const defaultBodsBands = [
  { label: "15 min", time: 15, fill: "#2f80ed" },
  { label: "30 min", time: 30, fill: "#27ae60" },
  { label: "45 min", time: 45, fill: "#f2c94c" },
  { label: "60 min", time: 60, fill: "#eb5757" },
];
const defaultScenarioSearch = sandbox.__runBodsEarliestArrivalSearch(timetable, defaultLeedsAccessOrigin, defaultBodsBands, 60, 400, 8 * 60);
assert.ok(defaultScenarioSearch.reachableSegments.length > 0, "Default Leeds BODS settings should allow a valid boardable scheduled movement when a matching timetable is parsed.");
assert.ok(
  sandbox.__buildBodsTimetableIsochronesFromSearch(defaultScenarioSearch, defaultBodsBands).length > 0,
  "Default Leeds BODS settings should draw a catchment when reachable timetable movement exists."
);

const leedsToHorsforthStops = [
  { id: "CIVIC_O", name: "Civic O", latitude: 53.80165, longitude: -1.55105 },
  { id: "KIRKSTALL", name: "Kirkstall Abbey", latitude: 53.82042, longitude: -1.60415 },
  { id: "HORSFORTH_SCHOOL", name: "Horsforth School", latitude: 53.83575, longitude: -1.64188 },
];
const leedsToHorsforthTimetable = {
  stops: leedsToHorsforthStops,
  stopsById: new Map(leedsToHorsforthStops.map((stop) => [stop.id, stop])),
  connections: [
    {
      fromStopId: "CIVIC_O",
      toStopId: "KIRKSTALL",
      departureMinutes: 9 * 60 + 17,
      arrivalMinutes: 9 * 60 + 30,
      routeRef: "50",
      tripId: "route-50-test",
      geometry: [leedsToHorsforthStops[0], leedsToHorsforthStops[1]],
    },
    {
      fromStopId: "KIRKSTALL",
      toStopId: "HORSFORTH_SCHOOL",
      departureMinutes: 9 * 60 + 30,
      arrivalMinutes: 9 * 60 + 44,
      routeRef: "50",
      tripId: "route-50-test",
      geometry: [leedsToHorsforthStops[1], leedsToHorsforthStops[2]],
    },
  ],
};
const leedsToHorsforthSearch = sandbox.__runBodsEarliestArrivalSearch(leedsToHorsforthTimetable, defaultLeedsAccessOrigin, defaultBodsBands, 60, 400, 9 * 60 + 11);
assert.equal(leedsToHorsforthSearch.initialStopsWithinMaxWalkCount, 1, "Default Leeds access point should be able to board at nearby Civic O within the 400 m maximum walk setting.");
assert.ok(
  leedsToHorsforthSearch.earliestByStop.some((entry) => entry.stop.id === "HORSFORTH_SCHOOL" && entry.earliestArrival <= 9 * 60 + 44),
  "The BODS earliest-arrival engine should reach Horsforth School inside the expected 45 minute band when the route 50 timetable is present."
);
assert.ok(
  leedsToHorsforthSearch.reachableStopsByBand[45] >= 3,
  "A parsed route 50-style timetable should put Horsforth within the 45 minute BODS band from the default Leeds origin."
);

const noInitialStopsSearch = sandbox.__runBodsEarliestArrivalSearch(timetable, { latitude: 54.8, longitude: -2.55 }, bodsBands, 15, 50, 8 * 60);
const noInitialStopsDiagnostic = sandbox.__diagnoseBodsTimetableSearchFailure(noInitialStopsSearch);
assert.equal(noInitialStopsDiagnostic.stage, "no_stops_within_max_walk", "No nearby initial stops should produce the max-walk diagnostic.");
assert.ok(
  noInitialStopsDiagnostic.message.startsWith("No BODS timetable stops were found within the selected maximum walk-to-bus-stop distance."),
  "No nearby initial stops should use the agreed user-facing message."
);
assert.match(noInitialStopsDiagnostic.message, /nearest parsed BODS timetable stop/i, "No-stop diagnostics should report the nearest parsed BODS timetable stop.");
assert.equal(sandbox.__isBodsInitialStopWithinSelectedWalkLimit(390, 400), true, "A stop 390 m straight-line from the origin should be eligible for a 400 m maximum walk setting.");
assert.equal(sandbox.__isBodsInitialStopWithinSelectedWalkLimit(410, 400), false, "A stop 410 m straight-line from the origin should not be eligible for a 400 m maximum walk setting.");
assert.equal(
  sandbox.__isBodsInitialStopWithinSelectedWalkLimit(sandbox.__estimateBusWalkTimeMinutes(390) * sandbox.__BUS_ACCESS_WALK_SPEED_METRES_PER_MINUTE, 400),
  false,
  "The detoured 390 m equivalent exceeds 400 m, proving eligibility must not use the detour-adjusted distance."
);

const farAwayBodsTimetable = {
  stops: [{ id: "FAR1", name: "Far stop", latitude: 53.75, longitude: -1.9 }],
  stopsById: new Map(),
  connections: [],
};
const reportedLiverpoolOrigin = { latitude: 53.34235841866903, longitude: -2.879574852635689 };
const farAwayDistance = sandbox.__getNearestBodsStopDistanceMetres(farAwayBodsTimetable.stops, reportedLiverpoolOrigin);
assert.ok(farAwayDistance > 79000 && farAwayDistance < 80000, "Mock non-local BODS dataset should be approximately 79 km from the selected origin.");
assert.equal(
  sandbox.__isBodsTimetableModelLocalToOrigin(farAwayBodsTimetable, reportedLiverpoolOrigin, 400),
  false,
  "BODS datasets with nearest parsed stops around 79 km away should be rejected as non-local rather than treated as a walk-distance issue."
);

const noLaterDeparturesSearch = sandbox.__runBodsEarliestArrivalSearch(timetable, bodsOrigin, bodsBands, 15, 400, 9 * 60);
const noLaterDeparturesDiagnostic = sandbox.__diagnoseBodsTimetableSearchFailure(noLaterDeparturesSearch);
assert.equal(noLaterDeparturesDiagnostic.stage, "no_departures_after_selected_time", "No later departures should produce a specific no-departures diagnostic.");

const clippedBandIsochrones = sandbox.__buildBodsTimetableIsochronesFromSearch({
  originCoordinates: { latitude: 53.801, longitude: -1.548 },
  departureMinutes: 8 * 60,
  reachableSegments: [{
    startCoordinate: { latitude: 53.801, longitude: -1.548 },
    endCoordinate: { latitude: 53.801, longitude: -1.248 },
    elapsedTimeAtStart: 10,
    elapsedTimeAtEnd: 30,
    routeGeometry: [],
    estimatedRuntime: false,
  }],
  earliestByStop: [],
}, [{ label: "15 min", time: 15, fill: "#2f80ed" }]);
assert.ok(clippedBandIsochrones.length > 0, "Band-edge crossing BODS segments should still draw a clipped catchment.");
assert.ok(
  clippedBandIsochrones[0].geometry.coordinates.flat(2).every((point) => point[0] < -1.45),
  "Band-edge clipping should not include the full end stop or full segment before the band threshold is reached."
);

const manyBodsSearchTerms = Array.from({ length: 12 }, (_, index) => ({ value: `Leeds ${index}`, source: "test", normalised: `leeds ${index}` }));
const selectedBodsQuerySpecs = sandbox.__selectBodsDatasetQuerySpecsForAttempt(sandbox.__buildBodsDatasetQuerySpecs(manyBodsSearchTerms));
assert.ok(selectedBodsQuerySpecs.some((spec) => spec.key === "fallback:published"), "BODS dataset discovery should always include the published fallback query.");
assert.ok(selectedBodsQuerySpecs.some((spec) => spec.key === "fallback:any-status"), "BODS dataset discovery should always include the no-status fallback query.");
assert.ok(selectedBodsQuerySpecs.some((spec) => spec.includeStatus === false), "BODS dataset discovery should retry queries without the status filter.");

const aliasedBodsSearchTerms = [
  { value: "Liverpool City Council", source: "test", normalised: "liverpool city council" },
  { value: "Leeds City Council", source: "test", normalised: "leeds city council" },
  { value: "Sefton Council", source: "test-origin-53.55660,-3.06206", normalised: "sefton council" },
];
sandbox.__addBodsTransportAreaAliasTerms(aliasedBodsSearchTerms, (value, source) => {
  const normalised = value.toLowerCase();
  if (!aliasedBodsSearchTerms.some((term) => term.normalised === normalised)) {
    aliasedBodsSearchTerms.push({ value, source, normalised });
  }
});
assert.ok(aliasedBodsSearchTerms.some((term) => term.value === "Merseyside"), "Liverpool BODS searches should include the wider Merseyside transport area.");
assert.ok(aliasedBodsSearchTerms.some((term) => term.value === "West Yorkshire"), "Leeds BODS searches should include the wider West Yorkshire transport area.");
assert.ok(aliasedBodsSearchTerms.some((term) => term.value === "Liverpool City Region"), "Sefton BODS searches should include Liverpool City Region so later local query specs can be tried for 53.55660, -3.06206.");
const seftonProgressiveSpecs = sandbox.__buildBodsDatasetQuerySpecs(aliasedBodsSearchTerms);
assert.ok(seftonProgressiveSpecs.some((spec) => spec.value === "Merseyside"), "Progressive BODS query specs should include Merseyside after Sefton/local authority terms.");
assert.ok(seftonProgressiveSpecs.some((spec) => spec.kind === "fallback"), "Progressive BODS query specs should retain fallback queries if local query specs do not yield a usable local timetable.");
assert.match(appSource, /async function fetchLocalBodsTimetableModelProgressively/, "BODS timetable mode should use progressive per-querySpec metadata/download/parse/locality search.");
assert.match(appSource, /for \(let index = 0; index < querySpecs\.length; index \+= 1\)/, "Progressive BODS search should iterate all query specs, not stop at the old attempt limit.");
assert.doesNotMatch(appSource, /querySpec\.kind === "fallback" && recordsSoFar\.length > 0/, "BODS fallback queries should not be skipped merely because metadata records exist.");
assert.doesNotMatch(appSource, /Math\.max\(2,\s*Math\.min\(20,\s*Math\.round\(distance \/ 300\)\)\)/, "BODS timetable parsing should not use the old optimistic capped runtime fallback.");
assert.match(appSource, /BODS_MAX_IMPLAUSIBLE_SPEED_KPH = 130/, "BODS timetable parsing should reject implausibly fast links using a global speed threshold while allowing urban express links.");
assert.match(appSource, /bodsSelectedQuerySpecs/, "BODS method diagnostics should report all selected query specs merged into the local timetable model.");
assert.match(appSource, /bodsEstimatedRuntimeConnectionCount/, "BODS method diagnostics should report estimated-runtime link counts.");
assert.match(appSource, /bodsRejectedImplausibleConnectionCount/, "BODS method diagnostics should report rejected implausible-speed link counts.");

const extractedDownloadUrls = sandbox.__extractBodsDatasetDownloadUrls({
  results: [
    { id: 12345, url: "/api/v1/dataset/12345/" },
    { downloadUrl: "/api/v1/dataset/67890/download/" },
  ],
});
assert.ok(
  extractedDownloadUrls.includes("https://data.bus-data.dft.gov.uk/api/v1/dataset/12345/download/"),
  "BODS dataset ids should produce candidate download URLs."
);
assert.ok(
  extractedDownloadUrls.includes("https://data.bus-data.dft.gov.uk/api/v1/dataset/67890/download/"),
  "BODS relative download URLs should be normalised to absolute URLs."
);

assert.match(appSource, /async function fetchBodsTimetableIsochronesForScenario/, "BODS timetable fetcher should be implemented.");
assert.match(appSource, /function runBodsEarliestArrivalSearch/, "BODS earliest-arrival search should be implemented.");
assert.match(appSource, /BODS_API_KEY/, "Worker/client code should reference the BODS API key pathway without exposing a key.");
assert.match(appSource, /bodsDatasetQueryParametersUsed/, "BODS debug metadata should include dataset query parameters used.");
assert.match(appSource, /bodsParseFailureCount/, "BODS debug metadata should include parse failure count.");
assert.match(appSource, /bodsDiagnosticStage/, "BODS unavailable-result metadata should preserve the specific diagnostic stage.");
assert.match(appSource, /bodsSelectedQuerySpecs/, "BODS diagnostics should record the selected dataset query specs.");
assert.match(appSource, /bodsDatasetRecordCount/, "BODS diagnostics should record returned BODS dataset record counts.");
assert.match(appSource, /bodsLocalDatasetCount/, "BODS diagnostics should record local accepted dataset counts.");
assert.match(appSource, /bodsNearestRealParsedStopDistanceMetres/, "BODS diagnostics should record nearest real parsed stop proximity.");
assert.match(appSource, /reachableStopsByBand/, "BODS diagnostics should record reachable stop counts by band.");
assert.match(appSource, /reachableConnectionsByBand/, "BODS diagnostics should record reachable connection counts by band.");
assert.match(appSource, /BODS_CACHE_SCHEMA_VERSION = "v73-bods-default-fast-osm-guard"/, "BODS cache keys should be schema-busted for the BODS-default OSM-guarded model.");
assert.match(appSource, /BODS_ORIGIN_ROUTE_HINT_RADIUS_METRES = 0/, "BODS discovery should disable broad OSM route-relation hints for report output.");
assert.match(appSource, /BODS_MAX_ORIGIN_ROUTE_HINTS = 0/, "BODS discovery should not add route-ref or destination-based relation hints by default.");
assert.match(appSource, /function shouldUseBodsDatasetFreeTextSearchTerm/, "BODS dataset search should explicitly filter unsafe free-text terms.");
assert.match(appSource, /nearby-origin-stop-atco/, "BODS search terms should include nearby OSM/NaPTAN ATCO stop codes before wider authority terms.");
assert.match(appSource, /BODS_AUTHORITY_ADMIN_AREA_CODE_RULES/, "BODS discovery should prioritise reliable numeric adminArea codes from known authority context.");
assert.match(appSource, /countBodsRealLocalStopsNearOrigin/, "BODS local dataset acceptance should require real local stops, not only injected origin-stop matches.");
assert.doesNotMatch(appSource, /slice\(0,\s*30\)/, "BODS NaPTAN enrichment should not retain the old first-30-unresolved-stops cap.");
assert.match(appSource, /no_downloadable_dataset_urls/, "BODS diagnostics should distinguish zero records from missing dataset download URLs.");
assert.doesNotMatch(appSource, /searchParams\.set\(["']boundingBox["']/, "BODS timetable dataset queries should not reintroduce boundingBox.");

const realLocalStops = [
  { id: "SYNTH", name: "Injected stop", latitude: 53.8, longitude: -1.55, coordinateSource: "nearby_origin_stop_code_match" },
  { id: "REAL", name: "Real stop", latitude: 53.80001, longitude: -1.55001, coordinateSource: "naptan_api" },
];
assert.equal(
  sandbox.__countBodsRealLocalStopsNearOrigin(realLocalStops, { latitude: 53.8, longitude: -1.55 }, 50),
  1,
  "BODS local dataset acceptance should count real nearby stops but ignore synthetic injected origin stops."
);
assert.ok(
  sandbox.__getNearestRealBodsStopDistanceMetres(realLocalStops, { latitude: 53.8, longitude: -1.55 }) < 5,
  "BODS diagnostics should retain the nearest real parsed stop distance near the origin."
);
