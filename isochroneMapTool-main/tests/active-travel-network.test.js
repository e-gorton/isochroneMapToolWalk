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
  globalThis.__addGraphNode = addGraphNode;
  globalThis.__addGraphEdge = addGraphEdge;
  globalThis.__applyManualActiveTravelEditsToGraph = applyManualActiveTravelEditsToGraph;
  globalThis.__runGraphDijkstra = runGraphDijkstra;
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
