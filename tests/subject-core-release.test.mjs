import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const releaseRoot = new URL("../subject-core/", import.meta.url);

async function text(path) {
  return readFile(new URL(path, releaseRoot), "utf8");
}

test("Subject Core entrypoint declares the offline shell and a bounded CSP", async () => {
  const html = await text("index.html");

  assert.match(html, /http-equiv="Content-Security-Policy"/);
  assert.match(html, /default-src 'self'/);
  assert.match(html, /script-src 'self' 'wasm-unsafe-eval' https:\/\/cdn\.jsdelivr\.net/);
  assert.match(html, /connect-src 'self' https:\/\/cdn\.jsdelivr\.net https:\/\/huggingface\.co/);
  assert.match(html, /rel="manifest" href="\.\/manifest\.webmanifest"/);
  assert.match(html, /src="\.\/assets\/app\.js"/);
  assert.match(html, /href="\.\/assets\/app\.css"/);
});

test("manifest and service worker describe an app-shell fallback, not a model cache", async () => {
  const manifest = JSON.parse(await text("manifest.webmanifest"));
  const serviceWorker = await text("sw.js");

  assert.equal(manifest.start_url, "./");
  assert.equal(manifest.scope, "./");
  assert.equal(manifest.display, "standalone");
  assert.match(serviceWorker, /subject-core-shell-/);
  assert.match(serviceWorker, /CACHE_NAME = `\$\{CACHE_PREFIX\}v1`/);
  assert.match(serviceWorker, /request\.mode === "navigate"/);
  assert.match(serviceWorker, /url\.origin !== SCOPE_URL\.origin/);
  assert.doesNotMatch(serviceWorker, /jsdelivr|huggingface|MiniLM|model_quantized/i);
});

test("release bundle exposes persistence, online-first disclosure, and bounded inference", async () => {
  const app = await text("assets/app.js");

  assert.match(app, /gdeya\.subject-core\.diary\.v1/);
  assert.match(app, /stable · online-first/);
  assert.match(app, /модельный коэффициент офлайн не обещается/);
  assert.match(app, /120 секунд/);
  assert.match(app, /tzar-semantic\.worker\.js/);
});

test("semantic worker keeps the runtime and multilingual model pinned", async () => {
  const worker = await text("assets/tzar-semantic.worker.js");

  assert.match(worker, /@huggingface\/transformers@4\.0\.1/);
  assert.match(worker, /Xenova\/paraphrase-multilingual-MiniLM-L12-v2/);
  assert.match(worker, /2c4055b12046f11709e9df2c122e59ffbdc2f900/);
  assert.match(worker, /dtype:`q8`/);
});
