
import { Client } from 'pg';
import * as dotenv from 'dotenv';
import path from 'path';

// Manual configuration of credentials
const RAW_PASS = 'Alaina$257900';
const ENCODED_PASS = encodeURIComponent(RAW_PASS);
const HOST = 'db.htgvilktnadnwlforyjt.supabase.co';
const DB = 'postgres';
const USER = 'postgres';

const CONNECTION_STRING = `postgresql://${USER}:${ENCODED_PASS}@${HOST}:5432/${DB}`;

console.log('Testing Connection...');
console.log('Host:', HOST);
console.log('User:', USER);

const client = new Client({
    connectionString: CONNECTION_STRING,
    ssl: { rejectUnauthorized: false }
});

async function test() {
    try {
        await client.connect();
        console.log('✅ Connection Successful!');
        const res = await client.query('SELECT NOW()');
        console.log('Time:', res.rows[0]);
        await client.end();
    } catch (err: any) {
        console.error('❌ Connection Failed:', err.message);
        if (err.code) console.error('Error Code:', err.code);
        process.exit(1);
    }
}

test();
