Root deploy package - v46 BODS timetable dataset discovery fix

This package deploys from the repository root. Cloudflare should use Path `/` and run `npx wrangler deploy --config wrangler.toml`.

The active app file is `isochroneMapTool-main/app.nokeybus.v46.js` and the active asset file is `isochroneMapTool-main/dist/app.nokeybus.v46.js`.

BODS timetable mode requires the Cloudflare secret `BODS_API_KEY`. Keep it out of GitHub and front-end JavaScript.
