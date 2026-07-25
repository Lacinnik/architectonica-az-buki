const CACHE_PREFIX = "subject-core-shell-";
const CACHE_NAME = `${CACHE_PREFIX}v1`;
const SCOPE_URL = new URL("./", self.registration.scope);
const CORE_URLS = [
  SCOPE_URL.href,
  new URL("manifest.webmanifest", SCOPE_URL).href,
  new URL("favicon.svg", SCOPE_URL).href,
];

async function cacheDocumentShell(cache) {
  const response = await fetch(SCOPE_URL, { cache: "reload", credentials: "include" });
  if (!response.ok) throw new Error(`Shell request failed with ${response.status}`);
  await cache.put(SCOPE_URL, response.clone());
  const html = await response.text();
  const assetUrls = [...html.matchAll(/(?:src|href)=["']([^"']+)["']/giu)]
    .map((match) => new URL(match[1], SCOPE_URL))
    .filter((url) => url.origin === SCOPE_URL.origin)
    .map((url) => url.href);
  await Promise.allSettled([...new Set([...CORE_URLS.slice(1), ...assetUrls])].map(async (url) => {
    const asset = await fetch(url, { cache: "reload", credentials: "include" });
    if (asset.ok) await cache.put(url, asset);
  }));
}

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cacheDocumentShell(cache))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys
        .filter((key) => key.startsWith(CACHE_PREFIX) && key !== CACHE_NAME)
        .map((key) => caches.delete(key))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET") return;
  const url = new URL(request.url);
  if (url.origin !== SCOPE_URL.origin) return;

  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then(async (response) => {
          if (response.ok) {
            const cache = await caches.open(CACHE_NAME);
            await cache.put(SCOPE_URL, response.clone());
          }
          return response;
        })
        .catch(() => caches.match(SCOPE_URL)),
    );
    return;
  }

  event.respondWith(
    caches.match(request).then((cached) => cached || fetch(request).then(async (response) => {
      if (response.ok) {
        const cache = await caches.open(CACHE_NAME);
        await cache.put(request, response.clone());
      }
      return response;
    })),
  );
});
