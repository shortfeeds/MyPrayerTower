import { PrismaClient } from '@mpt/database';

const prisma = new PrismaClient();

async function main() {
    const count = await prisma.ministry.count();
    console.log(`Verified Ministries: ${count}`);

    // Check churches with externalId starting with nm-
    const churches = await prisma.church.count({
        where: { externalId: { startsWith: 'nm-' } }
    });
    console.log(`Verified NetMinistries Churches: ${churches}`);

    const last = await prisma.ministry.findFirst({
        orderBy: { createdAt: 'desc' }
    });
    console.log('Last Ministry:', last);
}

main()
    .catch(e => console.error(e))
    .finally(async () => {
        await prisma.$disconnect();
    });
