
// @ts-nocheck
import 'dotenv/config';
import puppeteer from 'puppeteer';
import { PrismaClient } from '@mpt/database';

const prisma = new PrismaClient();
const BASE_URL = 'https://gcatholic.org/churches/data';

function slugify(text: string) {
    return text.toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim()
        .slice(0, 100); // Limit slug length
}

async function scrapeChurches() {
    console.log('⛪ Starting GCatholic Major Churches Import...');

    // Get unique country codes from dioceses
    const countries = await prisma.diocese.findMany({
        select: { countryCode: true },
        distinct: ['countryCode']
    });

    const countryCodes = countries.map(c => c.countryCode).filter(Boolean);
    console.log(`Found ${countryCodes.length} unique countries\n`);

    const browser = await puppeteer.launch({
        headless: "new",
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();
    await page.setRequestInterception(true);
    page.on('request', (req) => {
        if (['image', 'stylesheet', 'font'].includes(req.resourceType())) {
            req.abort();
        } else {
            req.continue();
        }
    });

    let totalChurches = 0;

    try {
        for (const code of countryCodes) {
            const url = `${BASE_URL}/all-${code}.htm`;
            console.log(`🏛️ Processing ${code}: ${url}`);

            try {
                await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });

                const churches = await page.evaluate(() => {
                    // Find all church links
                    const links = Array.from(document.querySelectorAll('a'));
                    const results = [];

                    for (const a of links) {
                        const href = a.href;
                        // Church links are like /churches/france/1865 or /churches/cardinal/XXX
                        if (!href.includes('/churches/') || href.includes('/data/')) continue;
                        if (href.includes('/cardinal/')) continue; // Skip cardinal churches (Rome)

                        const name = a.innerText?.trim();
                        if (!name) continue;

                        // Determine type from context
                        // Parent element or sibling often indicates type
                        const parent = a.closest('tr') || a.parentElement;
                        let type = 'PARISH'; // default

                        if (parent) {
                            const text = parent.innerText.toLowerCase();
                            if (text.includes('cathedral') || text.includes('cathédrale') || text.includes('cattedrale')) {
                                type = 'CATHEDRAL';
                            } else if (text.includes('basilica') || text.includes('basilique') || text.includes('basilika')) {
                                type = 'BASILICA';
                            } else if (text.includes('shrine') || text.includes('santuario')) {
                                type = 'SHRINE';
                            } else if (text.includes('abbey') || text.includes('abbaye')) {
                                type = 'ABBEY';
                            } else if (text.includes('chapel')) {
                                type = 'CHAPEL';
                            }
                        }

                        // Extract external ID from URL
                        const parts = href.split('/');
                        const externalId = parts.slice(-2).join('-'); // e.g. "france-1865"

                        results.push({
                            name,
                            type,
                            url: href,
                            externalId
                        });
                    }

                    // Deduplicate by URL
                    const seen = new Set();
                    return results.filter(c => {
                        if (seen.has(c.url)) return false;
                        seen.add(c.url);
                        return true;
                    });
                });

                console.log(`   Found ${churches.length} churches`);

                let savedCount = 0;
                for (const c of churches) {
                    if (!c.name) continue;

                    try {
                        // Find existing by externalId
                        const existing = await prisma.church.findFirst({
                            where: { externalId: c.externalId }
                        });

                        if (existing) {
                            await prisma.church.update({
                                where: { id: existing.id },
                                data: {
                                    name: c.name,
                                    type: c.type,
                                    lastSyncedAt: new Date(),
                                }
                            });
                        } else {
                            await prisma.church.create({
                                data: {
                                    name: c.name,
                                    slug: slugify(`${c.name}-${c.externalId}`),
                                    type: c.type,
                                    denomination: 'Catholic',
                                    address: 'Address pending',
                                    city: 'City pending',
                                    country: code, // Will need mapping
                                    countryCode: code,
                                    externalId: c.externalId,
                                    lastSyncedAt: new Date(),
                                }
                            });
                        }
                        savedCount++;
                    } catch (e) {
                        // Skip duplicates
                    }
                }

                console.log(`   ✅ Saved ${savedCount} churches`);
                totalChurches += savedCount;

            } catch (e) {
                console.error(`   ❌ Failed for ${code}:`, e.message);
            }
        }

    } finally {
        await browser.close();
        await prisma.$disconnect();
    }

    console.log(`\n🎉 Total Churches Imported: ${totalChurches}`);
}

scrapeChurches();
