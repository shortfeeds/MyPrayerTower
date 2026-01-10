import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('Attempting to add column "slug" to "Prayer" table...');
    try {
        await prisma.$executeRawUnsafe('ALTER TABLE "Prayer" ADD COLUMN IF NOT EXISTS "slug" TEXT;');
        console.log('Column "slug" added (or already exists).');

        console.log('Attempting to add unique index to "slug"...');
        try {
            await prisma.$executeRawUnsafe('CREATE UNIQUE INDEX IF NOT EXISTS "Prayer_slug_key" ON "Prayer"("slug");');
            console.log('Unique index "Prayer_slug_key" created.');
        } catch (e) {
            console.log('Note: Unique index might already exist or could not be created if there are duplicate nulls (though Postgres allows this).');
            console.error(e);
        }
    } catch (e) {
        console.error('Failed to add column "slug":', e);
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
