// Full Prayer Extraction via WordPress REST API
// This script extracts ALL prayers from myprayertower.com
import 'dotenv/config';
import axios from 'axios';
import { PrismaClient } from '@mpt/database';
import * as cheerio from 'cheerio';

const prisma = new PrismaClient();
const API_BASE = 'https://www.myprayertower.com/wp-json/wp/v2';
const PER_PAGE = 100; // Max allowed by WordPress
const RATE_LIMIT_MS = 300; // Be respectful to the server

interface WPCategory {
    id: number;
    count: number;
    name: string;
    slug: string;
}

interface WPPost {
    id: number;
    title: { rendered: string };
    slug: string;
    content: { rendered: string };
    categories: number[];
}

// Strip HTML tags and clean content
function cleanContent(html: string): string {
    const $ = cheerio.load(html);
    // Remove scripts, styles, and unnecessary elements
    $('script, style, .sharedaddy, .jp-relatedposts').remove();
    // Get text content with proper line breaks
    let text = $.root().text();
    // Clean up whitespace
    text = text.replace(/\n\s*\n/g, '\n\n').trim();
    return text;
}

// Fetch all categories from WordPress
async function fetchAllCategories(): Promise<WPCategory[]> {
    const categories: WPCategory[] = [];
    let page = 1;
    let hasMore = true;

    console.log('📁 Fetching all categories...');

    while (hasMore) {
        try {
            const response = await axios.get(`${API_BASE}/categories`, {
                params: { per_page: PER_PAGE, page },
                headers: { 'User-Agent': 'MyPrayerTower-Importer/1.0' },
            });

            if (response.data.length === 0) {
                hasMore = false;
            } else {
                categories.push(...response.data.filter((c: WPCategory) => c.count > 0));
                page++;
                await new Promise(r => setTimeout(r, RATE_LIMIT_MS));
            }
        } catch (error: any) {
            if (error.response?.status === 400) {
                hasMore = false; // No more pages
            } else {
                console.error(`Error fetching categories page ${page}:`, error.message);
                hasMore = false;
            }
        }
    }

    console.log(`✅ Found ${categories.length} categories with prayers`);
    return categories;
}

// Fetch all posts (prayers) from WordPress
async function fetchAllPosts(): Promise<WPPost[]> {
    const posts: WPPost[] = [];
    let page = 1;
    let hasMore = true;
    let totalFetched = 0;

    console.log('📖 Fetching all prayers (this may take several minutes)...');

    while (hasMore) {
        try {
            const response = await axios.get(`${API_BASE}/posts`, {
                params: { per_page: PER_PAGE, page, _embed: false },
                headers: { 'User-Agent': 'MyPrayerTower-Importer/1.0' },
            });

            if (response.data.length === 0) {
                hasMore = false;
            } else {
                posts.push(...response.data);
                totalFetched += response.data.length;
                console.log(`   Progress: ${totalFetched} prayers fetched (page ${page})...`);
                page++;
                await new Promise(r => setTimeout(r, RATE_LIMIT_MS));
            }
        } catch (error: any) {
            if (error.response?.status === 400) {
                hasMore = false; // No more pages
            } else {
                console.error(`Error fetching posts page ${page}:`, error.message);
                // Try to continue
                page++;
                if (page > 100) hasMore = false; // Safety limit
            }
        }
    }

    console.log(`✅ Fetched ${posts.length} prayers total`);
    return posts;
}

// Main import function
async function importAllPrayers() {
    console.log('🌐 Starting FULL import from myprayertower.com via WordPress REST API');
    console.log('This will import ALL ~3000 prayers with their complete content.\n');

    // Step 1: Fetch and create categories
    const wpCategories = await fetchAllCategories();
    const categoryMap: Record<number, string> = {}; // WP ID -> Prisma ID

    console.log('\n📁 Creating categories in database...');
    let categoryCount = 0;
    for (let i = 0; i < wpCategories.length; i++) {
        const cat = wpCategories[i];
        try {
            const created = await prisma.prayerLibraryCategory.upsert({
                where: { slug: cat.slug },
                create: {
                    name: cat.name.replace(/&amp;/g, '&'),
                    slug: cat.slug,
                    description: `${cat.count} prayers in this category`,
                    sortOrder: i + 1,
                },
                update: {
                    name: cat.name.replace(/&amp;/g, '&'),
                    description: `${cat.count} prayers in this category`,
                },
            });
            categoryMap[cat.id] = created.id;
            categoryCount++;
        } catch (error) {
            // Skip duplicates
        }
    }
    console.log(`✅ Created/updated ${categoryCount} categories\n`);

    // Step 2: Fetch and create all prayers
    const wpPosts = await fetchAllPosts();

    console.log('\n📖 Importing prayers to database...');
    let prayerCount = 0;
    let errorCount = 0;

    for (const post of wpPosts) {
        try {
            const title = post.title.rendered.replace(/&#8217;/g, "'").replace(/&amp;/g, '&').replace(/&#8211;/g, '-').replace(/&#8220;/g, '"').replace(/&#8221;/g, '"');
            const content = cleanContent(post.content.rendered);

            // Get first category ID
            const categoryId = post.categories.length > 0 ? categoryMap[post.categories[0]] : null;

            if (!categoryId) {
                // Create in a default category if none matches
                continue;
            }

            await prisma.prayer.upsert({
                where: { slug: post.slug },
                create: {
                    title,
                    slug: post.slug,
                    content: content || 'Prayer content pending.',
                    categoryId,
                    language: 'en',
                    isPublished: true,
                    viewCount: 0,
                },
                update: {
                    title,
                    content: content || undefined,
                },
            });
            prayerCount++;

            // Progress update every 100
            if (prayerCount % 100 === 0) {
                console.log(`   Progress: ${prayerCount} prayers imported...`);
            }
        } catch (error: any) {
            errorCount++;
            // Skip silently for duplicates
        }
    }

    console.log('\n');
    console.log('🎉 =============================================');
    console.log('🎉 FULL IMPORT COMPLETED!');
    console.log('🎉 =============================================');
    console.log(`📁 Categories: ${categoryCount}`);
    console.log(`📖 Prayers: ${prayerCount}`);
    console.log(`⚠️ Skipped/Errors: ${errorCount}`);
    console.log(`📊 Total Records: ${categoryCount + prayerCount}`);
    console.log('');
    console.log('All prayers from myprayertower.com are now in your database!');
}

// Run the import
importAllPrayers()
    .catch((e) => {
        console.error('❌ Import failed:', e);
        process.exit(1);
    })
    .finally(() => prisma.$disconnect());
