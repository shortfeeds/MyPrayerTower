
import { Client } from 'pg';
import dotenv from 'dotenv';
import path from 'path';

// Fix path to point to apps/.env.local (one level up from script dir if script is in apps/web/scripts and env is in apps/web)
// Wait, user said apps/web/.env.local.
// Script: apps/web/scripts/test-db.ts
// __dirname: apps/web/scripts
// .. -> apps/web
// .env.local -> apps/web/.env.local
const envPath = path.resolve(__dirname, '../.env.local');
console.log('Loading env from:', envPath);
dotenv.config({ path: envPath, override: true });

async function testOneConnection(name: string, connectionString: string | undefined) {
    if (!connectionString) {
        console.error(`${name} is not defined`);
        return;
    }

    // Mask password for logging
    const masked = connectionString.replace(/:[^:]*@/, ':****@');
    console.log(`\nTesting connection to ${name}:`, masked);

    const client = new Client({
        connectionString: connectionString,
        ssl: { rejectUnauthorized: false }
    });

    try {
        await client.connect();
        console.log(`✅ ${name}: Connected successfully to Postgres!`);

        // Simple query
        const res = await client.query('SELECT NOW() as now, version()');
        console.log(`${name}: Current DB Time:`, res.rows[0].now);

        await client.end();
    } catch (err) {
        console.error(`❌ ${name}: Connection failed:`, err);
        if (err instanceof Error) {
            // @ts-ignore
            if (err.code) console.error('Error code:', err.code);
        }
    }
}

async function listTables(name: string, connectionString: string | undefined, schema: string) {
    if (!connectionString) return;
    const client = new Client({ connectionString, ssl: { rejectUnauthorized: false } });
    try {
        await client.connect();
        const res = await client.query(`SELECT table_name FROM information_schema.tables WHERE table_schema = '${schema}'`);
        console.log(`\nTables in ${name} (${schema} schema):`);
        console.log(res.rows.map(r => r.table_name).join(', '));

        if (schema === 'public') {
            const content = await client.query('SELECT * FROM "DailyContent" LIMIT 1');
            console.log('\nSeeded DailyContent row:');
            console.log(JSON.stringify(content.rows[0], null, 2));
        }

        await client.end();
    } catch (err) {
        console.error(`❌ ${name}: Failed to list tables in ${schema}:`, err);
    }
}

async function testConnection() {
    await testOneConnection('DATABASE_URL', process.env.DATABASE_URL);
    await listTables('DATABASE_URL', process.env.DATABASE_URL, 'public');
    await listTables('DATABASE_URL', process.env.DATABASE_URL, 'auth');
}

testConnection().catch(e => console.error(e));
