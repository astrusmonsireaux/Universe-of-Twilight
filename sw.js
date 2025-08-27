// Service Worker for Veauxalia
const CACHE_NAME = 'veauxalia-v1.0.0';
const urlsToCache = [
  '/',
  '/index.html',
  '/styles/main.css',
  '/js/main.js',
  '/js/utils/Constants.js',
  '/js/utils/MathUtils.js',
  '/js/core/Game.js',
  '/js/core/Scene.js',
  '/js/core/Player.js',
  '/js/core/Camera.js',
  '/js/core/Controls.js',
  '/js/world/Planet.js',
  '/js/world/Star.js',
  '/js/world/SolarSystem.js',
  '/js/world/Terrain.js',
  '/js/world/Atmosphere.js',
  '/js/systems/Physics.js',
  '/js/systems/OrbitalMechanics.js',
  '/js/systems/Weather.js',
  '/js/ui/HUD.js',
  '/js/ui/Menu.js',
  '/js/ui/Crafting.js',
  '/js/ui/Map.js',
  '/js/data/PlanetData.js',
  '/js/data/StarData.js',
  '/js/data/ItemData.js'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Return cached version or fetch from network
        return response || fetch(event.request);
      })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});