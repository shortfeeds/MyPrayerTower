// @ts-nocheck
import 'dotenv/config';
import puppeteer from 'puppeteer';
import { PrismaClient, DioceseType } from '@mpt/database';

const prisma = new PrismaClient();
const BASE_URL = 'https://gcatholic.org/dioceses';

function mapDioceseType(typeStr: string): DioceseType {
    const t = typeStr.toUpperCase();
    if (t.includes('ARCHDIOCESE')) return 'ARCHDIOCESE';
    if (t.includes('DIOCESE')) return 'DIOCESE';
    if (t.includes('EPARCHY')) return 'EPARCHY';
    if (t.includes('VICARIATE')) return 'VICARIATE';
    if (t.includes('PREFECTURE')) return 'PREFECTURE';
    if (t.includes('ORDINARIATE')) return 'ORDINARIATE';
    return 'OTHER';
}

async function scrapeDioceses() {
    console.log('🌍 Starting GCatholic Dioceses Import via Puppeteer...');

    const browser = await puppeteer.launch({
        headless: "new",
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();
    // Block images/css for speed
    await page.setRequestInterception(true);
    page.on('request', (req) => {
        if (['image', 'stylesheet', 'font'].includes(req.resourceType())) {
            req.abort();
        } else {
            req.continue();
        }
    });

    try {
        // 1. Get Regions
        console.log(`\n📍 Navigating to ${BASE_URL}/index.htm...`);
        await page.goto(`${BASE_URL}/index.htm`, { waitUntil: 'domcontentloaded', timeout: 60000 });

        // Find links representing continents/regions
        // Usually in a menu or list. We look for links matching mapregion*.htm
        const regions = await page.evaluate(() => {
            const links = Array.from(document.querySelectorAll('a[href*="mapregion"]'));
            return links.map(a => ({
                name: a.textContent?.trim() || 'Unknown',
                url: (a as HTMLAnchorElement).href
            }));
        });

        const uniqueRegions = [...new Map(regions.map(r => [r.url, r])).values()];
        console.log(`✅ Found ${uniqueRegions.length} regions: ${uniqueRegions.map(r => r.name).join(', ')}`);

        for (const region of uniqueRegions) {
            console.log(`\n🗺️ Processing Region: ${region.name}`);
            try {
                await page.goto(region.url, { waitUntil: 'domcontentloaded', timeout: 45000 });

                const countries = await page.evaluate(() => {
                    const links = Array.from(document.querySelectorAll('a'));
                    const results = [];

                    for (const a of links) {
                        const href = a.href;
                        // Loose match
                        if (href.indexOf('/dioceses/country/') === -1) continue;
                        if (href.indexOf('index.htm') !== -1) continue;

                        // Extract text
                        let name = a.innerText?.trim();
                        if (!name) name = a.textContent?.trim();
                        if (!name) name = 'Unknown';

                        const code = href.split('/').pop()?.replace('.htm', '') || 'XX';

                        results.push({ name, url: href, code });
                    }
                    return results;
                });

                const uniqueCountries = [...new Map(countries.map(c => [c.url, c])).values()];
                console.log(`   Found ${uniqueCountries.length} countries`);

                for (const country of uniqueCountries) {
                    console.log(`   👉 Scanning Country: ${country.name} (${country.code})`);

                    try {
                        await page.goto(country.url, { waitUntil: 'domcontentloaded', timeout: 60000 });
                        console.log(`      URL: ${page.url()}`);

                        // 3. Get Dioceses
                        // Links to /dioceses/diocese/xxxx.htm
                        const dioceses = await page.evaluate(() => {
                            const links = Array.from(document.querySelectorAll('a'));
                            const results = [];

                            for (const a of links) {
                                const href = a.href;
                                if (href.indexOf('/dioceses/diocese/') === -1) continue;

                                const name = a.textContent?.trim() || 'Unknown';
                                const externalId = href.split('/').pop()?.replace('.htm', '') || '';

                                results.push({ name, url: href, externalId });
                            }
                            return results;
                        });

                        const uniqueDioceses = [...new Map(dioceses.map(d => [d.url, d])).values()];
                        console.log(`      Found ${uniqueDioceses.length} dioceses`);

                        // Upsert loop
                        for (const d of uniqueDioceses) {
                            if (!d.externalId) continue;
                            const type = mapDioceseType(d.name);

                            try {
                                await prisma.diocese.upsert({
                                    where: { externalId: d.externalId },
                                    create: {
                                        name: d.name,
                                        type,
                                        country: country.name,
                                        countryCode: country.code,
                                        region: region.name,
                                        externalId: d.externalId,
                                        lastSyncedAt: new Date(),
                                    },
                                    update: {
                                        name: d.name,
                                        type,
                                        lastSyncedAt: new Date(),
                                    }
                                });
                            } catch (e) {
                                // console.error(`Failed to save ${d.name}`);
                            }
                        }
                    } catch (e) {
                        console.error(`      Failed to process country ${country.name}`);
                    }
                }
            } catch (e) {
                console.error(`   Failed to process region ${region.name}`);
            }
        }

    } catch (error) {
        console.error('Fatal error:', error);
    } finally {
        await browser.close();
        await prisma.$disconnect();
    }
}

scrapeDioceses();
