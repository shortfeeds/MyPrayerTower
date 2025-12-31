/**
 * Prayer Import Script - Improved Content Extraction
 * Imports prayers from myprayertower.com into the local database
 */

import { PrismaClient } from '@mpt/database';
import * as cheerio from 'cheerio';
import { randomUUID } from 'crypto';

const prisma = new PrismaClient();

// Generate a cuid-like ID
function generateId(): string {
    return randomUUID().replace(/-/g, '').slice(0, 25);
}

const PRAYER_CATEGORIES = [
    { name: 'Basic Prayers', slug: 'basic-prayers' },
    { name: 'Marian (Mary) Prayers', slug: 'marian-mary-prayers' },
    { name: 'Jesus Christ Prayers', slug: 'jesus-christ-prayers' },
    { name: 'Acts of Prayers', slug: 'acts-of-prayers' },
    { name: 'Communion Prayers', slug: 'communion-prayers' },
    { name: 'Healing Prayers', slug: 'healing-prayers' },
    { name: 'Family Prayers', slug: 'family-prayers' },
    { name: 'Hope Prayers', slug: 'hope-prayers' },
    { name: 'Faith Prayers', slug: 'faith-prayers' },
    { name: 'Mass Prayers', slug: 'mass-prayers' },
    { name: 'Morning Prayers', slug: 'morning-prayers' },
    { name: 'Evening Prayers', slug: 'evening-prayers' },
    { name: 'Mealtime', slug: 'mealtime' },
    { name: 'Bedtime Prayers', slug: 'bedtime-prayers' },
    { name: 'Christmas Prayers', slug: 'christmas-prayers' },
    { name: 'Easter Prayers', slug: 'easter-prayers' },
    { name: 'Lent Prayers', slug: 'lent-prayers' },
    { name: 'Saints Prayers', slug: 'saints-prayers' },
    { name: 'Novena Prayers', slug: 'novena-prayers' },
    { name: 'Litanies', slug: 'litanies-prayers' },
];

const BASE_URL = 'https://myprayertower.com';

async function fetchPage(url: string): Promise<string | null> {
    try {
        const response = await fetch(url);
        if (!response.ok) return null;
        return await response.text();
    } catch (error) {
        console.error(`Error fetching ${url}:`, error);
        return null;
    }
}

async function extractPrayerLinks(categorySlug: string): Promise<string[]> {
    const links: Set<string> = new Set();

    // Fetch page 1
    const html = await fetchPage(`${BASE_URL}/category/${categorySlug}/`);
    if (!html) return [];

    const $ = cheerio.load(html);

    $('a').each((_, el) => {
        const href = $(el).attr('href');
        if (href && href.includes('/prayers/') && !href.includes('/category/') && !href.includes('?share=')) {
            const cleanUrl = href.startsWith('http') ? href : `${BASE_URL}${href}`;
            if (cleanUrl !== 'https://myprayertower.com/prayers/') {
                links.add(cleanUrl);
            }
        }
    });

    return Array.from(links).slice(0, 40);
}

async function extractPrayerContent(url: string): Promise<{ title: string; content: string; slug: string } | null> {
    const html = await fetchPage(url);
    if (!html) return null;

    const $ = cheerio.load(html);

    // 1. Title Extraction
    let title = $('h1.entry-title').text().trim() ||
        $('h1.post-title').text().trim() ||
        $('h1').first().text().trim() ||
        $('meta[property="og:title"]').attr('content') ||
        $('title').text().split(' - ')[0].trim();

    // 2. Content Extraction (Try multiple selectors)
    let content = '';

    // Selector strategy: entry-content is standard WP, but sometimes it's different
    const contentSelectors = [
        '.entry-content',
        '.post-content',
        'article .content',
        '.elementor-widget-theme-post-content',
        'div.post_content' // Some older WP themes
    ];

    for (const selector of contentSelectors) {
        const el = $(selector);
        if (el.length > 0) {
            // Remove junk
            el.find('script, style, .social-share, .related-posts, .sharedaddy, .jp-relatedposts, div.wpcnt, .navigation, .post-meta').remove();
            el.find('div[class*="share"], div[id*="jp-post-flair"]').remove();

            content = el.text().trim();
            if (content.length > 20) break;
        }
    }

    // Fallback: Meta description
    if (!content || content.length < 20) {
        content = $('meta[property="og:description"]').attr('content') || '';
    }

    if (!title || !content || content.length < 10) return null;

    // Clean content
    content = content
        .replace(/No Comments/g, '')
        .replace(/Leave a Comment/g, '')
        .replace(/Share this:/g, '')
        .replace(/\n\s*\n/g, '\n\n') // Normalize newlines
        .trim();

    // Extract slug
    const urlParts = url.split('/prayers/');
    const slug = urlParts[1]?.replace(/\//g, '') || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

    return {
        title,
        content: content.substring(0, 10000),
        slug
    };
}

async function main() {
    console.log('🙏 Starting prayer import from myprayertower.com...\n');

    // Create categories
    for (const cat of PRAYER_CATEGORIES) {
        const existing = await prisma.prayerLibraryCategory.findUnique({ where: { slug: cat.slug } });
        if (!existing) {
            await prisma.prayerLibraryCategory.create({
                data: {
                    id: generateId(),
                    name: cat.name,
                    slug: cat.slug,
                    updatedAt: new Date()
                }
            });
        }
    }

    let totalImported = 0;

    for (const cat of PRAYER_CATEGORIES) {
        console.log(`\n📖 ${cat.name}`);

        const category = await prisma.prayerLibraryCategory.findUnique({ where: { slug: cat.slug } });
        if (!category) continue;

        const links = await extractPrayerLinks(cat.slug);
        console.log(`   Found ${links.length} potential prayers`);

        let catCount = 0;

        for (const link of links) {
            const urlSlug = link.split('/prayers/')[1]?.replace(/\//g, '');

            // Check existence by slug
            if (urlSlug) {
                const exists = await prisma.prayer.findUnique({ where: { slug: urlSlug } });
                if (exists) {
                    process.stdout.write('.');
                    continue;
                }
            }

            const prayer = await extractPrayerContent(link);
            if (prayer) {
                try {
                    await prisma.prayer.create({
                        data: {
                            id: generateId(),
                            title: prayer.title,
                            slug: prayer.slug,
                            content: prayer.content,
                            categoryId: category.id,
                            source: 'myprayertower.com',
                            language: 'en',
                            isPublished: true,
                            updatedAt: new Date()
                        }
                    });
                    process.stdout.write('✓');
                    catCount++;
                    totalImported++;
                } catch (e) {
                    process.stdout.write('x');
                }
            } else {
                process.stdout.write('_');
            }

            // Simple delay
            await new Promise(r => setTimeout(r, 100));
        }
        console.log(`\n   Imported ${catCount} new prayers`);

        // Update count
        const total = await prisma.prayer.count({ where: { categoryId: category.id } });
        await prisma.prayerLibraryCategory.update({
            where: { id: category.id },
            data: { prayerCount: total }
        });
    }

    console.log(`\n✅ Total Imported: ${totalImported}`);
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
