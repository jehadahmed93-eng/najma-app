const CACHE_NAME = "star-camp-pwa-v27";

// ✅ هذا يخلي المسارات تشتغل سواء على root أو داخل مجلد
const BASE = self.registration.scope; // مثال: https://site.com/starcamp/

const CORE_ASSETS = [
  BASE,
  BASE + "index.html",
  BASE + "manifest.json",
  BASE + "service-worker.js",
  BASE + "xlsx.bundle.js",
  BASE + "icons/icon-192.png",
  BASE + "icons/icon-512.png"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(CORE_ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.map((k) => (k !== CACHE_NAME ? caches.delete(k) : null)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;

  // ✅ لو تنقل داخل التطبيق
  if (req.mode === "navigate") {
    event.respondWith(
      fetch(req).catch(() => caches.match(BASE + "index.html"))
    );
    return;
  }

  event.respondWith(
    caches.match(req).then((cached) => {
      if (cached) return cached;

      return fetch(req)
        .then((res) => {
          const copy = res.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(req, copy));
          return res;
        })
        .catch(() => caches.match(BASE + "index.html"));
    })
  );
});