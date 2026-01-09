import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: 'MyPrayerTower',
        short_name: 'MPT',
        description: 'The #1 All-in-One Catholic Services App',
        start_url: '/',
        display: 'standalone',
        background_color: '#ffffff',
        theme_color: '#FCD34D', // Gold/Amber theme color
        icons: [
            {
                src: '/favicon.ico',
                sizes: 'any',
                type: 'image/x-icon',
            },
            {
                src: '/icon.png',
                sizes: '192x192',
                type: 'image/png',
            },
            {
                src: '/icon.png',
                sizes: '512x512',
                type: 'image/png',
            },
        ],
    };
}
