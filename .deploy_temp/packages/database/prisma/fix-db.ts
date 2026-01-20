import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('Manually creating PrayerCandle table with country...');
    try {
        // Drop if exists
        await prisma.$executeRawUnsafe(`DROP TABLE IF EXISTS "PrayerCandle" CASCADE;`);

        // Create table
        await prisma.$executeRawUnsafe(`
            CREATE TABLE "PrayerCandle" (
                "id" TEXT NOT NULL,
                "userId" TEXT,
                "intention" TEXT NOT NULL,
                "isAnonymous" BOOLEAN NOT NULL DEFAULT false,
                "name" TEXT,
                "country" TEXT,
                "email" TEXT,
                "amount" INTEGER NOT NULL,
                "duration" TEXT NOT NULL,
                "color" TEXT NOT NULL DEFAULT 'white',
                "prayerCount" INTEGER NOT NULL DEFAULT 0,
                "litAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
                "expiresAt" TIMESTAMP(3) NOT NULL,
                "isActive" BOOLEAN NOT NULL DEFAULT true,
                "paymentId" TEXT,
                "paymentStatus" TEXT NOT NULL DEFAULT 'PENDING',
                "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
                "updatedAt" TIMESTAMP(3) NOT NULL,

                CONSTRAINT "PrayerCandle_pkey" PRIMARY KEY ("id")
            );
        `);

        // Add indexes
        await prisma.$executeRawUnsafe(`CREATE INDEX "PrayerCandle_isActive_expiresAt_idx" ON "PrayerCandle"("isActive", "expiresAt");`);
        await prisma.$executeRawUnsafe(`CREATE INDEX "PrayerCandle_userId_idx" ON "PrayerCandle"("userId");`);

        console.log('Created table "PrayerCandle" successfully.');

    } catch (e) {
        console.error('Error creating table:', e);
    }
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
