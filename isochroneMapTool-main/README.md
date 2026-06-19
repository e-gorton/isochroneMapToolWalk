# Isochrone Map Tool

Static SVG isochrone map generator for walking, cycling and indicative bus accessibility catchments.

## Current walking/cycling method

Walking and cycling isochrone geometry is generated in the browser from an OpenStreetMap-derived active-travel graph fetched through Overpass. Manual proposed walking, cycling, shared-use and bridge/crossing edits are inserted into that local graph before the walking/cycling isochrone is recalculated. Manual barrier lines deactivate crossed walking/cycling graph edges for the local calculation, except where a proposed bridge/crossing link is drawn.

Walking access is pavement-aware in a proportionate planning sense. Dedicated pedestrian links and roads with tagged sidewalks are used directly. Higher-order roads such as trunk and primary routes require positive pedestrian provision or suitable access tagging before they are treated as walkable. Ordinary local streets remain permitted unless OSM access tags restrict pedestrian use, reflecting the typical level of OSM footway tagging available in UK settlements.

Cycling access uses OSM cycle and highway tags, including ordinary cyclable roads where cycling is not prohibited and the road class is suitable. The graph includes small geometry stitching to reduce false gaps where OSM side roads meet nearby cycle-permitted roads but are slightly under-noded.

Isochrone exclusion areas are cartographic masks only. They remove the displayed isochrone fill and reinstate clipped band boundary styling around the retained isochrone area, but they do not change the underlying active-travel network calculation.

## Current bus method

Bus mode does not use TransportAPI, TravelTime, Google Maps, Cadence or OpenTripPlanner. It has no API-key requirement.

The bus layer is an indicative route-corridor catchment generated from:

- OpenStreetMap bus route relations fetched through Overpass;
- mapped bus route geometry serving stops within the selected maximum walk-to-bus-stop distance from the selected site/access point;
- pedestrian access from the site/access point to the boarding stop, preferably routed through Valhalla pedestrian routing;
- a 4.8 kph walking speed for the access walk;
- a selectable in-vehicle bus speed model: either flat average speed entered in mph, or road-type weighted speed using OSM highway classes with the flat speed retained as the fallback for unknown segments;
- a 350 m destination/corridor buffer around reachable route geometry;
- no waiting time, timetable data, service frequency, interchanges, disruption or live running.

The bus output should be described as an **indicative bus route corridor catchment**. It should not be described as a TRACC-style, journey-planner or timetable-based public transport isochrone.

## Deployment

Cloudflare root-deploy settings:

| Field | Value |
|---|---|
| Path | `/` |
| Build command | blank |
| Deploy command | `npx wrangler deploy --config wrangler.toml` |
| Non-production deploy command | `npx wrangler versions upload --config wrangler.toml` |

No Cloudflare secrets are required for bus mode.

## Data dependencies

Walking/cycling isochrone geometry uses OpenStreetMap/Overpass via the Worker proxy and is calculated locally in the browser. Manual active-travel edits are applied to that local graph only.

Bus catchments and amenity points use OpenStreetMap/Overpass via the Worker proxy. Bus access walking distances use Valhalla pedestrian routing where available. If routed pedestrian access distance is unavailable for an access anchor, the app may use a straight-line fallback and records that fallback in the source note/metadata.

## Planning caveat

Suggested wording:

> Walking and cycling isochrones are indicative active-travel network outputs generated from OpenStreetMap data and local browser-side graph calculations. Proposed paths, cycle links, shared-use paths, bridges/crossings and barrier lines drawn in the tool are manual modelling assumptions applied to the local graph and should be reviewed against deliverability, land control, highway authority requirements and detailed design standards including Manual for Streets and LTN 1/20 where relevant. Isochrone exclusion areas are cartographic masks applied after isochrone generation and should not be described as routed accessibility recalculations.

> Bus catchments are indicative OpenStreetMap bus-route corridor outputs. They are generated from mapped OSM bus route relations serving stops within the selected maximum walk-to-bus-stop distance from the site/access point. They include pedestrian access from the site/access point to the boarding stop, based on a 4.8 kph walking speed. Remaining time within each band is applied to in-vehicle bus travel using the selected flat average or road-type weighted bus speed assumption. The outputs do not include timetable availability, service frequency, waiting time, interchanges, disruption or live running.

## Average bus speed setting

The average bus speed is set in **Advanced Settings** as `Average bus speed (mph)`. The default value is 11.1847 mph, equivalent to the v28 hard-coded 18 kph assumption. The app converts the selected mph value to kph internally and applies it only to the in-vehicle bus component after access walk time has been deducted from each band. Lower speeds reduce the route corridor reachable within each bus band; higher speeds extend it. Invalid values such as blank, zero or negative entries are rejected before bus catchments are regenerated.

## Bus performance and long-running calculations

Bus mode can still take several minutes for large catchments or complex mapped networks because it depends on public Overpass mirrors, Valhalla pedestrian access routing and client-side route-corridor polygon generation. The app no longer presents a two-minute calculation warning. After approximately 75 seconds it shows:

> Bus isochrone calculation is still running. Large catchments, lower average bus speeds or complex networks can take several minutes.

The bus pipeline now reports staged progress for loading stops/routes, calculating bus reach, generating polygons and rendering. It also caches reusable bus relation payloads, route geometry by OSM relation id, prepared accessible routes and completed isochrone results in memory for the current browser session. Cache keys include the origin, maximum bus band, stop-search radius, configured bus bands/colours and average bus speed where relevant. Relation geometry is independent of the selected average bus speed, so changing only the speed should recalculate the bus reach from cached route geometry rather than refetching OSM geometry.

Bus route geometry loading uses adaptive batching. It starts with larger relation chunks to avoid many small sequential Overpass requests, runs at most two geometry requests at once, and only falls back to smaller chunks if a larger request fails or times out. Development logs report cache hits, cache misses, batch timings, failed batches and fallback splits.

Remaining bottlenecks are public Overpass response time, Valhalla pedestrian access routing for boarding anchors, and large polygon smoothing/rendering. Heavy client-side loops now yield back to the browser between route and band stages to keep the UI responsive, but the calculation remains browser-based rather than being moved into a separate Web Worker.

Basic bus timing logs are written to the browser console when running from a local file, or when `localStorage["prime-isochrone-debug"]` is set to `1`.

## Bus route candidate selection

Mapped OSM bus route relations are no longer selected solely by nearest stop distance. The app first records each candidate route's nearest mapped boarding stop, bearing sector from the origin, route ref/name group and source query. It then selects candidates across 45-degree bearing sectors before filling any remaining slots with the best remaining routes. This is intended to avoid a dense set of nearby local variants excluding longer radial services in another direction, such as south-west routes from Leeds towards Brighouse.

The final relation cap remains configurable in `BUS_ROUTE_MAX_RELATIONS` and is applied after balanced selection as a public-service and browser-performance safeguard. Route variants sharing the same ref/name group are limited before the cap is reached, so duplicate or near-identical services are less likely to crowd out directional coverage. In development mode, the console logs selected and excluded route candidates with relation id, ref/name, nearest stop distance, bearing sector, source query and selection/exclusion reason.

## v26 access-walk update

v26 modifies the v25 route-only bus corridor method so that walking to the boarding stop is no longer treated as free. Each bus band now represents access walking time plus in-vehicle bus travel time. For example, where access to the usable boarding stop takes approximately 6 minutes, a 15-minute band allows approximately 9 minutes of in-vehicle bus travel.


### v28 walk-budget bus access

Bus stop access is now governed by the maximum configured journey time band rather than a fixed 800 m boarding-stop radius. For a 60-minute maximum band, the app searches for stops within approximately 5 km plus a small margin, calculates access walk time, and only allows each stop to contribute to a band where the walk time is less than the band threshold. The remaining time is then applied to in-vehicle bus travel along mapped OSM route geometry. Bus mode continues to suppress individual amenity, bus-stop and route-point markers; it displays the development site, bus catchment bands and nearby settlement labels only. Route corridor outputs are grouped by time band, converted into smoothed presentation polygons, and include a cartographic caveat that the smoothed areas are indicative rather than precise network-coverage boundaries.


## v41 road-type weighted bus speed

Bus mode now includes a **Bus speed model** selector. **Flat average speed** preserves the v28 behaviour by applying the selected mph value across all mapped route geometry. **Road-type weighted speed** uses OSM way-level `highway` tags from member ways to apply modelled average speeds by road class. Default classes include motorway, trunk, primary, secondary, tertiary, unclassified/residential, service, busway/dedicated bus corridor and unknown/fallback. Where OSM `maxspeed` is available it is used only as an upper constraint / diagnostic input, not as an assumed actual operating speed. Geometry and way tags are cached by relation/way payload, so changing only the speed model should recalculate timing from cached route geometry rather than refetching OSM data.


## v45 maximum walk-to-bus-stop setting

Bus mode now includes a **Maximum walk to bus stop (m)** setting in Advanced Settings. The default is **400 m**, with validation from 50 m to 2,000 m. The app uses this value as the boarding-stop eligibility limit: candidate stops are first fetched from OpenStreetMap using a modest straight-line pre-filter, then routed pedestrian access distance is used where available to retain only stops within the selected maximum walking distance. Straight-line fallback remains available only where routed distance cannot be returned and is recorded in the method note.

Changing the maximum walk-to-bus-stop value recalculates the bus catchment and is included in the bus cache keys, preventing stale accessible-route results from a previous larger walking-distance setting. Changing only the bus speed model or flat speed can still reuse cached route geometry where the selected route set is unchanged.


## v45 BODS timetable mode

Bus mode now has a method selector: **OSM corridor estimate** or **BODS timetable-based**. BODS mode calls the Bus Open Data Service through the Cloudflare Worker using the `BODS_API_KEY` secret. It attempts to download local timetable datasets for the selected area, parse TransXChange stop-to-stop timings in the browser, and run an earliest-arrival search from the selected departure date/time. Initial access and transfer walking are estimated using straight-line distance multiplied by 1.3 and 4.8 kph walking speed. The mode is timetable-led and includes scheduled wait time where the timetable files can be parsed, but it does not include live disruption, reliability, cancellations, crowding or fare integration. If BODS data cannot be parsed for the selected area, switch back to OSM corridor estimate.
