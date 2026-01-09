import type { Metadata } from 'next';
import Script from 'next/script';
import { Inter, Merriweather, Playfair_Display } from 'next/font/google';
import './globals.css';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ThemeProvider } from '@/components/ThemeProvider';
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { GlobalEngagement } from '@/components/GlobalEngagement';
import { BackToTop } from '@/components/ui/BackToTop';
import { SkipToContent } from '@/components/ui/SkipToContent';

// Self-hosted fonts for performance
const inter = Inter({
    subsets: ['latin'],
    variable: '--font-inter',
    display: 'swap',
});

const merriweather = Merriweather({
    subsets: ['latin'],
    weight: ['300', '400', '700', '900'],
    variable: '--font-merriweather',
    display: 'swap',
});

const playfair = Playfair_Display({
    subsets: ['latin'],
    weight: ['400', '500', '600', '700', '800', '900'],
    variable: '--font-playfair',
    display: 'swap',
});

export const metadata: Metadata = {
    metadataBase: new URL('https://myprayertower.com'),
    title: 'MyPrayerTower - Find Churches, Share Prayers, Grow in Faith',
    description: 'The #1 All-in-One Catholic Services App. Find churches near you, join the prayer wall, explore saints, and deepen your spiritual journey.',
    keywords: 'Catholic, church finder, prayer, rosary, saints, Mass times, confession, Catholic app',
    authors: [{ name: 'MyPrayerTower' }],
    manifest: '/manifest.json',
    icons: {
        icon: '/favicon.ico',
        shortcut: '/favicon.ico',
        apple: '/icon.png',
    },
    appleWebApp: {
        capable: true,
        statusBarStyle: 'default',
        title: 'MyPrayerTower',
    },
    other: {
        'mobile-web-app-capable': 'yes',
    },
    openGraph: {
        title: 'MyPrayerTower - All-in-One Catholic Services',
        description: 'Find churches, share prayers, and grow in faith with the global Catholic community.',
        type: 'website',
        locale: 'en_US',
        url: 'https://myprayertower.com',
        images: ['/og-image.png'],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'MyPrayerTower',
        description: 'The #1 All-in-One Catholic Services App',
        images: ['/og-image.png'],
    },
};

export const viewport = {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
};


export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" className={`${inter.variable} ${merriweather.variable} ${playfair.variable}`} suppressHydrationWarning>
            <head>
                {/* Google AdSense - Optimized Load Strategy */}
                {process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID && (
                    <Script
                        async
                        src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID}`}
                        strategy="lazyOnload"
                        crossOrigin="anonymous"
                    />
                )}

                {/* Preconnect to critical domains */}
                <link rel="preconnect" href="https://htgvilktnadnwlforyjt.supabase.co" />
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                {/* Cashfree Payments SDK */}
                <Script
                    src="https://sdk.cashfree.com/js/v3/cashfree.js"
                    strategy="beforeInteractive"
                />
            </head>
            <body className="min-h-screen-safe flex flex-col bg-[hsl(var(--background))] text-[hsl(var(--foreground))] antialiased transition-colors duration-300">
                <ThemeProvider>
                    <SkipToContent />
                    <Header />
                    <main id="main-content" className="flex-1 w-full">{children}</main>
                    <Footer />

                    {/* Global Engagement Components */}
                    <GlobalEngagement />
                    <BackToTop />

                    <script
                        type="application/ld+json"
                        dangerouslySetInnerHTML={{
                            __html: JSON.stringify({
                                '@context': 'https://schema.org',
                                '@type': 'Organization',
                                name: 'MyPrayerTower',
                                url: 'https://myprayertower.com',
                                logo: 'https://myprayertower.com/icon.svg',
                                sameAs: [
                                    'https://www.facebook.com/MyPrayerTower2',
                                    'https://www.youtube.com/c/MyPrayerTower'
                                ],
                                description: 'The #1 All-in-One Catholic Services App. Find churches, prayer wall, and daily readings.',
                            }),
                        }}
                    />
                </ThemeProvider>
                <Analytics />
                <SpeedInsights />
            </body>
        </html>
    );
}

