// MyPrayerTower Sanctuary Service Worker & Push Notification Hub
const CACHE_NAME = 'mpt-sanctuary-v4';

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
                        // In local development, purge ALL caches to prevent webpack chunk collision
                        if (
                            self.location.hostname === 'localhost' ||
                            self.location.hostname === '127.0.0.1' ||
                            key !== CACHE_NAME
                        ) {
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

    // NEVER intercept or cache localhost, admin, API, or HMR routes
    if (
        url.hostname === 'localhost' ||
        url.hostname === '127.0.0.1' ||
        url.pathname.startsWith('/admin') ||
        url.pathname.startsWith('/api') ||
        url.pathname.startsWith('/auth') ||
        url.pathname.startsWith('/_next/webpack-hmr')
    ) {
        return;
    }

    // Static assets (CSS, JS, fonts, static images) - Stale while revalidate in production
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
        
        // Dynamic sacred action buttons based on notification type
        let actions = payload.actions;
        if (!actions) {
            const url = payload.data?.url || payload.url || '';
            if (url.includes('readings')) {
                actions = [
                    { action: 'read', title: '📖 Read Gospel' },
                    { action: 'amen', title: '🙏 Amen' }
                ];
            } else if (url.includes('prayers') || title.includes('Angelus')) {
                actions = [
                    { action: 'pray', title: '🕊️ Pray Angelus' },
                    { action: 'amen', title: '🙏 Amen' }
                ];
            } else if (url.includes('chaplets') || title.includes('Mercy')) {
                actions = [
                    { action: 'chaplet', title: '✝️ Pray Chaplet' },
                    { action: 'amen', title: '🙏 Amen' }
                ];
            } else {
                actions = [
                    { action: 'open', title: '🙏 Enter Sanctuary' }
                ];
            }
        }

        const options = {
            body: payload.body || 'A new grace awaits in your digital sanctuary.',
            icon: payload.icon || '/icon-192.png',
            badge: payload.badge || '/icon.png',
            image: payload.image || undefined,
            data: payload.data || { url: payload.url || '/prayers' },
            actions: actions,
            vibrate: [250, 150, 250, 150, 400],
            tag: payload.tag || 'devotion-reminder',
            renotify: true
        };

        // App badge counter synchronization
        if ('setAppBadge' in navigator) {
            navigator.setAppBadge().catch(() => {});
        }

        event.waitUntil(self.registration.showNotification(title, options));
    } catch (e) {
        const text = event.data.text();
        event.waitUntil(self.registration.showNotification('MyPrayerTower', {
            body: text,
            icon: '/icon-192.png',
            data: { url: '/prayers' },
            actions: [{ action: 'open', title: '🙏 Open' }]
        }));
    }
});

self.addEventListener('notificationclick', function(event) {
    event.notification.close();
    
    // Clear badge on interaction
    if ('clearAppBadge' in navigator) {
        navigator.clearAppBadge().catch(() => {});
    }

    // Dismiss action needs no navigation
    if (event.action === 'amen') {
        return;
    }

    let targetUrl = event.notification.data?.url || '/prayers';
    if (event.action === 'read') {
        targetUrl = '/readings';
    } else if (event.action === 'pray') {
        targetUrl = '/prayers';
    } else if (event.action === 'chaplet') {
        targetUrl = '/prayers';
    }

    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function(clientList) {
            for (let i = 0; i < clientList.length; i++) {
                const client = clientList[i];
                if ('focus' in client) {
                    if ('navigate' in client) {
                        client.navigate(targetUrl);
                    }
                    return client.focus();
                }
            }
            if (clients.openWindow) {
                return clients.openWindow(targetUrl);
            }
        })
    );
});
