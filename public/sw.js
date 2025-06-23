const CACHE_NAME = "suicide-kings-v1"
const urlsToCache = [
  "/",
  "/static/js/bundle.js",
  "/static/css/main.css",
  "/images/suicide-kings-car-club-logo.png",
  "/offline.html",
]
const STATIC_CACHE = "skcc-static-v1.0.0"
const DYNAMIC_CACHE = "skcc-dynamic-v1.0.0"

// Assets to cache immediately
const STATIC_ASSETS = [
  "/",
  "/manifest.json",
  "/images/suicide-kings-car-club-logo.png",
  "/images/icons/icon-192x192.png",
  "/images/icons/icon-512x512.png",
  "/offline.html",
]

// Install event - cache static assets
self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache)))
})

// Activate event - clean up old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE && cacheName !== CACHE_NAME) {
              return caches.delete(cacheName)
            }
          }),
        )
      })
      .then(() => {
        return self.clients.claim()
      }),
  )
})

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      if (response) {
        return response
      }
      return fetch(event.request)
    }),
  )
})

// Push notification event
self.addEventListener("push", (event) => {
  if (event.data) {
    const data = event.data.json()
    const options = {
      body: data.body,
      icon: "/images/icons/icon-192x192.png",
      badge: "/images/icons/icon-72x72.png",
      data: data.data,
      actions: data.actions || [],
    }

    event.waitUntil(self.registration.showNotification(data.title, options))
  }
})

// Notification click event
self.addEventListener("notificationclick", (event) => {
  event.notification.close()

  const urlToOpen = event.notification.data?.url || "/"

  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
      // Check if app is already open
      for (const client of clientList) {
        if (client.url === urlToOpen && "focus" in client) {
          return client.focus()
        }
      }

      // Open new window/tab
      if (clients.openWindow) {
        return clients.openWindow(urlToOpen)
      }
    }),
  )
})
