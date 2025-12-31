/**
 * Seed Google AdMob Ads for all placements
 * 
 * Run with: node scripts/seed-google-ads.js
 */

const { PrismaClient } = require('@mpt/database');
const { randomUUID } = require('crypto');

const prisma = new PrismaClient();


// AdMob App ID
const ADMOB_APP_ID = 'ca-app-pub-1009360672921924~8592987992';

// Default ad placements for all pages and positions
const AD_PLACEMENTS = [
    // Homepage
    { page: 'home', position: 'top', name: 'Homepage Top Banner' },
    { page: 'home', position: 'sidebar', name: 'Homepage Sidebar' },
    { page: 'home', position: 'inline', name: 'Homepage Inline' },

    // Churches
    { page: 'churches', position: 'top', name: 'Churches Top Banner' },
    { page: 'churches', position: 'sidebar', name: 'Churches Sidebar' },
    { page: 'churches', position: 'inline', name: 'Churches Inline' },

    // Saints
    { page: 'saints', position: 'top', name: 'Saints Top Banner' },
    { page: 'saints', position: 'sidebar', name: 'Saints Sidebar' },
    { page: 'saints', position: 'inline', name: 'Saints Inline' },

    // Prayers
    { page: 'prayers', position: 'top', name: 'Prayers Top Banner' },
    { page: 'prayers', position: 'sidebar', name: 'Prayers Sidebar' },
    { page: 'prayers', position: 'inline', name: 'Prayers Inline' },

    // Bible
    { page: 'bible', position: 'top', name: 'Bible Top Banner' },
    { page: 'bible', position: 'sidebar', name: 'Bible Sidebar' },
    { page: 'bible', position: 'inline', name: 'Bible Inline' },

    // Readings
    { page: 'readings', position: 'top', name: 'Readings Top Banner' },
    { page: 'readings', position: 'sidebar', name: 'Readings Sidebar' },
    { page: 'readings', position: 'inline', name: 'Readings Inline' },

    // Prayer Wall
    { page: 'prayer-wall', position: 'top', name: 'Prayer Wall Top Banner' },
    { page: 'prayer-wall', position: 'sidebar', name: 'Prayer Wall Sidebar' },
    { page: 'prayer-wall', position: 'inline', name: 'Prayer Wall Inline' },
];

async function seedGoogleAds() {
    console.log('🚀 Seeding Google AdMob ads for all placements...\n');

    const now = new Date();
    const oneYearFromNow = new Date(now.getTime() + 365 * 24 * 60 * 60 * 1000);

    let created = 0;
    let skipped = 0;

    for (const placement of AD_PLACEMENTS) {
        const placementKey = `${placement.page}-${placement.position}`;

        // Check if ad already exists for this placement
        const existing = await prisma.sponsoredContent.findFirst({
            where: { placement: placementKey }
        });

        if (existing) {
            console.log(`⏭️  Skipped: ${placement.name} (already exists)`);
            skipped++;
            continue;
        }

        // Create Google Ad entry
        await prisma.sponsoredContent.create({
            data: {
                id: randomUUID(),
                type: 'BANNER',
                title: placement.name,
                description: `Google AdMob/AdSense ad for ${placement.page} page - ${placement.position} position`,
                imageUrl: null,
                linkUrl: null,
                placement: placementKey,
                advertiser: 'Google AdMob',
                advertiserEmail: null,
                startDate: now,
                endDate: oneYearFromNow,
                impressions: 0,
                clicks: 0,
                paidAmount: null,
                stripePaymentId: null,
                isActive: true,
                isApproved: true,
                approvedBy: 'system',
                approvedAt: now,
                updatedAt: now,
                // New monetization fields
                adSource: 'GOOGLE',
                googleAdUnitId: ADMOB_APP_ID, // Will need specific unit IDs later
                priority: 0, // Lower priority so offline ads take precedence
                targetPages: [placement.page],
            }
        });

        console.log(`✅ Created: ${placement.name}`);
        created++;
    }

    console.log(`\n📊 Summary: ${created} created, ${skipped} skipped`);
    console.log('\n💡 Next: Go to /admin/ads to configure specific Ad Unit IDs for each placement');
}

seedGoogleAds()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
