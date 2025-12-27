import type { Metadata } from 'next';
import './globals.css';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';


export const metadata: Metadata = {
    title: 'MyPrayerTower - Find Churches, Share Prayers, Grow in Faith',
    description: 'The #1 All-in-One Catholic Services App. Find churches near you, join the prayer wall, explore saints, and deepen your spiritual journey.',
    keywords: 'Catholic, church finder, prayer, rosary, saints, Mass times, confession, Catholic app',
    authors: [{ name: 'MyPrayerTower' }],
    manifest: '/manifest.json',
    icons: {
        icon: '/favicon.ico',
        apple: '/apple-touch-icon.png',
    },
    appleWebApp: {
        capable: true,
        statusBarStyle: 'default',
        title: 'MyPrayerTower',
    },
    viewport: {
        width: 'device-width',
        initialScale: 1,
        maximumScale: 1,
        userScalable: false,
    },
    openGraph: {
        title: 'MyPrayerTower - All-in-One Catholic Services',
        description: 'Find churches, share prayers, and grow in faith with the global Catholic community.',
        type: 'website',
        locale: 'en_US',
        url: 'https://myprayertower.com',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'MyPrayerTower',
        description: 'The #1 All-in-One Catholic Services App',
    },
};


export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body className="min-h-screen bg-white text-gray-900 antialiased">
                <Header />
                <main className="flex-1">{children}</main>
                <Footer />
            </body>
        </html>
    );
}
