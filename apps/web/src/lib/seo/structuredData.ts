import { Prayer, Saint } from '@mpt/database';

/**
 * Generate JSON-LD structured data for a prayer
 */
export function generatePrayerSchema(prayer: {
    id: string | bigint;
    title: string;
    content: string;
    category: string;
    category_label?: string;
}) {
    return {
        '@context': 'https://schema.org',
        '@type': 'CreativeWork',
        '@id': `https://myprayertower.com/prayers/${prayer.id}`,
        name: prayer.title,
        description: prayer.content.substring(0, 160) + '...',
        text: prayer.content,
        genre: prayer.category_label || prayer.category,
        publisher: {
            '@type': 'Organization',
            name: 'MyPrayerTower',
            url: 'https://myprayertower.com',
        },
        inLanguage: 'en',
        isAccessibleForFree: true,
        potentialAction: {
            '@type': 'ReadAction',
            target: `https://myprayertower.com/prayers/${prayer.id}`,
        },
    };
}

/**
 * Generate JSON-LD structured data for a saint
 */
export function generateSaintSchema(saint: {
    id: string;
    name: string;
    slug: string;
    title?: string | null;
    biography?: string | null;
    shortBio?: string | null;
    feastDay?: string | null;
    feastMonth?: number | null;
    feastDayOfMonth?: number | null;
    bornDate?: string | null;
    diedDate?: string | null;
    imageUrl?: string | null;
    patronOf?: string[];
}) {
    const feastDate = saint.feastMonth && saint.feastDayOfMonth
        ? `--${String(saint.feastMonth).padStart(2, '0')}-${String(saint.feastDayOfMonth).padStart(2, '0')}`
        : undefined;

    return {
        '@context': 'https://schema.org',
        '@type': 'Person',
        '@id': `https://myprayertower.com/saints/${saint.slug}`,
        name: saint.name,
        description: saint.shortBio || saint.biography?.substring(0, 160),
        jobTitle: saint.title,
        image: saint.imageUrl,
        birthDate: saint.bornDate,
        deathDate: saint.diedDate,
        knowsAbout: saint.patronOf,
        sameAs: [
            `https://en.wikipedia.org/wiki/${encodeURIComponent(saint.name.replace(/ /g, '_'))}`,
        ],
        // Custom extension for feast day
        additionalProperty: feastDate ? {
            '@type': 'PropertyValue',
            name: 'feastDay',
            value: saint.feastDay || feastDate,
        } : undefined,
    };
}

/**
 * Generate JSON-LD structured data for a church
 */
export function generateChurchSchema(church: {
    id: string;
    name: string;
    slug: string;
    type: string;
    address: string;
    city: string;
    state?: string | null;
    country: string;
    postalCode?: string | null;
    latitude?: number | null;
    longitude?: number | null;
    phone?: string | null;
    email?: string | null;
    website?: string | null;
    description?: string | null;
    primaryImageUrl?: string | null;
    massSchedule?: any;
}) {
    return {
        '@context': 'https://schema.org',
        '@type': 'Church',
        '@id': `https://myprayertower.com/churches/${church.slug}`,
        name: church.name,
        description: church.description,
        image: church.primaryImageUrl,
        telephone: church.phone,
        email: church.email,
        url: church.website,
        address: {
            '@type': 'PostalAddress',
            streetAddress: church.address,
            addressLocality: church.city,
            addressRegion: church.state,
            addressCountry: church.country,
            postalCode: church.postalCode,
        },
        geo: church.latitude && church.longitude ? {
            '@type': 'GeoCoordinates',
            latitude: church.latitude,
            longitude: church.longitude,
        } : undefined,
    };
}

/**
 * Generate JSON-LD structured data for daily readings
 */
export function generateReadingSchema(reading: {
    date: Date | string;
    feastName?: string | null;
    liturgicalSeason?: string | null;
    firstReading?: string | null;
    firstReadingRef?: string | null;
    psalm?: string | null;
    psalmRef?: string | null;
    gospel?: string | null;
    gospelRef?: string | null;
}) {
    const dateStr = typeof reading.date === 'string'
        ? reading.date
        : reading.date.toISOString().split('T')[0];

    return {
        '@context': 'https://schema.org',
        '@type': 'Article',
        '@id': `https://myprayertower.com/readings/${dateStr}`,
        headline: reading.feastName || `Daily Mass Readings for ${dateStr}`,
        datePublished: dateStr,
        description: `Catholic Mass readings for ${dateStr} including ${reading.firstReadingRef}, ${reading.psalmRef}, and ${reading.gospelRef}`,
        publisher: {
            '@type': 'Organization',
            name: 'MyPrayerTower',
            url: 'https://myprayertower.com',
        },
        mainEntity: {
            '@type': 'ItemList',
            itemListElement: [
                reading.firstReadingRef && {
                    '@type': 'ListItem',
                    position: 1,
                    name: 'First Reading',
                    description: reading.firstReadingRef,
                },
                reading.psalmRef && {
                    '@type': 'ListItem',
                    position: 2,
                    name: 'Responsorial Psalm',
                    description: reading.psalmRef,
                },
                reading.gospelRef && {
                    '@type': 'ListItem',
                    position: 3,
                    name: 'Gospel',
                    description: reading.gospelRef,
                },
            ].filter(Boolean),
        },
    };
}

/**
 * Generate BreadcrumbList schema
 */
export function generateBreadcrumbSchema(items: { name: string; url: string }[]) {
    return {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: items.map((item, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: item.name,
            item: item.url,
        })),
    };
}

/**
 * Generate FAQ schema
 */
export function generateFAQSchema(faqs: { question: string; answer: string }[]) {
    return {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: faqs.map(faq => ({
            '@type': 'Question',
            name: faq.question,
            acceptedAnswer: {
                '@type': 'Answer',
                text: faq.answer,
            },
        })),
    };
}
