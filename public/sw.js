const staticCacheName = 'iPad0Cache-v20';
const errorCacheName = 'errors';
const assets = [
    'ipad0.html',
    'style/normalize.css',
    'style/styles-v1.css',
    'https://cdn.socket.io/4.4.0/socket.io.min.js',
    'vid-controls.js',
    'offline.html' 
];

// 'https://dl.dropboxusercontent.com/s/h8s8nvg7dfsxuwh/iPad0-80mb.mp4?dl=0',

// install service worker
self.addEventListener('install', evt => { 
    evt.waitUntil(
        caches.open(staticCacheName).then(cache => {
            console.log('[Service Worker] Install: caching assets');
          cache.addAll(assets)
            .then(() => {
              console.log('[Service Worker] Install: caching assets - done')
            })
            .catch((err) => { 
              console.log('[Service Worker] Install: caching assets - error', err);
          });
        })
    );
});

// activate event
self.addEventListener('activate', evt => { 
    evt.waitUntil(
        caches.keys().then(keys => { 
            return Promise.all(keys
                .filter(key => key !== staticCacheName)
                .map(key => caches.delete(key))
            )
        })
    );
});

// fetch event
// self.addEventListener('fetch', evt => {
//     evt.respondWith(
//         caches.match(evt.request).then(cacheRes => {
//             return cacheRes || fetch(evt.request);
//         })
//     );
// });

// self.addEventListener('fetch', (e) => {
//   e.respondWith((async () => {
//     const r = await caches.match(e.request);
//     console.log(`[Service Worker] Fetching resource: ${e.request.url}`);
//     if (r) { return r; }
//     const response = await fetch(e.request);
//     const cache = await caches.open(staticCacheName);
//     console.log(`[Service Worker] Caching new resource: ${e.request.url}`);
//     cache.put(e.request, response.clone());
//     return response;
//   })());
// });

//Fetching with proper handling of exceptions, specifically Status 203 responses (due to the video resquest)

self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        if (response) {
          return response;     // if valid response is found in cache return it
        } else {
          return fetch(event.request)     //fetch from internet
            .then(function (res) {
              return caches.open(staticCacheName)
                  .then(function (cache) {
                    cache.put(event.request.url, res.clone()).then(() => { 
                        console.log(`[Service Worker] Caching new resource: ${event.request.url}`);
                    }).catch(function (err) {
                        //e.g. if response is a 206, like for the dropbox hosted video, handle exception and carry on. 
                        console.log(`[Service Worker] Cannot cache.put(): ${event.request.url}, error: ${err}`);
                      });
                    return res;   // return the fetched data
                })
            })
            .catch(function (err) {       // fallback mechanism
              console.log('Fetch error!', err);
              return caches.open(errorCacheName)
                .then(function(cache) {
                  return cache.match('/offline.html');
                });
            });
        }
      })
  );
});          