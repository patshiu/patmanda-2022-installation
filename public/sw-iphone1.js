const staticCacheName = 'iPhone1Cache-v1';
const assets = [
    'iphone1.html',
    'https://dl.dropboxusercontent.com/s/ac446qk3mpv82at/iPhone1-100mb.mp4?dl=0',
    'style/normalize.css',
    'style/styles.css',
    'https://cdn.socket.io/4.4.0/socket.io.min.js',
    'vid-controls.js'   
];

// install service worker
self.addEventListener('install', evt => { 
    evt.waitUntil(
        caches.open(staticCacheName).then(cache => {
            console.log('caching assets');
            cache.addAll(assets);
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
self.addEventListener('fetch', evt => { 
    evt.respondWith(
        caches.match(evt.request).then(cacheRes => { 
            return cacheRes || fetch(evt.request);
        })
    )
})