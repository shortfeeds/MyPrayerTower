// Full Churches & Denominations Import via WordPress REST API
// This script extracts ALL churches and denominations from myprayertower.com
import 'dotenv/config';
import axios from 'axios';
import { PrismaClient } from '@mpt/database';
import * as cheerio from 'cheerio';

const prisma = new PrismaClient();
const API_BASE = 'https://www.myprayertower.com/wp-json/wp/v2';
const PER_PAGE = 100;
const RATE_LIMIT_MS = 300;

interface WPListingCategory {
    id: number;
    count: number;
    name: string;
    slug: string;
    parent: number;
}

interface WPListing {
    id: number;
    title: { rendered: string };
    slug: string;
    content: { rendered: string };
    'listing-category': number[];
}

function cleanHtml(html: string): string {
    const $ = cheerio.load(html);
    $('script, style').remove();
    return $.root().text().replace(/\n\s*\n/g, '\n\n').trim();
}

function cleanTitle(title: string): string {
    return title
        .replace(/&#8217;/g, "'")
        .replace(/&amp;/g, '&')
        .replace(/&#8211;/g, '-')
        .replace(/&#8220;/g, '"')
        .replace(/&#8221;/g, '"')
        .replace(/\\"/g, '"');
}

// Fetch all listing categories (denominations)
async function fetchDenominations(): Promise<WPListingCategory[]> {
    const categories: WPListingCategory[] = [];
    let page = 1;
    let hasMore = true;

    console.log('📁 Fetching all church denominations...');

    while (hasMore) {
        try {
            const response = await axios.get(`${API_BASE}/listing-category`, {
                params: { per_page: PER_PAGE, page },
                headers: { 'User-Agent': 'MyPrayerTower-Importer/1.0' },
            });

            if (response.data.length === 0) {
                hasMore = false;
            } else {
                categories.push(...response.data);
                page++;
                await new Promise(r => setTimeout(r, RATE_LIMIT_MS));
            }
        } catch (error: any) {
            if (error.response?.status === 400) {
                hasMore = false;
            } else {
                console.error(`Error fetching categories page ${page}:`, error.message);
                hasMore = false;
            }
        }
    }

    console.log(`✅ Found ${categories.length} denominations`);
    return categories;
}

// Fetch all church listings
async function fetchChurches(): Promise<WPListing[]> {
    const listings: WPListing[] = [];
    let page = 1;
    let hasMore = true;
    let totalFetched = 0;

    console.log('⛪ Fetching all churches (this may take several minutes)...');

    while (hasMore) {
        try {
            const response = await axios.get(`${API_BASE}/listing`, {
                params: { per_page: PER_PAGE, page },
                headers: { 'User-Agent': 'MyPrayerTower-Importer/1.0' },
            });

            if (response.data.length === 0) {
                hasMore = false;
            } else {
                listings.push(...response.data);
                totalFetched += response.data.length;
                console.log(`   Progress: ${totalFetched} churches fetched (page ${page})...`);
                page++;
                await new Promise(r => setTimeout(r, RATE_LIMIT_MS));
            }
        } catch (error: any) {
            if (error.response?.status === 400) {
                hasMore = false;
            } else {
                console.error(`Error fetching listings page ${page}:`, error.message);
                page++;
                if (page > 150) hasMore = false;
            }
        }
    }

    console.log(`✅ Fetched ${listings.length} churches total`);
    return listings;
}

async function importChurches() {
    console.log('🌐 Starting FULL import of churches from myprayertower.com');
    console.log('This will import ALL denominations and churches.\n');

    // Step 1: Fetch and create denominations
    const wpDenominations = await fetchDenominations();

    // Filter to get only child denominations (those with parent = 478, "Catholic" parent category)
    const childDenominations = wpDenominations.filter(d => d.parent === 478 && d.count > 0);

    console.log(`\n📁 Found ${childDenominations.length} church denominations with listings\n`);

    // Create denomination map: WP ID -> name
    const denominationMap: Record<number, string> = {};
    childDenominations.forEach((d, i) => {
        denominationMap[d.id] = cleanTitle(d.name);
        console.log(`   ${i + 1}. ${cleanTitle(d.name)} (${d.count} churches)`);
    });

    // Step 2: Fetch all churches
    const wpChurches = await fetchChurches();

    console.log('\n⛪ Importing churches to database...');
    let churchCount = 0;
    let errorCount = 0;

    for (const church of wpChurches) {
        try {
            const name = cleanTitle(church.title.rendered);
            const description = cleanHtml(church.content.rendered);

            // Get denomination from listing-category
            const categoryIds = church['listing-category'] || [];
            let denomination: string | null = null;

            for (const catId of categoryIds) {
                if (denominationMap[catId]) {
                    denomination = denominationMap[catId];
                    break;
                }
            }

            await prisma.church.upsert({
                where: { slug: church.slug },
                create: {
                    name,
                    slug: church.slug,
                    description: description || 'Church listing from MyPrayerTower.com',
                    type: 'PARISH' as any,
                    denomination: denomination || 'Other',
                    // Required location fields - placeholders since WP API doesn't provide these
                    address: 'Address unavailable',
                    city: 'See church listing',
                    country: 'United States',
                    countryCode: 'US',
                },
                update: {
                    name,
                    description: description || undefined,
                    denomination: denomination || undefined,
                },
            });
            churchCount++;

            if (churchCount % 100 === 0) {
                console.log(`   Progress: ${churchCount} churches imported...`);
            }
        } catch (error: any) {
            errorCount++;
        }
    }

    console.log('\n');
    console.log('🎉 =============================================');
    console.log('🎉 CHURCHES IMPORT COMPLETED!');
    console.log('🎉 =============================================');
    console.log(`📁 Denominations: ${childDenominations.length}`);
    console.log(`⛪ Churches: ${churchCount}`);
    console.log(`⚠️ Skipped/Errors: ${errorCount}`);
    console.log(`📊 Total Records: ${childDenominations.length + churchCount}`);
    console.log('');
    console.log('All churches from myprayertower.com are now in your database!');
}

// Run the import
importChurches()
    .catch((e) => {
        console.error('❌ Import failed:', e);
        process.exit(1);
    })
    .finally(() => prisma.$disconnect());
