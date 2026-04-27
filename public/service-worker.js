const CACHE_NAME = "smart-saathi-v1"
const urlsToCache = [
  "/",
  "/manifest.json",
  "/logo.png",
  "/favicon.png",
  "/favicon.ico",
  "/_next/static/css/app/layout.css",
]

// Install event - cache essential files
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache).catch((error) => {
        console.error("[Service Worker] Failed to cache URLs:", error)
      })
    }),
  )
  self.skipWaiting()
})

// Activate event - clean up old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName)
          }
        }),
      )
    }),
  )
  self.clients.claim()
})

// Fetch event - serve from cache, fallback to network
self.addEventListener("fetch", (event) => {
  // Skip non-GET requests
  if (event.request.method !== "GET") {
    return
  }

  // Skip API requests - always fetch fresh
  if (event.request.url.includes("/api/")) {
    event.respondWith(
      fetch(event.request).catch(() => {
        return new Response("Offline - API unavailable", {
          status: 503,
          statusText: "Service Unavailable",
        })
      }),
    )
    return
  }

  // Cache first strategy for static assets
  if (event.request.url.includes("/_next/") || event.request.url.includes("/public/")) {
    event.respondWith(
      caches.match(event.request).then((response) => {
        return response || fetch(event.request)
      }),
    )
    return
  }

  // Network first strategy for documents
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Cache successful responses
        if (response && response.status === 200) {
          const responseClone = response.clone()
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone)
          })
        }
        return response
      })
      .catch(() => {
        // Fallback to cached version
        return caches.match(event.request).then((response) => {
          return (
            response ||
            new Response("Offline - Page unavailable", {
              status: 503,
              statusText: "Service Unavailable",
            })
          )
        })
      }),
  )
})
