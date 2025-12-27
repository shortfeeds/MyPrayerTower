import axios from 'axios';
import * as cheerio from 'cheerio';
import { PrismaClient } from '@mpt/database';
import PQueue from 'p-queue';

const prisma = new PrismaClient();
const queue = new PQueue({ concurrency: 5 });

const BASE_URL = 'https://www.netministries.org';
const MINISTRIES_URL = `${BASE_URL}/ministries`;

interface MinistryData {
    name: string;
    slug: string;
    externalId: string;
    phone?: string;
    email?: string;
    website?: string;
    description?: string;
    address?: string;
    type?: string;
}

async function scrapeMinistryDetails(url: string, slug: string): Promise<MinistryData | null> {
    try {
        const { data } = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
        });
        const $ = cheerio.load(data);

        const name = $('h1').first().text().trim();
        if (!name) return null;

        let phone: string | undefined = $('a[href^="tel:"]').first().text().trim();
        if (!phone) {
            // Try to find phone in text if not linked
            const phoneMatch = $('body').text().match(/(\+\d{1,2}\s?)?1?-?\.?\s?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}/);
            if (phoneMatch) phone = phoneMatch[0];
        }

        // Address often in "Map & Directions" or footer
        // NetMinistries structure varies, but let's try generic selectors or look for specific sections
        let address: string | undefined;
        // Look for text after "Address:" or similar signatures

        // Website often in "Sponsors" section as per inspection, or just a link
        let website: string | undefined;
        // Look for external links that correspond to the ministry name roughly or generic "Visit Website"
        // Inspection showed "Sponsors" section might have it
        const possibleWebsite = $('.sponsors a').attr('href');
        if (possibleWebsite) website = possibleWebsite;

        // Description
        // "Profile and Vision", "About", "Mission" headers
        let description = '';
        const descriptionHeaders = ['Profile and Vision', 'About', 'Mission', 'Who We Are', 'Our Story'];

        descriptionHeaders.forEach(headerText => {
            const header = $(`h2:contains("${headerText}")`);
            if (header.length) {
                description += header.nextUntil('h2').text().trim() + '\n\n';
            }
        });

        if (!description) {
            // Fallback: grab the first substantial paragraph
            description = $('p').first().text().trim();
        }

        return {
            name,
            slug,
            externalId: slug,
            phone,
            website,
            description: description.trim(),
            address,
            type: 'OTHER' // Default
        };

    } catch (error) {
        console.error(`Error scraping ${url}:`, error);
        return null;
    }
}

async function main() {
    console.log('Starting NetMinistries Import...');

    try {
        const { data } = await axios.get(MINISTRIES_URL, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
        });
        const $ = cheerio.load(data);
        const links: string[] = [];

        // Select all links in the main content area that look like ministry links
        // Based on inspection, they are simple <a> tags in a list or div
        // We'll look for /ministries/ in href
        $('a[href^="/ministries/"]').each((_, element) => {
            const href = $(element).attr('href');
            if (href && href !== '/ministries' && !href.includes('/ministries/browse')) { // Avoid self/browse links
                links.push(href);
            }
        });

        // Deduplicate
        const uniqueLinks = [...new Set(links)];
        console.log(`Found ${uniqueLinks.length} ministry links.`);

        for (const link of uniqueLinks) {
            const slug = link.split('/').pop() || '';
            if (!slug) continue;

            const url = `${BASE_URL}${link}`;

            queue.add(async () => {
                console.log(`Processing ${slug}...`);
                const ministryData = await scrapeMinistryDetails(url, slug);

                if (ministryData) {
                    await prisma.ministry.upsert({
                        where: { externalId: ministryData.externalId },
                        update: {
                            name: ministryData.name,
                            phone: ministryData.phone,
                            website: ministryData.website,
                            description: ministryData.description,
                            lastSyncedAt: new Date(),
                        },
                        create: {
                            name: ministryData.name,
                            slug: ministryData.slug,
                            externalId: ministryData.externalId,
                            phone: ministryData.phone,
                            website: ministryData.website,
                            description: ministryData.description,
                            type: 'OTHER', // Default
                            lastSyncedAt: new Date(),
                            dataSource: 'netministries'
                        }
                    });
                    console.log(`Saved ${ministryData.name}`);
                }
            });
        }

        await queue.onIdle();
        console.log('Import completed!');

    } catch (error) {
        console.error('Fatal error:', error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
