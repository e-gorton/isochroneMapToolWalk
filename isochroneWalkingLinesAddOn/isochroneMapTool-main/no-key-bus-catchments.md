# No-key indicative bus catchments

This package implements a no-key indicative bus accessibility method. It deliberately excludes active TransportAPI public journey, TravelTime and OTP bus-routing code.

## Method

For bus mode the app:

1. Reads the selected maximum walk-to-bus-stop distance, defaulting to 400 m.
2. Queries OpenStreetMap/Overpass for bus stops within a modest straight-line pre-filter radius around that distance and mapped bus route relations serving those stops.
3. Calculates pedestrian access distance from the site/access point to each candidate boarding stop or access anchor, using Valhalla pedestrian routing where available.
4. Uses a 4.8 kph walking speed to convert access distance into access walk time.
5. Subtracts access walk time from each selected bus time band.
6. Applies the remaining time to in-vehicle bus travel using either the selected flat average bus speed or the road-type weighted OSM highway speed profile. The default is 11.1847 mph, equivalent to the previous v28 18 kph assumption.
7. Buffers reachable route points/segments by 350 m to create indicative corridor polygons.
8. Shows no bus fallback if mapped OSM bus route geometry cannot be generated.

## What is not included

The method does not include:

- waiting time;
- timetable availability;
- service frequency;
- transfer/interchange penalties;
- specific bus operators or service numbers as timetable constraints;
- congestion or live running;
- evening, Sunday or bank holiday service variation.

## Average bus speed setting

The average in-vehicle bus speed is entered in mph in **Advanced Settings**. It is converted to kph internally and used only after pedestrian access time to the boarding stop has been deducted from each band. The default 11.1847 mph value preserves the v28 18 kph output as closely as possible. Blank, zero, negative and out-of-range values are rejected before the bus catchment is recalculated.

## Performance, caching and known limits

The bus calculation uses staged progress messages rather than a fixed two-minute warning. If it is still running after approximately 75 seconds, the user is told that large catchments, lower average bus speeds or complex networks can take several minutes. This notice does not cancel the calculation.

The app keeps in-memory browser-session caches for:

- OpenStreetMap bus relation payloads for the same origin and maximum-band stop-search radius;
- OSM route geometry by relation id, so recalculating with a different average bus speed does not require geometry refetching;
- prepared accessible route geometry and access anchors for the same origin and maximum band;
- completed bus isochrone results for the same origin, bands, colours and average speed.

Route geometry requests use adaptive batching: larger chunks are tried first, up to two requests run at once, and failed or timed-out chunks are split into smaller fallback requests. The cache is deliberately session-only because OSM and public routing responses can change. It is intended to avoid duplicate work during drafting, not to provide an audited transport dataset. Remaining bottlenecks are public Overpass response time, Valhalla pedestrian route requests for access anchors, and client-side smoothing/rendering of large route-corridor polygons. The underlying method remains unchanged: access walk time is deducted first and only the remaining band time is applied to mapped route geometry using the selected average bus speed.

## Candidate route selection

Candidate bus route relations are selected using a balanced method rather than a simple nearest-stop sort. Each candidate is assigned a nearest stop distance, bearing sector from the origin, route ref/name group and source query. The app protects coverage across 45-degree sectors first, then fills remaining places with the best remaining candidates while limiting duplicate route groups. The configurable relation cap is retained as a performance safeguard after balancing, not as the primary selection method.

Development diagnostics log selected and excluded route candidates with relation id, route ref/name, nearest stop distance, bearing/sector, source query and selection or exclusion reason. This is intended to make directional omissions, such as a missed Leeds to Brighouse/south-west route where OSM data is available, easier to diagnose.

## Recommended label

Use:

> Indicative bus route corridor catchment

Do not use:

> Timetable-based bus isochrone

or:

> Public transport journey planner isochrone

## v26 access-walk update

The previous route-only method applied the full 15/30/45/60-minute band to in-vehicle bus travel once a route was considered accessible. v26 changes this so that each band includes access walking time first. Only the remaining time is applied to in-vehicle bus travel along the mapped OSM route.

Example: if the access walk to the boarding stop is 6 minutes, the 15-minute band only allows approximately 9 minutes of in-vehicle bus travel.


### v28 walk-budget bus access

Bus stop access in v28 was governed by the maximum configured journey time band rather than a fixed boarding-stop radius. v45 supersedes this by applying the selected **Maximum walk to bus stop (m)** value as the boarding-stop eligibility limit. The default is 400 m. The app still deducts calculated access walk time from each band before applying remaining time to in-vehicle bus travel along mapped OSM route geometry using the selected speed model. Bus mode suppresses individual amenity, bus-stop and route-point markers. It displays the development site, bus catchment bands and nearby settlement labels only. Route corridor outputs are grouped by time band, converted into smoothed presentation polygons, and include a cartographic caveat that the smoothed areas are indicative rather than precise network-coverage boundaries.


## v41 road-type weighted speed mode

The v41 bus speed model selector keeps the existing flat average speed option and adds road-type weighted timing. In road-type mode, member ways are fetched with geometry and tags so route segments can use OSM `highway` classes. Motorway and trunk sections receive higher modelled average speeds than local urban/service roads. `maxspeed` tags are used as upper constraints and diagnostics only. Segments without usable way-level tags use the flat average speed as the fallback.


## v45 maximum walk-to-bus-stop setting

Bus mode now exposes **Maximum walk to bus stop (m)** in Advanced Settings. The default is 400 m and valid values are 50 m to 2,000 m. Candidate boarding stops are fetched using a small straight-line pre-filter around the selected distance, then retained only if the pedestrian access distance from the site/access point is within the selected limit. Routed pedestrian distance is preferred; straight-line fallback is only used where routing cannot be returned and is recorded in diagnostics/method notes.

The maximum walk setting is included in bus relation, accessible-route and isochrone cache keys. Increasing or reducing it triggers recalculation and prevents reuse of stale accessible routes from a previous walk-distance setting.


## v45 BODS timetable mode

Bus mode now has a method selector: **OSM corridor estimate** or **BODS timetable-based**. BODS mode calls the Bus Open Data Service through the Cloudflare Worker using the `BODS_API_KEY` secret. It attempts to download local timetable datasets for the selected area, parse TransXChange stop-to-stop timings in the browser, and run an earliest-arrival search from the selected departure date/time. Initial access and transfer walking are estimated using straight-line distance multiplied by 1.3 and 4.8 kph walking speed. The mode is timetable-led and includes scheduled wait time where the timetable files can be parsed, but it does not include live disruption, reliability, cancellations, crowding or fare integration. If BODS data cannot be parsed for the selected area, switch back to OSM corridor estimate.
