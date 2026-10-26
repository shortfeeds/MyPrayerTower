import { Suspense } from 'react';
import type { Metadata } from 'next';
import Script from 'next/script';
import { GoogleAnalyticsTracker } from '@/components/analytics/GoogleAnalyticsTracker';
import { Inter, Merriweather, Playfair_Display } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/ThemeProvider';
import { LayoutChrome } from '@/components/layout/LayoutChrome';

import { SpiritualJourneyProvider } from '@/components/journey/SpiritualJourneyProvider';
import { PricingProvider } from '@/contexts/PricingContext';
import { AudioProvider } from '@/components/audio/AudioContext';

// Self-hosted fonts for performance
const inter = Inter({
    subsets: ['latin'],
    variable: '--font-inter',
    display: 'swap',
});

const merriweather = Merriweather({
    subsets: ['latin'],
    weight: ['400', '700'],
    variable: '--font-merriweather',
    display: 'swap',
});

const playfair = Playfair_Display({
    subsets: ['latin'],
    weight: ['400', '600', '700'],
    variable: '--font-playfair',
    display: 'swap',
});

export const metadata: Metadata = {
    metadataBase: new URL('https://www.myprayertower.com'),
    title: {
        default: 'MyPrayerTower | Catholic Prayer & Church Finder App',
        template: '%s | MyPrayerTower'
    },
    description: 'Join the global Catholic community. Find Mass times, submit prayer intentions, light virtual candles, and deepen your faith with daily readings and rosary.',
    keywords: ['Catholic App', 'Mass Times Near Me', 'Online Prayer Request', 'Virtual Candles', 'Catholic Daily Readings', 'Rosary Audio', 'Confession Guide', 'Saints of the Day'],
    authors: [{ name: 'MyPrayerTower Team', url: 'https://www.myprayertower.com' }],
    creator: 'MyPrayerTower',
    publisher: 'MyPrayerTower',
    alternates: {
        canonical: 'https://www.myprayertower.com',
    },
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
        url: 'https://www.myprayertower.com',
        siteName: 'MyPrayerTower',
        locale: 'en_US',
        type: 'website',
        images: [
            {
                url: 'https://www.myprayertower.com/og-image.jpg',
                secureUrl: 'https://www.myprayertower.com/og-image.jpg',
                width: 1200,
                height: 630,
                type: 'image/jpeg',
                alt: 'MyPrayerTower - Connect, Pray, Grow',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'MyPrayerTower | Connect, Pray, Grow',
        description: 'Find churches, request prayers, and grow in faith with the #1 Catholic App.',
        creator: '@myprayertower',
        images: ['https://www.myprayertower.com/og-image.jpg'],
    },
    verification: {
        google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || 'google-site-verification-code',
        other: {
            'msvalidate.01': process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION || 'bing-verification-code',
            'yandex-verification': process.env.NEXT_PUBLIC_YANDEX_SITE_VERIFICATION || '',
            'baidu-site-verification': process.env.NEXT_PUBLIC_BAIDU_SITE_VERIFICATION || '',
        },
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
    themeColor: '#0a0612',
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const gaId = (process.env.NEXT_PUBLIC_GA_ID || 'G-XHPBKVZBZH').trim();

    return (
        <html lang="en" className={`${inter.variable} ${merriweather.variable} ${playfair.variable}`} suppressHydrationWarning>
            <head>
                {/* Preconnect + DNS Prefetch for critical domains */}
                <link rel="manifest" href="/manifest.json" />
                <link rel="dns-prefetch" href="https://htgvilktnadnwlforyjt.supabase.co" />
                <link rel="preconnect" href="https://htgvilktnadnwlforyjt.supabase.co" />
                <link rel="dns-prefetch" href="https://pagead2.googlesyndication.com" />
                <link rel="dns-prefetch" href="https://googleads.g.doubleclick.net" />
                <link rel="dns-prefetch" href="https://www.google-analytics.com" />
                {/* AI / LLM Knowledge Discovery standard */}
                <link rel="alternate" type="text/plain" href="/llms.txt" title="LLM Knowledge Base" />
                <link rel="alternate" type="text/plain" href="/llms-full.txt" title="Full LLM Knowledge Base" />
                <script
                    dangerouslySetInnerHTML={{
                        __html: 'window.process=window.process||{env:{}};',
                    }}
                />
            </head>
            <body className="min-h-screen-safe flex flex-col bg-[hsl(var(--background))] text-[hsl(var(--foreground))] antialiased transition-colors duration-300" suppressHydrationWarning>
                {/* Global Google Translate Mount Node (Hidden from view & assistive tech) */}
                <div
                    id="google_translate_element"
                    suppressHydrationWarning
                    style={{
                        position: 'absolute',
                        left: '-9999px',
                        top: '-9999px',
                        width: '1px',
                        height: '1px',
                        overflow: 'hidden',
                    }}
                    aria-hidden="true"
                />
                <ThemeProvider>
                    <AudioProvider>
                        <SpiritualJourneyProvider>
                            <PricingProvider>
                                <LayoutChrome>
                                    {children}
                                </LayoutChrome>

                                {/* Structured Data */}
                                <script
                                    id="schema-org"
                                    type="application/ld+json"
                                    dangerouslySetInnerHTML={{
                                        __html: JSON.stringify({
                                            '@context': 'https://schema.org',
                                            '@graph': [
                                                {
                                                    '@type': 'Organization',
                                                    '@id': 'https://www.myprayertower.com/#organization',
                                                    name: 'MyPrayerTower',
                                                    url: 'https://www.myprayertower.com',
                                                    logo: 'https://www.myprayertower.com/icon.png',
                                                    sameAs: [
                                                        'https://www.facebook.com/myprayertower',
                                                        'https://www.youtube.com/@myprayertower',
                                                        'https://twitter.com/MyPrayerTower',
                                                        'https://www.instagram.com/myprayertower/',
                                                        'https://www.tiktok.com/@myprayertower',
                                                        'https://www.threads.net/@myprayertower',
                                                        'https://t.me/myprayertower'
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
                                                    '@id': 'https://www.myprayertower.com/#website',
                                                    url: 'https://www.myprayertower.com',
                                                    name: 'MyPrayerTower',
                                                    description: 'The #1 All-in-One Catholic Services App',
                                                    publisher: {
                                                        '@id': 'https://www.myprayertower.com/#organization'
                                                    },
                                                    potentialAction: {
                                                        '@type': 'SearchAction',
                                                        target: 'https://www.myprayertower.com/prayers?q={search_term_string}',
                                                        'query-input': 'required name=search_term_string'
                                                    }
                                                }
                                            ]
                                        }),
                                    }}
                                ></script>
                            </PricingProvider>
                        </SpiritualJourneyProvider>
                    </AudioProvider>
                </ThemeProvider>


                <Suspense fallback={null}>
                    <GoogleAnalyticsTracker />
                </Suspense>

                {/* Google tag (gtag.js) */}
                <Script
                    id="google-tag-manager"
                    strategy="lazyOnload"
                    src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
                />
                <Script
                    id="google-analytics-init"
                    strategy="lazyOnload"
                    dangerouslySetInnerHTML={{
                        __html: `
                            window.dataLayer = window.dataLayer || [];
                            function gtag(){dataLayer.push(arguments);}
                            window.gtag = gtag;
                            gtag('js', new Date());
                            gtag('config', '${gaId}', {
                                send_page_view: true
                            });
                        `,
                    }}
                />

                {/* Microsoft Clarity - Session replay & Heatmaps (Deferred to lazyOnload to eliminate TBT) */}
                <Script
                    id="microsoft-clarity"
                    strategy="lazyOnload"
                    dangerouslySetInnerHTML={{
                        __html: `
                            (function(c,l,a,r,i,t,y){
                                c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                                t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                                y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
                            })(window, document, "clarity", "script", ${JSON.stringify(process.env.NEXT_PUBLIC_CLARITY_ID || "q5z9c3y1k8")});
                        `,
                    }}
                />

                {/* Google AdSense - Deferred to avoid render-blocking */}
                <Script
                    id="google-adsense"
                    src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${(() => {
                        const clientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID || 'ca-pub-1009360672921924';
                        if (clientId.includes('~')) return `ca-pub-${clientId.split('~')[0].replace('ca-app-pub-', '')}`;
                        if (clientId.startsWith('ca-app-pub-')) return clientId.replace('ca-app-pub-', 'ca-pub-');
                        return clientId.startsWith('ca-pub-') ? clientId : `ca-pub-${clientId}`;
                    })()}`}
                    crossOrigin="anonymous"
                    strategy="lazyOnload"
                />
                {/* Shared Mobile Nav for TWA/App Mode */}
                
            </body>
        </html>
    );
}
