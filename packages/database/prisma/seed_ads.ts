import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('Seeding simplified global ad containers...');

    const ads = [
        {
            sectionKey: 'GLOBAL_BANNER',
            description: 'Standard banner ads (Top, Bottom, Sidebar)',
            adType: 'BANNER',
            isActive: true,
        },
        {
            sectionKey: 'GLOBAL_NATIVE',
            description: 'Native inline ads (Article feeds, Lists)',
            adType: 'NATIVE',
            isActive: true,
        },
        {
            sectionKey: 'GLOBAL_INTERSTITIAL',
            description: 'Full-screen transitions (e.g. Prayer Submission - TWA only)',
            adType: 'INTERSTITIAL',
            isActive: true,
        }
    ];

    // Optional: Delete old complex seed data
    const oldKeys = [
        'HOME_TOP_BANNER', 'ARTICLE_LIST_NATIVE', 'ARTICLE_DETAIL_BOTTOM',
        'PRAYER_WALL_BANNER', 'BIBLE_READING_BOTTOM', 'DAILY_READING_BOTTOM',
        'CHURCH_LIST_NATIVE', 'CATECHISM_SIDEBAR', 'PRAYER_SUBMIT_INTERSTITIAL'
    ];
    await (prisma as any).adContainer.deleteMany({
        where: { sectionKey: { in: oldKeys } }
    });

    for (const ad of ads) {
        await (prisma as any).adContainer.upsert({
            where: { sectionKey: ad.sectionKey },
            update: {
                description: ad.description,
                adType: ad.adType as any,
                isActive: ad.isActive,
            },
            create: ad as any,
        });
    }

    console.log('Global Ad containers seeded successfully.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
