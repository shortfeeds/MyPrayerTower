// Extract data from myprayertower.com
import 'dotenv/config';
import { PrismaClient } from '@mpt/database';
import { extractFromMyPrayerTower } from './scrapers/myprayertower';

const prisma = new PrismaClient();

async function main() {
    console.log('🌐 Starting extraction from myprayertower.com...');
    console.log('This will extract categories and prayers from your production site.\n');

    try {
        const result = await extractFromMyPrayerTower(prisma);
        console.log('\n🎉 ========================================');
        console.log('🎉 EXTRACTION COMPLETED!');
        console.log('🎉 ========================================');
        console.log(`📁 Categories imported: ${result.categories}`);
        console.log(`📖 Prayers imported: ${result.prayers}`);
    } catch (error) {
        console.error('❌ Error:', error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
