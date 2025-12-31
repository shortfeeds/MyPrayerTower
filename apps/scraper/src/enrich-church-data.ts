// @ts-nocheck
// Enrich Churches with Address Data from GCatholic Detail Pages
// This script updates existing churches with actual address/location data

import 'dotenv/config';
import puppeteer from 'puppeteer';
import { PrismaClient } from '@mpt/database';

const prisma = new PrismaClient();
const BASE_URL = 'https://gcatholic.org';

interface ChurchEnrichment {
    address?: string;
    city?: string;
    latitude?: number;
    longitude?: number;
    website?: string;
    phone?: string;
}

async function enrichChurchData() {
    console.log('🔄 Starting Church Data Enrichment...\n');

    // Get churches with pending addresses
    const churches = await prisma.church.findMany({
        where: {
            OR: [
                { address: 'Address pending' },
                { city: 'City pending' },
            ]
        },
        select: {
            id: true,
            name: true,
            externalId: true,
            countryCode: true,
        },
        take: 10000, // Process large batch
    });

    console.log(`Found ${churches.length} churches to enrich\n`);

    if (churches.length === 0) {
        console.log('No churches need enrichment!');
        await prisma.$disconnect();
        return;
    }

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

    let enriched = 0;
    let failed = 0;

    try {
        for (let i = 0; i < churches.length; i++) {
            const church = churches[i];

            if (!church.externalId) {
                failed++;
                continue;
            }

            // Parse externalId to get URL path (e.g., "france-1234" -> /churches/france/1234)
            const parts = church.externalId.split('-');
            if (parts.length < 2) {
                failed++;
                continue;
            }

            const country = parts[0];
            const id = parts.slice(1).join('-');
            const url = `${BASE_URL}/churches/${country}/${id}.htm`;

            try {
                await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 15000 });

                const data = await page.evaluate(() => {
                    const result: any = {};

                    // Look for address in page content
                    const text = document.body.innerText;
                    const lines = text.split('\n').map(l => l.trim()).filter(l => l);

                    // Try to find coordinates
                    const coordLink = document.querySelector('a[href*="maps.google"]');
                    if (coordLink) {
                        const href = coordLink.getAttribute('href') || '';
                        const match = href.match(/[?&]q=(-?\d+\.?\d*),(-?\d+\.?\d*)/);
                        if (match) {
                            result.latitude = parseFloat(match[1]);
                            result.longitude = parseFloat(match[2]);
                        }
                    }

                    // Look for address patterns
                    const addressPatterns = [
                        /Address:\s*(.+)/i,
                        /Location:\s*(.+)/i,
                    ];

                    for (const line of lines) {
                        for (const pattern of addressPatterns) {
                            const match = line.match(pattern);
                            if (match) {
                                result.address = match[1].trim();
                                break;
                            }
                        }
                    }

                    // Look for city in page title or headers
                    const h3s = Array.from(document.querySelectorAll('h3'));
                    for (const h3 of h3s) {
                        const text = (h3.textContent || '').trim();
                        if (text && text.length > 2 && text.length < 50 && !text.includes('Catholic')) {
                            result.city = text;
                            break;
                        }
                    }

                    // Try to find website
                    const websiteLinks = Array.from(document.querySelectorAll('a[href^="http"]'));
                    for (const link of websiteLinks) {
                        const href = link.getAttribute('href') || '';
                        if (!href.includes('gcatholic') && !href.includes('google') && !href.includes('wikipedia')) {
                            result.website = href;
                            break;
                        }
                    }

                    return result;
                });

                // Update church if we got data
                if (data.latitude || data.address || data.city || data.website) {
                    const updateData: any = {};
                    if (data.latitude) updateData.latitude = data.latitude;
                    if (data.longitude) updateData.longitude = data.longitude;
                    if (data.address && data.address !== 'Address pending') updateData.address = data.address;
                    if (data.city && data.city !== 'City pending') updateData.city = data.city;
                    if (data.website) updateData.website = data.website;
                    updateData.lastSyncedAt = new Date();

                    await prisma.church.update({
                        where: { id: church.id },
                        data: updateData
                    });

                    enriched++;

                    if (enriched % 50 === 0) {
                        console.log(`📊 Progress: ${enriched} enriched, ${failed} failed, ${i + 1}/${churches.length} processed`);
                    }
                } else {
                    failed++;
                }

                // Rate limiting
                await new Promise(r => setTimeout(r, 500));

            } catch (e) {
                failed++;
            }
        }

    } finally {
        await browser.close();
        await prisma.$disconnect();
    }

    console.log(`\n✅ Enrichment Complete!`);
    console.log(`   Enriched: ${enriched}`);
    console.log(`   Failed: ${failed}`);
}

enrichChurchData().catch(console.error);
