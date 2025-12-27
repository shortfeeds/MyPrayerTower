
// @ts-nocheck
import 'dotenv/config';
import puppeteer from 'puppeteer';
import { PrismaClient } from '@mpt/database';

const prisma = new PrismaClient();
const BASE_URL = 'https://gcatholic.org/saints/data';

function slugify(text: string) {
    return text.toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
}

async function scrapeSaints() {
    console.log('😇 Starting GCatholic Saints Import (Biographies)...');

    const browser = await puppeteer.launch({
        headless: "new",
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();
    // Block images for speed
    await page.setRequestInterception(true);
    page.on('request', (req) => {
        if (['image', 'stylesheet', 'font'].includes(req.resourceType())) {
            req.abort();
        } else {
            req.continue();
        }
    });

    try {
        const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
        // const letters = ['A']; // Debug

        for (const letter of letters) {
            const url = `${BASE_URL}/saints-${letter}.htm`;
            console.log(`\n📖 Processing Letter: ${letter} (${url})`);

            try {
                await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });

                const saints = await page.evaluate(() => {
                    // Saints are in TRs with IDs (e.g. <tr id="70061">)
                    // Select all TRs with IDs
                    const rows = Array.from(document.querySelectorAll('tr[id]'));

                    return rows.map(tr => {
                        const externalId = tr.id;

                        // Name and Title
                        const nameEl = tr.querySelector('.name');
                        if (!nameEl) return null;

                        const titleEl = nameEl.querySelector('.zsaint');
                        const title = titleEl ? titleEl.innerText.trim() : null;

                        // Full name usually includes title in text, let's try to get just the name
                        // .name text: "Saint Aaron"
                        let fullName = nameEl.innerText.trim();
                        if (title && fullName.startsWith(title)) {
                            fullName = fullName.replace(title, '').trim();
                        }

                        // Parse table for dates
                        const dateTable = tr.querySelector('table');
                        let born = null;
                        let died = null;
                        let feast = null;
                        let beatified = null;
                        let canonized = null;

                        if (dateTable) {
                            const tds = Array.from(dateTable.querySelectorAll('td'));
                            for (let i = 0; i < tds.length; i += 2) {
                                const label = tds[i]?.innerText.replace(':', '').trim();
                                const val = tds[i + 1]?.innerText.trim();
                                if (!label || !val) continue;

                                if (label === 'Born') born = val;
                                if (label === 'Died') died = val;
                                if (label === 'Feast') feast = val;
                                if (label === 'Beatified') beatified = val;
                                if (label === 'Canonized') canonized = val;
                            }
                        }

                        // Biography / Description
                        // Often inferred as the text inside the TD but outside the .name and date table
                        // Or <p class="bio"> (if it exists)
                        // Actually debug revealed generic text like "Prophet. High priest..."
                        // We can get the full text of the cell and remove known parts
                        const rootTd = tr.querySelector('td');
                        let bio = '';
                        if (rootTd) {
                            // Clone to safely remove parts
                            const clone = rootTd.cloneNode(true) as HTMLElement;
                            const nameEx = clone.querySelector('.name');
                            if (nameEx) nameEx.remove();
                            const tableEx = clone.querySelector('table');
                            if (tableEx) tableEx.remove();
                            // Also remove divs?
                            const divs = clone.querySelectorAll('div');
                            divs.forEach(d => d.remove()); // Date table is often in a div

                            bio = clone.innerText.trim();
                        }

                        return {
                            externalId,
                            title,
                            name: fullName,
                            born,
                            died,
                            feast,
                            beatified,
                            canonized,
                            biography: bio
                        };
                    }).filter(Boolean);
                });

                console.log(`   Found ${saints.length} saints for letter ${letter}`);

                let savedCount = 0;
                for (const s of saints) {
                    if (!s || !s.name) continue;

                    try {
                        const existing = await prisma.saint.findFirst({
                            where: { externalId: s.externalId }
                        });

                        if (existing) {
                            await prisma.saint.update({
                                where: { id: existing.id },
                                data: {
                                    name: s.name,
                                    title: s.title,
                                    feastDay: s.feast,
                                    biography: s.beatified ? `${s.biography}\nBeatified: ${s.beatified}` : s.biography,
                                    bornDate: s.born, // fixed name
                                    diedDate: s.died, // fixed name
                                    canonizedDate: s.canonized, // fixed name
                                    lastSyncedAt: new Date(),
                                }
                            });
                        } else {
                            await prisma.saint.create({
                                data: {
                                    name: s.name,
                                    slug: slugify(`${s.name}-${s.externalId}`),
                                    title: s.title,
                                    feastDay: s.feast,
                                    biography: s.beatified ? `${s.biography}\nBeatified: ${s.beatified}` : s.biography,
                                    bornDate: s.born, // fixed name
                                    diedDate: s.died, // fixed name
                                    canonizedDate: s.canonized, // fixed name
                                    externalId: s.externalId,
                                    lastSyncedAt: new Date(),
                                }
                            });
                        }
                        savedCount++;
                    } catch (e) {
                        console.error(`Failed to save ${s.name}:`, e);
                    }
                }
                console.log(`   ✅ Saved ${savedCount} saints`);

            } catch (e) {
                console.error(`   ❌ Failed to process letter ${letter}:`, e);
            }
        }

    } catch (error) {
        console.error('Fatal error:', error);
    } finally {
        await browser.close();
        await prisma.$disconnect();
    }
}

scrapeSaints();
