// MyPrayerTower Sanctuary Service Worker & Push Notification Hub
const CACHE_NAME = 'mpt-sanctuary-v2';

self.addEventListener('install', (event) => {
    // Immediately activate without waiting for old tabs to close
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        Promise.all([
            // Claim all open windows immediately
            self.clients.claim(),
            // Clean up any stale workbox or legacy caches
            caches.keys().then((keys) => {
                return Promise.all(
                    keys.map((key) => {
                        if (key !== CACHE_NAME) {
                            return caches.delete(key);
                        }
                    })
                );
            })
        ])
    );
});

// Runtime fetch handler - Network-first for dynamic content, cache fallback for assets
self.addEventListener('fetch', (event) => {
    const { request } = event;
    const url = new URL(request.url);

    // Only handle GET requests from http/https
    if (request.method !== 'GET' || !url.protocol.startsWith('http')) {
        return;
    }

    // NEVER intercept or cache admin or API routes
    if (
        url.pathname.startsWith('/admin') ||
        url.pathname.startsWith('/api') ||
        url.pathname.startsWith('/auth')
    ) {
        return;
    }

    // Static assets (CSS, JS, fonts, static images) - Stale while revalidate
    if (
        url.pathname.startsWith('/_next/static/') ||
        url.pathname.match(/\.(?:png|jpg|jpeg|svg|gif|webp|ico|woff2?|css|js)$/i)
    ) {
        event.respondWith(
            caches.open(CACHE_NAME).then(async (cache) => {
                const cachedResponse = await cache.match(request);
                const fetchPromise = fetch(request)
                    .then((networkResponse) => {
                        if (networkResponse && networkResponse.status === 200) {
                            cache.put(request, networkResponse.clone());
                        }
                        return networkResponse;
                    })
                    .catch(() => cachedResponse);

                return cachedResponse || fetchPromise;
            })
        );
        return;
    }
});

// Sanctuary Auto-Pilot Push Notification Handlers
self.addEventListener('push', function(event) {
    if (!event.data) return;
    try {
        const payload = event.data.json();
        const title = payload.title || 'MyPrayerTower Sanctuary';
        const options = {
            body: payload.body || 'A new grace awaits in your digital sanctuary.',
            icon: payload.icon || '/icon-192.png',
            badge: payload.badge || '/icon.png',
            data: payload.data || { url: '/my-vigils' },
            vibrate: [200, 100, 200]
        };
        event.waitUntil(self.registration.showNotification(title, options));
    } catch (e) {
        const text = event.data.text();
        event.waitUntil(self.registration.showNotification('MyPrayerTower', {
            body: text,
            icon: '/icon-192.png',
            data: { url: '/my-vigils' }
        }));
    }
});

self.addEventListener('notificationclick', function(event) {
    event.notification.close();
    const targetUrl = event.notification.data?.url || '/my-vigils';
    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function(clientList) {
            for (let i = 0; i < clientList.length; i++) {
                const client = clientList[i];
                if (client.url.includes('myprayertower.com') && 'focus' in client) {
                    client.navigate(targetUrl);
                    return client.focus();
                }
            }
            if (clients.openWindow) {
                return clients.openWindow(targetUrl);
            }
        })
    );
});
