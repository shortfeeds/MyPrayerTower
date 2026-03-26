import type { Metadata } from 'next';
import Script from 'next/script';
import { GoogleAnalytics } from '@next/third-parties/google';
import { Inter, Merriweather, Playfair_Display } from 'next/font/google';
import './globals.css';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ThemeProvider } from '@/components/ThemeProvider';
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { GlobalEngagement } from '@/components/GlobalEngagement';
import { BackToTop } from '@/components/ui/BackToTop';
import { CookieConsent } from '@/components/CookieConsent';
import { SkipToContent } from '@/components/ui/SkipToContent';
import { SpiritualJourneyProvider } from '@/components/journey/SpiritualJourneyProvider';
import { PricingProvider } from '@/contexts/PricingContext';

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
    title: {
        default: 'MyPrayerTower | Catholic Prayer & Church Finder App',
        template: '%s | MyPrayerTower'
    },
    description: 'Join the global Catholic community. Find Mass times, submit prayer intentions, light virtual candles, and deepen your faith with daily readings and rosary.',
    keywords: ['Catholic App', 'Mass Times Near Me', 'Online Prayer Request', 'Virtual Candles', 'Catholic Daily Readings', 'Rosary Audio', 'Confession Guide', 'Saints of the Day'],
    authors: [{ name: 'MyPrayerTower Team', url: 'https://myprayertower.com' }],
    creator: 'MyPrayerTower',
    publisher: 'MyPrayerTower',
    formatDetection: {
        email: false,
        address: false,
        telephone: false,
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1,
        },
    },
    icons: {
        icon: [
            { url: '/favicon.ico', sizes: 'any' },
            { url: '/icon.png', type: 'image/png', sizes: '32x32' },
        ],
        apple: '/apple-icon.png',
        other: [
            {
                rel: 'apple-touch-icon-precomposed',
                url: '/apple-icon-precomposed.png',
            },
        ],
    },
    openGraph: {
        title: 'MyPrayerTower | Connect, Pray, Grow',
        description: 'The #1 Catholic App for Mass times, prayer requests, and daily spiritual growth. Join thousands of faithful users today.',
        url: 'https://myprayertower.com',
        siteName: 'MyPrayerTower',
        locale: 'en_US',
        type: 'website',
        images: [
            {
                url: '/opengraph-image',
                width: 1200,
                height: 630,
                alt: 'MyPrayerTower - Connect, Pray, Grow',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'MyPrayerTower',
        description: 'Find churches, request prayers, and grow in faith with the #1 Catholic App.',
        creator: '@myprayertower',
        images: ['/opengraph-image'], // Use the generate OG image for Twitter too
    },
    category: 'Lifestyle',
    verification: {
        google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || 'google-site-verification-code',
    },
    appleWebApp: {
        title: 'MyPrayerTower',
        statusBarStyle: 'black-translucent',
    },
    other: {
        'mobile-web-app-capable': 'yes',
    },
};

export const viewport = {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
    userScalable: true,
    viewportFit: 'cover',
    themeColor: '#0a1835',
};


import { AudioProvider } from '@/components/audio/AudioContext';

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" className={`${inter.variable} ${merriweather.variable} ${playfair.variable}`} suppressHydrationWarning>
            <head>
                {/* Preconnect to critical domains */}
                <link rel="manifest" href="/manifest.json" />
                <link rel="preconnect" href="https://htgvilktnadnwlforyjt.supabase.co" />
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                <link rel="preconnect" href="https://pagead2.googlesyndication.com" crossOrigin="anonymous" />
                <link rel="preconnect" href="https://googleads.g.doubleclick.net" crossOrigin="anonymous" />
            </head>
            <body className="min-h-screen-safe flex flex-col bg-[hsl(var(--background))] text-[hsl(var(--foreground))] antialiased transition-colors duration-300">
                <ThemeProvider>
                    <AudioProvider>
                        <SpiritualJourneyProvider>
                            <PricingProvider>
                                <SkipToContent />
                                <Header />
                                <main id="main-content" className="flex-1 w-full">{children}</main>
                                <Footer />

                                {/* Global Engagement Components */}
                                <GlobalEngagement />
                                <BackToTop />
                                <CookieConsent />

                                {/* Structured Data */}
                                <Script
                                    id="schema-org"
                                    type="application/ld+json"
                                    strategy="worker"
                                    dangerouslySetInnerHTML={{
                                        __html: JSON.stringify({
                                            '@context': 'https://schema.org',
                                            '@graph': [
                                                {
                                                    '@type': 'Organization',
                                                    '@id': 'https://myprayertower.com/#organization',
                                                    name: 'MyPrayerTower',
                                                    url: 'https://myprayertower.com',
                                                    logo: 'https://myprayertower.com/icon.png',
                                                    sameAs: [
                                                        'https://www.facebook.com/myprayertower',
                                                        'https://www.youtube.com/@myprayertower',
                                                        'https://twitter.com/MyPrayerTower',
                                                        'https://www.instagram.com/myprayertower/',
                                                        'https://www.threads.net/@myprayertower',
                                                        'https://www.pinterest.com/myprayertower/'
                                                    ],
                                                    description: 'The #1 All-in-One Catholic Services App. Find churches, prayer wall, and daily readings.',
                                                    foundingDate: '2023-01-01',
                                                    contactPoint: {
                                                        '@type': 'ContactPoint',
                                                        contactType: 'customer support',
                                                        email: 'support@myprayertower.com'
                                                    },
                                                    areaServed: 'Worldwide',
                                                    knowsAbout: ['Catholicism', 'Prayer', 'Mass Times', 'Saints', 'Catholic Church', 'Rosary', 'Liturgy'],
                                                },
                                                {
                                                    '@type': 'WebSite',
                                                    '@id': 'https://myprayertower.com/#website',
                                                    url: 'https://myprayertower.com',
                                                    name: 'MyPrayerTower',
                                                    description: 'The #1 All-in-One Catholic Services App',
                                                    publisher: {
                                                        '@id': 'https://myprayertower.com/#organization'
                                                    },
                                                    potentialAction: {
                                                        '@type': 'SearchAction',
                                                        target: 'https://myprayertower.com/prayers?q={search_term_string}',
                                                        'query-input': 'required name=search_term_string'
                                                    }
                                                }
                                            ]
                                        }),
                                    }}
                                />
                            </PricingProvider>
                        </SpiritualJourneyProvider>
                    </AudioProvider>
                </ThemeProvider>

                <Analytics />
                <SpeedInsights />
                <GoogleAnalytics gaId="G-1X6N63VWZH" />

                {/* Google AdSense - Auto Ads Enabled (Standard script to avoid data-nscript) */}
                <script
                    async
                    src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID || 'ca-pub-1009360672921924'}`}
                    crossOrigin="anonymous"
                />
            </body>
        </html >
    );
}

