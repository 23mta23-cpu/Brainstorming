// Deterministic frame renderer: scene.html exposes window.renderAt(t); we screenshot each frame into ffmpeg.
// Usage: node render.mjs scene.html timeline.json out.mp4 fps width height [--frames a:b] [--png dir]
// ponytail: one browser page, sequential frames; parallel pages if render time ever matters.
import { createRequire } from "node:module";
import { spawn } from "node:child_process";
import { readFileSync, mkdirSync, writeFileSync } from "node:fs";
import { pathToFileURL } from "node:url";
const { chromium } = createRequire(import.meta.url)("playwright"); // global install, resolved via NODE_PATH

const [scene, tlPath, out, fpsS, wS, hS, ...rest] = process.argv.slice(2);
const fps = +fpsS, W = +wS, H = +hS;
const tl = JSON.parse(readFileSync(tlPath, "utf8"));
const total = Math.round(tl.duration * fps);
const fr = rest.includes("--frames") ? rest[rest.indexOf("--frames") + 1].split(":").map(Number) : [0, total];
const pngDir = rest.includes("--png") ? rest[rest.indexOf("--png") + 1] : null;
const times = rest.includes("--times") ? rest[rest.indexOf("--times") + 1].split(",").map(Number) : null; // preview stills

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: 1 });
page.on("pageerror", (e) => { console.error("scene error:", e.message); process.exit(2); });
await page.goto(pathToFileURL(scene).href);
await page.evaluate((t) => window.initScene(t), tl);
await page.evaluate(() => document.fonts.ready);

let ff = null;
if (!pngDir) {
  ff = spawn("ffmpeg", ["-y", "-loglevel", "error", "-f", "image2pipe", "-framerate", String(fps), "-i", "-",
    "-c:v", "libx264", "-preset", "medium", "-crf", "21", "-pix_fmt", "yuv420p", "-r", String(fps), out],
    { stdio: ["pipe", "inherit", "inherit"] });
} else mkdirSync(pngDir, { recursive: true });

const t0 = Date.now();
const frames = times ? times.map((t) => Math.round(t * fps)) : Array.from({ length: fr[1] - fr[0] }, (_, i) => fr[0] + i);
for (const f of frames) {
  await page.evaluate((t) => window.renderAt(t), f / fps);
  const buf = await page.screenshot({ type: "jpeg", quality: 92 });
  if (ff) { if (!ff.stdin.write(buf)) await new Promise((r) => ff.stdin.once("drain", r)); }
  else writeFileSync(`${pngDir}/f${String(f).padStart(5, "0")}.jpg`, buf);
  if (f % 150 === 0) console.log(`frame ${f}/${fr[1]} ${((Date.now() - t0) / 1000).toFixed(0)}s`);
}
await browser.close();
if (ff) { ff.stdin.end(); await new Promise((r, j) => ff.on("close", (c) => (c ? j(new Error("ffmpeg " + c)) : r()))); }
console.log(`rendered ${frames.length} frames in ${((Date.now() - t0) / 1000).toFixed(1)}s`);
