import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('Creating SystemSetting table via raw SQL...');

    // Basic Text schema for key-value storage
    await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS "SystemSetting" (
      "key" TEXT NOT NULL,
      "value" TEXT NOT NULL,
      "description" TEXT,
      "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT "SystemSetting_pkey" PRIMARY KEY ("key")
    );
  `);

    console.log('Table "SystemSetting" created successfully.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
