const CACHE_NAME = 'git-guide-shell-v1';
const OFFLINE_PAGE = '/docs/git/';
const SHELL_FILES = [
  '/docs/git/',
  '/docs/git/index.html',
  '/docs/git/manifest.webmanifest',
  '/assets/favicons/favicon.ico',
  '/assets/favicons/icon.svg',
  '/assets/favicons/apple-touch-icon.png',
  '/assets/favicons/android-chrome-192x192.png',
  '/assets/favicons/android-chrome-512x512.png'
];

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) { return cache.addAll(SHELL_FILES); })
      .then(function() { return self.skipWaiting(); })
  );
});

self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(keys) {
      return Promise.all(keys.map(function(key) {
        if (key !== CACHE_NAME && key.indexOf('git-guide-shell-') === 0) {
          return caches.delete(key);
        }
        return undefined;
      }));
    }).then(function() { return self.clients.claim(); })
  );
});

self.addEventListener('fetch', function(event) {
  if (event.request.method !== 'GET') return;

  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .then(function(response) {
          const responseCopy = response.clone();
          caches.open(CACHE_NAME).then(function(cache) {
            cache.put(OFFLINE_PAGE, responseCopy);
          });
          return response;
        })
        .catch(function() { return caches.match(OFFLINE_PAGE); })
    );
    return;
  }

  const requestURL = new URL(event.request.url);
  const localShellFile = requestURL.origin === self.location.origin &&
    (requestURL.pathname.indexOf('/docs/git/') === 0 ||
      requestURL.pathname.indexOf('/assets/favicons/') === 0);

  if (localShellFile) {
    event.respondWith(
      caches.match(event.request).then(function(cachedResponse) {
        return cachedResponse || fetch(event.request).then(function(response) {
          const responseCopy = response.clone();
          caches.open(CACHE_NAME).then(function(cache) {
            cache.put(event.request, responseCopy);
          });
          return response;
        });
      })
    );
  }
});
