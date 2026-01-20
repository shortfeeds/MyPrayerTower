const { PrismaClient } = require('@prisma/client');

async function main() {
    const prisma = new PrismaClient();

    try {
        const [
            users,
            churches,
            dioceses,
            saints,
            prayerRequests,
            ministries,
            newsArticles,
            sponsoredContent
        ] = await Promise.all([
            prisma.user.count(),
            prisma.church.count(),
            prisma.diocese.count(),
            prisma.saint.count(),
            prisma.prayerRequest.count(),
            prisma.ministry.count(),
            prisma.newsArticle.count(),
            prisma.sponsoredContent.count()
        ]);

        console.log('\n=== DATABASE STATISTICS ===\n');
        console.log(`Users:            ${users.toLocaleString()}`);
        console.log(`Churches:         ${churches.toLocaleString()}`);
        console.log(`Dioceses:         ${dioceses.toLocaleString()}`);
        console.log(`Saints:           ${saints.toLocaleString()}`);
        console.log(`Prayer Requests:  ${prayerRequests.toLocaleString()}`);
        console.log(`Ministries:       ${ministries.toLocaleString()}`);
        console.log(`News Articles:    ${newsArticles.toLocaleString()}`);
        console.log(`Sponsored Ads:    ${sponsoredContent.toLocaleString()}`);
        console.log('\n===========================\n');
    } catch (error) {
        console.error('Error:', error.message);
    } finally {
        await prisma.$disconnect();
    }
}

main();
