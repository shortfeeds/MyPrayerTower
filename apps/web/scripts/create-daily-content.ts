
import { Client } from 'pg';
import dotenv from 'dotenv';
import path from 'path';

const envPath = path.resolve(__dirname, '../.env.local');
dotenv.config({ path: envPath, override: true });

async function createTable() {
    const connectionString = process.env.DIRECT_URL;
    if (!connectionString) {
        console.error('DIRECT_URL is not defined');
        return;
    }

    const client = new Client({ connectionString, ssl: { rejectUnauthorized: false } });

    const sql = `
    DROP TABLE IF EXISTS "DailyContent";
    CREATE TABLE "DailyContent" (
        "id" TEXT NOT NULL,
        "date" TEXT NOT NULL,
        "saintId" TEXT,
        "readingId" TEXT,
        "readingTitle" TEXT,
        "readingReference" TEXT,
        "readingText" TEXT,
        "quoteText" TEXT,
        "quoteAuthor" TEXT,
        "isPublished" BOOLEAN NOT NULL DEFAULT false,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL,

        CONSTRAINT "DailyContent_pkey" PRIMARY KEY ("id")
    );

    CREATE UNIQUE INDEX "DailyContent_date_key" ON "DailyContent"("date");
    `;

    try {
        await client.connect();
        console.log('Connecting to database to create table...');
        await client.query(sql);
        console.log('✅ Table "DailyContent" created successfully!');
        await client.end();
    } catch (err) {
        console.error('❌ Failed to create table:', err);
    }
}

createTable();
