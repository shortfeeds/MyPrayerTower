const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
    console.log("Patching TelegramUser table...");
    try {
        await prisma.$executeRawUnsafe(`ALTER TABLE "TelegramUser" ADD COLUMN IF NOT EXISTS "preferredTime" TEXT DEFAULT '06:00';`);
        await prisma.$executeRawUnsafe(`ALTER TABLE "TelegramUser" ADD COLUMN IF NOT EXISTS "timezone" TEXT DEFAULT 'UTC';`);
        await prisma.$executeRawUnsafe(`ALTER TABLE "TelegramUser" ADD COLUMN IF NOT EXISTS "isGospelSubscribed" BOOLEAN DEFAULT true;`);
        await prisma.$executeRawUnsafe(`ALTER TABLE "TelegramUser" ADD COLUMN IF NOT EXISTS "isMercySubscribed" BOOLEAN DEFAULT false;`);
        await prisma.$executeRawUnsafe(`ALTER TABLE "TelegramUser" ADD COLUMN IF NOT EXISTS "quizScore" INTEGER DEFAULT 0;`);
        await prisma.$executeRawUnsafe(`ALTER TABLE "TelegramUser" ADD COLUMN IF NOT EXISTS "streakCount" INTEGER DEFAULT 0;`);
        await prisma.$executeRawUnsafe(`ALTER TABLE "TelegramUser" ADD COLUMN IF NOT EXISTS "lastActiveDate" TIMESTAMP(3);`);
        console.log("Success!");
    } catch (e) {
        console.error("Error patching DB:", e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
