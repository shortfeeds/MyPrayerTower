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
    output: 'standalone',
    transpilePackages: ['@mpt/database', '@cashfreepayments/cashfree-js'],
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
        unoptimized: true, // Crucial for Hostinger stability
        domains: [
            'myprayertower.com', 
            'gcatholic.org', 
            'localhost', 
            'images.unsplash.com', 
            'htgvilktnadnwlforyjt.supabase.co'
        ],
    },

    // Experimental optimizations
    experimental: {
        optimizePackageImports: [
            'lucide-react',
            '@headlessui/react',
            'framer-motion',
            'date-fns',
            'recharts',
            '@radix-ui/react-dialog',
            '@radix-ui/react-dropdown-menu',
            '@radix-ui/react-toast',
        ],
        serverComponentsExternalPackages: ['@prisma/client', 'bcryptjs'],
        optimizeCss: true,
        scrollRestoration: true,
        webpackBuildWorker: true,
        parallelServerBuildTraces: true,
    },

    // Headers for caching and SEO
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
                // Global security and performance headers
                source: '/(.*)',
                headers: [
                    {
                        key: 'Strict-Transport-Security',
                        value: 'max-age=63072000; includeSubDomains; preload',
                    },
                    {
                        key: 'X-DNS-Prefetch-Control',
                        value: 'on',
                    },
                    {
                        key: 'Content-Security-Policy',
                        value: [
                            "default-src 'self'",
                            "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://*.paypal.com https://*.paypalobjects.com https://*.stripe.com https://*.google.com https://*.googletagmanager.com https://*.googlesyndication.com https://*.google-analytics.com https://*.googleadservices.com https://*.doubleclick.net https://*.cashfree.com https://translate.google.com https://translate.googleapis.com https://translate-pa.googleapis.com https://ep2.adtrafficquality.google",
                            "script-src-elem 'self' 'unsafe-inline' 'unsafe-eval' https://*.paypal.com https://*.paypalobjects.com https://*.stripe.com https://*.google.com https://*.googletagmanager.com https://*.googlesyndication.com https://*.google-analytics.com https://*.googleadservices.com https://*.doubleclick.net https://*.cashfree.com https://translate.google.com https://translate.googleapis.com https://translate-pa.googleapis.com https://ep2.adtrafficquality.google",

                            "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://www.gstatic.com",
                            "font-src 'self' https://fonts.gstatic.com",
                            "img-src 'self' data: https: blob: https://*.paypal.com",
                            "connect-src 'self' https://*.paypal.com https://*.paypalobjects.com https://*.stripe.com https://*.google-analytics.com https://analytics.google.com https://*.doubleclick.net https://stats.g.doubleclick.net https://*.googlesyndication.com https://*.gstatic.com https://*.adtrafficquality.google https://*.supabase.co https://*.cashfree.com https://*.neon.tech https://bible-api.com https://translate.googleapis.com",
                            "frame-src 'self' https://*.paypal.com https://*.paypalobjects.com https://*.stripe.com https://*.google.com https://*.youtube.com https://*.vimeo.com https://*.doubleclick.net https://*.googlesyndication.com https://*.cashfree.com https://*.adtrafficquality.google",
                        ].join('; '),
                    },
                ],
            },
        ];
    },

    async rewrites() {
        // Use the Supabase URL directly for rewrites (server-side only)
        // Do NOT use NEXT_PUBLIC_API_URL here as it may be set to '/api' which causes double-prefix
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || 'http://localhost:4000';
        return {
            beforeFiles: [],
            afterFiles: [],
            fallback: [
                {
                    source: '/api/v1/:path*',
                    destination: `${supabaseUrl}/api/v1/:path*`,
                },
            ],
        };
    },

    async redirects() {
        return [
            {
                source: '/obituaries',
                destination: '/memorials',
                permanent: true,
            },
            {
                source: '/obituary',
                destination: '/memorials',
                permanent: true,
            },
            {
                // Match all paths EXCEPT those starting with .well-known
                source: '/:path((?!.well-known/).*)',
                has: [
                    {
                        type: 'host',
                        value: 'myprayertower.com', // Only apply to the non-www domain
                    },
                ],
                destination: 'https://www.myprayertower.com/:path*',
                permanent: false,
            },
        ];
    },
};

module.exports = withPWA(nextConfig);
