
import { PrismaClient } from '@mpt/database';

const prisma = new PrismaClient();

async function verifyImport() {
    console.log('🔍 Verifying imported data...');

    const churchCount = await prisma.church.count();

    // Count distinct denominations by grouping
    const distinctDenominations = await prisma.church.groupBy({
        by: ['denomination'],
        _count: {
            denomination: true
        },
        orderBy: {
            _count: {
                denomination: 'desc'
            }
        }
    });

    console.log(`\n📊 Database Stats:`);
    console.log(`   - Total Churches: ${churchCount}`);
    console.log(`   - Distinct Denominations: ${distinctDenominations.length}`);

    console.log('\n🔝 Top 10 Denominations:');
    distinctDenominations.slice(0, 10).forEach((d, i) => {
        console.log(`   ${i + 1}. ${d.denomination}: ${d._count.denomination}`);
    });
}

verifyImport()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
