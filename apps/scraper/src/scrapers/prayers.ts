import axios from 'axios';
import * as cheerio from 'cheerio';
import { PrismaClient } from '@mpt/database';
import { logger } from '../utils/logger';
import PQueue from 'p-queue';

const BASE_URL = 'https://mycatholicprayers.com';
const RATE_LIMIT_MS = 1500; // 1.5 second between requests

interface PrayerData {
    title: string;
    slug: string;
    content: string;
    category: string;
    source?: string;
    author?: string;
    latinTitle?: string;
}

async function fetchPage(url: string): Promise<cheerio.CheerioAPI | null> {
    try {
        const response = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (compatible; MyPrayerTower/1.0; +https://myprayertower.com)',
                'Accept': 'text/html,application/xhtml+xml',
            },
            timeout: 30000,
        });
        return cheerio.load(response.data);
    } catch (error: any) {
        logger.error(`Failed to fetch ${url}: ${error.message}`);
        return null;
    }
}

function generateSlug(title: string): string {
    return title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '')
        .substring(0, 100);
}

// Category mapping from MyCatholicPrayers to our categories
const CATEGORY_MAP: Record<string, string> = {
    'common-prayers': 'basic',
    'marian-prayers': 'marian',
    'prayers-to-saints': 'saints',
    'rosary': 'rosary',
    'morning-prayers': 'morning',
    'evening-prayers': 'evening',
    'healing': 'healing',
    'protection': 'protection',
    'eucharist': 'eucharist',
    'confession': 'confession',
    'novenas': 'novenas',
};

// Known prayer URLs to scrape
const PRAYER_URLS = [
    // Common Prayers
    { url: '/prayers/the-lords-prayer/', category: 'basic' },
    { url: '/prayers/hail-mary/', category: 'basic' },
    { url: '/prayers/glory-be/', category: 'basic' },
    { url: '/prayers/apostles-creed/', category: 'basic' },
    { url: '/prayers/the-sign-of-the-cross/', category: 'basic' },
    { url: '/prayers/grace-before-meals/', category: 'basic' },
    { url: '/prayers/grace-after-meals/', category: 'basic' },
    { url: '/prayers/act-of-faith/', category: 'basic' },
    { url: '/prayers/act-of-hope/', category: 'basic' },
    { url: '/prayers/act-of-love/', category: 'basic' },
    { url: '/prayers/act-of-contrition/', category: 'confession' },
    { url: '/prayers/the-confiteor-i-confess/', category: 'confession' },

    // Marian Prayers
    { url: '/prayers/hail-holy-queen/', category: 'marian' },
    { url: '/prayers/memorare-2/', category: 'marian' },
    { url: '/prayers/the-angelus/', category: 'marian' },
    { url: '/prayers/regina-caeli/', category: 'marian' },
    { url: '/prayers/the-magnificat/', category: 'marian' },
    { url: '/prayers/sub-tuum-praesidium/', category: 'marian' },

    // Prayers to Saints
    { url: '/prayers/prayer-to-st-michael-the-archangel/', category: 'saints' },
    { url: '/prayers/prayer-to-st-joseph/', category: 'saints' },
    { url: '/prayers/prayer-to-st-anthony/', category: 'saints' },
    { url: '/prayers/prayer-to-st-jude/', category: 'saints' },
    { url: '/prayers/guardian-angel-prayer/', category: 'morning' },
    { url: '/prayers/prayer-before-work-to-st-joseph-the-worker/', category: 'saints' },

    // Eucharistic Prayers
    { url: '/prayers/anima-christi/', category: 'eucharist' },
    { url: '/prayers/spiritual-communion/', category: 'eucharist' },

    // Other Common Prayers
    { url: '/prayers/eternal-rest-prayer/', category: 'basic' },
    { url: '/prayers/prayer-for-the-souls-in-purgatory/', category: 'basic' },
    { url: '/prayers/the-jesus-prayer/', category: 'basic' },
    { url: '/prayers/come-holy-spirit/', category: 'basic' },
    { url: '/prayers/prayer-for-peace/', category: 'protection' },

    // Rosary Prayers
    { url: '/prayers/the-fatima-prayer/', category: 'rosary' },

    // Novenas
    { url: '/prayers/novena-to-st-martha/', category: 'novenas' },
    { url: '/prayers/novena-to-the-sacred-heart/', category: 'novenas' },
    { url: '/prayers/novena-to-st-jude/', category: 'novenas' },
];

async function scrapePrayerPage(url: string, category: string): Promise<PrayerData | null> {
    const fullUrl = `${BASE_URL}${url}`;
    logger.info(`Scraping: ${fullUrl}`);

    const $ = await fetchPage(fullUrl);
    if (!$) return null;

    // Get title from page
    const title = $('h1.entry-title').text().trim() ||
        $('h1').first().text().trim() ||
        $('title').text().replace(' – My Catholic Prayers', '').trim();

    if (!title) {
        logger.warn(`No title found for ${url}`);
        return null;
    }

    // Get prayer content from the article body
    let content = '';

    // Try different selectors for prayer content
    const contentSelectors = [
        '.entry-content p',
        'article p',
        '.post-content p',
        '.prayer-text',
    ];

    for (const selector of contentSelectors) {
        const paragraphs = $(selector);
        if (paragraphs.length > 0) {
            paragraphs.each((_, p) => {
                const text = $(p).text().trim();
                // Skip navigation/meta text
                if (text &&
                    !text.includes('View More') &&
                    !text.includes('Share this') &&
                    !text.includes('Posted in') &&
                    text.length > 10) {
                    content += text + '\n\n';
                }
            });
            if (content.length > 50) break;
        }
    }

    // Clean up content
    content = content.trim();

    if (!content) {
        logger.warn(`No content found for ${url}`);
        return null;
    }

    return {
        title,
        slug: generateSlug(title),
        content,
        category,
        source: 'MyCatholicPrayers.com',
    };
}

async function discoverPrayerLinks(): Promise<Array<{ url: string, category: string }>> {
    const prayers: Array<{ url: string, category: string }> = [...PRAYER_URLS];

    // Try to discover more prayers from the main prayers page
    const $ = await fetchPage(`${BASE_URL}/catholic-prayers`);
    if ($) {
        $('a[href*="/prayers/"]').each((_, link) => {
            const href = $(link).attr('href');
            if (href && href.includes('/prayers/') && !href.includes('#')) {
                const url = href.replace(BASE_URL, '');
                // Check if we already have this URL
                if (!prayers.find(p => p.url === url)) {
                    prayers.push({ url, category: 'basic' }); // Default category
                }
            }
        });
    }

    return prayers;
}

export async function scrapeAllPrayers(prisma: PrismaClient): Promise<number> {
    const queue = new PQueue({ concurrency: 1, interval: RATE_LIMIT_MS, intervalCap: 1 });
    let totalCount = 0;
    let errorCount = 0;

    logger.info('Starting MyCatholicPrayers scraper...');

    // Get all prayer URLs
    const prayerUrls = await discoverPrayerLinks();
    logger.info(`Found ${prayerUrls.length} prayer URLs to scrape`);

    // First, ensure categories exist
    const categories = [...new Set(prayerUrls.map(p => p.category))];
    const categoryMap: Record<string, string> = {};

    for (const cat of categories) {
        let category = await prisma.prayerLibraryCategory.findFirst({
            where: { slug: cat }
        });

        if (!category) {
            category = await prisma.prayerLibraryCategory.create({
                data: {
                    name: cat.charAt(0).toUpperCase() + cat.slice(1).replace(/-/g, ' '),
                    slug: cat,
                    description: `Prayers in the ${cat} category`,
                    sortOrder: Object.keys(categoryMap).length + 1,
                }
            });
            logger.info(`Created category: ${cat}`);
        }
        categoryMap[cat] = category.id;
    }

    // Scrape each prayer
    for (const prayerUrl of prayerUrls) {
        try {
            const prayer = await queue.add(() => scrapePrayerPage(prayerUrl.url, prayerUrl.category));

            if (prayer && prayer.content.length > 20) {
                const categoryId = categoryMap[prayer.category];

                if (categoryId) {
                    await prisma.prayer.upsert({
                        where: { slug: prayer.slug },
                        create: {
                            title: prayer.title,
                            slug: prayer.slug,
                            content: prayer.content,
                            source: prayer.source,
                            author: prayer.author,
                            categoryId,
                            language: 'en',
                            isPublished: true,
                            viewCount: 0,
                        },
                        update: {
                            content: prayer.content,
                            source: prayer.source,
                        },
                    });
                    totalCount++;
                    logger.info(`Saved: ${prayer.title}`);
                }
            }
        } catch (error: any) {
            logger.error(`Error scraping ${prayerUrl.url}: ${error.message}`);
            errorCount++;
        }

        // Log progress every 10 prayers
        if (totalCount % 10 === 0 && totalCount > 0) {
            logger.info(`Progress: ${totalCount} prayers scraped`);
        }
    }

    logger.info(`✅ Prayer scraping completed: ${totalCount} prayers saved, ${errorCount} errors`);
    return totalCount;
}

// Export individual functions for testing
export { scrapePrayerPage, discoverPrayerLinks, PRAYER_URLS };
