const CACHE_NAME = 'unbound-ai-v1';
const urlsToCache = [
  './AI.html',
  './manifest.json',
  './icon-192x192.png',
  './icon-512x512.png'
  // Note: Add any other CSS, JS, or image files your AI.html uses here
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Return cached version or fetch from network
        return response || fetch(event.request);
      })
  );
});
