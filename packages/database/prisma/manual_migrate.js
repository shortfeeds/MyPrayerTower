const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Running manual migration SQL...');
  try {
    // Add columns to User table
    // PostgreSQL: ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "role" "UserRole" DEFAULT 'USER';
    // But "UserRole" type might not exist yet.
    
    try {
        await prisma.$executeRawUnsafe(`CREATE TYPE "UserRole" AS ENUM ('USER', 'ADMIN', 'MODERATOR');`);
        console.log('Created UserRole enum type.');
    } catch (e) {
        console.log('UserRole enum might already exist, skipping.');
    }

    await prisma.$executeRawUnsafe(`ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "role" "UserRole" NOT NULL DEFAULT 'USER';`);
    await prisma.$executeRawUnsafe(`ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "isBanned" BOOLEAN NOT NULL DEFAULT false;`);
    await prisma.$executeRawUnsafe(`ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "bannedReason" TEXT;`);
    
    console.log('Successfully updated User table columns.');
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
