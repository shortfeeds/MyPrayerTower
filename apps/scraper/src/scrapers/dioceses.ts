import axios from 'axios';
import * as cheerio from 'cheerio';
import { PrismaClient } from '@mpt/database';
import { logger } from '../utils/logger';
import PQueue from 'p-queue';

const BASE_URL = 'http://www.gcatholic.org';
const RATE_LIMIT_MS = 1000; // 1 request per second to be respectful

// GCatholic region codes
const REGIONS = [
    { code: 'AF', name: 'Africa' },
    { code: 'AS', name: 'Asia' },
    { code: 'EU', name: 'Europe' },
    { code: 'NA', name: 'North America' },
    { code: 'OC', name: 'Oceania' },
    { code: 'SA', name: 'South America' },
];

interface DioceseData {
    name: string;
    type: string;
    country: string;
    countryCode: string;
    region: string;
    gcatholicId: string;
    website?: string;
    latitude?: number;
    longitude?: number;
}

async function fetchPage(url: string): Promise<cheerio.CheerioAPI | null> {
    try {
        const response = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (compatible; MyPrayerTower/1.0; +https://myprayertower.com)',
            },
            timeout: 30000,
        });
        return cheerio.load(response.data);
    } catch (error: any) {
        logger.error(`Failed to fetch ${url}: ${error.message}`);
        return null;
    }
}

async function scrapeDiocesesByRegion(region: string): Promise<DioceseData[]> {
    const url = `${BASE_URL}/dioceses/data/region-${region.toLowerCase()}.htm`;
    logger.info(`Scraping dioceses from: ${url}`);

    const $ = await fetchPage(url);
    if (!$) return [];

    const dioceses: DioceseData[] = [];

    // Parse table rows
    $('table tr').each((_, row) => {
        const cells = $(row).find('td');
        if (cells.length < 4) return;

        const nameCell = $(cells[0]);
        const link = nameCell.find('a').attr('href');
        const name = nameCell.text().trim();

        if (!link || !name) return;

        const gcatholicId = link.match(/diocese(\d+)/)?.[1] || '';
        const type = $(cells[1]).text().trim() || 'Diocese';
        const country = $(cells[2]).text().trim();
        const countryCode = $(cells[3]).text().trim();

        if (name && gcatholicId) {
            dioceses.push({
                name,
                type,
                country,
                countryCode,
                region,
                gcatholicId,
            });
        }
    });

    return dioceses;
}

export async function scrapeAllDioceses(prisma: PrismaClient): Promise<number> {
    const queue = new PQueue({ concurrency: 1, interval: RATE_LIMIT_MS, intervalCap: 1 });
    let totalCount = 0;

    for (const region of REGIONS) {
        try {
            const dioceses = await queue.add(() => scrapeDiocesesByRegion(region.code));

            if (dioceses && dioceses.length > 0) {
                // Upsert each diocese
                for (const diocese of dioceses) {
                    await prisma.diocese.upsert({
                        where: { externalId: diocese.gcatholicId },
                        create: {
                            name: diocese.name,
                            type: diocese.type as any,
                            country: diocese.country,
                            countryCode: diocese.countryCode,
                            region: diocese.region,
                            externalId: diocese.gcatholicId,
                        },
                        update: {
                            name: diocese.name,
                            type: diocese.type as any,
                            country: diocese.country,
                            countryCode: diocese.countryCode,
                            region: diocese.region,
                        },
                    });
                    totalCount++;
                }
                logger.info(`Saved ${dioceses.length} dioceses from ${region.name}`);
            }
        } catch (error: any) {
            logger.error(`Error scraping ${region.name}: ${error.message}`);
        }
    }

    return totalCount;
}

function generateSlug(name: string): string {
    return name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');
}
