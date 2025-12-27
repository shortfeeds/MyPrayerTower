
import 'dotenv/config';
import { PrismaClient } from '@mpt/database';

const prisma = new PrismaClient();

async function verify() {
    const count = await prisma.diocese.count();
    console.log(`✅ Total Dioceses in DB: ${count}`);

    const byRegion = await prisma.diocese.groupBy({
        by: ['region'],
        _count: true
    });
    console.log('By Region:', byRegion);

    await prisma.$disconnect();
}

verify();
