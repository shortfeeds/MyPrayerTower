
const { PrismaClient } = require('@mpt/database');

async function testConnection() {
    console.log('Initializing Prisma Client...');
    const prisma = new PrismaClient();

    try {
        console.log('Connecting to database...');
        await prisma.$connect();
        console.log('✅ Successfully connected to database.');

        console.log('Testing query (Count Churches)...');
        const churchCount = await prisma.church.count();
        console.log(`✅ Church count: ${churchCount}`);

    } catch (error) {
        console.error('❌ Database connection failed:', error);
    } finally {
        await prisma.$disconnect();
    }
}

testConnection();
