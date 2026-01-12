const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
    try {
        console.log('Checking recent prayers...');
        console.log('Checking for specific prayer: a-chaplet-of-st-patrick');
        const specificPrayer = await prisma.prayer.findFirst({
            where: { slug: 'a-chaplet-of-st-patrick' }
        });
        console.log('Specific prayer found:', specificPrayer ? 'YES' : 'NO');
        if (specificPrayer) {
            console.log(JSON.stringify(specificPrayer, (key, value) =>
                typeof value === 'bigint' ? value.toString() : value
                , 2));
        }
        const prayers = await prisma.prayer.findMany({
            take: 5,
            select: {
                id: true,
                title: true,
                slug: true,
                is_active: true
            }
        });

        console.log('Found prayers:', JSON.stringify(prayers, (key, value) =>
            typeof value === 'bigint' ? value.toString() : value
            , 2));

        const count = await prisma.prayer.count();
        console.log(`Total prayers: ${count}`);

        const nullSlugs = await prisma.prayer.count({
            where: { slug: null }
        });
        console.log(`Prayers with null slug: ${nullSlugs}`);

    } catch (e) {
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
