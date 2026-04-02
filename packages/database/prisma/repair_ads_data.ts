import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('--- AD DATA REPAIR START ---');

    const adUnits = [
        {
            sectionKey: 'GLOBAL_BANNER',
            description: 'Global Top/Bottom Banner (AdSense + AdMob)',
            adType: 'BANNER' as const,
            webUnitId: '2324777328', // MPT Top Banners
            androidUnitId: 'ca-app-pub-1009360672921924/8257353171', // MPT Banner
            isActive: true,
        },
        {
            sectionKey: 'GLOBAL_NATIVE',
            description: 'Global In-Feed/Article Native Ad',
            adType: 'NATIVE' as const,
            webUnitId: '7054020518', // MPT Article Banners
            androidUnitId: 'ca-app-pub-1009360672921924/9865948318', // MPT Native
            isActive: true,
        },
        {
            sectionKey: 'SIDEBAR_AD',
            description: 'Fixed Sidebar Display Ad (300x250)',
            adType: 'BANNER' as const,
            webUnitId: '5549367155', // MPT Display (Fixed 300x250)
            isActive: true,
        }
    ];

    for (const unit of adUnits) {
        console.log(`Upserting ${unit.sectionKey}...`);
        await prisma.adContainer.upsert({
            where: { sectionKey: unit.sectionKey },
            update: {
                webUnitId: unit.webUnitId,
                androidUnitId: unit.androidUnitId,
                isActive: unit.isActive,
            },
            create: unit,
        });
    }

    console.log('--- REPAIR COMPLETE ---');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
