import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Light a Virtual Prayer Candle | MyPrayerTower',
    description: 'Light a virtual candle for your loved ones, a special intention, or in gratitude. Join our global community of prayer and keep the light of faith burning.',
    openGraph: {
        title: 'Light a Virtual Prayer Candle | MyPrayerTower',
        description: 'Light a virtual candle for your loved ones, a special intention, or in gratitude.',
        url: 'https://www.myprayertower.com/candles',
        siteName: 'MyPrayerTower',
        images: [
            {
                url: 'https://www.myprayertower.com/images/candles/altar.png',
                width: 1200,
                height: 630,
                alt: 'MyPrayerTower Virtual Candles',
            }
        ],
        locale: 'en_US',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Light a Virtual Prayer Candle',
        description: 'Light a virtual candle for your loved ones, a special intention, or in gratitude.',
        images: ['https://www.myprayertower.com/images/candles/altar.png'],
    }
};

export default function CandlesLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const productSchema = {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: 'Virtual Prayer Candle',
        description: 'Light a virtual candle for a special intention, loved one, or thanksgiving. Available in 1-Day, 3-Day, 7-Day, 14-Day, and 30-Day durations.',
        image: 'https://www.myprayertower.com/images/candles/altar.png',
        brand: {
            '@type': 'Brand',
            name: 'MyPrayerTower'
        },
        offers: {
            '@type': 'AggregateOffer',
            offerCount: 5,
            lowPrice: '0.00',
            highPrice: '15.00',
            priceCurrency: 'USD'
        },
        aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: '4.9',
            reviewCount: '1240'
        }
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
            />
            {children}
        </>
    );
}
