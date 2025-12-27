import axios from 'axios';
import * as cheerio from 'cheerio';
import { PrismaClient } from '@mpt/database';
import { logger } from '../utils/logger';
import PQueue from 'p-queue';

const BASE_URL = 'http://www.gcatholic.org';
const RATE_LIMIT_MS = 1000;

interface SaintData {
    name: string;
    title?: string;
    feastMonth: number;
    feastDayOfMonth: number;
    gcatholicId: string;
    biography?: string;
    patronOf?: string[];
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

async function scrapeSaintsByMonth(month: number): Promise<SaintData[]> {
    const url = `${BASE_URL}/saints/data/saintby-M${String(month).padStart(2, '0')}.htm`;
    const $ = await fetchPage(url);
    if (!$) return [];

    const saints: SaintData[] = [];

    $('table tr').each((_, row) => {
        const cells = $(row).find('td');
        if (cells.length < 3) return;

        const dayText = $(cells[0]).text().trim();
        const day = parseInt(dayText, 10);
        if (isNaN(day)) return;

        const nameCell = $(cells[1]);
        const link = nameCell.find('a').attr('href');
        const name = nameCell.text().trim();

        if (!name) return;

        const gcatholicId = link?.match(/saint(\d+)/)?.[1] || `${month}-${day}-${name.replace(/\W/g, '')}`;
        const title = $(cells[2]).text().trim();

        saints.push({
            name,
            title: title || undefined,
            feastMonth: month,
            feastDayOfMonth: day,
            gcatholicId,
        });
    });

    return saints;
}

async function scrapeSaintDetails(gcatholicId: string): Promise<Partial<SaintData>> {
    const url = `${BASE_URL}/saints/saint${gcatholicId}.htm`;
    const $ = await fetchPage(url);
    if (!$) return {};

    let biography = '';
    let patronOf: string[] = [];

    // Extract biography from main content
    $('p').each((_, p) => {
        const text = $(p).text().trim();
        if (text.length > 50) {
            biography += text + '\n\n';
        }
    });

    // Look for "Patron of" section
    $('li').each((_, li) => {
        const text = $(li).text().trim();
        if (text.toLowerCase().includes('patron')) {
            const match = text.match(/patron of (.+)/i);
            if (match) {
                patronOf = match[1].split(',').map(s => s.trim());
            }
        }
    });

    return {
        biography: biography.trim() || undefined,
        patronOf: patronOf.length > 0 ? patronOf : undefined,
    };
}

export async function scrapeAllSaints(prisma: PrismaClient): Promise<number> {
    const queue = new PQueue({ concurrency: 1, interval: RATE_LIMIT_MS, intervalCap: 1 });
    let totalCount = 0;

    for (let month = 1; month <= 12; month++) {
        logger.info(`Scraping saints for month ${month}...`);

        try {
            const saints = await queue.add(() => scrapeSaintsByMonth(month));

            if (saints && saints.length > 0) {
                for (const saint of saints) {
                    await prisma.saint.upsert({
                        where: { slug: generateSlug(saint.name) },
                        create: {
                            name: saint.name,
                            title: saint.title,
                            feastMonth: saint.feastMonth,
                            feastDayOfMonth: saint.feastDayOfMonth,
                            externalId: saint.gcatholicId,
                            slug: generateSlug(saint.name),
                        },
                        update: {
                            name: saint.name,
                            title: saint.title,
                            feastMonth: saint.feastMonth,
                            feastDayOfMonth: saint.feastDayOfMonth,
                        },
                    });
                    totalCount++;
                }
                logger.info(`Saved ${saints.length} saints for month ${month}`);
            }
        } catch (error: any) {
            logger.error(`Error scraping month ${month}: ${error.message}`);
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
