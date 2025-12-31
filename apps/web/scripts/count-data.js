const { PrismaClient } = require('@mpt/database');
const prisma = new PrismaClient();

async function main() {
    try {
        const dioceses = await prisma.diocese.count();
        const saints = await prisma.saint.count();
        const churches = await prisma.church.count();
        const users = await prisma.user.count();
        const prayers = await prisma.prayerRequest.count();

        console.log(`\n=== DATABASE COUNTS ===`);
        console.log(`Dioceses: ${dioceses}`);
        console.log(`Saints: ${saints}`);
        console.log(`Churches: ${churches}`);
        console.log(`Users: ${users}`);
        console.log(`Prayer Requests: ${prayers}`);
        console.log(`=======================\n`);
    } catch (error) {
        console.error('Error counting data:', error);
    }
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
