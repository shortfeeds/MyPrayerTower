import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🚀 Starting tactical SQL repair of SponsoredContent table...');

  try {
    // 1. Create Enums if they don't exist in public schema
    console.log('🛠️ Checking/Creating Enums...');
    
    // Check if AdSource exists
    const adSourceExists = await prisma.$queryRaw`SELECT 1 FROM pg_type WHERE typname = 'AdSource'`;
    if (!(adSourceExists as any[]).length) {
      console.log('  - Creating AdSource enum...');
      await prisma.$executeRawUnsafe(`CREATE TYPE "AdSource" AS ENUM ('OFFLINE', 'GOOGLE')`);
    }

    // Check if AdType exists
    const adTypeExists = await prisma.$queryRaw`SELECT 1 FROM pg_type WHERE typname = 'AdType'`;
    if (!(adTypeExists as any[]).length) {
      console.log('  - Creating AdType enum...');
      await prisma.$executeRawUnsafe(`CREATE TYPE "AdType" AS ENUM ('BANNER', 'NATIVE', 'INTERSTITIAL', 'REWARDED', 'APP_OPEN', 'NEWSLETTER', 'FEATURED')`);
    }

    // 2. Add missing columns with safety checks
    console.log('🛠️ Adding missing columns...');
    
    const columnsToAdd = [
      { name: 'adSource', type: '"AdSource"', default: "'OFFLINE'" },
      { name: 'googleAdUnitId', type: 'TEXT' },
      { name: 'priority', type: 'INTEGER', default: '0' },
      { name: 'targetPages', type: 'TEXT[]', default: "ARRAY[]::TEXT[]" },
      { name: 'platforms', type: 'TEXT[]', default: "ARRAY['web']::TEXT[]" },
      { name: 'androidAdUnitId', type: 'TEXT' },
      { name: 'iosAdUnitId', type: 'TEXT' }
    ];

    for (const col of columnsToAdd) {
      try {
        console.log(`  - Adding column: ${col.name}...`);
        let sql = `ALTER TABLE "SponsoredContent" ADD COLUMN IF NOT EXISTS "${col.name}" ${col.type}`;
        if (col.default) {
          sql += ` DEFAULT ${col.default}`;
        }
        await prisma.$executeRawUnsafe(sql);
      } catch (colErr: any) {
        if (colErr.message.includes('already exists')) {
          console.log(`    (Column ${col.name} already exists)`);
        } else {
          throw colErr;
        }
      }
    }

    // 3. Ensure targetPages is not null for existing rows
    await prisma.$executeRawUnsafe(`UPDATE "SponsoredContent" SET "targetPages" = ARRAY[]::TEXT[] WHERE "targetPages" IS NULL`);

    console.log('✅ SponsoredContent table repaired successfully!');
  } catch (error) {
    console.error('❌ SQL Repair Failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
