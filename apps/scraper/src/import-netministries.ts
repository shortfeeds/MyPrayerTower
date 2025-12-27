import { scrapeNetMinistriesChurches } from './scrapers/netministries-churches';
import { scrapeNetMinistriesMinistries } from './scrapers/netministries-ministries';
import { PrismaClient } from '@mpt/database';

const prisma = new PrismaClient();

async function main() {
    console.log('Starting NetMinistries Full Import...');

    try {
        // Run sequentially to avoid overwhelming resources or detection
        console.log('--- Phase 1: Churches ---');
        await scrapeNetMinistriesChurches(1000); // 1000 pages * 60 = 60,000 records (covers 30k+)

        console.log('--- Phase 2: Ministries ---');
        await scrapeNetMinistriesMinistries(500); // 500 pages * 60 = 30,000 records (covers 10k+)

        console.log('All imports completed successfully!');
    } catch (error) {
        console.error('Import failed', error);
    } finally {
        await prisma.$disconnect();
    }
}

if (require.main === module) {
    main().catch(console.error);
}
