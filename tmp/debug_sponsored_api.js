const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function testQuery() {
    try {
        const now = new Date();
        const page = 'home';
        const position = 'inline';
        const platform = 'web';

        const whereClause = {
            isActive: true,
            isApproved: true,
            startDate: { lte: now },
            endDate: { gte: now },
            placement: `${page}-${position}`,
            platforms: { has: platform }
        };

        console.log('Running query with whereClause:', JSON.stringify(whereClause, null, 2));

        const contents = await prisma.sponsoredContent.findMany({
            where: whereClause,
            orderBy: [
                { priority: 'desc' },
                { paidAmount: 'desc' },
                { impressions: 'asc' },
            ],
            select: {
                id: true,
                type: true,
                title: true,
                description: true,
                imageUrl: true,
                linkUrl: true,
                advertiser: true,
                placement: true,
                adSource: true,
                googleAdUnitId: true,
                priority: true,
            },
        });

        console.log('Query successful, found ads count:', contents.length);
        console.log('First ad:', JSON.stringify(contents[0], null, 2));

    } catch (error) {
        console.error('Query FAILED with error:');
        console.error(error);
    } finally {
        await prisma.$disconnect();
    }
}

testQuery();
