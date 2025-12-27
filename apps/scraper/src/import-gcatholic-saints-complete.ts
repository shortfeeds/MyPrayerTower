
// @ts-nocheck
// Complete Saints & Blesseds Import from GCatholic
// Scrapes by Pontificate to get ALL 10,000+ entries (FIXED VERSION)

import 'dotenv/config';
import puppeteer from 'puppeteer';
import { PrismaClient } from '@mpt/database';

const prisma = new PrismaClient();
const BASE_URL = 'https://gcatholic.org/saints';

// Pontificate codes
const PONTIFICATES = [
    { code: 'L14', name: 'Leo XIV' },
    { code: 'FR1', name: 'Francis' },
    { code: 'B16', name: 'Benedict XVI' },
    { code: 'JP2', name: 'John Paul II' },
    { code: 'PL6', name: 'Paul VI' },
    { code: 'J23', name: 'John XXIII' },
    { code: 'P12', name: 'Pius XII' },
    { code: 'P11', name: 'Pius XI' },
    { code: 'B15', name: 'Benedict XV' },
    { code: 'P10', name: 'Pius X' },
    { code: 'L13', name: 'Leo XIII' },
    { code: 'P9', name: 'Pius IX' },
];

function slugify(text: string) {
    return text.toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim()
        .slice(0, 100);
}

async function extractFromPontificatePage(page: any, title: string) {
    return await page.evaluate((defaultTitle) => {
        // Get all saint links (links to /saints/data/saints-X#ID)
        const saintLinks = Array.from(document.querySelectorAll('a')).filter(a =>
            a.href.includes('/saints/data/saints-') && a.href.includes('#')
        );

        const results = [];
        const seen = new Set();

        for (const link of saintLinks) {
            const href = link.href;
            const match = href.match(/#(\d+)$/);
            if (!match) continue;

            const externalId = match[1];
            if (seen.has(externalId)) continue;
            seen.add(externalId);

            const name = link.innerText?.trim();
            if (!name || name.length < 2) continue;

            // Try to find the parent TR for more context
            const tr = link.closest('tr');
            let born = null;
            let died = null;
            let biography = '';

            if (tr) {
                const text = tr.innerText || '';
                // Try to extract dates from text (format: name, role (year-year))
                const dateMatch = text.match(/\((\d{4})[–-](\d{4})\)/);
                if (dateMatch) {
                    born = dateMatch[1];
                    died = dateMatch[2];
                }
            }

            results.push({
                externalId,
                name,
                title: defaultTitle,
                feast: null,
                born,
                died,
                beatified: null,
                canonized: null,
                biography
            });
        }

        return results;
    }, title);
}

async function saveSaint(s: any, title: string) {
    if (!s || !s.name) return false;
    try {
        const existing = await prisma.saint.findFirst({ where: { externalId: s.externalId } });
        if (existing) {
            await prisma.saint.update({
                where: { id: existing.id },
                data: {
                    name: s.name,
                    title: s.title || title,
                    feastDay: s.feast,
                    biography: s.biography || '',
                    bornDate: s.born,
                    diedDate: s.died,
                    canonizedDate: s.canonized,
                    lastSyncedAt: new Date(),
                }
            });
        } else {
            await prisma.saint.create({
                data: {
                    name: s.name,
                    slug: slugify(`${s.name}-${s.externalId}`),
                    title: s.title || title,
                    feastDay: s.feast,
                    biography: s.biography || '',
                    bornDate: s.born,
                    diedDate: s.died,
                    canonizedDate: s.canonized,
                    externalId: s.externalId,
                    lastSyncedAt: new Date(),
                }
            });
        }
        return true;
    } catch (e) {
        return false;
    }
}

async function scrapeSaintsComplete() {
    console.log('😇 Starting COMPLETE GCatholic Saints & Blesseds Import (v2)...\n');

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

    let totalSaved = 0;

    try {
        // Part 1: Scrape all Saints by Pontificate
        console.log('=== PART 1: SAINTS (Canonized) ===\n');
        for (const pope of PONTIFICATES) {
            const url = `${BASE_URL}/sancti-${pope.code}.htm`;
            console.log(`📿 ${pope.name}: ${url}`);

            try {
                await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });
                const saints = await extractFromPontificatePage(page, 'Saint');
                console.log(`   Found ${saints.length} saints`);

                let saved = 0;
                for (const s of saints) {
                    if (await saveSaint(s, 'Saint')) saved++;
                }
                console.log(`   ✅ Saved ${saved}`);
                totalSaved += saved;
            } catch (e) {
                console.error(`   ❌ Failed`);
            }
        }

        // Part 2: Scrape all Blesseds by Pontificate
        console.log('\n=== PART 2: BLESSEDS (Beatified) ===\n');
        for (const pope of PONTIFICATES) {
            const url = `${BASE_URL}/beati-${pope.code}.htm`;
            console.log(`🙏 ${pope.name}: ${url}`);

            try {
                await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });
                const blesseds = await extractFromPontificatePage(page, 'Blessed');
                console.log(`   Found ${blesseds.length} blesseds`);

                let saved = 0;
                for (const s of blesseds) {
                    if (await saveSaint(s, 'Blessed')) saved++;
                }
                console.log(`   ✅ Saved ${saved}`);
                totalSaved += saved;
            } catch (e) {
                console.error(`   ❌ Failed`);
            }
        }

        // Part 3: A-Z supplemental (uses saints-A.htm format which has .name class)
        console.log('\n=== PART 3: A-Z DATA PAGES ===\n');
        const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
        for (const letter of letters) {
            const url = `${BASE_URL}/data/saints-${letter}.htm`;
            try {
                await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });

                const saints = await page.evaluate(() => {
                    const rows = Array.from(document.querySelectorAll('tr[id]'));
                    return rows.map(tr => {
                        const externalId = tr.id;
                        const nameEl = tr.querySelector('.name');
                        if (!nameEl) return null;

                        const titleEl = nameEl.querySelector('.zsaint') || nameEl.querySelector('.zbless');
                        const title = titleEl ? titleEl.innerText.trim() : 'Saint';
                        let fullName = nameEl.innerText.trim();
                        if (title && fullName.startsWith(title)) {
                            fullName = fullName.replace(title, '').trim();
                        }

                        const dateTable = tr.querySelector('table');
                        let born = null, died = null, feast = null;
                        if (dateTable) {
                            const tds = Array.from(dateTable.querySelectorAll('td'));
                            for (let i = 0; i < tds.length; i += 2) {
                                const label = tds[i]?.innerText.replace(':', '').trim();
                                const val = tds[i + 1]?.innerText.trim();
                                if (label === 'Born') born = val;
                                if (label === 'Died') died = val;
                                if (label === 'Feast') feast = val;
                            }
                        }

                        const rootTd = tr.querySelector('td');
                        let bio = '';
                        if (rootTd) {
                            const clone = rootTd.cloneNode(true) as HTMLElement;
                            const rm = clone.querySelectorAll('.name, table, div');
                            rm.forEach(e => e.remove());
                            bio = clone.innerText.trim();
                        }

                        return { externalId, title, name: fullName, born, died, feast, biography: bio };
                    }).filter(Boolean);
                });

                let saved = 0;
                for (const s of saints) {
                    if (await saveSaint(s, s.title || 'Saint')) saved++;
                }
                if (saved > 0) {
                    console.log(`   Letter ${letter}: +${saved}`);
                    totalSaved += saved;
                }
            } catch (e) { /* ignore */ }
        }

    } finally {
        await browser.close();
        await prisma.$disconnect();
    }

    console.log(`\n🎉 TOTAL SAINTS/BLESSEDS SAVED: ${totalSaved}`);
}

scrapeSaintsComplete();
