import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkAds() {
  try {
    const adCount = await (prisma as any).adContainer.count();
    const activeAds = await (prisma as any).adContainer.findMany({ where: { isActive: true } });
    const matrix = await prisma.systemSetting.findUnique({ where: { key: 'ad_placements_matrix' } });

    console.log('--- AD CONFIGURATION STATUS ---');
    console.log('Total Ad Containers:', adCount);
    console.log('Active Ads:', activeAds.length);
    activeAds.forEach((ad: any) => {
      console.log(`- [${ad.sectionKey}] Web ID: ${ad.webUnitId || 'MISSING'}`);
    });
    console.log('Placement Matrix exists:', !!matrix);
    if (matrix) {
      console.log('Placement Matrix Value:', matrix.value);
    }
    console.log('-------------------------------');

  } catch (error) {
    console.error('Error checking ads:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkAds();
