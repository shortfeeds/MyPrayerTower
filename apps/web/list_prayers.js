
const { PrismaClient } = require('@mpt/database');
const prisma = new PrismaClient();

async function listPrayers() {
    const prayers = await prisma.prayer.findMany({
        select: { id: true, slug: true, title: true }
    });
    console.log('Total Prayers:', prayers.length);
    console.log(JSON.stringify(prayers, null, 2));
}

listPrayers()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
