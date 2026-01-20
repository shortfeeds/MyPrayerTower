import { PrismaClient } from '@prisma/client';
import * as process from 'process';

const prisma = new PrismaClient();

async function main() {
    const total = await prisma.prayer.count();
    const nullSlugs = await prisma.prayer.count({
        where: {
            OR: [
                { slug: null },
                { slug: '' }
            ]
        }
    });

    console.log(`Total Prayers: ${total}`);
    console.log(`Prayers with null/empty slugs: ${nullSlugs}`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
