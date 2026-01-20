'use server';

import { NextResponse } from 'next/server';

// List of Catholic news RSS feed sources
const NEWS_SOURCES = [
    { name: 'Catholic News Agency', category: 'News', url: 'https://www.catholicnewsagency.com/rss' },
    { name: 'Vatican News', category: 'Vatican', url: 'https://www.vaticannews.va/en.rss.xml' },
    { name: 'EWTN News', category: 'News', url: 'https://www.ewtn.com/catholicism/library/rss-news.xml' },
    { name: 'Catholic Herald', category: 'News', url: 'https://catholicherald.co.uk/feed/' },
    { name: 'Aleteia', category: 'Lifestyle', url: 'https://aleteia.org/feed/' },
    { name: 'NCR Online', category: 'Opinion', url: 'https://www.ncronline.org/rss.xml' },
];

export async function GET() {
    try {
        // Return the list of available sources
        const sources = NEWS_SOURCES.map(s => ({
            name: s.name,
            category: s.category,
        }));

        return NextResponse.json(sources);
    } catch (error) {
        console.error('Error fetching news sources:', error);
        return NextResponse.json(
            { error: 'Failed to fetch news sources' },
            { status: 500 }
        );
    }
}
