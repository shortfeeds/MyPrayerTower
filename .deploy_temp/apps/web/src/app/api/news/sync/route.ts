'use server';

import { NextResponse } from 'next/server';
import { PrismaClient } from '@mpt/database';
import Parser from 'rss-parser';

const prisma = new PrismaClient();
const parser = new Parser();

// List of Catholic news RSS feed sources
const NEWS_SOURCES = [
    { name: 'Catholic News Agency', category: 'News', url: 'https://www.catholicnewsagency.com/rss' },
    { name: 'Vatican News', category: 'Vatican', url: 'https://www.vaticannews.va/en.rss.xml' },
    { name: 'EWTN News', category: 'News', url: 'https://www.ewtn.com/catholicism/library/rss-news.xml' },
    { name: 'Catholic Herald', category: 'News', url: 'https://catholicherald.co.uk/feed/' },
    { name: 'Aleteia', category: 'Lifestyle', url: 'https://aleteia.org/feed/' },
    { name: 'NCR Online', category: 'Opinion', url: 'https://www.ncronline.org/rss.xml' },
];

// This route should be called by a cron job or server action
export async function POST(request: Request) {
    try {
        // Basic API key check for security
        const apiKey = request.headers.get('x-api-key');
        if (apiKey !== process.env.INTERNAL_API_KEY) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        let totalCreated = 0;
        let totalSkipped = 0;

        for (const source of NEWS_SOURCES) {
            try {
                const feed = await parser.parseURL(source.url);

                for (const item of feed.items.slice(0, 20)) {
                    const externalId = item.guid || item.link || '';

                    // Check if article already exists
                    const existing = await prisma.newsArticle.findUnique({
                        where: { externalId },
                    });

                    if (existing) {
                        totalSkipped++;
                        continue;
                    }

                    // Extract image from content or enclosure
                    let imageUrl = null;
                    if (item.enclosure?.url) {
                        imageUrl = item.enclosure.url;
                    } else if (item['media:content']?.['$']?.url) {
                        imageUrl = item['media:content']['$'].url;
                    }

                    await prisma.newsArticle.create({
                        data: {
                            externalId,
                            source: source.name,
                            title: item.title || 'Untitled',
                            summary: item.contentSnippet || item.description || null,
                            content: item.content || null,
                            imageUrl,
                            linkUrl: item.link || '',
                            author: item.creator || item.author || null,
                            category: source.category,
                            publishedAt: item.pubDate ? new Date(item.pubDate) : new Date(),
                        },
                    });
                    totalCreated++;
                }
            } catch (sourceError) {
                console.error(`Error fetching ${source.name}:`, sourceError);
            }
        }

        return NextResponse.json({
            success: true,
            created: totalCreated,
            skipped: totalSkipped,
        });
    } catch (error) {
        console.error('Error syncing news:', error);
        return NextResponse.json(
            { error: 'Failed to sync news feeds' },
            { status: 500 }
        );
    }
}
