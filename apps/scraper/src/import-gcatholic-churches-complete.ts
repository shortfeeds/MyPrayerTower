
// @ts-nocheck
// Complete Churches/Parishes Import from GCatholic
// Iterates ALL dioceses to get complete church listings

import 'dotenv/config';
import puppeteer from 'puppeteer';
import { PrismaClient } from '@mpt/database';

const prisma = new PrismaClient();
const BASE_URL = 'https://gcatholic.org';

function slugify(text: string) {
    return text.toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim()
        .slice(0, 100);
}

async function scrapeChurchesComplete() {
    console.log('⛪ Starting COMPLETE GCatholic Churches Import...\n');
    console.log('This will iterate all dioceses to get ALL churches/parishes.\n');

    // Get all dioceses from database
    const dioceses = await prisma.diocese.findMany({
        select: { id: true, externalId: true, name: true, countryCode: true, region: true }
    });

    console.log(`Found ${dioceses.length} dioceses to process\n`);

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
    let processedDioceses = 0;

    try {
        for (const diocese of dioceses) {
            if (!diocese.externalId) continue;

            const url = `${BASE_URL}/dioceses/diocese/${diocese.externalId}.htm`;
            processedDioceses++;

            if (processedDioceses % 100 === 0) {
                console.log(`\n📊 Progress: ${processedDioceses}/${dioceses.length} dioceses, ${totalChurches} churches total\n`);
            }

            try {
                await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });

                const churches = await page.evaluate((dioceseInfo) => {
                    const links = Array.from(document.querySelectorAll('a'));
                    const results = [];

                    for (const a of links) {
                        const href = a.href;
                        // Church links: /churches/france/1865, /churches/usa/1234, etc.
                        if (!href.includes('/churches/')) continue;
                        if (href.includes('/cardinal/')) continue; // Skip Roman cardinalate churches
                        if (href.includes('/data/')) continue; // Skip data pages
                        if (href.includes('/list/')) continue; // Skip list pages

                        const name = a.innerText?.trim();
                        if (!name || name.length < 2) continue;

                        // Determine church type from context
                        const parent = a.closest('tr') || a.closest('li') || a.parentElement;
                        let type = 'PARISH';

                        if (parent) {
                            const text = (parent.innerText || '').toLowerCase();
                            if (text.includes('cathedral') || text.includes('cathédrale') || text.includes('cattedrale') || text.includes('kathedrale')) {
                                type = 'CATHEDRAL';
                            } else if (text.includes('minor basilica') || text.includes('basilique mineure')) {
                                type = 'BASILICA';
                            } else if (text.includes('major basilica') || text.includes('basilique majeure')) {
                                type = 'BASILICA';
                            } else if (text.includes('basilica') || text.includes('basilique') || text.includes('basilika')) {
                                type = 'BASILICA';
                            } else if (text.includes('shrine') || text.includes('santuario') || text.includes('sanctuaire')) {
                                type = 'SHRINE';
                            } else if (text.includes('abbey') || text.includes('abbaye') || text.includes('abtei')) {
                                type = 'ABBEY';
                            } else if (text.includes('monastery') || text.includes('monastère')) {
                                type = 'MONASTERY';
                            } else if (text.includes('chapel') || text.includes('chapelle') || text.includes('kapelle')) {
                                type = 'CHAPEL';
                            } else if (text.includes('former cathedral')) {
                                type = 'CATHEDRAL';
                            }
                        }

                        // Extract external ID from URL
                        const parts = href.split('/');
                        const externalId = parts.slice(-2).join('-');

                        results.push({
                            name,
                            type,
                            url: href,
                            externalId,
                            countryCode: dioceseInfo.countryCode,
                            region: dioceseInfo.region,
                            dioceseId: dioceseInfo.id
                        });
                    }

                    // Deduplicate
                    const seen = new Set();
                    return results.filter(c => {
                        if (seen.has(c.url)) return false;
                        seen.add(c.url);
                        return true;
                    });
                }, { id: diocese.id, countryCode: diocese.countryCode, region: diocese.region });

                if (churches.length === 0) continue;

                let saved = 0;
                for (const c of churches) {
                    if (!c.name) continue;

                    try {
                        const existing = await prisma.church.findFirst({
                            where: { externalId: c.externalId }
                        });

                        if (existing) {
                            await prisma.church.update({
                                where: { id: existing.id },
                                data: {
                                    name: c.name,
                                    type: c.type,
                                    dioceseId: c.dioceseId,
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
                                    country: c.countryCode || 'Unknown',
                                    countryCode: c.countryCode || 'XX',
                                    dioceseId: c.dioceseId,
                                    externalId: c.externalId,
                                    lastSyncedAt: new Date(),
                                }
                            });
                        }
                        saved++;
                    } catch (e) {
                        // Skip errors (duplicates, etc.)
                    }
                }

                totalChurches += saved;

            } catch (e) {
                // Skip failed pages silently
            }
        }

    } finally {
        await browser.close();
        await prisma.$disconnect();
    }

    console.log(`\n🎉 COMPLETE! Processed ${processedDioceses} dioceses`);
    console.log(`⛪ Total Churches Imported: ${totalChurches}`);
}

scrapeChurchesComplete();
