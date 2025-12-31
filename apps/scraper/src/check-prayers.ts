
import { PrismaClient } from '@mpt/database';

const prisma = new PrismaClient();

async function check() {
    const cats = await prisma.prayerLibraryCategory.count();
    const prayers = await prisma.prayer.count();
    console.log(`Categories: ${cats}`);
    console.log(`Prayers: ${prayers}`);
}

check().catch(console.error).finally(() => prisma.$disconnect());
