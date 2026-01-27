
// Explicitly load .env from database package
import * as dotenv from 'dotenv';
import path from 'path';

// Load from root .env.local FIRST (prioritize production/vercel vars)
dotenv.config({ path: path.resolve(__dirname, '../../../.env.local'), override: true });

// Load from packages/database/.env (fallback)
// dotenv.config({ path: path.resolve(__dirname, '../../../packages/database/.env') });

console.log('Using DATABASE_URL:', process.env.DATABASE_URL?.replace(/:[^:@]*@/, ':****@'));

import { PrismaClient } from '@prisma/client';

const db = new PrismaClient();

async function main() {
    const today = new Date().toISOString().split('T')[0];
    console.log(`Seeding daily content for ${today}...`);

    // Create or Update content for today
    const content = await db.dailyContent.upsert({
        where: { date: today },
        update: {}, // Don't overwrite if exists, or change to update fields
        create: {
            date: today,
            isPublished: true,

            // Seed a Saint
            // Note: In real app, we'd link to an existing saint via ID. 
            // For now, we'll just skip the relation and rely on API fallbacks 
            // OR we create a saint first if we want to test the relation.
            // Let's rely on the API looking up the saint via ID if we had one.
            // But the schema I added has `saintId`.
            // Let's try to find a saint first.

            readingTitle: "The Beatitudes",
            readingReference: "Matthew 5:1-12",
            readingText: "Blessed are the poor in spirit, for theirs is the kingdom of heaven...",

            quoteText: "Preach the Gospel at all times, and when necessary use words.",
            quoteAuthor: "St. Francis of Assisi"
        }
    });

    console.log('Daily content seeded:', content);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await db.$disconnect();
    });
