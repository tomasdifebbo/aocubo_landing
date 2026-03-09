// Minimal service worker for installability
// To avoid blocking images on mobile (iOS/Safari/Chrome), 
// we keep this as simple as possible without fetch interception for now.
self.addEventListener('install', (event) => {
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    event.waitUntil(clients.claim());
});
