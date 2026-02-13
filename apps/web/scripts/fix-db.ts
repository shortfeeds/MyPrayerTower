import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('Starting emergency DB fix...');

    try {
        // Fix Church table missing columns
        console.log('Adding stripeAccountId to Church...');
        await prisma.$executeRawUnsafe(`ALTER TABLE "Church" ADD COLUMN IF NOT EXISTS "stripeAccountId" TEXT;`);

        console.log('Adding totalDonations to Church...');
        await prisma.$executeRawUnsafe(`ALTER TABLE "Church" ADD COLUMN IF NOT EXISTS "totalDonations" INTEGER NOT NULL DEFAULT 0;`);

        console.log('Adding donationCount to Church...');
        await prisma.$executeRawUnsafe(`ALTER TABLE "Church" ADD COLUMN IF NOT EXISTS "donationCount" INTEGER NOT NULL DEFAULT 0;`);

        console.log('Successfully applied Church table fixes.');

        // Create TelegramUser table if not exists
        console.log('Creating TelegramUser table...');
        await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "TelegramUser" (
        "id" TEXT NOT NULL,
        "telegramId" BIGINT NOT NULL,
        "telegramUsername" TEXT,
        "mptUserId" TEXT,
        "preferredTime" TEXT NOT NULL DEFAULT '06:00',
        "timezone" TEXT NOT NULL DEFAULT 'UTC',
        "streakCount" INTEGER NOT NULL DEFAULT 0,
        "lastActiveDate" TIMESTAMP(3),
        "referralCode" TEXT,
        "referredById" TEXT,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL,

        CONSTRAINT "TelegramUser_pkey" PRIMARY KEY ("id")
      );
    `);

        // Create unique index on telegramId if not exists
        // Note: 'IF NOT EXISTS' for index requires Postgres 9.5+
        await prisma.$executeRawUnsafe(`CREATE UNIQUE INDEX IF NOT EXISTS "TelegramUser_telegramId_key" ON "TelegramUser"("telegramId");`);
        await prisma.$executeRawUnsafe(`CREATE UNIQUE INDEX IF NOT EXISTS "TelegramUser_referralCode_key" ON "TelegramUser"("referralCode");`);

        // Create TelegramInteraction table
        console.log('Creating TelegramInteraction table...');
        await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "TelegramInteraction" (
        "id" TEXT NOT NULL,
        "telegramUserId" TEXT NOT NULL,
        "command" TEXT NOT NULL,
        "metadata" JSONB,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

        CONSTRAINT "TelegramInteraction_pkey" PRIMARY KEY ("id")
      );
    `);

        // Add foreign keys (might fail if already exists, wrapped in try-catch block individually if needed, but safe to ignore error locally)
        try {
            await prisma.$executeRawUnsafe(`ALTER TABLE "TelegramUser" ADD CONSTRAINT "TelegramUser_mptUserId_fkey" FOREIGN KEY ("mptUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;`);
        } catch (e) { console.log('Constraint TelegramUser_mptUserId_fkey might already exist or failed'); }

        try {
            await prisma.$executeRawUnsafe(`ALTER TABLE "TelegramUser" ADD CONSTRAINT "TelegramUser_referredById_fkey" FOREIGN KEY ("referredById") REFERENCES "TelegramUser"("id") ON DELETE SET NULL ON UPDATE CASCADE;`);
        } catch (e) { console.log('Constraint TelegramUser_referredById_fkey might already exist or failed'); }

        try {
            await prisma.$executeRawUnsafe(`ALTER TABLE "TelegramInteraction" ADD CONSTRAINT "TelegramInteraction_telegramUserId_fkey" FOREIGN KEY ("telegramUserId") REFERENCES "TelegramUser"("id") ON DELETE CASCADE ON UPDATE CASCADE;`);
        } catch (e) { console.log('Constraint TelegramInteraction_telegramUserId_fkey might already exist or failed'); }

        console.log('Emergency DB fix completed successfully.');

    } catch (error) {
        console.error('Error executing DB fix:', error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
