import { PrismaClient, AdType, AdSource } from '@prisma/client';
import { randomUUID } from 'crypto';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding SponsoredContent for Admin Panel...');

  const ads = [
    {
      id: randomUUID(),
      type: AdType.BANNER,
      title: 'Sacred Heart Novena',
      description: 'Join our community in praying the Sacred Heart Novena.',
      imageUrl: 'https://images.unsplash.com/photo-1544427928-142ecaca249b?auto=format&fit=crop&q=80',
      linkUrl: 'https://www.myprayertower.com/novenas/sacred-heart',
      placement: 'watch-sidebar',
      advertiser: 'My Prayer Tower',
      advertiserEmail: 'info@myprayertower.com',
      startDate: new Date(),
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      isActive: true,
      isApproved: true,
      adSource: AdSource.OFFLINE,
      priority: 1,
      platforms: ['web', 'android', 'ios'],
      targetPages: ['watch'],
      updatedAt: new Date()
    },
    {
      id: randomUUID(),
      type: AdType.NATIVE,
      title: 'Google AdSense (Web)',
      description: 'Dynamic Google Ad for Website',
      imageUrl: null,
      linkUrl: null,
      placement: 'watch-top',
      advertiser: 'Google AdSense',
      advertiserEmail: 'adsense@google.com',
      startDate: new Date(),
      endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
      isActive: true,
      isApproved: true,
      adSource: AdSource.GOOGLE,
      googleAdUnitId: 'ca-pub-test-slot-123',
      priority: 0,
      platforms: ['web'],
      targetPages: ['watch'],
      updatedAt: new Date()
    },
    {
      id: randomUUID(),
      type: AdType.INTERSTITIAL,
      title: 'AdMob Interstitial (Mobile)',
      description: 'Full screen ad for mobile apps',
      imageUrl: null,
      linkUrl: null,
      placement: 'home-interstitial',
      advertiser: 'Google AdMob',
      advertiserEmail: 'admob@google.com',
      startDate: new Date(),
      endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
      isActive: true,
      isApproved: true,
      adSource: AdSource.GOOGLE,
      androidAdUnitId: 'ca-app-pub-3940256099942544/1033173712',
      iosAdUnitId: 'ca-app-pub-3940256099942544/4411468910',
      priority: 0,
      platforms: ['android', 'ios'],
      targetPages: ['home'],
      updatedAt: new Date()
    }
  ];

  for (const ad of ads) {
    await prisma.sponsoredContent.upsert({
      where: { id: ad.id },
      update: ad,
      create: ad,
    });
  }

  console.log('SponsoredContent seeded successfully.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
