import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Request a Mass Offering | MyPrayerTower',
    description: 'Request a Holy Mass to be offered for your special intentions, departed loved ones, or in thanksgiving. A sacred Catholic tradition.',
    openGraph: {
        title: 'Request a Mass Offering | MyPrayerTower',
        description: 'Request a Holy Mass to be offered for your special intentions, departed loved ones, or in thanksgiving.',
        url: 'https://www.myprayertower.com/mass-offerings',
        siteName: 'MyPrayerTower',
        images: [
            {
                url: 'https://www.myprayertower.com/images/mass-hero.jpg',
                width: 1200,
                height: 630,
                alt: 'MyPrayerTower Mass Offerings',
            }
        ],
        locale: 'en_US',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Request a Mass Offering',
        description: 'Request a Holy Mass to be offered for your special intentions, departed loved ones, or in thanksgiving.',
        images: ['https://www.myprayertower.com/images/mass-hero.jpg'],
    }
};

export default function MassOfferingsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const productSchema = {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: 'Holy Mass Offering',
        description: 'Request a Holy Mass for a special intention, the deceased, or thanksgiving. A sacred Catholic tradition.',
        brand: {
            '@type': 'Brand',
            name: 'MyPrayerTower'
        },
        offers: {
            '@type': 'Offer',
            price: '10.00',
            priceCurrency: 'USD',
            availability: 'https://schema.org/InStock'
        },
        aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: '5.0',
            reviewCount: '450'
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
