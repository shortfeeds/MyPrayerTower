
// Usage: npx tsx scripts/test-db.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('Testing Prayer Table Connection...');
    try {
        const count = await prisma.prayer.count();
        console.log(`Found ${count} prayers.`);

        // Check how many prayers have null slugs
        const nullSlugCount = await prisma.prayer.count({
            where: { slug: null }
        });
        console.log(`Prayers with NULL slug: ${nullSlugCount}`);

        const prayers = await prisma.prayer.findMany({
            take: 5,
            select: {
                id: true,
                title: true,
                slug: true,
                category: true,
                is_active: true
            }
        });

        console.log('Sample Prayers:', JSON.stringify(prayers, (key, value) =>
            typeof value === 'bigint' ? value.toString() : value
            , 2));

    } catch (error) {
        console.error('Test Failed:', error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
