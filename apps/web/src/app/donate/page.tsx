import type { Metadata } from 'next';
import { DonateClient } from './DonateClient';

export const metadata: Metadata = {
    title: 'Support Our Mission | Donate to MyPrayerTower',
    description: 'Support the global Catholic digital sanctuary. Your offerings help sustain daily Holy Masses, priest stipends, 24/7 prayer wall ministries, and free scripture resources for believers worldwide.',
    alternates: {
        canonical: 'https://www.myprayertower.com/donate',
    },
    openGraph: {
        title: 'Donate & Support MyPrayerTower Sanctuary',
        description: 'Support our mission of global Catholic prayer, Holy Mass offerings, and spiritual resources.',
        url: 'https://www.myprayertower.com/donate',
        siteName: 'MyPrayerTower',
        images: [
            {
                url: 'https://www.myprayertower.com/images/og-image.jpg',
                width: 1200,
                height: 630,
                alt: 'MyPrayerTower Online Giving',
            },
        ],
        locale: 'en_US',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Support MyPrayerTower Sanctuary',
        description: 'Support our mission of global Catholic prayer, Holy Mass offerings, and spiritual resources.',
    },
};

export default function DonatePage() {
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'DonateAction',
        name: 'Support MyPrayerTower Mission',
        description: 'Offer support for daily Catholic Masses, priest stipends, and global digital prayer ministry.',
        recipient: {
            '@type': 'Organization',
            name: 'MyPrayerTower',
            url: 'https://www.myprayertower.com',
            logo: 'https://www.myprayertower.com/icons/icon-512x512.png',
        },
        actionStatus: 'PotentialActionStatus',
        target: {
            '@type': 'EntryPoint',
            urlTemplate: 'https://www.myprayertower.com/donate',
            actionPlatform: [
                'http://schema.org/DesktopWebPlatform',
                'http://schema.org/MobileWebPlatform',
            ],
        },
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <DonateClient />
        </>
    );
}
