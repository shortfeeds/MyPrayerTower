const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Running AdContainer migration SQL...');
  try {
    // 1. Create AdType enum if not exists
    try {
        await prisma.$executeRawUnsafe(`CREATE TYPE "AdType" AS ENUM ('BANNER', 'NATIVE', 'NEWSLETTER', 'FEATURED');`);
        console.log('Created AdType enum type.');
    } catch (e) {
        console.log('AdType enum might already exist, skipping.');
    }

    // 2. Create AdContainer table
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "AdContainer" (
        "id" TEXT NOT NULL,
        "sectionKey" TEXT NOT NULL,
        "description" TEXT,
        "adType" "AdType" NOT NULL DEFAULT 'BANNER',
        "androidUnitId" TEXT,
        "iosUnitId" TEXT,
        "isActive" BOOLEAN NOT NULL DEFAULT true,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL,

        CONSTRAINT "AdContainer_pkey" PRIMARY KEY ("id")
      );
    `);
    
    // 3. Create unique index on sectionKey
    try {
        await prisma.$executeRawUnsafe(`CREATE UNIQUE INDEX "AdContainer_sectionKey_key" ON "AdContainer"("sectionKey");`);
        console.log('Created unique index on sectionKey.');
    } catch (e) {
        console.log('Unique index on sectionKey might already exist, skipping.');
    }

    console.log('Successfully created AdContainer table.');
    
    // 4. Seed initial data
    const initialAds = [
        { key: 'HOME_BANNER', type: 'BANNER', desc: 'Main banner on the Home screen' },
        { key: 'PRAYER_WALL_NATIVE', type: 'NATIVE', desc: 'Native ad within the prayer list' },
        { key: 'BIBLE_INTERSTITIAL', type: 'FEATURED', desc: 'Full-screen ad after bible reading' }
    ];

    for (const ad of initialAds) {
        await prisma.$executeRawUnsafe(`
            INSERT INTO "AdContainer" ("id", "sectionKey", "adType", "description", "updatedAt")
            VALUES ('${crypto.randomUUID()}', '${ad.key}', '${ad.type}', '${ad.desc}', CURRENT_TIMESTAMP)
            ON CONFLICT ("sectionKey") DO NOTHING;
        `);
    }
    console.log('Seeded initial ad containers.');

  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
