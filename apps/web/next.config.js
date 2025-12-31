const withPWA = require("@ducanh2912/next-pwa").default({
    dest: "public",
    cacheOnFrontEndNav: true,
    aggressiveFrontEndNavCaching: true,
    reloadOnOnline: true,
    swcMinify: true,
    disable: process.env.NODE_ENV === "development",
    workboxOptions: {
        disableDevLogs: true,
        runtimeCaching: [
            {
                urlPattern: /^\/prayers\/.*/,
                handler: 'CacheFirst',
                options: {
                    cacheName: 'prayers-cache',
                    expiration: {
                        maxEntries: 100,
                        maxAgeSeconds: 60 * 60 * 24 * 7, // 1 week
                    },
                },
            },
            {
                urlPattern: /^\/saints\/.*/,
                handler: 'CacheFirst',
                options: {
                    cacheName: 'saints-cache',
                    expiration: {
                        maxEntries: 200,
                        maxAgeSeconds: 60 * 60 * 24 * 30, // 30 days
                    },
                },
            },
            {
                urlPattern: /^\/rosary/,
                handler: 'CacheFirst',
                options: {
                    cacheName: 'rosary-cache',
                    expiration: {
                        maxAgeSeconds: 60 * 60 * 24 * 30,
                    },
                },
            },
            {
                urlPattern: /^\/_next\/image\?url=.*/,
                handler: 'CacheFirst',
                options: {
                    cacheName: 'images-cache',
                    expiration: {
                        maxEntries: 100,
                        maxAgeSeconds: 60 * 60 * 24 * 7,
                    },
                },
            },
            // Cache API responses
            {
                urlPattern: /^\/api\/.*/,
                handler: 'NetworkFirst',
                options: {
                    cacheName: 'api-cache',
                    expiration: {
                        maxEntries: 50,
                        maxAgeSeconds: 60 * 5, // 5 minutes
                    },
                    networkTimeoutSeconds: 10,
                },
            },
            // Cache static assets
            {
                urlPattern: /\.(?:js|css|woff2?)$/i,
                handler: 'StaleWhileRevalidate',
                options: {
                    cacheName: 'static-assets',
                    expiration: {
                        maxEntries: 100,
                        maxAgeSeconds: 60 * 60 * 24 * 30,
                    },
                },
            },
        ],
    },
});

/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    typescript: {
        ignoreBuildErrors: true,
    },
    eslint: {
        ignoreDuringBuilds: true,
    },
    // Performance optimizations
    compress: true,
    poweredByHeader: false,
    generateEtags: true,

    // Image optimization
    images: {
        domains: ['myprayertower.com', 'gcatholic.org', 'localhost'],
        formats: ['image/avif', 'image/webp'],
        minimumCacheTTL: 60 * 60 * 24 * 30, // 30 days
        deviceSizes: [640, 750, 828, 1080, 1200],
        imageSizes: [16, 32, 48, 64, 96, 128, 256],
    },

    // Experimental optimizations
    experimental: {
        optimizePackageImports: ['lucide-react', '@headlessui/react'],
    },

    // Headers for caching
    async headers() {
        return [
            {
                source: '/:all*(svg|jpg|jpeg|png|gif|ico|webp|avif)',
                headers: [
                    {
                        key: 'Cache-Control',
                        value: 'public, max-age=31536000, immutable',
                    },
                ],
            },
            {
                source: '/_next/static/:path*',
                headers: [
                    {
                        key: 'Cache-Control',
                        value: 'public, max-age=31536000, immutable',
                    },
                ],
            },
            {
                source: '/fonts/:path*',
                headers: [
                    {
                        key: 'Cache-Control',
                        value: 'public, max-age=31536000, immutable',
                    },
                ],
            },
            {
                source: '/(.*)',
                headers: [
                    {
                        key: 'Content-Security-Policy',
                        value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.stripe.com https://www.googletagmanager.com https://pagead2.googlesyndication.com https://www.google-analytics.com https://www.googleadservices.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https: blob:; connect-src 'self' https://api.stripe.com https://www.google-analytics.com https://pagead2.googlesyndication.com https://*.supabase.co; frame-src 'self' https://js.stripe.com https://www.google.com https://googleads.g.doubleclick.net https://tpc.googlesyndication.com;",
                    },
                ],
            },
        ];
    },

    async rewrites() {
        return {
            beforeFiles: [],
            afterFiles: [],
            fallback: [
                {
                    source: '/api/:path*',
                    destination: `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/v1/:path*`,
                },
            ],
        };
    },
};

module.exports = withPWA(nextConfig);
