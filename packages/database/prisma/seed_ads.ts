import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('Seeding ad containers...');

    const ads = [
        {
            sectionKey: 'HOME_TOP_BANNER',
            description: 'Top banner on the home page',
            adType: 'BANNER',
            isActive: true,
        },
        {
            sectionKey: 'ARTICLE_LIST_NATIVE',
            description: 'Native ad in article lists (Home, Blog, etc.)',
            adType: 'NATIVE',
            isActive: true,
        },
        {
            sectionKey: 'ARTICLE_DETAIL_BOTTOM',
            description: 'Banner at the bottom of blog articles',
            adType: 'BANNER',
            isActive: true,
        },
        {
            sectionKey: 'PRAYER_WALL_BANNER',
            description: 'Banner at the top of the Prayer Wall',
            adType: 'BANNER',
            isActive: true,
        },
        {
            sectionKey: 'BIBLE_READING_BOTTOM',
            description: 'Banner at the bottom of Bible reading pages',
            adType: 'BANNER',
            isActive: true,
        },
        {
            sectionKey: 'DAILY_READING_BOTTOM',
            description: 'Banner at the bottom of Daily Readings',
            adType: 'BANNER',
            isActive: true,
        },
        {
            sectionKey: 'CHURCH_LIST_NATIVE',
            description: 'Native ad in the Church directory list',
            adType: 'NATIVE',
            isActive: true,
        },
        {
            sectionKey: 'CATECHISM_SIDEBAR',
            description: 'Sidebar ad in the Catechism section',
            adType: 'BANNER',
            isActive: true,
        },
        {
            sectionKey: 'PRAYER_SUBMIT_INTERSTITIAL',
            description: 'Full-screen ad after submitting a prayer (TWA Only)',
            adType: 'INTERSTITIAL',
            isActive: true,
        }
    ];

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

    console.log('Ad containers seeded successfully.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
