import { PrismaClient } from '@mpt/database';
import { scrapeAllDioceses } from './scrapers/dioceses';
import { scrapeChurches } from './scrapers/churches';
import { scrapeAllSaints } from './scrapers/saints';
import { scrapeAllPrayers } from './scrapers/prayers';
import { logger } from './utils/logger';
import { SyncStatus } from '@mpt/database';

const prisma = new PrismaClient();

async function runFullSync() {
    const syncLog = await prisma.syncLog.create({
        data: {
            source: 'gcatholic+mcp',
            type: 'full',
            status: SyncStatus.RUNNING,
            triggeredBy: 'manual',
        },
    });

    logger.info('Starting full data sync...');
    const startTime = Date.now();
    let totalRecords = 0;

    try {
        // Step 1: Scrape Prayers from MyCatholicPrayers
        logger.info('Step 1/4: Scraping prayers from MyCatholicPrayers...');
        const prayerCount = await scrapeAllPrayers(prisma);
        totalRecords += prayerCount;
        logger.info(`Scraped ${prayerCount} prayers`);

        // Step 2: Scrape Dioceses from GCatholic
        logger.info('Step 2/4: Scraping dioceses from GCatholic...');
        const dioceseCount = await scrapeAllDioceses(prisma);
        totalRecords += dioceseCount;
        logger.info(`Scraped ${dioceseCount} dioceses`);

        // Step 3: Scrape Churches from GCatholic
        logger.info('Step 3/4: Scraping churches from GCatholic...');
        const churchCount = await scrapeChurches(prisma);
        totalRecords += churchCount;
        logger.info(`Scraped ${churchCount} churches`);

        // Step 4: Scrape Saints from GCatholic
        logger.info('Step 4/4: Scraping saints from GCatholic...');
        const saintCount = await scrapeAllSaints(prisma);
        totalRecords += saintCount;
        logger.info(`Scraped ${saintCount} saints`);

        // Complete
        const duration = Math.round((Date.now() - startTime) / 1000);
        await prisma.syncLog.update({
            where: { id: syncLog.id },
            data: {
                status: SyncStatus.COMPLETED,
                completedAt: new Date(),
                recordsProcessed: totalRecords,
            },
        });

        logger.info(`✅ Full sync completed! ${totalRecords} records in ${duration}s`);
    } catch (error: any) {
        logger.error('Sync failed:', error);
        await prisma.syncLog.update({
            where: { id: syncLog.id },
            data: {
                status: SyncStatus.FAILED,
                completedAt: new Date(),
                errorMessage: error.message,
            },
        });
        throw error;
    } finally {
        await prisma.$disconnect();
    }
}

// Run if called directly
const args = process.argv.slice(2);
if (args.includes('--full')) {
    runFullSync().catch(console.error);
}

export { runFullSync };
