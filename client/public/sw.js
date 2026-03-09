// Simple service worker to allow PWA installation
self.addEventListener('fetch', (event) => {
    // It doesn't need to cache much to be 'installable', 
    // just exist and respond.
});
