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
                src: '/icon.png',
                sizes: '1024x1024',
                type: 'image/png',
            },
        ],
    };
}
