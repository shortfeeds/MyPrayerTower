
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    try {
        const count = await prisma.church.count();
        console.log(`Total Churches in DB: ${count}`);

        if (count > 0) {
            const sample = await prisma.church.findFirst();
            console.log('Sample Church:', JSON.stringify(sample, null, 2));
        }
    } catch (e) {
        console.error('Error connecting to DB:', e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
