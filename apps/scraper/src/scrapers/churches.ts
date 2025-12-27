import axios from 'axios';
import * as cheerio from 'cheerio';
import { PrismaClient } from '@mpt/database';
import { logger } from '../utils/logger';
import PQueue from 'p-queue';

const BASE_URL = 'http://www.gcatholic.org';
const RATE_LIMIT_MS = 1500;

interface ChurchData {
    name: string;
    type: string;
    address?: string;
    city?: string;
    country?: string;
    countryCode?: string;
    latitude?: number;
    longitude?: number;
    gcatholicId: string;
    dioceseGcatholicId?: string;
}

async function fetchPage(url: string): Promise<cheerio.CheerioAPI | null> {
    try {
        const response = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (compatible; MyPrayerTower/1.0)',
            },
            timeout: 30000,
        });
        return cheerio.load(response.data);
    } catch (error: any) {
        logger.error(`Failed to fetch ${url}: ${error.message}`);
        return null;
    }
}

async function scrapeChurchesFromDiocese(dioceseId: string): Promise<ChurchData[]> {
    const url = `${BASE_URL}/dioceses/diocese${dioceseId}.htm`;
    const $ = await fetchPage(url);
    if (!$) return [];

    const churches: ChurchData[] = [];

    // Find churches/parishes section
    $('table tr').each((_, row) => {
        const cells = $(row).find('td');
        if (cells.length < 2) return;

        const nameCell = $(cells[0]);
        const link = nameCell.find('a').attr('href');
        const name = nameCell.text().trim();

        if (!link || !name) return;
        if (!link.includes('church') && !link.includes('parish')) return;

        const gcatholicId = link.match(/(\d+)/)?.[1] || '';
        const location = $(cells[1]).text().trim();

        // Parse location (usually "City, Country")
        const locationParts = location.split(',').map(s => s.trim());
        const city = locationParts[0] || '';
        const country = locationParts[locationParts.length - 1] || '';

        if (name && gcatholicId) {
            churches.push({
                name,
                type: link.includes('cathedral') ? 'Cathedral' : 'Parish',
                city,
                country,
                gcatholicId,
                dioceseGcatholicId: dioceseId,
            });
        }
    });

    return churches;
}

export async function scrapeChurches(prisma: PrismaClient): Promise<number> {
    const queue = new PQueue({ concurrency: 1, interval: RATE_LIMIT_MS, intervalCap: 1 });
    let totalCount = 0;

    // Get all dioceses from database
    const dioceses = await prisma.diocese.findMany({
        where: { externalId: { not: null } },
        select: { id: true, externalId: true, country: true, countryCode: true },
    });

    logger.info(`Scraping churches from ${dioceses.length} dioceses...`);

    for (const diocese of dioceses) {
        if (!diocese.externalId) continue;

        try {
            const churches = await queue.add(() => scrapeChurchesFromDiocese(diocese.externalId!));

            if (churches && churches.length > 0) {
                for (const church of churches) {
                    await prisma.church.upsert({
                        where: { slug: generateSlug(church.name, church.city) },
                        create: {
                            name: church.name,
                            type: church.type as any,
                            city: church.city || '',
                            country: church.country || diocese.country || '',
                            countryCode: church.countryCode || diocese.countryCode || '',
                            address: church.address || church.city || '',
                            externalId: church.gcatholicId,
                            dioceseId: diocese.id,
                            slug: generateSlug(church.name, church.city),
                            denomination: 'Catholic',
                        },
                        update: {
                            name: church.name,
                            type: church.type as any,
                            city: church.city || '',
                            country: church.country || diocese.country || '',
                        },
                    });
                    totalCount++;
                }

                if (totalCount % 100 === 0) {
                    logger.info(`Progress: ${totalCount} churches scraped`);
                }
            }
        } catch (error: any) {
            logger.error(`Error scraping diocese ${diocese.externalId}: ${error.message}`);
        }
    }

    return totalCount;
}

function generateSlug(name: string, city?: string): string {
    const base = city ? `${name}-${city}` : name;
    return base
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');
}
