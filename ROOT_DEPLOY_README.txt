Root deploy package - v46 BODS timetable dataset discovery fix

This package deploys from the repository root. Cloudflare should use Path `/` and run `npx wrangler deploy --config wrangler.toml`.

The active source app file is `isochroneMapTool-main/app.nokeybus.v46.js` and the deployed asset copy is `isochroneMapTool-main/dist/app.nokeybus.v46.js`. Keep these files in sync before deployment.

Walking/cycling isochrones are calculated from a local OSM active-travel graph in the browser. Manual active-travel line and barrier edits affect that local walking/cycling graph. Isochrone exclusion areas are cartographic masks only.

BODS timetable mode requires the Cloudflare secret `BODS_API_KEY`. Keep it out of GitHub and front-end JavaScript.
