const fs = require('fs');
const path = require('path');
const { PrismaClient } = require('@prisma/client');

// Load .env manually
try {
    const envPath = path.resolve(__dirname, '../../.env');
    console.log('Loading .env from:', envPath);
    const envConfig = fs.readFileSync(envPath, 'utf8');
    for (const line of envConfig.split('\n')) {
        const parts = line.split('=');
        if (parts.length >= 2 && !line.trim().startsWith('#')) {
            const key = parts[0].trim();
            const value = parts.slice(1).join('=').trim().replace(/"/g, ''); // Simple unquote
            if (!process.env[key]) {
                process.env[key] = value;
            }
        }
    }
} catch (e) {
    console.log('Could not load .env file, relying on existing env vars');
}

const prisma = new PrismaClient();

async function main() {
    console.log('Starting emergency DB fix (JS)...');
    console.log('Database URL:', process.env.DATABASE_URL ? 'Found' : 'Missing');

    try {
        // Fix Church table missing columns
        console.log('Adding stripeAccountId to Church...');
        try {
            await prisma.$executeRawUnsafe(`ALTER TABLE "Church" ADD COLUMN IF NOT EXISTS "stripeAccountId" TEXT;`);
            console.log(' - Added stripeAccountId');
        } catch (e) { console.log(' - Failed/Skipped:', e.message); }

        console.log('Adding totalDonations to Church...');
        try {
            await prisma.$executeRawUnsafe(`ALTER TABLE "Church" ADD COLUMN IF NOT EXISTS "totalDonations" INTEGER NOT NULL DEFAULT 0;`);
            console.log(' - Added totalDonations');
        } catch (e) { console.log(' - Failed/Skipped:', e.message); }

        console.log('Adding donationCount to Church...');
        try {
            await prisma.$executeRawUnsafe(`ALTER TABLE "Church" ADD COLUMN IF NOT EXISTS "donationCount" INTEGER NOT NULL DEFAULT 0;`);
            console.log(' - Added donationCount');
        } catch (e) { console.log(' - Failed/Skipped:', e.message); }

        // Create TelegramUser table if not exists
        console.log('Creating TelegramUser table...');
        try {
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
            console.log(' - Created TelegramUser');
        } catch (e) { console.log(' - Failed/Skipped TelegramUser table:', e.message); }

        // Indices
        try {
            await prisma.$executeRawUnsafe(`CREATE UNIQUE INDEX IF NOT EXISTS "TelegramUser_telegramId_key" ON "TelegramUser"("telegramId");`);
        } catch (e) { }
        try {
            await prisma.$executeRawUnsafe(`CREATE UNIQUE INDEX IF NOT EXISTS "TelegramUser_referralCode_key" ON "TelegramUser"("referralCode");`);
        } catch (e) { }

        // Create TelegramInteraction table
        console.log('Creating TelegramInteraction table...');
        try {
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
            console.log(' - Created TelegramInteraction');
        } catch (e) { console.log(' - Failed/Skipped TelegramInteraction table:', e.message); }

        // FKs
        console.log('Adding Foreign Keys...');
        try {
            await prisma.$executeRawUnsafe(`ALTER TABLE "TelegramUser" ADD CONSTRAINT "TelegramUser_mptUserId_fkey" FOREIGN KEY ("mptUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;`);
            console.log(' - Added mptUserId FK');
        } catch (e) { console.log(' - Skipped mptUserId FK'); }

        try {
            await prisma.$executeRawUnsafe(`ALTER TABLE "TelegramUser" ADD CONSTRAINT "TelegramUser_referredById_fkey" FOREIGN KEY ("referredById") REFERENCES "TelegramUser"("id") ON DELETE SET NULL ON UPDATE CASCADE;`);
            console.log(' - Added referredById FK');
        } catch (e) { console.log(' - Skipped referredById FK'); }

        try {
            await prisma.$executeRawUnsafe(`ALTER TABLE "TelegramInteraction" ADD CONSTRAINT "TelegramInteraction_telegramUserId_fkey" FOREIGN KEY ("telegramUserId") REFERENCES "TelegramUser"("id") ON DELETE CASCADE ON UPDATE CASCADE;`);
            console.log(' - Added telegramUserId FK');
        } catch (e) { console.log(' - Skipped telegramUserId FK'); }

        console.log('Completed.');

    } catch (error) {
        console.error('Fatal error:', error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
