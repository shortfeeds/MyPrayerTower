// Run prayer scraper
import 'dotenv/config';
import { PrismaClient } from '@mpt/database';
import { scrapeAllPrayers } from './scrapers/prayers';

const prisma = new PrismaClient();

async function main() {
    console.log('🙏 Starting Prayer Scraper...');
    try {
        const count = await scrapeAllPrayers(prisma);
        console.log(`✅ Scraped ${count} prayers successfully!`);
    } catch (error) {
        console.error('❌ Error:', error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
