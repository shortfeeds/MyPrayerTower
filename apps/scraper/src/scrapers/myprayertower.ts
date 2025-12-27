import axios from 'axios';
import * as cheerio from 'cheerio';
import { PrismaClient } from '@mpt/database';
import { logger } from '../utils/logger';
import PQueue from 'p-queue';

const BASE_URL = 'https://www.myprayertower.com';
const RATE_LIMIT_MS = 500; // 0.5 second between requests (our own site, can be faster)

interface CategoryData {
    name: string;
    slug: string;
    url: string;
    prayerCount: number;
}

interface PrayerData {
    title: string;
    slug: string;
    content: string;
    categorySlug: string;
}

async function fetchPage(url: string): Promise<cheerio.CheerioAPI | null> {
    try {
        const response = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (compatible; MyPrayerTower-Extractor/1.0)',
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

function extractSlugFromUrl(url: string): string {
    const match = url.match(/\/category\/([^\/]+)/);
    return match ? match[1] : '';
}

// Extract all prayer categories from the prayers page
async function extractCategories(): Promise<CategoryData[]> {
    logger.info('Extracting categories from myprayertower.com/prayers...');
    const $ = await fetchPage(`${BASE_URL}/prayers`);
    if (!$) return [];

    const categories: CategoryData[] = [];

    // Find all category links
    $('a[href*="/category/"]').each((_, el) => {
        const link = $(el);
        const href = link.attr('href') || '';
        const text = link.text().trim();

        // Parse "Category Name (123)" format
        const match = text.match(/^(.+?)\s*\((\d+)\)$/);
        if (match && href.includes('/category/')) {
            const name = match[1].trim();
            const count = parseInt(match[2], 10);
            const slug = extractSlugFromUrl(href);

            if (slug && !categories.find(c => c.slug === slug)) {
                categories.push({
                    name,
                    slug,
                    url: href.startsWith('http') ? href : `${BASE_URL}${href.startsWith('/') ? '' : '/'}${href}`,
                    prayerCount: count,
                });
            }
        }
    });

    logger.info(`Found ${categories.length} categories`);
    return categories;
}

// Extract prayers from a category page
async function extractPrayersFromCategory(category: CategoryData): Promise<PrayerData[]> {
    logger.info(`Extracting prayers from: ${category.name} (${category.prayerCount} prayers)`);
    const prayers: PrayerData[] = [];
    let page = 1;
    let hasMore = true;

    while (hasMore && page <= 50) { // Max 50 pages per category
        const url = page === 1 ? category.url : `${category.url}page/${page}/`;
        const $ = await fetchPage(url);

        if (!$) {
            hasMore = false;
            break;
        }

        const articles = $('article, .post, .entry');
        if (articles.length === 0) {
            hasMore = false;
            break;
        }

        articles.each((_, article) => {
            const $article = $(article);
            const titleEl = $article.find('h2 a, h3 a, .entry-title a').first();
            const title = titleEl.text().trim();
            const prayerUrl = titleEl.attr('href') || '';

            // Extract content - look for the prayer text
            let content = '';
            const contentEl = $article.find('.entry-content, .post-content, .content');
            if (contentEl.length > 0) {
                content = contentEl.text().trim();
            }

            if (title && prayerUrl) {
                const slug = prayerUrl.replace(/\/$/, '').split('/').pop() || '';
                prayers.push({
                    title,
                    slug,
                    content: content || '', // May need to fetch full page for content
                    categorySlug: category.slug,
                });
            }
        });

        // Check for next page
        const nextLink = $('a.next, .nav-next a, a[rel="next"]');
        hasMore = nextLink.length > 0;
        page++;

        // Rate limiting
        await new Promise(resolve => setTimeout(resolve, RATE_LIMIT_MS));
    }

    logger.info(`Extracted ${prayers.length} prayers from ${category.name}`);
    return prayers;
}

// Fetch full prayer content from individual prayer page
async function fetchPrayerContent(prayerUrl: string): Promise<string> {
    const $ = await fetchPage(prayerUrl);
    if (!$) return '';

    // Try multiple selectors for prayer content
    const contentSelectors = [
        '.entry-content',
        '.post-content',
        'article .content',
        '.single-content',
    ];

    for (const selector of contentSelectors) {
        const content = $(selector);
        if (content.length > 0) {
            // Get just the text, removing script tags and unnecessary elements
            content.find('script, style, .share-buttons, .related-posts').remove();
            const text = content.text().trim();
            if (text.length > 50) {
                return text;
            }
        }
    }

    return '';
}

// Main function to extract and import all data
export async function extractFromMyPrayerTower(prisma: PrismaClient): Promise<{
    categories: number;
    prayers: number;
}> {
    const queue = new PQueue({ concurrency: 1, interval: RATE_LIMIT_MS, intervalCap: 1 });
    let categoryCount = 0;
    let prayerCount = 0;

    logger.info('Starting extraction from myprayertower.com...');

    // Step 1: Extract all categories
    const categories = await extractCategories();

    // Step 2: Create/update categories in database
    const categoryMap: Record<string, string> = {};
    for (let i = 0; i < categories.length; i++) {
        const cat = categories[i];
        try {
            const created = await prisma.prayerLibraryCategory.upsert({
                where: { slug: cat.slug },
                create: {
                    name: cat.name,
                    slug: cat.slug,
                    description: `Prayers in the ${cat.name} category`,
                    sortOrder: i + 1,
                },
                update: {
                    name: cat.name,
                },
            });
            categoryMap[cat.slug] = created.id;
            categoryCount++;
        } catch (error: any) {
            logger.error(`Error creating category ${cat.name}: ${error.message}`);
        }
    }
    logger.info(`Created/updated ${categoryCount} categories`);

    // Step 3: Extract prayers from top categories (limit to avoid long runtimes)
    const topCategories = categories
        .filter(c => c.prayerCount > 0)
        .sort((a, b) => b.prayerCount - a.prayerCount)
        .slice(0, 30); // Top 30 categories

    for (const category of topCategories) {
        try {
            const prayers = await queue.add(() => extractPrayersFromCategory(category));

            if (prayers && prayers.length > 0) {
                for (const prayer of prayers) {
                    const categoryId = categoryMap[prayer.categorySlug];
                    if (!categoryId) continue;

                    try {
                        await prisma.prayer.upsert({
                            where: { slug: prayer.slug },
                            create: {
                                title: prayer.title,
                                slug: prayer.slug,
                                content: prayer.content || 'Prayer content to be added.',
                                categoryId,
                                language: 'en',
                                isPublished: true,
                                viewCount: 0,
                            },
                            update: {
                                title: prayer.title,
                            },
                        });
                        prayerCount++;
                    } catch (error: any) {
                        // Skip duplicates
                    }
                }
            }

            // Progress update
            if (prayerCount % 50 === 0 && prayerCount > 0) {
                logger.info(`Progress: ${prayerCount} prayers imported`);
            }
        } catch (error: any) {
            logger.error(`Error processing category ${category.name}: ${error.message}`);
        }
    }

    logger.info(`✅ Extraction completed: ${categoryCount} categories, ${prayerCount} prayers`);
    return { categories: categoryCount, prayers: prayerCount };
}

// Also export individual functions for testing
export { extractCategories, extractPrayersFromCategory, fetchPrayerContent };
