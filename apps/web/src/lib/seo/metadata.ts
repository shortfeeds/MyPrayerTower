import { Metadata } from 'next';

interface MetaOptions {
    title: string;
    description: string;
    path: string;
    image?: string;
    type?: 'website' | 'article' | 'profile';
    publishedTime?: string;
    modifiedTime?: string;
    author?: string;
    keywords?: string[];
    noIndex?: boolean;
}

const BASE_URL = 'https://myprayertower.com';

/**
 * Generate complete metadata object for Next.js pages
 */
export function generateMeta({
    title,
    description,
    path,
    image = '/og-image.png',
    type = 'website',
    publishedTime,
    modifiedTime,
    author,
    keywords = [],
    noIndex = false,
}: MetaOptions): Metadata {
    const url = `${BASE_URL}${path}`;
    const fullTitle = title.includes('MyPrayerTower') ? title : `${title} | MyPrayerTower`;
    const imageUrl = image.startsWith('http') ? image : `${BASE_URL}${image}`;

    const baseKeywords = [
        'Catholic',
        'prayer',
        'faith',
        'church',
        'Christian',
        'spirituality',
    ];

    return {
        title: fullTitle,
        description,
        keywords: [...baseKeywords, ...keywords].join(', '),
        authors: author ? [{ name: author }] : [{ name: 'MyPrayerTower' }],
        robots: noIndex ? 'noindex, nofollow' : 'index, follow',
        alternates: {
            canonical: url,
        },
        openGraph: {
            title: fullTitle,
            description,
            url,
            siteName: 'MyPrayerTower',
            type: type as any,
            locale: 'en_US',
            images: [
                {
                    url: imageUrl,
                    width: 1200,
                    height: 630,
                    alt: title,
                },
            ],
            ...(publishedTime && { publishedTime }),
            ...(modifiedTime && { modifiedTime }),
        },
        twitter: {
            card: 'summary_large_image',
            title: fullTitle,
            description,
            images: [imageUrl],
        },
    };
}

/**
 * Generate metadata for a prayer page
 */
export function generatePrayerMeta(prayer: {
    id: string | bigint;
    title: string;
    content: string;
    category: string;
    category_label?: string;
}): Metadata {
    const excerpt = prayer.content.substring(0, 155).replace(/\n/g, ' ') + '...';

    return generateMeta({
        title: prayer.title,
        description: excerpt,
        path: `/prayers/${prayer.id}`,
        type: 'article',
        keywords: [
            'Catholic prayer',
            prayer.category,
            prayer.title,
            'prayer text',
        ],
    });
}

/**
 * Generate metadata for a saint page
 */
export function generateSaintMeta(saint: {
    name: string;
    slug: string;
    title?: string | null;
    shortBio?: string | null;
    biography?: string | null;
    feastDay?: string | null;
    imageUrl?: string | null;
    patronOf?: string[];
}): Metadata {
    const description = saint.shortBio
        || saint.biography?.substring(0, 155)
        || `Learn about ${saint.name}, ${saint.title || 'a Catholic saint'}.`;

    const patronKeywords = saint.patronOf?.map(p => `patron saint of ${p}`) || [];

    return generateMeta({
        title: `${saint.name}${saint.title ? `, ${saint.title}` : ''}`,
        description,
        path: `/saints/${saint.slug}`,
        image: saint.imageUrl || undefined,
        type: 'profile',
        keywords: [
            'saint',
            saint.name,
            saint.title || '',
            saint.feastDay || '',
            ...patronKeywords,
        ].filter(Boolean),
    });
}

/**
 * Generate metadata for a church page
 */
export function generateChurchMeta(church: {
    name: string;
    slug: string;
    city: string;
    state?: string | null;
    country: string;
    description?: string | null;
    primaryImageUrl?: string | null;
}): Metadata {
    const location = [church.city, church.state, church.country].filter(Boolean).join(', ');
    const description = church.description
        || `${church.name} in ${location}. Find Mass times, confession schedule, and parish information.`;

    return generateMeta({
        title: `${church.name} - ${location}`,
        description,
        path: `/churches/${church.slug}`,
        image: church.primaryImageUrl || undefined,
        keywords: [
            'Catholic church',
            church.name,
            church.city,
            church.state || '',
            'Mass times',
            'parish',
        ].filter(Boolean),
    });
}

/**
 * Generate metadata for daily readings page
 */
export function generateReadingsMeta(date: string, feastName?: string | null): Metadata {
    const title = feastName
        ? `${feastName} - Daily Readings`
        : `Daily Mass Readings for ${date}`;

    return generateMeta({
        title,
        description: `Catholic Mass readings for ${date}. First reading, Responsorial Psalm, and Gospel readings for today's liturgy.`,
        path: `/readings/${date}`,
        type: 'article',
        publishedTime: date,
        keywords: [
            'daily readings',
            'Mass readings',
            'Catholic lectionary',
            date,
            feastName || '',
        ].filter(Boolean),
    });
}
