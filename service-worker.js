const CACHE_NAME = 'alias-v1';
const urlsToCache = [
  '/B-Alis/',
  '/B-Alis/index.html',
  '/B-Alis/assets/index-*.css',
  '/B-Alis/assets/index-*.js',
  '/B-Alis/icons/icon-192.png',
  '/B-Alis/icons/icon-512.png',
  '/B-Alis/manifest.json',
  '/B-Alis/logo.svg',
  '/B-Alis/back.png',
  '/B-Alis/minus.svg',
  '/B-Alis/add.svg',
  '/B-Alis/del-light.svg',
  '/B-Alis/del-dark.svg',
  '/B-Alis/check.svg',
  '/B-Alis/check-dark.svg',
  '/B-Alis/edit.svg',
  '/B-Alis/Cormorant/Cormorant-Regular.woff2',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      if (response) return response;
      return fetch(event.request).then((response) => {
        if (!response || response.status !== 200 || response.type !== 'basic') {
          return response;
        }
        const responseToCache = response.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseToCache);
        });
        return response;
      });
    })
  );
});