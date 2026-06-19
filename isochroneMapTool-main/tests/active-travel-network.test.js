import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import vm from "node:vm";

const projectRoot = dirname(dirname(fileURLToPath(import.meta.url)));
const appSource = readFileSync(join(projectRoot, "app.nokeybus.v46.js"), "utf8");
const htmlSource = readFileSync(join(projectRoot, "index.html"), "utf8");

assert.match(htmlSource, /Draw walking path/, "Manual walking path tool should be present in the UI.");
assert.match(htmlSource, /Draw cycling path/, "Manual cycling path tool should be present in the UI.");
assert.match(htmlSource, /Draw isochrone exclusion area/, "Isochrone exclusion tool should be present in the UI.");
assert.match(appSource, /async function fetchLocalActiveTravelIsochronesForScenario/, "Walking/cycling modes should use the local active travel network builder.");
assert.match(appSource, /return await fetchLocalActiveTravelIsochronesForScenario\(originCoordinates, mode, options\);/, "Walking/cycling isochrone fetch should route through the local network engine.");
assert.match(appSource, /Dedicated pedestrian links and tagged sidewalks are used directly; ordinary local roads are permitted on a planning-style permissive basis unless restricted/, "Walking methodology note should describe the local permissive pavement-aware network rules.");
assert.match(appSource, /async function finishCurrentDrawing\(/, "Saving a manual drawing should support an async recalc flow.");
assert.match(appSource, /refreshCurrentIsochronesAfterManualOverlayChange\(/, "Manual network edits should be able to trigger an isochrone refresh.");
assert.match(appSource, /elements\.cancelDrawingButton\.disabled = !state\.activeDrawingTool && state\.draftDrawingPoints\.length === 0;/, "Cancel drawing should remain available as soon as a drawing tool is active.");
assert.match(appSource, /deactivateDrawingTool\(true\);\s+setStatus\("Drawing cancelled"/, "Cancelling a drawing should close the active drawing tool as well as clearing draft points.");
assert.match(appSource, /state\.draftDrawingPoints\.length === 0 &&\s+!state\.activeDrawingTool;/, "Clear all manual edits should remain available when a drawing tool is active with no draft points.");
assert.match(appSource, /const hadDraft = state\.draftDrawingPoints\.length > 0 \|\| Boolean\(state\.activeDrawingTool\);/, "Clear all manual edits should treat an active drawing tool as draft state.");
assert.match(appSource, /document\.addEventListener\("keydown", onDocumentKeyDown\);/, "Manual editing should support a keyboard escape route.");
assert.match(appSource, /event\.key !== "Escape"[\s\S]*cancelCurrentDrawing\(\);/, "Escape should cancel active drawing without requiring a toolbar click.");

const fakeElement = (id) => ({
  id,
  value: id === "busSpeedMph" ? "11.1847" : id === "busMaxWalkMetres" ? "400" : "",
  textContent: "",
  innerHTML: "",
  disabled: false,
  style: {},
  className: "",
  classList: { add() {}, remove() {}, toggle() {}, contains() { return false; } },
  setAttribute(name, value) { this[name] = value; },
  addEventListener() {},
  appendChild() {},
  querySelectorAll() { return []; },
});

const sandbox = {
  window: {
    location: { protocol: "file:", origin: "file://" },
    localStorage: { getItem() { return null; }, setItem() {}, removeItem() {} },
  },
  document: {
    body: { classList: { toggle() {} } },
    getElementById: fakeElement,
    querySelectorAll() { return []; },
    createElement() { return fakeElement("created"); },
  },
  localStorage: { getItem() { return null; }, setItem() {}, removeItem() {} },
  console,
  URL,
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
  globalThis.__state = state;
  globalThis.__isOsmWayWalkable = isOsmWayWalkable;
  globalThis.__isOsmWayCyclable = isOsmWayCyclable;
  globalThis.__createEmptyActiveTravelGraph = createEmptyActiveTravelGraph;
  globalThis.__cloneActiveTravelGraph = cloneActiveTravelGraph;
  globalThis.__addGraphNode = addGraphNode;
  globalThis.__addGraphEdge = addGraphEdge;
  globalThis.__buildActiveTravelGraphFromOverpassPayload = buildActiveTravelGraphFromOverpassPayload;
  globalThis.__applyManualActiveTravelEditsToGraph = applyManualActiveTravelEditsToGraph;
  globalThis.__runGraphDijkstra = runGraphDijkstra;
  globalThis.__buildManualOverlayLegendRows = buildManualOverlayLegendRows;
  globalThis.__buildIsochroneExclusionBoundaryMarkup = buildIsochroneExclusionBoundaryMarkup;
  globalThis.__clusterCoordinatesByDistance = clusterCoordinatesByDistance;
  `,
  sandbox
);

assert.equal(
  sandbox.__isOsmWayWalkable({ highway: "primary" }),
  false,
  "Primary roads without tagged sidewalks should not be treated as walkable."
);
assert.equal(
  sandbox.__isOsmWayWalkable({ highway: "primary", sidewalk: "both" }),
  true,
  "Primary roads with tagged sidewalks should be treated as walkable."
);
assert.equal(
  sandbox.__isOsmWayWalkable({ highway: "residential" }),
  true,
  "Residential roads should remain walkable on the planning-style permissive basis."
);
assert.equal(
  sandbox.__isOsmWayCyclable({ highway: "residential" }),
  true,
  "Residential roads should remain cyclable unless explicitly restricted."
);

const graph = sandbox.__createEmptyActiveTravelGraph("walking");
const nodeA = sandbox.__addGraphNode(graph, { latitude: 53.8, longitude: -1.55 }, "a");
const nodeB = sandbox.__addGraphNode(graph, { latitude: 53.8, longitude: -1.549 }, "b");
sandbox.__addGraphEdge(graph, nodeA, nodeB, {
  lengthMetres: 70,
  bidirectional: true,
  sourceType: "osm",
  highway: "residential",
});

sandbox.__state.manualLineEdits = [
  {
    id: 1,
    type: "walking-path",
    displayName: "Manual path",
    points: [
      { latitude: 53.8001, longitude: -1.5489 },
      { latitude: 53.8003, longitude: -1.5487 },
    ],
  },
  {
    id: 2,
    type: "barrier-line",
    displayName: "Barrier",
    points: [
      { latitude: 53.7997, longitude: -1.5495 },
      { latitude: 53.8003, longitude: -1.5495 },
    ],
  },
  {
    id: 3,
    type: "bridge-crossing",
    displayName: "Bridge",
    points: [
      { latitude: 53.7999, longitude: -1.5496 },
      { latitude: 53.8001, longitude: -1.5494 },
    ],
  },
];

sandbox.__applyManualActiveTravelEditsToGraph(graph, "walking");

assert.ok(
  graph.edges.some((edge) => edge.sourceType === "manual" && edge.manualType === "walking-path" && edge.active !== false),
  "Manual walking paths should add active edges into the local walking graph."
);
assert.ok(
  graph.edges.some((edge) => edge.sourceType === "osm" && edge.active === false),
  "Barrier lines should deactivate crossing OSM edges in the local walking graph."
);
assert.ok(
  graph.edges.some((edge) => edge.sourceType === "manual" && edge.manualType === "bridge-crossing" && edge.active !== false),
  "Manual bridge/crossing links should remain active even where a barrier line is present."
);

const crossingGraph = sandbox.__createEmptyActiveTravelGraph("walking");
const crossingA = sandbox.__addGraphNode(crossingGraph, { latitude: 53.8, longitude: -1.5505 }, "ca");
const crossingB = sandbox.__addGraphNode(crossingGraph, { latitude: 53.8, longitude: -1.5495 }, "cb");
sandbox.__addGraphEdge(crossingGraph, crossingA, crossingB, {
  lengthMetres: 68,
  bidirectional: true,
  sourceType: "osm",
  highway: "residential",
});
sandbox.__state.manualLineEdits = [
  {
    id: 10,
    type: "walking-path",
    displayName: "Crossing manual path",
    points: [
      { latitude: 53.8009, longitude: -1.55 },
      { latitude: 53.7991, longitude: -1.55 },
    ],
  },
];
sandbox.__applyManualActiveTravelEditsToGraph(crossingGraph, "walking");
assert.ok(
  crossingGraph.edges.some((edge) => edge.sourceType === "snap" && edge.active !== false),
  "Coarsely drawn manual paths should sample intermediate points and snap into crossed network edges."
);
assert.ok(
  crossingGraph.edges.some((edge) => edge.sourceType === "osm" && edge.active === false),
  "Snapped manual paths should split long crossed edges at the join point rather than only linking to the original edge ends."
);
assert.ok(
  crossingGraph.edges.some((edge) => edge.sourceType === "snap" && edge.lengthMetres < 60),
  "Snapped manual paths should create short local join links into crossed roads."
);

sandbox.__state.manualLineEdits = [
  {
    id: 11,
    type: "walking-path",
    displayName: "Named walking route",
    showInLegend: true,
    points: [
      { latitude: 53.8, longitude: -1.55 },
      { latitude: 53.8002, longitude: -1.5498 },
    ],
  },
  {
    id: 12,
    type: "cycling-path",
    displayName: "Hidden cycle route",
    showInLegend: false,
    points: [
      { latitude: 53.8, longitude: -1.55 },
      { latitude: 53.8002, longitude: -1.5495 },
    ],
  },
];
sandbox.__state.isochroneExclusionAreas = [
  {
    id: 13,
    type: "exclusion-area",
    displayName: "Mask zone",
    showInLegend: true,
    points: [
      { latitude: 53.8, longitude: -1.55 },
      { latitude: 53.8001, longitude: -1.5499 },
      { latitude: 53.8002, longitude: -1.55 },
    ],
  },
];
const manualLegendRows = sandbox.__buildManualOverlayLegendRows();
assert.deepEqual(
  Array.from(manualLegendRows, (row) => row.name),
  ["Named walking route", "Mask zone"],
  "Manual overlay legend rows should use saved overlay names and omit entries hidden from the legend."
);

const exclusionBoundaryMarkup = sandbox.__buildIsochroneExclusionBoundaryMarkup(
  [{ pathMarkup: "M0 0 L10 0 L10 10 L0 10 Z", color: "#ff0000", clipPathId: "isochrone-band-0" }],
  [{
    points: [
      { latitude: 53.8, longitude: -1.55 },
      { latitude: 53.8001, longitude: -1.5499 },
      { latitude: 53.8002, longitude: -1.55 },
    ],
  }],
  { zoom: 14, topLeft: { x: 0, y: 0 } }
);
assert.match(exclusionBoundaryMarkup, /clipPath id=\"isochrone-band-0\"/, "Exclusion boundaries should be clipped to the original isochrone area.");
assert.doesNotMatch(exclusionBoundaryMarkup, /stroke-dasharray/, "Exclusion boundaries should no longer use the old dashed outline styling.");

const routingGraph = sandbox.__createEmptyActiveTravelGraph("walking");
const routingA = sandbox.__addGraphNode(routingGraph, { latitude: 53.8, longitude: -1.55 }, "ra");
const routingB = sandbox.__addGraphNode(routingGraph, { latitude: 53.8, longitude: -1.5495 }, "rb");
const routingC = sandbox.__addGraphNode(routingGraph, { latitude: 53.8003, longitude: -1.5495 }, "rc");
sandbox.__addGraphEdge(routingGraph, routingA, routingB, {
  lengthMetres: 40,
  bidirectional: true,
  sourceType: "osm",
  highway: "residential",
});
sandbox.__addGraphEdge(routingGraph, routingB, routingC, {
  lengthMetres: 35,
  bidirectional: true,
  sourceType: "osm",
  highway: "residential",
});

const distances = sandbox.__runGraphDijkstra(routingGraph, routingA);
assert.equal(Math.round(distances.get(routingC)), 75, "Local walking graph distances should accumulate across connected edges.");

const stitchedGraph = sandbox.__buildActiveTravelGraphFromOverpassPayload({
  elements: [
    { type: "node", id: 1, lat: 53.8, lon: -1.5505 },
    { type: "node", id: 2, lat: 53.8, lon: -1.5495 },
    { type: "node", id: 3, lat: 53.8004, lon: -1.55 },
    { type: "node", id: 4, lat: 53.8, lon: -1.55 },
    { type: "way", id: 101, nodes: [1, 2], tags: { highway: "primary" } },
    { type: "way", id: 102, nodes: [3, 4], tags: { highway: "residential" } },
  ],
}, "cycling");
const stitchedStart = "3";
const stitchedDistances = sandbox.__runGraphDijkstra(stitchedGraph, stitchedStart);
assert.ok(
  Number.isFinite(stitchedDistances.get("2")),
  "Cycling graph assembly should stitch a side road node into a nearby cyclable road segment when OSM geometry is slightly under-noded."
);
assert.ok(
  stitchedGraph.edges.some((edge) => edge.sourceType === "stitch" && edge.active !== false),
  "Cycling graph assembly should create stitch edges to bridge small network discontinuities."
);

const cloneSourceGraph = sandbox.__createEmptyActiveTravelGraph("cycling");
const cloneNodeA = sandbox.__addGraphNode(cloneSourceGraph, { latitude: 53.8, longitude: -1.55 }, "clone-a");
const cloneNodeB = sandbox.__addGraphNode(cloneSourceGraph, { latitude: 53.8002, longitude: -1.5498 }, "clone-b");
sandbox.__addGraphEdge(cloneSourceGraph, cloneNodeA, cloneNodeB, {
  lengthMetres: 30,
  bidirectional: true,
  sourceType: "osm",
  highway: "residential",
});
const clonedGraph = sandbox.__cloneActiveTravelGraph(cloneSourceGraph);
clonedGraph.edges[0].active = false;
assert.notEqual(
  cloneSourceGraph.edges[0].active,
  false,
  "Cloning the cached active travel graph should isolate later manual edits and routing mutations."
);

const clustered = sandbox.__clusterCoordinatesByDistance([
  { latitude: 53.8, longitude: -1.55 },
  { latitude: 53.80003, longitude: -1.55002 },
  { latitude: 53.801, longitude: -1.549 },
], 12);
assert.equal(
  clustered.length,
  2,
  "Spatial clustering should still group nearby coordinates without merging distinct clusters."
);
