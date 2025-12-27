import axios from 'axios';
import * as cheerio from 'cheerio';
import { PrismaClient, MinistryType } from '@mpt/database';
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
    type?: MinistryType;
}

async function scrapeMinistryDetails(url: string, slug: string): Promise<MinistryData | null> {
    try {
        const { data } = await axios.get(url, {
            headers: { 'User-Agent': 'Mozilla/5.0' },
            timeout: 10000
        });
        const $ = cheerio.load(data);

        const name = $('h1').first().text().trim();
        if (!name) return null;

        let phone: string | undefined = $('a[href^="tel:"]').first().text().trim();
        if (!phone) {
            const phoneMatch = $('body').text().match(/(\+\d{1,2}\s?)?1?-?\.?\s?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}/);
            if (phoneMatch) phone = phoneMatch[0];
        }

        const website = $('.sponsors a').attr('href') || $('a:contains("Visit Website")').attr('href');
        let description = '';
        const descHeader = $('h2:contains("About"), h2:contains("Mission"), h2:contains("Profile")').first();
        if (descHeader.length) {
            description = descHeader.nextUntil('h2').text().trim();
        } else {
            description = $('p').first().text().trim();
        }

        return {
            name,
            slug,
            externalId: slug,
            phone,
            website,
            description: description.trim(),
            address: undefined, // Hard to parse generically
            type: MinistryType.OTHER
        };

    } catch (error) {
        console.error(`Error scraping detail ${url}:`, error);
        return null;
    }
}

type PageCallback = (page: number, totalImported: number) => Promise<void>;

export async function scrapeNetMinistriesMinistries(
    maxPages: number = 1000,
    startPage: number = 0,
    onPageComplete?: PageCallback
) {
    console.log(`Starting NetMinistries Ministries Import (Pages ${startPage} to ${maxPages})...`);

    let page = startPage;
    let totalImported = 0;

    while (page < maxPages) {
        const pageUrl = `${MINISTRIES_URL}?p=${page}&r=60`;
        console.log(`Scraping page ${page + 1}: ${pageUrl}`);

        try {
            const { data } = await axios.get(pageUrl, {
                headers: { 'User-Agent': 'Mozilla/5.0' },
                timeout: 15000
            });
            const $ = cheerio.load(data);
            const links: string[] = [];

            $('a[href^="/ministries/"]').each((_, el) => {
                const href = $(el).attr('href');
                // Avoid browse links
                if (href && !href.includes('?p=') && !href.includes('search') && !href.includes('/browse')) {
                    links.push(href);
                }
            });

            const uniqueLinks = [...new Set(links)];
            console.log(`Found ${uniqueLinks.length} ministries on page ${page + 1}`);

            if (uniqueLinks.length === 0) {
                console.log('No more ministries found.');
                break;
            }

            for (const link of uniqueLinks) {
                const slug = link.split('/').pop() || '';
                if (!slug) continue;

                const url = `${BASE_URL}${link}`;

                queue.add(async () => {
                    const data = await scrapeMinistryDetails(url, slug);
                    if (data) {
                        try {
                            await prisma.ministry.upsert({
                                where: { slug: `nm-${data.slug}` },
                                update: {
                                    lastSyncedAt: new Date(),
                                },
                                create: {
                                    name: data.name,
                                    slug: `nm-${data.slug}`,
                                    externalId: `nm-${data.externalId}`,
                                    phone: data.phone,
                                    website: data.website,
                                    description: data.description,
                                    type: MinistryType.OTHER,
                                    lastSyncedAt: new Date(),
                                    dataSource: 'netministries'
                                }
                            });
                            totalImported++;
                            if (totalImported % 50 === 0) console.log(`Imported ${totalImported} ministries...`);
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
            await new Promise(r => setTimeout(r, 1000));
        } catch (err) {
            console.error(`Failed to scrape page ${page}`, err);
            break;
        }
    }
    console.log(`Finished. Total imported: ${totalImported}`);
}

if (require.main === module) {
    scrapeNetMinistriesMinistries().catch(console.error);
}
