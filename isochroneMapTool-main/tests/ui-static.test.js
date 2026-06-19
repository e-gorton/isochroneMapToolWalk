import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = dirname(dirname(fileURLToPath(import.meta.url)));

const sourceHtml = readFileSync(join(projectRoot, "index.html"), "utf8");
const deployedHtml = readFileSync(join(projectRoot, "dist", "index.html"), "utf8");
const sourceCss = readFileSync(join(projectRoot, "styles.css"), "utf8");
const deployedCss = readFileSync(join(projectRoot, "dist", "styles.css"), "utf8");

assert.equal(deployedHtml, sourceHtml, "Deployed HTML should stay in sync with the source HTML.");
assert.equal(deployedCss, sourceCss, "Deployed CSS should stay in sync with the source CSS.");

for (const html of [sourceHtml, deployedHtml]) {
  assert.match(html, /manual-edit-guidance/, "Manual editing guidance should be present in the editor panel.");
  assert.match(html, /Draw them so they cross or touch the road\/path you want to connect to/, "Manual route drawing guidance should explain how to make proposed links register.");
  assert.match(html, /Exclusion areas only mask the displayed\s+isochrone fill and do not change the routed network/, "Exclusion guidance should distinguish masking from routed-network changes.");
}

for (const css of [sourceCss, deployedCss]) {
  assert.match(css, /\.manual-edit-guidance\s*{/, "Manual editing guidance should have a styled panel.");
  assert.match(css, /border:\s*1px dashed rgba\(47, 107, 87, 0\.35\)/, "Manual editing guidance should use the planning-note dashed border treatment.");
}
