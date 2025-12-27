import axios from 'axios';
import * as cheerio from 'cheerio';
import { PrismaClient, ChurchType } from '@mpt/database';
import PQueue from 'p-queue';

const prisma = new PrismaClient();
const queue = new PQueue({ concurrency: 5 });

const BASE_URL = 'https://www.netministries.org';
const CHURCHES_URL = `${BASE_URL}/churches`;

interface ChurchData {
    name: string;
    slug: string;
    externalId: string;
    phone?: string;
    email?: string;
    website?: string;
    description?: string;
    address?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
    denomination?: string;
}

// Helper to extract church details from individual page
async function scrapeChurchDetails(url: string, slug: string): Promise<ChurchData | null> {
    try {
        const { data } = await axios.get(url, {
            headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36' },
            timeout: 10000
        });
        const $ = cheerio.load(data);

        const name = $('h1').first().text().trim();
        if (!name) return null;

        // Try to find contact info
        let phone: string | undefined = $('a[href^="tel:"]').first().text().trim();
        // Fallback phone regex
        if (!phone) {
            const phoneMatch = $('body').text().match(/(\+\d{1,2}\s?)?1?-?\.?\s?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}/);
            if (phoneMatch) phone = phoneMatch[0];
        }

        const website = $('.sponsors a').attr('href') || $('a:contains("Visit Website")').attr('href');

        // Address extraction is tricky without clear selectors. 
        // We'll try to find a block that looks like an address or use the location from listing if passed
        // For now, simple extraction or null
        const addressBlock = $('address').text().trim() || ''; // If they use <address>

        let description = '';
        const descHeader = $('h2:contains("About"), h2:contains("Welcome")').first();
        if (descHeader.length) {
            description = descHeader.nextUntil('h2').text().trim();
        }

        // Denomination might be listed
        const denomination = $('li:contains("Denomination:")').text().replace('Denomination:', '').trim();

        return {
            name,
            slug,
            externalId: slug,
            phone,
            website,
            description,
            address: addressBlock || undefined,
            denomination: denomination || 'Catholic' // Default or extracted
        };
    } catch (error) {
        console.error(`Error scraping detail ${url}:`, error);
        return null; // Continue on error
    }
}

// Helper type for progress callback
type PageCallback = (page: number, totalImported: number) => Promise<void>;

export async function scrapeNetMinistriesChurches(
    maxPages: number = 1000,
    startPage: number = 0,
    onPageComplete?: PageCallback
) {
    console.log(`Starting NetMinistries Churches Import (Pages ${startPage} to ${maxPages})...`);

    // We can iterate pages
    let page = startPage;
    let totalImported = 0;

    while (page < maxPages) {
        const pageUrl = `${CHURCHES_URL}?p=${page}&r=60`;
        console.log(`Scraping page ${page + 1}: ${pageUrl}`);

        try {
            const { data } = await axios.get(pageUrl, {
                headers: { 'User-Agent': 'Mozilla/5.0' },
                timeout: 15000
            });
            const $ = cheerio.load(data);

            const links: string[] = [];

            // Find links to church profiles
            // Based on probe, links are like /churches/view?id=... or /churches/slug
            // Wait, previous ministries scraper used /ministries/slug. 
            // Probe output links were just "1", "2" for pagination. 
            // I need to assume the listing links are similar. 
            // In NetMinistries, usually it is /churches/chapter_name or /churches/view/id

            // Let's assume standard <a> in the main list. 
            // Refined selector: usually inside a div with class 'listing' or similar?
            $('a[href^="/churches/"]').each((_, el) => {
                const href = $(el).attr('href');
                if (href && !href.includes('?p=') && !href.includes('search')) {
                    links.push(href);
                }
            });

            const uniqueLinks = [...new Set(links)];
            console.log(`Found ${uniqueLinks.length} churches on page ${page + 1}`);

            if (uniqueLinks.length === 0) {
                console.log('No more churches found.');
                break;
            }

            for (const link of uniqueLinks) {
                const slug = link.split('/').pop() || '';
                if (!slug) continue;

                const url = `${BASE_URL}${link}`;

                queue.add(async () => {
                    const data = await scrapeChurchDetails(url, slug);
                    if (data) {
                        try {
                            // Sync to DB
                            // We use upsert on Church based on externalId or slug?
                            // Church model has externalId.

                            // Note: We need some strict or fuzzy matching to avoid dupes with GCatholic data
                            // Ideally, check if externalId exists.

                            await prisma.church.upsert({
                                where: { slug: `nm-${data.slug}` }, // Use prefix to verify unique slug if needed, or just slug
                                update: {
                                    // Update fields if empty? Or overwrite? 
                                    // For now, let's only update lastSyncedAt or fields if missing
                                    lastSyncedAt: new Date(),
                                },
                                create: {
                                    name: data.name,
                                    slug: `nm-${data.slug}`, // Ensure uniqueness
                                    externalId: `nm-${data.externalId}`,
                                    type: ChurchType.PARISH, // Default
                                    address: data.address || 'Unknown Address',
                                    city: 'Unknown', // Need to parse from address or page
                                    country: 'USA', // Mostly US site?
                                    countryCode: 'US',
                                    denomination: data.denomination || 'Catholic',
                                    description: data.description,
                                    isVerified: false,
                                    latitude: 0, // Placeholder
                                    longitude: 0,
                                    lastSyncedAt: new Date()
                                }
                            });
                            totalImported++;
                            if (totalImported % 50 === 0) console.log(`Imported ${totalImported} churches...`);

                        } catch (e) {
                            // console.error(`Failed to save ${data.name}`, e);
                        }
                    }
                });
            }

            await queue.onIdle();

            if (onPageComplete) {
                await onPageComplete(page, totalImported);
            }

            page++;

            // Friendly delay
            await new Promise(r => setTimeout(r, 1000));

        } catch (err) {
            console.error(`Failed to scrape page ${page}`, err);
            break;
        }
    }

    console.log(`Finished. Total imported: ${totalImported}`);
}

if (require.main === module) {
    scrapeNetMinistriesChurches().catch(console.error);
}
