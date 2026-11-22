import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: 'MyPrayerTower',
        short_name: 'MPT',
        description: 'The #1 All-in-One Catholic Services App',
        start_url: '/',
        display: 'standalone',
        background_color: '#0A1835',
        theme_color: '#0A1835',
        icons: [
            {
                src: '/icon-192.png',
                sizes: '192x192',
                type: 'image/png',
            },
            {
                src: '/icon-512.png',
                sizes: '512x512',
                type: 'image/png',
            },
            {
                src: '/icon.png',
                sizes: '128x128',
                type: 'image/png',
            },
        ],
    };
}
