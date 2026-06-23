const CATEGORY_OPTIONS = [
  "Bus stop",
  "Rail station",
  "School",
  "Healthcare",
  "Retail",
  "Food and drink",
  "Community",
  "Worship",
  "Open space",
  "Settlement",
  "Education",
  "Employment",
];

const SYMBOL_OPTIONS = [
  "circle",
  "square",
  "diamond",
  "triangle",
  "cross",
  "hex",
  "star",
  "pentagon",
  "ring",
];

const MANUAL_OVERLAY_STORAGE_KEY = "prime-isochrone-manual-overlays";

const DRAWING_TOOL_CONFIG = {
  "walking-path": {
    geometryType: "line",
    overlayType: "walking-path",
    displayName: "Proposed walking path",
    legendName: "Proposed walking path",
    stroke: "#2f8f4e",
    dasharray: "",
    strokeWidth: 5,
  },
  "cycling-path": {
    geometryType: "line",
    overlayType: "cycling-path",
    displayName: "Proposed cycling path",
    legendName: "Proposed cycling path",
    stroke: "#1f6ed4",
    dasharray: "",
    strokeWidth: 5,
  },
  "shared-path": {
    geometryType: "line",
    overlayType: "shared-path",
    displayName: "Proposed shared walking/cycling path",
    legendName: "Proposed shared walking/cycling path",
    stroke: "#178b8b",
    dasharray: "11 6",
    strokeWidth: 5,
  },
  "bridge-crossing": {
    geometryType: "line",
    overlayType: "bridge-crossing",
    displayName: "Proposed bridge or crossing link",
    legendName: "Proposed bridge or crossing link",
    stroke: "#7b4cc2",
    dasharray: "8 6",
    strokeWidth: 5,
  },
  "barrier-line": {
    geometryType: "line",
    overlayType: "barrier-line",
    displayName: "No walking/cycling barrier",
    legendName: "No walking/cycling barrier",
    stroke: "#c23b3b",
    dasharray: "9 6",
    strokeWidth: 4,
  },
  "exclusion-area": {
    geometryType: "polygon",
    overlayType: "exclusion-area",
    displayName: "Isochrone removed area",
    legendName: "Isochrone removed area",
    stroke: "#8f2d2d",
    dasharray: "10 7",
    strokeWidth: 3,
  },
};

const MANUAL_LINE_TOOL_ORDER = [
  "walking-path",
  "cycling-path",
  "shared-path",
  "bridge-crossing",
  "barrier-line",
];

const MANUAL_EDIT_LIMITATION_TEXT =
  "Manual walking paths, cycling paths, shared links, bridge/crossing links and barrier lines are user-authored network edits applied to the local walking/cycling graph before isochrone generation. Isochrone exclusion areas remain cartographic masks applied after generation and do not alter the routed network calculation.";

const CATEGORY_SYMBOLS = {
  "Bus stop": "square",
  "Rail station": "diamond",
  School: "triangle",
  Healthcare: "cross",
  Retail: "circle",
  "Food and drink": "star",
  Community: "hex",
  Worship: "pentagon",
  "Open space": "ring",
  Settlement: "ring",
  Education: "triangle",
  Employment: "diamond",
};
const AMENITY_COLOR_PALETTE = [
  "#2563eb",
  "#dc2626",
  "#059669",
  "#d97706",
  "#7c3aed",
  "#0f766e",
  "#be123c",
  "#4f46e5",
  "#4d7c0f",
  "#c2410c",
  "#0ea5e9",
  "#a855f7",
  "#0891b2",
  "#b91c1c",
  "#15803d",
  "#b45309",
  "#6d28d9",
  "#047857",
  "#9d174d",
  "#4338ca",
  "#65a30d",
  "#ea580c",
  "#0369a1",
  "#9333ea",
  "#0e7490",
  "#be185d",
  "#1d4ed8",
  "#a16207",
  "#166534",
  "#7e22ce",
];
const DEFAULT_SITE_COORDINATES = "53.801672, -1.548567";
const DEFAULT_ACCESS_COORDINATES = "53.801155, -1.547860";
const IS_FILE_CONTEXT = window.location.protocol === "file:";
function resolveHostedAppEndpoint(path) {
  if (IS_FILE_CONTEXT || /^https?:\/\//i.test(path)) {
    return path;
  }
  return new URL(path, window.location.origin).toString();
}
const OVERPASS_ENDPOINTS = [
  ...(IS_FILE_CONTEXT
    ? [
        "https://overpass.kumi.systems/api/interpreter",
        "https://overpass-api.de/api/interpreter",
        "https://lz4.overpass-api.de/api/interpreter",
        "https://z.overpass-api.de/api/interpreter",
      ]
    : [resolveHostedAppEndpoint("/api/proxy/overpass")]),
];
const MAPIT_POINT_ENDPOINT = IS_FILE_CONTEXT
  ? "https://mapit.mysociety.org/point/4326"
  : resolveHostedAppEndpoint("/api/proxy/mapit/point/4326");
const NOMINATIM_SEARCH_ENDPOINT = IS_FILE_CONTEXT
  ? "https://nominatim.openstreetmap.org/search"
  : resolveHostedAppEndpoint("/api/proxy/nominatim/search");
const VALHALLA_ISOCHRONE_ENDPOINT = IS_FILE_CONTEXT
  ? "https://valhalla1.openstreetmap.de/isochrone"
  : resolveHostedAppEndpoint("/api/proxy/valhalla/isochrone");
const VALHALLA_ROUTE_ENDPOINT = IS_FILE_CONTEXT
  ? "https://valhalla1.openstreetmap.de/route"
  : resolveHostedAppEndpoint("/api/proxy/valhalla/route");
const BODS_DATASET_ENDPOINT = IS_FILE_CONTEXT
  ? "https://data.bus-data.dft.gov.uk/api/v1/dataset/"
  : resolveHostedAppEndpoint("/api/proxy/bods/dataset");
const BODS_DOWNLOAD_ENDPOINT = IS_FILE_CONTEXT
  ? "https://data.bus-data.dft.gov.uk/api/v1/dataset/download/"
  : resolveHostedAppEndpoint("/api/proxy/bods/download");
const BUS_METHOD_OSM = "osm-corridor";
const BUS_METHOD_BODS = "bods-timetable";
const BUS_METHOD_LABELS = {
  [BUS_METHOD_OSM]: "OSM corridor estimate",
  [BUS_METHOD_BODS]: "BODS timetable-based",
};
const BODS_TIMETABLE_SERVICE_NAME = "BODS timetable data";
const BODS_CACHE_SCHEMA_VERSION = "v79-bods-trusted-adminarea-merge";
const BODS_MAX_DATASETS = 96;
const BODS_MAX_DATASET_QUERY_RESULTS = 96;
const BODS_MAX_DATASET_QUERY_ATTEMPTS = 30;
const BODS_MAX_DATASETS_PER_QUERY = 36;
const BODS_MAX_TOTAL_DOWNLOAD_URLS = 220;
const BODS_ORIGIN_STOP_SEARCH_RADIUS_METRES = 900;
const BODS_ORIGIN_ROUTE_HINT_RADIUS_METRES = 0;
const BODS_MAX_ORIGIN_ROUTE_HINTS = 0;
const BODS_MAX_XML_FILES = 180;
const BODS_MAX_CONNECTIONS = 120000;
const BODS_MAX_STOPS = 12000;
const BODS_TRANSFER_RADIUS_METRES = 800;
const BODS_TRANSFER_STOP_CAP = 10;
const BODS_MAX_TRANSFERS = 4;
const BODS_DOWNLOAD_TIMEOUT_MS = 120000;
const BODS_LOOKAHEAD_MINUTES = 240;
const BODS_ROUTE_CORRIDOR_BUFFER_METRES = 350;
const BODS_TIMETABLE_ZONE_BUFFER_METRES = 520;
const BODS_TIMETABLE_ZONE_CLUSTER_LINK_METRES = 6200;
const BODS_TIMETABLE_ZONE_ORIGIN_COMPONENT_LINK_METRES = 6200;
const BODS_TIMETABLE_ZONE_RADIAL_BINS = 192;
const BODS_TIMETABLE_ZONE_SMOOTHING_ITERATIONS = 2;
const BODS_TIMETABLE_ZONE_CONNECTOR_MAX_METRES = 12000;
const BODS_TIMETABLE_ZONE_CONNECTOR_MAX_SPEED_KPH = 65;
const BODS_TIMETABLE_ZONE_CONNECTOR_SAMPLE_SPACING_METRES = 850;
const BODS_TIMETABLE_ZONE_MAX_METRICS_PER_BAND = 4500;
const BODS_TARGET_PLACE_NAMES = ["Horsforth", "Headingley", "Kirkstall", "Pudsey", "Morley", "Cross Gates", "Garforth", "Farsley", "Yeadon", "Guiseley", "Otley"];
const BODS_MAX_STRAIGHT_STOP_LINK_GEOMETRY_METRES = 5500;
const BODS_MAX_STRAIGHT_STOP_LINK_GEOMETRY_SPEED_KPH = 80;
const BODS_ROUTE_GEOMETRY_STOP_ENDPOINT_TOLERANCE_METRES = 900;
const BODS_ROUTE_GEOMETRY_STOP_ENDPOINT_RELATIVE_TOLERANCE = 0.35;
const BODS_ADMIN_AREA_NEIGHBOUR_CODES = {
  // NaPTAN/BODS admin area codes used as cross-boundary fallbacks.
  // 180 = Greater Manchester. The Littleborough/Rochdale edge case needs Lancashire and West Yorkshire
  // datasets as well because realistic 60-minute BODS bus movements can cross toward Whitworth and Calderdale.
  "180": ["250", "450"],
  "250": ["180", "450"],
  "450": ["180", "250"],
};
const BODS_AUTHORITY_ADMIN_AREA_CODE_RULES = [
  // BODS timetable `adminArea` is the NaPTAN administrative-area code, not the council name.
  // These high-confidence mappings stop generic OSM route terms such as "London" or numeric route refs
  // from pulling in geographically wrong timetable datasets for city-centre sites.
  { pattern: /\b(leeds|bradford|wakefield|kirklees|calderdale|west yorkshire)\b/i, codes: ["450"] },
  { pattern: /\b(manchester|salford|bolton|bury|oldham|rochdale|stockport|tameside|trafford|wigan|greater manchester)\b/i, codes: ["180"] },
  { pattern: /\b(lancashire|preston|blackpool|blackburn|burnley|chorley|fylde|hyndburn|pendle|ribble valley|rossendale|south ribble|west lancashire|wyre)\b/i, codes: ["250"] },
  { pattern: /\b(liverpool|knowsley|sefton|st helens|wirral|merseyside|liverpool city region)\b/i, codes: ["280"] },
  { pattern: /\b(sheffield|barnsley|doncaster|rotherham|south yorkshire)\b/i, codes: ["370"] },
  { pattern: /\b(york|north yorkshire|harrogate|selby|scarborough|craven|richmondshire|ryedale|hambleton)\b/i, codes: ["320"] },
];
const BODS_REAL_LOCAL_STOP_RADIUS_METRES = 10000;
const BODS_MIN_REAL_STOPS_WITHIN_10KM_FOR_ACCEPTANCE = 20;
const BODS_MIN_REAL_STOPS_WITHIN_15KM_FOR_ACCEPTANCE = 3;
const BODS_MIN_REAL_STOP_SHARE_WITHIN_15KM_FOR_ACCEPTANCE = 0.05;
const BODS_LEEDS_REALITY_GATE_BOUNDS = {
  minLatitude: 53.68,
  maxLatitude: 53.95,
  minLongitude: -1.85,
  maxLongitude: -1.25,
};
const BODS_WRONG_AREA_STOP_NAME_PATTERNS = /\b(potters\s+bar|south\s+mimms|borehamwood|elstree|watford|barnet|edgware|st\s+albans)\b/i;
const BODS_STOP_ENRICHMENT_RADIUS_METRES = 18000;
const BODS_STOP_ENRICHMENT_MAX_IDS = 500;
const BODS_OSM_EXACT_STOP_ID_CHUNK_SIZE = 80;
const BODS_MAX_EXACT_OSM_STOP_ID_CHUNKS = 3;
const BODS_STOP_ENRICHMENT_OVERPASS_TIMEOUT_MS = 12000;
const BODS_MAX_NAPTAN_API_LOOKUPS = 0;
const BODS_LOCAL_DATASET_MAX_DISTANCE_METRES = 1000;
const BODS_MAX_IMPLAUSIBLE_SPEED_KPH = 130;
const BODS_ESTIMATED_RUNTIME_SPEED_KPH = 18;
const BODS_TRANSPORT_AREA_ALIAS_RULES = [
  { pattern: /\b(liverpool|knowsley|sefton|st helens|wirral)\b/i, aliases: ["Merseyside", "Liverpool City Region"] },
  { pattern: /\b(leeds|bradford|wakefield|kirklees|calderdale)\b/i, aliases: ["West Yorkshire"] },
  { pattern: /\b(manchester|salford|bolton|bury|oldham|rochdale|stockport|tameside|trafford|wigan)\b/i, aliases: ["Greater Manchester"] },
  { pattern: /\b(birmingham|coventry|dudley|sandwell|solihull|walsall|wolverhampton)\b/i, aliases: ["West Midlands"] },
  { pattern: /\b(sheffield|barnsley|doncaster|rotherham)\b/i, aliases: ["South Yorkshire"] },
  { pattern: /\b(newcastle|gateshead|sunderland|north tyneside|south tyneside)\b/i, aliases: ["Tyne and Wear"] },
  { pattern: /\b(bristol|bath and north east somerset|south gloucestershire|north somerset)\b/i, aliases: ["West of England"] },
  { pattern: /\b(middlesbrough|stockton-on-tees|redcar and cleveland|hartlepool|darlington)\b/i, aliases: ["Tees Valley"] },
];
const BODS_DATASET_CACHE = new Map();
const BODS_TIMETABLE_CACHE = new Map();
const BODS_STOP_COORDINATE_CACHE = new Map();
const OSM_BUS_ROUTE_METHOD_NOTE =
  "Bus catchments are indicative OpenStreetMap bus-route corridor outputs. They are generated from mapped OSM bus route relations serving bus stops within the selected maximum walk-to-bus-stop distance from the site/access point. Walking access is based on a 4.8 kph walking speed, using routed pedestrian distance where available and straight-line fallback only where routing cannot be returned. The access walk is deducted from each time band before remaining time is applied to in-vehicle bus travel using either the selected flat average bus speed or a road-type weighted OSM speed profile. The polygons are cartographically smoothed for presentation and should not be interpreted as precise network-coverage boundaries. The outputs do not include timetable availability, service frequency, waiting time, interchanges, disruption or live running.";
const ACTIVE_TRAVEL_NETWORK_SERVICE_NAME = "OpenStreetMap active travel network";
const GEOMETRIC_FALLBACK_NOTICE =
  "The active travel network catchment could not be generated, so the map is showing an indicative straight-line fallback. Do not describe this fallback as a routed network isochrone.";
const OSM_BUS_ROUTE_UNAVAILABLE_NOTICE =
  "Mapped OpenStreetMap bus route catchments could not be generated. No road-network fallback is shown, because the bus layer is configured to follow bus routes only.";
const OSM_BUS_ROUTE_SERVICE_NAME = "OpenStreetMap bus route data";
const BUS_ACCESS_RADIUS_METRES = 400;
const BUS_MAX_WALK_TO_STOP_DEFAULT_METRES = 400;
const BUS_MAX_WALK_TO_STOP_MIN_METRES = 50;
const BUS_MAX_WALK_TO_STOP_MAX_METRES = 2000;
const BUS_STOP_PREFILTER_MARGIN_METRES = 300;
const BUS_STOP_PREFILTER_FACTOR = 1.75;
const BUS_DESTINATION_BUFFER_METRES = 350;
const BUS_DEFAULT_SPEED_KPH = 18;
const MPH_TO_KPH = 1.609344;
const BUS_DEFAULT_SPEED_MPH = BUS_DEFAULT_SPEED_KPH / MPH_TO_KPH;
const BUS_MIN_SPEED_MPH = 1;
const BUS_MAX_SPEED_MPH = 60;
const BUS_SPEED_MODEL_FLAT = "flat";
const BUS_SPEED_MODEL_ROAD_TYPE = "road-type";
const BUS_SPEED_MODEL_LABELS = {
  [BUS_SPEED_MODEL_FLAT]: "Flat average speed",
  [BUS_SPEED_MODEL_ROAD_TYPE]: "Road-type weighted speed",
};
const BUS_ROAD_TYPE_SPEED_KPH = {
  motorway: 72,
  trunk: 55,
  primary: 38,
  secondary: 30,
  tertiary: 26,
  unclassified: 22,
  residential: 22,
  living_street: 12,
  service: 14,
  busway: 32,
  unknown: BUS_DEFAULT_SPEED_KPH,
};
const BUS_ROAD_TYPE_CLASS_ORDER = [
  "motorway",
  "trunk",
  "primary",
  "secondary",
  "tertiary",
  "unclassified",
  "residential",
  "living_street",
  "service",
  "busway",
  "unknown",
];
const BUS_ACCESS_WALK_SPEED_KPH = 4.8;
const BUS_ACCESS_WALK_SPEED_METRES_PER_MINUTE = (BUS_ACCESS_WALK_SPEED_KPH * 1000) / 60;
const BUS_ACCESS_WALK_DETOUR_FACTOR = 1.3;
const BUS_STOP_SEARCH_MARGIN_METRES = BUS_STOP_PREFILTER_MARGIN_METRES;
const BUS_STOP_SEARCH_MIN_RADIUS_METRES = 250;
const BUS_STOP_SEARCH_MAX_RADIUS_METRES = 3000;
const BUS_ROUTE_STOP_QUERY_RADIUS_METRES = 800; // fallback default where a dynamic radius is not supplied.
const BUS_ROUTE_NEARBY_QUERY_RADIUS_METRES = 1100; // fallback default where a dynamic radius is not supplied.
const BUS_ROUTE_STOP_PROXIMITY_FALLBACK_METRES = 120;
const BUS_ROUTE_MAX_RELATIONS = 18;
const BUS_ROUTE_BEARING_SECTOR_DEGREES = 45;
const BUS_ROUTE_MIN_PER_SECTOR = 2;
const BUS_ROUTE_MAX_PER_ROUTE_GROUP = 2;
const BUS_ROUTE_GEOMETRY_INITIAL_CHUNK_SIZE = 6;
const BUS_ROUTE_GEOMETRY_MIN_CHUNK_SIZE = 3;
const BUS_ROUTE_GEOMETRY_CONCURRENCY = 1;
const BUS_ROUTE_MAX_POINTS_PER_RELATION = 180;
const BUS_ROUTE_CORRIDOR_SAMPLE_SPACING_METRES = 650;
const BUS_ROUTE_MAX_BUFFERS_PER_BAND = 220;
const BUS_ROUTE_BUFFER_SEGMENTS = 8;
const BUS_ACCESS_MAX_ANCHORS_PER_ROUTE = 5;
const BUS_ACCESS_DISTANCE_CONCURRENCY = 3;
const BUS_ACCESS_DISTANCE_CACHE = new Map();
const BUS_RELATION_PAYLOAD_CACHE = new Map();
const BUS_RELATION_GEOMETRY_CACHE = new Map();
const BUS_ACCESSIBLE_ROUTES_CACHE = new Map();
const BUS_ISOCHRONE_RESULT_CACHE = new Map();
const BUS_CACHE_MAX_ENTRIES = 8;
const BUS_LONG_RUNNING_NOTICE_MS = 45000;
const BUS_LONG_RUNNING_NOTICE =
  "Bus isochrone calculation is still running. Large catchments, lower average bus speeds or complex networks can take several minutes.";
const BUS_CARTO_OUTWARD_BUFFER_METRES = 250;
const BUS_CARTO_EFFECTIVE_BUFFER_METRES = BUS_DESTINATION_BUFFER_METRES + BUS_CARTO_OUTWARD_BUFFER_METRES;
const BUS_CARTO_CLUSTER_LINK_METRES = 1600;
const BUS_CARTO_MIN_COMPONENT_AREA_SQ_M = 10000;
const BUS_CARTO_RADIAL_BINS = 96;
const BUS_CARTO_HULL_POINT_SEGMENTS = 10;
const BUS_CARTO_SMOOTHING_ITERATIONS = 2;
const ACTIVE_TRAVEL_NETWORK_CACHE = new Map();
const ACTIVE_TRAVEL_GRAPH_CACHE = new Map();
const ACTIVE_TRAVEL_ISOCHRONE_RESULT_CACHE = new Map();
const ACTIVE_TRAVEL_NETWORK_FETCH_RADIUS_MARGIN_METRES = 1200;
const ACTIVE_TRAVEL_BUFFER_BY_MODE = {
  walking: 55,
  cycling: 110,
};
const ACTIVE_TRAVEL_SAMPLE_SPACING_BY_MODE = {
  walking: 45,
  cycling: 90,
};
const ACTIVE_TRAVEL_MANUAL_PATH_SAMPLE_SPACING_BY_MODE = {
  walking: 20,
  cycling: 24,
};
const ACTIVE_TRAVEL_CLUSTER_LINK_BY_MODE = {
  walking: 220,
  cycling: 480,
};
const ACTIVE_TRAVEL_MIN_COMPONENT_AREA_BY_MODE = {
  walking: 1800,
  cycling: 1200,
};
const ACTIVE_TRAVEL_RADIAL_BINS_BY_MODE = {
  walking: 128,
  cycling: 192,
};
const ACTIVE_TRAVEL_SMOOTHING_ITERATIONS_BY_MODE = {
  walking: 1,
  cycling: 1,
};
const ACTIVE_TRAVEL_INTERSECTION_TOLERANCE_METRES = 22;
const ACTIVE_TRAVEL_SNAP_TOLERANCE_METRES = 60;
const ACTIVE_TRAVEL_MAX_SNAP_CANDIDATE_DISTANCE_METRES = 120;
const ACTIVE_TRAVEL_OSM_JUNCTION_STITCH_TOLERANCE_METRES = 14;
const ACTIVE_TRAVEL_OSM_ENDPOINT_LINK_TOLERANCE_METRES = 10;
const ACTIVE_TRAVEL_CONNECTIVITY_HEURISTIC_EDGE_LIMIT = 1800;
const ACTIVE_TRAVEL_CONNECTIVITY_HEURISTIC_CANDIDATE_LIMIT = 240;
const ACTIVE_TRAVEL_CONNECTIVITY_HEURISTIC_TERMINAL_LIMIT = 160;
const ACTIVE_TRAVEL_DEFAULT_WALKING_SPEED_KPH = 4.8;
const ACTIVE_TRAVEL_WALK_PERMISSIVE_HIGHWAYS = new Set([
  "residential",
  "living_street",
  "service",
  "unclassified",
  "tertiary",
  "tertiary_link",
]);
const ACTIVE_TRAVEL_WALK_FOOTWAY_HIGHWAYS = new Set([
  "footway",
  "path",
  "pedestrian",
  "steps",
  "track",
  "bridleway",
  "cycleway",
]);
const ACTIVE_TRAVEL_WALK_ROADS_REQUIRING_SIDEWALK = new Set([
  "motorway",
  "motorway_link",
  "trunk",
  "trunk_link",
  "primary",
  "primary_link",
  "secondary",
  "secondary_link",
]);
const ACTIVE_TRAVEL_CYCLE_HIGHWAYS = new Set([
  "cycleway",
  "path",
  "track",
  "bridleway",
  "living_street",
  "residential",
  "service",
  "unclassified",
  "tertiary",
  "tertiary_link",
  "secondary",
  "secondary_link",
  "primary",
  "primary_link",
]);
const ACTIVE_TRAVEL_EXCLUDED_HIGHWAYS = new Set([
  "motorway",
  "motorway_link",
  "proposed",
  "construction",
  "bus_guideway",
  "raceway",
  "corridor",
  "elevator",
]);
const ACTIVE_TRAVEL_ONEWAY_FALSE_VALUES = new Set(["no", "false", "0", "reversible"]);

const CYCLING_SPEED_KPH = 16;
const CYCLING_TIME_GUIDANCE_TEXT =
  "The cycle times detailed in the table are based on a cycling speed of 16 kph which corresponds with DfT guidance.";
const BUS_INDICATIVE_METHOD_NOTE =
  "Bus contours are indicative OpenStreetMap bus-route corridor outputs. They include a pedestrian access allowance to the boarding stop based on 4.8 kph walking speed, then apply remaining time to the selected average in-vehicle bus speed. They should be checked against current bus timetables before planning issue.";
const SERVICE_TIMEOUT_MS = {
  Overpass: 30000,
  "OpenStreetMap active travel network": 45000,
  "Valhalla isochrone": 30000,
  "Valhalla route": 10000,
  "OpenStreetMap bus route data": 60000,
  "BODS timetable data": 180000,
};
const MAP_DIMENSIONS = {
  width: 960,
  height: 640,
};

const MODE_CONFIG = {
  walking: {
    label: "Walking",
    extent: "Local services focus",
    scaleLabel: "250 m",
    zoom: 15,
    amenityRadius: 1600,
    metric: "distance",
    costing: "pedestrian",
    bands: [
      { label: "1,200 m", distance: 1.2, fill: "#00f7ff" },
      { label: "2,000 m", distance: 2.0, fill: "#ff0000" },
    ],
  },
  cycling: {
    label: "Cycling",
    extent: "Nearby settlements and key destinations",
    scaleLabel: "1 km",
    zoom: 14,
    amenityRadius: 4500,
    metric: "distance",
    costing: "bicycle",
    bands: [
      { label: "2,000 m", distance: 2.0, fill: "#00f7ff" },
      { label: "5,000 m", distance: 5.0, fill: "#22ff00" },
      { label: "8,000 m", distance: 8.0, fill: "#ff0000" },
    ],
  },
  bus: {
    label: "Bus",
    extent: "Indicative bus route corridor catchment",
    scaleLabel: "2 km",
    zoom: 13,
    amenityRadius: 8000,
    metric: "time",
    costing: "bus_route_corridor",
    bands: [
      { label: "15 mins", time: 15, fill: "#00f7ff" },
      { label: "30 mins", time: 30, fill: "#22ff00" },
      { label: "45 mins", time: 45, fill: "#ff0000" },
      { label: "60 mins", time: 60, fill: "#eaff00" },
    ],
  },
};

const state = {
  selectedMode: "walking",
  amenities: [],
  isochrones: [],
  currentMapView: null,
  mapViewAnimationFrameId: null,
  mapViewAnimationStartTime: 0,
  mapViewAnimationDurationMs: 0,
  mapViewAnimationFrom: null,
  mapViewAnimationTo: null,
  lastZoomControlValue: 0,
  nextAmenityId: 1,
  nextManualOverlayId: 1,
  isPlacingPoint: false,
  activeDrawingTool: "",
  draftDrawingPoints: [],
  manualLineEdits: [],
  isochroneExclusionAreas: [],
  isDraggingMap: false,
  mapDragPointerId: null,
  mapDragLastPoint: null,
  mapPanFrameId: null,
  generatedScenario: null,
  lastAutoPlanningAuthority: "",
  planningAuthorityLookupTimer: null,
  latestPlanningAuthorityLookupId: 0,
  savedOverrides: {},
  generationTimers: [],
  latestFetchRequestId: 0,
  activeRefreshController: null,
  hasGeneratedDraft: false,
  lastIsochroneFallbackNotice: "",
  lastIsochroneSourceNote: "",
  amenityCache: {
    walking: null,
    cycling: null,
    bus: null,
  },
  status: {
    title: "Ready to generate",
    text: "Waiting for a draft run.",
    tone: "ready",
  },
};

const elements = {
  projectName: document.getElementById("projectName"),
  planningAuthority: document.getElementById("planningAuthority"),
  projectNote: document.getElementById("projectNote"),
  siteCoordinates: document.getElementById("siteCoordinates"),
  accessCoordinates: document.getElementById("accessCoordinates"),
  busNote: document.getElementById("busNote"),
  busMethod: document.getElementById("busMethod"),
  busMethodHint: document.getElementById("busMethodHint"),
  busDate: document.getElementById("busDate"),
  busTime: document.getElementById("busTime"),
  busSpeedMph: document.getElementById("busSpeedMph"),
  busSpeedModel: document.getElementById("busSpeedModel"),
  busSpeedModelHint: document.getElementById("busSpeedModelHint"),
  busSpeedHint: document.getElementById("busSpeedHint"),
  busMaxWalkMetres: document.getElementById("busMaxWalkMetres"),
  busMaxWalkHint: document.getElementById("busMaxWalkHint"),
  walkingBands: document.getElementById("walkingBands"),
  cyclingBands: document.getElementById("cyclingBands"),
  busBands: document.getElementById("busBands"),
  walkingColor1: document.getElementById("walkingColor1"),
  walkingColor2: document.getElementById("walkingColor2"),
  cyclingColor1: document.getElementById("cyclingColor1"),
  cyclingColor2: document.getElementById("cyclingColor2"),
  cyclingColor3: document.getElementById("cyclingColor3"),
  busColor1: document.getElementById("busColor1"),
  busColor2: document.getElementById("busColor2"),
  busColor3: document.getElementById("busColor3"),
  busColor4: document.getElementById("busColor4"),
  legendPosition: document.getElementById("legendPosition"),
  mapZoomAdjust: document.getElementById("mapZoomAdjust"),
  mapZoomAdjustValue: document.getElementById("mapZoomAdjustValue"),
  recenterMapButton: document.getElementById("recenterMapButton"),
  modeButtons: Array.from(document.querySelectorAll(".mode-chip")),
  bandSummary: document.getElementById("bandSummary"),
  modeLabel: document.getElementById("modeLabel"),
  extentLabel: document.getElementById("extentLabel"),
  legendCount: document.getElementById("legendCount"),
  statusTitle: document.getElementById("statusTitle"),
  statusText: document.getElementById("statusText"),
  statusDot: document.getElementById("statusDot"),
  previewNote: document.getElementById("previewNote"),
  mapPreview: document.getElementById("mapPreview"),
  amenitiesTableBody: document.getElementById("amenitiesTableBody"),
  manualOverlaysTableBody: document.getElementById("manualOverlaysTableBody"),
  methodNote: document.getElementById("methodNote"),
  manualPointName: document.getElementById("manualPointName"),
  manualPointCategory: document.getElementById("manualPointCategory"),
  manualPointSymbol: document.getElementById("manualPointSymbol"),
  manualOverlayName: document.getElementById("manualOverlayName"),
  manualEditStatus: document.getElementById("manualEditStatus"),
  togglePlacePointButton: document.getElementById("togglePlacePointButton"),
  drawingToolButtons: Array.from(document.querySelectorAll("[data-drawing-tool]")),
  finishDrawingButton: document.getElementById("finishDrawingButton"),
  cancelDrawingButton: document.getElementById("cancelDrawingButton"),
  clearLastManualEditButton: document.getElementById("clearLastManualEditButton"),
  clearAllManualEditsButton: document.getElementById("clearAllManualEditsButton"),
  generateButton: document.getElementById("generateButton"),
  saveOverridesButton: document.getElementById("saveOverridesButton"),
  resetOverridesButton: document.getElementById("resetOverridesButton"),
  exportPngButton: document.getElementById("exportPngButton"),
  exportSvgButton: document.getElementById("exportSvgButton"),
  exportCsvButton: document.getElementById("exportCsvButton"),
  exportJsonButton: document.getElementById("exportJsonButton"),
};

function init() {
  populateSelect(elements.manualPointCategory, CATEGORY_OPTIONS);
  populateSelect(elements.manualPointSymbol, SYMBOL_OPTIONS);
  state.generatedScenario = buildGeneratedScenario(
    parseCoordinatePair(elements.siteCoordinates.value) ?? parseCoordinatePair(DEFAULT_SITE_COORDINATES),
    parseCoordinatePair(elements.accessCoordinates.value, true)
  );
  state.savedOverrides = loadSavedOverrides();
  applySavedManualMapEdits(loadSavedManualMapEdits());
  initialiseBusMethodControl();
  initialiseBusDateTimeControls();
  initialiseBusSpeedControl();
  initialiseBusMaxWalkControl();
  state.amenities = [];
  bindEvents();
  render();
  schedulePlanningAuthorityLookup(state.generatedScenario.siteCoordinates);
}

function initialiseBusMethodControl() {
  // BODS is the intended/default bus mode for planning outputs.
  // Some deployed HTML versions default the select to OSM corridor, which is much slower and not timetable-based.
  if (elements.busMethod) {
    elements.busMethod.value = BUS_METHOD_BODS;
  }
  updateBusMethodControls();
}

function getSelectedBusMethod() {
  const value = elements.busMethod?.value || BUS_METHOD_BODS;
  return value === BUS_METHOD_OSM ? BUS_METHOD_OSM : BUS_METHOD_BODS;
}

function getBusMethodLabel(method = getSelectedBusMethod()) {
  return BUS_METHOD_LABELS[method] || BUS_METHOD_LABELS[BUS_METHOD_BODS];
}

function initialiseBusDateTimeControls() {
  if (elements.busDate && !elements.busDate.value) {
    elements.busDate.value = new Date().toISOString().slice(0, 10);
  }
  if (elements.busTime && !elements.busTime.value) {
    elements.busTime.value = "08:00";
  }
  updateBusMethodControls();
}

function updateBusMethodControls() {
  const method = getSelectedBusMethod();
  const timetableMode = method === BUS_METHOD_BODS;
  if (elements.busDate) {
    elements.busDate.disabled = !timetableMode;
  }
  if (elements.busTime) {
    elements.busTime.disabled = !timetableMode;
  }
  if (elements.busSpeedMph) {
    elements.busSpeedMph.disabled = timetableMode;
  }
  if (elements.busSpeedModel) {
    elements.busSpeedModel.disabled = timetableMode;
  }
  if (elements.busMethodHint) {
    elements.busMethodHint.textContent = timetableMode
      ? "Uses BODS timetable datasets through the Cloudflare Worker secret BODS_API_KEY. This mode includes scheduled wait time and transfers where timetable data can be parsed."
      : "Uses mapped OSM bus route corridors with assumed in-vehicle bus speeds. This is faster but not timetable-based.";
  }
}

function getSelectedBusDate() {
  if (getSelectedBusMethod() !== BUS_METHOD_BODS) {
    return "Not applicable - no timetable date used";
  }
  return elements.busDate?.value || new Date().toISOString().slice(0, 10);
}

function getSelectedBusTime() {
  if (getSelectedBusMethod() !== BUS_METHOD_BODS) {
    return "Not applicable - no departure time used";
  }
  return elements.busTime?.value || "08:00";
}

function initialiseBusSpeedControl() {
  if (elements.busSpeedMph) {
    elements.busSpeedMph.value = formatBusSpeedMph(BUS_DEFAULT_SPEED_MPH, 4);
  }
  if (elements.busSpeedModel && !elements.busSpeedModel.value) {
    elements.busSpeedModel.value = BUS_SPEED_MODEL_FLAT;
  }
  updateBusSpeedValidationState();
}

function initialiseBusMaxWalkControl() {
  if (!elements.busMaxWalkMetres) {
    return;
  }
  elements.busMaxWalkMetres.value = String(BUS_MAX_WALK_TO_STOP_DEFAULT_METRES);
  updateBusMaxWalkValidationState();
}

function getSelectedBusMaxWalkToStopMetres() {
  const rawValue = elements.busMaxWalkMetres?.value?.trim() ?? "";
  if (!rawValue) {
    return null;
  }
  const distanceMetres = Number(rawValue);
  if (!Number.isFinite(distanceMetres) || distanceMetres < BUS_MAX_WALK_TO_STOP_MIN_METRES || distanceMetres > BUS_MAX_WALK_TO_STOP_MAX_METRES) {
    return null;
  }
  return distanceMetres;
}

function getBusMaxWalkValidationMessage() {
  const rawValue = elements.busMaxWalkMetres?.value?.trim() ?? "";
  if (!rawValue) {
    return "Enter a maximum walk-to-bus-stop distance in metres.";
  }
  const distanceMetres = Number(rawValue);
  if (!Number.isFinite(distanceMetres)) {
    return "Enter a numeric maximum walk-to-bus-stop distance in metres.";
  }
  if (distanceMetres < BUS_MAX_WALK_TO_STOP_MIN_METRES || distanceMetres > BUS_MAX_WALK_TO_STOP_MAX_METRES) {
    return `Enter a maximum walk-to-bus-stop distance between ${BUS_MAX_WALK_TO_STOP_MIN_METRES} m and ${BUS_MAX_WALK_TO_STOP_MAX_METRES.toLocaleString("en-GB")} m.`;
  }
  return "";
}

function updateBusMaxWalkValidationState() {
  if (!elements.busMaxWalkMetres) {
    return true;
  }
  const message = getBusMaxWalkValidationMessage();
  const isValid = !message;
  elements.busMaxWalkMetres.setAttribute("aria-invalid", String(!isValid));
  if (elements.busMaxWalkHint) {
    if (isValid) {
      const distanceMetres = getSelectedBusMaxWalkToStopMetres();
      const prefilterRadius = getBusStopSearchRadiusMetres(distanceMetres);
      elements.busMaxWalkHint.textContent = `Only stops with an access walk of ${Math.round(distanceMetres).toLocaleString("en-GB")} m or less are eligible. OSM is pre-filtered within approximately ${Math.round(prefilterRadius).toLocaleString("en-GB")} m before routed walking checks.`;
    } else {
      elements.busMaxWalkHint.textContent = message;
    }
  }
  return isValid;
}

function getSelectedBusSpeedMph() {
  const rawValue = elements.busSpeedMph?.value?.trim() ?? "";
  if (!rawValue) {
    return null;
  }
  const speedMph = Number(rawValue);
  if (!Number.isFinite(speedMph) || speedMph < BUS_MIN_SPEED_MPH || speedMph > BUS_MAX_SPEED_MPH) {
    return null;
  }
  return speedMph;
}

function getSelectedBusSpeedKph() {
  const speedMph = getSelectedBusSpeedMph();
  if (Number.isFinite(speedMph) && Math.abs(speedMph - BUS_DEFAULT_SPEED_MPH) < 0.0001) {
    return BUS_DEFAULT_SPEED_KPH;
  }
  return Number.isFinite(speedMph) ? speedMph * MPH_TO_KPH : null;
}

function getSelectedBusSpeedModel() {
  const value = elements.busSpeedModel?.value || BUS_SPEED_MODEL_FLAT;
  return value === BUS_SPEED_MODEL_ROAD_TYPE ? BUS_SPEED_MODEL_ROAD_TYPE : BUS_SPEED_MODEL_FLAT;
}

function getBusSpeedModelLabel(model = getSelectedBusSpeedModel()) {
  return BUS_SPEED_MODEL_LABELS[model] || BUS_SPEED_MODEL_LABELS[BUS_SPEED_MODEL_FLAT];
}

function getSelectedBusSpeedSettings() {
  const flatSpeedKph = getSelectedBusSpeedKph() ?? BUS_DEFAULT_SPEED_KPH;
  return {
    mode: getSelectedBusSpeedModel(),
    flatSpeedKph,
    roadTypeSpeedsKph: { ...BUS_ROAD_TYPE_SPEED_KPH, unknown: flatSpeedKph },
  };
}

function normaliseBusSpeedSettings(settingsOrSpeed = getSelectedBusSpeedSettings()) {
  if (typeof settingsOrSpeed === "number") {
    return {
      mode: BUS_SPEED_MODEL_FLAT,
      flatSpeedKph: settingsOrSpeed,
      roadTypeSpeedsKph: { ...BUS_ROAD_TYPE_SPEED_KPH, unknown: settingsOrSpeed },
    };
  }
  const flatSpeedKph = Number(settingsOrSpeed?.flatSpeedKph);
  const safeFlatSpeedKph = Number.isFinite(flatSpeedKph) && flatSpeedKph > 0 ? flatSpeedKph : BUS_DEFAULT_SPEED_KPH;
  const mode = settingsOrSpeed?.mode === BUS_SPEED_MODEL_ROAD_TYPE ? BUS_SPEED_MODEL_ROAD_TYPE : BUS_SPEED_MODEL_FLAT;
  return {
    mode,
    flatSpeedKph: safeFlatSpeedKph,
    roadTypeSpeedsKph: {
      ...BUS_ROAD_TYPE_SPEED_KPH,
      unknown: safeFlatSpeedKph,
      ...(settingsOrSpeed?.roadTypeSpeedsKph || {}),
    },
  };
}

function formatBusSpeedMph(speedMph, maximumFractionDigits = 1) {
  return Number(speedMph).toLocaleString("en-GB", {
    minimumFractionDigits: 0,
    maximumFractionDigits,
  });
}

function formatBusSpeedKph(speedKph, maximumFractionDigits = 1) {
  return Number(speedKph).toLocaleString("en-GB", {
    minimumFractionDigits: 0,
    maximumFractionDigits,
  });
}

function getBusSpeedValidationMessage() {
  const rawValue = elements.busSpeedMph?.value?.trim() ?? "";
  if (!rawValue) {
    return "Enter an average bus speed in mph.";
  }
  const speedMph = Number(rawValue);
  if (!Number.isFinite(speedMph)) {
    return "Enter a numeric average bus speed in mph.";
  }
  if (speedMph < BUS_MIN_SPEED_MPH || speedMph > BUS_MAX_SPEED_MPH) {
    return `Enter an average bus speed between ${BUS_MIN_SPEED_MPH} and ${BUS_MAX_SPEED_MPH} mph.`;
  }
  return "";
}

function updateBusSpeedValidationState() {
  if (!elements.busSpeedMph) {
    return true;
  }
  const message = getBusSpeedValidationMessage();
  const isValid = !message;
  elements.busSpeedMph.setAttribute("aria-invalid", String(!isValid));
  if (elements.busSpeedHint) {
    if (isValid) {
      const speedMph = getSelectedBusSpeedMph();
      const speedKph = speedMph * MPH_TO_KPH;
      const model = getSelectedBusSpeedModel();
      elements.busSpeedHint.textContent = model === BUS_SPEED_MODEL_ROAD_TYPE
        ? `Flat speed retained as ${formatBusSpeedKph(speedKph)} kph for fallback/unknown OSM segments. Road-type weighted mode applies the OSM highway speed profile where way tags are available.`
        : `Applied as ${formatBusSpeedKph(speedKph)} kph for in-vehicle bus travel. Default ${formatBusSpeedMph(BUS_DEFAULT_SPEED_MPH, 4)} mph matches the v28 18 kph assumption.`;
    } else {
      elements.busSpeedHint.textContent = message;
    }
  }
  if (elements.busSpeedModelHint) {
    const model = getSelectedBusSpeedModel();
    elements.busSpeedModelHint.textContent = model === BUS_SPEED_MODEL_ROAD_TYPE
      ? "Uses OSM way-level highway tags to apply modelled average speeds by road type. Maxspeed tags cap segment speeds where present; missing way tags use the fallback flat speed."
      : "Uses the single selected average bus speed across all mapped bus route geometry.";
  }
  return isValid;
}

function populateSelect(select, options) {
  select.innerHTML = options.map((option) => `<option value="${option}">${option}</option>`).join("");
}

function bindEvents() {
  elements.modeButtons.forEach((button) => {
    button.addEventListener("click", async () => {
      state.selectedMode = button.dataset.mode;
      render();
      if (state.generatedScenario && state.hasGeneratedDraft) {
        await refreshLiveContext(`Refreshing ${MODE_CONFIG[state.selectedMode].label.toLowerCase()} amenities from OpenStreetMap.`);
      }
    });
  });

  [
    elements.projectName,
    elements.planningAuthority,
    elements.projectNote,
    elements.busNote,
    elements.busMethod,
    elements.busDate,
    elements.busTime,
    elements.busSpeedMph,
    elements.busSpeedModel,
    elements.busMaxWalkMetres,
    elements.walkingBands,
    elements.cyclingBands,
    elements.busBands,
    elements.walkingColor1,
    elements.walkingColor2,
    elements.cyclingColor1,
    elements.cyclingColor2,
    elements.cyclingColor3,
    elements.busColor1,
    elements.busColor2,
    elements.busColor3,
    elements.busColor4,
    elements.legendPosition,
  ].filter(Boolean).forEach((control) => {
    control.addEventListener("input", render);
    control.addEventListener("change", render);
  });

  elements.busMethod?.addEventListener("change", handleBusMethodChange);
  elements.busDate?.addEventListener("change", handleBusMethodChange);
  elements.busTime?.addEventListener("change", handleBusMethodChange);
  elements.busSpeedMph?.addEventListener("change", handleBusSpeedChange);
  elements.busSpeedModel?.addEventListener("change", handleBusSpeedChange);
  elements.busMaxWalkMetres?.addEventListener("change", handleBusMaxWalkChange);
  elements.mapZoomAdjust.addEventListener("input", onMapZoomAdjustChange);
  elements.mapZoomAdjust.addEventListener("change", onMapZoomAdjustChange);
  elements.recenterMapButton.addEventListener("click", recenterMapView);

  [elements.siteCoordinates, elements.accessCoordinates].forEach((control) => {
    control.addEventListener("input", handleCoordinateDraftChange);
    control.addEventListener("change", handleCoordinateDraftChange);
  });

  elements.generateButton.addEventListener("click", runGenerationSequence);
  elements.saveOverridesButton.addEventListener("click", saveOverrides);
  elements.resetOverridesButton.addEventListener("click", resetOverrides);
  elements.togglePlacePointButton.addEventListener("click", togglePlacePointMode);
  elements.drawingToolButtons.forEach((button) => {
    button.addEventListener("click", () => activateDrawingTool(button.dataset.drawingTool || ""));
  });
  elements.finishDrawingButton?.addEventListener("click", finishCurrentDrawing);
  elements.cancelDrawingButton?.addEventListener("click", cancelCurrentDrawing);
  elements.clearLastManualEditButton?.addEventListener("click", clearLastManualEdit);
  elements.clearAllManualEditsButton?.addEventListener("click", clearAllManualEdits);
  elements.exportPngButton.addEventListener("click", exportPng);
  elements.exportSvgButton.addEventListener("click", exportSvg);
  elements.exportCsvButton.addEventListener("click", exportCsv);
  elements.exportJsonButton.addEventListener("click", exportMethodNote);
  elements.mapPreview.addEventListener("click", onMapClick);
  elements.mapPreview.addEventListener("pointerdown", onMapPointerDown);
  elements.mapPreview.addEventListener("pointermove", onMapPointerMove);
  elements.mapPreview.addEventListener("pointerup", onMapPointerUp);
  elements.mapPreview.addEventListener("pointerleave", onMapPointerUp);
  elements.mapPreview.addEventListener("pointercancel", onMapPointerUp);
  document.addEventListener("keydown", onDocumentKeyDown);
}

function render() {
  updateModeControls();
  updateManualEditControls();
  updateStatus();
  renderAmenitiesTable();
  renderManualOverlaysTable();
  renderMap();
  renderMethodNote();
}

function updateModeControls() {
  elements.modeButtons.forEach((button) => {
    button.classList.toggle("active", button.dataset.mode === state.selectedMode);
  });
  const config = MODE_CONFIG[state.selectedMode];
  const labels = getConfiguredBandsForMode(state.selectedMode).map((band) => band.label).join(" | ");
  elements.bandSummary.textContent = `Default bands: ${labels}`;
  elements.modeLabel.textContent = config.label;
  elements.extentLabel.textContent = config.extent;
  elements.mapZoomAdjustValue.textContent = formatMapZoomAdjustValue();
  updateBusMethodControls();
  updateBusSpeedValidationState();
  updateBusMaxWalkValidationState();
}

function updateStatus() {
  const isRunning = state.status.tone === "running";
  document.body.classList.toggle("is-busy", isRunning);
  if (elements.generateButton) {
    elements.generateButton.disabled = isRunning;
  }
  if (elements.mapPreview) {
    elements.mapPreview.setAttribute("aria-busy", String(isRunning));
  }
  elements.statusTitle.textContent = state.status.title;
  elements.statusText.textContent = state.status.text;
  elements.statusDot.className = "status-dot";
  if (state.status.tone === "running") {
    elements.statusDot.classList.add("is-running");
  } else if (state.status.tone === "warning") {
    elements.statusDot.classList.add("is-warning");
  } else if (state.status.tone === "error") {
    elements.statusDot.classList.add("is-error");
  } else if (state.status.tone === "active") {
    elements.statusDot.classList.add("is-active");
  } else if (state.status.tone === "ready") {
    elements.statusDot.classList.add("is-ready");
  }
}

function renderAmenitiesTable() {
  elements.amenitiesTableBody.innerHTML = "";

  if (state.amenities.length === 0) {
    const row = document.createElement("tr");
    row.className = "empty-table-row";
    row.innerHTML = `<td colspan="7">No amenities are currently shown. Generate a draft map or place a manual point to populate this table.</td>`;
    elements.amenitiesTableBody.appendChild(row);
    return;
  }

  state.amenities.forEach((item) => {
    const row = document.createElement("tr");
    row.innerHTML = `
        <td><input type="text" value="${escapeHtml(item.name)}" data-field="name" data-id="${item.id}" /></td>
        <td>${buildSelectMarkup(item.id, "category", CATEGORY_OPTIONS, item.category)}</td>
        <td>${buildSelectMarkup(item.id, "symbol", SYMBOL_OPTIONS, item.symbol)}</td>
        <td><input class="colour-input" type="color" value="${item.color}" data-field="color" data-id="${item.id}" /></td>
        <td><input type="checkbox" ${item.visible ? "checked" : ""} data-field="visible" data-id="${item.id}" /></td>
        <td><input type="checkbox" ${item.showInLegend ? "checked" : ""} data-field="showInLegend" data-id="${item.id}" /></td>
        <td><button class="row-delete" type="button" data-delete-id="${item.id}" aria-label="Delete amenity">X</button></td>
      `;
    elements.amenitiesTableBody.appendChild(row);
  });

  elements.amenitiesTableBody
    .querySelectorAll("input[data-id], select[data-id]")
    .forEach((control) => {
      control.addEventListener("input", onAmenityFieldChange);
      control.addEventListener("change", onAmenityFieldChange);
    });

  elements.amenitiesTableBody.querySelectorAll("[data-delete-id]").forEach((button) => {
    button.addEventListener("click", () => {
      const amenityId = Number(button.dataset.deleteId);
      state.amenities = state.amenities.filter((item) => item.id !== amenityId);
      render();
    });
  });
}

function renderManualOverlaysTable() {
  if (!elements.manualOverlaysTableBody) {
    return;
  }

  elements.manualOverlaysTableBody.innerHTML = "";
  const savedManualOverlays = getAllSavedManualOverlays();

  if (savedManualOverlays.length === 0) {
    const row = document.createElement("tr");
    row.className = "empty-table-row";
    row.innerHTML = `<td colspan="4">No manual map edits are currently saved.</td>`;
    elements.manualOverlaysTableBody.appendChild(row);
    return;
  }

  savedManualOverlays.forEach((item) => {
    const row = document.createElement("tr");
    row.innerHTML = `
        <td><input type="text" value="${escapeHtml(item.displayName)}" data-manual-field="displayName" data-manual-id="${item.id}" data-manual-type="${item.type}" /></td>
        <td>${escapeHtml(getDrawingToolConfig(item.type)?.displayName || item.type)}</td>
        <td><input type="checkbox" ${item.showInLegend ? "checked" : ""} data-manual-field="showInLegend" data-manual-id="${item.id}" data-manual-type="${item.type}" /></td>
        <td><button class="row-delete" type="button" data-manual-delete-id="${item.id}" data-manual-delete-type="${item.type}" aria-label="Delete manual edit">X</button></td>
      `;
    elements.manualOverlaysTableBody.appendChild(row);
  });

  elements.manualOverlaysTableBody
    .querySelectorAll("input[data-manual-id]")
    .forEach((control) => {
      control.addEventListener("input", onManualOverlayFieldChange);
      control.addEventListener("change", onManualOverlayFieldChange);
    });

  elements.manualOverlaysTableBody
    .querySelectorAll("[data-manual-delete-id]")
    .forEach((button) => {
      button.addEventListener("click", async () => {
        const manualId = Number(button.dataset.manualDeleteId);
        const manualType = String(button.dataset.manualDeleteType || "");
        const removedOverlay = findSavedManualOverlay(manualId, manualType);
        if (!removedOverlay) {
          return;
        }
        removeSavedManualOverlay(manualId, manualType);
        persistManualMapEdits();
        await refreshCurrentIsochronesAfterManualOverlayChange(
          `Recalculating ${MODE_CONFIG[state.selectedMode].label.toLowerCase()} catchment after removing ${removedOverlay.displayName}.`,
          "Manual edit removed",
          `${removedOverlay.displayName} was removed from the map.`,
          "ready",
          [removedOverlay]
        );
      });
    });
}

function onManualOverlayFieldChange(event) {
  const manualId = Number(event.target.dataset.manualId);
  const manualType = String(event.target.dataset.manualType || "");
  const field = event.target.dataset.manualField;
  const overlay = findSavedManualOverlay(manualId, manualType);
  if (!overlay || !field) {
    return;
  }

  if (event.target.type === "checkbox") {
    overlay[field] = event.target.checked;
  } else {
    overlay[field] = event.target.value;
  }

  persistManualMapEdits();

  if (event.target.type === "text") {
    renderMap();
    renderMethodNote();
    return;
  }

  render();
}

function doesManualOverlayAffectMode(overlay, mode = state.selectedMode) {
  if (!overlay || mode === "bus") {
    return false;
  }
  if (overlay.type === "shared-path" || overlay.type === "bridge-crossing" || overlay.type === "barrier-line") {
    return true;
  }
  if (mode === "walking") {
    return overlay.type === "walking-path";
  }
  if (mode === "cycling") {
    return overlay.type === "cycling-path";
  }
  return false;
}

function shouldRefreshCurrentIsochroneForManualOverlays(overlays) {
  return Boolean(
    state.generatedScenario &&
    state.hasGeneratedDraft &&
    state.selectedMode !== "bus" &&
    Array.isArray(overlays) &&
    overlays.some((overlay) => doesManualOverlayAffectMode(overlay, state.selectedMode))
  );
}

async function refreshCurrentIsochronesAfterManualOverlayChange(
  statusText,
  fallbackTitle,
  fallbackText,
  fallbackTone,
  overlays = []
) {
  if (shouldRefreshCurrentIsochroneForManualOverlays(overlays)) {
    await refreshLiveContext(statusText);
    return;
  }
  setStatus(fallbackTitle, fallbackText, fallbackTone);
  render();
}

function findSavedManualOverlay(manualId, manualType) {
  return manualType === "exclusion-area"
    ? state.isochroneExclusionAreas.find((item) => item.id === manualId)
    : state.manualLineEdits.find((item) => item.id === manualId && item.type === manualType);
}

function removeSavedManualOverlay(manualId, manualType) {
  if (manualType === "exclusion-area") {
    state.isochroneExclusionAreas = state.isochroneExclusionAreas.filter((item) => item.id !== manualId);
    return;
  }
  state.manualLineEdits = state.manualLineEdits.filter((item) => !(item.id === manualId && item.type === manualType));
}

function onAmenityFieldChange(event) {
  const amenityId = Number(event.target.dataset.id);
  const field = event.target.dataset.field;
  const amenity = state.amenities.find((item) => item.id === amenityId);
  if (!amenity) {
    return;
  }

  if (event.target.type === "checkbox") {
    amenity[field] = event.target.checked;
  } else {
    amenity[field] = event.target.value;
  }

  if (event.target.type === "text") {
    renderMap();
    renderMethodNote();
    return;
  }

  render();
}

function renderMap() {
  const config = MODE_CONFIG[state.selectedMode];
  const scenario = state.generatedScenario ?? buildGeneratedScenario(
    parseCoordinatePair(DEFAULT_SITE_COORDINATES),
    parseCoordinatePair(DEFAULT_ACCESS_COORDINATES, true)
  );
  const mapView = state.currentMapView ?? buildBestFitMapView(
    scenario,
    state.isochrones,
    config.zoom,
    Number(elements.mapZoomAdjust.value)
  );
  state.currentMapView = mapView;
  const site = projectLatLonToSvg(
    scenario.siteCoordinates.latitude,
    scenario.siteCoordinates.longitude,
    mapView
  );
  const accessProvided = Boolean(scenario.accessCoordinates);
  const showAccessMarker = accessProvided && state.selectedMode !== "bus";
  const access = accessProvided
    ? projectLatLonToSvg(
        scenario.accessCoordinates.latitude,
        scenario.accessCoordinates.longitude,
        mapView
      )
    : site;
  const basemapMarkup = buildTileLayerMarkup(mapView);
  const visibleAmenities = state.amenities.filter((item) =>
    item.visible && (state.selectedMode !== "bus" || item.category === "Settlement")
  );
  const legendItems = state.selectedMode === "bus"
    ? []
    : [...visibleAmenities.filter((item) => item.showInLegend)].sort((a, b) =>
        compareAmenitiesForLegend(a, b, state.selectedMode)
      );
  const configuredBands = getConfiguredBandsForMode(state.selectedMode);
  elements.previewNote.textContent =
    state.selectedMode === "bus"
      ? `${elements.busNote.value} ${getBusContourSourceNote()}`
      : state.selectedMode === "cycling"
        ? "Cycling mode shows settlements and key destinations from OpenStreetMap. Cycling isochrones are generated from a local OpenStreetMap-derived network with user-authored links and barrier edits applied before polygon generation."
        : "Basemap and amenities are drawn from OpenStreetMap live services. Walking isochrones are generated from a local OpenStreetMap-derived network with dedicated pedestrian links, tagged sidewalks and user-authored links/barriers considered before polygon generation.";

  const legendInside = elements.legendPosition.value === "inside";
  const legendX = legendInside ? 650 : 742;
  const legendWidth = legendInside ? 248 : 190;

  const isochroneMarkup = buildIsochroneLayerMarkup(state.isochrones, mapView);
  const exclusionMaskMarkup = buildIsochroneExclusionMaskMarkup(state.isochroneExclusionAreas, mapView);
  const exclusionBoundaryMarkup = buildIsochroneExclusionBoundaryMarkup(
    isochroneMarkup.layers,
    state.isochroneExclusionAreas,
    mapView
  );
  const manualLineMarkup = buildManualLineOverlayMarkup(state.manualLineEdits, mapView);
  const draftMarkup = buildDraftDrawingMarkup(mapView);
  const pointMarkup = buildAmenityDisplayItems(visibleAmenities, mapView, site, state.selectedMode)
    .map((item) => item.labelOnly
      ? `
        <text x="${item.x}" y="${item.y}" font-size="13" fill="#1d2328" stroke="#fffdf8" stroke-width="3.2" paint-order="stroke" font-family="Inter, Arial, sans-serif" font-weight="700" text-anchor="middle">${escapeHtml(item.name)}</text>
      `
      : `
        <g transform="translate(${item.x} ${item.y})">
          ${drawSymbol(item.symbol, item.color, 8.5, true)}
        </g>
      `
    )
    .join("");

  const legendRows = [
    { name: "Development site", type: "site-marker", color: "#1d2328" },
    ...(showAccessMarker ? [{ name: "Proposed access", type: "access-marker", color: "#b35b3d" }] : []),
    ...configuredBands.map((band) => ({
      name: `${config.label} ${band.label}`,
      type: "band",
      color: band.fill,
    })),
    ...buildManualOverlayLegendRows(),
    ...legendItems.map((item) => ({
      name: getLegendLabelForAmenity(item, state.selectedMode),
      type: "amenity",
      symbol: item.symbol,
      color: item.color,
    })),
  ];
  elements.legendCount.textContent = String(legendRows.length);

  const legendBoxY = 28;
  const legendPaddingX = 16;
  const legendPaddingTop = 14;
  const legendLayout = buildLegendLayout(legendRows, legendWidth, legendX, legendBoxY, legendPaddingX, legendPaddingTop);
  const legendHeight = legendLayout.height;
  const legendRowMarkup = legendLayout.markup;

  const siteMarker = drawDevelopmentSiteMarker(site.x, site.y, false);

  const accessMarker = showAccessMarker ? drawAccessMarker(access.x, access.y, false) : "";
  const projectDisplayName = elements.projectName.value || "Unnamed project";
  const authorityDisplayName = elements.planningAuthority.value || "Planning authority to be confirmed";
  const titleBoxMarkup = buildMapTitleBlock(projectDisplayName, authorityDisplayName);

  elements.mapPreview.innerHTML = `
    <rect width="960" height="640" fill="#f2efe6"></rect>
    <rect x="24" y="24" width="912" height="592" fill="#f8f5ee" stroke="#d7d0c4" stroke-width="1.5"></rect>
    ${basemapMarkup}
    ${exclusionMaskMarkup}
    <g opacity="0.82">
      <g${exclusionMaskMarkup ? ' mask="url(#isochrone-fill-mask)"' : ""}>
        ${isochroneMarkup.fillMarkup}
        ${isochroneMarkup.strokeMarkup}
      </g>
      ${exclusionBoundaryMarkup}
    </g>
    ${manualLineMarkup}
    ${draftMarkup}
    ${pointMarkup}
    ${siteMarker}
    ${accessMarker}
    <g>
      <rect x="${legendX}" y="${legendBoxY}" width="${legendWidth}" height="${legendHeight}" fill="#fffdf8" stroke="#d7d0c4"></rect>
      ${legendRowMarkup}
    </g>
    <g>
      ${buildScaleBarMarkup(mapView)}
    </g>
    <g transform="translate(862 560)">
      <path d="M0 -28 L10 0 L0 28 L-10 0 Z" fill="#1d2328"></path>
      <text x="-5" y="-36" font-size="13" fill="#1d2328" font-family="Inter, Arial, sans-serif" font-weight="700">N</text>
    </g>
    ${titleBoxMarkup}
  `;
  elements.mapPreview.style.cursor =
    state.isPlacingPoint || state.activeDrawingTool ? "crosshair" : state.isDraggingMap ? "grabbing" : "grab";
}

function buildDraftScenarioFromInputs() {
  const siteCoordinates = parseCoordinatePair(elements.siteCoordinates.value);
  if (!siteCoordinates) {
    return null;
  }

  const accessCoordinates = parseCoordinatePair(elements.accessCoordinates.value, true);
  if (elements.accessCoordinates.value.trim() !== "" && !accessCoordinates) {
    return null;
  }

  return buildGeneratedScenario(siteCoordinates, accessCoordinates);
}

function pruneAutoAmenities() {
  state.amenities = state.amenities.filter((item) => item.isManual);
}

function clearGeneratedOutputsForScenarioChange() {
  state.isochrones = [];
  state.hasGeneratedDraft = false;
  state.lastIsochroneFallbackNotice = "";
  state.lastIsochroneSourceNote = "";
  pruneAutoAmenities();
}

function getActiveScenarioForPreview() {
  return state.generatedScenario ?? buildDraftScenarioFromInputs() ?? buildGeneratedScenario(
    parseCoordinatePair(DEFAULT_SITE_COORDINATES),
    parseCoordinatePair(DEFAULT_ACCESS_COORDINATES, true)
  );
}

function getDefaultPreviewMapView(scenario = getActiveScenarioForPreview()) {
  return buildBestFitMapView(
    scenario,
    state.hasGeneratedDraft ? state.isochrones : [],
    MODE_CONFIG[state.selectedMode].zoom,
    Number(elements.mapZoomAdjust.value)
  );
}

function cancelMapViewAnimation() {
  if (state.mapViewAnimationFrameId != null) {
    cancelAnimationFrame(state.mapViewAnimationFrameId);
  }
  state.mapViewAnimationFrameId = null;
  state.mapViewAnimationStartTime = 0;
  state.mapViewAnimationDurationMs = 0;
  state.mapViewAnimationFrom = null;
  state.mapViewAnimationTo = null;
}

function interpolateMapView(fromView, toView, progress) {
  return {
    zoom: fromView.zoom + (toView.zoom - fromView.zoom) * progress,
    topLeft: {
      x: fromView.topLeft.x + (toView.topLeft.x - fromView.topLeft.x) * progress,
      y: fromView.topLeft.y + (toView.topLeft.y - fromView.topLeft.y) * progress,
    },
  };
}

function animateMapViewTo(targetView, durationMs = 350) {
  if (!targetView) {
    return;
  }

  cancelMapViewAnimation();
  const fromView = state.currentMapView ?? getDefaultPreviewMapView();
  const toView = { zoom: targetView.zoom, topLeft: { ...targetView.topLeft } };
  state.currentMapView = fromView;
  state.mapViewAnimationFrom = fromView;
  state.mapViewAnimationTo = toView;
  state.mapViewAnimationDurationMs = durationMs;
  state.mapViewAnimationStartTime = performance.now();

  const step = (timestamp) => {
    const elapsed = timestamp - state.mapViewAnimationStartTime;
    const rawProgress = Math.min(1, elapsed / state.mapViewAnimationDurationMs);
    const easedProgress = 1 - (1 - rawProgress) * (1 - rawProgress) * (1 - rawProgress);
    state.currentMapView = interpolateMapView(
      state.mapViewAnimationFrom,
      state.mapViewAnimationTo,
      easedProgress
    );
    renderMap();

    if (rawProgress >= 1) {
      state.currentMapView = state.mapViewAnimationTo;
      cancelMapViewAnimation();
      renderMap();
      return;
    }

    state.mapViewAnimationFrameId = requestAnimationFrame(step);
  };

  state.mapViewAnimationFrameId = requestAnimationFrame(step);
}

function renderMethodNote() {
  const config = MODE_CONFIG[state.selectedMode];
  const scenario = state.generatedScenario;
  const visibleCount = state.amenities.filter((item) => item.visible).length;
  const legendCount = state.amenities.filter((item) => item.visible && item.showInLegend).length;
  const generatedDate = new Date().toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const note = {
    project_name: elements.projectName.value || "Unnamed project",
    planning_authority: elements.planningAuthority.value || "To be confirmed",
    draft_mode: config.label,
    site_coordinates: scenario?.siteCoordinates ?? "Awaiting valid coordinates",
    access_coordinates:
      scenario?.accessCoordinates ?? "Using site coordinates as routing origin",
    draft_bands: getSelectedBandLabels(),
    methodology: {
      status: "Prototype front-end only",
      map_preview:
        state.selectedMode === "bus"
          ? `OpenStreetMap raster tiles with live OpenStreetMap amenity points. ${getBusContourSourceNote()}`
          : state.selectedMode === "walking"
            ? "OpenStreetMap raster tiles with live Overpass amenity points and a locally generated OpenStreetMap walking network catchment with user-authored network edits applied before polygon generation"
            : "OpenStreetMap raster tiles with live Overpass amenity points and a locally generated OpenStreetMap cycling network catchment with user-authored network edits applied before polygon generation",
      amenity_filtering:
        state.selectedMode === "cycling"
          ? `${visibleCount} visible cycling destinations, ${legendCount} shown in legend, fetched from OpenStreetMap around the current site and measured from the site coordinates`
          : `${visibleCount} visible amenities, ${legendCount} shown in legend, fetched from OpenStreetMap around the current site`,
      cycling_time_assumption:
        state.selectedMode === "cycling" ? CYCLING_TIME_GUIDANCE_TEXT : undefined,
      bus_assumption: elements.busNote.value,
      public_transport_method:
        state.selectedMode === "bus" ? getBusContourSourceNote() : undefined,
      public_transport_assessment_date:
        state.selectedMode === "bus" ? getSelectedBusDate() : undefined,
      public_transport_departure_time:
        state.selectedMode === "bus" ? getSelectedBusTime() : undefined,
      public_transport_source:
        state.selectedMode === "bus" ? getBusContourSourceNote() : undefined,
      public_transport_diagnostics:
        state.selectedMode === "bus" ? buildBusIsochroneDiagnosticsForMethodNote(state.isochrones?.metadata) : undefined,
      manual_map_edits: {
        proposed_manual_line_edits: state.manualLineEdits.map((item) => ({
          line_type: getDrawingToolConfig(item.type)?.displayName || item.type,
          display_name: item.displayName,
          point_count: item.points.length,
          shown_in_legend: item.showInLegend !== false,
          mode_created_in: item.modeCreated || undefined,
        })),
        isochrone_exclusion_areas: state.isochroneExclusionAreas.map((item) => ({
          exclusion_area_name: item.displayName,
          point_count: item.points.length,
          shown_in_legend: item.showInLegend !== false,
          mode_created_in: item.modeCreated || undefined,
        })),
      },
      limitations: [
        state.selectedMode === "bus"
          ? buildBusMethodLimitationText()
          : "Walking and cycling isochrones depend on OpenStreetMap network completeness and tagging quality, including the presence or absence of dedicated pedestrian links, sidewalk tags, access restrictions and cycle permissions.",
        "Amenities are fetched live from OpenStreetMap via Overpass and therefore depend on current public service availability.",
        MANUAL_EDIT_LIMITATION_TEXT,
        "The scale bar should still be checked against the final export workflow before issue.",
      ],
    },
    note: elements.projectNote.value,
    generated: generatedDate,
  };

  elements.methodNote.textContent = JSON.stringify(note, null, 2);
}

async function runGenerationSequence() {
  clearGenerationTimers();
  const siteCoordinates = parseCoordinatePair(elements.siteCoordinates.value);
  const accessCoordinates = parseCoordinatePair(elements.accessCoordinates.value, true);
  const busSpeedIsValid = updateBusSpeedValidationState();
  const busMaxWalkIsValid = updateBusMaxWalkValidationState();

  if (!siteCoordinates) {
    setStatus(
      "Coordinate format issue",
      "Enter site coordinates as 'latitude, longitude' in decimal degrees.",
      "error"
    );
    render();
    return;
  }

  if (elements.accessCoordinates.value.trim() !== "" && !accessCoordinates) {
    setStatus(
      "Coordinate format issue",
      "Enter access coordinates as 'latitude, longitude' or leave the field blank.",
      "error"
    );
    render();
    return;
  }

  if (state.selectedMode === "bus" && !busSpeedIsValid) {
    setStatus("Check bus speed", getBusSpeedValidationMessage(), "error");
    render();
    return;
  }

  if (state.selectedMode === "bus" && !busMaxWalkIsValid) {
    setStatus("Check bus stop walk distance", getBusMaxWalkValidationMessage(), "error");
    render();
    return;
  }

  state.generatedScenario = buildGeneratedScenario(siteCoordinates, accessCoordinates);
  state.hasGeneratedDraft = true;
  schedulePlanningAuthorityLookup(siteCoordinates);
  setStatus("Draft generation started", "Checking inputs and fetching live OpenStreetMap context.", "running");
  render();
  await refreshLiveContext("Querying OpenStreetMap amenities for the current site.");
}

function setStatus(title, text, tone) {
  state.status = { title, text, tone };
}

function saveOverrides() {
  const overrideEntries = state.amenities
    .filter((item) => item.sourceId)
    .map((item) => [
      item.sourceId,
      {
        name: item.name,
        category: item.category,
        symbol: item.symbol,
        color: item.color,
        visible: item.visible,
        showInLegend: item.showInLegend,
      },
    ]);
  state.savedOverrides = Object.fromEntries(overrideEntries);
  localStorage.setItem("prime-isochrone-overrides", JSON.stringify(state.savedOverrides));
  setStatus("Overrides saved", "Amenity edits were saved on this device.", "ready");
  render();
}

async function resetOverrides() {
  localStorage.removeItem("prime-isochrone-overrides");
  state.savedOverrides = {};
  setStatus("Defaults restored", "Saved overrides were cleared from this device.", "ready");
  await refreshLiveContext("Refreshing live OpenStreetMap amenities without local overrides.");
}

function updateManualPointButtonState() {
  elements.togglePlacePointButton.classList.toggle("toggle-live", state.isPlacingPoint);
  elements.togglePlacePointButton.setAttribute("aria-pressed", String(state.isPlacingPoint));
  elements.togglePlacePointButton.textContent = state.isPlacingPoint
    ? "Click map to place point"
    : "Place manual point";
}

function updateManualEditControls() {
  elements.drawingToolButtons.forEach((button) => {
    const isActiveTool = button.dataset.drawingTool === state.activeDrawingTool;
    button.classList.toggle("is-active", isActiveTool);
    button.setAttribute("aria-pressed", String(isActiveTool));
  });

  if (elements.manualEditStatus) {
    const savedCount = state.manualLineEdits.length + state.isochroneExclusionAreas.length;
    if (state.activeDrawingTool) {
      const toolConfig = getDrawingToolConfig(state.activeDrawingTool);
      const minimumPoints = toolConfig?.geometryType === "polygon" ? 3 : 2;
      elements.manualEditStatus.textContent = `${toolConfig.displayName} active. ${state.draftDrawingPoints.length} point${state.draftDrawingPoints.length === 1 ? "" : "s"} captured. ${minimumPoints} required to finish. ${savedCount} saved manual edit${savedCount === 1 ? "" : "s"} on this device.`;
    } else {
      elements.manualEditStatus.textContent = `${savedCount} saved manual edit${savedCount === 1 ? "" : "s"} on this device. Select a drawing tool to add proposed routes, barriers or isochrone exclusion areas.`;
    }
  }

  if (elements.finishDrawingButton) {
    elements.finishDrawingButton.disabled = !state.activeDrawingTool;
  }
  if (elements.cancelDrawingButton) {
    elements.cancelDrawingButton.disabled = !state.activeDrawingTool && state.draftDrawingPoints.length === 0;
  }
  if (elements.clearLastManualEditButton) {
    elements.clearLastManualEditButton.disabled =
      state.manualLineEdits.length === 0 && state.isochroneExclusionAreas.length === 0;
  }
  if (elements.clearAllManualEditsButton) {
    elements.clearAllManualEditsButton.disabled =
      state.manualLineEdits.length === 0 &&
      state.isochroneExclusionAreas.length === 0 &&
      state.draftDrawingPoints.length === 0 &&
      !state.activeDrawingTool;
  }

  updateManualPointButtonState();
}

function getDrawingToolConfig(toolKey) {
  return DRAWING_TOOL_CONFIG[toolKey] || null;
}

function getManualOverlayDefaultName(toolKey, nextOrdinal = 1) {
  const toolConfig = getDrawingToolConfig(toolKey);
  return `${toolConfig?.displayName || "Manual edit"} ${nextOrdinal}`;
}

function getNextManualOverlayOrdinal(toolKey) {
  if (toolKey === "exclusion-area") {
    return state.isochroneExclusionAreas.length + 1;
  }
  return state.manualLineEdits.filter((item) => item.type === toolKey).length + 1;
}

function clearDraftDrawing() {
  state.draftDrawingPoints = [];
}

function deactivateDrawingTool(clearDraft = true) {
  state.activeDrawingTool = "";
  if (clearDraft) {
    clearDraftDrawing();
  }
}

function activateDrawingTool(toolKey) {
  const toolConfig = getDrawingToolConfig(toolKey);
  if (!toolConfig) {
    return;
  }

  if (state.activeDrawingTool === toolKey) {
    deactivateDrawingTool(true);
    setStatus("Drawing tool closed", "Manual line drawing has been switched off.", "ready");
    render();
    return;
  }

  const draftHadPoints = state.draftDrawingPoints.length > 0;
  deactivateDrawingTool(true);
  state.isPlacingPoint = false;
  state.activeDrawingTool = toolKey;
  setStatus(
    toolConfig.geometryType === "polygon" ? "Exclusion drawing active" : "Line drawing active",
    draftHadPoints
      ? `The previous draft was cleared. Click within the map preview to draw ${toolConfig.displayName.toLowerCase()}.`
      : `Click within the map preview to draw ${toolConfig.displayName.toLowerCase()}.`,
    "active"
  );
  render();
}

function togglePlacePointMode() {
  const nextState = !state.isPlacingPoint;
  if (nextState) {
    if (state.activeDrawingTool || state.draftDrawingPoints.length > 0) {
      deactivateDrawingTool(true);
      setStatus(
        "Placement mode active",
        "Manual line drawing was cleared so a manual point can be placed. Click within the map preview to add a manual point.",
        "active"
      );
    } else {
      setStatus("Placement mode active", "Click within the map preview to add a manual point.", "active");
    }
  } else {
    setStatus("Placement mode closed", "Manual point placement has been cancelled.", "ready");
  }
  state.isPlacingPoint = nextState;
  render();
}

function onDocumentKeyDown(event) {
  if (event.key !== "Escape" || event.defaultPrevented) {
    return;
  }

  if (state.activeDrawingTool || state.draftDrawingPoints.length > 0) {
    event.preventDefault();
    cancelCurrentDrawing();
    return;
  }

  if (state.isPlacingPoint) {
    event.preventDefault();
    state.isPlacingPoint = false;
    setStatus("Placement mode closed", "Manual point placement has been cancelled.", "ready");
    render();
  }
}

function getMapClickCoordinate(event) {
  const svg = event.currentTarget;
  const bounds = svg.getBoundingClientRect();
  const viewBox = svg.viewBox.baseVal;
  const clickX = ((event.clientX - bounds.left) / bounds.width) * viewBox.width;
  const clickY = ((event.clientY - bounds.top) / bounds.height) * viewBox.height;
  const scenario = state.generatedScenario;
  const mapView = state.currentMapView ?? buildBestFitMapView(
    scenario ?? buildGeneratedScenario(
      parseCoordinatePair(DEFAULT_SITE_COORDINATES),
      parseCoordinatePair(DEFAULT_ACCESS_COORDINATES, true)
    ),
    state.isochrones,
    MODE_CONFIG[state.selectedMode].zoom
  );
  return unprojectSvgToLatLon(clickX, clickY, mapView);
}

async function finishCurrentDrawing() {
  if (!state.activeDrawingTool) {
    setStatus("Select a drawing tool", "Choose a manual drawing tool before finishing a draft.", "warning");
    render();
    return;
  }

  const toolConfig = getDrawingToolConfig(state.activeDrawingTool);
  const minimumPoints = toolConfig.geometryType === "polygon" ? 3 : 2;
  if (state.draftDrawingPoints.length < minimumPoints) {
    setStatus(
      "More points needed",
      toolConfig.geometryType === "polygon"
        ? "An isochrone exclusion area needs at least three points before it can be finished."
        : "A manual line needs at least two points before it can be finished.",
      "warning"
    );
    render();
    return;
  }

  const overlayId = state.nextManualOverlayId++;
  const customName = elements.manualOverlayName?.value.trim();
  const overlay = {
    id: overlayId,
    type: state.activeDrawingTool,
    displayName: customName || getManualOverlayDefaultName(state.activeDrawingTool, getNextManualOverlayOrdinal(state.activeDrawingTool)),
    points: state.draftDrawingPoints.map((point) => ({ latitude: point.latitude, longitude: point.longitude })),
    showInLegend: true,
    modeCreated: state.selectedMode,
  };

  if (toolConfig.geometryType === "polygon") {
    state.isochroneExclusionAreas.push(overlay);
  } else {
    state.manualLineEdits.push(overlay);
  }

  persistManualMapEdits();
  clearDraftDrawing();
  if (elements.manualOverlayName) {
    elements.manualOverlayName.value = "";
  }
  await refreshCurrentIsochronesAfterManualOverlayChange(
    `Recalculating ${MODE_CONFIG[state.selectedMode].label.toLowerCase()} catchment after saving ${overlay.displayName}.`,
    toolConfig.geometryType === "polygon" ? "Isochrone exclusion saved" : "Manual line saved",
    `${overlay.displayName} has been added to the map preview and will be included in SVG and PNG exports.`,
    "ready",
    [overlay]
  );
}

function cancelCurrentDrawing() {
  if (!state.activeDrawingTool && state.draftDrawingPoints.length === 0) {
    setStatus("Nothing to cancel", "There is no active manual drawing to clear.", "warning");
    render();
    return;
  }

  deactivateDrawingTool(true);
  setStatus("Drawing cancelled", "The current manual drawing tool has been closed. Saved manual edits were left in place.", "ready");
  render();
}

async function clearLastManualEdit() {
  const latestOverlay = getAllSavedManualOverlays().slice(-1)[0];
  if (!latestOverlay) {
    setStatus("No manual edits saved", "There is no saved manual edit to remove.", "warning");
    render();
    return;
  }

  if (latestOverlay.type === "exclusion-area") {
    state.isochroneExclusionAreas = state.isochroneExclusionAreas.filter((item) => item.id !== latestOverlay.id);
  } else {
    state.manualLineEdits = state.manualLineEdits.filter((item) => item.id !== latestOverlay.id);
  }

  persistManualMapEdits();
  await refreshCurrentIsochronesAfterManualOverlayChange(
    `Recalculating ${MODE_CONFIG[state.selectedMode].label.toLowerCase()} catchment after removing ${latestOverlay.displayName}.`,
    "Last manual edit cleared",
    `${latestOverlay.displayName} was removed from the map.`,
    "ready",
    [latestOverlay]
  );
}

async function clearAllManualEdits() {
  const hadSavedEdits = state.manualLineEdits.length > 0 || state.isochroneExclusionAreas.length > 0;
  const hadDraft = state.draftDrawingPoints.length > 0 || Boolean(state.activeDrawingTool);
  const clearedOverlays = getAllSavedManualOverlays();
  state.manualLineEdits = [];
  state.isochroneExclusionAreas = [];
  deactivateDrawingTool(true);
  persistManualMapEdits();
  await refreshCurrentIsochronesAfterManualOverlayChange(
    `Recalculating ${MODE_CONFIG[state.selectedMode].label.toLowerCase()} catchment after clearing manual overlays.`,
    "Manual edits cleared",
    hadSavedEdits || hadDraft
      ? "All saved manual overlays and draft drawing points were cleared from this device."
      : "There were no manual edits to clear.",
    hadSavedEdits || hadDraft ? "ready" : "warning",
    clearedOverlays
  );
}

function getAllSavedManualOverlays() {
  return [...state.manualLineEdits, ...state.isochroneExclusionAreas].sort((a, b) => a.id - b.id);
}

function persistManualMapEdits() {
  localStorage.setItem(
    MANUAL_OVERLAY_STORAGE_KEY,
    JSON.stringify({
      manualLineEdits: state.manualLineEdits,
      isochroneExclusionAreas: state.isochroneExclusionAreas,
      nextManualOverlayId: state.nextManualOverlayId,
    })
  );
}

function applySavedManualMapEdits(savedEdits) {
  state.manualLineEdits = savedEdits.manualLineEdits;
  state.isochroneExclusionAreas = savedEdits.isochroneExclusionAreas;
  state.nextManualOverlayId = savedEdits.nextManualOverlayId;
}

function loadSavedManualMapEdits() {
  const fallback = {
    manualLineEdits: [],
    isochroneExclusionAreas: [],
    nextManualOverlayId: 1,
  };
  const raw = localStorage.getItem(MANUAL_OVERLAY_STORAGE_KEY);
  if (!raw) {
    return fallback;
  }

  try {
    const parsed = JSON.parse(raw);
    const manualLineEdits = Array.isArray(parsed?.manualLineEdits)
      ? parsed.manualLineEdits.map(normaliseSavedManualOverlay).filter(Boolean)
      : [];
    const isochroneExclusionAreas = Array.isArray(parsed?.isochroneExclusionAreas)
      ? parsed.isochroneExclusionAreas.map(normaliseSavedManualOverlay).filter(Boolean)
      : [];
    const highestId = Math.max(
      Number(parsed?.nextManualOverlayId) - 1 || 0,
      ...manualLineEdits.map((item) => item.id),
      ...isochroneExclusionAreas.map((item) => item.id)
    );
    return {
      manualLineEdits,
      isochroneExclusionAreas,
      nextManualOverlayId: highestId + 1,
    };
  } catch (error) {
    return fallback;
  }
}

function normaliseSavedManualOverlay(item) {
  if (!item || typeof item !== "object") {
    return null;
  }

  const type = String(item.type || "");
  const points = Array.isArray(item.points)
    ? item.points
      .map((point) => ({
        latitude: Number(point?.latitude),
        longitude: Number(point?.longitude),
      }))
      .filter((point) => Number.isFinite(point.latitude) && Number.isFinite(point.longitude))
    : [];

  if (!DRAWING_TOOL_CONFIG[type] || points.length === 0 || !Number.isFinite(Number(item.id))) {
    return null;
  }

  return {
    id: Number(item.id),
    type,
    displayName: String(item.displayName || getManualOverlayDefaultName(type)),
    points,
    showInLegend: item.showInLegend !== false,
    modeCreated: item.modeCreated ? String(item.modeCreated) : "",
  };
}

function onMapClick(event) {
  if (!state.isPlacingPoint && !state.activeDrawingTool) {
    return;
  }

  const coordinatePoint = getMapClickCoordinate(event);

  if (state.activeDrawingTool) {
    state.draftDrawingPoints = [
      ...state.draftDrawingPoints,
      {
        latitude: coordinatePoint.latitude,
        longitude: coordinatePoint.longitude,
      },
    ];
    render();
    return;
  }

  state.amenities.push({
    id: state.nextAmenityId++,
    name: elements.manualPointName.value || "Manual point",
    category: elements.manualPointCategory.value,
    symbol: elements.manualPointSymbol.value,
    color: "#7a5f9d",
    visible: true,
    showInLegend: true,
    sourceId: `manual-${Date.now()}`,
    latitude: coordinatePoint.latitude,
    longitude: coordinatePoint.longitude,
    isManual: true,
  });

  state.isPlacingPoint = false;
  setStatus("Manual point added", "Review the new legend entry and amend its styling if required.", "ready");
  render();
}

async function exportPng() {
  setStatus("Preparing PNG", "Building an export-safe PNG of the current map view.", "running");
  render();

  try {
    const exportSafeSvg = await buildExportSafeSvgDocument();
    const pngBlob = await rasterizeSvgToPngBlob(exportSafeSvg);
    downloadBlob(pngBlob, fileStem("png"));
    setStatus("PNG exported", "PNG map preview downloaded.", "ready");
  } catch (error) {
    setStatus(
      "PNG export error",
      "The map could not be exported to PNG from the current browser session. Please try again.",
      "error"
    );
  }
  render();
}

function exportSvg() {
  const svgMarkup = buildSvgDocument();
  downloadBlob(new Blob([svgMarkup], { type: "image/svg+xml;charset=utf-8" }), fileStem("svg"));
  setStatus("SVG exported", "Vector map preview downloaded.", "ready");
  render();
}

async function exportCsv() {
  if (state.selectedMode === "cycling") {
    const cycleRows = await buildCyclingCsvRows();
    if (!cycleRows) {
      return;
    }

    const cycleCsv = cycleRows.map((row) => row.map(csvEscape).join(",")).join("\n");
    downloadBlob(new Blob([cycleCsv], { type: "text/csv;charset=utf-8" }), fileStem("csv"));
    setStatus(
      "CSV exported",
      "Amenity schedule downloaded with routed cycling distances from the site and 16 kph cycle times.",
      "ready"
    );
    render();
    return;
  }

  const distanceReference = getCsvDistanceReferencePoint();
  const distanceSettings = getExportDistanceSettings();
  const distanceValues = await getAmenityExportDistances(
    state.amenities,
    distanceReference,
    distanceSettings
  );
  if (!distanceValues) {
    return;
  }

  const rows = distanceSettings.includeWalkingTime
    ? buildWalkingCsvRows(distanceSettings, distanceValues)
    : [
        ["name", "category", "symbol", "colour", distanceSettings.header, "visible", "show_in_legend"],
        ...state.amenities.map((item, index) => [
          item.name,
          item.category,
          item.symbol,
          item.color,
          distanceValues[index],
          item.visible,
          item.showInLegend,
        ]),
      ];
  const csv = rows.map((row) => row.map(csvEscape).join(",")).join("\n");
  downloadBlob(new Blob([csv], { type: "text/csv;charset=utf-8" }), fileStem("csv"));
  setStatus(
    "CSV exported",
    hasCsvAccessReference()
      ? `Amenity schedule downloaded with routed ${distanceSettings.label} distances from the proposed access point.`
      : `Amenity schedule downloaded with routed ${distanceSettings.label} distances from the site coordinates.`,
    "ready"
  );
  render();
}

function exportMethodNote() {
  downloadBlob(
    new Blob([elements.methodNote.textContent], { type: "application/json;charset=utf-8" }),
    fileStem("json")
  );
  setStatus("Method note exported", "JSON note downloaded for review.", "ready");
  render();
}

function buildSvgDocument() {
  const svgMarkup = elements.mapPreview.outerHTML
    .replace("<svg ", '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" ');
  return `<?xml version="1.0" encoding="UTF-8"?>${svgMarkup}`;
}

async function buildExportSafeSvgDocument() {
  const parser = new DOMParser();
  const svgDocument = parser.parseFromString(buildSvgDocument(), "image/svg+xml");
  const imageNodes = Array.from(svgDocument.querySelectorAll("image"));

  await Promise.all(
    imageNodes.map(async (imageNode) => {
      const href =
        imageNode.getAttribute("href") ||
        imageNode.getAttributeNS("http://www.w3.org/1999/xlink", "href");

      if (!href || !href.startsWith("http")) {
        return;
      }

      try {
        const dataUrl = await fetchImageAsDataUrl(href);
        imageNode.setAttribute("href", dataUrl);
        imageNode.removeAttribute("crossorigin");
      } catch (error) {
        imageNode.remove();
      }
    })
  );

  return new XMLSerializer().serializeToString(svgDocument);
}

async function fetchImageAsDataUrl(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Image request failed with status ${response.status}`);
  }

  const imageBlob = await response.blob();
  return blobToDataUrl(imageBlob);
}

function blobToDataUrl(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.onerror = () => reject(reader.error ?? new Error("FileReader failed."));
    reader.readAsDataURL(blob);
  });
}

async function rasterizeSvgToPngBlob(svgMarkup) {
  const svgBlob = new Blob([svgMarkup], { type: "image/svg+xml;charset=utf-8" });
  const svgUrl = URL.createObjectURL(svgBlob);

  try {
    const image = await loadImage(svgUrl);
    const canvas = document.createElement("canvas");
    canvas.width = MAP_DIMENSIONS.width;
    canvas.height = MAP_DIMENSIONS.height;
    const context = canvas.getContext("2d");
    if (!context) {
      throw new Error("Canvas 2D context is not available.");
    }

    context.drawImage(image, 0, 0, canvas.width, canvas.height);
    const pngBlob = await canvasToBlob(canvas, "image/png");
    if (!pngBlob) {
      throw new Error("Canvas export returned no PNG data.");
    }
    return pngBlob;
  } finally {
    URL.revokeObjectURL(svgUrl);
  }
}

function loadImage(url) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("Image load failed."));
    image.src = url;
  });
}

function canvasToBlob(canvas, type) {
  return new Promise((resolve) => {
    canvas.toBlob(resolve, type);
  });
}

function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  setTimeout(() => URL.revokeObjectURL(url), 500);
}

function fileStem(extension) {
  const cleanName = (elements.projectName.value || "isochrone-draft")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  return `${cleanName || "isochrone-draft"}-${state.selectedMode}.${extension}`;
}

function getCsvDistanceReferencePoint() {
  if (state.selectedMode === "cycling") {
    return (
      state.generatedScenario?.siteCoordinates ??
      parseCoordinatePair(elements.siteCoordinates.value) ??
      parseCoordinatePair(DEFAULT_SITE_COORDINATES)
    );
  }

  return (
    state.generatedScenario?.accessCoordinates ??
    state.generatedScenario?.siteCoordinates ??
    parseCoordinatePair(elements.accessCoordinates.value, true) ??
    parseCoordinatePair(elements.siteCoordinates.value) ??
    parseCoordinatePair(DEFAULT_SITE_COORDINATES)
  );
}

function hasCsvAccessReference() {
  return Boolean(
    state.generatedScenario?.accessCoordinates ||
    parseCoordinatePair(elements.accessCoordinates.value, true)
  );
}

function getExportDistanceSettings() {
  if (state.selectedMode === "cycling") {
    return {
      costing: "bicycle",
      header: "cycling_distance_m",
      label: "cycling",
      includeWalkingTime: false,
    };
  }

  if (state.selectedMode === "bus") {
    return {
      costing: "pedestrian",
      header: "walking_access_distance_m",
      label: "walking access",
      includeWalkingTime: false,
    };
  }

  return {
    costing: "pedestrian",
    header: "walking_distance_m",
    label: "walking",
    includeWalkingTime: true,
    walkingSpeedHeader: "walking_speed_kph",
    walkingSpeedDefault: 4.8,
    preferredMaxHeader: "preferred_max_walking_distance_m",
    walkingTimeHeader: "walking_time_mmss",
  };
}

function buildWalkingCsvRows(distanceSettings, distanceValues) {
  const dataStartRow = 4;
  return [
    [distanceSettings.walkingSpeedHeader, distanceSettings.walkingSpeedDefault],
    [],
    [
      "name",
      "category",
      "symbol",
      "colour",
      distanceSettings.header,
      distanceSettings.preferredMaxHeader,
      distanceSettings.walkingTimeHeader,
      "visible",
      "show_in_legend",
    ],
    ...state.amenities.map((item, index) => [
      item.name,
      item.category,
      item.symbol,
      item.color,
      distanceValues[index],
      getPreferredMaxWalkingDistance(item.category),
      buildWalkingTimeFormula(dataStartRow + index),
      item.visible,
      item.showInLegend,
    ]),
    ];
}

async function buildCyclingCsvRows() {
  const siteCoordinates =
    state.generatedScenario?.siteCoordinates ??
    parseCoordinatePair(elements.siteCoordinates.value) ??
    parseCoordinatePair(DEFAULT_SITE_COORDINATES);

  if (!siteCoordinates) {
    setStatus("CSV export error", "Valid site coordinates are required before exporting cycle metrics.", "error");
    render();
    return null;
  }

  const cycleMetricResult = await ensureCyclingMetrics(siteCoordinates, {
    allowFallback: true,
    statusPrefix: "CSV export",
  });

  const metricUnavailableCount = state.amenities.filter(
    (item) => item.cyclingMetricStatus === "unavailable"
  ).length;

  return [
    ["cycling_speed_kph", CYCLING_SPEED_KPH],
    ["cycle_time_note", CYCLING_TIME_GUIDANCE_TEXT],
    ...(cycleMetricResult.ok || metricUnavailableCount === 0
      ? []
      : [["cycle_metric_status", cycleMetricResult.message || "Some cycle metrics were unavailable at export time."]]),
    [],
    [
      "name",
      "category",
      "symbol",
      "colour",
      "cycling_distance_m",
      "cycling_time_mmss",
      "visible",
      "show_in_legend",
    ],
    ...state.amenities.map((item) => [
      item.name,
      item.category,
      item.symbol,
      item.color,
      Number.isFinite(item.cyclingDistanceM) ? Math.round(item.cyclingDistanceM) : "",
      Number.isFinite(item.cyclingTimeSeconds) ? formatDurationMmSs(item.cyclingTimeSeconds) : "",
      item.visible,
      item.showInLegend,
    ]),
  ];
}

function getPreferredMaxWalkingDistance(category) {
  if (category === "Bus stop") {
    return "";
  }

  if (["Rail station", "Employment", "Education"].includes(category)) {
    return 2000;
  }

  return 1200;
}

function buildWalkingTimeFormula(rowNumber) {
  return `=IF(OR(E${rowNumber}="",$B$1=""),"",TEXT((E${rowNumber}/1000)/$B$1/24,"[m]:ss"))`;
}

async function ensureCyclingMetrics(siteCoordinates, options = {}) {
  const cyclingTargets = state.amenities.filter(
    (item) =>
      item.latitude !== undefined &&
      item.longitude !== undefined &&
      (!Number.isFinite(item.cyclingDistanceM) || !Number.isFinite(item.cyclingTimeSeconds))
  );

  if (cyclingTargets.length === 0) {
    return { ok: true, message: "" };
  }

  if (!options.silent) {
    setStatus(
      "Calculating cycle metrics",
      "Working out routed cycling distances from the site and applying the 16 kph cycle-time assumption.",
      "running"
    );
    render();
  }

    try {
      const routedDistances = await fetchRoutedDistancesForTargets(
        siteCoordinates,
        cyclingTargets.map((item, index) => ({ item, index })),
        "bicycle"
    );
    cyclingTargets.forEach((item, index) => {
      const distanceMetres = routedDistances[index];
      if (!Number.isFinite(distanceMetres)) {
        item.cyclingDistanceM = null;
        item.cyclingTimeSeconds = null;
        item.cyclingMetricStatus = "unavailable";
        return;
      }

      item.cyclingDistanceM = Math.round(distanceMetres);
        item.cyclingTimeSeconds = getCyclingTimeSeconds(distanceMetres);
        item.cyclingMetricStatus = "ready";
      });
      const unavailableCount = cyclingTargets.filter(
        (item) => item.cyclingMetricStatus === "unavailable"
      ).length;
      if (unavailableCount > 0) {
        return {
          ok: false,
          message: `Cycle metrics were unavailable for ${unavailableCount} destination${unavailableCount === 1 ? "" : "s"} because routing data could not be returned for those locations.`,
        };
      }
      return { ok: true, message: "" };
    } catch (error) {
    cyclingTargets.forEach((item) => {
      item.cyclingDistanceM = null;
      item.cyclingTimeSeconds = null;
      item.cyclingMetricStatus = "unavailable";
    });

      if (!options.allowFallback && !options.silent) {
        setStatus(
          "Cycle metric issue",
          describeServiceFailure(options.statusPrefix || "Cycle metrics", error),
        "warning"
      );
      render();
    }

    return {
      ok: false,
      message: describeServiceFailure(options.statusPrefix || "Cycle metrics", error),
    };
  }
}

function getCyclingTimeSeconds(distanceMetres) {
  return Math.round((Number(distanceMetres) / 1000 / CYCLING_SPEED_KPH) * 3600);
}

function formatDurationMmSs(totalSeconds) {
  if (!Number.isFinite(totalSeconds) || totalSeconds < 0) {
    return "";
  }
  const roundedSeconds = Math.round(totalSeconds);
  const minutes = Math.floor(roundedSeconds / 60);
  const seconds = roundedSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

function formatDistanceMetres(distanceMetres) {
  if (!Number.isFinite(distanceMetres) || distanceMetres < 0) {
    return "";
  }
  return `${Math.round(distanceMetres).toLocaleString("en-GB")} m`;
}

function getAmenityDistanceDisplay(item, mode) {
  if (mode === "cycling") {
    return formatDistanceMetres(item.cyclingDistanceM);
  }
  return "";
}

function getAmenityTimeDisplay(item, mode) {
  if (mode === "cycling") {
    return formatDurationMmSs(item.cyclingTimeSeconds);
  }
  return "";
}

function getLegendLabelForAmenity(item, mode) {
  return item.name;
}

async function fetchRoutedDistancesForTargets(referencePoint, routedTargets, costing) {
  const exportDistances = new Array(routedTargets.length).fill("");
  const batchSize = 3;

  for (let batchStart = 0; batchStart < routedTargets.length; batchStart += batchSize) {
    const batch = routedTargets.slice(batchStart, batchStart + batchSize);
    const batchResults = await Promise.all(
      batch.map(async ({ item }) => {
        const payload = {
          locations: [
            {
              lat: referencePoint.latitude,
              lon: referencePoint.longitude,
            },
            {
              lat: item.latitude,
              lon: item.longitude,
            },
          ],
          costing,
          units: "kilometers",
          directions_options: {
            units: "kilometers",
          },
        };

        const routePayload = await fetchJsonWithDiagnostics(
          `${VALHALLA_ROUTE_ENDPOINT}?json=${encodeURIComponent(JSON.stringify(payload))}`,
          undefined,
          "Valhalla route"
        );

        if (routePayload.error) {
          throw createServiceError(
            "Valhalla route",
            classifyRoutingPayloadKind(routePayload.error),
            buildServiceKindMessage(
              "Valhalla route",
              classifyRoutingPayloadKind(routePayload.error),
              normaliseServiceMessage("Valhalla route", routePayload.error)
            )
          );
        }

        const distanceKilometres = routePayload.trip?.summary?.length;
        return distanceKilometres === null || distanceKilometres === undefined
          ? ""
          : Math.round(Number(distanceKilometres) * 1000);
      })
    );

    batchResults.forEach((distanceValue, batchIndex) => {
      exportDistances[batchStart + batchIndex] = distanceValue;
    });
  }

  return exportDistances;
}

async function fetchJsonWithDiagnostics(url, options, serviceName, timeoutMs = SERVICE_TIMEOUT_MS[serviceName] ?? 8000) {
  let response;
  const abortController = new AbortController();
  const timeoutHandle = setTimeout(() => abortController.abort(), timeoutMs);
  let removeAbortListener = null;
  if (options?.signal) {
    if (options.signal.aborted) {
      abortController.abort();
    } else {
      const onAbort = () => abortController.abort();
      options.signal.addEventListener("abort", onAbort, { once: true });
      removeAbortListener = () => options.signal.removeEventListener("abort", onAbort);
    }
  }
  const requestOptions = {
    ...(options ?? {}),
    signal: abortController.signal,
  };

  try {
    response = await fetch(url, requestOptions);
  } catch (error) {
    clearTimeout(timeoutHandle);
    removeAbortListener?.();
    if (options?.signal?.aborted) {
      throw createServiceError(
        serviceName,
        "cancelled",
        `${serviceName} request was cancelled.`
      );
    }
    if (error?.name === "AbortError") {
      throw createServiceError(
        serviceName,
        "api_outage",
        `${serviceName} did not respond within ${Math.round(timeoutMs / 1000)} seconds. Public Overpass mirrors can be slow; try again in a few minutes or reduce the search area if the issue persists.`
      );
    }
    throw createServiceError(
      serviceName,
      "connectivity",
      `${serviceName} could not be reached. Check connectivity and try again.`
    );
  }

  const responseText = await response.text();
  clearTimeout(timeoutHandle);
  removeAbortListener?.();
  let payload = null;
  if (responseText) {
    try {
      payload = JSON.parse(responseText);
    } catch (error) {
      payload = null;
    }
  }

  if (!response.ok) {
    throw classifyServiceResponseError(serviceName, response.status, responseText, payload);
  }

  if (payload !== null) {
    return payload;
  }

  if (!responseText.trim()) {
    return {};
  }

  throw createServiceError(
    serviceName,
    "malformed_request",
    `${serviceName} returned a response that could not be read.`
  );
}

function classifyServiceResponseError(serviceName, status, responseText, payload) {
  const responseMessage = normaliseServiceMessage(
    serviceName,
    [payload?.error, payload?.details?.message, payload?.details?.detail, payload?.message, responseText]
      .filter(Boolean)
      .join(" ")
  );
  const routingKind = classifyRoutingPayloadKind(responseMessage);

  if (status === 429) {
    return createServiceError(
      serviceName,
      "rate_limit",
      `${serviceName} has rate-limited the request. Please wait a moment and try again.`
    );
  }

  if (status >= 500) {
    const detailText = responseMessage ? ` ${responseMessage}` : "";
    return createServiceError(
      serviceName,
      "api_outage",
      `${serviceName} is temporarily unavailable or overloaded. Please try again shortly.${detailText}`
    );
  }

  if (status === 400 || status === 404 || status === 422) {
    return createServiceError(
      serviceName,
      routingKind,
      buildServiceKindMessage(serviceName, routingKind, responseMessage)
    );
  }

  return createServiceError(
    serviceName,
    "api_outage",
    `${serviceName} returned status ${status}. ${responseMessage}`
  );
}

function buildServiceKindMessage(serviceName, kind, detail) {
  if (kind === "invalid_site_location") {
    return `${serviceName} could not use the selected site coordinates. Check that the site point is valid and located in the expected area.`;
  }
  if (kind === "unavailable_routing_data") {
    return `${serviceName} could not find usable routing data for the selected location. ${detail}`;
  }
  if (kind === "malformed_request") {
    return `${serviceName} rejected the request format. ${detail}`;
  }
  return detail;
}

function classifyRoutingPayloadKind(message) {
  const lowerMessage = String(message || "").toLowerCase();
  if (
    lowerMessage.includes("no suitable edges") ||
    lowerMessage.includes("no path could be found") ||
    lowerMessage.includes("not located on") ||
    lowerMessage.includes("outside") ||
    lowerMessage.includes("unreachable")
  ) {
    return "unavailable_routing_data";
  }
  if (
    lowerMessage.includes("invalid") ||
    lowerMessage.includes("malformed") ||
    lowerMessage.includes("parse")
  ) {
    return "malformed_request";
  }
  if (
    lowerMessage.includes("location") ||
    lowerMessage.includes("coordinate") ||
    lowerMessage.includes("lat") ||
    lowerMessage.includes("lon")
  ) {
    return "invalid_site_location";
  }
  return "unavailable_routing_data";
}

function normaliseServiceMessage(serviceName, message) {
  const trimmedMessage = String(message || "").replace(/\s+/g, " ").trim();
  if (!trimmedMessage) {
    return `${serviceName} did not provide any further detail.`;
  }
  return trimmedMessage;
}

function createServiceError(serviceName, kind, message) {
  const error = new Error(message);
  error.serviceName = serviceName;
  error.kind = kind;
  error.userMessage = message;
  return error;
}

function describeServiceFailure(subject, error) {
  const prefix = subject ? `${subject}: ` : "";
  if (error?.userMessage) {
    return `${prefix}${error.userMessage}`;
  }

  return `${prefix}${String(error?.message || "The request did not complete.")}`;
}

async function getAmenityExportDistances(amenities, referencePoint, distanceSettings) {
  if (!referencePoint) {
    setStatus("CSV export error", "Valid site coordinates are required before exporting distances.", "error");
    render();
    return null;
  }

  const targets = amenities.map((item, index) => ({
    item,
    index,
  }));
  const routedTargets = targets.filter(
    ({ item }) => item.latitude !== undefined && item.longitude !== undefined
  );

  if (routedTargets.length === 0) {
    return amenities.map(() => "");
  }

  setStatus(
    "Calculating distances",
    `Working out routed ${distanceSettings.label} distances for the CSV export.`,
    "running"
  );
  render();

  try {
    return await fetchRouteDistancesForExport(
      amenities,
      referencePoint,
      routedTargets,
      distanceSettings
    );
  } catch (error) {
    setStatus(
      "CSV export error",
      describeServiceFailure("CSV export", error),
      "error"
    );
    render();
    return null;
  }
}

async function fetchRouteDistancesForExport(amenities, referencePoint, routedTargets, distanceSettings) {
  const exportDistances = amenities.map(() => "");
  const routedDistanceValues = await fetchRoutedDistancesForTargets(
    referencePoint,
    routedTargets,
    distanceSettings.costing
  );
  routedTargets.forEach(({ index }, routedIndex) => {
    exportDistances[index] = routedDistanceValues[routedIndex];
  });
  return exportDistances;
}

function getSelectedBandLabels() {
  if (state.selectedMode === "walking") {
    return splitBands(elements.walkingBands.value);
  }
  if (state.selectedMode === "cycling") {
    return splitBands(elements.cyclingBands.value);
  }
  return splitBands(elements.busBands.value);
}

function getConfiguredBandsForMode(mode) {
  const config = MODE_CONFIG[mode];
  const rawEntries = getSelectedBandLabelsForMode(mode);
  const configuredColours = getSelectedBandColoursForMode(mode);
  if (rawEntries.length !== config.bands.length) {
    return config.bands.map((band, index) => ({
      ...band,
      fill: configuredColours[index] ?? band.fill,
    }));
  }

  const parsedBands = rawEntries
    .map((entry, index) =>
      parseConfiguredBandEntry(
        entry,
        mode,
        {
          ...config.bands[index],
          fill: configuredColours[index] ?? config.bands[index].fill,
        }
      )
    )
    .filter(Boolean);

  return parsedBands.length === config.bands.length
    ? parsedBands
    : config.bands.map((band, index) => ({
        ...band,
        fill: configuredColours[index] ?? band.fill,
      }));
}

function getSelectedBandLabelsForMode(mode) {
  if (mode === "walking") {
    return splitBands(elements.walkingBands.value);
  }
  if (mode === "cycling") {
    return splitBands(elements.cyclingBands.value);
  }
  return splitBands(elements.busBands.value);
}

function getSelectedBandColoursForMode(mode) {
  if (mode === "walking") {
    return [elements.walkingColor1.value, elements.walkingColor2.value];
  }
  if (mode === "cycling") {
    return [elements.cyclingColor1.value, elements.cyclingColor2.value, elements.cyclingColor3.value];
  }
  return [elements.busColor1.value, elements.busColor2.value, elements.busColor3.value, elements.busColor4.value];
}

function parseConfiguredBandEntry(entry, mode, fallbackBand) {
  const numeric = Number(entry.replace(/[^0-9.]/g, ""));
  if (Number.isNaN(numeric) || numeric <= 0) {
    return null;
  }

  if (mode === "bus") {
    return {
      ...fallbackBand,
      label: /min/i.test(entry) ? entry : `${numeric} mins`,
      time: numeric,
    };
  }

  return {
    ...fallbackBand,
    label: entry,
    distance: numeric / 1000,
  };
}

function handleCoordinateDraftChange() {
  const siteCoordinates = parseCoordinatePair(elements.siteCoordinates.value);
  const accessCoordinates = parseCoordinatePair(elements.accessCoordinates.value, true);

  if (!siteCoordinates) {
    setStatus(
      "Coordinate format issue",
      "Use a single box in the form 'latitude, longitude'.",
      "error"
    );
    render();
    return;
  }

  if (elements.accessCoordinates.value.trim() !== "" && !accessCoordinates) {
    setStatus(
      "Coordinate format issue",
      "Access coordinates should use the same 'latitude, longitude' format or be left blank.",
      "error"
    );
    render();
    return;
  }

  const previousScenario = state.generatedScenario ?? buildGeneratedScenario(
    parseCoordinatePair(DEFAULT_SITE_COORDINATES),
    parseCoordinatePair(DEFAULT_ACCESS_COORDINATES, true)
  );
  const baseView = state.currentMapView ?? buildBestFitMapView(
    previousScenario,
    state.hasGeneratedDraft ? state.isochrones : [],
    MODE_CONFIG[state.selectedMode].zoom,
    Number(elements.mapZoomAdjust.value)
  );
  const nextScenario = buildGeneratedScenario(siteCoordinates, accessCoordinates);
  state.generatedScenario = nextScenario;
  clearGeneratedOutputsForScenarioChange();
  state.currentMapView = baseView;
  animateMapViewTo(getDefaultPreviewMapView(nextScenario), 360);
  setStatus(
    "Coordinates updated",
    "Preview markers have moved to the new coordinates. Generate the draft map when you are ready to recalculate isochrones.",
    "warning"
  );
  schedulePlanningAuthorityLookup(siteCoordinates);
  render();
}

async function handleBusMethodChange() {
  updateBusMethodControls();
  if (state.selectedMode === "bus" && state.generatedScenario && state.hasGeneratedDraft) {
    await refreshLiveContext(`Recalculating bus catchments using ${getBusMethodLabel().toLowerCase()}.`);
  } else {
    render();
  }
}

async function handleBusSpeedChange() {
  const isValid = updateBusSpeedValidationState();
  if (!isValid) {
    if (state.selectedMode === "bus") {
      setStatus("Check bus speed", getBusSpeedValidationMessage(), "warning");
      render();
    }
    return;
  }

  if (state.selectedMode === "bus" && state.generatedScenario && state.hasGeneratedDraft) {
    await refreshLiveContext("Recalculating bus catchments using the selected average bus speed.");
  }
}

async function handleBusMaxWalkChange() {
  const isValid = updateBusMaxWalkValidationState();
  if (!isValid) {
    if (state.selectedMode === "bus") {
      setStatus("Check bus stop walk distance", getBusMaxWalkValidationMessage(), "warning");
      render();
    }
    return;
  }

  if (state.selectedMode === "bus" && state.generatedScenario && state.hasGeneratedDraft) {
    await refreshLiveContext("Recalculating bus catchments using the selected maximum walk-to-bus-stop distance.");
  }
}

function onMapZoomAdjustChange() {
  const nextZoomValue = Number(elements.mapZoomAdjust.value);
  const zoomDelta = nextZoomValue - state.lastZoomControlValue;
  state.lastZoomControlValue = nextZoomValue;
  elements.mapZoomAdjustValue.textContent = formatMapZoomAdjustValue();

  if (zoomDelta === 0) {
    return;
  }

  const scenario = state.generatedScenario ?? buildGeneratedScenario(
    parseCoordinatePair(DEFAULT_SITE_COORDINATES),
    parseCoordinatePair(DEFAULT_ACCESS_COORDINATES, true)
  );
  const baseView = state.currentMapView ?? buildBestFitMapView(
    scenario,
    state.isochrones,
    MODE_CONFIG[state.selectedMode].zoom
  );
  state.currentMapView = adjustMapViewZoom(baseView, zoomDelta);
  renderMap();
}

function recenterMapView() {
  cancelMapViewAnimation();
  elements.mapZoomAdjust.value = "0";
  state.lastZoomControlValue = 0;
  elements.mapZoomAdjustValue.textContent = formatMapZoomAdjustValue();
  animateMapViewTo(getDefaultPreviewMapView(), 350);
}

function onMapPointerDown(event) {
  if (state.isPlacingPoint || state.activeDrawingTool || event.button !== 0) {
    return;
  }

  event.preventDefault();
  cancelMapViewAnimation();
  state.isDraggingMap = true;
  state.mapDragPointerId = event.pointerId;
  state.mapDragLastPoint = { x: event.clientX, y: event.clientY };
  elements.mapPreview.setPointerCapture?.(event.pointerId);
  elements.mapPreview.style.cursor = "grabbing";
}

function onMapPointerMove(event) {
  if (!state.isDraggingMap || event.pointerId !== state.mapDragPointerId || !state.currentMapView) {
    return;
  }

  const bounds = elements.mapPreview.getBoundingClientRect();
  const viewBox = elements.mapPreview.viewBox.baseVal;
  const deltaX = ((event.clientX - state.mapDragLastPoint.x) / bounds.width) * viewBox.width;
  const deltaY = ((event.clientY - state.mapDragLastPoint.y) / bounds.height) * viewBox.height;
  state.mapDragLastPoint = { x: event.clientX, y: event.clientY };
  state.currentMapView = {
    ...state.currentMapView,
    topLeft: {
      x: state.currentMapView.topLeft.x - deltaX,
      y: state.currentMapView.topLeft.y - deltaY,
    },
  };
  if (state.mapPanFrameId != null) {
    return;
  }
  state.mapPanFrameId = requestAnimationFrame(() => {
    state.mapPanFrameId = null;
    renderMap();
  });
}

function onMapPointerUp(event) {
  if (event.pointerId !== state.mapDragPointerId) {
    return;
  }

  state.isDraggingMap = false;
  state.mapDragPointerId = null;
  state.mapDragLastPoint = null;
  if (state.mapPanFrameId != null) {
    cancelAnimationFrame(state.mapPanFrameId);
    state.mapPanFrameId = null;
    renderMap();
  }
  elements.mapPreview.releasePointerCapture?.(event.pointerId);
  elements.mapPreview.style.cursor =
    state.isPlacingPoint || state.activeDrawingTool ? "crosshair" : "grab";
}

function splitBands(value) {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function loadSavedOverrides() {
  const raw = localStorage.getItem("prime-isochrone-overrides");
  if (!raw) {
    return {};
  }

  try {
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" && !Array.isArray(parsed) ? parsed : {};
  } catch (error) {
    return {};
  }
}

function buildGeneratedScenario(siteCoordinates, accessCoordinates) {
  return {
    siteCoordinates,
    accessCoordinates,
  };
}

function schedulePlanningAuthorityLookup(siteCoordinates) {
  if (!siteCoordinates) {
    return;
  }

  if (state.planningAuthorityLookupTimer) {
    clearTimeout(state.planningAuthorityLookupTimer);
  }

  const requestId = ++state.latestPlanningAuthorityLookupId;
  state.planningAuthorityLookupTimer = setTimeout(() => {
    resolvePlanningAuthorityFromCoordinates(siteCoordinates, requestId);
  }, 700);
}

async function resolvePlanningAuthorityFromCoordinates(siteCoordinates, requestId) {
  if (!canOverwritePlanningAuthority()) {
    return;
  }

  try {
    const planningAuthorityName = await lookupPlanningAuthorityForCoordinates(siteCoordinates);
    if (!planningAuthorityName || requestId !== state.latestPlanningAuthorityLookupId) {
      return;
    }

    if (!canOverwritePlanningAuthority()) {
      return;
    }

    elements.planningAuthority.value = planningAuthorityName;
    state.lastAutoPlanningAuthority = planningAuthorityName;
    render();
  } catch (error) {
    // Best-effort quality-of-life feature only; leave the field editable if lookup fails.
  }
}

function canOverwritePlanningAuthority() {
  const currentValue = elements.planningAuthority.value.trim();
  return currentValue === "" || currentValue === state.lastAutoPlanningAuthority;
}

async function lookupPlanningAuthorityForCoordinates(siteCoordinates) {
  const types = "DIS,LBO,MTD,UTA,LGD,COI,CTY";
  const url = `${MAPIT_POINT_ENDPOINT}/${siteCoordinates.longitude},${siteCoordinates.latitude}?type=${types}`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`MapIt lookup failed with status ${response.status}`);
  }

  const areas = await response.json();
  return pickBestPlanningAuthorityName(areas);
}

function pickBestPlanningAuthorityName(areas) {
  const areaList = Object.values(areas ?? {});
  if (areaList.length === 0) {
    return "";
  }

  const priority = {
    DIS: 1,
    LBO: 2,
    MTD: 3,
    UTA: 4,
    LGD: 5,
    COI: 6,
    CTY: 7,
  };

  return areaList
    .filter((area) => area?.name)
    .sort((a, b) => (priority[a.type] ?? 99) - (priority[b.type] ?? 99))[0]?.name ?? "";
}

function compareAmenitiesForLegend(itemA, itemB, mode) {
  const categoryOrder = getCategoryOrderForMode(mode);
  const categoryIndexA = categoryOrder.indexOf(itemA.category);
  const categoryIndexB = categoryOrder.indexOf(itemB.category);

  if (categoryIndexA !== categoryIndexB) {
    return (categoryIndexA === -1 ? 99 : categoryIndexA) - (categoryIndexB === -1 ? 99 : categoryIndexB);
  }

  return String(itemA.name).localeCompare(String(itemB.name), "en-GB", { sensitivity: "base" });
}

function buildLegendLayout(legendRows, legendWidth, legendX, legendBoxY, legendPaddingX, legendPaddingTop) {
  const textMaxWidth = legendWidth - legendPaddingX * 2 - 28;
  let cursorY = legendBoxY + legendPaddingTop + 8;
  let totalContentHeight = 0;

  const rowMarkup = legendRows
    .map((item) => {
      const wrappedLines = wrapLegendLabel(item.name, textMaxWidth, 12);
      const rowHeight = Math.max(24, wrappedLines.length * 14 + 2);
      const iconMarkup =
        item.type === "band"
          ? drawBandSwatch(item.color)
          : item.type === "site-marker"
            ? drawDevelopmentSiteMarker(0, 0, true)
            : item.type === "access-marker"
              ? drawAccessMarker(0, 0, true)
              : item.type === "manual-line"
                ? drawManualLineLegendSwatch(item)
                : item.type === "exclusion-area"
                  ? drawExclusionAreaLegendSwatch(item)
                  : drawSymbol(item.symbol, item.color, 9, true);
      const textMarkup = wrappedLines
        .map(
          (line, lineIndex) =>
            `<tspan x="18" dy="${lineIndex === 0 ? 0 : 14}">${escapeHtml(line)}</tspan>`
        )
        .join("");
      const row = `
        <g transform="translate(${legendX + legendPaddingX} ${cursorY})">
          ${iconMarkup}
          <text x="18" y="4" font-size="12" fill="#1d2328" font-family="Inter, Arial, sans-serif">${textMarkup}</text>
        </g>
      `;
      cursorY += rowHeight;
      totalContentHeight += rowHeight;
      return row;
    })
    .join("");

  return {
    height: Math.max(140, legendPaddingTop * 2 + totalContentHeight),
    markup: rowMarkup,
  };
}

function wrapLegendLabel(text, maxWidth, fontSize) {
  const words = String(text).split(/\s+/).filter(Boolean);
  if (words.length === 0) {
    return [""];
  }

  const lines = [];
  let currentLine = "";

  words.forEach((word) => {
    const candidate = currentLine ? `${currentLine} ${word}` : word;
    if (estimateSvgTextWidth(candidate, fontSize, 0.58) <= maxWidth || currentLine === "") {
      currentLine = candidate;
      return;
    }

    lines.push(currentLine);
    currentLine = word;
  });

  if (currentLine) {
    lines.push(currentLine);
  }

  return lines;
}

function formatMapZoomAdjustValue() {
  const adjustValue = Number(elements.mapZoomAdjust.value);
  if (adjustValue === 0) {
    return "Auto fit";
  }
  const formattedValue = Number.isInteger(adjustValue)
    ? String(adjustValue)
    : adjustValue.toFixed(2).replace(/\.?0+$/, "");
  return adjustValue > 0 ? `Zoom in ${formattedValue}` : `Zoom out ${Math.abs(adjustValue).toFixed(2).replace(/\.?0+$/, "")}`;
}

function parseCoordinatePair(value, allowBlank = false) {
  const trimmed = value.trim();
  if (trimmed === "") {
    return allowBlank ? null : null;
  }

  const match = trimmed.match(
    /^\s*(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)\s*$/
  );

  if (!match) {
    return null;
  }

  const latitude = Number(match[1]);
  const longitude = Number(match[2]);

  if (
    Number.isNaN(latitude) ||
    Number.isNaN(longitude) ||
    latitude < -90 ||
    latitude > 90 ||
    longitude < -180 ||
    longitude > 180
  ) {
    return null;
  }

  return { latitude, longitude };
}

function clearGenerationTimers() {
  state.generationTimers.forEach((timer) => clearTimeout(timer));
  state.generationTimers = [];
}

function scheduleLongRunningCalculationNotice(requestId, mode) {
  if (mode !== "bus") {
    return;
  }
  const timer = setTimeout(() => {
    if (requestId !== state.latestFetchRequestId || state.selectedMode !== "bus") {
      return;
    }
    setStatus("Bus calculation still running", BUS_LONG_RUNNING_NOTICE, "running");
    render();
  }, BUS_LONG_RUNNING_NOTICE_MS);
  state.generationTimers.push(timer);
  return timer;
}

function clearTimer(timer) {
  clearTimeout(timer);
  state.generationTimers = state.generationTimers.filter((candidate) => candidate !== timer);
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function yieldToBrowser() {
  return new Promise((resolve) => setTimeout(resolve, 0));
}

function isBusTimingLogEnabled() {
  try {
    return IS_FILE_CONTEXT || window.localStorage?.getItem("prime-isochrone-debug") === "1";
  } catch (error) {
    return IS_FILE_CONTEXT;
  }
}

function startBusTiming(label, metadata = {}) {
  if (!isBusTimingLogEnabled()) {
    return null;
  }
  const startedAt = performance.now();
  console.debug(`[bus timing] ${label} started`, metadata);
  return { label, startedAt };
}

function endBusTiming(timer, metadata = {}) {
  if (!timer) {
    return;
  }
  console.debug(`[bus timing] ${timer.label} completed`, {
    ...metadata,
    durationMs: Math.round(performance.now() - timer.startedAt),
  });
}

async function refreshLiveContext(statusText) {
  if (!state.generatedScenario?.siteCoordinates) {
    return;
  }

  if (state.selectedMode === "bus" && !updateBusSpeedValidationState()) {
    setStatus("Check bus speed", getBusSpeedValidationMessage(), "error");
    render();
    return;
  }

  if (state.selectedMode === "bus" && !updateBusMaxWalkValidationState()) {
    setStatus("Check bus stop walk distance", getBusMaxWalkValidationMessage(), "error");
    render();
    return;
  }

  if (state.activeRefreshController) {
    state.activeRefreshController.abort();
  }
  const refreshController = new AbortController();
  state.activeRefreshController = refreshController;
  const requestId = ++state.latestFetchRequestId;
  const longRunningNoticeTimer = scheduleLongRunningCalculationNotice(requestId, state.selectedMode);
  state.lastIsochroneFallbackNotice = "";
  state.lastIsochroneSourceNote = "";
  setStatus(
    state.selectedMode === "bus" ? "Loading bus route data" : "Loading isochrones",
    state.selectedMode === "bus"
      ? "Fetching mapped bus stops and route geometry for the current origin."
      : state.selectedMode === "walking"
        ? "Building a local walkable network from OpenStreetMap, including user-authored links and barriers."
        : "Building a local cyclable network from OpenStreetMap, including user-authored links and barriers.",
    "running"
  );
  render();

  const originCoordinates = state.selectedMode === "bus"
    ? state.generatedScenario.siteCoordinates
    : state.generatedScenario.accessCoordinates ?? state.generatedScenario.siteCoordinates;
  const manualAmenities = state.amenities.filter((item) => item.isManual);
  const cachedAmenities = getCachedAmenitiesForScenario(state.generatedScenario.siteCoordinates, state.selectedMode);
  if (cachedAmenities) {
    applyAmenityState(cachedAmenities, manualAmenities);
    render();
  }

  const amenityPromise = fetchAmenitiesForScenario(
    state.generatedScenario.siteCoordinates,
    state.selectedMode,
    { signal: refreshController.signal }
  );

  let isochroneError = null;
  try {
    const liveIsochrones = await fetchIsochronesForScenario(originCoordinates, state.selectedMode, {
      signal: refreshController.signal,
    });

    if (requestId !== state.latestFetchRequestId) {
      return;
    }

    state.isochrones = liveIsochrones;
    state.lastIsochroneFallbackNotice = liveIsochrones.fallbackNotice || "";
    state.lastIsochroneSourceNote = liveIsochrones.sourceNote || "";
    setStatus(
      "Isochrones ready",
      state.lastIsochroneFallbackNotice
        ? `${state.lastIsochroneFallbackNotice} Updating amenities in the background.`
        : cachedAmenities
        ? "Isochrones refreshed. Updating amenities in the background."
        : statusText,
      state.lastIsochroneFallbackNotice ? "warning" : "running"
    );
    render();
  } catch (error) {
    isochroneError = error;
    if (error?.kind === "cancelled") {
      return;
    }
    if (requestId !== state.latestFetchRequestId) {
      return;
    }

    state.isochrones = [];
    setStatus(
      "Isochrone issue",
      describeServiceFailure("Isochrones", error),
      "error"
    );
    render();
  }

  if (requestId !== state.latestFetchRequestId) {
    return;
  }

  try {
    await handleAmenityRefresh(
      requestId,
      state.generatedScenario.siteCoordinates,
      state.selectedMode,
      manualAmenities,
      cachedAmenities,
      amenityPromise,
      isochroneError,
      refreshController.signal
    );
  } finally {
    if (longRunningNoticeTimer) {
      clearTimer(longRunningNoticeTimer);
    }
    if (state.activeRefreshController === refreshController) {
      state.activeRefreshController = null;
    }
  }
}

async function fetchAmenitiesForScenario(siteCoordinates, mode, options = {}) {
  const config = getAmenityFetchConfig(mode);
  const radii = config.radii;
  let lastError = null;
  const overpassEndpoints = config.endpoints;
  const requestTimeoutMs = options.timeoutMsOverride ?? config.timeoutMs;

  for (const endpoint of overpassEndpoints) {
    for (const radius of radii) {
      try {
        const query = config.queryBuilder(siteCoordinates, radius);
        const payload = await fetchJsonWithDiagnostics(endpoint, {
          method: "POST",
          headers: IS_FILE_CONTEXT
            ? {
                "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
                "Accept": "application/json, */*;q=0.1",
              }
            : {
                "Content-Type": "text/plain;charset=UTF-8",
              },
          body: IS_FILE_CONTEXT ? new URLSearchParams({ data: query }).toString() : query,
          signal: options.signal,
        }, "Overpass", requestTimeoutMs);
        const amenities = config.transformer(payload.elements ?? [], siteCoordinates);
        if (amenities.length > 0 || radius === radii[radii.length - 1]) {
          cacheAmenitiesForScenario(siteCoordinates, mode, amenities);
          return amenities;
        }
      } catch (error) {
        lastError = error;
        if (error?.kind === "malformed_request" || error?.kind === "invalid_site_location") {
          throw error;
        }
      }
    }
  }

  if (config.fallbackFetcher) {
    try {
      const fallbackAmenities = await config.fallbackFetcher(siteCoordinates, options);
      if (fallbackAmenities.length > 0) {
        cacheAmenitiesForScenario(siteCoordinates, mode, fallbackAmenities);
        return fallbackAmenities;
      }
    } catch (fallbackError) {
      lastError = fallbackError;
    }
  }

  if (lastError?.kind === "cancelled") {
    throw lastError;
  }

  cacheAmenitiesForScenario(siteCoordinates, mode, []);
  return [];
}

function getAmenityFetchConfig(mode) {
  if (mode === "cycling") {
    return {
      endpoints: [],
      radii: [],
      timeoutMs: 0,
      queryBuilder: buildCyclingOverpassQuery,
      transformer: (elements, siteCoordinates) =>
        transformOverpassElements(elements, siteCoordinates, "cycling"),
      fallbackFetcher: (targetSiteCoordinates, options) =>
        fetchNominatimAmenities(targetSiteCoordinates, "cycling", options),
    };
  }

  if (mode === "bus") {
    return {
      endpoints: OVERPASS_ENDPOINTS,
      radii: [12000],
      timeoutMs: 8000,
      queryBuilder: buildBusSettlementOverpassQuery,
      transformer: (elements, siteCoordinates) =>
        transformOverpassElements(elements, siteCoordinates, "bus"),
      fallbackFetcher: (targetSiteCoordinates, options) =>
        fetchNominatimAmenities(targetSiteCoordinates, "bus", options),
    };
  }

  return {
    endpoints: OVERPASS_ENDPOINTS,
    radii: [1600, 1200, 900],
    timeoutMs: 30000,
    queryBuilder: buildLocalOverpassQuery,
    transformer: (elements, siteCoordinates) =>
      transformOverpassElements(elements, siteCoordinates, "walking"),
    fallbackFetcher: (targetSiteCoordinates, options) =>
      fetchNominatimAmenities(targetSiteCoordinates, "walking", options),
  };
}

async function handleAmenityRefresh(
  requestId,
  siteCoordinates,
  mode,
  manualAmenities,
  cachedAmenities,
  amenityPromise,
  isochroneError,
  signal
) {
  try {
    const liveAmenities = await amenityPromise;
    if (requestId !== state.latestFetchRequestId) {
      return;
    }

    applyAmenityState(liveAmenities, manualAmenities);

    if (!isochroneError && state.lastIsochroneFallbackNotice) {
      setStatus(
        "Draft ready with warnings",
        state.lastIsochroneFallbackNotice,
        "warning"
      );
    } else if (!isochroneError) {
      setStatus(
        "Draft ready",
        state.selectedMode === "bus"
        ? "Indicative bus route corridor catchments generated. Live amenity context refreshed where available."
          : state.selectedMode === "walking"
            ? "Live OpenStreetMap context and locally generated walking isochrones refreshed for the current coordinates."
            : "Live OpenStreetMap context and locally generated cycling isochrones refreshed for the current coordinates.",
        "ready"
      );
    } else {
      setStatus(
        "Draft ready with warnings",
        describeServiceFailure("Isochrones", isochroneError),
        "warning"
      );
    }
    render();
  } catch (error) {
    if (error?.kind === "cancelled" || requestId !== state.latestFetchRequestId) {
      return;
    }

    const warningText = cachedAmenities
      ? `${describeServiceFailure("Amenities", error)} Using the last successful amenity set for this location as a fallback.`
      : describeServiceFailure("Amenities", error);
    const combinedWarningText = state.lastIsochroneFallbackNotice
      ? `${state.lastIsochroneFallbackNotice} ${warningText}`
      : warningText;

    if (!isochroneError) {
      setStatus("Draft ready with warnings", combinedWarningText, "warning");
    } else {
      setStatus(
        "Live service issue",
        `${describeServiceFailure("Isochrones", isochroneError)} ${combinedWarningText}`.trim(),
        "error"
      );
    }
    render();

    retryAmenitiesInBackground(siteCoordinates, mode, requestId, manualAmenities, signal);
  }
}

function applyAmenityState(liveAmenities, manualAmenities) {
  state.amenities = applySavedOverrides([...(liveAmenities ?? []), ...(manualAmenities ?? [])]);
  state.nextAmenityId = Math.max(...state.amenities.map((item) => item.id), 0) + 1;
}

async function retryAmenitiesInBackground(siteCoordinates, mode, requestId, manualAmenities, signal) {
  try {
    const liveAmenities = await fetchAmenitiesForScenario(siteCoordinates, mode, {
      timeoutMsOverride: 30000,
      signal,
    });

    if (requestId !== state.latestFetchRequestId) {
      return;
    }

    applyAmenityState(liveAmenities, manualAmenities);
    setStatus(
      "Draft ready",
      "Amenities refreshed after a slower OpenStreetMap response.",
      "ready"
    );
    render();
  } catch (error) {
    if (error?.kind === "cancelled" || requestId !== state.latestFetchRequestId) {
      return;
    }
    // Keep the earlier warning state when the slower retry also fails.
  }
}

function getOverpassEndpointsForMode(mode) {
  return OVERPASS_ENDPOINTS;
}

function getOverpassRequestTimeoutMs(mode) {
  return 30000;
}

function buildOverpassQuery(siteCoordinates, radius, mode = state.selectedMode) {
  return mode === "cycling"
    ? buildCyclingOverpassQuery(siteCoordinates, radius)
    : buildLocalOverpassQuery(siteCoordinates, radius);
}

function buildCyclingOverpassQuery(siteCoordinates, radius) {
  return `
[out:json][timeout:30];
(
  node(around:${radius},${siteCoordinates.latitude},${siteCoordinates.longitude})[place~"town|village|suburb|locality"][name];
  nwr(around:${radius},${siteCoordinates.latitude},${siteCoordinates.longitude})[railway=station][name];
  nwr(around:${radius},${siteCoordinates.latitude},${siteCoordinates.longitude})[amenity~"school|college|university"][name];
  nwr(around:${radius},${siteCoordinates.latitude},${siteCoordinates.longitude})[amenity~"hospital|clinic|doctors"][name];
);
out center tags;
  `;
}


function buildBusSettlementOverpassQuery(siteCoordinates, radius) {
  return `
[out:json][timeout:30];
(
  node(around:${radius},${siteCoordinates.latitude},${siteCoordinates.longitude})[place~"city|town|village|suburb"][name];
);
out center tags;
  `;
}

function buildLocalOverpassQuery(siteCoordinates, radius) {
  return `
[out:json][timeout:30];
(
  nwr(around:${radius},${siteCoordinates.latitude},${siteCoordinates.longitude})[highway=bus_stop];
  nwr(around:${radius},${siteCoordinates.latitude},${siteCoordinates.longitude})[public_transport=platform][bus=yes];
  nwr(around:${radius},${siteCoordinates.latitude},${siteCoordinates.longitude})[railway=station];
  nwr(around:${radius},${siteCoordinates.latitude},${siteCoordinates.longitude})[amenity~"school|college|university|kindergarten"];
  nwr(around:${radius},${siteCoordinates.latitude},${siteCoordinates.longitude})[amenity~"hospital|clinic|doctors|dentist|pharmacy"];
  nwr(around:${radius},${siteCoordinates.latitude},${siteCoordinates.longitude})[shop];
  nwr(around:${radius},${siteCoordinates.latitude},${siteCoordinates.longitude})[amenity~"cafe|restaurant|fast_food|pub|bar"];
  nwr(around:${radius},${siteCoordinates.latitude},${siteCoordinates.longitude})[amenity~"community_centre|library|arts_centre|social_facility|theatre"];
  nwr(around:${radius},${siteCoordinates.latitude},${siteCoordinates.longitude})[amenity=place_of_worship];
  nwr(around:${radius},${siteCoordinates.latitude},${siteCoordinates.longitude})[leisure~"park|playground|sports_centre"];
);
out center tags;
  `;
}

async function fetchNominatimAmenities(siteCoordinates, mode, options = {}) {
  const viewbox = buildViewboxForRadius(siteCoordinates, getNominatimFallbackRadius(mode));
  const requests = getNominatimAmenityRequests(mode);
  const grouped = new Map();

  await Promise.all(
    requests.map(async (request) => {
      let searchUrl;
      try {
        searchUrl = new URL(NOMINATIM_SEARCH_ENDPOINT, window.location.origin);
      } catch (error) {
        throw createServiceError(
          "Nominatim",
          "malformed_request",
          "The hosted amenity search URL is not configured correctly for this deployment."
        );
      }
      searchUrl.searchParams.set("format", "jsonv2");
      searchUrl.searchParams.set("limit", String(request.limit ?? 6));
      searchUrl.searchParams.set("bounded", "1");
      searchUrl.searchParams.set("viewbox", `${viewbox.minLongitude},${viewbox.maxLatitude},${viewbox.maxLongitude},${viewbox.minLatitude}`);
      searchUrl.searchParams.set("q", request.query);

      const payload = await fetchJsonWithDiagnostics(
        searchUrl.toString(),
        { signal: options.signal },
        "Nominatim",
        8000
      );

      (payload ?? []).forEach((result) => {
        const latitude = Number(result.lat);
        const longitude = Number(result.lon);
        if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
          return;
        }

        const category = request.category;
        if (!grouped.has(category)) {
          grouped.set(category, []);
        }

        grouped.get(category).push({
          id: 0,
          sourceId: `nominatim/${category}/${result.place_id}`,
          latitude,
          longitude,
          name: result.display_name?.split(",")[0]?.trim() || category,
          category,
          symbol: "circle",
          color: AMENITY_COLOR_PALETTE[0],
          visible: true,
          showInLegend: true,
          distance: getDistanceMetres(
            siteCoordinates.latitude,
            siteCoordinates.longitude,
            latitude,
            longitude
          ),
          isManual: false,
        });
      });
    })
  );

  return selectAmenitiesFromGroupedResults(grouped, mode);
}

function getNominatimAmenityRequests(mode) {
  if (mode === "cycling") {
    return [
      { category: "Settlement", query: "town", limit: 6 },
      { category: "Settlement", query: "village", limit: 6 },
      { category: "Rail station", query: "[railway station]", limit: 5 },
      { category: "School", query: "[school]", limit: 6 },
      { category: "Healthcare", query: "[hospital]", limit: 4 },
      { category: "Healthcare", query: "[clinic]", limit: 4 },
    ];
  }

  if (mode === "bus") {
    return [
      { category: "Settlement", query: "city", limit: 4 },
      { category: "Settlement", query: "town", limit: 8 },
      { category: "Settlement", query: "village", limit: 6 },
    ];
  }

  return [
    { category: "Bus stop", query: "[bus stop]", limit: 8 },
    { category: "Rail station", query: "[railway station]", limit: 4 },
    { category: "School", query: "[school]", limit: 6 },
    { category: "Healthcare", query: "[hospital]", limit: 4 },
    { category: "Retail", query: "shop", limit: 6 },
    { category: "Food and drink", query: "[cafe]", limit: 6 },
    { category: "Community", query: "[library]", limit: 4 },
    { category: "Worship", query: "[church]", limit: 3 },
    { category: "Open space", query: "[park]", limit: 4 },
  ];
}

function getNominatimFallbackRadius(mode) {
  if (mode === "cycling") {
    return 6500;
  }
  if (mode === "bus") {
    return 24000;
  }
  return 1600;
}

function buildViewboxForRadius(siteCoordinates, radiusMetres) {
  const latitudeDelta = radiusMetres / 111320;
  const longitudeDelta = radiusMetres / (111320 * Math.max(Math.cos((siteCoordinates.latitude * Math.PI) / 180), 0.2));
  return {
    minLatitude: siteCoordinates.latitude - latitudeDelta,
    maxLatitude: siteCoordinates.latitude + latitudeDelta,
    minLongitude: siteCoordinates.longitude - longitudeDelta,
    maxLongitude: siteCoordinates.longitude + longitudeDelta,
  };
}

async function fetchLocalActiveTravelIsochronesForScenario(originCoordinates, mode, options = {}) {
  const configuredBands = getConfiguredBandsForMode(mode)
    .filter((band) => Number.isFinite(Number(band.distance)) && Number(band.distance) > 0)
    .sort((a, b) => Number(a.distance) - Number(b.distance));
  if (configuredBands.length === 0) {
    throw createServiceError(ACTIVE_TRAVEL_NETWORK_SERVICE_NAME, "malformed_request", `No valid ${mode} distance bands are configured.`);
  }

  const networkRadiusMetres = getActiveTravelNetworkFetchRadiusMetres(configuredBands);
  const cacheKey = buildActiveTravelNetworkCacheKey(originCoordinates, mode, networkRadiusMetres);
  const resultCacheKey = buildActiveTravelIsochroneCacheKey(originCoordinates, mode, configuredBands, networkRadiusMetres);
  const cachedIsochrones = getMapCacheEntry(ACTIVE_TRAVEL_ISOCHRONE_RESULT_CACHE, resultCacheKey, cloneActiveTravelIsochroneResult);
  if (cachedIsochrones) {
    return cachedIsochrones;
  }
  let payload = getMapCacheEntry(ACTIVE_TRAVEL_NETWORK_CACHE, cacheKey, clonePlainValue);

  if (!payload) {
    payload = await fetchActiveTravelNetworkPayload(originCoordinates, networkRadiusMetres, mode, options);
    setMapCacheEntry(ACTIVE_TRAVEL_NETWORK_CACHE, cacheKey, payload, clonePlainValue);
  }

  let graph = getMapCacheEntry(ACTIVE_TRAVEL_GRAPH_CACHE, cacheKey, cloneActiveTravelGraph);
  if (!graph) {
    graph = buildActiveTravelGraphFromOverpassPayload(payload, mode);
    setMapCacheEntry(ACTIVE_TRAVEL_GRAPH_CACHE, cacheKey, graph, cloneActiveTravelGraph);
  }
  applyManualActiveTravelEditsToGraph(graph, mode);
  if (graph.edges.filter((edge) => edge.active !== false).length === 0 || graph.nodes.size === 0) {
    throw createServiceError(
      ACTIVE_TRAVEL_NETWORK_SERVICE_NAME,
      "unavailable_routing_data",
      `No usable ${mode === "walking" ? "walkable" : "cyclable"} network could be assembled from OpenStreetMap for the selected location.`
    );
  }

  const originNodeId = addTemporarySnappedGraphNode(graph, originCoordinates, "origin");
  const distances = runGraphDijkstra(graph, originNodeId);
  if ((graph.adjacency.get(originNodeId) || []).length === 0 || distances.size <= 1) {
    throw createServiceError(
      ACTIVE_TRAVEL_NETWORK_SERVICE_NAME,
      "unavailable_routing_data",
      `No usable ${mode === "walking" ? "walking" : "cycling"} connection could be found from the selected origin into the mapped OpenStreetMap network.`
    );
  }
  const outputs = configuredBands
    .map((band) => {
      const bandDistanceMetres = Number(band.distance) * 1000;
      const samples = collectReachableActiveTravelSamples(graph, distances, bandDistanceMetres, mode, originCoordinates);
      const rings = buildActiveTravelCatchmentRings(samples, mode);
      if (rings.length === 0) {
        return null;
      }
      return {
        geometry: {
          type: "MultiPolygon",
          coordinates: rings.map((ring) => [ring]),
        },
        label: band.label,
        color: band.fill,
        contour: bandDistanceMetres,
        provider: ACTIVE_TRAVEL_NETWORK_SERVICE_NAME,
        properties: {
          contour: bandDistanceMetres,
          source: ACTIVE_TRAVEL_NETWORK_SERVICE_NAME,
        },
      };
    })
    .filter(Boolean)
    .sort((a, b) => Number(b.contour) - Number(a.contour));

  outputs.metadata = {
    provider: ACTIVE_TRAVEL_NETWORK_SERVICE_NAME,
    mode,
    fetchRadiusMetres: networkRadiusMetres,
    networkNodeCount: graph.nodes.size,
    networkEdgeCount: graph.edges.filter((edge) => edge.active !== false).length,
    manualLinkCount: countManualNetworkLineEditsForMode(mode),
    manualBarrierCount: state.manualLineEdits.filter((item) => item.type === "barrier-line").length,
    caveat:
      mode === "walking"
        ? "Walking catchments are generated from a local OpenStreetMap-derived network. Dedicated pedestrian links and tagged sidewalks are used directly; ordinary local roads are permitted on a planning-style permissive basis unless restricted."
        : "Cycling catchments are generated from a local OpenStreetMap-derived network with user-authored route additions and barrier removals applied before polygon generation.",
  };
  setMapCacheEntry(ACTIVE_TRAVEL_ISOCHRONE_RESULT_CACHE, resultCacheKey, outputs, cloneActiveTravelIsochroneResult);
  return outputs;
}

function getActiveTravelNetworkFetchRadiusMetres(configuredBands) {
  const maximumBandDistance = Math.max(...configuredBands.map((band) => Number(band.distance) * 1000), 0);
  return Math.max(1200, Math.round(maximumBandDistance + ACTIVE_TRAVEL_NETWORK_FETCH_RADIUS_MARGIN_METRES));
}

function buildActiveTravelNetworkCacheKey(originCoordinates, mode, radiusMetres) {
  return [
    mode,
    originCoordinates.latitude.toFixed(5),
    originCoordinates.longitude.toFixed(5),
    Math.round(radiusMetres),
  ].join("|");
}

function buildActiveTravelNetworkOverpassQuery(originCoordinates, radiusMetres, mode) {
  const allowedHighways = Array.from(
    mode === "walking"
      ? new Set([
          ...ACTIVE_TRAVEL_WALK_PERMISSIVE_HIGHWAYS,
          ...ACTIVE_TRAVEL_WALK_FOOTWAY_HIGHWAYS,
          ...ACTIVE_TRAVEL_WALK_ROADS_REQUIRING_SIDEWALK,
          "road",
        ])
      : new Set([
          ...ACTIVE_TRAVEL_CYCLE_HIGHWAYS,
          "footway",
          "pedestrian",
        ])
  ).join("|");
  return `
[out:json][timeout:45];
(
  way(around:${Math.round(radiusMetres)},${originCoordinates.latitude},${originCoordinates.longitude})
    [highway]
    [highway~"^(${allowedHighways})$"]
    [highway!~"construction|proposed|bus_guideway|raceway|corridor|elevator"];
);
(._;>;);
out body;
  `;
}

async function fetchActiveTravelNetworkPayload(originCoordinates, radiusMetres, mode, options = {}) {
  let lastError = null;
  const query = buildActiveTravelNetworkOverpassQuery(originCoordinates, radiusMetres, mode);

  for (const endpoint of OVERPASS_ENDPOINTS) {
    try {
      return await fetchJsonWithDiagnostics(
        endpoint,
        {
          method: "POST",
          headers: IS_FILE_CONTEXT
            ? {
                "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
                "Accept": "application/json, */*;q=0.1",
              }
            : {
                "Content-Type": "text/plain;charset=UTF-8",
              },
          body: IS_FILE_CONTEXT ? new URLSearchParams({ data: query }).toString() : query,
          signal: options.signal,
        },
        ACTIVE_TRAVEL_NETWORK_SERVICE_NAME
      );
    } catch (error) {
      lastError = error;
      if (error?.kind === "cancelled" || error?.kind === "malformed_request" || error?.kind === "invalid_site_location") {
        throw error;
      }
    }
  }

  throw lastError || createServiceError(
    ACTIVE_TRAVEL_NETWORK_SERVICE_NAME,
    "api_outage",
    "OpenStreetMap active travel network data could not be fetched from the available Overpass services."
  );
}

function buildActiveTravelGraphFromOverpassPayload(payload, mode) {
  const nodeById = new Map();
  const ways = [];
  (payload?.elements ?? []).forEach((element) => {
    if (element.type === "node" && Number.isFinite(Number(element.lat)) && Number.isFinite(Number(element.lon))) {
      nodeById.set(String(element.id), {
        id: String(element.id),
        latitude: Number(element.lat),
        longitude: Number(element.lon),
      });
      return;
    }
    if (element.type === "way" && Array.isArray(element.nodes) && element.nodes.length >= 2) {
      ways.push(element);
    }
  });

  const graph = createEmptyActiveTravelGraph(mode);
  nodeById.forEach((node) => {
    graph.nodes.set(node.id, { ...node });
    graph.adjacency.set(node.id, []);
  });

  ways.forEach((way) => {
    const tags = way.tags ?? {};
    const allowsMode = mode === "walking" ? isOsmWayWalkable(tags) : isOsmWayCyclable(tags);
    if (!allowsMode) {
      return;
    }

    const bidirectional = !isWayOneWayForMode(tags, mode);
    for (let index = 1; index < way.nodes.length; index += 1) {
      const fromId = String(way.nodes[index - 1]);
      const toId = String(way.nodes[index]);
      const fromNode = graph.nodes.get(fromId);
      const toNode = graph.nodes.get(toId);
      if (!fromNode || !toNode) {
        continue;
      }
      const segmentLengthMetres = getDistanceMetres(
        fromNode.latitude,
        fromNode.longitude,
        toNode.latitude,
        toNode.longitude
      );
      if (!Number.isFinite(segmentLengthMetres) || segmentLengthMetres < 1) {
        continue;
      }
      addGraphEdge(graph, fromId, toId, {
        lengthMetres: segmentLengthMetres,
        bidirectional,
        sourceType: "osm",
        highway: String(tags.highway || ""),
        wayName: String(tags.name || ""),
        wayId: Number(way.id),
      });
    }
  });

  strengthenOsmGraphConnectivity(graph);
  return graph;
}

function createEmptyActiveTravelGraph(mode) {
  return {
    mode,
    nodes: new Map(),
    adjacency: new Map(),
    edges: [],
    nextSyntheticNodeId: 1,
  };
}

function cloneActiveTravelGraph(graph) {
  if (!graph) {
    return graph;
  }
  return {
    mode: graph.mode,
    nextSyntheticNodeId: Number(graph.nextSyntheticNodeId) || 1,
    nodes: new Map(Array.from(graph.nodes.entries(), ([nodeId, node]) => [nodeId, { ...node }])),
    adjacency: new Map(
      Array.from(graph.adjacency.entries(), ([nodeId, links]) => [nodeId, Array.isArray(links) ? links.map((link) => ({ ...link })) : []])
    ),
    edges: Array.isArray(graph.edges) ? graph.edges.map((edge) => ({ ...edge })) : [],
  };
}

function strengthenOsmGraphConnectivity(graph) {
  const activeOsmEdgeCount = graph.edges.filter((edge) => edge.active !== false && edge.sourceType === "osm").length;
  if (activeOsmEdgeCount > ACTIVE_TRAVEL_CONNECTIVITY_HEURISTIC_EDGE_LIMIT) {
    return;
  }
  connectLowDegreeNodesToNearbyEdges(graph);
  bridgeNearbyTerminalNodes(graph);
}

function addGraphNode(graph, coordinate, id = null) {
  const nodeId = id ? String(id) : `synthetic-${graph.mode}-${graph.nextSyntheticNodeId++}`;
  if (!graph.nodes.has(nodeId)) {
    graph.nodes.set(nodeId, {
      id: nodeId,
      latitude: Number(coordinate.latitude),
      longitude: Number(coordinate.longitude),
    });
  }
  if (!graph.adjacency.has(nodeId)) {
    graph.adjacency.set(nodeId, []);
  }
  return nodeId;
}

function addGraphEdge(graph, fromId, toId, details) {
  if (fromId === toId) {
    return null;
  }
  const fromNode = graph.nodes.get(String(fromId));
  const toNode = graph.nodes.get(String(toId));
  if (!fromNode || !toNode) {
    return null;
  }

  const edgeId = graph.edges.length;
  const edge = {
    id: edgeId,
    a: String(fromId),
    b: String(toId),
    lengthMetres: Number(details.lengthMetres),
    bidirectional: details.bidirectional !== false,
    sourceType: details.sourceType || "osm",
    highway: details.highway || "",
    wayName: details.wayName || "",
    wayId: Number.isFinite(Number(details.wayId)) ? Number(details.wayId) : null,
    manualType: details.manualType || "",
    manualId: Number.isFinite(Number(details.manualId)) ? Number(details.manualId) : null,
    active: true,
  };
  graph.edges.push(edge);
  graph.adjacency.get(edge.a).push({ to: edge.b, lengthMetres: edge.lengthMetres, edgeId });
  if (edge.bidirectional) {
    graph.adjacency.get(edge.b).push({ to: edge.a, lengthMetres: edge.lengthMetres, edgeId });
  }
  return edge;
}

function buildActiveGraphDegreeMap(graph) {
  const degreeByNodeId = new Map();
  graph.nodes.forEach((_, nodeId) => {
    degreeByNodeId.set(nodeId, 0);
  });
  graph.edges.forEach((edge) => {
    if (edge.active === false) {
      return;
    }
    degreeByNodeId.set(edge.a, (degreeByNodeId.get(edge.a) || 0) + 1);
    degreeByNodeId.set(edge.b, (degreeByNodeId.get(edge.b) || 0) + 1);
  });
  return degreeByNodeId;
}

function connectLowDegreeNodesToNearbyEdges(graph) {
  const degreeByNodeId = buildActiveGraphDegreeMap(graph);
  const candidateNodeIds = Array.from(graph.nodes.keys()).filter((nodeId) => (degreeByNodeId.get(nodeId) || 0) <= 2);
  if (candidateNodeIds.length > ACTIVE_TRAVEL_CONNECTIVITY_HEURISTIC_CANDIDATE_LIMIT) {
    return;
  }

  candidateNodeIds.forEach((nodeId) => {
    const node = graph.nodes.get(nodeId);
    if (!node) {
      return;
    }
    const best = findBestNearbyEdgeForExistingNode(graph, nodeId, node, ACTIVE_TRAVEL_OSM_JUNCTION_STITCH_TOLERANCE_METRES);
    if (!best) {
      return;
    }
    const splitNodeId = splitGraphEdgeAtCoordinate(graph, best.edge, best.projection.coordinate);
    if (splitNodeId === nodeId || graphHasActiveEdgeBetween(graph, nodeId, splitNodeId)) {
      return;
    }
    addGraphEdge(graph, nodeId, splitNodeId, {
      lengthMetres: best.projection.distanceMetres,
      bidirectional: true,
      sourceType: "stitch",
      highway: best.edge.highway,
      wayName: best.edge.wayName,
      wayId: best.edge.wayId,
    });
  });
}

function findBestNearbyEdgeForExistingNode(graph, nodeId, node, toleranceMetres) {
  let best = null;
  graph.edges.forEach((edge) => {
    if (edge.active === false || edge.a === nodeId || edge.b === nodeId || edge.sourceType !== "osm") {
      return;
    }
    const fromNode = graph.nodes.get(edge.a);
    const toNode = graph.nodes.get(edge.b);
    if (!fromNode || !toNode) {
      return;
    }
    const projection = projectCoordinateOntoSegmentMetres(
      node,
      { latitude: fromNode.latitude, longitude: fromNode.longitude },
      { latitude: toNode.latitude, longitude: toNode.longitude }
    );
    if (!projection || projection.distanceMetres > toleranceMetres) {
      return;
    }
    if (projection.fraction <= 0.08 || projection.fraction >= 0.92) {
      return;
    }
    if (!best || projection.distanceMetres < best.projection.distanceMetres) {
      best = { edge, projection };
    }
  });
  return best;
}

function bridgeNearbyTerminalNodes(graph) {
  const degreeByNodeId = buildActiveGraphDegreeMap(graph);
  const terminalNodes = Array.from(graph.nodes.entries())
    .filter(([nodeId]) => (degreeByNodeId.get(nodeId) || 0) === 1)
    .map(([nodeId, node]) => ({ nodeId, node }));
  if (terminalNodes.length > ACTIVE_TRAVEL_CONNECTIVITY_HEURISTIC_TERMINAL_LIMIT) {
    return;
  }

  for (let index = 0; index < terminalNodes.length; index += 1) {
    for (let candidateIndex = index + 1; candidateIndex < terminalNodes.length; candidateIndex += 1) {
      const left = terminalNodes[index];
      const right = terminalNodes[candidateIndex];
      if (graphHasActiveEdgeBetween(graph, left.nodeId, right.nodeId)) {
        continue;
      }
      const distanceMetres = getDistanceMetres(
        left.node.latitude,
        left.node.longitude,
        right.node.latitude,
        right.node.longitude
      );
      if (distanceMetres <= 0.5 || distanceMetres > ACTIVE_TRAVEL_OSM_ENDPOINT_LINK_TOLERANCE_METRES) {
        continue;
      }
      addGraphEdge(graph, left.nodeId, right.nodeId, {
        lengthMetres: distanceMetres,
        bidirectional: true,
        sourceType: "stitch",
      });
    }
  }
}

function graphHasActiveEdgeBetween(graph, fromId, toId) {
  return graph.edges.some((edge) =>
    edge.active !== false &&
    (
      (edge.a === String(fromId) && edge.b === String(toId)) ||
      (edge.bidirectional && edge.a === String(toId) && edge.b === String(fromId))
    )
  );
}

function isOsmWayWalkable(tags = {}) {
  const highway = String(tags.highway || "").toLowerCase();
  if (!highway || ACTIVE_TRAVEL_EXCLUDED_HIGHWAYS.has(highway)) {
    return false;
  }

  const foot = String(tags.foot || "").toLowerCase();
  const access = String(tags.access || "").toLowerCase();
  const sidewalkPresent = hasPositiveSidewalkTag(tags);
  const explicitFootBan = isExplicitNoLikeValue(foot) || isExplicitPrivateLikeValue(foot);
  const explicitAccessBan = isExplicitNoLikeValue(access) || isExplicitPrivateLikeValue(access);

  if (ACTIVE_TRAVEL_WALK_FOOTWAY_HIGHWAYS.has(highway)) {
    if (highway === "cycleway") {
      return sidewalkPresent || isPositiveAccessValue(foot) || isPositiveAccessValue(tags.segregated);
    }
    return !explicitFootBan && !explicitAccessBan;
  }

  if (sidewalkPresent) {
    return true;
  }

  if (explicitFootBan || explicitAccessBan) {
    return false;
  }

  if (ACTIVE_TRAVEL_WALK_PERMISSIVE_HIGHWAYS.has(highway)) {
    return true;
  }

  if (ACTIVE_TRAVEL_WALK_ROADS_REQUIRING_SIDEWALK.has(highway)) {
    return false;
  }

  return highway === "road";
}

function isOsmWayCyclable(tags = {}) {
  const highway = String(tags.highway || "").toLowerCase();
  if (!highway || ACTIVE_TRAVEL_EXCLUDED_HIGHWAYS.has(highway)) {
    return false;
  }

  const bicycle = String(tags.bicycle || "").toLowerCase();
  const access = String(tags.access || "").toLowerCase();
  if (isExplicitNoLikeValue(bicycle) || isExplicitPrivateLikeValue(bicycle) || isExplicitPrivateLikeValue(access)) {
    return false;
  }

  if (ACTIVE_TRAVEL_CYCLE_HIGHWAYS.has(highway)) {
    return true;
  }

  if (highway === "footway" || highway === "pedestrian") {
    return isPositiveAccessValue(bicycle) || String(tags.cycleway || "").toLowerCase().includes("track");
  }

  return false;
}

function hasPositiveSidewalkTag(tags = {}) {
  return [
    tags.sidewalk,
    tags["sidewalk:left"],
    tags["sidewalk:right"],
    tags.footway,
    tags["footway:left"],
    tags["footway:right"],
  ].some((value) => {
    const raw = String(value || "").toLowerCase();
    return raw === "yes" || raw === "both" || raw === "left" || raw === "right" || raw === "separate" || raw === "sidewalk";
  });
}

function isWayOneWayForMode(tags = {}, mode) {
  if (mode === "walking") {
    return false;
  }
  const oneway = String(tags.oneway || "").toLowerCase();
  if (!oneway || ACTIVE_TRAVEL_ONEWAY_FALSE_VALUES.has(oneway)) {
    return false;
  }
  if (String(tags["oneway:bicycle"] || "").toLowerCase() === "no") {
    return false;
  }
  if (String(tags.cycleway || "").toLowerCase().includes("opposite")) {
    return false;
  }
  return oneway === "yes" || oneway === "1" || oneway === "-1" || oneway === "true";
}

function isPositiveAccessValue(value) {
  const raw = String(value || "").toLowerCase();
  return raw === "yes" || raw === "designated" || raw === "permissive" || raw === "official";
}

function isExplicitNoLikeValue(value) {
  const raw = String(value || "").toLowerCase();
  return raw === "no" || raw === "use_sidepath";
}

function isExplicitPrivateLikeValue(value) {
  return String(value || "").toLowerCase() === "private";
}

function applyManualActiveTravelEditsToGraph(graph, mode) {
  const relevantManualTypes = mode === "walking"
    ? new Set(["walking-path", "shared-path", "bridge-crossing"])
    : new Set(["cycling-path", "shared-path", "bridge-crossing"]);

  state.manualLineEdits
    .filter((item) => relevantManualTypes.has(item.type) && Array.isArray(item.points) && item.points.length >= 2)
    .forEach((item) => {
      const overlayTemporaryNodeIds = new Set();
      const snappedNodeIds = buildSampledManualOverlayPoints(item, mode)
        .map((point, index) => {
          const preferredId = `manual-${item.id}-${index}`;
          const nodeId = addTemporarySnappedGraphNode(graph, point, preferredId, {
            ignoreNodeIds: overlayTemporaryNodeIds,
            ignoreEdge: (edge) => edge.sourceType === "snap",
          });
          overlayTemporaryNodeIds.add(preferredId);
          overlayTemporaryNodeIds.add(nodeId);
          return nodeId;
        })
        .filter((nodeId, index, allNodeIds) => index === 0 || nodeId !== allNodeIds[index - 1]);
      for (let index = 1; index < snappedNodeIds.length; index += 1) {
        const fromNode = graph.nodes.get(snappedNodeIds[index - 1]);
        const toNode = graph.nodes.get(snappedNodeIds[index]);
        if (!fromNode || !toNode) {
          continue;
        }
        addGraphEdge(graph, snappedNodeIds[index - 1], snappedNodeIds[index], {
          lengthMetres: getDistanceMetres(fromNode.latitude, fromNode.longitude, toNode.latitude, toNode.longitude),
          bidirectional: true,
          sourceType: "manual",
          manualType: item.type,
          manualId: item.id,
        });
      }
    });

  const barrierSegments = state.manualLineEdits
    .filter((item) => item.type === "barrier-line" && Array.isArray(item.points) && item.points.length >= 2)
    .flatMap((item) => buildManualLineSegments(item.points));

  if (barrierSegments.length === 0) {
    return;
  }

  graph.edges.forEach((edge) => {
    if (edge.active === false) {
      return;
    }
    if (edge.sourceType === "manual" && edge.manualType === "bridge-crossing") {
      return;
    }
    const fromNode = graph.nodes.get(edge.a);
    const toNode = graph.nodes.get(edge.b);
    if (!fromNode || !toNode) {
      return;
    }
    const edgeSegment = {
      start: { latitude: fromNode.latitude, longitude: fromNode.longitude },
      end: { latitude: toNode.latitude, longitude: toNode.longitude },
    };
    if (barrierSegments.some((barrierSegment) => doCoordinateSegmentsIntersect(edgeSegment, barrierSegment))) {
      edge.active = false;
    }
  });
}

function countManualNetworkLineEditsForMode(mode) {
  const relevantTypes = mode === "walking"
    ? new Set(["walking-path", "shared-path", "bridge-crossing"])
    : new Set(["cycling-path", "shared-path", "bridge-crossing"]);
  return state.manualLineEdits.filter((item) => relevantTypes.has(item.type)).length;
}

function buildManualLineSegments(points) {
  const output = [];
  for (let index = 1; index < points.length; index += 1) {
    output.push({
      start: points[index - 1],
      end: points[index],
    });
  }
  return output;
}

function buildSampledManualOverlayPoints(overlay, mode) {
  const points = Array.isArray(overlay?.points) ? overlay.points : [];
  if (points.length < 2) {
    return points;
  }
  const spacingMetres = ACTIVE_TRAVEL_MANUAL_PATH_SAMPLE_SPACING_BY_MODE[mode] || 30;
  const sampledPoints = [];
  for (let index = 1; index < points.length; index += 1) {
    const segmentSamples = sampleCoordinateSegment(points[index - 1], points[index], spacingMetres);
    if (segmentSamples.length === 0) {
      if (sampledPoints.length === 0) {
        sampledPoints.push(points[index - 1]);
      }
      sampledPoints.push(points[index]);
      continue;
    }
    if (sampledPoints.length > 0) {
      segmentSamples.shift();
    }
    sampledPoints.push(...segmentSamples);
  }
  return dedupeCoordinates(sampledPoints, 6);
}

function addTemporarySnappedGraphNode(graph, coordinate, preferredId = "", options = {}) {
  const snap = findNearestGraphSnap(graph, coordinate, options);
  if (!snap) {
    return addGraphNode(graph, coordinate, preferredId || null);
  }

  if (snap.kind === "node") {
    const lengthMetres = getDistanceMetres(
      coordinate.latitude,
      coordinate.longitude,
      snap.coordinate.latitude,
      snap.coordinate.longitude
    );
    if (lengthMetres <= 0.5) {
      return snap.nodeId;
    }
    const nodeId = addGraphNode(graph, coordinate, preferredId || null);
    addGraphEdge(graph, nodeId, snap.nodeId, {
      lengthMetres,
      bidirectional: true,
      sourceType: "snap",
    });
    return nodeId;
  }

  const snappedEdgeNodeId = splitGraphEdgeAtCoordinate(graph, snap.edge, snap.coordinate);
  const snappedEdgeNode = graph.nodes.get(snappedEdgeNodeId);
  if (!snappedEdgeNode) {
    return addGraphNode(graph, coordinate, preferredId || null);
  }
  const snapLengthMetres = getDistanceMetres(
    coordinate.latitude,
    coordinate.longitude,
    snappedEdgeNode.latitude,
    snappedEdgeNode.longitude
  );
  if (snapLengthMetres <= 0.5) {
    return snappedEdgeNodeId;
  }
  const nodeId = addGraphNode(graph, coordinate, preferredId || null);
  addGraphEdge(graph, nodeId, snappedEdgeNodeId, {
    lengthMetres: snapLengthMetres,
    bidirectional: true,
    sourceType: "snap",
  });
  return nodeId;
}

function splitGraphEdgeAtCoordinate(graph, edge, coordinate) {
  const fromNode = graph.nodes.get(edge.a);
  const toNode = graph.nodes.get(edge.b);
  if (!fromNode || !toNode) {
    return edge.a;
  }
  const lengthToA = getDistanceMetres(coordinate.latitude, coordinate.longitude, fromNode.latitude, fromNode.longitude);
  const lengthToB = getDistanceMetres(coordinate.latitude, coordinate.longitude, toNode.latitude, toNode.longitude);
  if (lengthToA <= 0.5) {
    return edge.a;
  }
  if (lengthToB <= 0.5) {
    return edge.b;
  }

  const splitNodeId = addGraphNode(
    graph,
    coordinate,
    `split-${edge.id}-${coordinate.latitude.toFixed(6)}-${coordinate.longitude.toFixed(6)}`
  );
  if (edge.active !== false) {
    edge.active = false;
    addGraphEdge(graph, edge.a, splitNodeId, {
      lengthMetres: lengthToA,
      bidirectional: edge.bidirectional,
      sourceType: edge.sourceType,
      highway: edge.highway,
      wayName: edge.wayName,
      wayId: edge.wayId,
      manualType: edge.manualType,
      manualId: edge.manualId,
    });
    addGraphEdge(graph, splitNodeId, edge.b, {
      lengthMetres: lengthToB,
      bidirectional: edge.bidirectional,
      sourceType: edge.sourceType,
      highway: edge.highway,
      wayName: edge.wayName,
      wayId: edge.wayId,
      manualType: edge.manualType,
      manualId: edge.manualId,
    });
  }
  return splitNodeId;
}

function findNearestGraphSnap(graph, coordinate, options = {}) {
  let best = null;
  const ignoreNodeIds = options.ignoreNodeIds instanceof Set ? options.ignoreNodeIds : null;
  const ignoreEdge = typeof options.ignoreEdge === "function" ? options.ignoreEdge : () => false;

  graph.nodes.forEach((node, nodeId) => {
    if (ignoreNodeIds?.has(nodeId)) {
      return;
    }
    const distance = getDistanceMetres(coordinate.latitude, coordinate.longitude, node.latitude, node.longitude);
    if (distance <= ACTIVE_TRAVEL_SNAP_TOLERANCE_METRES && (!best || distance < best.distance)) {
      best = {
        kind: "node",
        nodeId,
        coordinate: { latitude: node.latitude, longitude: node.longitude },
        distance,
      };
    }
  });

  graph.edges.forEach((edge) => {
    if (edge.active === false || ignoreEdge(edge)) {
      return;
    }
    const fromNode = graph.nodes.get(edge.a);
    const toNode = graph.nodes.get(edge.b);
    if (!fromNode || !toNode) {
      return;
    }
    const projection = projectCoordinateOntoSegmentMetres(
      coordinate,
      { latitude: fromNode.latitude, longitude: fromNode.longitude },
      { latitude: toNode.latitude, longitude: toNode.longitude }
    );
    if (!projection || projection.distanceMetres > ACTIVE_TRAVEL_MAX_SNAP_CANDIDATE_DISTANCE_METRES) {
      return;
    }
    if (!best || projection.distanceMetres < best.distance) {
      best = {
        kind: "edge",
        edge,
        coordinate: projection.coordinate,
        distance: projection.distanceMetres,
      };
    }
  });

  return best;
}

function projectCoordinateOntoSegmentMetres(point, segmentStart, segmentEnd) {
  const origin = {
    latitude: (segmentStart.latitude + segmentEnd.latitude + point.latitude) / 3,
    longitude: (segmentStart.longitude + segmentEnd.longitude + point.longitude) / 3,
  };
  const start = projectCoordinateToLocalMetres(segmentStart, origin);
  const end = projectCoordinateToLocalMetres(segmentEnd, origin);
  const target = projectCoordinateToLocalMetres(point, origin);
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  const lengthSquared = dx * dx + dy * dy;
  if (!Number.isFinite(lengthSquared) || lengthSquared === 0) {
    return null;
  }
  const t = Math.max(0, Math.min(1, ((target.x - start.x) * dx + (target.y - start.y) * dy) / lengthSquared));
  const projected = {
    x: start.x + dx * t,
    y: start.y + dy * t,
  };
  const metresPerDegreeLatitude = 111320;
  const metresPerDegreeLongitude = 111320 * Math.max(Math.cos((origin.latitude * Math.PI) / 180), 0.2);
  const coordinate = {
    latitude: origin.latitude + projected.y / metresPerDegreeLatitude,
    longitude: origin.longitude + projected.x / metresPerDegreeLongitude,
  };
  return {
    coordinate,
    distanceMetres: Math.hypot(projected.x - target.x, projected.y - target.y),
    fraction: t,
  };
}

function doCoordinateSegmentsIntersect(segmentA, segmentB) {
  const origin = {
    latitude: (segmentA.start.latitude + segmentA.end.latitude + segmentB.start.latitude + segmentB.end.latitude) / 4,
    longitude: (segmentA.start.longitude + segmentA.end.longitude + segmentB.start.longitude + segmentB.end.longitude) / 4,
  };
  const a1 = projectCoordinateToLocalMetres(segmentA.start, origin);
  const a2 = projectCoordinateToLocalMetres(segmentA.end, origin);
  const b1 = projectCoordinateToLocalMetres(segmentB.start, origin);
  const b2 = projectCoordinateToLocalMetres(segmentB.end, origin);

  if (
    Math.hypot(a1.x - b1.x, a1.y - b1.y) <= ACTIVE_TRAVEL_INTERSECTION_TOLERANCE_METRES ||
    Math.hypot(a1.x - b2.x, a1.y - b2.y) <= ACTIVE_TRAVEL_INTERSECTION_TOLERANCE_METRES ||
    Math.hypot(a2.x - b1.x, a2.y - b1.y) <= ACTIVE_TRAVEL_INTERSECTION_TOLERANCE_METRES ||
    Math.hypot(a2.x - b2.x, a2.y - b2.y) <= ACTIVE_TRAVEL_INTERSECTION_TOLERANCE_METRES
  ) {
    return false;
  }

  return lineSegmentsIntersect(a1, a2, b1, b2);
}

function lineSegmentsIntersect(a1, a2, b1, b2) {
  const orientation = (p, q, r) => Math.sign((q.y - p.y) * (r.x - q.x) - (q.x - p.x) * (r.y - q.y));
  const onSegment = (p, q, r) =>
    q.x <= Math.max(p.x, r.x) &&
    q.x >= Math.min(p.x, r.x) &&
    q.y <= Math.max(p.y, r.y) &&
    q.y >= Math.min(p.y, r.y);

  const o1 = orientation(a1, a2, b1);
  const o2 = orientation(a1, a2, b2);
  const o3 = orientation(b1, b2, a1);
  const o4 = orientation(b1, b2, a2);

  if (o1 !== o2 && o3 !== o4) {
    return true;
  }
  if (o1 === 0 && onSegment(a1, b1, a2)) {
    return true;
  }
  if (o2 === 0 && onSegment(a1, b2, a2)) {
    return true;
  }
  if (o3 === 0 && onSegment(b1, a1, b2)) {
    return true;
  }
  if (o4 === 0 && onSegment(b1, a2, b2)) {
    return true;
  }
  return false;
}

function runGraphDijkstra(graph, originNodeId) {
  const distances = new Map([[originNodeId, 0]]);
  const queue = createMinPriorityQueue();
  queue.push({ nodeId: originNodeId, distance: 0 });

  while (queue.size > 0) {
    const current = queue.pop();
    if (!current) {
      break;
    }
    if (current.distance > (distances.get(current.nodeId) ?? Infinity)) {
      continue;
    }
    const neighbours = graph.adjacency.get(current.nodeId) || [];
    neighbours.forEach((entry) => {
      const edge = graph.edges[entry.edgeId];
      if (!edge || edge.active === false) {
        return;
      }
      const candidateDistance = current.distance + Number(entry.lengthMetres);
      if (candidateDistance < (distances.get(entry.to) ?? Infinity)) {
        distances.set(entry.to, candidateDistance);
        queue.push({ nodeId: entry.to, distance: candidateDistance });
      }
    });
  }

  return distances;
}

function createMinPriorityQueue() {
  return {
    values: [],
    get size() {
      return this.values.length;
    },
    push(item) {
      this.values.push(item);
      let index = this.values.length - 1;
      while (index > 0) {
        const parentIndex = Math.floor((index - 1) / 2);
        if (this.values[parentIndex].distance <= this.values[index].distance) {
          break;
        }
        [this.values[parentIndex], this.values[index]] = [this.values[index], this.values[parentIndex]];
        index = parentIndex;
      }
    },
    pop() {
      if (this.values.length === 0) {
        return null;
      }
      const first = this.values[0];
      const last = this.values.pop();
      if (this.values.length > 0) {
        this.values[0] = last;
        let index = 0;
        while (true) {
          const left = index * 2 + 1;
          const right = index * 2 + 2;
          let smallest = index;
          if (left < this.values.length && this.values[left].distance < this.values[smallest].distance) {
            smallest = left;
          }
          if (right < this.values.length && this.values[right].distance < this.values[smallest].distance) {
            smallest = right;
          }
          if (smallest === index) {
            break;
          }
          [this.values[index], this.values[smallest]] = [this.values[smallest], this.values[index]];
          index = smallest;
        }
      }
      return first;
    },
  };
}

function collectReachableActiveTravelSamples(graph, distances, bandDistanceMetres, mode, originCoordinates) {
  const spacingMetres = ACTIVE_TRAVEL_SAMPLE_SPACING_BY_MODE[mode] || 60;
  const samples = [{ latitude: originCoordinates.latitude, longitude: originCoordinates.longitude }];

  graph.edges.forEach((edge) => {
    if (edge.active === false) {
      return;
    }
    const fromNode = graph.nodes.get(edge.a);
    const toNode = graph.nodes.get(edge.b);
    if (!fromNode || !toNode) {
      return;
    }
    const fromDistance = distances.get(edge.a);
    const toDistance = distances.get(edge.b);
    const fromReachable = Number.isFinite(fromDistance) && fromDistance <= bandDistanceMetres;
    const toReachable = Number.isFinite(toDistance) && toDistance <= bandDistanceMetres;

    if (fromReachable && toReachable) {
      samples.push(...sampleCoordinateSegment(fromNode, toNode, spacingMetres));
      return;
    }

    if (fromReachable && Number.isFinite(fromDistance)) {
      const reachableLength = Math.min(edge.lengthMetres, bandDistanceMetres - fromDistance);
      if (reachableLength > 1) {
        samples.push(...samplePartialCoordinateSegment(fromNode, toNode, reachableLength, edge.lengthMetres, spacingMetres));
      }
      return;
    }

    if (toReachable && Number.isFinite(toDistance)) {
      const reachableLength = Math.min(edge.lengthMetres, bandDistanceMetres - toDistance);
      if (reachableLength > 1) {
        samples.push(...samplePartialCoordinateSegment(toNode, fromNode, reachableLength, edge.lengthMetres, spacingMetres));
      }
    }
  });

  graph.nodes.forEach((node, nodeId) => {
    const distance = distances.get(nodeId);
    if (Number.isFinite(distance) && distance <= bandDistanceMetres) {
      samples.push({ latitude: node.latitude, longitude: node.longitude });
    }
  });

  return dedupeCoordinates(samples, 6);
}

function sampleCoordinateSegment(startCoordinate, endCoordinate, spacingMetres) {
  const totalLength = getDistanceMetres(
    startCoordinate.latitude,
    startCoordinate.longitude,
    endCoordinate.latitude,
    endCoordinate.longitude
  );
  if (!Number.isFinite(totalLength) || totalLength <= 0) {
    return [];
  }

  const sampleCount = Math.max(1, Math.ceil(totalLength / Math.max(20, spacingMetres)));
  const samples = [];
  for (let index = 0; index <= sampleCount; index += 1) {
    samples.push(interpolateCoordinate(startCoordinate, endCoordinate, index / sampleCount));
  }
  return samples;
}

function samplePartialCoordinateSegment(startCoordinate, endCoordinate, partialLengthMetres, totalLengthMetres, spacingMetres) {
  if (!Number.isFinite(partialLengthMetres) || partialLengthMetres <= 0 || !Number.isFinite(totalLengthMetres) || totalLengthMetres <= 0) {
    return [];
  }
  const endFraction = Math.max(0, Math.min(1, partialLengthMetres / totalLengthMetres));
  const sampleCount = Math.max(1, Math.ceil(partialLengthMetres / Math.max(20, spacingMetres)));
  const samples = [];
  for (let index = 0; index <= sampleCount; index += 1) {
    samples.push(interpolateCoordinate(startCoordinate, endCoordinate, endFraction * (index / sampleCount)));
  }
  return samples;
}

function buildActiveTravelCatchmentRings(samples, mode) {
  const coordinates = dedupeCoordinates(samples.filter((coordinate) =>
    coordinate && Number.isFinite(coordinate.latitude) && Number.isFinite(coordinate.longitude)
  ), 5);
  if (coordinates.length === 0) {
    return [];
  }

  const clusters = clusterCoordinatesByDistance(
    coordinates,
    ACTIVE_TRAVEL_CLUSTER_LINK_BY_MODE[mode] || 240
  );
  const rings = [];
  clusters.forEach((cluster) => {
    const ring = buildActiveTravelRingForCluster(cluster, mode);
    if (!ring || ring.length < 4) {
      return;
    }
    const area = getApproximateRingAreaSquareMetres(ring);
    if (area < (ACTIVE_TRAVEL_MIN_COMPONENT_AREA_BY_MODE[mode] || 1500) && cluster.length > 2) {
      return;
    }
    rings.push(ring);
  });

  return capPolygonRings(rings, 8);
}

function buildActiveTravelRingForCluster(cluster, mode) {
  const bufferMetres = ACTIVE_TRAVEL_BUFFER_BY_MODE[mode] || 55;
  const smoothingIterations = ACTIVE_TRAVEL_SMOOTHING_ITERATIONS_BY_MODE[mode] ?? BUS_CARTO_SMOOTHING_ITERATIONS;
  const radialBins = ACTIVE_TRAVEL_RADIAL_BINS_BY_MODE[mode] || BUS_CARTO_RADIAL_BINS;
  if (cluster.length === 1) {
    return smoothRing(buildCoordinateBufferRing(cluster[0], bufferMetres, 18), smoothingIterations);
  }
  if (cluster.length === 2) {
    const buffered = buildBufferedRouteSegmentRing(cluster[0], cluster[1], bufferMetres);
    return buffered ? smoothRing(buffered, smoothingIterations) : null;
  }
  const expandedPoints = buildExpandedCoordinateCloud(cluster, bufferMetres, BUS_CARTO_HULL_POINT_SEGMENTS);
  const hullRing = buildRadialEnvelopeHull(expandedPoints, radialBins);
  if (!hullRing || hullRing.length < 4) {
    return null;
  }
  return smoothRing(hullRing, smoothingIterations);
}

async function fetchIsochronesForScenario(originCoordinates, mode, options = {}) {
  if (mode === "bus") {
    return fetchBusIsochronesForScenario(originCoordinates, options);
  }

  try {
    return await fetchLocalActiveTravelIsochronesForScenario(originCoordinates, mode, options);
  } catch (error) {
    if (error?.kind === "cancelled") {
      throw error;
    }
    return buildGeometricFallbackIsochrones(originCoordinates, mode, {
      triggerError: error,
      provider: "Indicative straight-line fallback",
    });
  }
}

async function fetchBusIsochronesForScenario(originCoordinates, options = {}) {
  if (options.signal?.aborted) {
    throw createServiceError(
      getSelectedBusMethod() === BUS_METHOD_BODS ? BODS_TIMETABLE_SERVICE_NAME : OSM_BUS_ROUTE_SERVICE_NAME,
      "cancelled",
      "Bus isochrone request was cancelled."
    );
  }

  if (getSelectedBusMethod() === BUS_METHOD_BODS) {
    try {
      const bodsIsochrones = await fetchBodsTimetableIsochronesForScenario(originCoordinates, options);
      bodsIsochrones.sourceNote = buildBodsTimetableSourceNote(bodsIsochrones.metadata);
      return bodsIsochrones;
    } catch (bodsError) {
      if (bodsError?.kind === "cancelled") {
        throw bodsError;
      }
      const reason = bodsError?.userMessage || bodsError?.message || String(bodsError || "");
      const emptyIsochrones = [];
      emptyIsochrones.fallbackNotice = `BODS timetable catchments could not be generated.${reason ? ` Reason: ${reason}` : ""}`;
      emptyIsochrones.sourceNote = `BODS timetable catchments could not be generated. ${buildBodsTimetableSourceNote({ fallbackReason: reason })}`;
      emptyIsochrones.metadata = {
        provider: "BODS timetable catchment unavailable",
        intendedProvider: "BODS timetable-based bus catchment",
        fallbackReason: reason,
        bodsDiagnosticStage: bodsError?.bodsDiagnosticStage || bodsError?.bodsDiagnostics?.stage || "unknown",
        bodsDiagnostics: bodsError?.bodsDiagnostics || null,
        caveat: "No substitute corridor estimate is shown when BODS timetable generation fails.",
      };
      return emptyIsochrones;
    }
  }

  try {
    const busRouteIsochrones = await fetchOsmIndicativeBusRouteIsochronesForScenario(originCoordinates, options);
    busRouteIsochrones.sourceNote = buildOsmBusRouteSourceNote(busRouteIsochrones.metadata);
    return busRouteIsochrones;
  } catch (busRouteError) {
    if (busRouteError?.kind === "cancelled") {
      throw busRouteError;
    }

    const reason = busRouteError?.userMessage || busRouteError?.message || String(busRouteError || "");
    const emptyIsochrones = [];
    emptyIsochrones.fallbackNotice = `${OSM_BUS_ROUTE_UNAVAILABLE_NOTICE}${reason ? ` Reason: ${reason}` : ""}`;
    emptyIsochrones.sourceNote = `${OSM_BUS_ROUTE_UNAVAILABLE_NOTICE} ${OSM_BUS_ROUTE_METHOD_NOTE}`;
    emptyIsochrones.metadata = {
      provider: "OpenStreetMap bus route catchment unavailable",
      intendedProvider: "OpenStreetMap bus route corridor catchment",
      fallbackReason: reason,
      caveat: "No road-network proxy or straight-line ring is shown for bus mode. The bus layer is route-only.",
    };
    return emptyIsochrones;
  }
}


async function fetchBodsTimetableIsochronesForScenario(originCoordinates, options = {}) {
  const timing = startBusTiming("BODS timetable generation", { originCoordinates });
  const configuredBands = getConfiguredBandsForMode("bus")
    .filter((band) => Number.isFinite(Number(band.time)) && Number(band.time) > 0)
    .sort((a, b) => Number(a.time) - Number(b.time));
  if (configuredBands.length === 0) {
    throw createServiceError(BODS_TIMETABLE_SERVICE_NAME, "malformed_request", "No valid bus catchment thresholds are configured.");
  }
  const maximumBandMinutes = getMaximumBusBandMinutes(configuredBands);
  const maximumWalkToBusStopMetres = getSelectedBusMaxWalkToStopMetres() || BUS_MAX_WALK_TO_STOP_DEFAULT_METRES;
  const departureDate = getSelectedBusDate();
  const departureTime = getSelectedBusTime();
  const departureMinutes = parseClockTimeToMinutes(departureTime);
  if (!Number.isFinite(departureMinutes)) {
    throw createServiceError(BODS_TIMETABLE_SERVICE_NAME, "malformed_request", "Enter a valid BODS timetable departure time.");
  }

  const cacheKey = buildBodsTimetableCacheKey(originCoordinates, configuredBands, maximumWalkToBusStopMetres, departureDate, departureTime);
  const cachedIsochrones = getMapCacheEntry(BODS_TIMETABLE_CACHE, cacheKey, cloneBusIsochroneResult);
  if (cachedIsochrones) {
    endBusTiming(timing, { cache: "bods-result-hit", bandCount: cachedIsochrones.length });
    return cachedIsochrones;
  }

  setStatus("Loading BODS timetables", "Finding BODS timetable datasets using supported BODS timetable filters for the selected area.", "running");
  render();
  const datasetResult = await fetchLocalBodsTimetableModelProgressively(originCoordinates, maximumWalkToBusStopMetres, { ...options, departureDate });
  render();
  const timetable = datasetResult.timetable;
  const datasetUrls = datasetResult.downloadUrlsTried;
  const datasetRecordCount = datasetResult.datasetRecordCount;
  if (!timetable && datasetRecordCount === 0) {
    throw createBodsDiagnosticError("no_datasets", "No BODS timetable datasets were found for this location. The search has tried local authority/search terms and broader fallback queries.", {
      datasetQueryParametersUsed: datasetResult.queryParametersUsed,
      datasetRecordCount,
      queryTerms: datasetResult.searchTerms?.map((term) => term.value),
      querySpecsTried: datasetResult.querySpecsTried,
      queryErrors: datasetResult.errors,
    });
  }
  if (!timetable && datasetResult.downloadUrlsTried.length === 0) {
    throw createBodsDiagnosticError("no_downloadable_dataset_urls", `BODS returned ${datasetRecordCount.toLocaleString("en-GB")} timetable dataset record${datasetRecordCount === 1 ? "" : "s"}, but no downloadable TransXChange/XML/ZIP URL could be identified.`, {
      datasetQueryParametersUsed: datasetResult.queryParametersUsed,
      datasetRecordCount,
      queryTerms: datasetResult.searchTerms?.map((term) => term.value),
      querySpecsTried: datasetResult.querySpecsTried,
      queryErrors: datasetResult.errors,
    });
  }
  if (!timetable) {
    const nearestText = Number.isFinite(Number(datasetResult.nearestRejectedStopDistanceMetres))
      ? ` Nearest parsed stop was approximately ${Math.round(datasetResult.nearestRejectedStopDistanceMetres).toLocaleString("en-GB")} m away.`
      : "";
    throw createBodsDiagnosticError(
      datasetResult.rejectedNonLocalDatasetCount > 0 ? "non_local_datasets" : "no_local_usable_datasets",
      `BODS returned timetable datasets, but none passed the local-origin validation.${nearestText} The app tried strict local proof first and, for trusted numeric adminArea queries, a broader route-level merge. Check selected query specs and rejected dataset diagnostics for wrong-area samples or missing scheduled connections.`,
      {
        datasetQueryParametersUsed: datasetResult.queryParametersUsed,
        datasetRecordCount,
        queryTerms: datasetResult.searchTerms?.map((term) => term.value),
        querySpecsTried: datasetResult.querySpecsTried,
        downloadUrlsTried: datasetResult.downloadUrlsTried,
        downloadedFileCount: datasetResult.downloadedFileCount,
        parsedXmlFileCount: datasetResult.parsedXmlFileCount,
        rejectedNonLocalDatasetCount: datasetResult.rejectedNonLocalDatasetCount,
        nearestRejectedStopDistanceMetres: datasetResult.nearestRejectedStopDistanceMetres,
        localDatasetMaxDistanceMetres: datasetResult.localDatasetMaxDistanceMetres,
        nonLocalDatasetSamples: datasetResult.nonLocalDatasetSamples,
        warnings: datasetResult.warnings,
        queryErrors: datasetResult.errors,
      }
    );
  }
  if (timetable.downloadedFileCount === 0) {
    throw createBodsDiagnosticError("no_xml_downloaded", "BODS timetable datasets were found, but no XML/ZIP timetable files could be downloaded or extracted. Try again later.", {
      datasetCount: datasetResult.downloadUrlsTried.length,
      querySpecsTried: datasetResult.querySpecsTried,
      warnings: timetable.warnings,
    });
  }
  if (timetable.stops.length === 0) {
    const unresolvedText = timetable.stopReferenceCount > 0
      ? ` ${timetable.stopReferenceCount.toLocaleString("en-GB")} stop reference${timetable.stopReferenceCount === 1 ? " was" : "s were"} found, but none had embedded coordinates or could be resolved from in-file route geometry or external stop reference data.`
      : " No stop references were found in the parsed timetable files.";
    throw createBodsDiagnosticError("no_stops_parsed", `BODS timetable files were downloaded, but no stops with usable coordinates could be parsed.${unresolvedText}`, {
      datasetCount: datasetUrls.length,
      querySpecsTried: datasetResult.querySpecsTried,
      selectedQuerySpec: datasetResult.selectedQuerySpec,
      downloadedFileCount: timetable.downloadedFileCount,
      parsedXmlFileCount: timetable.parsedXmlFileCount,
      stopReferenceCount: timetable.stopReferenceCount,
      directCoordinateStopCount: timetable.directCoordinateStopCount,
      routeLinkCoordinateStopCount: timetable.routeLinkCoordinateStopCount,
      enrichedCoordinateStopCount: timetable.enrichedCoordinateStopCount,
      unresolvedCoordinateStopCount: timetable.unresolvedCoordinateStopCount,
      sampleMissingStopIds: timetable.sampleMissingStopIds,
      stopStructureSamples: timetable.stopStructureSamples,
      warnings: timetable.warnings,
    });
  }
  if (timetable.connections.length === 0) {
    throw createBodsDiagnosticError("no_connections_parsed", "BODS timetable stops were parsed, but no usable stop-to-stop timetable connections could be parsed.", {
      datasetCount: datasetUrls.length,
      querySpecsTried: datasetResult.querySpecsTried,
      selectedQuerySpec: datasetResult.selectedQuerySpec,
      downloadedFileCount: timetable.downloadedFileCount,
      parsedXmlFileCount: timetable.parsedXmlFileCount,
      stopCount: timetable.stops.length,
      stopReferenceCount: timetable.stopReferenceCount,
      directCoordinateStopCount: timetable.directCoordinateStopCount,
      routeLinkCoordinateStopCount: timetable.routeLinkCoordinateStopCount,
      enrichedCoordinateStopCount: timetable.enrichedCoordinateStopCount,
      unresolvedCoordinateStopCount: timetable.unresolvedCoordinateStopCount,
      sampleMissingStopIds: timetable.sampleMissingStopIds,
      stopStructureSamples: timetable.stopStructureSamples,
      warnings: timetable.warnings,
    });
  }

  setStatus("Running timetable search", "Calculating earliest scheduled arrivals including initial walk, wait time, bus running time and walking transfers.", "running");
  render();
  const searchResult = runBodsEarliestArrivalSearch(timetable, originCoordinates, configuredBands, maximumBandMinutes, maximumWalkToBusStopMetres, departureMinutes);
  validateBodsRealityGateForAcceptedSearch(datasetResult, timetable, searchResult, originCoordinates);
  const isochrones = buildBodsTimetableIsochronesFromSearch(searchResult, configuredBands);
  if (isochrones.length === 0) {
    const diagnostic = diagnoseBodsTimetableSearchFailure(searchResult);
    throw createBodsDiagnosticError(diagnostic.stage, diagnostic.message, {
      ...diagnostic.details,
      datasetCount: datasetUrls.length,
      querySpecsTried: datasetResult.querySpecsTried,
      selectedQuerySpec: datasetResult.selectedQuerySpec,
      downloadedFileCount: timetable.downloadedFileCount,
      parsedXmlFileCount: timetable.parsedXmlFileCount,
      stopCount: timetable.stops.length,
      stopReferenceCount: timetable.stopReferenceCount,
      directCoordinateStopCount: timetable.directCoordinateStopCount,
      routeLinkCoordinateStopCount: timetable.routeLinkCoordinateStopCount,
      enrichedCoordinateStopCount: timetable.enrichedCoordinateStopCount,
      unresolvedCoordinateStopCount: timetable.unresolvedCoordinateStopCount,
      sampleMissingStopIds: timetable.sampleMissingStopIds,
      stopStructureSamples: timetable.stopStructureSamples,
      connectionCount: timetable.connections.length,
    });
  }
  isochrones.metadata = {
    provider: "BODS timetable-based bus catchment",
    mode: "bods_timetable_earliest_arrival",
    method: "BODS timetable-based scheduled bus search using parsed TransXChange stop times where available, with estimated walking access and transfers; no live disruption or reliability adjustment",
    departureDate,
    departureTime,
    maximumWalkToBusStopMetres,
    transferWalkRadiusMetres: BODS_TRANSFER_RADIUS_METRES,
    maximumTransfers: BODS_MAX_TRANSFERS,
    accessWalkSpeedKph: BUS_ACCESS_WALK_SPEED_KPH,
    busAccessWalkDetourFactor: BUS_ACCESS_WALK_DETOUR_FACTOR,
    busAccessWalkSpeedMetresPerMinute: BUS_ACCESS_WALK_SPEED_METRES_PER_MINUTE,
    initialWalkCandidateStopCount: searchResult.initialWalkCandidateStopCount,
    retainedInitialWalkStopCount: searchResult.retainedInitialWalkStopCount,
    transferWalkEdgeCount: searchResult.transferWalkEdgeCount,
    bodsDatasetQueryParametersUsed: datasetResult.queryParametersUsed,
    bodsQuerySpecsTried: datasetResult.querySpecsTried,
    bodsSelectedQuerySpec: datasetResult.selectedQuerySpec,
    bodsSelectedQuerySpecs: datasetResult.selectedQuerySpecs,
    bodsDownloadUrlsTried: datasetResult.downloadUrlsTried,
    bodsDatasetRecordCount: datasetResult.datasetRecordCount,
    bodsDatasetCount: datasetUrls.length,
    bodsLocalDatasetCount: timetable.localDatasetCount,
    bodsRejectedNonLocalDatasetCount: timetable.rejectedNonLocalDatasetCount,
    bodsNearestParsedStopDistanceMetres: timetable.nearestStopDistanceMetres,
    bodsNearestRealParsedStopDistanceMetres: timetable.nearestRealStopDistanceMetres,
    bodsRealLocalStopCount: timetable.realLocalStopCount,
    bodsLocalStopDistribution: timetable.localStopDistribution,
    bodsNearestRejectedStopDistanceMetres: timetable.nearestRejectedStopDistanceMetres,
    bodsLocalDatasetMaxDistanceMetres: timetable.localDatasetMaxDistanceMetres,
    bodsDownloadedFileCount: timetable.downloadedFileCount,
    bodsParsedFileCount: timetable.parsedXmlFileCount,
    bodsParseFailureCount: timetable.parseFailureCount,
    bodsStopReferenceCount: timetable.stopReferenceCount,
    bodsDirectCoordinateStopCount: timetable.directCoordinateStopCount,
    bodsRouteLinkCoordinateStopCount: timetable.routeLinkCoordinateStopCount,
    bodsEnrichedCoordinateStopCount: timetable.enrichedCoordinateStopCount,
    bodsUnresolvedCoordinateStopCount: timetable.unresolvedCoordinateStopCount,
    bodsSampleMissingStopIds: timetable.sampleMissingStopIds,
    bodsParsedRuntimeConnectionCount: timetable.parsedRuntimeConnectionCount,
    bodsEstimatedRuntimeConnectionCount: timetable.estimatedRuntimeConnectionCount,
    bodsRejectedImplausibleConnectionCount: timetable.rejectedImplausibleConnectionCount,
    bodsOriginMatchedStopCount: timetable.originMatchedStopCount,
    bodsImpliedSpeedStats: timetable.impliedSpeedStats,
    bodsOutputGeometryModes: summariseBodsOutputGeometryModes(isochrones),
    datasetCount: datasetUrls.length,
    downloadedFileCount: timetable.downloadedFileCount,
    parsedXmlFileCount: timetable.parsedXmlFileCount,
    stopCount: timetable.stops.length,
    connectionCount: timetable.connections.length,
    initialStopCount: searchResult.initialStopCount,
    initialStopsWithinMaxWalkCount: searchResult.initialStopsWithinMaxWalkCount,
    consideredConnectionCount: searchResult.consideredConnectionCount,
    reachableStopCount: searchResult.reachableStopCount,
    reachableConnectionCount: searchResult.reachableSegments.length,
    reachableStopsByBand: searchResult.reachableStopsByBand,
    reachableConnectionsByBand: searchResult.reachableConnectionsByBand,
    bodsReachableRouteSummary: searchResult.reachableRouteSummary,
    bodsTargetPlaceDiagnostics: searchResult.targetPlaceDiagnostics,
    timetableWarnings: timetable.warnings,
    caveat: "Scheduled timetable output from BODS where TransXChange files could be parsed in-browser. Initial and transfer walking times use straight-line distance multiplied by 1.3 at 4.8 kph / 80 metres per minute. Includes scheduled wait time and one estimated walking transfer. Does not include live disruption, reliability, crowding, cancellations, fare integration or operator-specific journey-planner rules.",
  };
  setMapCacheEntry(BODS_TIMETABLE_CACHE, cacheKey, isochrones, cloneBusIsochroneResult);
  endBusTiming(timing, { cache: "miss", bandCount: isochrones.length, ...isochrones.metadata });
  return isochrones;
}

function isBodsLeedsRealityGateOrigin(originCoordinates) {
  if (!originCoordinates) {
    return false;
  }
  const latitude = Number(originCoordinates.latitude);
  const longitude = Number(originCoordinates.longitude);
  return Number.isFinite(latitude)
    && Number.isFinite(longitude)
    && latitude >= BODS_LEEDS_REALITY_GATE_BOUNDS.minLatitude
    && latitude <= BODS_LEEDS_REALITY_GATE_BOUNDS.maxLatitude
    && longitude >= BODS_LEEDS_REALITY_GATE_BOUNDS.minLongitude
    && longitude <= BODS_LEEDS_REALITY_GATE_BOUNDS.maxLongitude;
}

function bodsQuerySpecUsesAdminArea(querySpec, adminAreaCode) {
  const code = String(adminAreaCode || "");
  return String(querySpec?.kind || "") === "adminArea"
    && String(querySpec?.value || querySpec?.params?.adminArea || "") === code;
}

function getBodsSelectedQuerySpecs(datasetResult = {}) {
  return Array.isArray(datasetResult.selectedQuerySpecs) && datasetResult.selectedQuerySpecs.length
    ? datasetResult.selectedQuerySpecs
    : (datasetResult.selectedQuerySpec ? [datasetResult.selectedQuerySpec] : []);
}

function hasBodsSelectedAdminArea(datasetResult, adminAreaCode) {
  return getBodsSelectedQuerySpecs(datasetResult).some((querySpec) => bodsQuerySpecUsesAdminArea(querySpec, adminAreaCode));
}

function getBodsUnparsedTargetPlaceNames(targetPlaceDiagnostics = []) {
  return (targetPlaceDiagnostics || [])
    .filter((entry) => Number(entry.parsed_matching_stop_count || 0) === 0)
    .map((entry) => entry.target_name);
}

function getBodsWrongAreaRouteSamples(searchResult = {}) {
  const routeRows = searchResult.reachableRouteSummary?.top_routes || [];
  return routeRows
    .filter((route) => (route.sample_stop_names || []).some((name) => BODS_WRONG_AREA_STOP_NAME_PATTERNS.test(String(name || ""))))
    .slice(0, 8);
}

function isBodsTrustedLocalAdminAreaQuery(querySpec, originCoordinates) {
  if (String(querySpec?.kind || "") !== "adminArea") {
    return false;
  }
  const code = String(querySpec?.value || querySpec?.params?.adminArea || "").replace(/[^0-9]/g, "");
  if (code.length < 3) {
    return false;
  }
  if (isBodsLeedsRealityGateOrigin(originCoordinates)) {
    return code === "450";
  }
  const source = String(querySpec?.source || "");
  return /^nearby-origin-stop-(atco|naptan)/i.test(source)
    || /authority-admin-area|mapit-authority|planning-authority/i.test(source);
}

function validateBodsRealityGateForAcceptedSearch(datasetResult, timetable, searchResult, originCoordinates) {
  if (!isBodsLeedsRealityGateOrigin(originCoordinates)) {
    return;
  }

  const selectedSpecs = getBodsSelectedQuerySpecs(datasetResult);
  const unparsedTargetPlaces = getBodsUnparsedTargetPlaceNames(searchResult.targetPlaceDiagnostics);
  const wrongAreaRouteSamples = getBodsWrongAreaRouteSamples(searchResult);
  const selectedAdminArea450 = hasBodsSelectedAdminArea(datasetResult, "450");
  const allPrimaryLeedsTargetsUnparsed = BODS_TARGET_PLACE_NAMES.every((targetName) => unparsedTargetPlaces.includes(targetName));

  if (!selectedAdminArea450 || allPrimaryLeedsTargetsUnparsed || wrongAreaRouteSamples.length > 0) {
    const reasons = [];
    if (!selectedAdminArea450) {
      reasons.push("adminArea=450 was not selected");
    }
    if (allPrimaryLeedsTargetsUnparsed) {
      reasons.push("Leeds target places were not parsed");
    }
    if (wrongAreaRouteSamples.length > 0) {
      reasons.push("remote wrong-area route samples were detected");
    }
    throw createBodsDiagnosticError(
      "wrong_or_incomplete_leeds_bods_graph",
      "Wrong or incomplete BODS graph: Leeds target places were not parsed.",
      {
        selectedQuerySpecs: selectedSpecs,
        requiredAdminArea: "450",
        selectedAdminArea450,
        reasons,
        localStopDistribution: timetable?.localStopDistribution,
        targetPlaceDiagnostics: searchResult.targetPlaceDiagnostics,
        wrongAreaRouteSamples,
      }
    );
  }
}

function buildBodsTimetableCacheKey(originCoordinates, configuredBands, maximumWalkToBusStopMetres, departureDate, departureTime) {
  return JSON.stringify({
    api: BODS_CACHE_SCHEMA_VERSION,
    lat: Number(originCoordinates.latitude).toFixed(5),
    lon: Number(originCoordinates.longitude).toFixed(5),
    bands: configuredBands.map((band) => ({ label: band.label, time: Number(band.time), fill: band.fill })),
    maximumWalkToBusStopMetres: Math.round(maximumWalkToBusStopMetres),
    departureDate,
    departureTime,
  });
}

function createBodsDiagnosticError(stage, message, details = {}) {
  const error = createServiceError(BODS_TIMETABLE_SERVICE_NAME, "unavailable_routing_data", message);
  error.bodsDiagnosticStage = stage;
  error.bodsDiagnostics = { stage, ...details };
  return error;
}

async function fetchLocalBodsTimetableModelProgressively(originCoordinates, maximumWalkToBusStopMetres, options = {}) {
  const nearbyOriginStops = await fetchNearbyBodsOriginStops(originCoordinates);
  const searchTerms = await buildBodsTimetableDatasetSearchTerms(originCoordinates);
  const querySpecs = buildBodsDatasetQuerySpecs(searchTerms);
  const result = {
    timetable: null,
    searchTerms,
    querySpecs,
    querySpecsTried: [],
    selectedQuerySpec: null,
    selectedQuerySpecs: [],
    errors: [],
    queryParametersUsed: [],
    datasetRecordCount: 0,
    downloadUrlsTried: [],
    downloadedFileCount: 0,
    parsedXmlFileCount: 0,
    rejectedNonLocalDatasetCount: 0,
    nearestRejectedStopDistanceMetres: null,
    localDatasetMaxDistanceMetres: getBodsLocalDatasetMaxDistanceMetres(maximumWalkToBusStopMetres),
    nonLocalDatasetSamples: [],
    warnings: [],
  };
  const seenRecordKeys = new Set();
  const seenDownloadUrls = new Set();

  for (let index = 0; index < querySpecs.length; index += 1) {
    const querySpec = querySpecs[index];
    if (options.signal?.aborted) {
      throw createServiceError(BODS_TIMETABLE_SERVICE_NAME, "cancelled", "BODS timetable dataset request was cancelled.");
    }
    result.querySpecsTried.push(summariseBodsQuerySpec(querySpec));
    collectBodsQueryParameterNames(querySpec).forEach((name) => {
      if (!result.queryParametersUsed.includes(name)) {
        result.queryParametersUsed.push(name);
      }
    });
    setStatus("Loading BODS timetables", `Trying BODS dataset query ${index + 1} of ${querySpecs.length}: ${querySpec.value || querySpec.kind}.`, "running");
    render();
    await yieldToBrowser();

    try {
      const payload = await fetchBodsDatasetPayloadForQuerySpec(querySpec, options);
      const records = extractBodsDatasetRecords(payload);
      const newRecords = records.filter((record) => {
        const key = getBodsDatasetRecordKey(record);
        if (!key || seenRecordKeys.has(key)) {
          return false;
        }
        seenRecordKeys.add(key);
        return true;
      });
      result.datasetRecordCount += newRecords.length;
      const orderedRecords = orderBodsDatasetRecordsForOrigin(newRecords, searchTerms, querySpec);
      const remainingDownloadUrlSlots = Math.max(0, BODS_MAX_TOTAL_DOWNLOAD_URLS - result.downloadUrlsTried.length);
      const downloadUrls = extractBodsDatasetDownloadUrls({ results: orderedRecords })
        .filter((url) => {
          if (!url || seenDownloadUrls.has(url)) {
            return false;
          }
          seenDownloadUrls.add(url);
          return true;
        })
        .slice(0, Math.min(BODS_MAX_DATASETS_PER_QUERY, remainingDownloadUrlSlots));
      if (downloadUrls.length === 0) {
        if (result.downloadUrlsTried.length >= BODS_MAX_TOTAL_DOWNLOAD_URLS) {
          break;
        }
        continue;
      }
      result.downloadUrlsTried.push(...downloadUrls);
      setStatus("Parsing BODS timetables", `Parsing ${downloadUrls.length} BODS dataset${downloadUrls.length === 1 ? "" : "s"} from query ${index + 1}.`, "running");
      render();
      const timetable = await buildLocalBodsTimetableModel(downloadUrls, {
        ...options,
        originCoordinates,
        maximumWalkToBusStopMetres,
        nearbyOriginStops,
        querySpec,
        trustedLocalAdminAreaQuery: isBodsTrustedLocalAdminAreaQuery(querySpec, originCoordinates),
      });
      mergeBodsProgressiveDiagnostics(result, timetable);
      if (timetable.localDatasetCount > 0 && timetable.stops.length > 0 && timetable.connections.length > 0) {
        mergeProgressiveLocalBodsTimetable(result, timetable, querySpec);
        if (result.timetable.parsedXmlFileCount >= BODS_MAX_XML_FILES || result.timetable.connections.length >= BODS_MAX_CONNECTIONS || result.timetable.stopsById.size >= BODS_MAX_STOPS) {
          result.timetable.warnings.push("BODS preview caps were reached while merging local timetable datasets across query specs.");
          break;
        }
      }
    } catch (error) {
      if (error?.kind === "cancelled") {
        throw error;
      }
      result.errors.push({ querySpec: summariseBodsQuerySpec(querySpec), message: error?.userMessage || error?.message || String(error) });
    }
  }

  result.queryParametersUsed.sort();
  if (result.timetable) {
    result.timetable.stops = Array.from(result.timetable.stopsById.values());
    result.timetable.connections = result.timetable.connections
      .filter((connection) => result.timetable.stopsById.has(connection.fromStopId) && result.timetable.stopsById.has(connection.toStopId))
      .sort((a, b) => a.departureMinutes - b.departureMinutes)
      .slice(0, BODS_MAX_CONNECTIONS);
    if (!Number.isFinite(result.timetable.nearestRejectedStopDistanceMetres)) {
      result.timetable.nearestRejectedStopDistanceMetres = null;
    }
    if (!Number.isFinite(result.timetable.nearestStopDistanceMetres)) {
      result.timetable.nearestStopDistanceMetres = null;
    }
  }
  return result;
}

function mergeProgressiveLocalBodsTimetable(result, timetable, querySpec) {
  if (!result.timetable) {
    result.timetable = createEmptyBodsTimetableModelDiagnostics();
    result.timetable.localDatasetMaxDistanceMetres = timetable.localDatasetMaxDistanceMetres;
  }
  if (!result.selectedQuerySpec) {
    result.selectedQuerySpec = summariseBodsQuerySpec(querySpec);
  }
  result.selectedQuerySpecs.push(summariseBodsQuerySpec(querySpec));
  mergeBodsTimetableDiagnostics(result.timetable, timetable);
  mergeBodsTimetableModel(result.timetable, timetable);
  result.timetable.localDatasetCount += Number(timetable.localDatasetCount) || 0;
  result.timetable.rejectedNonLocalDatasetCount += Number(timetable.rejectedNonLocalDatasetCount) || 0;
  result.timetable.nearestStopDistanceMetres = Math.min(result.timetable.nearestStopDistanceMetres ?? Infinity, Number(timetable.nearestStopDistanceMetres) || Infinity);
  if (Number.isFinite(Number(timetable.nearestRealStopDistanceMetres))) {
    result.timetable.nearestRealStopDistanceMetres = Math.min(result.timetable.nearestRealStopDistanceMetres ?? Infinity, Number(timetable.nearestRealStopDistanceMetres));
  }
  result.timetable.realLocalStopCount += Number(timetable.realLocalStopCount) || 0;
  if (Number.isFinite(Number(timetable.nearestRejectedStopDistanceMetres))) {
    result.timetable.nearestRejectedStopDistanceMetres = Math.min(result.timetable.nearestRejectedStopDistanceMetres ?? Infinity, Number(timetable.nearestRejectedStopDistanceMetres));
  }
  timetable.nonLocalDatasetSamples?.forEach((sample) => {
    if (result.timetable.nonLocalDatasetSamples.length < 12) {
      result.timetable.nonLocalDatasetSamples.push(sample);
    }
  });
}

async function fetchBodsDatasetPayloadForQuerySpec(querySpec, options = {}) {
  const url = new URL(BODS_DATASET_ENDPOINT, window.location.origin);
  url.searchParams.set("limit", String(BODS_MAX_DATASET_QUERY_RESULTS));
  if (querySpec.includeStatus !== false) {
    url.searchParams.set("status", "published");
  }
  Object.entries(querySpec.params || {}).forEach(([key, value]) => {
    if (value !== null && value !== undefined && String(value).trim()) {
      url.searchParams.set(key, String(value).trim());
    }
  });
  return fetchJsonWithDiagnostics(url.toString(), { signal: options.signal }, BODS_TIMETABLE_SERVICE_NAME, 90000);
}

function summariseBodsQuerySpec(querySpec) {
  return {
    key: querySpec.key,
    kind: querySpec.kind,
    value: querySpec.value,
    source: querySpec.source,
    includeStatus: querySpec.includeStatus !== false,
    params: { ...(querySpec.params || {}) },
  };
}

function collectBodsQueryParameterNames(querySpec) {
  return [
    "limit",
    querySpec.includeStatus === false ? null : "status",
    ...Object.keys(querySpec.params || {}),
  ].filter(Boolean);
}

function getBodsDatasetRecordKey(record) {
  const rawId = record?.id ?? record?.dataset_id ?? record?.datasetID ?? record?.datasetId ?? record?.url ?? record?.downloadUrl ?? record?.download_url;
  return rawId === undefined || rawId === null ? "" : String(rawId);
}

function mergeBodsProgressiveDiagnostics(target, timetable) {
  target.downloadedFileCount += Number(timetable.downloadedFileCount) || 0;
  target.parsedXmlFileCount += Number(timetable.parsedXmlFileCount) || 0;
  target.rejectedNonLocalDatasetCount += Number(timetable.rejectedNonLocalDatasetCount) || 0;
  target.warnings.push(...(timetable.warnings || []));
  if (Number.isFinite(Number(timetable.nearestRejectedStopDistanceMetres))) {
    target.nearestRejectedStopDistanceMetres = target.nearestRejectedStopDistanceMetres === null
      ? Number(timetable.nearestRejectedStopDistanceMetres)
      : Math.min(target.nearestRejectedStopDistanceMetres, Number(timetable.nearestRejectedStopDistanceMetres));
  }
  timetable.nonLocalDatasetSamples?.forEach((sample) => {
    if (target.nonLocalDatasetSamples.length < 12) {
      target.nonLocalDatasetSamples.push(sample);
    }
  });
}

async function fetchBodsDatasetMetadata(originCoordinates, maximumWalkToBusStopMetres, options = {}) {
  const searchTerms = await buildBodsTimetableDatasetSearchTerms(originCoordinates);
  const querySpecs = buildBodsDatasetQuerySpecs(searchTerms);
  const cacheKey = JSON.stringify({
    lat: Number(originCoordinates.latitude).toFixed(5),
    lon: Number(originCoordinates.longitude).toFixed(5),
    terms: searchTerms.map((term) => term.normalised).sort(),
    limit: BODS_MAX_DATASET_QUERY_RESULTS,
    api: BODS_CACHE_SCHEMA_VERSION,
  });
  const cached = getMapCacheEntry(BODS_DATASET_CACHE, cacheKey, clonePlainValue);
  if (cached) {
    return cached;
  }

  const payloads = [];
  const errors = [];
  for (const querySpec of selectBodsDatasetQuerySpecsForAttempt(querySpecs)) {
    if (options.signal?.aborted) {
      throw createServiceError(BODS_TIMETABLE_SERVICE_NAME, "cancelled", "BODS timetable dataset request was cancelled.");
    }
    try {
      const url = new URL(BODS_DATASET_ENDPOINT, window.location.origin);
      url.searchParams.set("limit", String(BODS_MAX_DATASET_QUERY_RESULTS));
      if (querySpec.includeStatus !== false) {
        url.searchParams.set("status", "published");
      }
      Object.entries(querySpec.params).forEach(([key, value]) => {
        if (value !== null && value !== undefined && String(value).trim()) {
          url.searchParams.set(key, String(value).trim());
        }
      });
      const payload = await fetchJsonWithDiagnostics(url.toString(), { signal: options.signal }, BODS_TIMETABLE_SERVICE_NAME, 90000);
      payloads.push({ querySpec, payload });
      const collectedRecords = dedupeBodsDatasetRecords(payloads.flatMap(({ payload: queryPayload }) => extractBodsDatasetRecords(queryPayload)));
      if (collectedRecords.length >= BODS_MAX_DATASET_QUERY_RESULTS && querySpec.kind !== "fallback") {
        break;
      }
    } catch (error) {
      errors.push({ querySpec, message: error?.userMessage || error?.message || String(error) });
    }
  }

  const records = dedupeBodsDatasetRecords(payloads.flatMap(({ payload }) => extractBodsDatasetRecords(payload)));
  const queryParametersUsed = Array.from(new Set(payloads.flatMap(({ querySpec }) => [
    "limit",
    querySpec.includeStatus === false ? null : "status",
    ...Object.keys(querySpec.params || {}),
  ]))).filter(Boolean).sort();
  const payload = {
    results: records,
    count: records.length,
    query_terms: searchTerms.map((term) => term.value),
    query_count: payloads.length,
    query_errors: errors,
    query_parameters_used: queryParametersUsed,
    bods_query_note: "Timetable datasets are discovered using supported BODS timetable parameters such as adminArea and search. The previous boundingBox parameter is not used for timetable data.",
  };
  const result = { payload, searchTerms, querySpecs, errors, queryParametersUsed };
  setMapCacheEntry(BODS_DATASET_CACHE, cacheKey, result, clonePlainValue);
  return result;
}

function selectBodsDatasetQuerySpecsForAttempt(querySpecs) {
  const fallbackSpecs = querySpecs.filter((spec) => spec.kind === "fallback");
  const localSpecs = querySpecs.filter((spec) => spec.kind !== "fallback");
  const localLimit = Math.max(0, BODS_MAX_DATASET_QUERY_ATTEMPTS - fallbackSpecs.length);
  return [...localSpecs.slice(0, localLimit), ...fallbackSpecs];
}

function addBodsTargetCorridorSearchTerms(originCoordinates, addTerm) {
  const targetPlaces = BODS_TARGET_PLACE_NAMES;
  const projectText = String(elements.projectName?.value || "");
  const authorityText = String(elements.planningAuthority?.value || "");
  const localContextTerms = [
    extractLikelyOriginPlaceName(projectText),
    authorityText,
    "Leeds",
    "West Yorkshire",
  ].filter(Boolean);

  targetPlaces.forEach((place, index) => {
    const priority = Math.max(82, 146 - index * 2);
    addTerm(place, "target-place-corridor", { priority });
    localContextTerms.slice(0, 3).forEach((context, contextIndex) => {
      if (normaliseBodsStopName(context) && !doBodsStopNamesMatch(context, place)) {
        addTerm(`${context} ${place}`, "target-place-corridor-pair", { priority: priority - 1 - contextIndex });
      }
    });
  });
}

function extractLikelyOriginPlaceName(value) {
  const text = String(value || "").trim();
  if (!text) {
    return "";
  }
  const parts = text.split(/[,\-–—]/).map((part) => part.trim()).filter(Boolean);
  return parts[parts.length - 1] || text;
}

async function buildBodsTimetableDatasetSearchTerms(originCoordinates) {
  const terms = [];
  const addTerm = (value, source, options = {}) => {
    const cleaned = cleanBodsSearchTerm(value, options);
    if (!cleaned) {
      return;
    }
    const normalised = cleaned.toLowerCase();
    const priority = Number(options.priority) || 0;
    const existing = terms.find((term) => term.normalised === normalised);
    if (existing) {
      if (priority > (Number(existing.priority) || 0)) {
        existing.priority = priority;
        existing.source = source;
      }
      return;
    }
    terms.push({ value: cleaned, normalised, source, priority });
  };

  const nearbyStops = await fetchNearbyBodsOriginStops(originCoordinates);
  nearbyStops.forEach((stop, index) => {
    const basePriority = Math.max(40, 130 - index * 3);
    addTerm(stop.atcoCode, "nearby-origin-stop-atco", { priority: basePriority + 10, keepShortCodes: true });
    addTerm(stop.naptanCode, "nearby-origin-stop-naptan", { priority: basePriority + 9, keepShortCodes: true });
    addTerm(stop.ref, "nearby-origin-stop-ref", { priority: basePriority + 8, keepShortCodes: true });
    addTerm(stop.localRef, "nearby-origin-stop-local-ref", { priority: basePriority + 7, keepShortCodes: true });
    addTerm(stop.name, "nearby-origin-stop-name", { priority: basePriority + 6 });
    addTerm(stop.street, "nearby-origin-stop-street", { priority: basePriority + 4 });
    addTerm(stop.localityName, "nearby-origin-stop-locality", { priority: basePriority + 4 });
    addTerm(stop.routeRef, "nearby-origin-stop-route-ref", { priority: basePriority + 3, keepShortCodes: true });
    addTerm(stop.operator, "nearby-origin-stop-operator", { priority: basePriority + 2 });
  });

  addBodsTargetCorridorSearchTerms(originCoordinates, addTerm);

  // BODS dataset discovery deliberately does not use OSM route refs/names/destinations.
  // Those values are global free-text terms and previously pulled remote London/Hertfordshire datasets into Leeds runs.

  try {
    const authorityName = await lookupPlanningAuthorityForCoordinates(originCoordinates);
    addTerm(authorityName, "mapit-authority", { priority: 80 });
  } catch (error) {
    // Planning authority lookup is helpful for BODS filtering but not required.
  }

  state.amenities
    .filter((item) => item.category === "Settlement" && item.name)
    .sort((a, b) => (Number(a.distance) || 0) - (Number(b.distance) || 0))
    .slice(0, 10)
    .forEach((item) => addTerm(item.name, "settlement-amenity", { priority: 70 }));

  addTerm(elements.planningAuthority?.value, "planning-authority-field", { priority: 40 });
  addTerm(String(elements.projectName?.value || "").split(",").pop(), "project-name-tail", { priority: 20 });
  addBodsTransportAreaAliasTerms(terms, addTerm);
  return terms
    .sort((a, b) => (b.priority || 0) - (a.priority || 0))
    .slice(0, 64);
}

async function fetchNearbyBodsOriginStopSearchTerms(originCoordinates) {
  const stops = await fetchNearbyBodsOriginStops(originCoordinates);
  const terms = [];
  const seen = new Set();
  const add = (value, source, priority = 0) => {
    const cleaned = cleanBodsSearchTerm(value, { keepShortCodes: true });
    if (!cleaned) {
      return;
    }
    const key = cleaned.toLowerCase();
    if (seen.has(key)) {
      return;
    }
    seen.add(key);
    terms.push({ value: cleaned, source, priority });
  };
  stops.forEach((stop, index) => {
    const basePriority = Math.max(40, 120 - index * 3);
    add(stop.atcoCode, "nearby-origin-stop-atco", basePriority + 8);
    add(stop.naptanCode, "nearby-origin-stop-naptan", basePriority + 7);
    add(stop.name, "nearby-origin-stop-name", basePriority + 6);
    add(stop.ref, "nearby-origin-stop-ref", basePriority + 5);
    add(stop.localRef, "nearby-origin-stop-local-ref", basePriority + 4);
    add(stop.routeRef, "nearby-origin-stop-route-ref", basePriority + 3);
    add(stop.operator, "nearby-origin-stop-operator", basePriority + 2);
  });
  return terms;
}


async function fetchNearbyBodsOriginRouteHints(originCoordinates, options = {}) {
  if (!originCoordinates || BODS_ORIGIN_ROUTE_HINT_RADIUS_METRES <= 0 || BODS_MAX_ORIGIN_ROUTE_HINTS <= 0) {
    return [];
  }
  try {
    const query = buildNearbyBodsOriginRoutesOverpassQuery(originCoordinates, BODS_ORIGIN_ROUTE_HINT_RADIUS_METRES);
    const payload = await fetchOsmBusRouteOverpassPayload(query, { signal: options.signal }, 30000);
    const seen = new Set();
    return (payload.elements || [])
      .map(normaliseNearbyBodsOriginRouteHint)
      .filter(Boolean)
      .filter((route) => {
        const key = [route.ref, route.name, route.operator, route.network, route.to].filter(Boolean).join("|").toLowerCase();
        if (!key || seen.has(key)) {
          return false;
        }
        seen.add(key);
        return true;
      })
      .slice(0, BODS_MAX_ORIGIN_ROUTE_HINTS);
  } catch (error) {
    if (error?.kind === "cancelled") {
      throw error;
    }
    return [];
  }
}

function buildNearbyBodsOriginRoutesOverpassQuery(originCoordinates, radiusMetres) {
  const radius = Math.round(Number(radiusMetres) || BODS_ORIGIN_ROUTE_HINT_RADIUS_METRES);
  return `
[out:json][timeout:28];
(
  relation(around:${radius},${originCoordinates.latitude},${originCoordinates.longitude})["type"="route"]["route"~"^(bus|coach|trolleybus)$"];
);
out tags qt;
  `;
}

function normaliseNearbyBodsOriginRouteHint(element) {
  if (!element || element.type !== "relation") {
    return null;
  }
  const tags = element.tags || {};
  const routeMode = String(tags.route || "").toLowerCase();
  if (tags.type !== "route" || !/^(bus|coach|trolleybus)$/.test(routeMode)) {
    return null;
  }
  const ref = firstNonEmpty(tags.ref, tags.route_ref, tags["ref:route"]);
  const name = firstNonEmpty(tags.name, tags.official_name, tags.description);
  const operator = firstNonEmpty(tags.operator, tags["operator:short"], tags.brand);
  const network = firstNonEmpty(tags.network, tags["network:short"]);
  const from = firstNonEmpty(tags.from, tags.origin);
  const to = firstNonEmpty(tags.to, tags.destination);
  const via = splitBodsRouteHintList(firstNonEmpty(tags.via, tags.description));
  if (!firstNonEmpty(ref, name, operator, network, from, to, via[0])) {
    return null;
  }
  return { ref, name, operator, network, from, to, via };
}

function splitBodsRouteHintList(value) {
  return String(value || "")
    .split(/\s*(?:;|,|\bvia\b|->|=>|\/)\s*/i)
    .map((item) => item.trim())
    .filter((item) => item.length >= 3)
    .slice(0, 8);
}

async function fetchNearbyBodsOriginStops(originCoordinates) {
  if (!originCoordinates) {
    return [];
  }
  const query = buildNearbyBodsOriginStopsOverpassQuery(originCoordinates, BODS_ORIGIN_STOP_SEARCH_RADIUS_METRES);
  try {
    const payload = await fetchOsmBusRouteOverpassPayload(query, {}, 15000);
    return (payload.elements || [])
      .map((element) => normaliseNearbyBodsOriginStop(element, originCoordinates))
      .filter(Boolean)
      .sort((a, b) => a.distanceMetres - b.distanceMetres)
      .slice(0, 36);
  } catch (error) {
    return [];
  }
}

function buildNearbyBodsOriginStopsOverpassQuery(originCoordinates, radiusMetres) {
  return `
[out:json][timeout:35];
(
  node(around:${Math.round(radiusMetres)},${originCoordinates.latitude},${originCoordinates.longitude})["highway"="bus_stop"];
  node(around:${Math.round(radiusMetres)},${originCoordinates.latitude},${originCoordinates.longitude})["public_transport"~"platform|stop_position"]["bus"~"yes|designated"];
  way(around:${Math.round(radiusMetres)},${originCoordinates.latitude},${originCoordinates.longitude})["highway"="bus_stop"];
  way(around:${Math.round(radiusMetres)},${originCoordinates.latitude},${originCoordinates.longitude})["public_transport"~"platform|stop_position"]["bus"~"yes|designated"];
);
out center tags;
  `;
}

function normaliseNearbyBodsOriginStop(element, originCoordinates) {
  const latitude = Number.isFinite(Number(element.lat)) ? Number(element.lat) : Number(element.center?.lat);
  const longitude = Number.isFinite(Number(element.lon)) ? Number(element.lon) : Number(element.center?.lon);
  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
    return null;
  }
  const tags = element.tags || {};
  return {
    id: String(element.id || ""),
    name: tags.name || tags["official_name"] || tags["naptan:CommonName"] || tags.commonName || "",
    street: tags["naptan:Street"] || tags.street || "",
    localityName: tags["naptan:LocalityName"] || tags.locality || tags["addr:city"] || "",
    latitude,
    longitude,
    distanceMetres: getDistanceMetres(originCoordinates.latitude, originCoordinates.longitude, latitude, longitude),
    atcoCode: tags["naptan:AtcoCode"] || tags["ref:GB:naptan"] || tags.atco_code || tags.AtcoCode || tags.atcoCode || "",
    naptanCode: tags["naptan:NaptanCode"] || tags.naptan_code || tags.NaptanCode || tags.naptanCode || "",
    ref: tags.ref || "",
    localRef: tags.local_ref || tags.local_ref_name || tags["naptan:Bearing"] || "",
    routeRef: tags.route_ref || tags["bus:route_ref"] || tags.routes || "",
    operator: tags.operator || tags.network || tags.brand || "",
  };
}

function normaliseBodsStopIdentifier(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/^(atco|naptan|stop|ref):/, "")
    .replace(/[^a-z0-9]/g, "");
}

function getNearbyOriginStopCodeCandidates(stop) {
  // Only real ATCO / NaPTAN codes are safe enough for BODS stop matching and admin-area derivation.
  // Generic OSM ref/local_ref values caused remote datasets to be falsely accepted.
  return [stop?.atcoCode, stop?.naptanCode]
    .map(normaliseBodsStopIdentifier)
    .filter((value) => value && value.length >= 3);
}

function buildNearbyOriginStopLookup(nearbyStops = []) {
  const lookup = new Map();
  nearbyStops.forEach((stop) => {
    getNearbyOriginStopCodeCandidates(stop).forEach((candidate) => {
      if (!lookup.has(candidate)) {
        lookup.set(candidate, stop);
      }
    });
  });
  return lookup;
}

function normaliseBodsStopName(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/\b(stop|stand|opp|opposite|adj|adjacent|near|outside|before|after|at)\b/g, " ")
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function doBodsStopNamesMatch(a, b) {
  const left = normaliseBodsStopName(a);
  const right = normaliseBodsStopName(b);
  if (!left || !right || Math.min(left.length, right.length) < 5) {
    return false;
  }
  return left === right || left.includes(right) || right.includes(left);
}

function findNearbyOriginStopMatchesInXml(xmlText, nearbyStops = []) {
  const rawXml = String(xmlText || "");
  const lowerXml = rawXml.toLowerCase();
  const compactXml = normaliseBodsStopIdentifier(rawXml);
  const normalisedNameXml = normaliseBodsStopName(rawXml);
  const matches = [];
  const seen = new Set();
  nearbyStops.forEach((stop) => {
    getNearbyOriginStopCodeCandidates(stop).forEach((candidate) => {
      if (candidate.length < 3 || seen.has(candidate)) {
        return;
      }
      if (lowerXml.includes(candidate.toLowerCase()) || compactXml.includes(candidate)) {
        seen.add(candidate);
        matches.push({ candidate, stop, matchType: "code_in_xml" });
      }
    });
    const stopName = normaliseBodsStopName(stop.name);
    if (stopName && stopName.length >= 5) {
      const nameKey = `name:${stopName}`;
      if (!seen.has(nameKey) && normalisedNameXml.includes(stopName)) {
        seen.add(nameKey);
        matches.push({ candidate: nameKey, stop, matchType: "name_in_xml" });
      }
    }
  });
  return matches;
}

function injectNearbyOriginStopMatchesIntoTxcModel(model, xmlText, nearbyStops = []) {
  const stops = [...(model.stops || [])];
  const missingStops = [...(model.missingCoordinateStops || [])];
  const stopsByNormalisedId = new Map(stops.map((stop) => [normaliseBodsStopIdentifier(stop.id), stop]));
  const missingByNormalisedId = new Map(missingStops.map((stop) => [normaliseBodsStopIdentifier(stop.id), stop]));
  const injectedStops = [];
  const matchedIds = new Set();
  const nearbyByStrictCode = new Map();

  (nearbyStops || []).forEach((stop) => {
    [stop?.atcoCode, stop?.naptanCode]
      .map(normaliseBodsStopIdentifier)
      .filter((value) => value && value.length >= 3)
      .forEach((candidate) => {
        if (!nearbyByStrictCode.has(candidate)) {
          nearbyByStrictCode.set(candidate, stop);
        }
      });
  });

  const addOrUpdateMatchedStop = (txcStopId, txcStopName, nearbyStop, source) => {
    if (!txcStopId || !nearbyStop || !Number.isFinite(nearbyStop.latitude) || !Number.isFinite(nearbyStop.longitude)) {
      return;
    }
    const normalisedId = normaliseBodsStopIdentifier(txcStopId);
    const existingStop = stopsByNormalisedId.get(normalisedId);
    if (existingStop) {
      existingStop.latitude = nearbyStop.latitude;
      existingStop.longitude = nearbyStop.longitude;
      existingStop.name = existingStop.name || txcStopName || nearbyStop.name || txcStopId;
      existingStop.coordinateSource = source;
      matchedIds.add(normalisedId);
      return;
    }
    if (matchedIds.has(normalisedId)) {
      return;
    }
    const injected = {
      id: txcStopId,
      name: txcStopName || nearbyStop.name || txcStopId,
      latitude: nearbyStop.latitude,
      longitude: nearbyStop.longitude,
      coordinateSource: source,
    };
    injectedStops.push(injected);
    stopsByNormalisedId.set(normalisedId, injected);
    matchedIds.add(normalisedId);
  };

  // Only exact ATCO/NaPTAN matches may inject origin coordinates. Name/ref/local_ref matching is too broad
  // and previously made remote datasets pass local validation.
  [...stops, ...missingStops].forEach((candidateStop) => {
    const normalisedId = normaliseBodsStopIdentifier(candidateStop?.id);
    const nearbyStop = nearbyByStrictCode.get(normalisedId);
    if (nearbyStop) {
      addOrUpdateMatchedStop(candidateStop.id, candidateStop.name, nearbyStop, "nearby_origin_stop_exact_atco_naptan_match");
    }
  });

  if (injectedStops.length > 0) {
    model.stops = [...stops, ...injectedStops];
  } else {
    model.stops = stops;
  }
  model.originMatchedStopCount = matchedIds.size;
  return model;
}

function addBodsTransportAreaAliasTerms(terms, addTerm) {
  const currentTerms = [...terms];
  currentTerms.forEach((term) => {
    BODS_TRANSPORT_AREA_ALIAS_RULES.forEach((rule) => {
      if (rule.pattern.test(term.value)) {
        rule.aliases.forEach((alias) => addTerm(alias, `transport-area-alias:${term.source}`));
      }
    });
  });
}

function cleanBodsSearchTerm(value, options = {}) {
  const raw = String(value || "").trim();
  if (!raw) {
    return "";
  }
  const compact = raw.replace(/\s+/g, "");
  if (options.keepShortCodes && /^[A-Z0-9]{3,24}$/i.test(compact)) {
    return compact;
  }
  const cleaned = raw
    .replace(/\b(city|county|borough|district|metropolitan|unitary|council|local authority)\b/gi, " ")
    .replace(/\b(at|land|site|near|north|south|east|west)\b/gi, " ")
    .replace(/[^a-z0-9&'\-\s]/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
  if (!cleaned || cleaned.length < 3) {
    return "";
  }
  return cleaned;
}

function orderBodsDatasetRecordsForOrigin(records, searchTerms, querySpec) {
  return [...records].sort((a, b) => {
    const scoreDelta = scoreBodsDatasetRecordForOrigin(b, searchTerms, querySpec) - scoreBodsDatasetRecordForOrigin(a, searchTerms, querySpec);
    if (scoreDelta !== 0) {
      return scoreDelta;
    }
    return String(getBodsDatasetRecordKey(a)).localeCompare(String(getBodsDatasetRecordKey(b)), "en-GB");
  });
}

function scoreBodsDatasetRecordForOrigin(record, searchTerms, querySpec) {
  const text = JSON.stringify(record || {}).toLowerCase();
  let score = 0;
  if (querySpec?.value && text.includes(String(querySpec.value).toLowerCase())) {
    score += 20;
  }
  (searchTerms || []).forEach((term) => {
    if (!term?.normalised) {
      return;
    }
    if (text.includes(term.normalised)) {
      score += 10 + (Number(term.priority) || 0) / 10;
    }
  });
  if (/published/.test(text)) {
    score += 1;
  }
  if (/transxchange|download|xml|zip/.test(text)) {
    score += 1;
  }
  return score;
}


function getBodsAuthorityAdminAreaCodeEntries(searchTerms = []) {
  const entries = [];
  const addEntry = (value, source) => {
    const code = String(value || "").replace(/[^0-9]/g, "");
    if (code.length < 3 || entries.some((entry) => entry.value === code)) {
      return;
    }
    entries.push({ value: code, source });
  };

  (searchTerms || []).forEach((term) => {
    const value = String(term?.value || "");
    const source = String(term?.source || "");
    BODS_AUTHORITY_ADMIN_AREA_CODE_RULES.forEach((rule) => {
      if (rule.pattern.test(value)) {
        rule.codes.forEach((code) => addEntry(code, `${source || "term"}:authority-admin-area`));
      }
    });
  });

  return entries;
}

function shouldUseBodsDatasetFreeTextSearchTerm(term) {
  const source = String(term?.source || "");
  const value = String(term?.value || "").trim();
  if (!value) {
    return false;
  }

  // BODS free-text search is global. Do not let route hints, route refs, stop refs, or numeric-only
  // values select remote datasets such as London / Potters Bar for a Leeds origin.
  if (/^nearby-origin-route-/i.test(source)) {
    return false;
  }
  if (/^nearby-origin-stop-(ref|local-ref|route-ref)$/i.test(source)) {
    return false;
  }
  if (/^\d+$/.test(value.replace(/\s+/g, ""))) {
    return false;
  }

  return true;
}

function isBodsSyntheticOriginMatchedStop(stop = {}) {
  const source = String(stop.coordinateSource || "");
  return /^nearby_origin_stop/i.test(source);
}

function isBodsExactOriginCodeMatchedStop(stop = {}) {
  const source = String(stop.coordinateSource || "");
  return /^nearby_origin_stop_(exact_atco_naptan_match|graph_exact_atco_naptan_match)/i.test(source);
}

function countBodsExactOriginCodeMatchedStops(stops = []) {
  return (Array.isArray(stops) ? stops : []).filter(isBodsExactOriginCodeMatchedStop).length;
}

function getBodsTimetableConnectionCount(timetable = {}) {
  return Array.isArray(timetable.connections) ? timetable.connections.length : 0;
}

function getBodsTimetableStopCount(timetable = {}) {
  return Array.isArray(timetable.stops) ? timetable.stops.length : 0;
}

function getBodsRealStops(stops = []) {
  return (Array.isArray(stops) ? stops : [])
    .filter((stop) => stop && !isBodsSyntheticOriginMatchedStop(stop) && Number.isFinite(stop.latitude) && Number.isFinite(stop.longitude));
}

function buildBodsRealLocalStopDistribution(stops, originCoordinates) {
  const realStops = getBodsRealStops(stops);
  const distribution = {
    totalRealStopCount: realStops.length,
    within1km: 0,
    within5km: 0,
    within10km: 0,
    within15km: 0,
    within25km: 0,
    nearestRealStopDistanceMetres: null,
    realStopShareWithin15km: 0,
    acceptedDistribution: false,
  };
  if (!originCoordinates) {
    return distribution;
  }
  let nearest = Infinity;
  realStops.forEach((stop) => {
    const distance = getDistanceMetres(originCoordinates.latitude, originCoordinates.longitude, stop.latitude, stop.longitude);
    if (!Number.isFinite(distance)) {
      return;
    }
    nearest = Math.min(nearest, distance);
    if (distance <= 1000) distribution.within1km += 1;
    if (distance <= 5000) distribution.within5km += 1;
    if (distance <= 10000) distribution.within10km += 1;
    if (distance <= 15000) distribution.within15km += 1;
    if (distance <= 25000) distribution.within25km += 1;
  });
  distribution.nearestRealStopDistanceMetres = Number.isFinite(nearest) ? nearest : null;
  distribution.realStopShareWithin15km = distribution.totalRealStopCount > 0
    ? distribution.within15km / distribution.totalRealStopCount
    : 0;
  distribution.acceptedDistribution = isBodsCredibleLocalStopDistribution(distribution);
  return distribution;
}

function isBodsCredibleLocalStopDistribution(distribution = {}) {
  if (Number(distribution.within10km) >= BODS_MIN_REAL_STOPS_WITHIN_10KM_FOR_ACCEPTANCE) {
    return true;
  }
  return Number(distribution.within15km) >= BODS_MIN_REAL_STOPS_WITHIN_15KM_FOR_ACCEPTANCE
    && Number(distribution.realStopShareWithin15km || 0) >= BODS_MIN_REAL_STOP_SHARE_WITHIN_15KM_FOR_ACCEPTANCE;
}

function mergeBodsLocalStopDistributions(left = {}, right = {}) {
  const merged = {
    totalRealStopCount: Number(left.totalRealStopCount || 0) + Number(right.totalRealStopCount || 0),
    within1km: Number(left.within1km || 0) + Number(right.within1km || 0),
    within5km: Number(left.within5km || 0) + Number(right.within5km || 0),
    within10km: Number(left.within10km || 0) + Number(right.within10km || 0),
    within15km: Number(left.within15km || 0) + Number(right.within15km || 0),
    within25km: Number(left.within25km || 0) + Number(right.within25km || 0),
    nearestRealStopDistanceMetres: [left.nearestRealStopDistanceMetres, right.nearestRealStopDistanceMetres]
      .map(Number)
      .filter(Number.isFinite)
      .reduce((best, value) => Math.min(best, value), Infinity),
    realStopShareWithin15km: 0,
    acceptedDistribution: false,
  };
  return finaliseBodsLocalStopDistribution(merged);
}

function finaliseBodsLocalStopDistribution(distribution = {}) {
  const finalised = { ...distribution };
  if (!Number.isFinite(Number(finalised.nearestRealStopDistanceMetres))) {
    finalised.nearestRealStopDistanceMetres = null;
  }
  finalised.realStopShareWithin15km = Number(finalised.totalRealStopCount || 0) > 0
    ? Number(finalised.within15km || 0) / Number(finalised.totalRealStopCount || 0)
    : 0;
  finalised.acceptedDistribution = isBodsCredibleLocalStopDistribution(finalised);
  return finalised;
}

function countBodsRealLocalStopsNearOrigin(stops, originCoordinates, radiusMetres = BODS_REAL_LOCAL_STOP_RADIUS_METRES) {
  if (!originCoordinates || !Array.isArray(stops)) {
    return 0;
  }
  return getBodsRealStops(stops).filter((stop) => {
    const distance = getDistanceMetres(originCoordinates.latitude, originCoordinates.longitude, stop.latitude, stop.longitude);
    return Number.isFinite(distance) && distance <= radiusMetres;
  }).length;
}

function getNearestRealBodsStopDistanceMetres(stops, originCoordinates) {
  return buildBodsRealLocalStopDistribution(stops, originCoordinates).nearestRealStopDistanceMetres;
}

function buildBodsDatasetQuerySpecs(searchTerms) {
  const specs = [];
  const seenSpecKeys = new Set();

  const addSpec = (kind, value, source, includeStatus = true) => {
    const cleaned = kind === "adminArea"
      ? String(value || "").replace(/[^0-9]/g, "")
      : cleanBodsSearchTerm(value, { keepShortCodes: true });
    if (!cleaned) {
      return;
    }
    if (kind === "adminArea" && cleaned.length < 3) {
      return;
    }
    if (kind === "search" && !shouldUseBodsDatasetFreeTextSearchTerm({ value: cleaned, source })) {
      return;
    }
    const key = `${kind}:${includeStatus ? "published" : "any-status"}:${cleaned.toLowerCase()}`;
    if (seenSpecKeys.has(key)) {
      return;
    }
    seenSpecKeys.add(key);
    specs.push({
      key,
      kind,
      value: cleaned,
      source,
      includeStatus,
      params: kind === "adminArea" ? { adminArea: cleaned } : { search: cleaned },
    });
  };

  const addAdminAreaSpec = (value, source, includeStatus = true) => {
    const code = String(value || "").replace(/[^0-9]/g, "");
    if (code.length < 3) {
      return;
    }
    addSpec("adminArea", code, source, includeStatus);
  };

  const addSearchSpec = (value, source, includeStatus = true) => {
    const cleaned = cleanBodsSearchTerm(value, { keepShortCodes: true });
    if (!cleaned || /^\d+$/.test(cleaned)) {
      return;
    }
    addSpec("search", cleaned, source, includeStatus);
  };

  const derivedAdminAreaByCode = new Map();
  const addDerivedAdminAreaCode = (value, source) => {
    const compact = String(value || "").replace(/[^A-Za-z0-9]/g, "");
    const numericPrefix = compact.match(/^(\d{3})/i)?.[1] || "";
    if (!numericPrefix || derivedAdminAreaByCode.has(numericPrefix)) {
      return;
    }
    derivedAdminAreaByCode.set(numericPrefix, { value: numericPrefix, source });
  };

  (searchTerms || []).forEach((term) => {
    const source = String(term?.source || "");
    if (/^nearby-origin-stop-(atco|naptan)$/i.test(source)) {
      addDerivedAdminAreaCode(term.value, `${source}:admin-area-prefix3`);
    }
  });

  getBodsAuthorityAdminAreaCodeEntries(searchTerms).forEach((entry) => {
    if (!derivedAdminAreaByCode.has(entry.value)) {
      derivedAdminAreaByCode.set(entry.value, entry);
    }
  });

  const neighbourAdminAreaEntries = [];
  derivedAdminAreaByCode.forEach((entry, code) => {
    (BODS_ADMIN_AREA_NEIGHBOUR_CODES[code] || []).forEach((neighbourCode) => {
      if (!derivedAdminAreaByCode.has(neighbourCode) && !neighbourAdminAreaEntries.some((candidate) => candidate.value === neighbourCode)) {
        neighbourAdminAreaEntries.push({
          value: neighbourCode,
          source: `${entry.source}:neighbour-admin-area-${code}`,
        });
      }
    });
  });

  // Numeric adminArea is the primary BODS timetable selector. For Leeds / West Yorkshire, this
  // must place adminArea=450 ahead of any broad free-text query.
  derivedAdminAreaByCode.forEach((entry) => addAdminAreaSpec(entry.value, entry.source, true));
  neighbourAdminAreaEntries.forEach((entry) => addAdminAreaSpec(entry.value, entry.source, true));
  derivedAdminAreaByCode.forEach((entry) => addAdminAreaSpec(entry.value, entry.source, false));
  neighbourAdminAreaEntries.forEach((entry) => addAdminAreaSpec(entry.value, entry.source, false));

  (searchTerms || [])
    .filter((term) => /^target-place-corridor/.test(String(term.source || "")))
    .forEach((term) => {
      addSearchSpec(term.value, term.source, true);
      addSearchSpec(term.value, term.source, false);
    });

  (searchTerms || [])
    .filter((term) => !/^target-place-corridor/.test(String(term.source || "")))
    .filter(shouldUseBodsDatasetFreeTextSearchTerm)
    .forEach((term) => {
      addSearchSpec(term.value, term.source, true);
      addSearchSpec(term.value, term.source, false);
    });

  specs.push({ key: "fallback:published", kind: "fallback", value: "published", source: "fallback", includeStatus: true, params: {} });
  specs.push({ key: "fallback:any-status", kind: "fallback", value: "any status", source: "fallback", includeStatus: false, params: {} });
  return specs;
}

function extractBodsDatasetRecords(payload) {
  if (!payload) {
    return [];
  }
  if (Array.isArray(payload)) {
    return payload;
  }
  if (Array.isArray(payload.results)) {
    return payload.results;
  }
  if (Array.isArray(payload.data)) {
    return payload.data;
  }
  return [];
}

function dedupeBodsDatasetRecords(records) {
  const deduped = [];
  const seen = new Set();
  for (const record of records) {
    const id = record?.id ?? record?.dataset_id ?? record?.datasetID ?? record?.url ?? JSON.stringify(record).slice(0, 200);
    const key = String(id);
    if (!record || seen.has(key)) {
      continue;
    }
    seen.add(key);
    deduped.push(record);
  }
  return deduped;
}

function buildBodsBoundingBox(originCoordinates, radiusMetres) {
  const latDelta = radiusMetres / 111320;
  const lonDelta = radiusMetres / (111320 * Math.max(Math.cos((originCoordinates.latitude * Math.PI) / 180), 0.2));
  // Retained only for diagnostics/older metadata; BODS timetable API calls must not use boundingBox.
  return [
    originCoordinates.latitude - latDelta,
    originCoordinates.latitude + latDelta,
    originCoordinates.longitude - lonDelta,
    originCoordinates.longitude + lonDelta,
  ];
}

function extractBodsDatasetDownloadUrls(payload) {
  const urls = [];
  const preferredUrls = [];
  const addUrl = (candidate, preferred = false) => {
    const normalised = normaliseBodsDatasetUrl(candidate);
    if (!normalised) {
      return;
    }
    const target = preferred ? preferredUrls : urls;
    if (!preferredUrls.includes(normalised) && !urls.includes(normalised)) {
      target.push(normalised);
    }
  };
  const visit = (value, key = "") => {
    if (!value) {
      return;
    }
    if (typeof value === "string") {
      const lowerKey = String(key).toLowerCase();
      const lowerValue = value.toLowerCase();
      const likelyDownload = lowerKey.includes("download") || lowerKey.includes("transxchange") || lowerKey.includes("xml") || lowerKey.includes("zip") || lowerValue.endsWith(".zip") || lowerValue.endsWith(".xml") || /\/download\/?$/i.test(lowerValue);
      addUrl(value, likelyDownload);
      return;
    }
    if (Array.isArray(value)) {
      value.forEach((item) => visit(item, key));
      return;
    }
    if (typeof value === "object") {
      addBodsDatasetIdDownloadUrls(value, addUrl);
      Object.entries(value).forEach(([childKey, childValue]) => visit(childValue, childKey));
    }
  };
  visit(payload);
  return [...preferredUrls, ...urls].filter((url, index, list) => list.indexOf(url) === index);
}

function normaliseBodsDatasetUrl(candidate) {
  if (typeof candidate !== "string") {
    return null;
  }
  const trimmed = candidate.trim();
  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }
  if (/^\/api\/v\d+\//i.test(trimmed) || /^\/dataset\//i.test(trimmed)) {
    return new URL(trimmed, "https://data.bus-data.dft.gov.uk").toString();
  }
  return null;
}

function addBodsDatasetIdDownloadUrls(record, addUrl) {
  const rawId = record?.id ?? record?.dataset_id ?? record?.datasetID ?? record?.datasetId;
  const id = String(rawId ?? "").trim();
  if (!/^\d+$/.test(id)) {
    return;
  }
  addUrl(`https://data.bus-data.dft.gov.uk/api/v1/dataset/${id}/download/`, true);
  addUrl(`https://data.bus-data.dft.gov.uk/api/v1/dataset/${id}/`, false);
}

async function buildLocalBodsTimetableModel(datasetUrls, options = {}) {
  const localDatasetMaxDistanceMetres = getBodsLocalDatasetMaxDistanceMetres(options.maximumWalkToBusStopMetres);
  const combined = createEmptyBodsTimetableModelDiagnostics();
  combined.localDatasetMaxDistanceMetres = localDatasetMaxDistanceMetres;

  for (let index = 0; index < datasetUrls.length; index += 1) {
    if (options.signal?.aborted) {
      throw createServiceError(BODS_TIMETABLE_SERVICE_NAME, "cancelled", "BODS timetable parsing was cancelled.");
    }
    const datasetUrl = datasetUrls[index];
    const model = await buildBodsTimetableModel([datasetUrl], options);
    const nearestStopDistanceMetres = getNearestBodsStopDistanceMetres(model.stops, options.originCoordinates);
    const localStopDistribution = buildBodsRealLocalStopDistribution(model.stops, options.originCoordinates);
    const nearestRealStopDistanceMetres = localStopDistribution.nearestRealStopDistanceMetres;
    const realLocalStopCount = localStopDistribution.within10km;
    model.nearestRealStopDistanceMetres = nearestRealStopDistanceMetres;
    model.realLocalStopCount = realLocalStopCount;
    model.localStopDistribution = localStopDistribution;
    mergeBodsTimetableDiagnostics(combined, model);

    const acceptedByStrictLocalGate = isBodsTimetableModelLocalToOrigin(model, options.originCoordinates, options.maximumWalkToBusStopMetres);
    const acceptedByTrustedAdminArea = !acceptedByStrictLocalGate
      && shouldAcceptBodsTimetableModelFromTrustedAdminArea(model, options.originCoordinates, options.maximumWalkToBusStopMetres, options);

    if (!acceptedByStrictLocalGate && !acceptedByTrustedAdminArea) {
      if (Number.isFinite(nearestStopDistanceMetres)) {
        combined.rejectedNonLocalDatasetCount += 1;
        combined.nearestRejectedStopDistanceMetres = Math.min(combined.nearestRejectedStopDistanceMetres ?? Infinity, nearestStopDistanceMetres);
        if (combined.nonLocalDatasetSamples.length < 8) {
          combined.nonLocalDatasetSamples.push({
            datasetUrl,
            nearestStopDistanceMetres: Math.round(nearestStopDistanceMetres),
            nearestRealStopDistanceMetres: Number.isFinite(nearestRealStopDistanceMetres) ? Math.round(nearestRealStopDistanceMetres) : null,
            realLocalStopCount,
            localStopDistribution,
            originMatchedStopCount: model.originMatchedStopCount || 0,
            localProofStopCount: getBodsLocalProofStopIds(model, options.originCoordinates, options.maximumWalkToBusStopMetres).size,
            localProofConnectionCount: countBodsConnectionsTouchingStops(model, getBodsLocalProofStopIds(model, options.originCoordinates, options.maximumWalkToBusStopMetres)),
            trustedLocalAdminAreaQuery: options.trustedLocalAdminAreaQuery === true,
            trustedAdminAreaRejectedWrongAreaSamples: model.trustedAdminAreaRejectedWrongAreaSamples || [],
            connectionCount: model.connections.length,
            stopCount: model.stops.length,
            parsedXmlFileCount: model.parsedXmlFileCount,
          });
        }
        const localProofStopIds = getBodsLocalProofStopIds(model, options.originCoordinates, options.maximumWalkToBusStopMetres);
        const localProofConnectionCount = countBodsConnectionsTouchingStops(model, localProofStopIds);
        const trustedRejectedReason = model.trustedAdminAreaRejectedWrongAreaSamples?.length
          ? `; rejected trusted adminArea candidate because wrong-area samples were present: ${model.trustedAdminAreaRejectedWrongAreaSamples.slice(0, 3).join(", ")}`
          : "";
        combined.warnings.push(`Rejected non-local BODS dataset ${index + 1}: nearest parsed stop was ${Math.round(nearestStopDistanceMetres).toLocaleString("en-GB")} m from the selected origin; ${realLocalStopCount} real stop${realLocalStopCount === 1 ? "" : "s"} were within 10 km and ${localStopDistribution.within15km} within 15 km; ${localProofStopIds.size} local proof stop${localProofStopIds.size === 1 ? "" : "s"} touched ${localProofConnectionCount} scheduled connection${localProofConnectionCount === 1 ? "" : "s"}${trustedRejectedReason}.`);
      }
      continue;
    }

    if (acceptedByTrustedAdminArea) {
      model.warnings = model.warnings || [];
      model.warnings.push(`Accepted BODS dataset ${index + 1} through trusted numeric adminArea merge before combined reachability validation.`);
    }

    combined.localDatasetCount += 1;
    combined.nearestStopDistanceMetres = Math.min(combined.nearestStopDistanceMetres ?? Infinity, nearestStopDistanceMetres);
    mergeBodsTimetableModel(combined, model);
    if (combined.parsedXmlFileCount >= BODS_MAX_XML_FILES || combined.connections.length >= BODS_MAX_CONNECTIONS || combined.stopsById.size >= BODS_MAX_STOPS) {
      combined.warnings.push("BODS preview caps were reached; timetable search uses a partial local extract.");
      break;
    }
  }

  combined.stops = Array.from(combined.stopsById.values());
  combined.connections = combined.connections
    .filter((connection) => combined.stopsById.has(connection.fromStopId) && combined.stopsById.has(connection.toStopId))
    .sort((a, b) => a.departureMinutes - b.departureMinutes)
    .slice(0, BODS_MAX_CONNECTIONS);
  if (!Number.isFinite(combined.nearestRejectedStopDistanceMetres)) {
    combined.nearestRejectedStopDistanceMetres = null;
  }
  if (!Number.isFinite(combined.nearestStopDistanceMetres)) {
    combined.nearestStopDistanceMetres = null;
  }
  return combined;
}

function createEmptyBodsTimetableModelDiagnostics() {
  return {
    stops: [],
    stopsById: new Map(),
    connections: [],
    downloadedFileCount: 0,
    parsedXmlFileCount: 0,
    parseFailureCount: 0,
    stopReferenceCount: 0,
    directCoordinateStopCount: 0,
    routeLinkCoordinateStopCount: 0,
    parsedRuntimeConnectionCount: 0,
    estimatedRuntimeConnectionCount: 0,
    rejectedImplausibleConnectionCount: 0,
    originMatchedStopCount: 0,
    impliedSpeedStats: { count: 0, min: null, median: null, max: null },
    impliedSpeedKphValues: [],
    enrichedCoordinateStopCount: 0,
    unresolvedCoordinateStopCount: 0,
    sampleMissingStopIds: [],
    stopStructureSamples: [],
    warnings: [],
    localDatasetCount: 0,
    rejectedNonLocalDatasetCount: 0,
    localDatasetMaxDistanceMetres: BODS_LOCAL_DATASET_MAX_DISTANCE_METRES,
    nearestStopDistanceMetres: Infinity,
    nearestRealStopDistanceMetres: Infinity,
    nearestRejectedStopDistanceMetres: Infinity,
    realLocalStopCount: 0,
    localStopDistribution: null,
    nonLocalDatasetSamples: [],
  };
}

function mergeBodsTimetableDiagnostics(target, model) {
  target.downloadedFileCount += Number(model.downloadedFileCount) || 0;
  target.parsedXmlFileCount += Number(model.parsedXmlFileCount) || 0;
  target.parseFailureCount += Number(model.parseFailureCount) || 0;
  target.stopReferenceCount += Number(model.stopReferenceCount) || 0;
  target.directCoordinateStopCount += Number(model.directCoordinateStopCount) || 0;
  target.routeLinkCoordinateStopCount += Number(model.routeLinkCoordinateStopCount) || 0;
  target.parsedRuntimeConnectionCount += Number(model.parsedRuntimeConnectionCount) || 0;
  target.estimatedRuntimeConnectionCount += Number(model.estimatedRuntimeConnectionCount) || 0;
  target.rejectedImplausibleConnectionCount += Number(model.rejectedImplausibleConnectionCount) || 0;
  target.originMatchedStopCount += Number(model.originMatchedStopCount) || 0;
  model.impliedSpeedKphValues?.forEach((speed) => {
    if (target.impliedSpeedKphValues.length < BODS_MAX_CONNECTIONS && Number.isFinite(speed)) {
      target.impliedSpeedKphValues.push(speed);
    }
  });
  target.impliedSpeedStats = summariseBodsImpliedSpeeds(target.impliedSpeedKphValues);
  target.enrichedCoordinateStopCount += Number(model.enrichedCoordinateStopCount) || 0;
  target.unresolvedCoordinateStopCount += Number(model.unresolvedCoordinateStopCount) || 0;
  model.sampleMissingStopIds?.forEach((id) => {
    if (target.sampleMissingStopIds.length < 12 && !target.sampleMissingStopIds.includes(id)) {
      target.sampleMissingStopIds.push(id);
    }
  });
  model.stopStructureSamples?.forEach((sample) => {
    if (target.stopStructureSamples.length < 12) {
      target.stopStructureSamples.push(sample);
    }
  });
  if (Number.isFinite(Number(model.nearestRealStopDistanceMetres))) {
    target.nearestRealStopDistanceMetres = Math.min(target.nearestRealStopDistanceMetres ?? Infinity, Number(model.nearestRealStopDistanceMetres));
  }
  target.realLocalStopCount += Number(model.realLocalStopCount) || 0;
  if (model.localStopDistribution) {
    target.localStopDistribution = mergeBodsLocalStopDistributions(target.localStopDistribution, model.localStopDistribution);
  }
  target.warnings.push(...(model.warnings || []));
}

function mergeBodsTimetableModel(target, model) {
  model.stops.forEach((stop) => {
    if (!target.stopsById.has(stop.id)) {
      target.stopsById.set(stop.id, stop);
    }
  });
  target.connections.push(...(model.connections || []));
}

function getBodsLocalDatasetMaxDistanceMetres(maximumWalkToBusStopMetres) {
  const selectedWalkDistance = Number(maximumWalkToBusStopMetres);
  const walkBasedTolerance = Number.isFinite(selectedWalkDistance)
    ? selectedWalkDistance + 300
    : BUS_MAX_WALK_TO_STOP_DEFAULT_METRES + 300;
  return Math.max(BODS_LOCAL_DATASET_MAX_DISTANCE_METRES, walkBasedTolerance);
}

function getNearestBodsStopDistanceMetres(stops, originCoordinates) {
  if (!originCoordinates || !Array.isArray(stops) || stops.length === 0) {
    return null;
  }
  let nearest = Infinity;
  stops.forEach((stop) => {
    const distance = getDistanceMetres(originCoordinates.latitude, originCoordinates.longitude, stop.latitude, stop.longitude);
    if (Number.isFinite(distance)) {
      nearest = Math.min(nearest, distance);
    }
  });
  return Number.isFinite(nearest) ? nearest : null;
}

function getBodsLocalProofStopIds(timetable = {}, originCoordinates, maximumWalkToBusStopMetres) {
  const ids = new Set();
  const stops = Array.isArray(timetable.stops) ? timetable.stops : [];
  const localDatasetMaxDistanceMetres = getBodsLocalDatasetMaxDistanceMetres(maximumWalkToBusStopMetres);
  stops.forEach((stop) => {
    if (!stop?.id) {
      return;
    }
    if (isBodsExactOriginCodeMatchedStop(stop)) {
      ids.add(stop.id);
      return;
    }
    if (isBodsSyntheticOriginMatchedStop(stop)) {
      return;
    }
    const distance = originCoordinates
      ? getDistanceMetres(originCoordinates.latitude, originCoordinates.longitude, stop.latitude, stop.longitude)
      : null;
    if (Number.isFinite(distance) && distance <= localDatasetMaxDistanceMetres) {
      ids.add(stop.id);
    }
  });
  return ids;
}

function countBodsConnectionsTouchingStops(timetable = {}, stopIds = new Set()) {
  if (!stopIds || stopIds.size === 0 || !Array.isArray(timetable.connections)) {
    return 0;
  }
  let count = 0;
  timetable.connections.forEach((connection) => {
    if (stopIds.has(connection.fromStopId) || stopIds.has(connection.toStopId)) {
      count += 1;
    }
  });
  return count;
}

function getBodsWrongAreaStopNameSamples(stops = []) {
  return (Array.isArray(stops) ? stops : [])
    .map((stop) => stop?.name || stop?.id || "")
    .filter((name) => BODS_WRONG_AREA_STOP_NAME_PATTERNS.test(String(name || "")))
    .slice(0, 12);
}

function shouldAcceptBodsTimetableModelFromTrustedAdminArea(timetable = {}, originCoordinates, maximumWalkToBusStopMetres, options = {}) {
  if (options.trustedLocalAdminAreaQuery !== true) {
    return false;
  }
  const connectionCount = getBodsTimetableConnectionCount(timetable);
  const stopCount = getBodsTimetableStopCount(timetable);
  if (connectionCount <= 0 || stopCount <= 1) {
    return false;
  }
  const wrongAreaSamples = getBodsWrongAreaStopNameSamples(timetable.stops || []);
  if (wrongAreaSamples.length > 0) {
    timetable.trustedAdminAreaRejectedWrongAreaSamples = wrongAreaSamples;
    return false;
  }

  // v79 correction: BODS adminArea queries return many route-level files. A single route file may not
  // contain a large local stop distribution or a local proof stop used by a link, but it is still part of
  // the local administrative-area timetable graph and must be merged before reachability can be tested.
  // The wrong-area protection is therefore applied through the trusted numeric adminArea query and remote
  // stop-name checks, then the combined graph/reality gate decides whether the final output is acceptable.
  const distribution = timetable.localStopDistribution || buildBodsRealLocalStopDistribution(timetable.stops || [], originCoordinates);
  if (Number(distribution.within25km || 0) > 0) {
    return true;
  }
  const nearestStopDistanceMetres = getNearestBodsStopDistanceMetres(timetable.stops || [], originCoordinates);
  const broadTrustedAreaTolerance = Math.max(25000, getBodsLocalDatasetMaxDistanceMetres(maximumWalkToBusStopMetres) * 4);
  if (Number.isFinite(nearestStopDistanceMetres) && nearestStopDistanceMetres <= broadTrustedAreaTolerance) {
    return true;
  }
  return countBodsExactOriginCodeMatchedStops(timetable.stops || []) > 0;
}

function isBodsTimetableModelLocalToOrigin(timetable, originCoordinates, maximumWalkToBusStopMetres) {
  const distribution = timetable?.localStopDistribution || buildBodsRealLocalStopDistribution(timetable?.stops || [], originCoordinates);
  const localDatasetMaxDistanceMetres = getBodsLocalDatasetMaxDistanceMetres(maximumWalkToBusStopMetres);
  const nearestRealStopDistanceMetres = Number(distribution.nearestRealStopDistanceMetres);
  const hasRealStopInsideStrictLocalTolerance = Number.isFinite(nearestRealStopDistanceMetres)
    && nearestRealStopDistanceMetres <= localDatasetMaxDistanceMetres;
  const hasCredibleRealLocalDistribution = hasRealStopInsideStrictLocalTolerance && isBodsCredibleLocalStopDistribution(distribution);

  if (hasCredibleRealLocalDistribution) {
    return true;
  }

  // v78 correction: validate route-level datasets, not only large area-wide bundles.
  // A valid local bus route file may contain only a small number of stops within 10-15 km,
  // so the previous distribution-only gate rejected real Leeds route datasets even when the
  // nearest parsed/matched local stop was 0 m away. Keep the wrong-area protection by requiring
  // the local proof stop to be part of at least one scheduled connection in this dataset.
  const connectionCount = getBodsTimetableConnectionCount(timetable);
  const stopCount = getBodsTimetableStopCount(timetable);
  if (connectionCount <= 0 || stopCount <= 1) {
    return false;
  }

  const localProofStopIds = getBodsLocalProofStopIds(timetable, originCoordinates, maximumWalkToBusStopMetres);
  const connectionsTouchingLocalProofStops = countBodsConnectionsTouchingStops(timetable, localProofStopIds);
  if (localProofStopIds.size > 0 && connectionsTouchingLocalProofStops > 0) {
    return true;
  }

  return false;
}


async function buildBodsTimetableModel(datasetUrls, options = {}) {
  const stopsById = new Map();
  const missingStopsById = new Map();
  const connections = [];
  const warnings = [];
  const stopStructureSamples = [];
  let parsedXmlFileCount = 0;
  let parseFailureCount = 0;
  let downloadedFileCount = 0;
  let stopReferenceCount = 0;
  let directCoordinateStopCount = 0;
  let routeLinkCoordinateStopCount = 0;
  let parsedRuntimeConnectionCount = 0;
  let estimatedRuntimeConnectionCount = 0;
  let rejectedImplausibleConnectionCount = 0;
  let originMatchedStopCount = 0;
  const impliedSpeedKphValues = [];
  for (let index = 0; index < datasetUrls.length; index += 1) {
    if (options.signal?.aborted) {
      throw createServiceError(BODS_TIMETABLE_SERVICE_NAME, "cancelled", "BODS timetable parsing was cancelled.");
    }
    setStatus("Parsing BODS timetables", `Parsing dataset ${index + 1} of ${datasetUrls.length}.`, "running");
    render();
    await yieldToBrowser();
    try {
      const files = await fetchBodsDatasetTextFiles(datasetUrls[index], options);
      downloadedFileCount += files.length;
      if (files.length === 0) {
        warnings.push(`Dataset ${index + 1} did not contain any downloadable XML/TransXChange files.`);
      }
      const gtfsFiles = files.filter((file) => isGtfsStaticTextFile(file.name));
      if (isGtfsStaticBundle(gtfsFiles)) {
        try {
          const model = injectNearbyOriginStopMatchesIntoTxcModel(parseGtfsStaticTimetable(gtfsFiles, datasetUrls[index], options), "", options.nearbyOriginStops || []);
          model.stops.forEach((stop) => {
            if (!stopsById.has(stop.id)) {
              stopsById.set(stop.id, stop);
            }
          });
          model.missingCoordinateStops?.forEach((stop) => {
            if (!stopsById.has(stop.id) && !missingStopsById.has(stop.id)) {
              missingStopsById.set(stop.id, stop);
            }
          });
          model.stopStructureSamples?.forEach((sample) => {
            if (stopStructureSamples.length < 12) {
              stopStructureSamples.push({ file: datasetUrls[index], ...sample });
            }
          });
          stopReferenceCount += Number(model.stopReferenceCount) || 0;
          directCoordinateStopCount += Number(model.directCoordinateStopCount) || 0;
          routeLinkCoordinateStopCount += Number(model.routeLinkCoordinateStopCount) || 0;
          parsedRuntimeConnectionCount += Number(model.parsedRuntimeConnectionCount) || 0;
          estimatedRuntimeConnectionCount += Number(model.estimatedRuntimeConnectionCount) || 0;
          rejectedImplausibleConnectionCount += Number(model.rejectedImplausibleConnectionCount) || 0;
          originMatchedStopCount += Number(model.originMatchedStopCount) || 0;
          model.impliedSpeedKphValues?.forEach((speed) => {
            if (impliedSpeedKphValues.length < BODS_MAX_CONNECTIONS && Number.isFinite(speed)) {
              impliedSpeedKphValues.push(speed);
            }
          });
          connections.push(...model.connections);
          warnings.push(...model.warnings);
          parsedXmlFileCount += 1;
        } catch (error) {
          parseFailureCount += 1;
          warnings.push(`GTFS static timetable in dataset ${index + 1} could not be parsed: ${error?.message || String(error)}`);
        }
      }

      const txcFiles = files.filter((file) => isTransXChangeTextFile(file.name));
      for (const file of txcFiles.slice(0, Math.max(1, BODS_MAX_XML_FILES - parsedXmlFileCount))) {
        try {
          const model = injectNearbyOriginStopMatchesIntoTxcModel(parseTransXChangeTimetable(file.text, file.name), file.text, options.nearbyOriginStops || []);
          model.stops.forEach((stop) => {
            if (!stopsById.has(stop.id)) {
              stopsById.set(stop.id, stop);
            }
          });
          model.missingCoordinateStops?.forEach((stop) => {
            if (!stopsById.has(stop.id) && !missingStopsById.has(stop.id)) {
              missingStopsById.set(stop.id, stop);
            }
          });
          model.stopStructureSamples?.forEach((sample) => {
            if (stopStructureSamples.length < 12) {
              stopStructureSamples.push({ file: file.name, ...sample });
            }
          });
          stopReferenceCount += Number(model.stopReferenceCount) || 0;
          directCoordinateStopCount += Number(model.directCoordinateStopCount) || 0;
          routeLinkCoordinateStopCount += Number(model.routeLinkCoordinateStopCount) || 0;
          parsedRuntimeConnectionCount += Number(model.parsedRuntimeConnectionCount) || 0;
          estimatedRuntimeConnectionCount += Number(model.estimatedRuntimeConnectionCount) || 0;
          rejectedImplausibleConnectionCount += Number(model.rejectedImplausibleConnectionCount) || 0;
          originMatchedStopCount += Number(model.originMatchedStopCount) || 0;
          model.impliedSpeedKphValues?.forEach((speed) => {
            if (impliedSpeedKphValues.length < BODS_MAX_CONNECTIONS && Number.isFinite(speed)) {
              impliedSpeedKphValues.push(speed);
            }
          });
          connections.push(...model.connections);
          warnings.push(...model.warnings);
          parsedXmlFileCount += 1;
        } catch (error) {
          parseFailureCount += 1;
          warnings.push(`${file.name || `Dataset ${index + 1} file`} could not be parsed: ${error?.message || String(error)}`);
        }
        if (parsedXmlFileCount >= BODS_MAX_XML_FILES || connections.length >= BODS_MAX_CONNECTIONS || stopsById.size >= BODS_MAX_STOPS) {
          warnings.push("BODS preview caps were reached; timetable search uses a partial local extract.");
          break;
        }
      }
    } catch (error) {
      parseFailureCount += 1;
      warnings.push(`Dataset ${index + 1} could not be parsed: ${error?.message || String(error)}`);
    }
    if (parsedXmlFileCount >= BODS_MAX_XML_FILES || connections.length >= BODS_MAX_CONNECTIONS || stopsById.size >= BODS_MAX_STOPS) {
      break;
    }
  }
  const enrichmentResult = await enrichBodsMissingStopCoordinates(missingStopsById, stopsById, options);
  enrichmentResult.resolvedStops.forEach((stop) => {
    if (!stopsById.has(stop.id)) {
      stopsById.set(stop.id, stop);
    }
  });
  warnings.push(...enrichmentResult.warnings);

  const graphNormalisationResult = normaliseBodsTimetableGraphAfterStopEnrichment(
    connections,
    stopsById,
    missingStopsById,
    options
  );
  warnings.push(...graphNormalisationResult.warnings);
  const usableConnections = graphNormalisationResult.connections
    .filter((connection) => Number.isFinite(connection.departureMinutes) && Number.isFinite(connection.arrivalMinutes))
    .sort((a, b) => a.departureMinutes - b.departureMinutes)
    .slice(0, BODS_MAX_CONNECTIONS);
  if (stopStructureSamples.length > 0) {
    console.debug("[BODS diagnostics] stop XML structure samples", stopStructureSamples);
  }
  if (isBusTimingLogEnabled()) {
    console.debug("[BODS diagnostics] canonical graph audit", graphNormalisationResult.audit);
  }
  return {
    stops: Array.from(graphNormalisationResult.stopsById.values()),
    stopsById: graphNormalisationResult.stopsById,
    connections: usableConnections,
    downloadedFileCount,
    parsedXmlFileCount,
    parseFailureCount,
    stopReferenceCount,
    directCoordinateStopCount,
    routeLinkCoordinateStopCount,
    parsedRuntimeConnectionCount,
    estimatedRuntimeConnectionCount,
    rejectedImplausibleConnectionCount,
    originMatchedStopCount,
    impliedSpeedStats: summariseBodsImpliedSpeeds(impliedSpeedKphValues),
    impliedSpeedKphValues,
    enrichedCoordinateStopCount: enrichmentResult.resolvedStops.length + graphNormalisationResult.synthesisedStopCount,
    unresolvedCoordinateStopCount: graphNormalisationResult.unresolvedStopIds.length,
    sampleMissingStopIds: graphNormalisationResult.unresolvedStopIds.slice(0, 12),
    stopStructureSamples,
    warnings,
  };
}


function normaliseBodsTimetableGraphAfterStopEnrichment(connections, stopsById, missingStopsById, options = {}) {
  const canonicalStopsById = new Map(stopsById);
  const warnings = [];
  const unresolvedIds = new Set();
  let rewrittenConnectionCount = 0;
  let synthesisedStopCount = 0;
  let droppedConnectionCount = 0;

  const rebuildIndexes = () => {
    const idByNormalised = new Map();
    const idsByName = new Map();
    canonicalStopsById.forEach((stop, id) => {
      const normalisedId = normaliseBodsStopIdentifier(id);
      if (normalisedId && !idByNormalised.has(normalisedId)) {
        idByNormalised.set(normalisedId, id);
      }
      [stop?.id, stop?.atcoCode, stop?.naptanCode, stop?.ref].filter(Boolean).forEach((candidate) => {
        const normalisedCandidate = normaliseBodsStopIdentifier(candidate);
        if (normalisedCandidate && !idByNormalised.has(normalisedCandidate)) {
          idByNormalised.set(normalisedCandidate, id);
        }
      });
      const normalisedName = normaliseBodsStopName(stop?.name);
      if (normalisedName) {
        if (!idsByName.has(normalisedName)) {
          idsByName.set(normalisedName, []);
        }
        idsByName.get(normalisedName).push(id);
      }
    });
    return { idByNormalised, idsByName };
  };

  let indexes = rebuildIndexes();

  const addSyntheticStop = (id, name, coordinate, source) => {
    if (!id || !coordinate || !Number.isFinite(coordinate.latitude) || !Number.isFinite(coordinate.longitude)) {
      return null;
    }
    const existingId = canonicalStopsById.has(id) ? id : indexes.idByNormalised.get(normaliseBodsStopIdentifier(id));
    if (existingId) {
      return existingId;
    }
    const stop = {
      id,
      name: name || id,
      latitude: coordinate.latitude,
      longitude: coordinate.longitude,
      coordinateSource: source,
    };
    if (!isPlausibleUkWgs84Coordinate(stop.latitude, stop.longitude)) {
      return null;
    }
    canonicalStopsById.set(id, stop);
    synthesisedStopCount += 1;
    indexes = rebuildIndexes();
    return id;
  };

  const resolveByNearbyPhysicalStop = (rawId, missingStop) => {
    const normalisedRawId = normaliseBodsStopIdentifier(rawId);
    const nearbyByCode = (options.nearbyOriginStops || []).find((nearbyStop) =>
      getNearbyOriginStopCodeCandidates(nearbyStop).includes(normalisedRawId)
    );
    if (nearbyByCode) {
      return addSyntheticStop(rawId, missingStop?.name || nearbyByCode.name || rawId, nearbyByCode, "nearby_origin_stop_graph_exact_atco_naptan_match");
    }
    // Do not resolve by stop name here. Common names such as "Civic Offices" or "Station"
    // can make remote timetable files look local. Exact ATCO/NaPTAN code matching only.
    return null;
  };

  const resolveStopId = (rawId, connection, endName) => {
    if (!rawId) {
      return null;
    }
    if (canonicalStopsById.has(rawId)) {
      return rawId;
    }
    const normalisedId = normaliseBodsStopIdentifier(rawId);
    const idMatch = indexes.idByNormalised.get(normalisedId);
    if (idMatch) {
      return idMatch;
    }

    const missingStop = missingStopsById.get(rawId)
      || missingStopsById.get(normalisedId)
      || Array.from(missingStopsById.values()).find((stop) => normaliseBodsStopIdentifier(stop.id) === normalisedId);

    if (missingStop) {
      const exactNameIds = indexes.idsByName.get(normaliseBodsStopName(missingStop.name)) || [];
      if (exactNameIds.length === 1) {
        return exactNameIds[0];
      }
      const fuzzyNameId = Array.from(canonicalStopsById.values()).find((stop) => doBodsStopNamesMatch(stop.name, missingStop.name))?.id;
      if (fuzzyNameId) {
        return fuzzyNameId;
      }
      const nearbyResolvedId = resolveByNearbyPhysicalStop(rawId, missingStop);
      if (nearbyResolvedId) {
        return nearbyResolvedId;
      }
    }

    const geometry = Array.isArray(connection?.geometry) ? connection.geometry : [];
    const coordinate = endName === "from" ? geometry[0] : geometry[geometry.length - 1];
    if (coordinate && Number.isFinite(coordinate.latitude) && Number.isFinite(coordinate.longitude)) {
      return addSyntheticStop(rawId, missingStop?.name || rawId, coordinate, "route_link_endpoint_graph_synthesis");
    }

    unresolvedIds.add(rawId);
    return null;
  };

  const canonicalConnections = [];
  connections.forEach((connection) => {
    const fromStopId = resolveStopId(connection.fromStopId, connection, "from");
    const toStopId = resolveStopId(connection.toStopId, connection, "to");
    if (!fromStopId || !toStopId) {
      droppedConnectionCount += 1;
      return;
    }
    if (fromStopId !== connection.fromStopId || toStopId !== connection.toStopId) {
      rewrittenConnectionCount += 1;
    }
    canonicalConnections.push({ ...connection, fromStopId, toStopId });
  });

  const unresolvedStopIds = Array.from(unresolvedIds);
  if (droppedConnectionCount > 0) {
    warnings.push(`${droppedConnectionCount.toLocaleString("en-GB")} BODS timetable connection${droppedConnectionCount === 1 ? "" : "s"} could not be used because one or both StopPointRefs still had no coordinates after canonical matching.`);
  }

  return {
    stopsById: canonicalStopsById,
    connections: canonicalConnections,
    unresolvedStopIds,
    synthesisedStopCount,
    warnings,
    audit: {
      rawConnectionCount: connections.length,
      canonicalConnectionCount: canonicalConnections.length,
      rewrittenConnectionCount,
      droppedConnectionCount,
      synthesisedStopCount,
      stopCount: canonicalStopsById.size,
      unresolvedStopIdSamples: unresolvedStopIds.slice(0, 20),
    },
  };
}


function isTransXChangeTextFile(fileName) {
  return /\.xml$|\.txc$/i.test(String(fileName || ""));
}

function getGtfsStaticBaseName(fileName) {
  return String(fileName || "").split(/[\\/]/).pop().toLowerCase();
}

function isGtfsStaticTextFile(fileName) {
  return new Set([
    "agency.txt",
    "calendar.txt",
    "calendar_dates.txt",
    "routes.txt",
    "shapes.txt",
    "stop_times.txt",
    "stops.txt",
    "trips.txt",
  ]).has(getGtfsStaticBaseName(fileName));
}

function isGtfsStaticBundle(files = []) {
  const names = new Set((files || []).map((file) => getGtfsStaticBaseName(file.name)));
  return names.has("stops.txt") && names.has("stop_times.txt") && names.has("trips.txt") && names.has("routes.txt");
}

function parseGtfsStaticTimetable(files, datasetName = "GTFS static", options = {}) {
  const fileByName = new Map((files || []).map((file) => [getGtfsStaticBaseName(file.name), file.text || ""]));
  const stops = parseGtfsCsvRecords(fileByName.get("stops.txt") || "");
  const stopTimes = parseGtfsCsvRecords(fileByName.get("stop_times.txt") || "");
  const trips = parseGtfsCsvRecords(fileByName.get("trips.txt") || "");
  const routes = parseGtfsCsvRecords(fileByName.get("routes.txt") || "");
  const calendar = parseGtfsCsvRecords(fileByName.get("calendar.txt") || "");
  const calendarDates = parseGtfsCsvRecords(fileByName.get("calendar_dates.txt") || "");

  const stopsById = new Map();
  stops.forEach((record) => {
    const id = record.stop_id || record.stop_code || record.atco_code || "";
    const latitude = parseFiniteCoordinateText(record.stop_lat || record.latitude || record.Latitude);
    const longitude = parseFiniteCoordinateText(record.stop_lon || record.stop_lng || record.longitude || record.Longitude);
    if (!id || !isPlausibleUkWgs84Coordinate(latitude, longitude)) {
      return;
    }
    stopsById.set(id, {
      id,
      name: record.stop_name || record.common_name || id,
      latitude,
      longitude,
      atcoCode: record.stop_code || record.atco_code || id,
      naptanCode: record.naptan_code || "",
      coordinateSource: "gtfs_static_stops",
    });
  });

  const routeById = new Map(routes.map((route) => [route.route_id, route]));
  const activeServiceIds = buildGtfsActiveServiceIdSet(calendar, calendarDates, options.departureDate);
  const tripById = new Map();
  trips.forEach((trip) => {
    if (activeServiceIds && trip.service_id && !activeServiceIds.has(trip.service_id)) {
      return;
    }
    tripById.set(trip.trip_id, trip);
  });

  const stopTimesByTripId = new Map();
  stopTimes.forEach((record) => {
    if (!record.trip_id || !tripById.has(record.trip_id)) {
      return;
    }
    if (!stopsById.has(record.stop_id)) {
      return;
    }
    if (!stopTimesByTripId.has(record.trip_id)) {
      stopTimesByTripId.set(record.trip_id, []);
    }
    stopTimesByTripId.get(record.trip_id).push(record);
  });

  const connections = [];
  const warnings = [];
  const impliedSpeedKphValues = [];
  let rejectedImplausibleConnectionCount = 0;
  let parsedRuntimeConnectionCount = 0;

  stopTimesByTripId.forEach((records, tripId) => {
    records.sort((a, b) => Number(a.stop_sequence || 0) - Number(b.stop_sequence || 0));
    const trip = tripById.get(tripId) || {};
    const route = routeById.get(trip.route_id) || {};
    const routeRef = route.route_short_name || route.route_long_name || trip.route_id || "Bus";
    const routeName = route.route_long_name || route.route_short_name || trip.route_id || "BODS GTFS bus service";
    for (let index = 1; index < records.length; index += 1) {
      const fromRecord = records[index - 1];
      const toRecord = records[index];
      const departureMinutes = parseGtfsClockTimeToMinutes(fromRecord.departure_time || fromRecord.arrival_time);
      let arrivalMinutes = parseGtfsClockTimeToMinutes(toRecord.arrival_time || toRecord.departure_time);
      if (!Number.isFinite(departureMinutes) || !Number.isFinite(arrivalMinutes)) {
        continue;
      }
      if (arrivalMinutes < departureMinutes) {
        arrivalMinutes += 1440;
      }
      const runtime = arrivalMinutes - departureMinutes;
      if (!Number.isFinite(runtime) || runtime <= 0) {
        continue;
      }
      const fromStop = stopsById.get(fromRecord.stop_id);
      const toStop = stopsById.get(toRecord.stop_id);
      const distanceMetres = getDistanceMetres(fromStop.latitude, fromStop.longitude, toStop.latitude, toStop.longitude);
      const impliedSpeedKph = Number.isFinite(distanceMetres) && runtime > 0 ? (distanceMetres / 1000) / (runtime / 60) : null;
      if (Number.isFinite(impliedSpeedKph) && impliedSpeedKph > BODS_MAX_IMPLAUSIBLE_SPEED_KPH * 1.5) {
        rejectedImplausibleConnectionCount += 1;
        continue;
      }
      if (Number.isFinite(impliedSpeedKph)) {
        impliedSpeedKphValues.push(impliedSpeedKph);
      }
      parsedRuntimeConnectionCount += 1;
      connections.push({
        fromStopId: fromRecord.stop_id,
        toStopId: toRecord.stop_id,
        departureMinutes,
        arrivalMinutes,
        routeId: trip.route_id || routeRef,
        routeRef,
        routeName,
        tripId,
        linkIndex: index - 1,
        estimatedRuntime: false,
        impliedSpeedKph,
        geometry: null,
        geometrySource: "gtfs_stop_to_stop",
      });
    }
  });

  if (connections.length === 0) {
    warnings.push(`${datasetName}: GTFS static files were found but no usable stop-to-stop scheduled links could be parsed.`);
  }

  return {
    stops: Array.from(stopsById.values()),
    missingCoordinateStops: [],
    stopReferenceCount: stops.length,
    directCoordinateStopCount: stopsById.size,
    routeLinkCoordinateStopCount: 0,
    parsedRuntimeConnectionCount,
    estimatedRuntimeConnectionCount: 0,
    rejectedImplausibleConnectionCount,
    originMatchedStopCount: countNearbyOriginMatchesInStops(stopsById, options.nearbyOriginStops || []),
    impliedSpeedStats: summariseBodsImpliedSpeeds(impliedSpeedKphValues),
    impliedSpeedKphValues,
    stopStructureSamples: [{ nodeType: "GTFS static", id: datasetName, hasCoordinate: stopsById.size > 0, childNames: Array.from(fileByName.keys()).slice(0, 12) }],
    connections,
    warnings,
  };
}

function parseGtfsCsvRecords(text) {
  const rows = parseDelimitedTextRows(text || "");
  if (rows.length === 0) {
    return [];
  }
  const headers = rows[0].map((header) => String(header || "").trim());
  return rows.slice(1)
    .filter((row) => row.some((value) => String(value || "").trim()))
    .map((row) => Object.fromEntries(headers.map((header, index) => [header, row[index] ?? ""])));
}

function parseDelimitedTextRows(text) {
  const rows = [];
  let row = [];
  let field = "";
  let inQuotes = false;
  const value = String(text || "").replace(/^\uFEFF/, "");
  for (let index = 0; index < value.length; index += 1) {
    const char = value[index];
    const next = value[index + 1];
    if (inQuotes) {
      if (char === '"' && next === '"') {
        field += '"';
        index += 1;
      } else if (char === '"') {
        inQuotes = false;
      } else {
        field += char;
      }
      continue;
    }
    if (char === '"') {
      inQuotes = true;
      continue;
    }
    if (char === ',') {
      row.push(field);
      field = "";
      continue;
    }
    if (char === '\n' || char === '\r') {
      if (char === '\r' && next === '\n') {
        index += 1;
      }
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
      continue;
    }
    field += char;
  }
  if (field || row.length > 0) {
    row.push(field);
    rows.push(row);
  }
  return rows;
}

function buildGtfsActiveServiceIdSet(calendar, calendarDates, departureDate) {
  const dateText = String(departureDate || "").replace(/-/g, "");
  if (!/^\d{8}$/.test(dateText)) {
    return null;
  }
  const date = new Date(`${dateText.slice(0, 4)}-${dateText.slice(4, 6)}-${dateText.slice(6, 8)}T12:00:00Z`);
  if (Number.isNaN(date.getTime())) {
    return null;
  }
  const dayNames = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
  const dayName = dayNames[date.getUTCDay()];
  const active = new Set();
  calendar.forEach((record) => {
    if (!record.service_id || record[dayName] !== "1") {
      return;
    }
    const start = String(record.start_date || "");
    const end = String(record.end_date || "");
    if (start && dateText < start) {
      return;
    }
    if (end && dateText > end) {
      return;
    }
    active.add(record.service_id);
  });
  calendarDates.forEach((record) => {
    if (String(record.date || "") !== dateText || !record.service_id) {
      return;
    }
    if (String(record.exception_type) === "1") {
      active.add(record.service_id);
    } else if (String(record.exception_type) === "2") {
      active.delete(record.service_id);
    }
  });
  if (calendar.length === 0 && calendarDates.length === 0) {
    return null;
  }
  return active;
}

function parseGtfsClockTimeToMinutes(value) {
  const match = String(value || "").trim().match(/^(\d{1,3}):(\d{2})(?::(\d{2}))?$/);
  if (!match) {
    return null;
  }
  return Number(match[1]) * 60 + Number(match[2]) + Number(match[3] || 0) / 60;
}

function countNearbyOriginMatchesInStops(stopsById, nearbyStops = []) {
  const nearbyCodes = new Set((nearbyStops || []).flatMap(getNearbyOriginStopCodeCandidates));
  let count = 0;
  stopsById.forEach((stop, id) => {
    const idCandidates = [id, stop.id, stop.atcoCode, stop.naptanCode, stop.ref].map(normaliseBodsStopIdentifier).filter(Boolean);
    if (idCandidates.some((candidate) => nearbyCodes.has(candidate)) || nearbyStops.some((nearbyStop) => doBodsStopNamesMatch(stop.name, nearbyStop.name))) {
      count += 1;
    }
  });
  return count;
}

async function fetchBodsDatasetTextFiles(datasetUrl, options = {}, depth = 0) {
  if (depth > 2) {
    return [];
  }
  const url = new URL(BODS_DOWNLOAD_ENDPOINT, window.location.origin);
  url.searchParams.set("url", datasetUrl);
  const response = await fetch(url.toString(), { signal: options.signal });
  if (!response.ok) {
    throw createServiceError(BODS_TIMETABLE_SERVICE_NAME, "api_outage", `BODS dataset download returned status ${response.status}.`);
  }
  const contentType = response.headers.get("Content-Type") || "";
  const arrayBuffer = await response.arrayBuffer();
  if (contentType.includes("zip") || isZipArrayBuffer(arrayBuffer)) {
    return unzipTextFiles(arrayBuffer, [".xml", ".txc", ".txt", ".csv"]).then((files) => {
      const relevant = files.filter((file) => isTransXChangeTextFile(file.name) || isGtfsStaticTextFile(file.name));
      return relevant.slice(0, Math.max(BODS_MAX_XML_FILES, 240));
    });
  }
  const text = new TextDecoder("utf-8").decode(arrayBuffer);
  if (contentType.includes("json") || /^[\s\r\n]*[\[{]/.test(text)) {
    try {
      const nestedPayload = JSON.parse(text);
      const nestedUrls = extractBodsDatasetDownloadUrls(nestedPayload).filter((candidate) => candidate !== datasetUrl).slice(0, 4);
      const files = [];
      for (const nestedUrl of nestedUrls) {
        files.push(...await fetchBodsDatasetTextFiles(nestedUrl, options, depth + 1));
        if (files.length >= BODS_MAX_XML_FILES) {
          break;
        }
      }
      if (files.length > 0) {
        return files;
      }
    } catch (error) {
      // Fall through and let the caller attempt XML parsing, which will provide a clearer error.
    }
  }
  return [{ name: datasetUrl.split("/").pop() || "bods-timetable.xml", text }];
}

async function enrichBodsMissingStopCoordinates(missingStopsById, existingStopsById, options = {}) {
  const missingStops = Array.from(missingStopsById.values())
    .filter((stop) => stop?.id && !existingStopsById.has(stop.id))
    .slice(0, BODS_STOP_ENRICHMENT_MAX_IDS);
  if (missingStops.length === 0) {
    return { resolvedStops: [], unresolvedStopIds: [], warnings: [] };
  }

  const warnings = [];
  const resolvedById = new Map();
  const unresolved = new Map(missingStops.map((stop) => [stop.id, stop]));

  const addResolvedStop = (id, coordinate, source) => {
    if (!id || !coordinate || resolvedById.has(id)) {
      return;
    }
    const missing = missingStopsById.get(id);
    const stop = {
      id,
      name: missing?.name || id,
      latitude: coordinate.latitude,
      longitude: coordinate.longitude,
      coordinateSource: source,
    };
    if (isPlausibleUkWgs84Coordinate(stop.latitude, stop.longitude)) {
      BODS_STOP_COORDINATE_CACHE.set(id, stop);
      resolvedById.set(id, stop);
      unresolved.delete(id);
    }
  };

  const nearbyLookup = buildNearbyOriginStopLookup(options.nearbyOriginStops || []);
  missingStops.forEach((stop) => {
    const nearbyStop = nearbyLookup.get(normaliseBodsStopIdentifier(stop.id));
    if (nearbyStop) {
      addResolvedStop(stop.id, { latitude: nearbyStop.latitude, longitude: nearbyStop.longitude }, "nearby_origin_stop_code_match");
    }
    const cached = BODS_STOP_COORDINATE_CACHE.get(stop.id);
    if (cached) {
      addResolvedStop(stop.id, cached, cached.coordinateSource || "session_cache");
    }
  });

  if (unresolved.size > 0) {
    try {
      const exactOsmResolved = await fetchBodsStopCoordinatesFromOsmByStopIds(Array.from(unresolved.keys()), options);
      exactOsmResolved.forEach((coordinate, id) => addResolvedStop(id, coordinate, "osm_exact_naptan_tag"));
    } catch (error) {
      if (error?.kind === "cancelled") {
        throw error;
      }
      warnings.push(`Exact OSM/NaPTAN stop enrichment failed: ${error?.message || String(error)}`);
    }
  }

  if (unresolved.size > 0) {
    try {
      const osmResolved = await fetchBodsStopCoordinatesFromOsm(Array.from(unresolved.keys()), options);
      osmResolved.forEach((coordinate, id) => addResolvedStop(id, coordinate, "osm_nearby_naptan_tag"));
    } catch (error) {
      if (error?.kind === "cancelled") {
        throw error;
      }
      warnings.push(`OSM/NaPTAN stop enrichment failed: ${error?.message || String(error)}`);
    }
  }

  if (
    unresolved.size > 0 &&
    options.allowExternalStopEnrichment !== false &&
    BODS_MAX_NAPTAN_API_LOOKUPS > 0
  ) {
    const directIds = Array.from(unresolved.keys()).slice(0, Math.min(BODS_MAX_NAPTAN_API_LOOKUPS, BODS_STOP_ENRICHMENT_MAX_IDS));
    for (const id of directIds) {
      if (options.signal?.aborted) {
        throw createServiceError(BODS_TIMETABLE_SERVICE_NAME, "cancelled", "BODS stop enrichment was cancelled.");
      }
      try {
        const coordinate = await fetchBodsStopCoordinateFromNaptanApi(id, options);
        addResolvedStop(id, coordinate, "naptan_api");
      } catch (error) {
        if (error?.kind === "cancelled") {
          throw error;
        }
      }
    }
  }

  const unresolvedStopIds = Array.from(unresolved.keys());
  if (unresolvedStopIds.length > 0) {
    warnings.push(`${unresolvedStopIds.length.toLocaleString("en-GB")} BODS stop reference${unresolvedStopIds.length === 1 ? "" : "s"} did not include coordinates and could not be resolved from local or external stop metadata.`);
  }
  return { resolvedStops: Array.from(resolvedById.values()), unresolvedStopIds, warnings };
}

function buildBodsStopIdLookup(stopIds) {
  const lookup = new Map();
  stopIds.forEach((id) => {
    const candidates = [id, normaliseBodsStopIdentifier(id)].filter(Boolean);
    candidates.forEach((candidate) => {
      const normalised = normaliseBodsStopIdentifier(candidate);
      if (normalised && !lookup.has(normalised)) {
        lookup.set(normalised, id);
      }
    });
  });
  return lookup;
}

function getBodsStopIdRegexChunks(stopIds, chunkSize = 45) {
  const values = [];
  const seen = new Set();
  stopIds.forEach((id) => {
    [String(id || "").trim(), normaliseBodsStopIdentifier(id)].forEach((candidate) => {
      if (!candidate || candidate.length < 3) {
        return;
      }
      const key = candidate.toLowerCase();
      if (!seen.has(key)) {
        seen.add(key);
        values.push(escapeOverpassRegex(candidate));
      }
    });
  });
  const chunks = [];
  for (let index = 0; index < values.length; index += chunkSize) {
    chunks.push(values.slice(index, index + chunkSize).join("|"));
  }
  return chunks;
}

async function fetchBodsStopCoordinatesFromOsmByStopIds(stopIds, options = {}) {
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
      throw createServiceError(BODS_TIMETABLE_SERVICE_NAME, "cancelled", "BODS stop enrichment was cancelled.");
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
        const latitude = Number.isFinite(Number(element.lat)) ? Number(element.lat) : Number(element.center?.lat);
        const longitude = Number.isFinite(Number(element.lon)) ? Number(element.lon) : Number(element.center?.lon);
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
          const originalId = originalIdByNormalised.get(normaliseBodsStopIdentifier(candidate));
          if (originalId && !resolved.has(originalId)) {
            resolved.set(originalId, { latitude, longitude });
          }
        });
      });
    } catch (error) {
      if (error?.kind === "cancelled") {
        throw error;
      }
      console.warn("[BODS diagnostics] capped OSM stop-id enrichment failed", error?.message || String(error));
    }
  }

  return resolved;
}

async function fetchBodsStopCoordinatesFromOsm(stopIds, options = {}) {
  if (!options.originCoordinates || stopIds.length === 0) {
    return new Map();
  }
  const originalIdByNormalised = new Map();
  stopIds.forEach((id) => {
    const normalised = normaliseBodsStopIdentifier(id);
    if (normalised && !originalIdByNormalised.has(normalised)) {
      originalIdByNormalised.set(normalised, id);
    }
  });
  const query = `
    [out:json][timeout:35];
    (
      node(around:${BODS_STOP_ENRICHMENT_RADIUS_METRES},${options.originCoordinates.latitude},${options.originCoordinates.longitude})["highway"="bus_stop"];
      node(around:${BODS_STOP_ENRICHMENT_RADIUS_METRES},${options.originCoordinates.latitude},${options.originCoordinates.longitude})["public_transport"~"platform|stop_position"];
      way(around:${BODS_STOP_ENRICHMENT_RADIUS_METRES},${options.originCoordinates.latitude},${options.originCoordinates.longitude})["highway"="bus_stop"];
      way(around:${BODS_STOP_ENRICHMENT_RADIUS_METRES},${options.originCoordinates.latitude},${options.originCoordinates.longitude})["public_transport"~"platform|stop_position"];
    );
    out center tags;
  `;
  const payload = await fetchOsmBusRouteOverpassPayload(
    query,
    { signal: options.signal },
    BODS_STOP_ENRICHMENT_OVERPASS_TIMEOUT_MS
  );
  const resolved = new Map();
  (payload.elements || []).forEach((element) => {
    const latitude = Number.isFinite(Number(element.lat)) ? Number(element.lat) : Number(element.center?.lat);
    const longitude = Number.isFinite(Number(element.lon)) ? Number(element.lon) : Number(element.center?.lon);
    if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
      return;
    }
    const tags = element.tags || {};
    const candidates = [
      tags["naptan:AtcoCode"],
      tags["naptan:NaptanCode"],
      tags["ref:GB:naptan"],
      tags.atco_code,
      tags.AtcoCode,
      tags.ref,
      tags.local_ref,
    ].filter(Boolean);
    candidates.forEach((candidate) => {
      const originalId = originalIdByNormalised.get(normaliseBodsStopIdentifier(candidate));
      if (originalId && !resolved.has(originalId)) {
        resolved.set(originalId, { latitude, longitude });
      }
    });
  });
  return resolved;
}

function escapeOverpassRegex(value) {
  return String(value || "").replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

async function fetchBodsStopCoordinateFromNaptanApi(stopId, options = {}) {
  const safeStopId = encodeURIComponent(stopId);
  const urls = [
    `https://naptan.api.dft.gov.uk/v1/access-nodes/${safeStopId}`,
    `https://naptan.api.dft.gov.uk/v1/access-nodes?atcoCode=${safeStopId}`,
  ];
  for (const url of urls) {
    try {
      const payload = await fetchJsonWithDiagnostics(url, { signal: options.signal }, BODS_TIMETABLE_SERVICE_NAME, 12000);
      const coordinate = extractCoordinateFromNaptanPayload(payload);
      if (coordinate) {
        return coordinate;
      }
    } catch (error) {
      if (error?.kind === "cancelled") {
        throw error;
      }
    }
  }
  return null;
}

function extractCoordinateFromNaptanPayload(payload) {
  const records = Array.isArray(payload)
    ? payload
    : Array.isArray(payload?.results)
      ? payload.results
      : Array.isArray(payload?.data)
        ? payload.data
        : payload
          ? [payload]
          : [];
  for (const record of records) {
    const coordinate = extractCoordinateFromPlainObject(record);
    if (coordinate) {
      return coordinate;
    }
  }
  return null;
}

function extractCoordinateFromPlainObject(value) {
  if (!value || typeof value !== "object") {
    return null;
  }
  const latitude = parseFiniteCoordinateText(value.latitude ?? value.Latitude ?? value.lat ?? value.Lat);
  const longitude = parseFiniteCoordinateText(value.longitude ?? value.Longitude ?? value.lon ?? value.lng ?? value.Long);
  if (isPlausibleUkWgs84Coordinate(latitude, longitude)) {
    return { latitude, longitude };
  }
  const easting = parseFiniteCoordinateText(value.easting ?? value.Easting);
  const northing = parseFiniteCoordinateText(value.northing ?? value.Northing);
  const converted = convertBritishNationalGridToWgs84(easting, northing);
  if (converted && isPlausibleUkWgs84Coordinate(converted.latitude, converted.longitude)) {
    return converted;
  }
  for (const child of Object.values(value)) {
    const coordinate = extractCoordinateFromPlainObject(child);
    if (coordinate) {
      return coordinate;
    }
  }
  return null;
}

function isZipArrayBuffer(arrayBuffer) {
  const view = new DataView(arrayBuffer);
  return view.byteLength > 4 && view.getUint32(0, true) === 0x04034b50;
}

async function unzipTextFiles(arrayBuffer, allowedExtensions = [".xml", ".txt"]) {
  const view = new DataView(arrayBuffer);
  const entries = [];
  let eocdOffset = -1;
  for (let offset = view.byteLength - 22; offset >= Math.max(0, view.byteLength - 66000); offset -= 1) {
    if (view.getUint32(offset, true) === 0x06054b50) {
      eocdOffset = offset;
      break;
    }
  }
  if (eocdOffset < 0) {
    throw new Error("ZIP central directory could not be found.");
  }
  const entryCount = view.getUint16(eocdOffset + 10, true);
  let centralOffset = view.getUint32(eocdOffset + 16, true);
  for (let i = 0; i < entryCount; i += 1) {
    if (view.getUint32(centralOffset, true) !== 0x02014b50) {
      break;
    }
    const method = view.getUint16(centralOffset + 10, true);
    const compressedSize = view.getUint32(centralOffset + 20, true);
    const fileNameLength = view.getUint16(centralOffset + 28, true);
    const extraLength = view.getUint16(centralOffset + 30, true);
    const commentLength = view.getUint16(centralOffset + 32, true);
    const localOffset = view.getUint32(centralOffset + 42, true);
    const nameBytes = new Uint8Array(arrayBuffer, centralOffset + 46, fileNameLength);
    const name = new TextDecoder().decode(nameBytes);
    const lowerName = name.toLowerCase();
    if (allowedExtensions.some((extension) => lowerName.endsWith(extension))) {
      const localNameLength = view.getUint16(localOffset + 26, true);
      const localExtraLength = view.getUint16(localOffset + 28, true);
      const dataOffset = localOffset + 30 + localNameLength + localExtraLength;
      const compressedBytes = new Uint8Array(arrayBuffer, dataOffset, compressedSize);
      let text = "";
      if (method === 0) {
        text = new TextDecoder("utf-8").decode(compressedBytes);
      } else if (method === 8) {
        text = await inflateRawToText(compressedBytes);
      }
      if (text) {
        entries.push({ name, text });
      }
    }
    centralOffset += 46 + fileNameLength + extraLength + commentLength;
  }
  return entries;
}

async function inflateRawToText(bytes) {
  if (typeof DecompressionStream === "undefined") {
    throw new Error("This browser does not support ZIP deflate decompression. Try a current Chromium/Edge browser or use an XML dataset URL.");
  }
  const stream = new Blob([bytes]).stream().pipeThrough(new DecompressionStream("deflate-raw"));
  const decompressed = await new Response(stream).arrayBuffer();
  return new TextDecoder("utf-8").decode(decompressed);
}

function parseTransXChangeTimetable(xmlText, fileName = "TransXChange") {
  const parser = new DOMParser();
  const doc = parser.parseFromString(xmlText, "application/xml");
  if (doc.querySelector("parsererror")) {
    throw new Error(`${fileName} is not valid XML.`);
  }
  const stopResult = parseTxcStops(doc);
  const stops = stopResult.stopsById;
  const embeddedCoordinateStopCount = stops.size;
  let routeLinkCoordinateStopCount = 0;
  const routeLinkResult = parseTxcRouteLinks(doc);
  routeLinkResult.stopsById.forEach((stop, id) => {
    if (!stops.has(id)) {
      stops.set(id, stop);
      routeLinkCoordinateStopCount += 1;
    }
  });
  const linksBySection = parseTxcJourneyPatternSections(doc, routeLinkResult);
  const patterns = parseTxcJourneyPatterns(doc, linksBySection, routeLinkResult);
  const routeNameByLine = parseTxcLineNames(doc);
  const connections = [];
  const warnings = [];
  let parsedRuntimeConnectionCount = 0;
  let estimatedRuntimeConnectionCount = 0;
  let rejectedImplausibleConnectionCount = 0;
  let originMatchedStopCount = 0;
  const impliedSpeedKphValues = [];
  getElementsByTagNameLocal(doc, "VehicleJourney").forEach((journey, journeyIndex) => {
    const patternRef = getFirstElementText(journey, "JourneyPatternRef");
    const departureTime = getFirstElementText(journey, "DepartureTime");
    const lineRef = getFirstElementText(journey, "LineRef");
    const startMinutes = parseClockTimeToMinutes(departureTime);
    const vehicleJourneyLinks = parseTxcVehicleJourneyTimingLinks(journey, routeLinkResult);
    const pattern = vehicleJourneyLinks.length > 0 ? vehicleJourneyLinks : (patterns.get(patternRef) || []);
    if (!pattern || !Number.isFinite(startMinutes) || pattern.length === 0) {
      return;
    }
    let currentMinutes = startMinutes;
    pattern.forEach((link, linkIndex) => {
      const explicitDepartureMinutes = normaliseTxcLinkClockMinutes(link.departureMinutes, currentMinutes);
      const linkDepartureMinutes = Number.isFinite(explicitDepartureMinutes) ? explicitDepartureMinutes : currentMinutes;
      const explicitArrivalMinutes = normaliseTxcLinkClockMinutes(link.arrivalMinutes, linkDepartureMinutes);
      const parsedRuntime = parseIsoDurationMinutes(link.runtime);
      const runtimeFromAbsoluteTimes = Number.isFinite(explicitArrivalMinutes)
        ? explicitArrivalMinutes - linkDepartureMinutes
        : null;
      const runtime = Number.isFinite(runtimeFromAbsoluteTimes) && runtimeFromAbsoluteTimes > 0
        ? runtimeFromAbsoluteTimes
        : Number.isFinite(parsedRuntime)
          ? parsedRuntime
          : estimateConservativeTxcRuntimeMinutes(stops, link.fromStopId, link.toStopId);
      const estimatedRuntime = !(Number.isFinite(runtimeFromAbsoluteTimes) && runtimeFromAbsoluteTimes > 0) && !Number.isFinite(parsedRuntime);
      if (!Number.isFinite(runtime) || runtime <= 0) {
        return;
      }
      const nextMinutes = linkDepartureMinutes + runtime;
      const impliedSpeedKph = calculateTxcImpliedSpeedKph(stops, link.fromStopId, link.toStopId, runtime, link.geometry);
      if (Number.isFinite(impliedSpeedKph) && impliedSpeedKph > BODS_MAX_IMPLAUSIBLE_SPEED_KPH) {
        rejectedImplausibleConnectionCount += 1;
        currentMinutes = nextMinutes;
        return;
      }
      if (estimatedRuntime) {
        estimatedRuntimeConnectionCount += 1;
      } else {
        parsedRuntimeConnectionCount += 1;
      }
      if (Number.isFinite(impliedSpeedKph)) {
        impliedSpeedKphValues.push(impliedSpeedKph);
      }
      connections.push({
        fromStopId: link.fromStopId,
        toStopId: link.toStopId,
        departureMinutes: linkDepartureMinutes,
        arrivalMinutes: nextMinutes,
        routeId: lineRef || patternRef || getFirstElementText(journey, "LineName") || fileName,
        routeRef: routeNameByLine.get(lineRef) || lineRef || getFirstElementText(journey, "LineName") || "Bus",
        routeName: routeNameByLine.get(lineRef) || getFirstElementText(journey, "LineName") || lineRef || "BODS bus service",
        tripId: getFirstElementText(journey, "VehicleJourneyCode") || `${fileName}-${journeyIndex}`,
        linkIndex,
        estimatedRuntime,
        impliedSpeedKph,
        geometry: link.geometry,
        geometrySource: link.geometry?.length ? "parsed_route_link_geometry" : "stop_to_stop",
        timingSource: Number.isFinite(runtimeFromAbsoluteTimes) && runtimeFromAbsoluteTimes > 0
          ? "vehicle_journey_link_absolute_times"
          : Number.isFinite(parsedRuntime)
            ? "transxchange_runtime"
            : "estimated_runtime",
      });
      const explicitNextDepartureMinutes = normaliseTxcLinkClockMinutes(link.toDepartureMinutes, nextMinutes);
      currentMinutes = Number.isFinite(explicitNextDepartureMinutes) && explicitNextDepartureMinutes >= nextMinutes
        ? explicitNextDepartureMinutes
        : nextMinutes;
    });
  });
  const linkStopIds = new Set();
  connections.forEach((connection) => {
    if (connection.fromStopId) {
      linkStopIds.add(connection.fromStopId);
    }
    if (connection.toStopId) {
      linkStopIds.add(connection.toStopId);
    }
  });
  const missingCoordinateStopsById = new Map(stopResult.missingCoordinateStopsById);
  linkStopIds.forEach((id) => {
    if (!stops.has(id) && !missingCoordinateStopsById.has(id)) {
      missingCoordinateStopsById.set(id, { id, name: id, source: "TimetableStopPointRef" });
    }
  });
  routeLinkResult.stopsById.forEach((stop, id) => {
    const existingStop = stops.get(id);
    if (existingStop) {
      existingStop.name = missingCoordinateStopsById.get(id)?.name || existingStop.name || id;
    }
    missingCoordinateStopsById.delete(id);
  });
  const uniqueStopReferenceCount = new Set([
    ...stops.keys(),
    ...missingCoordinateStopsById.keys(),
  ]).size;
  if (stops.size === 0 && stopResult.stopReferenceCount === 0) {
    warnings.push(`${fileName}: no stop references found.`);
  } else if (stops.size === 0) {
    warnings.push(`${fileName}: stop references found but no embedded coordinates parsed.`);
  }
  if (connections.length === 0) {
    warnings.push(`${fileName}: no stop-to-stop timetable links found.`);
  }
  return {
    stops: Array.from(stops.values()),
    missingCoordinateStops: Array.from(missingCoordinateStopsById.values()),
    stopReferenceCount: Math.max(stopResult.stopReferenceCount, uniqueStopReferenceCount),
    directCoordinateStopCount: embeddedCoordinateStopCount,
    routeLinkCoordinateStopCount,
    parsedRuntimeConnectionCount,
    estimatedRuntimeConnectionCount,
    rejectedImplausibleConnectionCount,
    originMatchedStopCount,
    impliedSpeedStats: summariseBodsImpliedSpeeds(impliedSpeedKphValues),
    impliedSpeedKphValues,
    stopStructureSamples: stopResult.stopStructureSamples,
    connections,
    warnings,
  };
}

function parseTxcStops(doc) {
  const stopsById = new Map();
  const missingCoordinateStopsById = new Map();
  const stopStructureSamples = [];
  let stopReferenceCount = 0;

  const addStopNode = (node, nodeType) => {
    const id = getTxcStopNodeId(node);
    if (!id) {
      return;
    }
    stopReferenceCount += 1;
    const name = getFirstElementText(node, "CommonName") || getFirstElementText(node, "ShortCommonName") || id;
    const coordinate = parseTxcStopCoordinate(node);
    if (stopStructureSamples.length < 6) {
      stopStructureSamples.push(summariseTxcStopNodeStructure(node, nodeType, Boolean(coordinate)));
    }
    if (coordinate) {
      stopsById.set(id, { id, name, ...coordinate });
      missingCoordinateStopsById.delete(id);
      return;
    }
    if (!stopsById.has(id) && !missingCoordinateStopsById.has(id)) {
      missingCoordinateStopsById.set(id, { id, name, source: nodeType });
    }
  };

  getElementsByTagNameLocal(doc, "AnnotatedStopPointRef").forEach((node) => addStopNode(node, "AnnotatedStopPointRef"));
  getElementsByTagNameLocal(doc, "StopPoint").forEach((node) => addStopNode(node, "StopPoint"));
  return { stopsById, missingCoordinateStopsById, stopReferenceCount, stopStructureSamples };
}

function parseTxcRouteLinks(doc) {
  const stopsById = new Map();
  const geometryByRouteLinkId = new Map();
  const geometryByStopPair = new Map();
  getElementsByTagNameLocal(doc, "RouteLink").forEach((link) => {
    const id = link.getAttribute("id") || getFirstElementText(link, "RouteLinkRef");
    const fromNode = getDirectChildElementByLocalName(link, "From");
    const toNode = getDirectChildElementByLocalName(link, "To");
    const fromStopId = getTxcStopReference(fromNode);
    const toStopId = getTxcStopReference(toNode);
    if (!fromStopId && !toStopId) {
      return;
    }
    const coordinates = getElementsByTagNameLocal(link, "Location")
      .map((location) => parseTxcStopCoordinate(location))
      .filter(Boolean);
    if (coordinates.length === 0) {
      return;
    }
    if (id) {
      geometryByRouteLinkId.set(id, coordinates);
    }
    if (fromStopId && toStopId) {
      geometryByStopPair.set(buildTxcStopPairKey(fromStopId, toStopId), coordinates);
    }
    const addGeometryStop = (id, coordinate) => {
      if (!id || !coordinate || stopsById.has(id)) {
        return;
      }
      stopsById.set(id, {
        id,
        name: id,
        latitude: coordinate.latitude,
        longitude: coordinate.longitude,
        coordinateSource: "route_link_geometry",
      });
    };
    addGeometryStop(fromStopId, coordinates[0]);
    addGeometryStop(toStopId, coordinates[coordinates.length - 1]);
  });
  return { stopsById, geometryByRouteLinkId, geometryByStopPair };
}

function buildTxcStopPairKey(fromStopId, toStopId) {
  return `${fromStopId || ""}=>${toStopId || ""}`;
}

function getTxcStopNodeId(node) {
  return node?.getAttribute?.("id")
    || getFirstElementText(node, "StopPointRef")
    || getFirstElementText(node, "AtcoCode")
    || getFirstElementText(node, "ATCOCode")
    || getFirstElementText(node, "NaptanCode");
}

function summariseTxcStopNodeStructure(node, nodeType, hasCoordinate) {
  const childNames = getDirectChildLocalNames(node).slice(0, 12);
  return {
    nodeType,
    id: getTxcStopNodeId(node),
    hasCoordinate,
    childNames,
    hasLatitude: Boolean(getFirstElementText(node, "Latitude")),
    hasLongitude: Boolean(getFirstElementText(node, "Longitude")),
    hasEasting: Boolean(getFirstElementText(node, "Easting")),
    hasNorthing: Boolean(getFirstElementText(node, "Northing")),
  };
}

function parseTxcStopCoordinate(node) {
  const latitude = parseFiniteCoordinateText(getFirstElementText(node, "Latitude"));
  const longitude = parseFiniteCoordinateText(getFirstElementText(node, "Longitude"));
  if (isPlausibleUkWgs84Coordinate(latitude, longitude)) {
    return { latitude, longitude, coordinateSource: "wgs84" };
  }

  const easting = parseFiniteCoordinateText(getFirstElementText(node, "Easting"));
  const northing = parseFiniteCoordinateText(getFirstElementText(node, "Northing"));
  const converted = convertBritishNationalGridToWgs84(easting, northing);
  if (converted && isPlausibleUkWgs84Coordinate(converted.latitude, converted.longitude)) {
    return { ...converted, coordinateSource: "osgb36_bng" };
  }

  return null;
}

function parseFiniteCoordinateText(value) {
  const text = String(value ?? "").trim();
  if (!text) {
    return null;
  }
  const number = Number(text);
  return Number.isFinite(number) ? number : null;
}

function isPlausibleUkWgs84Coordinate(latitude, longitude) {
  return Number.isFinite(latitude)
    && Number.isFinite(longitude)
    && latitude >= 49
    && latitude <= 61
    && longitude >= -9
    && longitude <= 3;
}

function convertBritishNationalGridToWgs84(easting, northing) {
  if (!Number.isFinite(easting) || !Number.isFinite(northing) || easting < 0 || easting > 800000 || northing < 0 || northing > 1400000) {
    return null;
  }

  const airyA = 6377563.396;
  const airyB = 6356256.909;
  const f0 = 0.9996012717;
  const lat0 = (49 * Math.PI) / 180;
  const lon0 = (-2 * Math.PI) / 180;
  const n0 = -100000;
  const e0 = 400000;
  const e2 = 1 - (airyB * airyB) / (airyA * airyA);
  const n = (airyA - airyB) / (airyA + airyB);

  let lat = lat0;
  let meridionalArc = 0;
  do {
    lat = (northing - n0 - meridionalArc) / (airyA * f0) + lat;
    const ma = (1 + n + (5 / 4) * n ** 2 + (5 / 4) * n ** 3) * (lat - lat0);
    const mb = (3 * n + 3 * n ** 2 + (21 / 8) * n ** 3) * Math.sin(lat - lat0) * Math.cos(lat + lat0);
    const mc = ((15 / 8) * n ** 2 + (15 / 8) * n ** 3) * Math.sin(2 * (lat - lat0)) * Math.cos(2 * (lat + lat0));
    const md = (35 / 24) * n ** 3 * Math.sin(3 * (lat - lat0)) * Math.cos(3 * (lat + lat0));
    meridionalArc = airyB * f0 * (ma - mb + mc - md);
  } while (Math.abs(northing - n0 - meridionalArc) >= 0.00001);

  const cosLat = Math.cos(lat);
  const sinLat = Math.sin(lat);
  const nu = airyA * f0 / Math.sqrt(1 - e2 * sinLat ** 2);
  const rho = airyA * f0 * (1 - e2) / (1 - e2 * sinLat ** 2) ** 1.5;
  const eta2 = nu / rho - 1;
  const tanLat = Math.tan(lat);
  const secLat = 1 / cosLat;
  const dE = easting - e0;

  const vii = tanLat / (2 * rho * nu);
  const viii = tanLat / (24 * rho * nu ** 3) * (5 + 3 * tanLat ** 2 + eta2 - 9 * tanLat ** 2 * eta2);
  const ix = tanLat / (720 * rho * nu ** 5) * (61 + 90 * tanLat ** 2 + 45 * tanLat ** 4);
  const x = secLat / nu;
  const xi = secLat / (6 * nu ** 3) * (nu / rho + 2 * tanLat ** 2);
  const xii = secLat / (120 * nu ** 5) * (5 + 28 * tanLat ** 2 + 24 * tanLat ** 4);
  const xiia = secLat / (5040 * nu ** 7) * (61 + 662 * tanLat ** 2 + 1320 * tanLat ** 4 + 720 * tanLat ** 6);

  const osgbLat = lat - vii * dE ** 2 + viii * dE ** 4 - ix * dE ** 6;
  const osgbLon = lon0 + x * dE - xi * dE ** 3 + xii * dE ** 5 - xiia * dE ** 7;
  return transformOsgb36LatLonToWgs84(osgbLat, osgbLon);
}

function transformOsgb36LatLonToWgs84(lat, lon) {
  const airyA = 6377563.396;
  const airyB = 6356256.909;
  const wgsA = 6378137;
  const wgsB = 6356752.3141;
  const tx = 446.448;
  const ty = -125.157;
  const tz = 542.06;
  const rx = (0.1502 / 3600) * Math.PI / 180;
  const ry = (0.2470 / 3600) * Math.PI / 180;
  const rz = (0.8421 / 3600) * Math.PI / 180;
  const s = -20.4894e-6;

  const e2 = 1 - (airyB * airyB) / (airyA * airyA);
  const nu = airyA / Math.sqrt(1 - e2 * Math.sin(lat) ** 2);
  const x1 = nu * Math.cos(lat) * Math.cos(lon);
  const y1 = nu * Math.cos(lat) * Math.sin(lon);
  const z1 = (nu * (1 - e2)) * Math.sin(lat);

  const x2 = tx + (1 + s) * x1 - rz * y1 + ry * z1;
  const y2 = ty + rz * x1 + (1 + s) * y1 - rx * z1;
  const z2 = tz - ry * x1 + rx * y1 + (1 + s) * z1;

  const wgsE2 = 1 - (wgsB * wgsB) / (wgsA * wgsA);
  const p = Math.sqrt(x2 * x2 + y2 * y2);
  let wgsLat = Math.atan2(z2, p * (1 - wgsE2));
  let previousLat = 0;
  while (Math.abs(wgsLat - previousLat) > 1e-12) {
    previousLat = wgsLat;
    const wgsNu = wgsA / Math.sqrt(1 - wgsE2 * Math.sin(wgsLat) ** 2);
    wgsLat = Math.atan2(z2 + wgsE2 * wgsNu * Math.sin(wgsLat), p);
  }
  const wgsLon = Math.atan2(y2, x2);
  return {
    latitude: (wgsLat * 180) / Math.PI,
    longitude: (wgsLon * 180) / Math.PI,
  };
}

function parseTxcJourneyPatternSections(doc, routeLinkResult = null) {
  const sections = new Map();
  getElementsByTagNameLocal(doc, "JourneyPatternSection").forEach((section) => {
    const id = section.getAttribute("id") || getFirstElementText(section, "JourneyPatternSectionRef");
    const links = [];
    getElementsByTagNameLocal(section, "JourneyPatternTimingLink").forEach((link) => {
      const fromNode = getElementsByTagNameLocal(link, "From")[0];
      const toNode = getElementsByTagNameLocal(link, "To")[0];
      const fromStopId = getTxcStopReference(fromNode);
      const toStopId = getTxcStopReference(toNode);
      if (fromStopId && toStopId) {
        links.push(buildTxcTimingLink(fromStopId, toStopId, getFirstElementText(link, "RunTime"), getFirstElementText(link, "RouteLinkRef"), routeLinkResult));
      }
    });
    if (id && links.length > 0) {
      sections.set(id, links);
    }
  });
  return sections;
}

function parseTxcJourneyPatterns(doc, linksBySection, routeLinkResult = null) {
  const patterns = new Map();
  getElementsByTagNameLocal(doc, "JourneyPattern").forEach((pattern) => {
    const id = pattern.getAttribute("id") || getFirstElementText(pattern, "JourneyPatternRef");
    const links = [];
    getElementsByTagNameLocal(pattern, "JourneyPatternSectionRefs").forEach((refNode) => {
      splitTxcReferenceText(refNode.textContent).forEach((sectionRef) => {
        const sectionLinks = linksBySection.get(sectionRef);
        if (sectionLinks) {
          links.push(...sectionLinks);
        }
      });
    });
    getElementsByTagNameLocal(pattern, "JourneyPatternSectionRef").forEach((refNode) => {
      splitTxcReferenceText(refNode.textContent).forEach((sectionRef) => {
        const sectionLinks = linksBySection.get(sectionRef);
        if (sectionLinks) {
          links.push(...sectionLinks);
        }
      });
    });
    if (links.length === 0) {
      getElementsByTagNameLocal(pattern, "JourneyPatternTimingLink").forEach((link) => {
        const fromNode = getElementsByTagNameLocal(link, "From")[0];
        const toNode = getElementsByTagNameLocal(link, "To")[0];
        const fromStopId = getTxcStopReference(fromNode);
        const toStopId = getTxcStopReference(toNode);
        if (fromStopId && toStopId) {
          links.push(buildTxcTimingLink(fromStopId, toStopId, getFirstElementText(link, "RunTime"), getFirstElementText(link, "RouteLinkRef"), routeLinkResult));
        }
      });
    }
    if (id && links.length > 0) {
      patterns.set(id, links);
    }
  });
  return patterns;
}

function parseTxcVehicleJourneyTimingLinks(journey, routeLinkResult = null) {
  const links = [];
  getElementsByTagNameLocal(journey, "VehicleJourneyTimingLink").forEach((link) => {
    const fromNode = getElementsByTagNameLocal(link, "From")[0];
    const toNode = getElementsByTagNameLocal(link, "To")[0];
    const fromStopId = getTxcStopReference(fromNode);
    const toStopId = getTxcStopReference(toNode);
    if (fromStopId && toStopId) {
      links.push(buildTxcTimingLink(
        fromStopId,
        toStopId,
        getFirstElementText(link, "RunTime"),
        getFirstElementText(link, "RouteLinkRef"),
        routeLinkResult,
        {
          departureMinutes: getTxcTimingPointMinutes(fromNode, "departure"),
          arrivalMinutes: getTxcTimingPointMinutes(toNode, "arrival"),
          toDepartureMinutes: getTxcTimingPointMinutes(toNode, "departure"),
        }
      ));
    }
  });
  return links;
}

function buildTxcTimingLink(fromStopId, toStopId, runtime, routeLinkRef, routeLinkResult = null, timing = {}) {
  const geometry = routeLinkResult
    ? routeLinkResult.geometryByRouteLinkId.get(routeLinkRef)
      || routeLinkResult.geometryByStopPair.get(buildTxcStopPairKey(fromStopId, toStopId))
      || null
    : null;
  return {
    fromStopId,
    toStopId,
    runtime,
    routeLinkRef,
    geometry,
    departureMinutes: timing.departureMinutes,
    arrivalMinutes: timing.arrivalMinutes,
    toDepartureMinutes: timing.toDepartureMinutes,
  };
}

function getTxcTimingPointMinutes(node, type) {
  if (!node) {
    return null;
  }
  const preferredTags = type === "arrival"
    ? ["ArrivalTime", "AimedArrivalTime", "ScheduledArrivalTime", "Time"]
    : ["DepartureTime", "AimedDepartureTime", "ScheduledDepartureTime", "Time"];
  for (const tagName of preferredTags) {
    const minutes = parseClockTimeToMinutes(getFirstElementText(node, tagName));
    if (Number.isFinite(minutes)) {
      return minutes;
    }
  }
  return null;
}

function normaliseTxcLinkClockMinutes(rawMinutes, referenceMinutes) {
  if (!Number.isFinite(rawMinutes)) {
    return null;
  }
  let minutes = rawMinutes;
  while (Number.isFinite(referenceMinutes) && minutes < referenceMinutes - 720) {
    minutes += 1440;
  }
  while (Number.isFinite(referenceMinutes) && minutes < referenceMinutes - 1) {
    minutes += 1440;
  }
  return minutes;
}

function parseTxcLineNames(doc) {
  const names = new Map();
  getElementsByTagNameLocal(doc, "Line").forEach((line) => {
    const id = line.getAttribute("id") || getFirstElementText(line, "LineRef");
    const name = getFirstElementText(line, "LineName") || getFirstElementText(line, "PublicUseLineName") || id;
    if (id) {
      names.set(id, name);
    }
  });
  return names;
}

function getTxcStopReference(node) {
  return getFirstElementText(node, "StopPointRef") || getFirstElementText(node, "AnnotatedStopPointRef") || getFirstElementText(node, "AtcoCode");
}

function splitTxcReferenceText(value) {
  return String(value || "")
    .trim()
    .split(/\s+/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function getFirstElementText(parent, tagName) {
  const node = getElementsByTagNameLocal(parent, tagName)[0];
  return node?.textContent?.trim() || "";
}

function getElementsByTagNameLocal(parent, tagName) {
  if (!parent?.getElementsByTagName) {
    return [];
  }
  const directMatches = Array.from(parent.getElementsByTagName(tagName) || []);
  if (directMatches.length > 0) {
    return directMatches;
  }
  return Array.from(parent.getElementsByTagName("*") || [])
    .filter((node) => getXmlLocalName(node) === tagName);
}

function getXmlLocalName(node) {
  const name = node?.localName || node?.tagName || node?.nodeName || node?.name || "";
  return String(name).split(":").pop();
}

function getDirectChildLocalNames(node) {
  return Array.from(node?.children || node?.childNodes || [])
    .map((child) => getXmlLocalName(child))
    .filter((name) => name && name !== "#text");
}

function getDirectChildElementByLocalName(node, tagName) {
  return Array.from(node?.children || node?.childNodes || [])
    .find((child) => getXmlLocalName(child) === tagName) || null;
}

function parseIsoDurationMinutes(value) {
  const text = String(value || "").trim();
  const match = text.match(/^P(?:T)?(?:(\d+(?:\.\d+)?)H)?(?:(\d+(?:\.\d+)?)M)?(?:(\d+(?:\.\d+)?)S)?$/i) || text.match(/^PT(?:(\d+(?:\.\d+)?)H)?(?:(\d+(?:\.\d+)?)M)?(?:(\d+(?:\.\d+)?)S)?$/i);
  if (!match) {
    return null;
  }
  const hours = Number(match[1] || 0);
  const minutes = Number(match[2] || 0);
  const seconds = Number(match[3] || 0);
  return hours * 60 + minutes + seconds / 60;
}

function parseClockTimeToMinutes(value) {
  const match = String(value || "").trim().match(/^(\d{1,2}):(\d{2})(?::(\d{2}))?$/);
  if (!match) {
    return null;
  }
  return Number(match[1]) * 60 + Number(match[2]) + Number(match[3] || 0) / 60;
}

function getDistanceMetresForStops(stops, fromStopId, toStopId) {
  const from = stops.get(fromStopId);
  const to = stops.get(toStopId);
  if (!from || !to) {
    return 1200;
  }
  return getDistanceMetres(from.latitude, from.longitude, to.latitude, to.longitude);
}

function estimateConservativeTxcRuntimeMinutes(stops, fromStopId, toStopId) {
  const distanceMetres = getDistanceMetresForStops(stops, fromStopId, toStopId);
  if (!Number.isFinite(distanceMetres) || distanceMetres <= 0) {
    return null;
  }
  return distanceMetres / ((BODS_ESTIMATED_RUNTIME_SPEED_KPH * 1000) / 60);
}

function calculateTxcImpliedSpeedKph(stops, fromStopId, toStopId, runtimeMinutes, geometry = null) {
  const distanceMetres = Array.isArray(geometry) && geometry.length >= 2
    ? calculateCoordinatePathDistanceMetres(geometry)
    : getDistanceMetresForStops(stops, fromStopId, toStopId);
  if (!Number.isFinite(distanceMetres) || distanceMetres <= 0 || !Number.isFinite(runtimeMinutes) || runtimeMinutes <= 0) {
    return null;
  }
  return (distanceMetres / 1000) / (runtimeMinutes / 60);
}

function calculateCoordinatePathDistanceMetres(coordinates) {
  let distance = 0;
  for (let index = 1; index < coordinates.length; index += 1) {
    const previous = coordinates[index - 1];
    const current = coordinates[index];
    const segmentDistance = getDistanceMetres(previous.latitude, previous.longitude, current.latitude, current.longitude);
    if (Number.isFinite(segmentDistance)) {
      distance += segmentDistance;
    }
  }
  return distance;
}

function summariseBodsImpliedSpeeds(values) {
  const speeds = values.filter((value) => Number.isFinite(value)).sort((a, b) => a - b);
  if (speeds.length === 0) {
    return { count: 0, min: null, median: null, max: null };
  }
  const middle = Math.floor(speeds.length / 2);
  const median = speeds.length % 2
    ? speeds[middle]
    : (speeds[middle - 1] + speeds[middle]) / 2;
  return {
    count: speeds.length,
    min: speeds[0],
    median,
    max: speeds[speeds.length - 1],
  };
}

function runBodsEarliestArrivalSearch(timetable, originCoordinates, configuredBands, maximumBandMinutes, maximumWalkToBusStopMetres, departureMinutes) {
  const maxAbsoluteMinutes = departureMinutes + maximumBandMinutes + BODS_LOOKAHEAD_MINUTES;
  const stops = timetable.stops;
  const stopIndexById = new Map(stops.map((stop, index) => [stop.id, index]));
  const label = stops.map(() => new Array(BODS_MAX_TRANSFERS + 1).fill(Infinity));
  const previous = stops.map(() => new Array(BODS_MAX_TRANSFERS + 1).fill(null));
  const initialWalkCandidateStopCount = stops.length;
  let initialStopsWithinMaxWalkCount = 0;
  let retainedInitialWalkStopCount = 0;
  let nearestInitialStopStraightLineMetres = Infinity;
  let nearestInitialStopEstimatedWalkMetres = Infinity;
  stops.forEach((stop, index) => {
    const distance = getDistanceMetres(originCoordinates.latitude, originCoordinates.longitude, stop.latitude, stop.longitude);
    const estimatedWalkDistance = estimateBusWalkDistanceMetres(distance);
    const walkMinutes = estimateBusWalkTimeMinutes(distance);
    if (Number.isFinite(distance) && distance < nearestInitialStopStraightLineMetres) {
      nearestInitialStopStraightLineMetres = distance;
      nearestInitialStopEstimatedWalkMetres = Number.isFinite(estimatedWalkDistance) ? estimatedWalkDistance : Infinity;
    }
    if (isBodsInitialStopWithinSelectedWalkLimit(distance, maximumWalkToBusStopMetres) && Number.isFinite(estimatedWalkDistance) && Number.isFinite(walkMinutes)) {
      initialStopsWithinMaxWalkCount += 1;
      if (walkMinutes < maximumBandMinutes) {
        label[index][0] = departureMinutes + walkMinutes;
        previous[index][0] = { type: "initial_walk", distanceMetres: estimatedWalkDistance, arrivalMinutes: departureMinutes + walkMinutes };
        retainedInitialWalkStopCount += 1;
      }
    }
  });
  const transferEdges = buildBodsTransferEdges(stops);
  const transferWalkEdgeCount = transferEdges.reduce((total, edges) => total + edges.length, 0);
  const initialInterchangeRelaxationCount = applyBodsInitialInterchangeRelaxation(label, previous, transferEdges, departureMinutes, maximumBandMinutes);
  const reachableSegments = [];
  const reachableSegmentKeys = new Set();
  const consideredConnections = timetable.connections
    .map((connection) => normaliseBodsConnectionForDepartureWindow(connection, departureMinutes))
    .filter((connection) => connection.departureMinutes >= departureMinutes && connection.departureMinutes <= maxAbsoluteMinutes);
  consideredConnections.sort((a, b) => a.departureMinutes - b.departureMinutes);
  consideredConnections.forEach((connection) => {
    const fromIndex = stopIndexById.get(connection.fromStopId);
    const toIndex = stopIndexById.get(connection.toStopId);
    if (fromIndex === undefined || toIndex === undefined) {
      return;
    }
    for (let transfersUsed = 0; transfersUsed <= BODS_MAX_TRANSFERS; transfersUsed += 1) {
      if (label[fromIndex][transfersUsed] <= connection.departureMinutes && connection.arrivalMinutes - departureMinutes <= maximumBandMinutes) {
        const accessArrivalMinutes = label[fromIndex][transfersUsed];
        const reachableSegment = buildBodsReachableSegment(connection, timetable.stopsById, departureMinutes, transfersUsed, {
          accessArrivalMinutes,
          journeyChain: buildBodsJourneyChainSnapshot(previous, stops, stopIndexById, fromIndex, transfersUsed, departureMinutes, connection),
        });
        const segmentKey = `${reachableSegment.tripId || connection.tripId}:${connection.fromStopId}:${connection.toStopId}:${connection.departureMinutes}:${transfersUsed}`;
        if (!reachableSegmentKeys.has(segmentKey)) {
          reachableSegmentKeys.add(segmentKey);
          reachableSegments.push({ ...reachableSegment, _key: segmentKey });
        }
        if (connection.arrivalMinutes < label[toIndex][transfersUsed]) {
          label[toIndex][transfersUsed] = connection.arrivalMinutes;
          previous[toIndex][transfersUsed] = { type: "bus", connection, fromIndex, fromTransfersUsed: transfersUsed };
          applyBodsTransferRelaxation(toIndex, transfersUsed, label, previous, transferEdges, departureMinutes, maximumBandMinutes);
        }
      }
    }
  });
  const earliestByStop = stops.map((stop, index) => ({ stop, earliestArrival: Math.min(...label[index]), transfersUsed: label[index].indexOf(Math.min(...label[index])) })).filter((entry) => Number.isFinite(entry.earliestArrival));
  const reachableStopsByBand = {};
  const reachableConnectionsByBand = {};
  configuredBands.forEach((band) => {
    const bandTime = Number(band.time);
    reachableStopsByBand[bandTime] = earliestByStop.filter((entry) => entry.earliestArrival - departureMinutes <= bandTime).length;
    reachableConnectionsByBand[bandTime] = reachableSegments.filter((segment) => segment.elapsedTimeAtEnd <= bandTime).length;
  });
  return {
    stops,
    label,
    previous,
    earliestByStop,
    reachableSegments,
    initialStopCount: retainedInitialWalkStopCount,
    initialWalkCandidateStopCount,
    initialStopsWithinMaxWalkCount,
    retainedInitialWalkStopCount,
    nearestInitialStopStraightLineMetres: Number.isFinite(nearestInitialStopStraightLineMetres) ? nearestInitialStopStraightLineMetres : null,
    nearestInitialStopEstimatedWalkMetres: Number.isFinite(nearestInitialStopEstimatedWalkMetres) ? nearestInitialStopEstimatedWalkMetres : null,
    consideredConnectionCount: consideredConnections.length,
    transferWalkEdgeCount,
    initialInterchangeRelaxationCount,
    reachableStopCount: earliestByStop.length,
    reachableStopsByBand,
    reachableConnectionsByBand,
    reachableRouteSummary: summariseBodsReachableRouteAudit(reachableSegments),
    targetPlaceDiagnostics: buildBodsTargetPlaceDiagnostics(stops, earliestByStop, originCoordinates, departureMinutes),
    departureMinutes,
    originCoordinates: isValidCoordinateObject(originCoordinates)
      ? { latitude: Number(originCoordinates.latitude), longitude: Number(originCoordinates.longitude) }
      : null,
  };
}

function normaliseBodsConnectionForDepartureWindow(connection, departureMinutes) {
  let departure = Number(connection.departureMinutes);
  let arrival = Number(connection.arrivalMinutes);
  if (!Number.isFinite(departure) || !Number.isFinite(arrival)) {
    return connection;
  }
  if (arrival < departure) {
    arrival += 1440;
  }
  if (departure < departureMinutes) {
    departure += 1440;
    arrival += 1440;
  }
  return {
    ...connection,
    departureMinutes: departure,
    arrivalMinutes: arrival,
  };
}

function isBodsInitialStopWithinSelectedWalkLimit(estimatedWalkDistanceMetres, maximumWalkToBusStopMetres) {
  return Number.isFinite(estimatedWalkDistanceMetres)
    && estimatedWalkDistanceMetres >= 0
    && Number.isFinite(maximumWalkToBusStopMetres)
    && estimatedWalkDistanceMetres <= maximumWalkToBusStopMetres;
}

function diagnoseBodsTimetableSearchFailure(searchResult) {
  const details = {
    initialWalkCandidateStopCount: searchResult.initialWalkCandidateStopCount,
    initialStopsWithinMaxWalkCount: searchResult.initialStopsWithinMaxWalkCount,
    retainedInitialWalkStopCount: searchResult.retainedInitialWalkStopCount,
    nearestInitialStopStraightLineMetres: searchResult.nearestInitialStopStraightLineMetres,
    nearestInitialStopEstimatedWalkMetres: searchResult.nearestInitialStopEstimatedWalkMetres,
    consideredConnectionCount: searchResult.consideredConnectionCount,
    reachableStopCount: searchResult.reachableStopCount,
    reachableConnectionCount: searchResult.reachableSegments.length,
  };

  if (searchResult.initialStopsWithinMaxWalkCount === 0) {
    const nearestText = Number.isFinite(Number(searchResult.nearestInitialStopStraightLineMetres))
      ? ` The nearest parsed BODS timetable stop was approximately ${Math.round(searchResult.nearestInitialStopStraightLineMetres).toLocaleString("en-GB")} m straight-line from the selected origin.`
      : "";
    return {
      stage: "no_stops_within_max_walk",
      message: `No BODS timetable stops were found within the selected maximum walk-to-bus-stop distance.${nearestText} Increase the walk distance or check the selected location.`,
      details,
    };
  }

  if (searchResult.consideredConnectionCount === 0) {
    return {
      stage: "no_departures_after_selected_time",
      message: "BODS timetable stops were found within the selected walk distance, but no valid scheduled departures were found after the selected time within the configured look-ahead window. Try a different time or date.",
      details,
    };
  }

  if (searchResult.reachableSegments.length === 0) {
    return {
      stage: "departures_not_reachable_within_bands",
      message: "BODS timetable departures were found after the selected time, but none could be boarded and completed within the configured bus time bands.",
      details,
    };
  }

  return {
    stage: "reachable_movement_no_drawable_geometry",
    message: "BODS timetable movement was reachable, but no drawable catchment geometry could be generated from the reachable stops or route segments.",
    details,
  };
}


function buildBodsJourneyChainSnapshot(previous, stops, stopIndexById, currentIndex, transfersUsed, departureMinutes, finalConnection = null) {
  const steps = [];
  const visited = new Set();
  let index = currentIndex;
  let transferState = transfersUsed;

  for (let guard = 0; guard < 16; guard += 1) {
    const key = `${index}|${transferState}`;
    if (visited.has(key)) {
      break;
    }
    visited.add(key);
    const stop = stops[index];
    const entry = previous[index]?.[transferState];
    if (!stop || !entry) {
      break;
    }

    if (entry.type === "initial_walk") {
      steps.push({
        type: "initial_walk",
        toStopId: stop.id,
        toStopName: stop.name || stop.id,
        distanceMetres: Math.round(Number(entry.distanceMetres) || 0),
        elapsedMinutes: Number.isFinite(Number(entry.arrivalMinutes)) ? Math.round((Number(entry.arrivalMinutes) - departureMinutes) * 10) / 10 : null,
      });
      break;
    }

    if (entry.type === "initial_interchange_walk" || entry.type === "transfer_walk") {
      const fromStop = stops[entry.fromIndex];
      steps.push({
        type: entry.type,
        fromStopId: fromStop?.id || "",
        fromStopName: fromStop?.name || fromStop?.id || "",
        toStopId: stop.id,
        toStopName: stop.name || stop.id,
        distanceMetres: Math.round(Number(entry.distanceMetres) || 0),
        travelTimeMinutes: Math.round((Number(entry.travelTimeMinutes) || 0) * 10) / 10,
      });
      index = entry.fromIndex;
      transferState = Number.isFinite(Number(entry.fromTransfersUsed)) ? Number(entry.fromTransfersUsed) : Math.max(0, transferState - 1);
      continue;
    }

    if (entry.type === "bus" && entry.connection) {
      const fromIndex = stopIndexById.get(entry.connection.fromStopId);
      steps.push(buildBodsJourneyChainBusStep(entry.connection, departureMinutes));
      if (fromIndex === undefined) {
        break;
      }
      index = fromIndex;
      transferState = Number.isFinite(Number(entry.fromTransfersUsed)) ? Number(entry.fromTransfersUsed) : transferState;
      continue;
    }

    break;
  }

  steps.reverse();
  if (finalConnection) {
    steps.push(buildBodsJourneyChainBusStep(finalConnection, departureMinutes));
  }
  return steps.slice(-12);
}

function buildBodsJourneyChainBusStep(connection, departureMinutes) {
  return {
    type: "bus",
    routeRef: connection.routeRef || "",
    routeName: connection.routeName || "",
    routeId: connection.routeId || "",
    tripId: connection.tripId || "",
    fromStopId: connection.fromStopId || "",
    toStopId: connection.toStopId || "",
    departureMinutes: Math.round(Number(connection.departureMinutes) * 10) / 10,
    arrivalMinutes: Math.round(Number(connection.arrivalMinutes) * 10) / 10,
    elapsedDepartureMinutes: Math.round((Number(connection.departureMinutes) - departureMinutes) * 10) / 10,
    elapsedArrivalMinutes: Math.round((Number(connection.arrivalMinutes) - departureMinutes) * 10) / 10,
    timingSource: connection.timingSource || "",
  };
}

function summariseBodsReachableRouteAudit(reachableSegments = []) {
  const routes = new Map();
  (reachableSegments || []).forEach((segment) => {
    const key = normaliseBodsReachableRouteKey(segment);
    if (!routes.has(key)) {
      routes.set(key, {
        routeRef: segment.routeRef || "",
        routeName: segment.routeName || "",
        routeId: segment.routeId || "",
        segmentCount: 0,
        tripIds: new Set(),
        stopNames: new Set(),
        minElapsedMinutes: Infinity,
        maxElapsedMinutes: -Infinity,
      });
    }
    const entry = routes.get(key);
    entry.segmentCount += 1;
    if (segment.tripId) {
      entry.tripIds.add(segment.tripId);
    }
    [segment.fromStopName, segment.toStopName].filter(Boolean).forEach((name) => {
      if (entry.stopNames.size < 10) {
        entry.stopNames.add(name);
      }
    });
    if (Number.isFinite(Number(segment.elapsedTimeAtStart))) {
      entry.minElapsedMinutes = Math.min(entry.minElapsedMinutes, Number(segment.elapsedTimeAtStart));
    }
    if (Number.isFinite(Number(segment.elapsedTimeAtEnd))) {
      entry.maxElapsedMinutes = Math.max(entry.maxElapsedMinutes, Number(segment.elapsedTimeAtEnd));
    }
  });

  const routeList = Array.from(routes.values())
    .map((entry) => ({
      route_ref: entry.routeRef,
      route_name: entry.routeName,
      route_id: entry.routeId,
      reachable_segment_count: entry.segmentCount,
      reachable_trip_count: entry.tripIds.size,
      first_reached_minute: Number.isFinite(entry.minElapsedMinutes) ? Math.round(entry.minElapsedMinutes * 10) / 10 : null,
      last_reached_minute: Number.isFinite(entry.maxElapsedMinutes) ? Math.round(entry.maxElapsedMinutes * 10) / 10 : null,
      sample_stop_names: Array.from(entry.stopNames),
    }))
    .sort((a, b) => b.reachable_segment_count - a.reachable_segment_count || String(a.route_ref || a.route_name).localeCompare(String(b.route_ref || b.route_name), "en-GB"));

  return {
    route_count: routeList.length,
    top_routes: routeList.slice(0, 24),
  };
}

function normaliseBodsReachableRouteKey(segment) {
  return [segment?.routeRef, segment?.routeName, segment?.routeId]
    .filter(Boolean)
    .join("|")
    .toLowerCase() || "unknown-route";
}

function buildBodsTargetPlaceDiagnostics(stops, earliestByStop, originCoordinates, departureMinutes) {
  const targets = getBodsTargetPlaceNames();
  const earliestByStopId = new Map((earliestByStop || []).map((entry) => [entry.stop.id, entry]));
  return targets.map((targetName) => {
    const targetKey = normaliseBodsStopName(targetName);
    const matchedStops = (stops || [])
      .filter((stop) => normaliseBodsStopName(stop.name || stop.id).includes(targetKey))
      .map((stop) => {
        const entry = earliestByStopId.get(stop.id);
        return {
          stop,
          elapsedMinutes: entry ? entry.earliestArrival - departureMinutes : null,
          distanceMetres: isValidCoordinateObject(originCoordinates)
            ? getDistanceMetres(originCoordinates.latitude, originCoordinates.longitude, stop.latitude, stop.longitude)
            : null,
        };
      })
      .sort((a, b) => {
        const aElapsed = Number.isFinite(Number(a.elapsedMinutes)) ? Number(a.elapsedMinutes) : Infinity;
        const bElapsed = Number.isFinite(Number(b.elapsedMinutes)) ? Number(b.elapsedMinutes) : Infinity;
        return aElapsed - bElapsed || (Number(a.distanceMetres) || Infinity) - (Number(b.distanceMetres) || Infinity);
      });
    const reachable = matchedStops.filter((entry) => Number.isFinite(Number(entry.elapsedMinutes)));
    const nearest = [...matchedStops].sort((a, b) => (Number(a.distanceMetres) || Infinity) - (Number(b.distanceMetres) || Infinity))[0];
    return {
      target_name: targetName,
      parsed_matching_stop_count: matchedStops.length,
      reachable_matching_stop_count: reachable.length,
      minimum_elapsed_minutes: reachable.length ? Math.round(Number(reachable[0].elapsedMinutes) * 10) / 10 : null,
      nearest_parsed_stop_distance_m: Number.isFinite(Number(nearest?.distanceMetres)) ? Math.round(Number(nearest.distanceMetres)) : null,
      sample_matching_stops: matchedStops.slice(0, 8).map((entry) => ({
        stop_name: entry.stop.name || entry.stop.id,
        reachable_elapsed_minutes: Number.isFinite(Number(entry.elapsedMinutes)) ? Math.round(Number(entry.elapsedMinutes) * 10) / 10 : null,
      })),
      diagnosis: reachable.length
        ? "A matching BODS stop name is reachable within the parsed timetable graph."
        : matchedStops.length
          ? "Matching BODS stop names were parsed but are not reachable from the selected origin under the current timetable, walk and transfer rules."
          : "No matching BODS stop names were parsed in the downloaded timetable graph.",
    };
  });
}

function getBodsTargetPlaceNames() {
  const names = new Set(BODS_TARGET_PLACE_NAMES);
  state.amenities
    .filter((item) => item.category === "Settlement" && item.name)
    .forEach((item) => names.add(item.name));
  return Array.from(names)
    .map((name) => String(name || "").trim())
    .filter((name) => name.length >= 3)
    .slice(0, 18);
}

function buildBusIsochroneDiagnosticsForMethodNote(metadata = {}) {
  if (!metadata || typeof metadata !== "object") {
    return undefined;
  }
  return {
    provider: metadata.provider,
    bods_selected_query_specs: metadata.bodsSelectedQuerySpecs || metadata.bodsSelectedQuerySpec || null,
    bods_dataset_count: metadata.bodsDatasetCount ?? metadata.datasetCount,
    bods_local_dataset_count: metadata.bodsLocalDatasetCount,
    parsed_file_count: metadata.parsedXmlFileCount,
    stop_count: metadata.stopCount,
    connection_count: metadata.connectionCount,
    reachable_stop_count: metadata.reachableStopCount,
    reachable_connection_count: metadata.reachableConnectionCount,
    reachable_stops_by_band: metadata.reachableStopsByBand,
    reachable_connections_by_band: metadata.reachableConnectionsByBand,
    reachable_route_summary: metadata.bodsReachableRouteSummary,
    target_place_diagnostics: metadata.bodsTargetPlaceDiagnostics,
    output_geometry_modes: metadata.bodsOutputGeometryModes,
    timetable_warning_samples: Array.isArray(metadata.timetableWarnings) ? metadata.timetableWarnings.slice(0, 8) : [],
  };
}

function buildBodsTransferEdges(stops) {
  if (!Array.isArray(stops) || stops.length === 0) {
    return [];
  }

  const validStops = stops
    .map((stop, index) => ({ stop, index }))
    .filter(({ stop }) => isValidCoordinateObject(stop));
  if (validStops.length === 0) {
    return stops.map(() => []);
  }

  const centroid = getCoordinateCentroid(validStops.map(({ stop }) => stop));
  const cellSizeMetres = Math.max(1, BODS_TRANSFER_RADIUS_METRES);
  const projectedStops = validStops.map(({ stop, index }) => {
    const projected = projectCoordinateToLocalMetres(stop, centroid);
    return {
      stop,
      index,
      projected,
      cellX: Math.floor(projected.x / cellSizeMetres),
      cellY: Math.floor(projected.y / cellSizeMetres),
    };
  });

  const grid = new Map();
  projectedStops.forEach((entry) => {
    const key = `${entry.cellX}|${entry.cellY}`;
    if (!grid.has(key)) {
      grid.set(key, []);
    }
    grid.get(key).push(entry);
  });

  const output = stops.map(() => []);
  projectedStops.forEach((entry) => {
    const candidates = [];
    for (let offsetX = -1; offsetX <= 1; offsetX += 1) {
      for (let offsetY = -1; offsetY <= 1; offsetY += 1) {
        const neighbours = grid.get(`${entry.cellX + offsetX}|${entry.cellY + offsetY}`) || [];
        neighbours.forEach((other) => {
          if (entry.index === other.index) {
            return;
          }
          const approximateDistance = Math.hypot(
            entry.projected.x - other.projected.x,
            entry.projected.y - other.projected.y
          );
          if (approximateDistance > BODS_TRANSFER_RADIUS_METRES * 1.05) {
            return;
          }
          const distance = getDistanceMetres(
            entry.stop.latitude,
            entry.stop.longitude,
            other.stop.latitude,
            other.stop.longitude
          );
          if (distance <= BODS_TRANSFER_RADIUS_METRES) {
            const walkDistance = estimateBusWalkDistanceMetres(distance);
            const travelTimeMinutes = estimateBusWalkTimeMinutes(distance);
            if (Number.isFinite(walkDistance) && Number.isFinite(travelTimeMinutes)) {
              candidates.push({ toIndex: other.index, distanceMetres: walkDistance, travelTimeMinutes });
            }
          }
        });
      }
    }
    output[entry.index] = candidates
      .sort((a, b) => a.travelTimeMinutes - b.travelTimeMinutes)
      .slice(0, BODS_TRANSFER_STOP_CAP);
  });
  return output;
}

function applyBodsInitialInterchangeRelaxation(label, previous, transferEdges, departureMinutes, maximumBandMinutes) {
  let relaxedCount = 0;
  label.forEach((entries, fromIndex) => {
    const fromArrival = entries?.[0];
    if (!Number.isFinite(fromArrival)) {
      return;
    }
    (transferEdges[fromIndex] || []).forEach((edge) => {
      const nextArrival = fromArrival + edge.travelTimeMinutes;
      if (nextArrival - departureMinutes <= maximumBandMinutes && nextArrival < label[edge.toIndex][1]) {
        label[edge.toIndex][1] = nextArrival;
        previous[edge.toIndex][1] = {
          type: "initial_interchange_walk",
          fromIndex,
          fromTransfersUsed: 0,
          distanceMetres: edge.distanceMetres,
          travelTimeMinutes: edge.travelTimeMinutes,
        };
        relaxedCount += 1;
      }
    });
  });
  return relaxedCount;
}

function applyBodsTransferRelaxation(fromIndex, transfersUsed, label, previous, transferEdges, departureMinutes, maximumBandMinutes) {
  if (transfersUsed >= BODS_MAX_TRANSFERS) {
    return;
  }
  const fromArrival = label[fromIndex][transfersUsed];
  transferEdges[fromIndex].forEach((edge) => {
    const nextArrival = fromArrival + edge.travelTimeMinutes;
    if (nextArrival - departureMinutes <= maximumBandMinutes && nextArrival < label[edge.toIndex][transfersUsed + 1]) {
      label[edge.toIndex][transfersUsed + 1] = nextArrival;
      previous[edge.toIndex][transfersUsed + 1] = { type: "transfer_walk", fromIndex, fromTransfersUsed: transfersUsed, ...edge };
    }
  });
}

function buildBodsReachableSegment(connection, stopsById, departureMinutes, transfersUsed, context = {}) {
  const from = stopsById.get(connection.fromStopId);
  const to = stopsById.get(connection.toStopId);
  const routeGeometry = Array.isArray(connection.geometry)
    ? connection.geometry.filter((coordinate) => coordinate && Number.isFinite(coordinate.latitude) && Number.isFinite(coordinate.longitude))
    : [];
  return {
    routeId: connection.routeId,
    routeRef: connection.routeRef,
    routeName: connection.routeName,
    tripId: connection.tripId,
    timingSource: connection.timingSource,
    fromStopId: connection.fromStopId,
    fromStopName: from?.name || connection.fromStopId,
    toStopId: connection.toStopId,
    toStopName: to?.name || connection.toStopId,
    coordinate: to ? { latitude: to.latitude, longitude: to.longitude } : null,
    startCoordinate: from ? { latitude: from.latitude, longitude: from.longitude } : null,
    endCoordinate: to ? { latitude: to.latitude, longitude: to.longitude } : null,
    elapsedTimeAtStart: connection.departureMinutes - departureMinutes,
    elapsedTimeAtEnd: connection.arrivalMinutes - departureMinutes,
    estimatedRuntime: Boolean(connection.estimatedRuntime),
    impliedSpeedKph: connection.impliedSpeedKph,
    accessArrivalMinutes: context.accessArrivalMinutes,
    waitTimeMinutes: Number.isFinite(Number(context.accessArrivalMinutes)) ? connection.departureMinutes - Number(context.accessArrivalMinutes) : null,
    journeyChain: Array.isArray(context.journeyChain) ? context.journeyChain : [],
    routeGeometry,
    geometrySource: routeGeometry.length >= 2 ? "parsed_route_geometry" : "stop_buffer",
    transfersUsed,
    reachedVia: "scheduled_bus",
  };
}

function buildBodsTimetableIsochronesFromSearch(searchResult, configuredBands) {
  const outputs = [];
  configuredBands.forEach((band) => {
    const bandTime = Number(band.time);
    const stopMetrics = [];
    const bandSegments = searchResult.reachableSegments
      .map((segment) => clipBodsReachableSegmentToBand(segment, bandTime))
      .filter(Boolean);
    bandSegments.forEach((segment) => {
      if (segment.startCoordinate) {
        stopMetrics.push({ coordinate: segment.startCoordinate, minimumTotalBusAccessTimeMinutes: segment.elapsedTimeAtStart });
      }
      if (segment.endCoordinate) {
        stopMetrics.push({ coordinate: segment.endCoordinate, minimumTotalBusAccessTimeMinutes: segment.elapsedTimeAtEnd });
      }
    });
    searchResult.earliestByStop
      .filter((entry) => entry.earliestArrival - searchResult.departureMinutes <= bandTime)
      .forEach((entry) => stopMetrics.push({ coordinate: { latitude: entry.stop.latitude, longitude: entry.stop.longitude }, minimumTotalBusAccessTimeMinutes: entry.earliestArrival - searchResult.departureMinutes }));
    if ((bandSegments.length > 0 || stopMetrics.length > 0) && isValidCoordinateObject(searchResult.originCoordinates)) {
      stopMetrics.push({
        coordinate: {
          latitude: searchResult.originCoordinates.latitude,
          longitude: searchResult.originCoordinates.longitude,
        },
        minimumTotalBusAccessTimeMinutes: 0,
        isOrigin: true,
      });
    }

    const cappedStopMetrics = stopMetrics.length > BODS_TIMETABLE_ZONE_MAX_METRICS_PER_BAND
      ? stopMetrics
        .sort((a, b) => Number(a.minimumTotalBusAccessTimeMinutes) - Number(b.minimumTotalBusAccessTimeMinutes))
        .slice(0, BODS_TIMETABLE_ZONE_MAX_METRICS_PER_BAND)
      : stopMetrics;
    const routeMetrics = buildBodsReachableRouteMetrics(cappedStopMetrics, bandSegments, bandTime);
    let rings = routeMetrics.length > stopMetrics.length
      ? buildBodsWholeZoneCatchmentRings(routeMetrics, searchResult.originCoordinates)
      : [];
    let geometryMode = rings.length > 0 ? "whole_zone_reachable_route_samples" : "none";
    let usedSparseGeometryFallback = false;

    if (rings.length === 0 && stopMetrics.length > 0) {
      rings = buildBodsWholeZoneCatchmentRings(stopMetrics, searchResult.originCoordinates);
      geometryMode = rings.length > 0 ? "whole_zone_stop_buffers" : "none";
      usedSparseGeometryFallback = false;
    }

    if (rings.length > 0) {
      outputs.push({
        geometry: { type: "MultiPolygon", coordinates: rings.map((ring) => [ring]) },
        label: band.label,
        color: band.fill,
        contour: bandTime,
        provider: "BODS timetable-based bus catchment",
        properties: {
          contour: bandTime,
          source: "BODS timetable-based bus catchment",
          sparseGeometryFallback: usedSparseGeometryFallback,
          geometryMode,
          estimatedRuntimeUsed: bandSegments.some((segment) => segment.estimatedRuntime),
          straightLineFallbackUsed: bandSegments.some((segment) => shouldUseStraightBodsStopToStopGeometry(segment) && !(Array.isArray(segment.routeGeometry) && segment.routeGeometry.length >= 2)),
          reachableSegmentCount: bandSegments.length,
          routeSampleCount: Math.max(0, routeMetrics.length - stopMetrics.length),
          guardedStraightLinkGeometry: bandSegments.some((segment) => segment.startCoordinate && segment.endCoordinate && !(Array.isArray(segment.routeGeometry) && segment.routeGeometry.length >= 2) && !shouldUseStraightBodsStopToStopGeometry(segment)),
          maxStraightStopLinkGeometryMetres: BODS_MAX_STRAIGHT_STOP_LINK_GEOMETRY_METRES,
          routeGeometryEndpointToleranceMetres: BODS_ROUTE_GEOMETRY_STOP_ENDPOINT_TOLERANCE_METRES,
          rejectedMismatchedRouteGeometryCount: bandSegments.filter(doesBodsSegmentHaveRejectedRouteGeometry).length,
          initialInterchangeRelaxationCount: searchResult.initialInterchangeRelaxationCount || 0,
          bodsWholeZoneBufferMetres: BODS_TIMETABLE_ZONE_BUFFER_METRES,
          bodsWholeZoneClusterLinkMetres: BODS_TIMETABLE_ZONE_CLUSTER_LINK_METRES,
          bodsWholeZoneOriginConnectedOnly: true,
          bodsJourneyChainOutput: true,
          bodsConnectivityConnectorMaxMetres: BODS_TIMETABLE_ZONE_CONNECTOR_MAX_METRES,
        },
      });
    }
  });
  outputs.sort((a, b) => Number(b.contour) - Number(a.contour));
  return outputs;
}


function buildBodsWholeZoneCatchmentRings(metrics, originCoordinates = null) {
  const coordinates = dedupeCoordinates(
    (metrics || [])
      .map((metric) => metric.coordinate)
      .filter((coordinate) => isValidCoordinateObject(coordinate)),
    5
  );

  if (coordinates.length === 0) {
    return [];
  }

  if (coordinates.length === 1) {
    return [smoothRing(buildCoordinateBufferRing(coordinates[0], BODS_TIMETABLE_ZONE_BUFFER_METRES, 28), BODS_TIMETABLE_ZONE_SMOOTHING_ITERATIONS)];
  }

  const clusters = clusterCoordinatesByDistance(coordinates, BODS_TIMETABLE_ZONE_CLUSTER_LINK_METRES);
  const originConnectedClusters = filterBodsOriginConnectedWholeZoneClusters(clusters, originCoordinates);
  const rings = [];
  originConnectedClusters.forEach((cluster) => {
    const ring = buildBodsWholeZoneRingForCluster(cluster);
    if (!ring || ring.length < 4) {
      return;
    }
    rings.push(ring);
  });

  return capPolygonRings(rings, 1);
}

function filterBodsOriginConnectedWholeZoneClusters(clusters, originCoordinates = null) {
  if (!Array.isArray(clusters) || clusters.length === 0) {
    return [];
  }
  if (!isValidCoordinateObject(originCoordinates)) {
    return clusters.slice(0, 1);
  }

  let bestCluster = null;
  let bestDistance = Infinity;
  clusters.forEach((cluster) => {
    const nearestDistance = getNearestCoordinateDistanceMetres(cluster, originCoordinates);
    if (Number.isFinite(nearestDistance) && nearestDistance < bestDistance) {
      bestDistance = nearestDistance;
      bestCluster = cluster;
    }
  });

  if (!bestCluster || bestDistance > BODS_TIMETABLE_ZONE_ORIGIN_COMPONENT_LINK_METRES) {
    return [];
  }

  return [bestCluster];
}

function getNearestCoordinateDistanceMetres(coordinates, referenceCoordinate) {
  if (!Array.isArray(coordinates) || !isValidCoordinateObject(referenceCoordinate)) {
    return Infinity;
  }
  let nearestDistance = Infinity;
  coordinates.forEach((coordinate) => {
    if (!isValidCoordinateObject(coordinate)) {
      return;
    }
    const distance = getDistanceMetres(referenceCoordinate.latitude, referenceCoordinate.longitude, coordinate.latitude, coordinate.longitude);
    if (Number.isFinite(distance) && distance < nearestDistance) {
      nearestDistance = distance;
    }
  });
  return nearestDistance;
}

function isValidCoordinateObject(coordinate) {
  return Boolean(coordinate)
    && Number.isFinite(Number(coordinate.latitude))
    && Number.isFinite(Number(coordinate.longitude));
}

function buildBodsWholeZoneRingForCluster(cluster) {
  const cleanCluster = dedupeCoordinates(
    (cluster || []).filter((coordinate) => coordinate && Number.isFinite(coordinate.latitude) && Number.isFinite(coordinate.longitude)),
    5
  );
  if (cleanCluster.length === 0) {
    return null;
  }
  if (cleanCluster.length === 1) {
    return smoothRing(buildCoordinateBufferRing(cleanCluster[0], BODS_TIMETABLE_ZONE_BUFFER_METRES, 28), BODS_TIMETABLE_ZONE_SMOOTHING_ITERATIONS);
  }

  const expandedPoints = buildExpandedCoordinateCloud(
    cleanCluster,
    BODS_TIMETABLE_ZONE_BUFFER_METRES,
    BUS_CARTO_HULL_POINT_SEGMENTS
  );
  const hullRing = buildRadialEnvelopeHull(expandedPoints, BODS_TIMETABLE_ZONE_RADIAL_BINS);
  if (!hullRing || hullRing.length < 4) {
    const start = cleanCluster[0];
    const end = cleanCluster[cleanCluster.length - 1];
    const segmentRing = buildBufferedRouteSegmentRing(start, end, BODS_TIMETABLE_ZONE_BUFFER_METRES);
    return segmentRing ? smoothRing(segmentRing, BODS_TIMETABLE_ZONE_SMOOTHING_ITERATIONS) : null;
  }
  return smoothRing(hullRing, BODS_TIMETABLE_ZONE_SMOOTHING_ITERATIONS);
}

function buildBodsReachableLinkCorridorRings(stopMetrics, reachableSegments, bandTime) {
  const rings = buildSparseBodsCatchmentRings(stopMetrics, reachableSegments, bandTime);
  return rings.filter((ring) => ring && ring.length >= 4);
}

function buildBodsReachableRouteMetrics(stopMetrics, reachableSegments, bandTime) {
  const metrics = [...stopMetrics];
  const seen = new Set();
  const addMetric = (coordinate, minutes, details = {}) => {
    if (metrics.length >= BODS_TIMETABLE_ZONE_MAX_METRICS_PER_BAND) {
      return;
    }
    if (!isValidCoordinateObject(coordinate)) {
      return;
    }
    const key = `${coordinate.latitude.toFixed(5)}|${coordinate.longitude.toFixed(5)}|${Math.round(Number(minutes) || 0)}|${details.source || "metric"}`;
    if (seen.has(key)) {
      return;
    }
    seen.add(key);
    metrics.push({
      coordinate: { latitude: coordinate.latitude, longitude: coordinate.longitude },
      minimumTotalBusAccessTimeMinutes: Math.min(Number(minutes) || bandTime, bandTime),
      ...details,
    });
  };

  reachableSegments
    .slice(0, BODS_TIMETABLE_ZONE_MAX_METRICS_PER_BAND)
    .forEach((segment) => {
    const routeCoordinates = getBodsReachableSegmentGeometryCoordinates(segment);
    const coordinates = routeCoordinates.length >= 2
      ? routeCoordinates
      : getBodsReachableSegmentConnectivityCoordinates(segment);
    if (coordinates.length < 2) {
      return;
    }
    const sampleSpacing = routeCoordinates.length >= 2 ? 260 : BODS_TIMETABLE_ZONE_CONNECTOR_SAMPLE_SPACING_METRES;
    sampleCoordinatePath(coordinates, sampleSpacing).forEach(({ coordinate, fraction }) => {
      const elapsed = interpolateBodsSegmentElapsedTime(segment, fraction, bandTime);
      addMetric(coordinate, elapsed, {
        source: routeCoordinates.length >= 2 ? "route_geometry" : "journey_chain_connector",
        routeRef: segment.routeRef || "",
        routeName: segment.routeName || "",
        tripId: segment.tripId || "",
      });
    });
  });

  return metrics;
}

function getBodsReachableSegmentConnectivityCoordinates(segment) {
  if (!segment?.startCoordinate || !segment?.endCoordinate) {
    return [];
  }
  const distance = getDistanceMetres(
    segment.startCoordinate.latitude,
    segment.startCoordinate.longitude,
    segment.endCoordinate.latitude,
    segment.endCoordinate.longitude
  );
  if (!Number.isFinite(distance) || distance <= 0 || distance > BODS_TIMETABLE_ZONE_CONNECTOR_MAX_METRES) {
    return [];
  }
  const elapsed = Number(segment.elapsedTimeAtEnd) - Number(segment.elapsedTimeAtStart);
  const impliedSpeedKph = Number.isFinite(Number(segment.impliedSpeedKph))
    ? Number(segment.impliedSpeedKph)
    : Number.isFinite(elapsed) && elapsed > 0
      ? (distance / 1000) / (elapsed / 60)
      : null;
  if (Number.isFinite(impliedSpeedKph) && impliedSpeedKph > BODS_TIMETABLE_ZONE_CONNECTOR_MAX_SPEED_KPH) {
    return [];
  }
  if (!isBodsJourneyChainOriginAnchored(segment)) {
    return [];
  }
  return [segment.startCoordinate, segment.endCoordinate];
}

function isBodsJourneyChainOriginAnchored(segment) {
  const chain = Array.isArray(segment?.journeyChain) ? segment.journeyChain : [];
  if (chain.length === 0) {
    return true;
  }
  return chain.some((step) => step.type === "initial_walk");
}

function getBodsReachableSegmentGeometryCoordinates(segment) {
  const routeGeometry = Array.isArray(segment?.routeGeometry)
    ? segment.routeGeometry.filter((coordinate) => coordinate && Number.isFinite(coordinate.latitude) && Number.isFinite(coordinate.longitude))
    : [];
  if (routeGeometry.length >= 2) {
    const alignedGeometry = getBodsRouteGeometryAlignedToStops(segment, routeGeometry);
    if (alignedGeometry.length >= 2) {
      return alignedGeometry;
    }
  }
  if (shouldUseStraightBodsStopToStopGeometry(segment)) {
    return [segment.startCoordinate, segment.endCoordinate];
  }
  return [];
}

function getBodsRouteGeometryAlignedToStops(segment, routeGeometry) {
  if (!segment?.startCoordinate || !segment?.endCoordinate || !Array.isArray(routeGeometry) || routeGeometry.length < 2) {
    return [];
  }
  const cleanGeometry = routeGeometry.filter((coordinate) => coordinate && Number.isFinite(coordinate.latitude) && Number.isFinite(coordinate.longitude));
  if (cleanGeometry.length < 2) {
    return [];
  }

  const first = cleanGeometry[0];
  const last = cleanGeometry[cleanGeometry.length - 1];
  const forwardStartDistance = getDistanceMetres(segment.startCoordinate.latitude, segment.startCoordinate.longitude, first.latitude, first.longitude);
  const forwardEndDistance = getDistanceMetres(segment.endCoordinate.latitude, segment.endCoordinate.longitude, last.latitude, last.longitude);
  const reverseStartDistance = getDistanceMetres(segment.startCoordinate.latitude, segment.startCoordinate.longitude, last.latitude, last.longitude);
  const reverseEndDistance = getDistanceMetres(segment.endCoordinate.latitude, segment.endCoordinate.longitude, first.latitude, first.longitude);
  const stopDistance = getDistanceMetres(
    segment.startCoordinate.latitude,
    segment.startCoordinate.longitude,
    segment.endCoordinate.latitude,
    segment.endCoordinate.longitude
  );
  const tolerance = getBodsRouteGeometryEndpointToleranceMetres(stopDistance);
  const forwardAligned = forwardStartDistance <= tolerance && forwardEndDistance <= tolerance;
  const reverseAligned = reverseStartDistance <= tolerance && reverseEndDistance <= tolerance;
  if (forwardAligned) {
    return anchorBodsGeometryToSegmentStops(cleanGeometry, segment);
  }
  if (reverseAligned) {
    return anchorBodsGeometryToSegmentStops([...cleanGeometry].reverse(), segment);
  }

  // Some TransXChange feeds attach a route shape/section geometry to a timing link where the
  // stop pair is not exactly at the first/last shape vertex. Requiring endpoint equality then
  // rejects valid in-corridor geometry and the output collapses back to stop buffers. Instead,
  // find the nearest shape vertices to the from/to stops, extract only that subpath, and reject
  // it if the stop pair is not actually on the geometry. This keeps valid curves while preventing
  // the remote Bury/Mossley fragments seen when unrelated route geometry was drawn wholesale.
  const subpath = extractBodsRouteGeometrySubpathBetweenStops(cleanGeometry, segment, tolerance);
  return subpath.length >= 2 ? subpath : [];
}

function anchorBodsGeometryToSegmentStops(geometry, segment) {
  const output = geometry.map((coordinate) => ({ latitude: coordinate.latitude, longitude: coordinate.longitude }));
  if (segment?.startCoordinate) {
    output.unshift({ latitude: segment.startCoordinate.latitude, longitude: segment.startCoordinate.longitude });
  }
  if (segment?.endCoordinate) {
    output.push({ latitude: segment.endCoordinate.latitude, longitude: segment.endCoordinate.longitude });
  }
  return dedupeCoordinates(output, 3);
}

function extractBodsRouteGeometrySubpathBetweenStops(routeGeometry, segment, tolerance) {
  const startMatch = findNearestBodsRouteGeometryVertex(routeGeometry, segment.startCoordinate);
  const endMatch = findNearestBodsRouteGeometryVertex(routeGeometry, segment.endCoordinate);
  if (!startMatch || !endMatch || startMatch.distance > tolerance || endMatch.distance > tolerance || startMatch.index === endMatch.index) {
    return [];
  }

  const increasing = startMatch.index < endMatch.index;
  const lowIndex = Math.min(startMatch.index, endMatch.index);
  const highIndex = Math.max(startMatch.index, endMatch.index);
  let subpath = routeGeometry.slice(lowIndex, highIndex + 1);
  if (!increasing) {
    subpath = subpath.reverse();
  }
  subpath = anchorBodsGeometryToSegmentStops(subpath, segment);

  const stopDistance = getDistanceMetres(
    segment.startCoordinate.latitude,
    segment.startCoordinate.longitude,
    segment.endCoordinate.latitude,
    segment.endCoordinate.longitude
  );
  const pathDistance = calculateCoordinatePathDistanceMetres(subpath);
  const maxReasonablePathDistance = getBodsMaxReasonableRouteSubpathDistanceMetres(stopDistance);
  if (!Number.isFinite(pathDistance) || pathDistance <= 0 || pathDistance > maxReasonablePathDistance) {
    return [];
  }
  return subpath;
}

function findNearestBodsRouteGeometryVertex(routeGeometry, coordinate) {
  if (!coordinate || !Number.isFinite(coordinate.latitude) || !Number.isFinite(coordinate.longitude)) {
    return null;
  }
  let best = null;
  routeGeometry.forEach((candidate, index) => {
    const distance = getDistanceMetres(coordinate.latitude, coordinate.longitude, candidate.latitude, candidate.longitude);
    if (Number.isFinite(distance) && (!best || distance < best.distance)) {
      best = { index, distance };
    }
  });
  return best;
}

function getBodsMaxReasonableRouteSubpathDistanceMetres(stopDistance) {
  if (!Number.isFinite(stopDistance) || stopDistance <= 0) {
    return 3500;
  }
  return Math.max(2500, Math.min(18000, stopDistance * 3.25 + 1800));
}

function getBodsRouteGeometryEndpointToleranceMetres(stopDistance) {
  const distanceBasedTolerance = Number.isFinite(stopDistance)
    ? stopDistance * BODS_ROUTE_GEOMETRY_STOP_ENDPOINT_RELATIVE_TOLERANCE
    : 0;
  return Math.max(250, Math.min(BODS_ROUTE_GEOMETRY_STOP_ENDPOINT_TOLERANCE_METRES, distanceBasedTolerance + 250));
}

function doesBodsSegmentHaveRejectedRouteGeometry(segment) {
  const routeGeometry = Array.isArray(segment?.routeGeometry)
    ? segment.routeGeometry.filter((coordinate) => coordinate && Number.isFinite(coordinate.latitude) && Number.isFinite(coordinate.longitude))
    : [];
  return routeGeometry.length >= 2 && getBodsRouteGeometryAlignedToStops(segment, routeGeometry).length < 2;
}

function shouldUseStraightBodsStopToStopGeometry(segment) {
  if (!segment?.startCoordinate || !segment?.endCoordinate) {
    return false;
  }
  const distance = getDistanceMetres(
    segment.startCoordinate.latitude,
    segment.startCoordinate.longitude,
    segment.endCoordinate.latitude,
    segment.endCoordinate.longitude
  );
  if (!Number.isFinite(distance) || distance <= 0) {
    return false;
  }

  // BODS TransXChange route geometry is often absent. Drawing a long raw stop-to-stop chord as
  // a corridor creates a misleading triangular/block catchment across open land. Use straight
  // geometry only for genuinely adjacent local bus-stop links; longer un-geometrised timetable
  // links are represented by their reachable stop buffers until route geometry is available.
  if (distance > BODS_MAX_STRAIGHT_STOP_LINK_GEOMETRY_METRES) {
    return false;
  }

  const impliedSpeedKph = Number(segment.impliedSpeedKph);
  if (Number.isFinite(impliedSpeedKph) && impliedSpeedKph > BODS_MAX_STRAIGHT_STOP_LINK_GEOMETRY_SPEED_KPH) {
    return false;
  }
  return true;
}

function interpolateBodsSegmentElapsedTime(segment, fraction, bandTime) {
  const start = Number(segment?.elapsedTimeAtStart);
  const end = Number(segment?.elapsedTimeAtEnd);
  if (Number.isFinite(start) && Number.isFinite(end)) {
    return start + (end - start) * Math.max(0, Math.min(1, Number(fraction) || 0));
  }
  return bandTime;
}

function sampleCoordinatePath(coordinates, spacingMetres = 260) {
  const cleanCoordinates = (coordinates || []).filter((coordinate) => coordinate && Number.isFinite(coordinate.latitude) && Number.isFinite(coordinate.longitude));
  if (cleanCoordinates.length === 0) {
    return [];
  }
  if (cleanCoordinates.length === 1) {
    return [{ coordinate: cleanCoordinates[0], fraction: 0 }];
  }
  const segmentLengths = [];
  let totalDistance = 0;
  for (let index = 1; index < cleanCoordinates.length; index += 1) {
    const distance = getDistanceMetres(cleanCoordinates[index - 1].latitude, cleanCoordinates[index - 1].longitude, cleanCoordinates[index].latitude, cleanCoordinates[index].longitude);
    const safeDistance = Number.isFinite(distance) && distance > 0 ? distance : 0;
    segmentLengths.push(safeDistance);
    totalDistance += safeDistance;
  }
  if (!Number.isFinite(totalDistance) || totalDistance <= 0) {
    return cleanCoordinates.map((coordinate, index) => ({ coordinate, fraction: index / Math.max(cleanCoordinates.length - 1, 1) }));
  }
  const samples = [{ coordinate: cleanCoordinates[0], fraction: 0 }];
  const sampleCount = Math.max(1, Math.min(80, Math.ceil(totalDistance / Math.max(60, spacingMetres))));
  for (let sampleIndex = 1; sampleIndex < sampleCount; sampleIndex += 1) {
    const targetDistance = (totalDistance * sampleIndex) / sampleCount;
    samples.push({ coordinate: interpolateCoordinateAlongPath(cleanCoordinates, segmentLengths, targetDistance), fraction: targetDistance / totalDistance });
  }
  samples.push({ coordinate: cleanCoordinates[cleanCoordinates.length - 1], fraction: 1 });
  return samples.filter((sample) => sample.coordinate);
}

function interpolateCoordinateAlongPath(coordinates, segmentLengths, targetDistance) {
  let travelled = 0;
  for (let index = 1; index < coordinates.length; index += 1) {
    const segmentLength = segmentLengths[index - 1] || 0;
    if (segmentLength <= 0) {
      continue;
    }
    if (travelled + segmentLength >= targetDistance) {
      const fraction = (targetDistance - travelled) / segmentLength;
      return interpolateCoordinate(coordinates[index - 1], coordinates[index], fraction);
    }
    travelled += segmentLength;
  }
  return coordinates[coordinates.length - 1];
}

function buildSparseBodsCatchmentRings(metrics, reachableSegments, bandTime) {
  const radiusMetres = Math.max(90, Math.min(180, BODS_ROUTE_CORRIDOR_BUFFER_METRES, BUS_CARTO_EFFECTIVE_BUFFER_METRES));
  const rings = [];
  reachableSegments
    .filter((segment) => segment.elapsedTimeAtEnd <= bandTime)
    .forEach((segment) => {
      const coordinates = getBodsReachableSegmentGeometryCoordinates(segment);
      if (coordinates.length >= 2) {
        buildBufferedRouteGeometryRings(coordinates, radiusMetres).forEach((ring) => {
          if (rings.length < BUS_ROUTE_MAX_BUFFERS_PER_BAND) {
            rings.push(ring);
          }
        });
        return;
      }
      if (rings.length < BUS_ROUTE_MAX_BUFFERS_PER_BAND && segment.startCoordinate) {
        rings.push(buildCoordinateBufferRing(segment.startCoordinate, radiusMetres, 16));
      }
      if (rings.length < BUS_ROUTE_MAX_BUFFERS_PER_BAND && segment.endCoordinate) {
        rings.push(buildCoordinateBufferRing(segment.endCoordinate, radiusMetres, 16));
      }
    });

  if (rings.length === 0) {
    dedupeCoordinates(
      metrics
        .map((metric) => metric.coordinate)
        .filter((coordinate) => coordinate && Number.isFinite(coordinate.latitude) && Number.isFinite(coordinate.longitude)),
      5
    ).forEach((coordinate) => {
      if (rings.length < BUS_ROUTE_MAX_BUFFERS_PER_BAND) {
        rings.push(buildCoordinateBufferRing(coordinate, radiusMetres, 16));
      }
    });
  }

  return capPolygonRings(rings.filter((ring) => ring && ring.length >= 4), BUS_ROUTE_MAX_BUFFERS_PER_BAND);
}

function clipBodsReachableSegmentToBand(segment, bandTime) {
  if (!segment || !Number.isFinite(Number(bandTime)) || !Number.isFinite(segment.elapsedTimeAtStart)) {
    return null;
  }
  if (segment.elapsedTimeAtStart > bandTime) {
    return null;
  }
  if (segment.elapsedTimeAtEnd <= bandTime) {
    return segment;
  }
  const duration = segment.elapsedTimeAtEnd - segment.elapsedTimeAtStart;
  if (!Number.isFinite(duration) || duration <= 0) {
    return null;
  }
  const fraction = Math.max(0, Math.min(1, (bandTime - segment.elapsedTimeAtStart) / duration));
  const clippedGeometry = clipBodsRouteGeometryByFraction(segment, fraction);
  const clippedEndCoordinate = clippedGeometry.length
    ? clippedGeometry[clippedGeometry.length - 1]
    : interpolateCoordinate(segment.startCoordinate, segment.endCoordinate, fraction);
  if (!clippedEndCoordinate) {
    return null;
  }
  return {
    ...segment,
    coordinate: clippedEndCoordinate,
    endCoordinate: clippedEndCoordinate,
    elapsedTimeAtEnd: bandTime,
    routeGeometry: clippedGeometry,
    geometrySource: clippedGeometry.length >= 2 ? segment.geometrySource || "parsed_route_geometry" : "stop_buffer",
    clippedAtBandEdge: true,
  };
}

function clipBodsRouteGeometryByFraction(segment, fraction) {
  const geometry = Array.isArray(segment.routeGeometry) && segment.routeGeometry.length >= 2
    ? segment.routeGeometry
    : [];
  if (geometry.length < 2 || !Number.isFinite(fraction) || fraction <= 0) {
    return [];
  }
  if (fraction >= 1) {
    return geometry.map((coordinate) => ({ latitude: coordinate.latitude, longitude: coordinate.longitude }));
  }
  const totalDistance = calculateCoordinatePathDistanceMetres(geometry);
  if (!Number.isFinite(totalDistance) || totalDistance <= 0) {
    const interpolated = interpolateCoordinate(geometry[0], geometry[geometry.length - 1], fraction);
    return interpolated ? [geometry[0], interpolated] : [geometry[0]];
  }
  const targetDistance = totalDistance * fraction;
  const output = [{ latitude: geometry[0].latitude, longitude: geometry[0].longitude }];
  let travelled = 0;
  for (let index = 1; index < geometry.length; index += 1) {
    const previous = geometry[index - 1];
    const current = geometry[index];
    const segmentDistance = getDistanceMetres(previous.latitude, previous.longitude, current.latitude, current.longitude);
    if (!Number.isFinite(segmentDistance) || segmentDistance <= 0) {
      continue;
    }
    if (travelled + segmentDistance >= targetDistance) {
      const segmentFraction = (targetDistance - travelled) / segmentDistance;
      const interpolated = interpolateCoordinate(previous, current, segmentFraction);
      if (interpolated) {
        output.push(interpolated);
      }
      return output;
    }
    output.push({ latitude: current.latitude, longitude: current.longitude });
    travelled += segmentDistance;
  }
  return output;
}

function interpolateCoordinate(startCoordinate, endCoordinate, fraction) {
  if (!startCoordinate || !endCoordinate || !Number.isFinite(fraction)) {
    return null;
  }
  return {
    latitude: startCoordinate.latitude + (endCoordinate.latitude - startCoordinate.latitude) * fraction,
    longitude: startCoordinate.longitude + (endCoordinate.longitude - startCoordinate.longitude) * fraction,
  };
}

function buildBufferedRouteGeometryRings(routeGeometry, radiusMetres) {
  const rings = [];
  for (let index = 1; index < routeGeometry.length; index += 1) {
    const segmentRing = buildBufferedRouteSegmentRing(routeGeometry[index - 1], routeGeometry[index], radiusMetres);
    if (segmentRing && segmentRing.length >= 4) {
      rings.push(segmentRing);
    }
    if (rings.length >= BUS_ROUTE_MAX_BUFFERS_PER_BAND) {
      break;
    }
  }
  return rings;
}

function getBodsSparseGeometryMode(segments, metrics) {
  if (segments.some((segment) => Array.isArray(segment.routeGeometry) && segment.routeGeometry.length >= 2)) {
    return "parsed_route_geometry";
  }
  return metrics.length > 0 || segments.length > 0 ? "stop_buffers" : "none";
}

function summariseBodsOutputGeometryModes(isochrones = []) {
  const modes = new Set();
  let estimatedRuntimeUsed = false;
  let straightLineFallbackUsed = false;
  isochrones.forEach((isochrone) => {
    const properties = isochrone?.properties || {};
    if (properties.geometryMode) {
      modes.add(properties.geometryMode);
    }
    if (properties.estimatedRuntimeUsed) {
      estimatedRuntimeUsed = true;
    }
    if (properties.straightLineFallbackUsed) {
      straightLineFallbackUsed = true;
    }
  });
  return {
    modes: Array.from(modes),
    estimatedRuntimeUsed,
    straightLineFallbackUsed,
  };
}

function buildBodsTimetableSourceNote(metadata = {}) {
  const dateText = metadata.departureDate ? ` Departure date: ${metadata.departureDate}.` : "";
  const timeText = metadata.departureTime ? ` Departure time: ${metadata.departureTime}.` : "";
  const datasetText = Number.isFinite(Number(metadata.datasetCount)) ? ` Parsed ${metadata.datasetCount} BODS dataset${Number(metadata.datasetCount) === 1 ? "" : "s"} / ${metadata.parsedXmlFileCount || 0} TransXChange file${Number(metadata.parsedXmlFileCount || 0) === 1 ? "" : "s"}.` : "";
  const selectedQuerySpecs = Array.isArray(metadata.bodsSelectedQuerySpecs) && metadata.bodsSelectedQuerySpecs.length
    ? metadata.bodsSelectedQuerySpecs
    : (metadata.bodsSelectedQuerySpec ? [metadata.bodsSelectedQuerySpec] : []);
  const selectedQuerySpecText = selectedQuerySpecs.length
    ? ` Selected BODS query specs: ${selectedQuerySpecs.slice(0, 8).map(formatBodsQuerySpecForMethodNote).join("; ")}${selectedQuerySpecs.length > 8 ? "; ..." : ""}.`
    : "";
  const localDatasetText = Number.isFinite(Number(metadata.bodsLocalDatasetCount))
    ? ` Local usable BODS datasets merged: ${Number(metadata.bodsLocalDatasetCount).toLocaleString("en-GB")}${Number.isFinite(Number(metadata.bodsRealLocalStopCount)) ? `; real local parsed stop references near the origin: ${Number(metadata.bodsRealLocalStopCount).toLocaleString("en-GB")}` : ""}.`
    : "";
  const stopText = Number.isFinite(Number(metadata.stopCount)) ? ` Timetable graph: ${Number(metadata.stopCount).toLocaleString("en-GB")} stops and ${Number(metadata.connectionCount || 0).toLocaleString("en-GB")} scheduled stop-to-stop connections.` : "";
  const reachabilityText = Number.isFinite(Number(metadata.reachableStopCount)) || Number.isFinite(Number(metadata.reachableConnectionCount))
    ? ` Timetable reachability: ${Number(metadata.initialStopCount || 0).toLocaleString("en-GB")} initial boarding stop${Number(metadata.initialStopCount || 0) === 1 ? "" : "s"}; ${Number(metadata.consideredConnectionCount || 0).toLocaleString("en-GB")} scheduled connection${Number(metadata.consideredConnectionCount || 0) === 1 ? "" : "s"} considered after the selected time; ${Number(metadata.reachableStopCount || 0).toLocaleString("en-GB")} stop${Number(metadata.reachableStopCount || 0) === 1 ? "" : "s"} and ${Number(metadata.reachableConnectionCount || 0).toLocaleString("en-GB")} connection${Number(metadata.reachableConnectionCount || 0) === 1 ? "" : "s"} reachable within the configured bands.`
    : "";
  const coordinateText = Number.isFinite(Number(metadata.bodsStopReferenceCount))
    ? ` Stop-coordinate parsing: ${Number(metadata.bodsStopReferenceCount).toLocaleString("en-GB")} stop reference${Number(metadata.bodsStopReferenceCount) === 1 ? "" : "s"} found; ${Number(metadata.bodsDirectCoordinateStopCount || 0).toLocaleString("en-GB")} with embedded stop coordinates; ${Number(metadata.bodsRouteLinkCoordinateStopCount || 0).toLocaleString("en-GB")} resolved from in-file route geometry; ${Number(metadata.bodsEnrichedCoordinateStopCount || 0).toLocaleString("en-GB")} resolved through stop-reference enrichment; ${Number(metadata.bodsUnresolvedCoordinateStopCount || 0).toLocaleString("en-GB")} unresolved.`
    : "";
  const speedStats = metadata.bodsImpliedSpeedStats || {};
  const speedText = Number.isFinite(Number(metadata.bodsParsedRuntimeConnectionCount)) || Number.isFinite(Number(metadata.bodsEstimatedRuntimeConnectionCount)) || Number.isFinite(Number(metadata.bodsRejectedImplausibleConnectionCount))
    ? ` Runtime quality: ${Number(metadata.bodsParsedRuntimeConnectionCount || 0).toLocaleString("en-GB")} links used parsed TransXChange runtimes; ${Number(metadata.bodsEstimatedRuntimeConnectionCount || 0).toLocaleString("en-GB")} used conservative estimated runtimes; ${Number(metadata.bodsRejectedImplausibleConnectionCount || 0).toLocaleString("en-GB")} links were rejected for implausible implied speed${Number.isFinite(Number(speedStats.min)) ? `; implied speed min/median/max ${formatBodsSpeedKph(speedStats.min)} / ${formatBodsSpeedKph(speedStats.median)} / ${formatBodsSpeedKph(speedStats.max)} kph` : ""}.`
    : "";
  const geometrySummary = metadata.bodsOutputGeometryModes || {};
  const geometryModes = Array.isArray(geometrySummary.modes) && geometrySummary.modes.length ? geometrySummary.modes : [];
  const geometryText = geometryModes.length
    ? ` Output geometry uses ${geometryModes.map(formatBodsGeometryMode).join(", ")}.`
    : "";
  const routeAuditText = metadata.bodsReachableRouteSummary?.top_routes?.length
    ? ` Reachable route audit: ${metadata.bodsReachableRouteSummary.top_routes.slice(0, 8).map(formatBodsReachableRouteForMethodNote).join("; ")}.`
    : "";
  const targetAuditText = metadata.bodsTargetPlaceDiagnostics?.length
    ? ` Target-place audit: ${metadata.bodsTargetPlaceDiagnostics.slice(0, 8).map(formatBodsTargetPlaceForMethodNote).join("; ")}.`
    : "";
  const precisionWarningText = geometrySummary.straightLineFallbackUsed || geometrySummary.estimatedRuntimeUsed || Number(metadata.bodsEstimatedRuntimeConnectionCount || 0) > 0
    ? " Warning: some timetable links use estimated runtimes or fallback geometry; treat the catchment as an indicative scheduled-accessibility output rather than a precise timetable-based route catchment."
    : "";
  const walkText = Number.isFinite(Number(metadata.maximumWalkToBusStopMetres)) ? ` Initial boarding stops are limited to ${Math.round(metadata.maximumWalkToBusStopMetres).toLocaleString("en-GB")} m estimated walking access from the selected origin; transfer walks are limited to ${Math.round(metadata.transferWalkRadiusMetres || BODS_TRANSFER_RADIUS_METRES).toLocaleString("en-GB")} m.` : "";
  const warningText = metadata.timetableWarnings?.length ? ` Warnings: ${metadata.timetableWarnings.slice(0, 3).join(" | ")}.` : "";
  return `Bus catchments are timetable-based outputs generated from Bus Open Data Service timetable datasets where TransXChange stop times can be parsed in-browser. Initial and transfer walking times use straight-line distance multiplied by a 1.3 detour factor and an assumed walking speed of 4.8 kph / 80 m per minute. Scheduled waiting time and bus in-vehicle running time use BODS scheduled stop times where parsed successfully. The outputs do not include live disruption, reliability, crowding, cancellations, fare integration or fare data.${dateText}${timeText}${walkText}${selectedQuerySpecText}${localDatasetText}${datasetText}${stopText}${reachabilityText}${coordinateText}${speedText}${geometryText}${routeAuditText}${targetAuditText}${precisionWarningText}${warningText}`;
}

function formatBodsQuerySpecForMethodNote(querySpec = {}) {
  const value = querySpec.value || querySpec.key || querySpec.kind || "query";
  return `${querySpec.kind || "query"}=${value}`;
}

function formatBodsSpeedKph(value) {
  return Number.isFinite(Number(value)) ? Number(value).toFixed(1) : "n/a";
}

function formatBodsReachableRouteForMethodNote(route = {}) {
  const name = [route.route_ref, route.route_name].filter(Boolean).join(" ").trim() || route.route_id || "route";
  const last = Number.isFinite(Number(route.last_reached_minute)) ? `${route.last_reached_minute} min` : "n/a";
  return `${name} (${route.reachable_segment_count || 0} links, to ${last})`;
}

function formatBodsTargetPlaceForMethodNote(target = {}) {
  const status = Number(target.reachable_matching_stop_count || 0) > 0
    ? `reachable at ${target.minimum_elapsed_minutes} min`
    : Number(target.parsed_matching_stop_count || 0) > 0
      ? "parsed but not reachable"
      : "not parsed";
  return `${target.target_name}: ${status}`;
}

function formatBodsGeometryMode(mode) {
  if (mode === "parsed_route_geometry") {
    return "parsed TransXChange route geometry";
  }
  if (mode === "stop_buffers" || mode === "smoothed_stop_buffers") {
    return "stop-based buffers";
  }
  if (mode === "whole_zone_reachable_route_samples") {
    return "whole-zone reachable timetable route samples";
  }
  if (mode === "whole_zone_stop_buffers") {
    return "whole-zone stop-based buffers";
  }
  if (mode === "straight_line_fallback") {
    return "straight-line fallback";
  }
  return String(mode).replace(/_/g, " ");
}


function getBusComputationDeadlineMs(startedAt = performance.now(), budgetMs = 90000) {
  return startedAt + budgetMs;
}

function throwIfBusComputationDeadlineExceeded(deadlineMs, stage = "bus calculation") {
  if (!Number.isFinite(deadlineMs) || performance.now() <= deadlineMs) {
    return;
  }
  throw createServiceError(
    OSM_BUS_ROUTE_SERVICE_NAME,
    "api_outage",
    `OpenStreetMap bus route data did not complete quickly enough during ${stage}. Switch to BODS timetable mode for planning outputs or retry OSM corridor mode later.`
  );
}

async function fetchOsmIndicativeBusRouteIsochronesForScenario(originCoordinates, options = {}) {
  const timing = startBusTiming("bus isochrone generation", { originCoordinates });
  const computationDeadlineMs = getBusComputationDeadlineMs(performance.now(), 90000);
  const configuredBands = getConfiguredBandsForMode("bus")
    .filter((band) => Number.isFinite(Number(band.time)) && Number(band.time) > 0)
    .sort((a, b) => Number(a.time) - Number(b.time));

  if (configuredBands.length === 0) {
    throw createServiceError(
      OSM_BUS_ROUTE_SERVICE_NAME,
      "malformed_request",
      "No valid bus catchment thresholds are configured."
    );
  }

  const maximumBandMinutes = getMaximumBusBandMinutes(configuredBands);
  const maximumWalkToBusStopMetres = getSelectedBusMaxWalkToStopMetres();
  if (!Number.isFinite(maximumWalkToBusStopMetres) || maximumWalkToBusStopMetres <= 0) {
    throw createServiceError(
      OSM_BUS_ROUTE_SERVICE_NAME,
      "malformed_request",
      getBusMaxWalkValidationMessage() || "Enter a valid maximum walk-to-bus-stop distance."
    );
  }
  const stopSearchRadiusMetres = getBusStopSearchRadiusMetres(maximumWalkToBusStopMetres);
  const busSpeedSettings = getSelectedBusSpeedSettings();
  const busSpeedKph = busSpeedSettings.flatSpeedKph;
  if (!Number.isFinite(busSpeedKph) || busSpeedKph <= 0) {
    throw createServiceError(
      OSM_BUS_ROUTE_SERVICE_NAME,
      "malformed_request",
      getBusSpeedValidationMessage() || "Enter a valid average bus speed."
    );
  }

  const resultCacheKey = buildBusIsochroneCacheKey(
    originCoordinates,
    configuredBands,
    busSpeedSettings,
    stopSearchRadiusMetres,
    maximumBandMinutes,
    maximumWalkToBusStopMetres
  );
  const cachedIsochrones = getMapCacheEntry(BUS_ISOCHRONE_RESULT_CACHE, resultCacheKey, cloneBusIsochroneResult);
  if (cachedIsochrones) {
    endBusTiming(timing, { cache: "isochrone-result-hit", bandCount: cachedIsochrones.length });
    return cachedIsochrones;
  }

  setStatus(
    "Generating bus route catchments",
    `Searching for bus stops within ${Math.round(maximumWalkToBusStopMetres).toLocaleString("en-GB")} m walking access, then fetching mapped OpenStreetMap bus route geometry. Large catchments can still take several minutes on public Overpass mirrors.`,
    "running"
  );
  render();

  const payloadTiming = startBusTiming("bus route payload");
  const payload = await fetchOsmBusRouteRelationPayload(originCoordinates, options, {
    maximumBandMinutes,
    stopSearchRadiusMetres,
    maximumWalkToBusStopMetres,
    computationDeadlineMs,
  });
  throwIfBusComputationDeadlineExceeded(computationDeadlineMs, "route lookup");
  endBusTiming(payloadTiming, { elementCount: payload?.elements?.length ?? 0 });
  setStatus(
    "Calculating bus stop access",
    "Calculating pedestrian access time to each usable boarding stop before applying remaining in-vehicle bus time.",
    "running"
  );
  render();
  const accessTiming = startBusTiming("bus accessible route extraction");
  const accessibleRouteResult = await extractAccessibleOsmBusRoutes(payload, originCoordinates, options, {
    maximumBandMinutes,
    stopSearchRadiusMetres,
    maximumWalkToBusStopMetres,
    computationDeadlineMs,
  });
  throwIfBusComputationDeadlineExceeded(computationDeadlineMs, "walk access filtering");
  const accessibleRoutes = accessibleRouteResult.routes;
  const accessDiagnostics = accessibleRouteResult.accessDiagnostics;
  endBusTiming(accessTiming, { routeCount: accessibleRoutes.length, ...accessDiagnostics });

  if (accessibleRoutes.length === 0) {
    throw createServiceError(
      OSM_BUS_ROUTE_SERVICE_NAME,
      "unavailable_routing_data",
      `No mapped bus route relations serving bus stops within ${Math.round(maximumWalkToBusStopMetres).toLocaleString("en-GB")} m walking access of the selected origin were found.`
    );
  }

  setStatus(
    "Generating bus polygons",
    "Building indicative bus route corridor polygons from reachable mapped route sections.",
    "running"
  );
  render();
  const polygonTiming = startBusTiming("bus polygon generation", { routeCount: accessibleRoutes.length });
  const isochrones = await buildIndicativeBusIsochronesFromRoutes(
    accessibleRoutes,
    configuredBands,
    busSpeedSettings,
    { computationDeadlineMs }
  );
  endBusTiming(polygonTiming, { bandCount: isochrones.length });

  if (isochrones.length === 0) {
    throw createServiceError(
      OSM_BUS_ROUTE_SERVICE_NAME,
      "unavailable_routing_data",
      "Mapped bus routes and walk-accessible boarding stops were found, but no route sections were reachable within the configured total time bands."
    );
  }

  isochrones.metadata = {
    provider: "OpenStreetMap bus route corridor catchment",
    mode: "indicative_bus_route_corridor_with_walk_access",
    method: busSpeedSettings.mode === BUS_SPEED_MODEL_ROAD_TYPE ? "mapped OSM bus route relations plus pedestrian access to boarding stop plus OSM road-type weighted in-vehicle bus speeds; no waiting time or interchanges" : "mapped OSM bus route relations plus pedestrian access to boarding stop plus selected flat average in-vehicle bus speed; no waiting time or interchanges",
    routeCount: accessibleRoutes.length,
    bandCount: isochrones.length,
    busSpeedKph,
    busSpeedMph: busSpeedKph / MPH_TO_KPH,
    busSpeedModel: busSpeedSettings.mode,
    busSpeedModelLabel: getBusSpeedModelLabel(busSpeedSettings.mode),
    roadTypeSpeedProfileKph: busSpeedSettings.mode === BUS_SPEED_MODEL_ROAD_TYPE ? { ...BUS_ROAD_TYPE_SPEED_KPH, unknown: busSpeedKph } : undefined,
    roadTypeSpeedDiagnostics: isochrones.speedDiagnostics,
    accessWalkSpeedKph: BUS_ACCESS_WALK_SPEED_KPH,
    maximumBandMinutes,
    stopSearchRadiusMetres,
    maximumWalkToBusStopMetres,
    destinationBufferMetres: BUS_DESTINATION_BUFFER_METRES,
    ...accessDiagnostics,
    routeRelationCap: BUS_ROUTE_MAX_RELATIONS,
    ...summariseBusAccessMetadata(accessibleRoutes),
    caveat: "Indicative only. Eligible boarding stops are limited by the selected maximum walk-to-bus-stop distance. Each band includes pedestrian access to the boarding stop first, then applies only the remaining band time to in-vehicle bus travel. Road-type weighted mode uses OSM way highway classifications where available, with fallback speeds where way tags are missing. Does not include timetable availability, service frequency, waiting time, interchanges, disruption or live running data.",
  };
  setMapCacheEntry(BUS_ISOCHRONE_RESULT_CACHE, resultCacheKey, isochrones, cloneBusIsochroneResult);
  endBusTiming(timing, { cache: "miss", routeCount: accessibleRoutes.length, bandCount: isochrones.length });
  return isochrones;
}

async function fetchOsmBusRouteRelationPayload(originCoordinates, options = {}, context = {}) {
  const maximumBandMinutes = Number(context.maximumBandMinutes) || getMaximumBusBandMinutes();
  const computationDeadlineMs = context.computationDeadlineMs;
  const maximumWalkToBusStopMetres = Number(context.maximumWalkToBusStopMetres) || getSelectedBusMaxWalkToStopMetres() || BUS_MAX_WALK_TO_STOP_DEFAULT_METRES;
  const stopSearchRadiusMetres = Number(context.stopSearchRadiusMetres) || getBusStopSearchRadiusMetres(maximumWalkToBusStopMetres);
  const cacheKey = buildBusOriginCacheKey(originCoordinates, stopSearchRadiusMetres, maximumBandMinutes, maximumWalkToBusStopMetres);
  const cachedPayload = getMapCacheEntry(BUS_RELATION_PAYLOAD_CACHE, cacheKey, clonePlainValue);
  if (cachedPayload) {
    return cachedPayload;
  }
  const indexQueries = [
    { query: buildOsmBusRouteStopRelationIndexQuery(originCoordinates, stopSearchRadiusMetres), timeoutMs: 35000, source: "stop-relation lookup" },
    { query: buildOsmBusRouteNearbyRelationIndexQuery(originCoordinates, stopSearchRadiusMetres), timeoutMs: 35000, source: "nearby-route lookup" },
  ];
  const relationCandidateById = new Map();
  const indexElements = [];
  let lastError = null;
  let lastIndexPayload = null;

  for (const { query, timeoutMs, source } of indexQueries) {
    throwIfBusComputationDeadlineExceeded(computationDeadlineMs, source);
    setStatus(
      source === "stop-relation lookup" ? "Loading bus stops" : "Loading nearby bus routes",
      source === "stop-relation lookup"
        ? "Querying mapped bus stops and their route relations from OpenStreetMap."
        : "Checking nearby mapped bus route relations for incomplete stop membership.",
      "running"
    );
    render();
    try {
      const indexPayload = await fetchOsmBusRouteOverpassPayload(query, options, timeoutMs);
      lastIndexPayload = indexPayload;
      indexElements.push(...(indexPayload?.elements ?? []));
      extractOsmBusRouteCandidates(indexPayload, originCoordinates, source).forEach((candidate) => {
        const existing = relationCandidateById.get(candidate.id);
        if (!existing || candidate.score < existing.score) {
          relationCandidateById.set(candidate.id, candidate);
        }
      });
    } catch (error) {
      if (error?.kind === "cancelled") {
        throw error;
      }
      lastError = error;
    }
  }

  const allCandidates = Array.from(relationCandidateById.values());
  const selectedCandidates = selectBalancedOsmBusRouteCandidates(
    allCandidates,
    getBusRouteCandidateCap(allCandidates)
  );
  logBusCandidateSelectionDiagnostics(
    allCandidates,
    selectedCandidates,
    {
      originCoordinates,
      stopSearchRadiusMetres,
      maximumBandMinutes,
      maximumWalkToBusStopMetres,
    }
  );
  const relationIds = selectedCandidates.map((candidate) => candidate.id);

  if (relationIds.length === 0) {
    if (lastIndexPayload) {
      return lastIndexPayload;
    }
    throw lastError || createServiceError(
      OSM_BUS_ROUTE_SERVICE_NAME,
      "unavailable_routing_data",
      "No mapped bus route relation IDs could be returned for the selected location."
    );
  }

  setStatus(
    "Bus route geometry found",
    `Found ${relationIds.length} candidate mapped bus route relation${relationIds.length === 1 ? "" : "s"}. Fetching route geometry from public Overpass mirrors.`,
    "running"
  );
  render();

  throwIfBusComputationDeadlineExceeded(computationDeadlineMs, "before route geometry");
  const geometryPayload = await fetchOsmBusRouteGeometryPayloadInChunks(relationIds, options, { computationDeadlineMs });
  const mergedPayload = { elements: dedupeOverpassElements([...(geometryPayload?.elements ?? []), ...indexElements]) };
  if (payloadHasUsableBusRouteGeometry(mergedPayload)) {
    setMapCacheEntry(BUS_RELATION_PAYLOAD_CACHE, cacheKey, mergedPayload, clonePlainValue);
    return mergedPayload;
  }

  throw createServiceError(
    OSM_BUS_ROUTE_SERVICE_NAME,
    "unavailable_routing_data",
    "Mapped bus route IDs were found, but usable route geometry could not be returned before the request timed out."
  );
}

async function fetchOsmBusRouteGeometryPayloadInChunks(relationIds, options = {}, context = {}) {
  const timing = startBusTiming("bus route geometry load", { relationCount: relationIds.length });
  const mergedElements = [];
  let lastError = null;
  const missingRelationIds = [];
  let cacheHitCount = 0;

  relationIds.forEach((relationId) => {
    const cachedRelationPayload = BUS_RELATION_GEOMETRY_CACHE.get(Number(relationId));
    if (cachedRelationPayload) {
      if (Array.isArray(cachedRelationPayload)) {
        mergedElements.push(...clonePlainValue(cachedRelationPayload));
      } else {
        mergedElements.push(clonePlainValue(cachedRelationPayload));
      }
      cacheHitCount += 1;
    } else {
      missingRelationIds.push(Number(relationId));
    }
  });

  const initialBatches = chunkArray(missingRelationIds, BUS_ROUTE_GEOMETRY_INITIAL_CHUNK_SIZE);
  logBusGeometryDiagnostics("cache summary", {
    relationCount: relationIds.length,
    cacheHitCount,
    cacheMissCount: missingRelationIds.length,
    initialBatchCount: initialBatches.length,
    initialChunkSize: BUS_ROUTE_GEOMETRY_INITIAL_CHUNK_SIZE,
    minChunkSize: BUS_ROUTE_GEOMETRY_MIN_CHUNK_SIZE,
    concurrency: BUS_ROUTE_GEOMETRY_CONCURRENCY,
  });

  if (missingRelationIds.length > 0) {
    setStatus(
      "Loading bus route geometry",
      `Using ${cacheHitCount} cached route geometries and fetching ${missingRelationIds.length} missing relation${missingRelationIds.length === 1 ? "" : "s"} in ${initialBatches.length} adaptive batch${initialBatches.length === 1 ? "" : "es"}.`,
      "running"
    );
    render();
  }

  let completedInitialBatches = 0;
  let nextBatchSequence = 1;
  const queue = initialBatches.map((relationChunk, index) => ({
    relationChunk,
    depth: 0,
    label: `${index + 1}/${initialBatches.length}`,
  }));

  async function runGeometryWorker() {
    while (queue.length > 0) {
      const job = queue.shift();
      const batchSequence = nextBatchSequence;
      nextBatchSequence += 1;
      try {
        throwIfBusComputationDeadlineExceeded(context.computationDeadlineMs, "route geometry batch queue");
        const chunkElements = await fetchOsmBusRouteGeometryChunkWithFallback(
          job.relationChunk,
          options,
          {
            depth: job.depth,
            label: job.label,
            batchSequence,
            computationDeadlineMs: context.computationDeadlineMs,
          }
        );
        mergedElements.push(...chunkElements);
      } catch (error) {
        if (error?.kind === "cancelled") {
          throw error;
        }
        lastError = error;
      } finally {
        if (job.depth === 0) {
          completedInitialBatches += 1;
          setStatus(
            "Loading bus route geometry",
            `Loaded bus route geometry batch ${completedInitialBatches} of ${initialBatches.length}. ${cacheHitCount} relation${cacheHitCount === 1 ? "" : "s"} reused from cache.`,
            "running"
          );
          render();
          await yieldToBrowser();
        }
      }
    }
  }

  const workerCount = Math.min(BUS_ROUTE_GEOMETRY_CONCURRENCY, queue.length);
  if (workerCount > 0) {
    await Promise.all(Array.from({ length: workerCount }, () => runGeometryWorker()));
  }

  if (mergedElements.length === 0 && lastError) {
    endBusTiming(timing, {
      cacheHitCount,
      cacheMissCount: missingRelationIds.length,
      failed: true,
    });
    throw lastError;
  }

  endBusTiming(timing, {
    cacheHitCount,
    cacheMissCount: missingRelationIds.length,
    elementCount: mergedElements.length,
  });
  return { elements: dedupeOverpassElements(mergedElements) };
}

async function fetchOsmBusRouteGeometryChunkWithFallback(relationChunk, options = {}, context = {}) {
  throwIfBusComputationDeadlineExceeded(context.computationDeadlineMs, "route geometry download");
  if (relationChunk.length === 0) {
    return [];
  }

  const timing = startBusTiming("bus route geometry batch", {
    relationCount: relationChunk.length,
    relationIds: relationChunk,
    depth: context.depth ?? 0,
    label: context.label,
    batchSequence: context.batchSequence,
  });
  setStatus(
    "Loading bus route geometry",
    `Fetching route geometry batch ${context.label ?? context.batchSequence} (${relationChunk.length} relation${relationChunk.length === 1 ? "" : "s"}).`,
    "running"
  );
  render();
  await yieldToBrowser();

  try {
    const chunkPayload = await fetchOsmBusRouteOverpassPayload(
      buildOsmBusRouteGeometryQuery(relationChunk),
      options,
      45000
    );
    const elements = chunkPayload?.elements ?? [];
    cacheBusRelationGeometryElements(elements);
    endBusTiming(timing, { status: "success", elementCount: elements.length });
    logBusGeometryDiagnostics("batch success", {
      relationCount: relationChunk.length,
      relationIds: relationChunk,
      depth: context.depth ?? 0,
      elementCount: elements.length,
    });
    return elements;
  } catch (error) {
    if (error?.kind === "cancelled") {
      throw error;
    }
    endBusTiming(timing, { status: "failed", message: error?.message || String(error) });
    logBusGeometryDiagnostics("batch failed", {
      relationCount: relationChunk.length,
      relationIds: relationChunk,
      depth: context.depth ?? 0,
      message: error?.message || String(error),
    });

    if (relationChunk.length <= BUS_ROUTE_GEOMETRY_MIN_CHUNK_SIZE) {
      throw error;
    }

    const nextChunkSize = Math.max(
      BUS_ROUTE_GEOMETRY_MIN_CHUNK_SIZE,
      Math.ceil(relationChunk.length / 2)
    );
    const fallbackChunks = chunkArray(relationChunk, nextChunkSize);
    logBusGeometryDiagnostics("batch fallback split", {
      relationCount: relationChunk.length,
      nextChunkSize,
      fallbackBatchCount: fallbackChunks.length,
    });
    const fallbackElements = [];
    for (let index = 0; index < fallbackChunks.length; index += 1) {
      const childElements = await fetchOsmBusRouteGeometryChunkWithFallback(
        fallbackChunks[index],
        options,
        {
          depth: (context.depth ?? 0) + 1,
          label: `${context.label ?? context.batchSequence}.${index + 1}`,
          batchSequence: `${context.batchSequence}.${index + 1}`,
          computationDeadlineMs: context.computationDeadlineMs,
        }
      );
      fallbackElements.push(...childElements);
    }
    return fallbackElements;
  }
}

function chunkArray(values, chunkSize) {
  const output = [];
  const size = Math.max(1, Number(chunkSize) || 1);
  for (let index = 0; index < values.length; index += size) {
    output.push(values.slice(index, index + size));
  }
  return output;
}

function cacheBusRelationGeometryElements(elements) {
  const elementList = elements ?? [];
  const wayById = new Map(
    elementList
      .filter((element) => element.type === "way")
      .map((way) => [Number(way.id), way])
  );
  elementList
    .filter((element) => element.type === "relation" && isOsmBusRouteRelation(element))
    .forEach((relation) => {
      const relationWayIds = new Set(
        (relation.members ?? [])
          .filter((member) => member.type === "way")
          .map((member) => Number(member.ref))
          .filter((id) => Number.isFinite(id))
      );
      const relatedWays = Array.from(relationWayIds)
        .map((wayId) => wayById.get(wayId))
        .filter(Boolean);
      BUS_RELATION_GEOMETRY_CACHE.set(Number(relation.id), clonePlainValue([relation, ...relatedWays]));
    });
  while (BUS_RELATION_GEOMETRY_CACHE.size > BUS_ROUTE_MAX_RELATIONS * BUS_CACHE_MAX_ENTRIES) {
    BUS_RELATION_GEOMETRY_CACHE.delete(BUS_RELATION_GEOMETRY_CACHE.keys().next().value);
  }
}

function dedupeOverpassElements(elements) {
  const seen = new Set();
  const output = [];
  (elements ?? []).forEach((element) => {
    const key = `${element.type}/${element.id}`;
    if (!seen.has(key)) {
      seen.add(key);
      output.push(element);
    }
  });
  return output;
}

function payloadHasUsableBusRouteGeometry(payload) {
  const elements = payload?.elements ?? [];
  const hasRelationWithMemberGeometry = elements.some((element) =>
    element.type === "relation" &&
    Array.isArray(element.members) &&
    element.members.some((member) => Array.isArray(member.geometry) && member.geometry.length > 1)
  );
  const hasWayGeometry = elements.some((element) =>
    element.type === "way" && Array.isArray(element.geometry) && element.geometry.length > 1
  );
  return elements.some((element) => element.type === "relation") && (hasRelationWithMemberGeometry || hasWayGeometry);
}

function extractOsmBusRouteCandidates(payload, originCoordinates, source = "relation index") {
  const elements = payload?.elements ?? [];
  const stopByNodeId = new Map();
  elements.forEach((element) => {
    if (element.type !== "node" || !isOsmBusStopNode(element)) {
      return;
    }
    const latitude = Number(element.lat);
    const longitude = Number(element.lon);
    if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
      return;
    }
    const distanceMetres = getDistanceMetres(
        originCoordinates.latitude,
        originCoordinates.longitude,
        latitude,
        longitude
      );
    stopByNodeId.set(Number(element.id), {
      id: Number(element.id),
      coordinate: { latitude, longitude },
      distanceMetres,
      bearing: getInitialBearingDegrees(originCoordinates, { latitude, longitude }),
    });
  });

  return elements
    .filter((element) => element.type === "relation" && isOsmBusRouteRelation(element))
    .map((relation) => {
      const memberStops = (relation.members ?? [])
        .filter((member) => member.type === "node" && stopByNodeId.has(Number(member.ref)))
        .map((member) => stopByNodeId.get(Number(member.ref)));
      const bestStop = memberStops
        .sort((a, b) => a.distanceMetres - b.distanceMetres)[0];
      const bestStopDistance = bestStop?.distanceMetres ?? Infinity;
      const sourcePenalty = source === "stop-relation lookup" ? 0 : 100000;
      const tags = relation.tags ?? {};
      return {
        id: Number(relation.id),
        score: (Number.isFinite(bestStopDistance) ? bestStopDistance : 99999) + sourcePenalty,
        bestStopDistanceMetres: Number.isFinite(bestStopDistance) ? bestStopDistance : null,
        bearing: Number.isFinite(bestStop?.bearing) ? bestStop.bearing : null,
        sector: Number.isFinite(bestStop?.bearing) ? getBusBearingSector(bestStop.bearing) : "unknown",
        routeKey: buildBusRouteGroupKey(tags),
        name: deriveOsmBusRouteName(tags),
        ref: tags.ref || "",
        source,
      };
    })
    .filter((candidate) => Number.isFinite(candidate.id) && candidate.id > 0);
}

function getBusBearingSector(bearing) {
  if (!Number.isFinite(Number(bearing))) {
    return "unknown";
  }
  const wrappedBearing = ((Number(bearing) % 360) + 360) % 360;
  return Math.floor(wrappedBearing / BUS_ROUTE_BEARING_SECTOR_DEGREES);
}

function buildBusRouteGroupKey(tags = {}) {
  const ref = String(tags.ref || "").trim().toLowerCase();
  if (ref) {
    return `ref:${ref}`;
  }
  const name = String(tags.name || "").trim().toLowerCase();
  if (name) {
    return `name:${name.replace(/\s+/g, " ")}`;
  }
  const fromTo = [tags.from, tags.to].map((value) => String(value || "").trim().toLowerCase()).filter(Boolean).join("|");
  return fromTo ? `fromto:${fromTo}` : "ungrouped";
}

function getBusRouteCandidateCap(candidates) {
  const knownSectorCount = new Set(
    (candidates ?? [])
      .map((candidate) => candidate.sector)
      .filter((sector) => sector !== "unknown")
  ).size;
  const sectorCoverageMinimum = Math.max(knownSectorCount * BUS_ROUTE_MIN_PER_SECTOR, BUS_ROUTE_MIN_PER_SECTOR);
  return Math.min(
    BUS_ROUTE_MAX_RELATIONS,
    Math.max(sectorCoverageMinimum, Math.min((candidates ?? []).length, BUS_ROUTE_MAX_RELATIONS))
  );
}

function selectBalancedOsmBusRouteCandidates(candidates, cap = getBusRouteCandidateCap(candidates)) {
  const uniqueCandidates = Array.from(
    new Map(
      (candidates ?? [])
        .filter((candidate) => Number.isFinite(Number(candidate.id)))
        .map((candidate) => [Number(candidate.id), normaliseBusRouteCandidate(candidate)])
    ).values()
  ).sort(compareBusRouteCandidates);
  const selectedById = new Map();
  const selectedGroupCounts = new Map();

  const trySelect = (candidate, reason) => {
    if (!candidate || selectedById.has(candidate.id) || selectedById.size >= cap) {
      return false;
    }
    const groupCount = selectedGroupCounts.get(candidate.routeKey) ?? 0;
    if (candidate.routeKey !== "ungrouped" && groupCount >= BUS_ROUTE_MAX_PER_ROUTE_GROUP) {
      return false;
    }
    selectedById.set(candidate.id, { ...candidate, selectedReason: reason });
    selectedGroupCounts.set(candidate.routeKey, groupCount + 1);
    return true;
  };

  const knownSectors = Array.from(new Set(
    uniqueCandidates
      .map((candidate) => candidate.sector)
      .filter((sector) => sector !== "unknown")
  )).sort((a, b) => Number(a) - Number(b));

  for (let round = 0; round < BUS_ROUTE_MIN_PER_SECTOR; round += 1) {
    for (const sector of knownSectors) {
      const sectorCandidate = uniqueCandidates
        .filter((candidate) => candidate.sector === sector && !selectedById.has(candidate.id))
        .find((candidate) => trySelect(candidate, `sector ${sector} round ${round + 1}`));
      if (selectedById.size >= cap) {
        break;
      }
      void sectorCandidate;
    }
    if (selectedById.size >= cap) {
      break;
    }
  }

  uniqueCandidates.forEach((candidate) => {
    trySelect(candidate, candidate.sector === "unknown" ? "best remaining unknown-sector route" : "best remaining balanced route");
  });

  return Array.from(selectedById.values()).sort(compareBusRouteCandidates);
}

function normaliseBusRouteCandidate(candidate) {
  const bestStopDistanceMetres = Number(candidate.bestStopDistanceMetres);
  const bearing = Number(candidate.bearing);
  return {
    ...candidate,
    id: Number(candidate.id),
    bestStopDistanceMetres: Number.isFinite(bestStopDistanceMetres) ? bestStopDistanceMetres : null,
    score: Number.isFinite(Number(candidate.score)) ? Number(candidate.score) : 999999,
    bearing: Number.isFinite(bearing) ? bearing : null,
    sector: candidate.sector ?? (Number.isFinite(bearing) ? getBusBearingSector(bearing) : "unknown"),
    routeKey: candidate.routeKey || "ungrouped",
    name: candidate.name || `Route ${candidate.id}`,
  };
}

function compareBusRouteCandidates(a, b) {
  const aDistance = Number.isFinite(Number(a.bestStopDistanceMetres)) ? Number(a.bestStopDistanceMetres) : Infinity;
  const bDistance = Number.isFinite(Number(b.bestStopDistanceMetres)) ? Number(b.bestStopDistanceMetres) : Infinity;
  return aDistance - bDistance || String(a.routeKey).localeCompare(String(b.routeKey)) || Number(a.id) - Number(b.id);
}

function logBusCandidateSelectionDiagnostics(candidates, selectedCandidates, context = {}) {
  if (!isBusTimingLogEnabled()) {
    return;
  }
  const selectedById = new Map(selectedCandidates.map((candidate) => [candidate.id, candidate]));
  const rows = (candidates ?? [])
    .map((candidate) => normaliseBusRouteCandidate(candidate))
    .sort(compareBusRouteCandidates)
    .map((candidate) => {
      const selected = selectedById.get(candidate.id);
      return {
        routeId: candidate.id,
        ref: candidate.ref || "",
        name: candidate.name,
        nearestStopMetres: Number.isFinite(Number(candidate.bestStopDistanceMetres))
          ? Math.round(candidate.bestStopDistanceMetres)
          : null,
        bearing: Number.isFinite(Number(candidate.bearing)) ? Math.round(candidate.bearing) : null,
        sector: candidate.sector,
        source: candidate.source,
        routeGroup: candidate.routeKey,
        selected: Boolean(selected),
        reason: selected?.selectedReason || "excluded after balanced sector/group cap",
      };
    });
  console.debug("[bus candidates] selection summary", {
    ...context,
    candidateCount: rows.length,
    selectedCount: selectedCandidates.length,
    sectorCount: new Set(rows.map((row) => row.sector)).size,
    cap: BUS_ROUTE_MAX_RELATIONS,
    minPerSector: BUS_ROUTE_MIN_PER_SECTOR,
    maxPerRouteGroup: BUS_ROUTE_MAX_PER_ROUTE_GROUP,
  });
  console.table(rows);
}

function logBusRoutePreparationDiagnostics(details = {}) {
  if (!isBusTimingLogEnabled()) {
    return;
  }
  console.debug("[bus diagnostics] route preparation", details);
}

function logBusGeometryDiagnostics(eventName, details = {}) {
  if (!isBusTimingLogEnabled()) {
    return;
  }
  console.debug(`[bus geometry] ${eventName}`, details);
}

function isOsmBusRouteRelation(element) {
  const tags = element?.tags ?? {};
  return tags.type === "route" && /^(bus|coach|trolleybus)$/i.test(String(tags.route || ""));
}

function isOsmBusStopNode(element) {
  const tags = element?.tags ?? {};
  return tags.highway === "bus_stop" ||
    (String(tags.public_transport || "").match(/^(platform|stop_position)$/) && tags.bus !== "no");
}

async function fetchOsmBusRouteOverpassPayload(query, options = {}, timeoutMs = SERVICE_TIMEOUT_MS[OSM_BUS_ROUTE_SERVICE_NAME] ?? 90000) {
  let lastError = null;

  for (const endpoint of OVERPASS_ENDPOINTS) {
    try {
      return await fetchJsonWithDiagnostics(
        endpoint,
        {
          method: "POST",
          headers: IS_FILE_CONTEXT
            ? {
                "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
                "Accept": "application/json, */*;q=0.1",
              }
            : {
                "Content-Type": "text/plain;charset=UTF-8",
              },
          body: IS_FILE_CONTEXT ? new URLSearchParams({ data: query }).toString() : query,
          signal: options.signal,
        },
        OSM_BUS_ROUTE_SERVICE_NAME,
        timeoutMs
      );
    } catch (error) {
      if (error?.kind === "cancelled") {
        throw error;
      }
      lastError = error;
    }
  }

  throw lastError || createServiceError(
    OSM_BUS_ROUTE_SERVICE_NAME,
    "api_outage",
    "OpenStreetMap bus route data could not be reached."
  );
}

function extractOsmBusRouteIds(payload) {
  const seen = new Set();
  const relationIds = [];

  (payload?.elements ?? []).forEach((element) => {
    if (element.type !== "relation") {
      return;
    }
    const tags = element.tags ?? {};
    if (tags.type !== "route" || !/^(bus|coach|trolleybus)$/i.test(String(tags.route || ""))) {
      return;
    }
    const id = Number(element.id);
    if (!Number.isFinite(id) || seen.has(id)) {
      return;
    }
    seen.add(id);
    relationIds.push(id);
  });

  return relationIds;
}

function buildOsmBusRouteStopRelationIndexQuery(siteCoordinates, radiusMetres = BUS_ROUTE_STOP_QUERY_RADIUS_METRES) {
  const radius = Math.round(Number(radiusMetres) || BUS_ROUTE_STOP_QUERY_RADIUS_METRES);
  return `
[out:json][timeout:25];
(
  node(around:${radius},${siteCoordinates.latitude},${siteCoordinates.longitude})[highway=bus_stop];
  node(around:${radius},${siteCoordinates.latitude},${siteCoordinates.longitude})[public_transport~"platform|stop_position"][bus!="no"];
)->.stops;
(
  .stops;
  rel(bn.stops)[type=route][route~"^(bus|coach|trolleybus)$"];
);
out body qt;
  `;
}

function buildOsmBusRouteNearbyRelationIndexQuery(siteCoordinates, radiusMetres = BUS_ROUTE_NEARBY_QUERY_RADIUS_METRES) {
  const radius = Math.round(Number(radiusMetres) || BUS_ROUTE_NEARBY_QUERY_RADIUS_METRES);
  return `
[out:json][timeout:25];
relation(around:${radius},${siteCoordinates.latitude},${siteCoordinates.longitude})[type=route][route~"^(bus|coach|trolleybus)$"];
out tags qt;
  `;
}

function buildOsmBusRouteGeometryQuery(relationIds) {
  const idList = relationIds
    .map((id) => Number(id))
    .filter((id) => Number.isFinite(id) && id > 0)
    .join(",");

  return `
[out:json][timeout:35];
rel(id:${idList})->.routes;
(
  .routes;
  way(r.routes);
);
out body geom qt;
  `;
}

async function extractAccessibleOsmBusRoutes(payload, originCoordinates, options = {}, context = {}) {
  const maximumBandMinutes = Number(context.maximumBandMinutes) || getMaximumBusBandMinutes();
  const computationDeadlineMs = context.computationDeadlineMs;
  const maximumWalkToBusStopMetres = Number(context.maximumWalkToBusStopMetres) || getSelectedBusMaxWalkToStopMetres() || BUS_MAX_WALK_TO_STOP_DEFAULT_METRES;
  const stopSearchRadiusMetres = Number(context.stopSearchRadiusMetres) || getBusStopSearchRadiusMetres(maximumWalkToBusStopMetres);
  const cacheKey = buildBusOriginCacheKey(originCoordinates, stopSearchRadiusMetres, maximumBandMinutes, maximumWalkToBusStopMetres);
  const cachedResult = getMapCacheEntry(BUS_ACCESSIBLE_ROUTES_CACHE, cacheKey, clonePlainValue);
  if (cachedResult) {
    if (Array.isArray(cachedResult)) {
      return { routes: cachedResult, accessDiagnostics: summariseBusBoardingStopDiagnostics(cachedResult, 0, maximumWalkToBusStopMetres, stopSearchRadiusMetres) };
    }
    return cachedResult;
  }
  const elements = payload?.elements ?? [];
  const nodeById = new Map(
    elements
      .filter((element) => element.type === "node" && Number.isFinite(Number(element.lat)) && Number.isFinite(Number(element.lon)))
      .map((element) => [Number(element.id), element])
  );
  const wayById = new Map(
    elements
      .filter((element) => element.type === "way" && Array.isArray(element.geometry) && element.geometry.length > 1)
      .map((element) => [Number(element.id), element])
  );
  const relationElements = elements
    .filter((element) => element.type === "relation" && element.members?.length && isOsmBusRouteRelation(element))
    .slice(0, BUS_ROUTE_MAX_RELATIONS * 2);
  const candidateStops = buildBusCandidateStops(nodeById, originCoordinates, stopSearchRadiusMetres);
  logBusRoutePreparationDiagnostics({
    candidateStopCount: candidateStops.length,
    relationCount: relationElements.length,
    payloadElementCount: elements.length,
    originCoordinates,
    stopSearchRadiusMetres,
    maximumWalkToBusStopMetres,
  });
  const routes = [];

  for (let relationIndex = 0; relationIndex < relationElements.length; relationIndex += 1) {
    throwIfBusComputationDeadlineExceeded(computationDeadlineMs, "route access preparation");
    const relation = relationElements[relationIndex];
    if (relationIndex % 4 === 0) {
      setStatus(
        "Calculating bus reach",
        `Preparing accessible bus routes ${relationIndex + 1}-${Math.min(relationIndex + 4, relationElements.length)} of ${relationElements.length}.`,
        "running"
      );
      render();
      await yieldToBrowser();
    }
    const routeCoordinates = buildRouteCoordinateSequenceFromRelation(relation, wayById);
    if (routeCoordinates.length < 3) {
      continue;
    }

    const rawAccessAnchors = collectRouteAccessAnchors(relation, nodeById, routeCoordinates, originCoordinates, {
      maximumBandMinutes,
      stopSearchRadiusMetres,
      maximumWalkToBusStopMetres,
      candidateStops,
    });
    const accessAnchors = await enrichBusAccessAnchorsWithWalkDistance(
      rawAccessAnchors,
      originCoordinates,
      options,
      { maximumBandMinutes, maximumWalkToBusStopMetres, computationDeadlineMs }
    );
    if (accessAnchors.length === 0) {
      continue;
    }

    routes.push({
      id: relation.id,
      name: deriveOsmBusRouteName(relation.tags ?? {}),
      coordinates: downsampleRouteCoordinates(routeCoordinates, BUS_ROUTE_MAX_POINTS_PER_RELATION),
      accessAnchors,
      minAccessDistance: Math.min(
        ...accessAnchors.map((anchor) => anchor.accessWalkDistanceMetres)
      ),
      minAccessWalkTimeMinutes: Math.min(
        ...accessAnchors.map((anchor) => anchor.accessWalkTimeMinutes)
      ),
    });
  }

  const sortedRoutes = routes
    .sort((a, b) => a.minAccessWalkTimeMinutes - b.minAccessWalkTimeMinutes || a.minAccessDistance - b.minAccessDistance)
    .slice(0, BUS_ROUTE_MAX_RELATIONS);
  const accessDiagnostics = summariseBusBoardingStopDiagnostics(
    sortedRoutes,
    candidateStops.length,
    maximumWalkToBusStopMetres,
    stopSearchRadiusMetres
  );
  const result = { routes: sortedRoutes, accessDiagnostics };
  if (sortedRoutes.length > 0) {
    setMapCacheEntry(BUS_ACCESSIBLE_ROUTES_CACHE, cacheKey, result, clonePlainValue);
  }
  logBusRoutePreparationDiagnostics({
    accessibleRouteCount: sortedRoutes.length,
    finalRenderedRouteCap: BUS_ROUTE_MAX_RELATIONS,
    ...accessDiagnostics,
  });
  return result;
}

function buildRouteCoordinateSequenceFromRelation(relation, wayById) {
  const segments = [];

  (relation.members ?? []).forEach((member) => {
    const way = member.type === "way" ? wayById.get(Number(member.ref)) : null;
    const rawGeometry = Array.isArray(way?.geometry)
      ? way.geometry
      : Array.isArray(member.geometry)
        ? member.geometry
        : null;
    const wayTags = way?.tags ?? member.tags ?? {};

    if (!Array.isArray(rawGeometry) || rawGeometry.length < 2) {
      return;
    }

    const segment = rawGeometry
      .map((point) => buildRouteCoordinateWithWayTags(point, wayTags, way?.id ?? member.ref))
      .filter((point) => Number.isFinite(point.latitude) && Number.isFinite(point.longitude));

    if (segment.length > 1) {
      segments.push(member.role === "backward" ? [...segment].reverse() : segment);
    }
  });

  return stitchRouteSegments(segments);
}

function buildRouteCoordinateWithWayTags(point, tags = {}, wayId = null) {
  const highwayClass = classifyBusRouteHighwayClass(tags);
  return {
    latitude: Number(point.lat),
    longitude: Number(point.lon),
    osmWayId: Number.isFinite(Number(wayId)) ? Number(wayId) : null,
    highwayClass,
    highway: tags.highway || "",
    maxspeed: tags.maxspeed || "",
    busway: tags.busway || "",
    psv: tags.psv || "",
    access: tags.access || "",
    wayName: tags.name || "",
    wayRef: tags.ref || "",
  };
}

function stitchRouteSegments(segments) {
  if (segments.length === 0) {
    return [];
  }

  const remaining = segments.map((segment) => [...segment]);
  const stitched = remaining.shift();

  while (remaining.length > 0) {
    const last = stitched[stitched.length - 1];
    let bestIndex = 0;
    let bestReverse = false;
    let bestDistance = Infinity;

    remaining.forEach((segment, index) => {
      const startDistance = getDistanceMetres(last.latitude, last.longitude, segment[0].latitude, segment[0].longitude);
      const endDistance = getDistanceMetres(last.latitude, last.longitude, segment[segment.length - 1].latitude, segment[segment.length - 1].longitude);
      if (startDistance < bestDistance) {
        bestDistance = startDistance;
        bestIndex = index;
        bestReverse = false;
      }
      if (endDistance < bestDistance) {
        bestDistance = endDistance;
        bestIndex = index;
        bestReverse = true;
      }
    });

    const nextSegment = remaining.splice(bestIndex, 1)[0];
    const orientedSegment = bestReverse ? nextSegment.reverse() : nextSegment;
    orientedSegment.forEach((point, index) => {
      if (index === 0 && coordinatesApproximatelyEqual(stitched[stitched.length - 1], point)) {
        return;
      }
      stitched.push(point);
    });
  }

  return dedupeAdjacentCoordinates(stitched, 6);
}

function coordinatesApproximatelyEqual(a, b, precision = 6) {
  return a.latitude.toFixed(precision) === b.latitude.toFixed(precision) &&
    a.longitude.toFixed(precision) === b.longitude.toFixed(precision);
}

function dedupeAdjacentCoordinates(coordinates, precision = 6) {
  const output = [];
  coordinates.forEach((coordinate) => {
    if (!output.length || !coordinatesApproximatelyEqual(output[output.length - 1], coordinate, precision)) {
      output.push(coordinate);
    }
  });
  return output;
}

function buildBusCandidateStops(nodeById, originCoordinates, stopSearchRadiusMetres) {
  return Array.from(nodeById.values())
    .filter((node) => isOsmBusStopNode(node))
    .map((node) => ({
      id: Number(node.id),
      coordinate: { latitude: Number(node.lat), longitude: Number(node.lon) },
    }))
    .filter((stop) => Number.isFinite(stop.coordinate.latitude) && Number.isFinite(stop.coordinate.longitude))
    .map((stop) => ({
      ...stop,
      straightLineDistanceMetres: getDistanceMetres(
        originCoordinates.latitude,
        originCoordinates.longitude,
        stop.coordinate.latitude,
        stop.coordinate.longitude
      ),
    }))
    .filter((stop) => stop.straightLineDistanceMetres <= stopSearchRadiusMetres)
    .sort((a, b) => a.straightLineDistanceMetres - b.straightLineDistanceMetres)
    .slice(0, 180);
}

function collectRouteAccessAnchors(relation, nodeById, routeCoordinates, originCoordinates, context = {}) {
  const maximumBandMinutes = Number(context.maximumBandMinutes) || getMaximumBusBandMinutes();
  const maximumWalkToBusStopMetres = Number(context.maximumWalkToBusStopMetres) || getSelectedBusMaxWalkToStopMetres() || BUS_MAX_WALK_TO_STOP_DEFAULT_METRES;
  const stopSearchRadiusMetres = Number(context.stopSearchRadiusMetres) || getBusStopSearchRadiusMetres(maximumWalkToBusStopMetres);
  const anchors = [];

  const addAnchor = (coordinate, accessAnchorType, sourceStopId = null) => {
    const straightLineDistanceMetres = getDistanceMetres(
      originCoordinates.latitude,
      originCoordinates.longitude,
      coordinate.latitude,
      coordinate.longitude
    );
    if (!Number.isFinite(straightLineDistanceMetres) || straightLineDistanceMetres > stopSearchRadiusMetres) {
      return;
    }
    anchors.push({
      coordinate,
      straightLineDistanceMetres,
      accessAnchorType,
      sourceStopId,
    });
  };

  (relation.members ?? []).forEach((member) => {
    if (member.type !== "node") {
      return;
    }
    const node = nodeById.get(Number(member.ref));
    let coordinate = null;
    if (node && isOsmBusStopNode(node)) {
      coordinate = { latitude: Number(node.lat), longitude: Number(node.lon) };
    } else if (Number.isFinite(Number(member.lat)) && Number.isFinite(Number(member.lon))) {
      coordinate = { latitude: Number(member.lat), longitude: Number(member.lon) };
    }
    if (!coordinate || !Number.isFinite(coordinate.latitude) || !Number.isFinite(coordinate.longitude)) {
      return;
    }
    addAnchor(coordinate, "relation stop/platform node", Number(member.ref));
  });

  // Fallback for incomplete OSM relations: if a mapped stop is walkable and lies close to the route geometry,
  // allow it as a boarding anchor, while recording that it is a geometry-proximity fallback.
  const candidateStops = context.candidateStops ?? buildBusCandidateStops(nodeById, originCoordinates, stopSearchRadiusMetres);

  candidateStops.forEach((stop) => {
    if (anchors.some((anchor) => anchor.sourceStopId === stop.id)) {
      return;
    }
    const nearestRoutePoint = findNearestRoutePoint(stop.coordinate, routeCoordinates);
    if (nearestRoutePoint && nearestRoutePoint.distance <= BUS_ROUTE_STOP_PROXIMITY_FALLBACK_METRES) {
      addAnchor(stop.coordinate, "bus stop geometry-proximity fallback", stop.id);
    }
  });

  return dedupeBusAccessAnchors(anchors, 6)
    .sort((a, b) => a.straightLineDistanceMetres - b.straightLineDistanceMetres)
    .slice(0, BUS_ACCESS_MAX_ANCHORS_PER_ROUTE);
}

function findNearestRoutePoint(referenceCoordinate, routeCoordinates) {
  let nearest = null;
  routeCoordinates.forEach((coordinate, index) => {
    const distance = getDistanceMetres(referenceCoordinate.latitude, referenceCoordinate.longitude, coordinate.latitude, coordinate.longitude);
    if (!nearest || distance < nearest.distance) {
      nearest = { coordinate, index, distance };
    }
  });
  return nearest;
}

function deriveOsmBusRouteName(tags) {
  return tags.ref || tags.name || (tags.from && tags.to ? `${tags.from} - ${tags.to}` : "Bus route");
}

function downsampleRouteCoordinates(coordinates, maxPoints) {
  if (coordinates.length <= maxPoints) {
    return coordinates;
  }
  const interval = Math.ceil(coordinates.length / maxPoints);
  return coordinates.filter((_, index) => index % interval === 0 || index === coordinates.length - 1);
}

function dedupeCoordinates(coordinates, precision = 5) {
  const seen = new Set();
  const output = [];
  coordinates.forEach((coordinate) => {
    const key = `${coordinate.latitude.toFixed(precision)},${coordinate.longitude.toFixed(precision)}`;
    if (!seen.has(key)) {
      seen.add(key);
      output.push(coordinate);
    }
  });
  return output;
}

function dedupeBusAccessAnchors(anchors, precision = 5) {
  const seen = new Set();
  const output = [];
  anchors.forEach((anchor) => {
    const key = `${anchor.coordinate.latitude.toFixed(precision)},${anchor.coordinate.longitude.toFixed(precision)}`;
    if (!seen.has(key)) {
      seen.add(key);
      output.push(anchor);
    }
  });
  return output;
}

async function enrichBusAccessAnchorsWithWalkDistance(rawAnchors, originCoordinates, options = {}, context = {}) {
  const maximumBandMinutes = Number(context.maximumBandMinutes) || getMaximumBusBandMinutes();
  const computationDeadlineMs = context.computationDeadlineMs;
  const maximumWalkToBusStopMetres = Number(context.maximumWalkToBusStopMetres) || getSelectedBusMaxWalkToStopMetres() || BUS_MAX_WALK_TO_STOP_DEFAULT_METRES;
  const candidateAnchors = dedupeBusAccessAnchors(rawAnchors, 6)
    .sort((a, b) => a.straightLineDistanceMetres - b.straightLineDistanceMetres)
    .slice(0, BUS_ACCESS_MAX_ANCHORS_PER_ROUTE);

  const enrichedAnchors = [];
  for (let startIndex = 0; startIndex < candidateAnchors.length; startIndex += BUS_ACCESS_DISTANCE_CONCURRENCY) {
    throwIfBusComputationDeadlineExceeded(computationDeadlineMs, "bus stop walking access");
    if (options.signal?.aborted) {
      throw createServiceError(
        OSM_BUS_ROUTE_SERVICE_NAME,
        "cancelled",
        "Bus access walking distance request was cancelled."
      );
    }
    const batch = candidateAnchors.slice(startIndex, startIndex + BUS_ACCESS_DISTANCE_CONCURRENCY);
    const batchResults = await Promise.all(batch.map((anchor) =>
      enrichSingleBusAccessAnchorWithWalkDistance(anchor, originCoordinates, options, maximumBandMinutes, maximumWalkToBusStopMetres)
    ));
    enrichedAnchors.push(...batchResults.filter(Boolean));
    await yieldToBrowser();
  }

  return enrichedAnchors.filter((anchor) => Number.isFinite(anchor.accessWalkTimeMinutes));
}

async function enrichSingleBusAccessAnchorWithWalkDistance(anchor, originCoordinates, options, maximumBandMinutes, maximumWalkToBusStopMetres) {
  let accessWalkDistanceMetres = anchor.straightLineDistanceMetres;
  let accessDistanceSource = "straight-line fallback";
  let usesStraightLineFallback = true;

  try {
    const routedDistanceMetres = await fetchBusAccessPedestrianDistanceMetres(
      originCoordinates,
      anchor.coordinate,
      options
    );
    if (Number.isFinite(routedDistanceMetres) && routedDistanceMetres >= 0) {
      accessWalkDistanceMetres = routedDistanceMetres;
      accessDistanceSource = "Valhalla pedestrian route";
      usesStraightLineFallback = false;
    }
  } catch (error) {
    if (error?.kind === "cancelled") {
      throw error;
    }
    // Use the straight-line fallback for this anchor only. The metadata/source note records this.
  }

  if (usesStraightLineFallback) {
    accessWalkDistanceMetres = estimateBusWalkDistanceMetres(anchor.straightLineDistanceMetres);
  }

  if (!Number.isFinite(accessWalkDistanceMetres) || accessWalkDistanceMetres < 0) {
    return null;
  }

  if (Number.isFinite(maximumWalkToBusStopMetres) && accessWalkDistanceMetres > maximumWalkToBusStopMetres) {
    return null;
  }

  const accessWalkTimeMinutes = usesStraightLineFallback
    ? estimateBusWalkTimeMinutes(anchor.straightLineDistanceMetres)
    : getBusAccessWalkMinutes(accessWalkDistanceMetres);
  if (!Number.isFinite(accessWalkTimeMinutes) || accessWalkTimeMinutes > maximumBandMinutes) {
    return null;
  }

  return {
    coordinate: anchor.coordinate,
    accessWalkDistanceMetres,
    accessWalkTimeMinutes,
    accessDistanceSource,
    straightLineDistanceMetres: anchor.straightLineDistanceMetres,
    accessAnchorType: anchor.accessAnchorType,
    sourceStopId: anchor.sourceStopId,
  };
}

async function fetchBusAccessPedestrianDistanceMetres(originCoordinates, accessCoordinate, options = {}) {
  const cacheKey = buildBusAccessDistanceCacheKey(originCoordinates, accessCoordinate);
  if (BUS_ACCESS_DISTANCE_CACHE.has(cacheKey)) {
    return BUS_ACCESS_DISTANCE_CACHE.get(cacheKey);
  }

  const payload = {
    locations: [
      {
        lat: originCoordinates.latitude,
        lon: originCoordinates.longitude,
      },
      {
        lat: accessCoordinate.latitude,
        lon: accessCoordinate.longitude,
      },
    ],
    costing: "pedestrian",
    units: "kilometers",
    directions_options: {
      units: "kilometers",
    },
  };

  const routePayload = await fetchJsonWithDiagnostics(
    `${VALHALLA_ROUTE_ENDPOINT}?json=${encodeURIComponent(JSON.stringify(payload))}`,
    { signal: options.signal },
    "Valhalla route",
    SERVICE_TIMEOUT_MS["Valhalla route"] ?? 10000
  );

  if (routePayload.error) {
    throw createServiceError(
      "Valhalla route",
      classifyRoutingPayloadKind(routePayload.error),
      buildServiceKindMessage(
        "Valhalla route",
        classifyRoutingPayloadKind(routePayload.error),
        normaliseServiceMessage("Valhalla route", routePayload.error)
      )
    );
  }

  const distanceKilometres = Number(routePayload.trip?.summary?.length);
  if (!Number.isFinite(distanceKilometres) || distanceKilometres < 0) {
    throw createServiceError(
      "Valhalla route",
      "unavailable_routing_data",
      "Valhalla route did not return a pedestrian access distance."
    );
  }

  const distanceMetres = distanceKilometres * 1000;
  BUS_ACCESS_DISTANCE_CACHE.set(cacheKey, distanceMetres);
  return distanceMetres;
}

function buildBusAccessDistanceCacheKey(originCoordinates, accessCoordinate) {
  return [
    originCoordinates.latitude.toFixed(6),
    originCoordinates.longitude.toFixed(6),
    accessCoordinate.latitude.toFixed(6),
    accessCoordinate.longitude.toFixed(6),
  ].join("|");
}

function getMaximumBusBandMinutes(configuredBands = getConfiguredBandsForMode("bus")) {
  const values = configuredBands
    .map((band) => Number(band.time))
    .filter((value) => Number.isFinite(value) && value > 0);
  return values.length ? Math.max(...values) : 60;
}

function getBusStopSearchRadiusMetres(maximumWalkToBusStopMetres = getSelectedBusMaxWalkToStopMetres() || BUS_MAX_WALK_TO_STOP_DEFAULT_METRES) {
  const selectedWalkMetres = Number(maximumWalkToBusStopMetres);
  const prefilterRadiusMetres = Math.max(
    selectedWalkMetres + BUS_STOP_PREFILTER_MARGIN_METRES,
    selectedWalkMetres * BUS_STOP_PREFILTER_FACTOR
  );
  return Math.round(clamp(
    prefilterRadiusMetres,
    BUS_STOP_SEARCH_MIN_RADIUS_METRES,
    BUS_STOP_SEARCH_MAX_RADIUS_METRES
  ));
}

function summariseBusBoardingStopDiagnostics(routes, candidateStopCount, maximumWalkToBusStopMetres, stopSearchRadiusMetres) {
  const retainedStopKeys = new Set();
  const retainedSourceStopIds = new Set();
  (routes ?? []).forEach((route) => {
    (route.accessAnchors ?? []).forEach((anchor) => {
      if (Number.isFinite(Number(anchor.sourceStopId))) {
        retainedSourceStopIds.add(Number(anchor.sourceStopId));
      }
      if (anchor.coordinate && Number.isFinite(anchor.coordinate.latitude) && Number.isFinite(anchor.coordinate.longitude)) {
        retainedStopKeys.add(`${anchor.coordinate.latitude.toFixed(6)},${anchor.coordinate.longitude.toFixed(6)}`);
      }
    });
  });
  const retainedStopCount = retainedSourceStopIds.size || retainedStopKeys.size;
  const safeCandidateCount = Number(candidateStopCount) || 0;
  return {
    maximumWalkToBusStopMetres,
    stopSearchRadiusMetres,
    candidateBusStopCountBeforeWalkFilter: safeCandidateCount,
    retainedBusStopCountAfterWalkFilter: retainedStopCount,
    excludedBusStopCountByWalkLimit: Math.max(0, safeCandidateCount - retainedStopCount),
    selectedBusRouteRelationCount: Array.isArray(routes) ? routes.length : 0,
  };
}

function getBusAccessWalkMinutes(distanceMetres) {
  return distanceMetres / BUS_ACCESS_WALK_SPEED_METRES_PER_MINUTE;
}

function estimateBusWalkTimeMinutes(straightLineDistanceMetres) {
  if (!Number.isFinite(straightLineDistanceMetres) || straightLineDistanceMetres < 0) {
    return null;
  }
  return (straightLineDistanceMetres * BUS_ACCESS_WALK_DETOUR_FACTOR) / BUS_ACCESS_WALK_SPEED_METRES_PER_MINUTE;
}

function estimateBusWalkDistanceMetres(straightLineDistanceMetres) {
  if (!Number.isFinite(straightLineDistanceMetres) || straightLineDistanceMetres < 0) {
    return null;
  }
  return straightLineDistanceMetres * BUS_ACCESS_WALK_DETOUR_FACTOR;
}

function summariseBusAccessMetadata(routes) {
  const anchors = routes.flatMap((route) => route.accessAnchors ?? []);
  const routedCount = anchors.filter((anchor) => anchor.accessDistanceSource === "Valhalla pedestrian route").length;
  const straightLineFallbackCount = anchors.filter((anchor) => anchor.accessDistanceSource === "straight-line fallback").length;
  return {
    accessAnchorCount: anchors.length,
    routedPedestrianAccessAnchorCount: routedCount,
    straightLineFallbackAccessAnchorCount: straightLineFallbackCount,
    accessDistanceSources: Array.from(new Set(anchors.map((anchor) => anchor.accessDistanceSource).filter(Boolean))),
  };
}

async function buildIndicativeBusIsochronesFromRoutes(routes, configuredBands, busSpeedSettings = getSelectedBusSpeedSettings(), context = {}) {
  const speedSettings = normaliseBusSpeedSettings(busSpeedSettings);
  const computationDeadlineMs = context.computationDeadlineMs;
  const speedDiagnostics = createBusSpeedDiagnostics(speedSettings);
  const bandPointSets = configuredBands.map((band) => ({ band, metrics: [] }));

  for (let routeIndex = 0; routeIndex < routes.length; routeIndex += 1) {
    throwIfBusComputationDeadlineExceeded(computationDeadlineMs, "route metric generation");
    const route = routes[routeIndex];
    if (routeIndex % 8 === 0) {
      await yieldToBrowser();
    }
    const routeMetrics = buildRouteDistanceMetrics(route, speedSettings);
    mergeBusSpeedDiagnostics(speedDiagnostics, routeMetrics.speedDiagnostics);
    const sampledPoints = sampleRouteMetricsBySpacing(routeMetrics, BUS_ROUTE_CORRIDOR_SAMPLE_SPACING_METRES);

    bandPointSets.forEach(({ band, metrics }) => {
      const bandTimeMinutes = Number(band.time);
      sampledPoints
        .filter((metric) => metric.minimumTotalBusAccessTimeMinutes < bandTimeMinutes)
        .forEach((metric) => metrics.push(metric));
    });
  }

  const outputs = [];
  for (const { band, metrics } of bandPointSets) {
    throwIfBusComputationDeadlineExceeded(computationDeadlineMs, "polygon smoothing");
    setStatus("Generating bus polygons", `Smoothing ${band.label} bus corridor geometry for map rendering.`, "running");
    render();
    await yieldToBrowser();
    const rings = buildSmoothedBusCatchmentRings(metrics);
    if (rings.length === 0) {
      continue;
    }
    outputs.push({
      geometry: {
        type: "MultiPolygon",
        coordinates: rings.map((ring) => [ring]),
      },
      label: band.label,
      color: band.fill,
      contour: Number(band.time),
      provider: "OpenStreetMap bus route corridor catchment",
      properties: {
        contour: Number(band.time),
        source: "OpenStreetMap bus route corridor catchment",
      },
    });
  }

  outputs.sort((a, b) => Number(b.contour) - Number(a.contour));
  outputs.speedDiagnostics = finaliseBusSpeedDiagnostics(speedDiagnostics);
  return outputs;
}

function buildSmoothedBusCatchmentRings(metrics) {
  const coordinates = dedupeCoordinates(
    metrics
      .map((metric) => metric.coordinate)
      .filter((coordinate) => coordinate && Number.isFinite(coordinate.latitude) && Number.isFinite(coordinate.longitude)),
    5
  );

  if (coordinates.length === 0) {
    return [];
  }

  const clusters = clusterCoordinatesByDistance(coordinates, BUS_CARTO_CLUSTER_LINK_METRES);
  const rings = [];

  clusters.forEach((cluster) => {
    const ring = buildSmoothedRingForCoordinateCluster(cluster);
    if (!ring || ring.length < 4) {
      return;
    }
    const area = getApproximateRingAreaSquareMetres(ring);
    if (area < BUS_CARTO_MIN_COMPONENT_AREA_SQ_M && cluster.length > 2) {
      return;
    }
    rings.push(ring);
  });

  return capPolygonRings(rings, Math.max(1, Math.floor(BUS_ROUTE_MAX_BUFFERS_PER_BAND / 10)));
}

function clusterCoordinatesByDistance(coordinates, linkDistanceMetres) {
  if (!Array.isArray(coordinates) || coordinates.length === 0) {
    return [];
  }

  const centroid = getCoordinateCentroid(coordinates);
  const cellSizeMetres = Math.max(1, Number(linkDistanceMetres) || 1);
  const projected = coordinates.map((coordinate) => projectCoordinateToLocalMetres(coordinate, centroid));
  const cellMembers = new Map();
  const visited = new Array(coordinates.length).fill(false);
  const clusters = [];

  projected.forEach((point, index) => {
    const cellX = Math.floor(point.x / cellSizeMetres);
    const cellY = Math.floor(point.y / cellSizeMetres);
    const key = `${cellX}|${cellY}`;
    if (!cellMembers.has(key)) {
      cellMembers.set(key, []);
    }
    cellMembers.get(key).push(index);
  });

  for (let seedIndex = 0; seedIndex < coordinates.length; seedIndex += 1) {
    if (visited[seedIndex]) {
      continue;
    }

    visited[seedIndex] = true;
    const clusterIndices = [seedIndex];
    const queue = [seedIndex];

    for (let queueIndex = 0; queueIndex < queue.length; queueIndex += 1) {
      const currentIndex = queue[queueIndex];
      const currentPoint = projected[currentIndex];
      const baseCellX = Math.floor(currentPoint.x / cellSizeMetres);
      const baseCellY = Math.floor(currentPoint.y / cellSizeMetres);

      for (let offsetX = -1; offsetX <= 1; offsetX += 1) {
        for (let offsetY = -1; offsetY <= 1; offsetY += 1) {
          const candidates = cellMembers.get(`${baseCellX + offsetX}|${baseCellY + offsetY}`) || [];
          candidates.forEach((candidateIndex) => {
            if (visited[candidateIndex]) {
              return;
            }
            const candidatePoint = projected[candidateIndex];
            const distance = Math.hypot(currentPoint.x - candidatePoint.x, currentPoint.y - candidatePoint.y);
            if (distance <= linkDistanceMetres) {
              visited[candidateIndex] = true;
              clusterIndices.push(candidateIndex);
              queue.push(candidateIndex);
            }
          });
        }
      }
    }

    clusters.push(clusterIndices.map((index) => coordinates[index]));
  }

  return clusters;
}

function buildSmoothedRingForCoordinateCluster(cluster) {
  if (cluster.length === 1) {
    return smoothRing(
      buildCoordinateBufferRing(cluster[0], BUS_CARTO_EFFECTIVE_BUFFER_METRES, 20),
      BUS_CARTO_SMOOTHING_ITERATIONS
    );
  }

  if (cluster.length === 2) {
    const segmentRing = buildBufferedRouteSegmentRing(cluster[0], cluster[1], BUS_CARTO_EFFECTIVE_BUFFER_METRES);
    return segmentRing ? smoothRing(segmentRing, BUS_CARTO_SMOOTHING_ITERATIONS) : null;
  }

  const expandedPoints = buildExpandedCoordinateCloud(cluster, BUS_CARTO_EFFECTIVE_BUFFER_METRES, BUS_CARTO_HULL_POINT_SEGMENTS);
  const hullRing = buildRadialEnvelopeHull(expandedPoints, BUS_CARTO_RADIAL_BINS);
  if (!hullRing || hullRing.length < 4) {
    return null;
  }
  return smoothRing(hullRing, BUS_CARTO_SMOOTHING_ITERATIONS);
}

function buildExpandedCoordinateCloud(coordinates, radiusMetres, segmentCount) {
  const expanded = [];
  coordinates.forEach((coordinate) => {
    expanded.push(coordinate);
    for (let index = 0; index < segmentCount; index += 1) {
      const bearing = (index / segmentCount) * 360;
      expanded.push(destinationPoint(coordinate.latitude, coordinate.longitude, bearing, radiusMetres));
    }
  });
  return dedupeCoordinates(expanded, 5);
}

function buildRadialEnvelopeHull(coordinates, binCount) {
  if (coordinates.length < 3) {
    return null;
  }

  const centroid = getCoordinateCentroid(coordinates);
  const bins = new Array(binCount).fill(null);

  coordinates.forEach((coordinate) => {
    const projected = projectCoordinateToLocalMetres(coordinate, centroid);
    const angle = Math.atan2(projected.y, projected.x);
    const distance = Math.hypot(projected.x, projected.y);
    const normalisedAngle = (angle + Math.PI * 2) % (Math.PI * 2);
    const binIndex = Math.min(binCount - 1, Math.floor((normalisedAngle / (Math.PI * 2)) * binCount));
    if (!bins[binIndex] || distance > bins[binIndex].distance) {
      bins[binIndex] = { coordinate, angle: normalisedAngle, distance };
    }
  });

  const hullPoints = bins
    .filter(Boolean)
    .sort((a, b) => a.angle - b.angle)
    .map((entry) => [entry.coordinate.longitude, entry.coordinate.latitude]);

  if (hullPoints.length < 3) {
    return null;
  }

  hullPoints.push([...hullPoints[0]]);
  return hullPoints;
}

function getCoordinateCentroid(coordinates) {
  const totals = coordinates.reduce(
    (accumulator, coordinate) => ({
      latitude: accumulator.latitude + coordinate.latitude,
      longitude: accumulator.longitude + coordinate.longitude,
    }),
    { latitude: 0, longitude: 0 }
  );
  return {
    latitude: totals.latitude / coordinates.length,
    longitude: totals.longitude / coordinates.length,
  };
}

function projectCoordinateToLocalMetres(coordinate, origin) {
  const metresPerDegreeLatitude = 111320;
  const metresPerDegreeLongitude = 111320 * Math.max(Math.cos((origin.latitude * Math.PI) / 180), 0.2);
  return {
    x: (coordinate.longitude - origin.longitude) * metresPerDegreeLongitude,
    y: (coordinate.latitude - origin.latitude) * metresPerDegreeLatitude,
  };
}

function smoothRing(ring, iterations) {
  let output = ring.map((point) => [...point]);
  for (let iteration = 0; iteration < iterations; iteration += 1) {
    output = chaikinSmoothClosedRing(output);
  }
  return closeRing(output);
}

function chaikinSmoothClosedRing(ring) {
  const openRing = ring.slice(0, -1);
  if (openRing.length < 3) {
    return ring;
  }

  const smoothed = [];
  for (let index = 0; index < openRing.length; index += 1) {
    const current = openRing[index];
    const next = openRing[(index + 1) % openRing.length];
    smoothed.push([
      current[0] * 0.75 + next[0] * 0.25,
      current[1] * 0.75 + next[1] * 0.25,
    ]);
    smoothed.push([
      current[0] * 0.25 + next[0] * 0.75,
      current[1] * 0.25 + next[1] * 0.75,
    ]);
  }
  return closeRing(smoothed);
}

function closeRing(ring) {
  if (!ring.length) {
    return ring;
  }
  const output = ring.map((point) => [...point]);
  const first = output[0];
  const last = output[output.length - 1];
  if (first[0] !== last[0] || first[1] !== last[1]) {
    output.push([...first]);
  }
  return output;
}

function getApproximateRingAreaSquareMetres(ring) {
  if (!ring || ring.length < 4) {
    return 0;
  }
  const centroid = getCoordinateCentroid(
    ring.slice(0, -1).map(([longitude, latitude]) => ({ latitude, longitude }))
  );
  const projectedRing = ring.map(([longitude, latitude]) =>
    projectCoordinateToLocalMetres({ latitude, longitude }, centroid)
  );
  let area = 0;
  for (let index = 0; index < projectedRing.length - 1; index += 1) {
    const current = projectedRing[index];
    const next = projectedRing[index + 1];
    area += current.x * next.y - next.x * current.y;
  }
  return Math.abs(area) / 2;
}

function areRouteMetricsContiguous(previousMetric, currentMetric) {
  if (!previousMetric || !currentMetric) {
    return false;
  }
  const routeDistanceGap = Math.abs(Number(currentMetric.cumulativeDistance) - Number(previousMetric.cumulativeDistance));
  return Number.isFinite(routeDistanceGap) && routeDistanceGap <= BUS_ROUTE_CORRIDOR_SAMPLE_SPACING_METRES * 1.75;
}

function buildBufferedRouteSegmentRing(startCoordinate, endCoordinate, radiusMetres) {
  const segmentLength = getDistanceMetres(
    startCoordinate.latitude,
    startCoordinate.longitude,
    endCoordinate.latitude,
    endCoordinate.longitude
  );
  if (!Number.isFinite(segmentLength) || segmentLength < 25) {
    return null;
  }

  const bearing = getInitialBearingDegrees(startCoordinate, endCoordinate);
  const startLeft = destinationPoint(startCoordinate.latitude, startCoordinate.longitude, bearing - 90, radiusMetres);
  const endLeft = destinationPoint(endCoordinate.latitude, endCoordinate.longitude, bearing - 90, radiusMetres);
  const endRight = destinationPoint(endCoordinate.latitude, endCoordinate.longitude, bearing + 90, radiusMetres);
  const startRight = destinationPoint(startCoordinate.latitude, startCoordinate.longitude, bearing + 90, radiusMetres);

  return [
    [startLeft.longitude, startLeft.latitude],
    [endLeft.longitude, endLeft.latitude],
    [endRight.longitude, endRight.latitude],
    [startRight.longitude, startRight.latitude],
    [startLeft.longitude, startLeft.latitude],
  ];
}

function getInitialBearingDegrees(startCoordinate, endCoordinate) {
  const phi1 = (startCoordinate.latitude * Math.PI) / 180;
  const phi2 = (endCoordinate.latitude * Math.PI) / 180;
  const lambda1 = (startCoordinate.longitude * Math.PI) / 180;
  const lambda2 = (endCoordinate.longitude * Math.PI) / 180;
  const deltaLambda = lambda2 - lambda1;
  const y = Math.sin(deltaLambda) * Math.cos(phi2);
  const x = Math.cos(phi1) * Math.sin(phi2) -
    Math.sin(phi1) * Math.cos(phi2) * Math.cos(deltaLambda);
  return ((Math.atan2(y, x) * 180) / Math.PI + 360) % 360;
}


function classifyBusRouteHighwayClass(tagsOrCoordinate = {}) {
  const tags = tagsOrCoordinate.wayTags || tagsOrCoordinate;
  const rawHighway = String(tags.highway || tags.highwayClass || "").toLowerCase();
  const hasBuswayTag = Boolean(tags.busway) || rawHighway === "busway" || /bus_?guideway/i.test(rawHighway);
  const psv = String(tags.psv || "").toLowerCase();
  const bus = String(tags.bus || "").toLowerCase();
  if (hasBuswayTag || psv === "designated" || bus === "designated") {
    return "busway";
  }
  if (rawHighway.startsWith("motorway")) {
    return "motorway";
  }
  if (rawHighway.startsWith("trunk")) {
    return "trunk";
  }
  if (rawHighway.startsWith("primary")) {
    return "primary";
  }
  if (rawHighway.startsWith("secondary")) {
    return "secondary";
  }
  if (rawHighway.startsWith("tertiary")) {
    return "tertiary";
  }
  if (rawHighway === "unclassified") {
    return "unclassified";
  }
  if (rawHighway === "residential") {
    return "residential";
  }
  if (rawHighway === "living_street") {
    return "living_street";
  }
  if (rawHighway === "service") {
    return "service";
  }
  return "unknown";
}

function getBusSegmentSpeedKph(previousCoordinate, currentCoordinate, speedSettings = getSelectedBusSpeedSettings()) {
  const settings = normaliseBusSpeedSettings(speedSettings);
  const highwayClass = settings.mode === BUS_SPEED_MODEL_ROAD_TYPE
    ? classifyBusRouteHighwayClass(currentCoordinate?.highwayClass ? currentCoordinate : previousCoordinate)
    : "flat";
  if (settings.mode !== BUS_SPEED_MODEL_ROAD_TYPE) {
    return {
      highwayClass,
      appliedSpeedKph: settings.flatSpeedKph,
      baseSpeedKph: settings.flatSpeedKph,
      maxspeedKph: null,
      maxspeedAppliedAsCap: false,
      usedFallbackHighwayClass: false,
    };
  }
  const roadClass = highwayClass === "flat" ? "unknown" : highwayClass;
  const baseSpeedKph = Number(settings.roadTypeSpeedsKph[roadClass]) || settings.flatSpeedKph;
  const maxspeedKph = parseOsmMaxspeedToKph(currentCoordinate?.maxspeed || previousCoordinate?.maxspeed || "");
  const appliedSpeedKph = Number.isFinite(maxspeedKph) && maxspeedKph > 0
    ? Math.min(baseSpeedKph, maxspeedKph)
    : baseSpeedKph;
  return {
    highwayClass: roadClass,
    appliedSpeedKph: Math.max(1, appliedSpeedKph),
    baseSpeedKph,
    maxspeedKph: Number.isFinite(maxspeedKph) ? maxspeedKph : null,
    maxspeedAppliedAsCap: Number.isFinite(maxspeedKph) && maxspeedKph > 0 && maxspeedKph < baseSpeedKph,
    usedFallbackHighwayClass: roadClass === "unknown",
  };
}

function parseOsmMaxspeedToKph(value) {
  const raw = String(value || "").trim().toLowerCase();
  if (!raw || raw === "signals" || raw === "none" || raw === "walk") {
    return null;
  }
  if (raw === "national" || raw === "nsl") {
    return null;
  }
  const match = raw.match(/(\d+(?:\.\d+)?)/);
  if (!match) {
    return null;
  }
  const numeric = Number(match[1]);
  if (!Number.isFinite(numeric) || numeric <= 0) {
    return null;
  }
  return /mph/.test(raw) ? numeric * MPH_TO_KPH : numeric;
}

function createBusSpeedDiagnostics(speedSettings) {
  const settings = normaliseBusSpeedSettings(speedSettings);
  return {
    speedModel: settings.mode,
    speedModelLabel: getBusSpeedModelLabel(settings.mode),
    flatSpeedKph: settings.flatSpeedKph,
    roadTypeSpeedsKph: settings.mode === BUS_SPEED_MODEL_ROAD_TYPE ? settings.roadTypeSpeedsKph : undefined,
    classSummaries: new Map(),
    totalDistanceMetres: 0,
    totalTravelTimeMinutes: 0,
    maxspeedCapSegmentCount: 0,
    fallbackSegmentCount: 0,
    segmentCount: 0,
  };
}

function summariseBusSegmentSpeedDiagnostics(segmentDiagnostics, speedSettings) {
  const diagnostics = createBusSpeedDiagnostics(speedSettings);
  segmentDiagnostics.forEach((segment) => addBusSpeedDiagnosticSegment(diagnostics, segment));
  return finaliseBusSpeedDiagnostics(diagnostics);
}

function addBusSpeedDiagnosticSegment(diagnostics, segment) {
  if (!segment || !Number.isFinite(segment.distanceMetres)) {
    return;
  }
  diagnostics.segmentCount += 1;
  diagnostics.totalDistanceMetres += segment.distanceMetres;
  diagnostics.totalTravelTimeMinutes += Number(segment.travelTimeMinutes) || 0;
  if (segment.maxspeedAppliedAsCap) {
    diagnostics.maxspeedCapSegmentCount += 1;
  }
  if (segment.usedFallbackHighwayClass) {
    diagnostics.fallbackSegmentCount += 1;
  }
  const roadClass = segment.highwayClass || "unknown";
  if (!diagnostics.classSummaries.has(roadClass)) {
    diagnostics.classSummaries.set(roadClass, {
      highwayClass: roadClass,
      distanceMetres: 0,
      travelTimeMinutes: 0,
      segmentCount: 0,
      speedKphValues: [],
      maxspeedCapSegmentCount: 0,
    });
  }
  const entry = diagnostics.classSummaries.get(roadClass);
  entry.distanceMetres += segment.distanceMetres;
  entry.travelTimeMinutes += Number(segment.travelTimeMinutes) || 0;
  entry.segmentCount += 1;
  if (Number.isFinite(segment.appliedSpeedKph)) {
    entry.speedKphValues.push(segment.appliedSpeedKph);
  }
  if (segment.maxspeedAppliedAsCap) {
    entry.maxspeedCapSegmentCount += 1;
  }
}

function mergeBusSpeedDiagnostics(target, source) {
  if (!source) {
    return;
  }
  const summaries = source.classSummaries || source.distanceAndTimeByRoadClass || [];
  (Array.isArray(summaries) ? summaries : Array.from(summaries.values())).forEach((entry) => {
    const segment = {
      highwayClass: entry.highwayClass,
      distanceMetres: entry.distanceMetres,
      travelTimeMinutes: entry.travelTimeMinutes,
      appliedSpeedKph: entry.averageAppliedSpeedKph,
      maxspeedAppliedAsCap: entry.maxspeedCapSegmentCount > 0,
      usedFallbackHighwayClass: entry.highwayClass === "unknown",
    };
    if (!target.classSummaries.has(entry.highwayClass)) {
      target.classSummaries.set(entry.highwayClass, {
        highwayClass: entry.highwayClass,
        distanceMetres: 0,
        travelTimeMinutes: 0,
        segmentCount: 0,
        speedKphValues: [],
        maxspeedCapSegmentCount: 0,
      });
    }
    const targetEntry = target.classSummaries.get(entry.highwayClass);
    targetEntry.distanceMetres += Number(entry.distanceMetres) || 0;
    targetEntry.travelTimeMinutes += Number(entry.travelTimeMinutes) || 0;
    targetEntry.segmentCount += Number(entry.segmentCount) || 0;
    if (Number.isFinite(Number(entry.averageAppliedSpeedKph))) {
      targetEntry.speedKphValues.push(Number(entry.averageAppliedSpeedKph));
    }
    targetEntry.maxspeedCapSegmentCount += Number(entry.maxspeedCapSegmentCount) || 0;
    target.totalDistanceMetres += Number(entry.distanceMetres) || 0;
    target.totalTravelTimeMinutes += Number(entry.travelTimeMinutes) || 0;
    target.segmentCount += Number(entry.segmentCount) || 0;
  });
  target.maxspeedCapSegmentCount += Number(source.maxspeedCapSegmentCount) || 0;
  target.fallbackSegmentCount += Number(source.fallbackSegmentCount) || 0;
}

function finaliseBusSpeedDiagnostics(diagnostics) {
  if (!diagnostics) {
    return null;
  }
  const classSummaries = Array.from(diagnostics.classSummaries?.values?.() ?? diagnostics.classSummaries ?? [])
    .map((entry) => ({
      highwayClass: entry.highwayClass,
      distanceMetres: Math.round(entry.distanceMetres),
      travelTimeMinutes: Math.round(entry.travelTimeMinutes * 10) / 10,
      segmentCount: entry.segmentCount,
      averageAppliedSpeedKph: entry.speedKphValues?.length
        ? Math.round((entry.speedKphValues.reduce((sum, value) => sum + value, 0) / entry.speedKphValues.length) * 10) / 10
        : null,
      maxspeedCapSegmentCount: entry.maxspeedCapSegmentCount || 0,
    }))
    .sort((a, b) => BUS_ROAD_TYPE_CLASS_ORDER.indexOf(a.highwayClass) - BUS_ROAD_TYPE_CLASS_ORDER.indexOf(b.highwayClass));
  return {
    speedModel: diagnostics.speedModel,
    speedModelLabel: diagnostics.speedModelLabel,
    flatSpeedKph: Math.round(diagnostics.flatSpeedKph * 10) / 10,
    roadTypeSpeedsKph: diagnostics.roadTypeSpeedsKph,
    totalDistanceMetres: Math.round(diagnostics.totalDistanceMetres),
    totalTravelTimeMinutes: Math.round(diagnostics.totalTravelTimeMinutes * 10) / 10,
    segmentCount: diagnostics.segmentCount,
    fallbackSegmentCount: diagnostics.fallbackSegmentCount,
    maxspeedCapSegmentCount: diagnostics.maxspeedCapSegmentCount,
    distanceAndTimeByRoadClass: classSummaries,
  };
}

function buildRouteDistanceMetrics(route, busSpeedSettings = getSelectedBusSpeedSettings()) {
  const speedSettings = normaliseBusSpeedSettings(busSpeedSettings);
  const coordinates = route.coordinates;
  const cumulativeDistances = [0];
  const cumulativeTravelTimes = [0];
  const segmentDiagnostics = [];

  for (let index = 1; index < coordinates.length; index += 1) {
    const previous = coordinates[index - 1];
    const current = coordinates[index];
    const segmentDistance = getDistanceMetres(previous.latitude, previous.longitude, current.latitude, current.longitude);
    const segmentSpeed = getBusSegmentSpeedKph(previous, current, speedSettings);
    const segmentSpeedMetresPerMinute = (segmentSpeed.appliedSpeedKph * 1000) / 60;
    const segmentTravelTimeMinutes = segmentDistance / segmentSpeedMetresPerMinute;
    cumulativeDistances.push(cumulativeDistances[index - 1] + segmentDistance);
    cumulativeTravelTimes.push(cumulativeTravelTimes[index - 1] + segmentTravelTimeMinutes);
    segmentDiagnostics.push({
      highwayClass: segmentSpeed.highwayClass,
      appliedSpeedKph: segmentSpeed.appliedSpeedKph,
      baseSpeedKph: segmentSpeed.baseSpeedKph,
      maxspeedKph: segmentSpeed.maxspeedKph,
      maxspeedAppliedAsCap: segmentSpeed.maxspeedAppliedAsCap,
      usedFallbackHighwayClass: segmentSpeed.usedFallbackHighwayClass,
      distanceMetres: segmentDistance,
      travelTimeMinutes: segmentTravelTimeMinutes,
    });
  }

  const accessStates = (route.accessAnchors ?? [])
    .map((anchor) => {
      const nearest = findNearestRoutePoint(anchor.coordinate, coordinates);
      if (!nearest || !Number.isInteger(nearest.index)) {
        return null;
      }
      return {
        anchor,
        index: nearest.index,
        cumulativeDistance: cumulativeDistances[nearest.index],
        cumulativeTravelTime: cumulativeTravelTimes[nearest.index],
        accessWalkTimeMinutes: anchor.accessWalkTimeMinutes,
      };
    })
    .filter((accessState) =>
      accessState && Number.isFinite(accessState.cumulativeDistance) && Number.isFinite(accessState.cumulativeTravelTime) && Number.isFinite(accessState.accessWalkTimeMinutes)
    );

  const metrics = coordinates.map((coordinate, index) => {
    let bestAccess = null;
    accessStates.forEach((accessState) => {
      const routeDistanceFromAccess = Math.abs(cumulativeDistances[index] - accessState.cumulativeDistance);
      const inVehicleBusMinutes = Math.abs(cumulativeTravelTimes[index] - accessState.cumulativeTravelTime);
      const totalMinutes = accessState.accessWalkTimeMinutes + inVehicleBusMinutes;
      if (!bestAccess || totalMinutes < bestAccess.minimumTotalBusAccessTimeMinutes) {
        bestAccess = {
          routeDistanceFromAccess,
          inVehicleBusMinutes,
          minimumTotalBusAccessTimeMinutes: totalMinutes,
          accessWalkTimeMinutes: accessState.accessWalkTimeMinutes,
          accessWalkDistanceMetres: accessState.anchor.accessWalkDistanceMetres,
          accessDistanceSource: accessState.anchor.accessDistanceSource,
          accessAnchorType: accessState.anchor.accessAnchorType,
        };
      }
    });

    const precedingSegment = segmentDiagnostics[Math.max(0, index - 1)] ?? null;
    return {
      coordinate,
      index,
      cumulativeDistance: cumulativeDistances[index],
      cumulativeTravelTimeMinutes: cumulativeTravelTimes[index],
      distanceFromAccess: bestAccess?.routeDistanceFromAccess ?? Infinity,
      inVehicleBusMinutes: bestAccess?.inVehicleBusMinutes ?? Infinity,
      minimumTotalBusAccessTimeMinutes: bestAccess?.minimumTotalBusAccessTimeMinutes ?? Infinity,
      accessWalkTimeMinutes: bestAccess?.accessWalkTimeMinutes ?? Infinity,
      accessWalkDistanceMetres: bestAccess?.accessWalkDistanceMetres ?? Infinity,
      accessDistanceSource: bestAccess?.accessDistanceSource ?? "unavailable",
      accessAnchorType: bestAccess?.accessAnchorType ?? "unavailable",
      highwayClass: precedingSegment?.highwayClass ?? classifyBusRouteHighwayClass(coordinate),
      appliedBusSpeedKph: precedingSegment?.appliedSpeedKph ?? speedSettings.flatSpeedKph,
      speedModel: speedSettings.mode,
    };
  });
  metrics.speedDiagnostics = summariseBusSegmentSpeedDiagnostics(segmentDiagnostics, speedSettings);
  return metrics;
}

function sampleRouteMetricsBySpacing(routeMetrics, spacingMetres) {
  const sampled = [];
  let lastKeptDistance = -Infinity;

  routeMetrics.forEach((metric, index) => {
    if (
      index === 0 ||
      index === routeMetrics.length - 1 ||
      metric.cumulativeDistance - lastKeptDistance >= spacingMetres ||
      metric.distanceFromAccess === 0
    ) {
      sampled.push(metric);
      lastKeptDistance = metric.cumulativeDistance;
    }
  });

  return sampled;
}

function buildCoordinateBufferRing(coordinate, radiusMetres, segmentCount = 10) {
  const ring = [];
  for (let index = 0; index < segmentCount; index += 1) {
    const bearing = (index / segmentCount) * 360;
    const point = destinationPoint(coordinate.latitude, coordinate.longitude, bearing, radiusMetres);
    ring.push([point.longitude, point.latitude]);
  }
  ring.push([...ring[0]]);
  return ring;
}

function capPolygonRings(rings, maxRings) {
  if (rings.length <= maxRings) {
    return rings;
  }
  const interval = Math.ceil(rings.length / maxRings);
  return rings.filter((_, index) => index % interval === 0).slice(0, maxRings);
}

function getBusContourSourceNote() {
  if (state.lastIsochroneSourceNote) {
    return state.lastIsochroneSourceNote;
  }
  return buildOsmBusRouteSourceNote();
}

function buildBusMethodLimitationText(metadata = {}) {
  if ((metadata.provider || "").includes("BODS") || getSelectedBusMethod() === BUS_METHOD_BODS) {
    const maximumWalkToBusStopMetres = Number.isFinite(Number(metadata.maximumWalkToBusStopMetres))
      ? Number(metadata.maximumWalkToBusStopMetres)
      : getSelectedBusMaxWalkToStopMetres() || BUS_MAX_WALK_TO_STOP_DEFAULT_METRES;
    return `Bus catchments are timetable-based outputs generated from Bus Open Data Service timetable data where local TransXChange files can be parsed. Initial walking access is limited to ${Math.round(maximumWalkToBusStopMetres).toLocaleString("en-GB")} m and transfer walking is estimated within ${BODS_TRANSFER_RADIUS_METRES.toLocaleString("en-GB")} m using straight-line distance multiplied by 1.3 and ${BUS_ACCESS_WALK_SPEED_KPH} kph / ${Math.round(BUS_ACCESS_WALK_SPEED_METRES_PER_MINUTE)} m per minute walking speed. Scheduled wait time and bus in-vehicle running time are taken from parsed BODS stop-to-stop timetable links. Outputs do not include live disruption, reliability, cancellations, vehicle crowding or fare integration.`;
  }
  const speedSummary = buildBusSpeedMethodSummary(metadata);
  const maximumWalkToBusStopMetres = Number.isFinite(Number(metadata.maximumWalkToBusStopMetres))
    ? Number(metadata.maximumWalkToBusStopMetres)
    : getSelectedBusMaxWalkToStopMetres() || BUS_MAX_WALK_TO_STOP_DEFAULT_METRES;
  return `Bus catchments are indicative OpenStreetMap bus-route corridor outputs. They are generated from mapped OSM bus route relations serving stops within ${Math.round(maximumWalkToBusStopMetres).toLocaleString("en-GB")} m walking access of the site/access point. Pedestrian access to the boarding stop is based on a ${BUS_ACCESS_WALK_SPEED_KPH} kph walking speed, with straight-line fallback distances multiplied by 1.3 where routed pedestrian distance is unavailable, and is deducted before in-vehicle bus travel is applied using ${speedSummary}. The polygons are cartographically smoothed for presentation and should not be interpreted as precise network-coverage boundaries. The outputs do not include timetable availability, service frequency, waiting time, interchanges, disruption or live running.`;
}

function buildBusSpeedMethodSummary(metadata = {}) {
  const speedKph = Number.isFinite(Number(metadata.busSpeedKph))
    ? Number(metadata.busSpeedKph)
    : getSelectedBusSpeedKph() ?? BUS_DEFAULT_SPEED_KPH;
  const speedMph = Number.isFinite(Number(metadata.busSpeedMph))
    ? Number(metadata.busSpeedMph)
    : speedKph / MPH_TO_KPH;
  const speedModel = metadata.busSpeedModel || getSelectedBusSpeedModel();
  if (speedModel === BUS_SPEED_MODEL_ROAD_TYPE) {
    const fallbackCount = Number(metadata.roadTypeSpeedDiagnostics?.fallbackSegmentCount);
    const fallbackText = Number.isFinite(fallbackCount) && fallbackCount > 0
      ? ` Segments without usable OSM highway tags used the fallback flat speed (${formatBusSpeedMph(speedMph)} mph / ${formatBusSpeedKph(speedKph)} kph).`
      : "";
    return `a road-type weighted OSM highway speed profile, with motorway/trunk/primary/local-road classes assigned modelled average speeds and maxspeed tags used only as upper constraints where present.${fallbackText}`;
  }
  return `the selected flat average speed of ${formatBusSpeedMph(speedMph)} mph (${formatBusSpeedKph(speedKph)} kph)`;
}

function buildOsmBusRouteSourceNote(metadata = {}) {
  const speedKph = Number.isFinite(Number(metadata.busSpeedKph))
    ? Number(metadata.busSpeedKph)
    : getSelectedBusSpeedKph() ?? BUS_DEFAULT_SPEED_KPH;
  const speedMph = Number.isFinite(Number(metadata.busSpeedMph))
    ? Number(metadata.busSpeedMph)
    : speedKph / MPH_TO_KPH;
  const bandText = metadata.bandCount
    ? ` Generated ${metadata.bandCount} indicative bus catchment band${metadata.bandCount === 1 ? "" : "s"}.`
    : "";
  const routeText = Number.isFinite(Number(metadata.routeCount))
    ? ` Based on ${metadata.routeCount} accessible mapped bus route${metadata.routeCount === 1 ? "" : "s"}.`
    : "";
  const accessSourceText = metadata.accessDistanceSources?.length
    ? ` Access walking distance source: ${metadata.accessDistanceSources.join(" and ")}.`
    : " Access walking distance source: Valhalla pedestrian route where available, otherwise straight-line fallback where required.";
  const fallbackText = Number.isFinite(Number(metadata.straightLineFallbackAccessAnchorCount)) && Number(metadata.straightLineFallbackAccessAnchorCount) > 0
    ? ` Straight-line fallback was used for ${metadata.straightLineFallbackAccessAnchorCount} access anchor${Number(metadata.straightLineFallbackAccessAnchorCount) === 1 ? "" : "s"}.`
    : "";
  const maximumWalkToBusStopMetres = Number.isFinite(Number(metadata.maximumWalkToBusStopMetres))
    ? Number(metadata.maximumWalkToBusStopMetres)
    : getSelectedBusMaxWalkToStopMetres() || BUS_MAX_WALK_TO_STOP_DEFAULT_METRES;
  const stopSearchText = Number.isFinite(Number(metadata.stopSearchRadiusMetres))
    ? ` Eligible boarding stops were limited to ${Math.round(maximumWalkToBusStopMetres).toLocaleString("en-GB")} m walking access from the selected origin. OSM stop/relation discovery used an approximately ${Math.round(metadata.stopSearchRadiusMetres).toLocaleString("en-GB")} m straight-line pre-filter before routed walking checks.`
    : ` Eligible boarding stops were limited to ${Math.round(maximumWalkToBusStopMetres).toLocaleString("en-GB")} m walking access from the selected origin.`;
  const speedModelText = buildBusSpeedMethodSummary(metadata);
  const roadDiagnosticsText = metadata.roadTypeSpeedDiagnostics?.distanceAndTimeByRoadClass?.length
    ? ` Road-type diagnostics: ${metadata.roadTypeSpeedDiagnostics.distanceAndTimeByRoadClass.map((entry) => `${entry.highwayClass} ${Math.round(entry.distanceMetres).toLocaleString("en-GB")} m / ${entry.travelTimeMinutes} min`).join("; ")}.`
    : "";
  const accessDiagnosticsText = Number.isFinite(Number(metadata.candidateBusStopCountBeforeWalkFilter))
    ? ` Boarding-stop diagnostics: ${Number(metadata.candidateBusStopCountBeforeWalkFilter).toLocaleString("en-GB")} candidate stop${Number(metadata.candidateBusStopCountBeforeWalkFilter) === 1 ? "" : "s"} before routed filtering; ${Number(metadata.retainedBusStopCountAfterWalkFilter || 0).toLocaleString("en-GB")} retained within the selected walk limit; ${Number(metadata.excludedBusStopCountByWalkLimit || 0).toLocaleString("en-GB")} excluded or unused after the walk-distance filter; ${Number(metadata.selectedBusRouteRelationCount || metadata.routeCount || 0).toLocaleString("en-GB")} route relation${Number(metadata.selectedBusRouteRelationCount || metadata.routeCount || 0) === 1 ? "" : "s"} selected.`
    : "";
  return `${OSM_BUS_ROUTE_METHOD_NOTE} Assumptions: ${BUS_ACCESS_WALK_SPEED_KPH} kph access walking speed, maximum walk to bus stop ${Math.round(maximumWalkToBusStopMetres).toLocaleString("en-GB")} m, ${speedModelText}, ${BUS_DESTINATION_BUFFER_METRES} m corridor/destination buffer and ${BUS_CARTO_OUTWARD_BUFFER_METRES} m cartographic gap-closing/smoothing allowance. Each band time includes the access walk first; only remaining time is applied to in-vehicle bus travel. Stops beyond the selected maximum walking distance do not contribute to any band. No wait time is included.${stopSearchText}${accessSourceText}${fallbackText}${accessDiagnosticsText}${routeText}${bandText}${roadDiagnosticsText}`;
}

function destinationPoint(latitude, longitude, bearingDegrees, distanceMetres) {
  const earthRadius = 6371000;
  const angularDistance = distanceMetres / earthRadius;
  const bearing = (bearingDegrees * Math.PI) / 180;
  const phi1 = (latitude * Math.PI) / 180;
  const lambda1 = (longitude * Math.PI) / 180;

  const sinPhi2 = Math.sin(phi1) * Math.cos(angularDistance) +
    Math.cos(phi1) * Math.sin(angularDistance) * Math.cos(bearing);
  const phi2 = Math.asin(sinPhi2);
  const y = Math.sin(bearing) * Math.sin(angularDistance) * Math.cos(phi1);
  const x = Math.cos(angularDistance) - Math.sin(phi1) * sinPhi2;
  const lambda2 = lambda1 + Math.atan2(y, x);

  return {
    latitude: (phi2 * 180) / Math.PI,
    longitude: (((lambda2 * 180) / Math.PI + 540) % 360) - 180,
  };
}


function buildGeometricFallbackIsochrones(originCoordinates, mode, context = {}) {
  if (mode === "bus") {
    const primaryReason = context.triggerError?.userMessage || context.triggerError?.message || String(context.triggerError || "");
    const fallbackIsochrones = [];
    fallbackIsochrones.fallbackNotice = `${OSM_BUS_ROUTE_UNAVAILABLE_NOTICE}${primaryReason ? ` Reason: ${primaryReason}` : ""}`;
    fallbackIsochrones.sourceNote = `${OSM_BUS_ROUTE_UNAVAILABLE_NOTICE} Do not use straight-line rings for bus catchments.`;
    fallbackIsochrones.metadata = {
      provider: "No bus network geometry generated",
      intendedProvider: "OpenStreetMap bus route corridor catchment",
      fallbackReason: primaryReason,
      caveat: "No indicative bus catchment polygon generated because routed network geometry was unavailable.",
    };
    return fallbackIsochrones;
  }
  const modeConfig = MODE_CONFIG[mode];
  const configuredBands = getConfiguredBandsForMode(mode);
  const fallbackIsochrones = configuredBands
    .map((band) => {
      const radiusMetres = getGeometricFallbackRadiusMetres(band, mode);
      if (!Number.isFinite(radiusMetres) || radiusMetres <= 0) {
        return null;
      }
      return {
        geometry: buildCircularPolygon(originCoordinates, radiusMetres),
        label: band.label,
        color: band.fill,
        contour: modeConfig.metric === "distance" ? radiusMetres : Number(band.time),
        provider: context.provider || "Indicative straight-line fallback",
        properties: {
          contour: modeConfig.metric === "distance" ? radiusMetres : Number(band.time),
          source: context.provider || "Indicative straight-line fallback",
        },
      };
    })
    .filter(Boolean)
    .sort((a, b) => Number(b.contour) - Number(a.contour));

  const primaryReason = context.triggerError?.userMessage || context.triggerError?.message || String(context.triggerError || "");
  const secondaryReason = context.secondaryError?.userMessage || context.secondaryError?.message || "";
  const reasonParts = [primaryReason, secondaryReason].filter(Boolean);
  const reasonText = reasonParts.length ? ` Reason: ${reasonParts.join(" / ")}` : "";
  const baseNotice = GEOMETRIC_FALLBACK_NOTICE;
  const methodText = `${baseNotice}${reasonText}`;

  fallbackIsochrones.fallbackNotice = `${baseNotice}${reasonText}`;
  fallbackIsochrones.sourceNote = methodText;
  fallbackIsochrones.metadata = {
    provider: context.provider || "Indicative straight-line fallback",
    intendedProvider: mode === "bus"
      ? "Indicative bus bus-route corridor catchment"
      : mode === "walking"
        ? "OpenStreetMap-derived walking network catchment"
        : "OpenStreetMap-derived cycling network catchment",
    fallbackReason: reasonParts.join(" / "),
    caveat: "Indicative geometric fallback only; not a routed network catchment.",
  };
  return fallbackIsochrones;
}

function getGeometricFallbackRadiusMetres(band, mode) {
  if (mode === "bus") {
    return Number.NaN;
  }
  if (Number.isFinite(Number(band.distance))) {
    return Number(band.distance) * 1000;
  }
  return Number(band.time) * 80;
}

function buildCircularPolygon(originCoordinates, radiusMetres, segmentCount = 96) {
  const ring = [];
  for (let index = 0; index < segmentCount; index += 1) {
    const bearing = (index / segmentCount) * 360;
    const point = destinationPoint(
      originCoordinates.latitude,
      originCoordinates.longitude,
      bearing,
      radiusMetres
    );
    ring.push([point.longitude, point.latitude]);
  }
  ring.push([...ring[0]]);
  return {
    type: "Polygon",
    coordinates: [ring],
  };
}

async function fetchValhallaIsochronesForScenario(originCoordinates, mode, options = {}) {
  const modeConfig = MODE_CONFIG[mode];
  const configuredBands = getConfiguredBandsForMode(mode);
  const contours = configuredBands.map((band) => {
    if (modeConfig.metric === "distance") {
      return { distance: band.distance, color: band.fill.replace("#", "") };
    }
    return { time: band.time, color: band.fill.replace("#", "") };
  });

  const request = {
    locations: [
      {
        lat: originCoordinates.latitude,
        lon: originCoordinates.longitude,
      },
    ],
    costing: modeConfig.costing,
    contours,
    polygons: true,
    denoise: 0.5,
    generalize: 5,
    show_locations: false,
  };

  if (mode === "bus") {
    request.date_time = {
      type: 0,
    };
  }

  const payload = await fetchValhallaIsochronePayloadWithRetry(request, mode, options);
  if (payload.error) {
    throw createServiceError(
      "Valhalla isochrone",
      classifyRoutingPayloadKind(payload.error),
      buildServiceKindMessage(
        "Valhalla isochrone",
        classifyRoutingPayloadKind(payload.error),
        normaliseServiceMessage("Valhalla isochrone", payload.error)
      )
    );
  }
  if (!Array.isArray(payload.features) || payload.features.length === 0) {
    throw createServiceError(
      "Valhalla isochrone",
      "unavailable_routing_data",
      `Valhalla did not return any ${modeConfig.label.toLowerCase()} catchment geometry for the selected location.`
    );
  }
  return transformIsochroneFeatures(payload.features ?? [], modeConfig, configuredBands);
}

async function fetchValhallaIsochronePayloadWithRetry(request, mode, options = {}) {
  const maxAttempts = 2;
  let lastError = null;

  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    try {
      const requestUrl = new URL(VALHALLA_ISOCHRONE_ENDPOINT, window.location.origin);
      requestUrl.searchParams.set("json", JSON.stringify(request));
      return await fetchJsonWithDiagnostics(
        requestUrl.toString(),
        { signal: options.signal },
        "Valhalla isochrone"
      );
    } catch (error) {
      if (error?.kind === "cancelled") {
        throw error;
      }
      lastError = error;
      if (!shouldRetryValhallaIsochroneError(error) || attempt === maxAttempts) {
        break;
      }
      await waitForRetryDelay(900);
    }
  }

  if (shouldRetryValhallaIsochroneError(lastError)) {
    throw createServiceError(
      "Valhalla isochrone",
      "api_outage",
      "Valhalla is temporarily unavailable. Please try again shortly. If this continues, the public routing service may be overloaded."
    );
  }

  throw lastError;
}

function shouldRetryValhallaIsochroneError(error) {
  return error?.kind === "api_outage" || error?.kind === "rate_limit";
}

function waitForRetryDelay(delayMs) {
  return new Promise((resolve) => {
    setTimeout(resolve, delayMs);
  });
}

function transformIsochroneFeatures(features, modeConfig, configuredBands) {
  const bandByLabel = new Map(configuredBands.map((band) => [band.label, band]));
  const bandByMetric = new Map(
    configuredBands.map((band) => [
      modeConfig.metric === "distance" ? String(band.distance) : String(band.time),
      band,
    ])
  );

  return features
    .filter((feature) => feature.geometry)
    .map((feature) => {
      const contourValue = feature.properties?.contour;
      const matchedBand =
        bandByMetric.get(String(contourValue)) ||
        bandByLabel.get(feature.properties?.name || "");
      return {
        geometry: feature.geometry,
        label: matchedBand?.label ?? String(contourValue),
        color: matchedBand?.fill ?? `#${feature.properties?.color ?? "888888"}`,
        contour: contourValue,
      };
    })
    .sort((a, b) => Number(b.contour) - Number(a.contour));
}

function transformOverpassElements(elements, siteCoordinates, mode) {
  const grouped = new Map();

  elements.forEach((element) => {
    const category = classifyAmenity(element.tags ?? {}, mode);
    if (!category) {
      return;
    }

    const latitude = element.lat ?? element.center?.lat;
    const longitude = element.lon ?? element.center?.lon;
    if (latitude === undefined || longitude === undefined) {
      return;
    }

    const sourceId = `${element.type}/${element.id}`;
    const distance = getDistanceMetres(
      siteCoordinates.latitude,
      siteCoordinates.longitude,
      latitude,
      longitude
    );
    const amenity = {
      id: 0,
      sourceId,
      latitude,
      longitude,
      name: deriveAmenityName(element.tags ?? {}, category),
      category,
      symbol: "circle",
      color: AMENITY_COLOR_PALETTE[0],
      visible: true,
      showInLegend: true,
      distance,
      isManual: false,
      placeType: element.tags?.place || "",
    };

    if (!grouped.has(category)) {
      grouped.set(category, []);
      }
      grouped.get(category).push(amenity);
    });

  return selectAmenitiesFromGroupedResults(grouped, mode);
}

function selectAmenitiesFromGroupedResults(grouped, mode) {
  const categoryOrder = getCategoryOrderForMode(mode);
  const categoryLimits = getCategoryLimitsForMode(mode);
  const legendLimit = getLegendLimitForMode(mode);
  const selected = [];
  const siteCoordinates = state.generatedScenario?.siteCoordinates ?? null;

  categoryOrder.forEach((category) => {
    const items = dedupeAmenitiesByName(grouped.get(category) ?? []);
    const categoryLimit = categoryLimits[category] ?? 0;
    const selectedItems = mode === "walking"
      ? selectWalkingAmenitiesForCategory(items, category, categoryLimit, siteCoordinates)
      : mode === "cycling"
        ? selectCyclingAmenitiesForCategory(items, category, categoryLimit)
        : mode === "bus" && category === "Settlement"
        ? selectBusSettlementsForCategory(items, categoryLimit)
        : items
            .sort((a, b) => a.distance - b.distance)
            .slice(0, categoryLimit);
    selectedItems.forEach((item) => {
      const markerStyle = getAmenityMarkerStyle(item, category);
      item.id = selected.length + 1;
      item.symbol = markerStyle.symbol;
      item.color = markerStyle.color;
      item.showInLegend = selected.length < legendLimit;
      selected.push(item);
    });
  });

  return selected;
}

function getCategoryOrderForMode(mode) {
  if (mode === "cycling") {
    return ["Settlement", "Rail station", "Healthcare", "School"];
  }

  if (mode === "bus") {
    return ["Settlement"];
  }

  return [
    "Bus stop",
    "Rail station",
    "School",
    "Healthcare",
    "Retail",
    "Food and drink",
    "Community",
    "Worship",
    "Open space",
  ];
}

function getCategoryLimitsForMode(mode) {
  if (mode === "cycling") {
        return {
          Settlement: 6,
          "Rail station": 3,
          School: 4,
          Healthcare: 3,
        };
  }

  if (mode === "bus") {
    return { Settlement: 9 };
  }

  if (mode === "walking") {
    return {
      "Bus stop": 3,
      "Rail station": 2,
      School: 3,
      Healthcare: 3,
      Retail: 4,
      "Food and drink": 3,
      Community: 2,
      Worship: 2,
      "Open space": 2,
    };
  }

  return Object.fromEntries(
    getCategoryOrderForMode(mode).map((category) => [category, 4])
  );
}

function getLegendLimitForMode(mode) {
  if (mode === "cycling") {
      return 12;
  }
  return mode === "walking" ? 9 : mode === "bus" ? 0 : 8;
}

function dedupeAmenitiesByName(items) {
  const deduped = new Map();

  items.forEach((item) => {
    const key = `${item.category}|${String(item.name).trim().toLowerCase()}`;
    const existing = deduped.get(key);
    if (!existing || item.distance < existing.distance) {
      deduped.set(key, item);
    }
  });

  return Array.from(deduped.values());
}

function selectWalkingAmenitiesForCategory(items, category, limit, siteCoordinates) {
  if (limit <= 0) {
    return [];
  }

  const clusteredItems = buildWalkingAmenityRepresentatives(items, category);
  if (clusteredItems.length <= limit) {
    return clusteredItems.sort((a, b) => a.distance - b.distance);
  }

  const selected = [];
  const remaining = clusteredItems
    .map((item) => ({ ...item }))
    .sort((a, b) => a.distance - b.distance);

  selected.push(remaining.shift());

  while (selected.length < limit && remaining.length > 0) {
    let bestIndex = 0;
    let bestScore = -Infinity;
    remaining.forEach((item, index) => {
      const score = scoreWalkingAmenityCandidate(item, selected, category, siteCoordinates);
      if (score > bestScore) {
        bestScore = score;
        bestIndex = index;
      }
    });
    selected.push(remaining.splice(bestIndex, 1)[0]);
  }

  return selected;
}

function buildWalkingAmenityRepresentatives(items, category) {
  const clusterDistance = getWalkingAmenityClusterDistance(category);
  const clusters = [];

  items.forEach((item) => {
    const cluster = clusters.find((candidateCluster) =>
      candidateCluster.some((candidateItem) =>
        getDistanceMetres(
          candidateItem.latitude,
          candidateItem.longitude,
          item.latitude,
          item.longitude
        ) <= clusterDistance
      )
    );

    if (cluster) {
      cluster.push(item);
      return;
    }

    clusters.push([item]);
  });

  return clusters.map((cluster) =>
    cluster
      .slice()
      .sort((left, right) => {
        if (left.distance !== right.distance) {
          return left.distance - right.distance;
        }
        return String(left.name).localeCompare(String(right.name));
      })[0]
  );
}

function scoreWalkingAmenityCandidate(item, selectedItems, category, siteCoordinates) {
  const proximityScore = 1 / (1 + item.distance / getWalkingAmenityDistanceScale(category));
  const separationScore = Math.min(
    getMinimumWalkingAmenitySeparation(item, selectedItems) / getWalkingAmenityClusterDistance(category),
    1.4
  );
  const angularScore = getWalkingAmenityAngularSpreadScore(item, selectedItems, siteCoordinates);
  const nameDiversityScore = selectedItems.some((selectedItem) => simplifyAmenityName(selectedItem.name) === simplifyAmenityName(item.name))
    ? 0
    : 0.2;

  if (category === "Bus stop") {
    return proximityScore * 0.64 + separationScore * 0.2 + angularScore * 0.08 + nameDiversityScore * 0.08;
  }

  return proximityScore * 0.48 + separationScore * 0.32 + angularScore * 0.12 + nameDiversityScore * 0.08;
}

function getWalkingAmenityClusterDistance(category) {
  return {
    "Bus stop": 140,
    "Rail station": 180,
    School: 140,
    Healthcare: 140,
    Retail: 180,
    "Food and drink": 180,
    Community: 180,
    Worship: 160,
    "Open space": 260,
  }[category] || 180;
}

function getWalkingAmenityDistanceScale(category) {
  return {
    "Bus stop": 280,
    "Rail station": 700,
    School: 850,
    Healthcare: 850,
    Retail: 520,
    "Food and drink": 520,
    Community: 720,
    Worship: 720,
    "Open space": 900,
  }[category] || 650;
}

function getMinimumWalkingAmenitySeparation(item, selectedItems) {
  if (!selectedItems.length) {
    return Number.POSITIVE_INFINITY;
  }

  return selectedItems.reduce((bestDistance, selectedItem) =>
    Math.min(
      bestDistance,
      getDistanceMetres(
        item.latitude,
        item.longitude,
        selectedItem.latitude,
        selectedItem.longitude
      )
    ),
  Number.POSITIVE_INFINITY);
}

function getWalkingAmenityAngularSpreadScore(item, selectedItems, siteCoordinates) {
  if (!siteCoordinates || !selectedItems.length) {
    return 0.6;
  }

  const itemBearing = getInitialBearingDegrees(siteCoordinates, item);
  if (!Number.isFinite(itemBearing)) {
    return 0.4;
  }

  const minimumBearingGap = selectedItems.reduce((bestGap, selectedItem) => {
    const selectedBearing = getInitialBearingDegrees(siteCoordinates, selectedItem);
    if (!Number.isFinite(selectedBearing)) {
      return bestGap;
    }
    const rawGap = Math.abs(itemBearing - selectedBearing);
    return Math.min(bestGap, Math.min(rawGap, 360 - rawGap));
  }, 180);

  return minimumBearingGap / 180;
}

function simplifyAmenityName(name) {
  return String(name || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\b(opposite|opp|adjacent|outside|near|stop|platform)\b/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function cacheAmenitiesForScenario(siteCoordinates, mode, amenities) {
  state.amenityCache[mode] = {
    key: buildScenarioCacheKey(siteCoordinates),
    amenities: amenities.map((item) => ({ ...item })),
  };
}

function getCachedAmenitiesForScenario(siteCoordinates, mode) {
  const cached = state.amenityCache[mode];
  if (!cached || cached.key !== buildScenarioCacheKey(siteCoordinates)) {
    return null;
  }
  return cached.amenities.map((item) => ({ ...item }));
}

function buildScenarioCacheKey(siteCoordinates) {
  return `${siteCoordinates.latitude.toFixed(4)},${siteCoordinates.longitude.toFixed(4)}`;
}

function buildActiveTravelIsochroneCacheKey(originCoordinates, mode, configuredBands, networkRadiusMetres) {
  const bandKey = configuredBands
    .map((band) => `${band.label}:${Number(band.distance)}:${band.fill}`)
    .join(",");
  const manualKey = state.manualLineEdits
    .filter((item) => Array.isArray(item.points) && item.points.length >= 2)
    .map((item) => [
      item.id,
      item.type,
      item.modeCreated || "",
      item.points.map((point) => `${Number(point.latitude).toFixed(5)},${Number(point.longitude).toFixed(5)}`).join(";"),
    ].join(":"))
    .join("|");
  return [
    mode,
    originCoordinates.latitude.toFixed(5),
    originCoordinates.longitude.toFixed(5),
    Math.round(networkRadiusMetres),
    bandKey,
    manualKey,
  ].join("|");
}

function buildBusOriginCacheKey(originCoordinates, stopSearchRadiusMetres, maximumBandMinutes, maximumWalkToBusStopMetres = getSelectedBusMaxWalkToStopMetres() || BUS_MAX_WALK_TO_STOP_DEFAULT_METRES) {
  return [
    originCoordinates.latitude.toFixed(5),
    originCoordinates.longitude.toFixed(5),
    Math.round(stopSearchRadiusMetres),
    Math.round(maximumBandMinutes * 10) / 10,
    Math.round(Number(maximumWalkToBusStopMetres) || BUS_MAX_WALK_TO_STOP_DEFAULT_METRES),
  ].join("|");
}

function buildBusIsochroneCacheKey(originCoordinates, configuredBands, busSpeedSettings, stopSearchRadiusMetres, maximumBandMinutes, maximumWalkToBusStopMetres = getSelectedBusMaxWalkToStopMetres() || BUS_MAX_WALK_TO_STOP_DEFAULT_METRES) {
  const settings = normaliseBusSpeedSettings(busSpeedSettings);
  const bandKey = configuredBands
    .map((band) => `${band.label}:${Number(band.time)}:${band.fill}`)
    .join(",");
  const roadProfileKey = settings.mode === BUS_SPEED_MODEL_ROAD_TYPE
    ? BUS_ROAD_TYPE_CLASS_ORDER.map((roadClass) => `${roadClass}:${settings.roadTypeSpeedsKph[roadClass]}`).join(",")
    : "flat-only";
  return [
    buildBusOriginCacheKey(originCoordinates, stopSearchRadiusMetres, maximumBandMinutes, maximumWalkToBusStopMetres),
    settings.mode,
    Math.round(settings.flatSpeedKph * 1000) / 1000,
    roadProfileKey,
    bandKey,
  ].join("|");
}

function getMapCacheEntry(cache, key, cloneValue) {
  if (!cache.has(key)) {
    return null;
  }
  const value = cache.get(key);
  cache.delete(key);
  cache.set(key, value);
  return cloneValue(value);
}

function setMapCacheEntry(cache, key, value, cloneValue) {
  cache.set(key, cloneValue(value));
  while (cache.size > BUS_CACHE_MAX_ENTRIES) {
    cache.delete(cache.keys().next().value);
  }
}

function clonePlainValue(value) {
  return value == null ? value : JSON.parse(JSON.stringify(value));
}

function cloneBusIsochroneResult(isochrones) {
  const cloned = (isochrones ?? []).map((isochrone) => clonePlainValue(isochrone));
  cloned.fallbackNotice = isochrones?.fallbackNotice || "";
  cloned.sourceNote = isochrones?.sourceNote || "";
  cloned.metadata = clonePlainValue(isochrones?.metadata);
  return cloned;
}

function cloneActiveTravelIsochroneResult(isochrones) {
  const cloned = (isochrones ?? []).map((isochrone) => clonePlainValue(isochrone));
  cloned.fallbackNotice = isochrones?.fallbackNotice || "";
  cloned.sourceNote = isochrones?.sourceNote || "";
  cloned.metadata = clonePlainValue(isochrones?.metadata);
  return cloned;
}


function selectBusSettlementsForCategory(items, limit) {
  if (limit <= 0) {
    return [];
  }

  const priorityByPlaceType = {
    city: 0,
    town: 1,
    village: 2,
    suburb: 3,
  };

  return [...items]
    .filter((item) => item.name && Number.isFinite(item.distance))
    .sort((a, b) => {
      const priorityA = priorityByPlaceType[String(a.placeType || "").toLowerCase()] ?? 9;
      const priorityB = priorityByPlaceType[String(b.placeType || "").toLowerCase()] ?? 9;
      if (priorityA !== priorityB) {
        return priorityA - priorityB;
      }
      return a.distance - b.distance;
    })
    .slice(0, limit)
    .sort((a, b) => a.distance - b.distance);
}

function selectCyclingAmenitiesForCategory(items, category, limit) {
  if (limit <= 0) {
    return [];
  }

  const sortedItems = [...items].sort((a, b) => a.distance - b.distance);
  if (sortedItems.length <= limit) {
    return sortedItems;
  }

  const selectedItems = [];
  const configuredBands = getConfiguredBandsForMode("cycling")
    .map((band) => Number(band.distance) * 1000)
    .filter((distance) => Number.isFinite(distance) && distance > 0)
    .sort((a, b) => a - b);
  const innerBand = configuredBands[0] ?? 2000;
  const middleBand = configuredBands[1] ?? innerBand;
  const outerBand = configuredBands[configuredBands.length - 1] ?? middleBand;

  const addFirstMatching = (predicate) => {
    const match = sortedItems.find((item) => !selectedItems.includes(item) && predicate(item));
    if (match) {
      selectedItems.push(match);
    }
  };

  if (category === "Settlement") {
    addFirstMatching(() => true);
    addFirstMatching((item) => item.distance > innerBand && item.distance <= middleBand);
    addFirstMatching((item) => item.distance > middleBand && item.distance <= outerBand);
  } else if (category === "Rail station" || category === "Healthcare") {
    addFirstMatching(() => true);
    addFirstMatching((item) => item.distance > middleBand && item.distance <= outerBand);
  }

  sortedItems.forEach((item) => {
    if (selectedItems.length >= limit || selectedItems.includes(item)) {
      return;
    }
    selectedItems.push(item);
  });

  return selectedItems.slice(0, limit);
}

function classifyAmenity(tags, mode) {
  if (mode === "bus" && tags.place && firstNonEmpty(tags.name)) {
    const placeType = String(tags.place).toLowerCase();
    if (["city", "town", "village", "suburb"].includes(placeType)) {
      return "Settlement";
    }
  }

  if (mode === "cycling") {
        if (tags.place && firstNonEmpty(tags.name)) {
          return "Settlement";
        }
        if (tags.railway === "station" && firstNonEmpty(tags.name)) {
          return "Rail station";
        }
        if (["school", "college", "university", "kindergarten"].includes(tags.amenity) && firstNonEmpty(tags.name)) {
          return "School";
        }
      if (["hospital", "clinic", "doctors", "dentist", "pharmacy", "health_centre"].includes(tags.amenity) && firstNonEmpty(tags.name)) {
        return "Healthcare";
      }
      if (tags.shop && firstNonEmpty(tags.name)) {
        return "Retail";
      }
      if (["cafe", "restaurant", "fast_food", "pub", "bar"].includes(tags.amenity) && firstNonEmpty(tags.name)) {
        return "Food and drink";
      }
      if (["community_centre", "library", "arts_centre", "social_facility", "theatre", "village_hall"].includes(tags.amenity) && firstNonEmpty(tags.name)) {
        return "Community";
      }
      return null;
  }

  if (tags.highway === "bus_stop" || (tags.public_transport === "platform" && tags.bus === "yes")) {
    return "Bus stop";
  }
  if (tags.railway === "station") {
    return "Rail station";
  }
  if (["school", "college", "university", "kindergarten"].includes(tags.amenity)) {
    return "School";
  }
  if (["hospital", "clinic", "doctors", "dentist", "pharmacy"].includes(tags.amenity)) {
    return "Healthcare";
  }
  if (tags.shop) {
    return "Retail";
  }
  if (["cafe", "restaurant", "fast_food", "pub", "bar"].includes(tags.amenity)) {
    return "Food and drink";
  }
  if (["community_centre", "library", "arts_centre", "social_facility", "theatre"].includes(tags.amenity)) {
    return "Community";
  }
  if (tags.amenity === "place_of_worship") {
    return "Worship";
  }
  if (["park", "playground", "sports_centre"].includes(tags.leisure)) {
    return "Open space";
  }
  return null;
}

function deriveAmenityName(tags, category) {
  if (category === "Settlement") {
    return tags.name || "Settlement";
  }

  if (category === "Bus stop") {
    return deriveBusStopName(tags);
  }

  const baseName =
    tags.name ||
    tags.operator ||
    tags.brand ||
    tags.ref ||
    `${category}`;

  if (category === "Rail station" && !/\bstation\b/i.test(baseName)) {
    return `${baseName} Station`;
  }

  return baseName;
}

function deriveBusStopName(tags) {
  const indicator = normaliseBusStopIndicator(
    firstNonEmpty(
      tags["naptan:Indicator"],
      tags.indicator,
      tags.local_ref,
      tags.ref
    )
  );
  const direction = formatBusStopDirection(tags.direction, tags.bearing);
  const towards = formatBusStopTowards(tags.towards);
  const roadName = firstNonEmpty(tags["naptan:Street"], tags["addr:street"], tags.name);
  const detailParts = [];

  if (indicator) {
    detailParts.push(indicator);
  }
  if (direction) {
    detailParts.push(direction);
  } else if (towards) {
    detailParts.push(towards);
  }
  if (roadName && !looksGenericBusStopName(roadName)) {
    detailParts.push(roadName);
  }

  return detailParts.length ? `Bus stop ${detailParts.join(" | ")}` : "Bus stop";
}

function firstNonEmpty(...values) {
  return values.find((value) => typeof value === "string" && value.trim())?.trim() ?? "";
}

function normaliseBusStopIndicator(value) {
  if (!value) {
    return "";
  }

  const compactValue = value.trim();
  const lowered = compactValue.toLowerCase();

  if (lowered.startsWith("opposite")) {
    return compactValue.replace(/^opposite\b/i, "opp");
  }
  if (lowered.startsWith("outside")) {
    return compactValue.replace(/^outside\b/i, "o/s");
  }
  if (lowered.startsWith("adjacent")) {
    return compactValue.replace(/^adjacent\b/i, "adj");
  }
  if (lowered.startsWith("before")) {
    return compactValue.replace(/^before\b/i, "bef");
  }
  if (lowered.startsWith("after")) {
    return compactValue.replace(/^after\b/i, "aft");
  }
  if (lowered.startsWith("near")) {
    return compactValue.replace(/^near\b/i, "nr");
  }

  return compactValue;
}

function formatBusStopDirection(direction, bearing) {
  const rawDirection = firstNonEmpty(direction);
  if (rawDirection) {
    const normalisedDirection = rawDirection.toLowerCase().replace(/[^a-z]/g, "");
    const mappedDirection = {
      north: "NB",
      northbound: "NB",
      south: "SB",
      southbound: "SB",
      east: "EB",
      eastbound: "EB",
      west: "WB",
      westbound: "WB",
      northeast: "NEB",
      northeastbound: "NEB",
      northwest: "NWB",
      northwestbound: "NWB",
      southeast: "SEB",
      southeastbound: "SEB",
      southwest: "SWB",
      southwestbound: "SWB",
      inbound: "inbound",
      outbound: "outbound",
    }[normalisedDirection];

    if (mappedDirection) {
      return mappedDirection;
    }
  }

  const numericBearing = Number.parseFloat(bearing);
  if (Number.isFinite(numericBearing)) {
    return `${bearingToCardinal(numericBearing)}B`;
  }

  return "";
}

function formatBusStopTowards(towards) {
  const value = firstNonEmpty(towards);
  return value ? `towards ${value}` : "";
}

function looksGenericBusStopName(name) {
  const lowered = name.trim().toLowerCase();
  return lowered === "bus stop" || lowered === "platform" || lowered === "stop";
}

function bearingToCardinal(bearing) {
  const directions = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
  const wrappedBearing = ((bearing % 360) + 360) % 360;
  const index = Math.round(wrappedBearing / 45) % directions.length;
  return directions[index];
}

function getAmenityMarkerStyle(item, category) {
  const symbol = CATEGORY_SYMBOLS[category] ?? "circle";
  const categoryOffset = CATEGORY_OPTIONS.indexOf(category);
  const stableKey = item?.sourceId || `${category}|${item?.name || ""}`;
  const colorIndex = positiveHash(`${categoryOffset}|${stableKey}`) % AMENITY_COLOR_PALETTE.length;
  const color = AMENITY_COLOR_PALETTE[colorIndex];
  return {
    symbol,
    color,
  };
}

function positiveHash(value) {
  let hash = 0;
  String(value).split("").forEach((character) => {
    hash = (hash * 31 + character.charCodeAt(0)) >>> 0;
  });
  return hash;
}

function applySavedOverrides(amenities) {
  return amenities.map((item) => {
    if (!item.sourceId || !state.savedOverrides[item.sourceId]) {
      return item;
    }

    return {
      ...item,
      ...state.savedOverrides[item.sourceId],
    };
  });
}

function buildMapView(siteCoordinates, zoom) {
  const center = latLonToWorldPixels(siteCoordinates.latitude, siteCoordinates.longitude, zoom);
  const topLeft = {
    x: center.x - MAP_DIMENSIONS.width / 2,
    y: center.y - MAP_DIMENSIONS.height / 2,
  };
  return {
    zoom,
    topLeft,
  };
}

function adjustMapViewZoom(mapView, zoomDelta) {
  const nextZoom = clampZoom(mapView.zoom + zoomDelta);
  if (nextZoom === mapView.zoom) {
    return mapView;
  }

  const centerScreen = {
    x: MAP_DIMENSIONS.width / 2,
    y: MAP_DIMENSIONS.height / 2,
  };
  const centerCoordinates = unprojectSvgToLatLon(centerScreen.x, centerScreen.y, mapView);
  const centerWorldPoint = latLonToWorldPixels(
    centerCoordinates.latitude,
    centerCoordinates.longitude,
    nextZoom
  );

  return {
    zoom: nextZoom,
    topLeft: {
      x: centerWorldPoint.x - centerScreen.x,
      y: centerWorldPoint.y - centerScreen.y,
    },
  };
}

function buildBestFitMapView(scenario, isochrones, fallbackZoom, zoomAdjust = 0) {
  const bounds = getScenarioBounds(scenario, isochrones);
  if (!bounds) {
    return buildMapView(scenario.siteCoordinates, clampZoom(fallbackZoom + zoomAdjust));
  }

  const padding = {
    left: 42,
    right: 290,
    top: 42,
    bottom: 42,
  };

  const fittedZoom = clampZoom(getBoundsFitZoom(bounds, padding, fallbackZoom) + zoomAdjust);
  const center = {
    latitude: (bounds.minLatitude + bounds.maxLatitude) / 2,
    longitude: (bounds.minLongitude + bounds.maxLongitude) / 2,
  };

  const centerWorld = latLonToWorldPixels(center.latitude, center.longitude, fittedZoom);
  const availableWidth = MAP_DIMENSIONS.width - padding.left - padding.right;
  const availableHeight = MAP_DIMENSIONS.height - padding.top - padding.bottom;
  const targetCenterX = padding.left + availableWidth / 2;
  const targetCenterY = padding.top + availableHeight / 2;

  return {
    zoom: fittedZoom,
    topLeft: {
      x: centerWorld.x - targetCenterX,
      y: centerWorld.y - targetCenterY,
    },
  };
}

function clampZoom(value) {
  return Math.min(18, Math.max(8, value));
}

function buildScaleBarMarkup(mapView) {
  const startX = 94;
  const baselineY = 584;
  const centerY = MAP_DIMENSIONS.height / 2;
  const metresPerPixel = getDistanceMetresPerPixel(mapView, centerY);
  const scaleDistanceMetres = chooseScaleBarDistance(metresPerPixel, 100);
  const scaleWidthPixels = scaleDistanceMetres / metresPerPixel;
  const endX = startX + scaleWidthPixels;
  const labelX = startX + scaleWidthPixels / 2;

  return `
        <line x1="${round1(startX)}" y1="${baselineY}" x2="${round1(endX)}" y2="${baselineY}" stroke="#1d2328" stroke-width="3"></line>
        <line x1="${round1(startX)}" y1="578" x2="${round1(startX)}" y2="590" stroke="#1d2328" stroke-width="3"></line>
        <line x1="${round1(endX)}" y1="578" x2="${round1(endX)}" y2="590" stroke="#1d2328" stroke-width="3"></line>
        <text x="${round1(labelX)}" y="571" font-size="12" fill="#1d2328" font-family="Inter, Arial, sans-serif" text-anchor="middle">${formatScaleBarLabel(scaleDistanceMetres)}</text>
    `;
}

function getDistanceMetresPerPixel(mapView, yPosition) {
  const pointA = unprojectSvgToLatLon(100, yPosition, mapView);
  const pointB = unprojectSvgToLatLon(101, yPosition, mapView);
  return getDistanceMetres(pointA.latitude, pointA.longitude, pointB.latitude, pointB.longitude);
}

function chooseScaleBarDistance(metresPerPixel, targetPixels) {
  const preferredDistances = [50, 100, 200, 250, 500, 1000, 2000, 2500, 5000, 10000, 20000, 25000, 50000];
  const targetDistance = metresPerPixel * targetPixels;

  return preferredDistances.reduce((bestDistance, candidateDistance) =>
    Math.abs(candidateDistance - targetDistance) < Math.abs(bestDistance - targetDistance)
      ? candidateDistance
      : bestDistance
  , preferredDistances[0]);
}

function formatScaleBarLabel(distanceMetres) {
  if (distanceMetres >= 1000) {
    const kilometres = distanceMetres / 1000;
    return `${Number.isInteger(kilometres) ? kilometres : kilometres.toFixed(1)} km`;
  }
  return `${distanceMetres} m`;
}

function getScenarioBounds(scenario, isochrones) {
  const coordinates = [];

  if (scenario?.siteCoordinates) {
    coordinates.push(scenario.siteCoordinates);
  }
  if (scenario?.accessCoordinates) {
    coordinates.push(scenario.accessCoordinates);
  }

  (isochrones ?? []).forEach((isochrone) => {
    collectGeometryCoordinates(isochrone.geometry).forEach(([longitude, latitude]) => {
      coordinates.push({ latitude, longitude });
    });
  });

  if (coordinates.length === 0) {
    return null;
  }

  return coordinates.reduce(
    (bounds, coordinate) => ({
      minLatitude: Math.min(bounds.minLatitude, coordinate.latitude),
      maxLatitude: Math.max(bounds.maxLatitude, coordinate.latitude),
      minLongitude: Math.min(bounds.minLongitude, coordinate.longitude),
      maxLongitude: Math.max(bounds.maxLongitude, coordinate.longitude),
    }),
    {
      minLatitude: coordinates[0].latitude,
      maxLatitude: coordinates[0].latitude,
      minLongitude: coordinates[0].longitude,
      maxLongitude: coordinates[0].longitude,
    }
  );
}

function getBoundsFitZoom(bounds, padding, fallbackZoom) {
  const availableWidth = Math.max(80, MAP_DIMENSIONS.width - padding.left - padding.right);
  const availableHeight = Math.max(80, MAP_DIMENSIONS.height - padding.top - padding.bottom);

  for (let zoom = fallbackZoom; zoom >= 8; zoom -= 1) {
    const southWest = latLonToWorldPixels(bounds.minLatitude, bounds.minLongitude, zoom);
    const northEast = latLonToWorldPixels(bounds.maxLatitude, bounds.maxLongitude, zoom);
    const width = Math.abs(northEast.x - southWest.x);
    const height = Math.abs(southWest.y - northEast.y);

    if (width <= availableWidth && height <= availableHeight) {
      return zoom;
    }
  }

  return 8;
}

function collectGeometryCoordinates(geometry) {
  if (!geometry?.coordinates) {
    return [];
  }
  if (geometry.type === "Polygon") {
    return geometry.coordinates.flat();
  }
  if (geometry.type === "MultiPolygon") {
    return geometry.coordinates.flat(2);
  }
  return [];
}

function buildTileLayerMarkup(mapView) {
  const sourceZoom = Math.floor(mapView.zoom);
  const zoomScale = 2 ** (mapView.zoom - sourceZoom);
  const tileSize = 256 * zoomScale;
  const topLeftAtSourceZoom = {
    x: mapView.topLeft.x / zoomScale,
    y: mapView.topLeft.y / zoomScale,
  };
  const startTileX = Math.floor(topLeftAtSourceZoom.x / 256);
  const startTileY = Math.floor(topLeftAtSourceZoom.y / 256);
  const endTileX = Math.floor((topLeftAtSourceZoom.x + MAP_DIMENSIONS.width / zoomScale) / 256);
  const endTileY = Math.floor((topLeftAtSourceZoom.y + MAP_DIMENSIONS.height / zoomScale) / 256);
  const maxTileIndex = 2 ** sourceZoom;
  const tiles = [];

  for (let tileX = startTileX; tileX <= endTileX; tileX += 1) {
    for (let tileY = startTileY; tileY <= endTileY; tileY += 1) {
      if (tileY < 0 || tileY >= maxTileIndex) {
        continue;
      }

      const wrappedTileX = ((tileX % maxTileIndex) + maxTileIndex) % maxTileIndex;
      const x = tileX * tileSize - mapView.topLeft.x;
      const y = tileY * tileSize - mapView.topLeft.y;
      tiles.push(
        `<image href="https://tile.openstreetmap.org/${sourceZoom}/${wrappedTileX}/${tileY}.png" x="${round1(
          x
        )}" y="${round1(y)}" width="${round1(tileSize)}" height="${round1(tileSize)}" preserveAspectRatio="none" crossorigin="anonymous"></image>`
      );
    }
  }

  return `
    <g clip-path="url(#mapFrameClip)">
      ${tiles.join("")}
    </g>
    <defs>
      <clipPath id="mapFrameClip">
        <rect x="24" y="24" width="912" height="592"></rect>
      </clipPath>
    </defs>
  `;
}

function projectLatLonToSvg(latitude, longitude, mapView) {
  const worldPoint = latLonToWorldPixels(latitude, longitude, mapView.zoom);
  return {
    x: round1(worldPoint.x - mapView.topLeft.x),
    y: round1(worldPoint.y - mapView.topLeft.y),
  };
}

function buildIsochroneLayerMarkup(isochrones, mapView) {
  const layers = isochrones.map((isochrone, index) => {
    const pathMarkup = geometryToSvgPath(isochrone.geometry, mapView);
    if (!pathMarkup) {
      return { fill: "", stroke: "", pathMarkup: "", color: isochrone.color, clipPathId: `isochrone-band-${index}` };
    }
    return {
      pathMarkup,
      color: isochrone.color,
      clipPathId: `isochrone-band-${index}`,
      fill: `<path d="${pathMarkup}" fill="${isochrone.color}" fill-opacity="0.32"></path>`,
      stroke: `<path d="${pathMarkup}" fill="none" stroke="${isochrone.color}" stroke-width="2"></path>`,
    };
  });

  return {
    layers,
    fillMarkup: layers.map((layer) => layer.fill).join(""),
    strokeMarkup: layers.map((layer) => layer.stroke).join(""),
  };
}

function buildIsochroneExclusionMaskMarkup(exclusionAreas, mapView) {
  const paths = exclusionAreas
    .map((item) => buildPolygonPathFromPoints(item.points, mapView))
    .filter(Boolean);
  if (paths.length === 0) {
    return "";
  }

  return `
    <defs>
      <mask id="isochrone-fill-mask" maskUnits="userSpaceOnUse" x="0" y="0" width="960" height="640">
        <rect x="0" y="0" width="960" height="640" fill="#ffffff"></rect>
        ${paths.map((path) => `<path d="${path}" fill="#000000"></path>`).join("")}
      </mask>
    </defs>
  `;
}

function buildIsochroneExclusionBoundaryMarkup(layers, exclusionAreas, mapView) {
  const exclusionPaths = exclusionAreas
    .map((item) => buildPolygonPathFromPoints(item.points, mapView))
    .filter(Boolean);
  const activeLayers = (layers || []).filter((layer) => layer.pathMarkup);
  if (exclusionPaths.length === 0 || activeLayers.length === 0) {
    return "";
  }

  const clipDefs = activeLayers
    .map((layer) => `
      <clipPath id="${layer.clipPathId}">
        <path d="${layer.pathMarkup}"></path>
      </clipPath>
    `)
    .join("");
  const boundaryMarkup = activeLayers
    .map((layer) =>
      exclusionPaths
        .map((path) => `<path d="${path}" fill="none" stroke="${layer.color}" stroke-width="2" clip-path="url(#${layer.clipPathId})" stroke-linejoin="round"></path>`)
        .join("")
    )
    .join("");

  return `
    <defs>
      ${clipDefs}
    </defs>
    ${boundaryMarkup}
  `;
}

function buildManualLineOverlayMarkup(lineEdits, mapView) {
  return lineEdits
    .map((item) => {
      const path = buildLinePathFromPoints(item.points, mapView);
      if (!path) {
        return "";
      }
      const style = getDrawingToolConfig(item.type);
      return `
        <g>
          <path d="${path}" fill="none" stroke="#ffffff" stroke-width="${style.strokeWidth + 2.4}" stroke-linecap="round" stroke-linejoin="round" opacity="0.88"></path>
          <path d="${path}" fill="none" stroke="${style.stroke}" stroke-width="${style.strokeWidth}" stroke-dasharray="${style.dasharray}" stroke-linecap="round" stroke-linejoin="round"></path>
        </g>
      `;
    })
    .join("");
}

function buildDraftDrawingMarkup(mapView) {
  if (!state.activeDrawingTool || state.draftDrawingPoints.length === 0) {
    return "";
  }

  const toolConfig = getDrawingToolConfig(state.activeDrawingTool);
  const circles = state.draftDrawingPoints
    .map((point) => {
      const svgPoint = projectLatLonToSvg(point.latitude, point.longitude, mapView);
      return `<circle cx="${svgPoint.x}" cy="${svgPoint.y}" r="4.5" fill="${toolConfig.stroke}" stroke="#ffffff" stroke-width="1.5"></circle>`;
    })
    .join("");

  if (toolConfig.geometryType === "polygon") {
    const polygonPath = state.draftDrawingPoints.length >= 3
      ? buildPolygonPathFromPoints(state.draftDrawingPoints, mapView)
      : "";
    const previewPath = buildLinePathFromPoints(state.draftDrawingPoints, mapView);
    return `
      <g>
        ${polygonPath ? `<path d="${polygonPath}" fill="${toolConfig.stroke}" fill-opacity="0.10" stroke="${toolConfig.stroke}" stroke-width="${toolConfig.strokeWidth}" stroke-dasharray="${toolConfig.dasharray}" stroke-linejoin="round"></path>` : ""}
        ${!polygonPath && previewPath ? `<path d="${previewPath}" fill="none" stroke="${toolConfig.stroke}" stroke-width="${toolConfig.strokeWidth}" stroke-dasharray="${toolConfig.dasharray}" stroke-linecap="round" stroke-linejoin="round"></path>` : ""}
        ${circles}
      </g>
    `;
  }

  const linePath = buildLinePathFromPoints(state.draftDrawingPoints, mapView);
  return `
    <g opacity="0.96">
      ${linePath ? `<path d="${linePath}" fill="none" stroke="#ffffff" stroke-width="${toolConfig.strokeWidth + 2.4}" stroke-linecap="round" stroke-linejoin="round"></path>` : ""}
      ${linePath ? `<path d="${linePath}" fill="none" stroke="${toolConfig.stroke}" stroke-width="${toolConfig.strokeWidth}" stroke-dasharray="${toolConfig.dasharray}" stroke-linecap="round" stroke-linejoin="round"></path>` : ""}
      ${circles}
    </g>
  `;
}

function buildManualOverlayLegendRows() {
  return getAllSavedManualOverlays()
    .filter((item) => item.showInLegend !== false)
    .map((item) => {
      const style = getDrawingToolConfig(item.type);
      return {
        name: item.displayName,
        type: item.type === "exclusion-area" ? "exclusion-area" : "manual-line",
        stroke: style?.stroke || "#1d2328",
        dasharray: style?.dasharray || "",
        strokeWidth: style?.strokeWidth || 3,
      };
    });
}

function buildLinePathFromPoints(points, mapView) {
  if (!Array.isArray(points) || points.length < 2) {
    return "";
  }

  return points
    .map((point, index) => {
      const projected = projectLatLonToSvg(point.latitude, point.longitude, mapView);
      return `${index === 0 ? "M" : "L"}${projected.x} ${projected.y}`;
    })
    .join(" ");
}

function buildPolygonPathFromPoints(points, mapView) {
  if (!Array.isArray(points) || points.length < 3) {
    return "";
  }

  const path = buildLinePathFromPoints(points, mapView);
  return path ? `${path} Z` : "";
}

function geometryToSvgPath(geometry, mapView) {
  if (geometry.type === "Polygon") {
    return polygonCoordinatesToPath(geometry.coordinates, mapView);
  }
  if (geometry.type === "MultiPolygon") {
    return geometry.coordinates
      .map((polygon) => polygonCoordinatesToPath(polygon, mapView))
      .filter(Boolean)
      .join(" ");
  }
  return "";
}

function buildAmenityDisplayItems(amenities, mapView, sitePoint, mode = state.selectedMode) {
  const placedItems = [];
  const candidateOffsets = [
    { x: 0, y: 0 },
    { x: 10, y: 0 },
    { x: -10, y: 0 },
    { x: 0, y: 10 },
    { x: 0, y: -10 },
    { x: 8, y: 8 },
    { x: -8, y: 8 },
    { x: 8, y: -8 },
    { x: -8, y: -8 },
    { x: 14, y: 0 },
    { x: -14, y: 0 },
    { x: 0, y: 14 },
    { x: 0, y: -14 },
  ];
  const minSeparation = 13;

  amenities.forEach((item) => {
    const basePoint = item.latitude !== undefined && item.longitude !== undefined
      ? projectLatLonToSvg(item.latitude, item.longitude, mapView)
      : {
          x: sitePoint.x + item.offsets.x,
          y: sitePoint.y + item.offsets.y,
        };

    if (!basePoint) {
      return;
    }

    let chosenPoint = null;

    for (const offset of candidateOffsets) {
      const candidatePoint = {
        x: clamp(basePoint.x + offset.x, 26, 934),
        y: clamp(basePoint.y + offset.y, 26, 614),
      };
      const overlapsExisting = placedItems.some((placedItem) =>
        getPointDistance(candidatePoint, placedItem) < minSeparation
      );
      if (!overlapsExisting) {
        chosenPoint = candidatePoint;
        break;
      }
    }

    const finalPoint = chosenPoint ?? {
      x: clamp(basePoint.x, 26, 934),
      y: clamp(basePoint.y, 26, 614),
    };

    placedItems.push({
      ...item,
      x: round1(finalPoint.x),
      y: round1(finalPoint.y),
      labelOnly: mode === "bus" && item.category === "Settlement",
    });
  });

  return placedItems;
}

function polygonCoordinatesToPath(rings, mapView) {
  return rings
    .map((ring) => {
      const commands = ring
        .map(([longitude, latitude], index) => {
          const point = projectLatLonToSvg(latitude, longitude, mapView);
          return `${index === 0 ? "M" : "L"}${point.x} ${point.y}`;
        })
        .join(" ");
      return `${commands} Z`;
    })
    .join(" ");
}

function unprojectSvgToLatLon(x, y, mapView) {
  return worldPixelsToLatLon(x + mapView.topLeft.x, y + mapView.topLeft.y, mapView.zoom);
}

function getPointDistance(pointA, pointB) {
  return Math.hypot(pointA.x - pointB.x, pointA.y - pointB.y);
}

function latLonToWorldPixels(latitude, longitude, zoom) {
  const sinLatitude = Math.sin((latitude * Math.PI) / 180);
  const scale = 256 * 2 ** zoom;
  return {
    x: ((longitude + 180) / 360) * scale,
    y:
      (0.5 -
        Math.log((1 + sinLatitude) / (1 - sinLatitude)) / (4 * Math.PI)) *
      scale,
  };
}

function worldPixelsToLatLon(x, y, zoom) {
  const scale = 256 * 2 ** zoom;
  const longitude = (x / scale) * 360 - 180;
  const n = Math.PI - (2 * Math.PI * y) / scale;
  const latitude = (180 / Math.PI) * Math.atan(0.5 * (Math.exp(n) - Math.exp(-n)));
  return { latitude, longitude };
}

function getDistanceMetres(lat1, lon1, lat2, lon2) {
  const earthRadius = 6371000;
  const phi1 = (lat1 * Math.PI) / 180;
  const phi2 = (lat2 * Math.PI) / 180;
  const deltaPhi = ((lat2 - lat1) * Math.PI) / 180;
  const deltaLambda = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
    Math.cos(phi1) * Math.cos(phi2) * Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return earthRadius * c;
}

function round1(value) {
  return Math.round(value * 10) / 10;
}

function buildMapTitleBlock(projectName, planningAuthority) {
  const boxX = 42;
  const boxY = 30;
  const paddingX = 12;
  const paddingTop = 10;
  const lineGap = 8;
  const titleFontSize = 14;
  const authorityFontSize = 12;
  const titleWidth = estimateSvgTextWidth(projectName, titleFontSize, 0.6);
  const authorityWidth = estimateSvgTextWidth(planningAuthority, authorityFontSize, 0.58);
  const boxWidth = Math.min(420, Math.max(170, Math.ceil(Math.max(titleWidth, authorityWidth) + paddingX * 2)));
  const boxHeight = 52;

  return `
    <g>
      <rect x="${boxX}" y="${boxY}" width="${boxWidth}" height="${boxHeight}" fill="#fffdf8" stroke="#d7d0c4"></rect>
      <text x="${boxX + paddingX}" y="${boxY + paddingTop + titleFontSize}" font-size="${titleFontSize}" fill="#1d2328" font-family="Inter, Arial, sans-serif" font-weight="700">${escapeHtml(projectName)}</text>
      <text x="${boxX + paddingX}" y="${boxY + paddingTop + titleFontSize + lineGap + authorityFontSize}" font-size="${authorityFontSize}" fill="#5c6a70" font-family="Inter, Arial, sans-serif">${escapeHtml(planningAuthority)}</text>
    </g>
  `;
}

function estimateSvgTextWidth(text, fontSize, widthFactor) {
  return String(text).length * fontSize * widthFactor;
}

function buildSelectMarkup(id, field, options, selectedValue) {
  const optionMarkup = options
    .map(
      (option) =>
        `<option value="${option}" ${option === selectedValue ? "selected" : ""}>${option}</option>`
    )
    .join("");
  return `<select data-field="${field}" data-id="${id}">${optionMarkup}</select>`;
}

function drawSymbol(symbol, color, size, withOutline = false) {
  const stroke = withOutline ? "#1d2328" : "none";
  const strokeWidth = withOutline ? 1.7 : 0;
  if (symbol === "square") {
    return `<rect x="${-size}" y="${-size}" width="${size * 2}" height="${size * 2}" fill="${color}" stroke="${stroke}" stroke-width="${strokeWidth}"></rect>
      <rect x="${-size * 0.35}" y="${-size * 0.35}" width="${size * 0.7}" height="${size * 0.7}" fill="#f8f5ee" opacity="0.92"></rect>`;
  }
  if (symbol === "diamond") {
    return `<path d="M0 ${-size} L${size} 0 L0 ${size} L${-size} 0 Z" fill="${color}" stroke="${stroke}" stroke-width="${strokeWidth}"></path>
      <path d="M${-size * 0.42} 0 H${size * 0.42}" stroke="#f8f5ee" stroke-width="2.2"></path>`;
  }
  if (symbol === "triangle") {
    return `<path d="M0 ${-size - 1} L${size + 1} ${size} L${-size - 1} ${size} Z" fill="${color}" stroke="${stroke}" stroke-width="${strokeWidth}"></path>
      <circle cx="0" cy="${size * 0.18}" r="${Math.max(1.8, size * 0.18)}" fill="#f8f5ee"></circle>`;
  }
  if (symbol === "cross") {
    return `<path d="M-3 ${-size} H3 V-3 H${size} V3 H3 V${size} H-3 V3 H${-size} V-3 H-3 Z" fill="${color}" stroke="${stroke}" stroke-width="${withOutline ? 1 : 0}"></path>`;
  }
  if (symbol === "hex") {
    return `<path d="M0 ${-size} L${size} ${-size / 2} L${size} ${size / 2} L0 ${size} L${-size} ${size / 2} L${-size} ${-size / 2} Z" fill="${color}" stroke="${stroke}" stroke-width="${strokeWidth}"></path>
      <path d="M${-size * 0.34} 0 H${size * 0.34}" stroke="#f8f5ee" stroke-width="2"></path>
      <path d="M0 ${-size * 0.34} V${size * 0.34}" stroke="#f8f5ee" stroke-width="2"></path>`;
  }
  if (symbol === "star") {
    return `<path d="M0 ${-size} L${size * 0.28} ${-size * 0.28} L${size} ${-size * 0.2} L${size *
      0.44} ${size * 0.18} L${size * 0.62} ${size} L0 ${size * 0.52} L${-size * 0.62} ${size} L${-size *
      0.44} ${size * 0.18} L${-size} ${-size * 0.2} L${-size * 0.28} ${-size * 0.28} Z" fill="${color}" stroke="${stroke}" stroke-width="${strokeWidth}"></path>`;
  }
  if (symbol === "pentagon") {
    return `<path d="M0 ${-size} L${size * 0.95} ${-size * 0.2} L${size * 0.58} ${size} L${-size * 0.58} ${size} L${-size * 0.95} ${-size * 0.2} Z" fill="${color}" stroke="${stroke}" stroke-width="${strokeWidth}"></path>
      <circle cx="0" cy="${size * 0.08}" r="${Math.max(1.8, size * 0.18)}" fill="#f8f5ee"></circle>`;
  }
  if (symbol === "ring") {
    return `<circle cx="0" cy="0" r="${size}" fill="none" stroke="${color}" stroke-width="4.4"></circle>
      <circle cx="0" cy="0" r="${size * 0.32}" fill="${color}" stroke="${withOutline ? "#1d2328" : "none"}" stroke-width="${withOutline ? 1 : 0}"></circle>`;
  }
  return `<circle cx="0" cy="0" r="${size}" fill="${color}" stroke="${stroke}" stroke-width="${strokeWidth}"></circle>
    <circle cx="0" cy="0" r="${Math.max(1.8, size * 0.22)}" fill="#f8f5ee"></circle>`;
}

function drawBandSwatch(color) {
  return `<rect x="-7" y="-7" width="14" height="14" fill="${color}" fill-opacity="0.32" stroke="${color}" stroke-width="2"></rect>`;
}

function drawManualLineLegendSwatch(item) {
  return `
    <path d="M-8 0 H8" fill="none" stroke="#ffffff" stroke-width="${Number(item.strokeWidth) + 2}" stroke-linecap="round"></path>
    <path d="M-8 0 H8" fill="none" stroke="${item.stroke}" stroke-width="${item.strokeWidth}" stroke-dasharray="${item.dasharray || ""}" stroke-linecap="round"></path>
  `;
}

function drawExclusionAreaLegendSwatch(item) {
  return `<rect x="-7" y="-7" width="14" height="14" fill="none" stroke="${item.stroke}" stroke-width="${item.strokeWidth}" stroke-dasharray="${item.dasharray || ""}"></rect>`;
}

function drawDevelopmentSiteMarker(x, y, compact) {
  const outer = compact ? 8 : 12;
  const inner = compact ? 2.4 : 3.5;
  return `
    <g transform="translate(${x} ${y})">
      <path d="M0 ${-outer} L${outer} 0 L0 ${outer} L${-outer} 0 Z" fill="#1d2328"></path>
      <circle cx="0" cy="0" r="${inner}" fill="#f8f5ee"></circle>
    </g>
  `;
}

function drawAccessMarker(x, y, compact) {
  const top = compact ? 8 : 15;
  const side = compact ? 8 : 12;
  const bottom = compact ? 7 : 10;
  return `
    <g transform="translate(${x} ${y})">
      <path d="M0 ${-top} L${side} ${bottom} L${-side} ${bottom} Z" fill="#b35b3d"></path>
    </g>
  `;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function csvEscape(value) {
  const stringValue = String(value);
  return /[",\n]/.test(stringValue)
    ? `"${stringValue.replaceAll('"', '""')}"`
    : stringValue;
}

init();