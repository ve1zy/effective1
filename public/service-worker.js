const CACHE_NAME = "superhero-comics-v1";
const ASSETS_TO_CACHE = [
  "/",
  "/index.html",
  "/src/App.css",
  "/src/main.tsx",
  "/static/images/effective.jpg",
];
self.addEventListener("push", (event) => {
  const data = event.data?.json();
  console.log("[Service Worker] Push received:", data);

  const title = data.notification.title || "New Message";
  const options = {
    body: data.notification.body || "You have received a new message",
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener("notificationclick", (event) => {
  const notification = event.notification;
  const action = event.action;

  notification.close();

  const data = notification.data;

  if (data && data.url) {
    event.waitUntil(clients.openWindow(data.url));
  } else {
    event.waitUntil(clients.openWindow("/"));
  }
});
self.addEventListener("install", (event) => {
  console.log("[Service Worker] Installing...");
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("[Service Worker] Caching assets...");
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

self.addEventListener("activate", (event) => {
  console.log("[Service Worker] Activating...");
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log(`[Service Worker] Deleting old cache: ${cacheName}`);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim(); 
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  if (request.method !== "GET") {
    return;
  }

  // Пропускаем кэширование API-запросов к Superhero API
  if (url.pathname.startsWith('/api/superhero')) {
    event.respondWith(fetch(request));
  } else {
    event.respondWith(
      caches.match(request).then((cachedResponse) => {
        if (cachedResponse) {
          console.log(`[Service Worker] Serving from cache: ${request.url}`);
          return cachedResponse;
        }
        return fetch(request).then((response) => {
          // Проверяем, что ответ можно клонировать и кэшировать
          if (response.status === 200 && response.type === 'basic') {
            const responseToCache = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, responseToCache);
            });
          }
          return response;
        });
      })
    );
  }
});
self.addEventListener("notificationclick", (event) => {
  const data = event.notification?.data;
  console.log("[Service Worker] Notification clicked:", data);

  event.waitUntil(
    clients.openWindow(data?.url || "/")
  );
});
