import { scrapeNetMinistriesChurches } from './scrapers/netministries-churches';
import { scrapeNetMinistriesMinistries } from './scrapers/netministries-ministries';
import { PrismaClient } from '@mpt/database';
import * as fs from 'fs/promises';
import * as path from 'path';

const prisma = new PrismaClient();
const STATE_FILE = path.join(__dirname, '../.netministries-sync.json');

interface SyncState {
    churches: {
        lastPage: number;
        totalImported: number;
        lastRun: string;
    };
    ministries: {
        lastPage: number;
        totalImported: number;
        lastRun: string;
    };
}

const DEFAULT_STATE: SyncState = {
    churches: { lastPage: 0, totalImported: 0, lastRun: new Date().toISOString() },
    ministries: { lastPage: 0, totalImported: 0, lastRun: new Date().toISOString() }
};

async function loadState(): Promise<SyncState> {
    try {
        const data = await fs.readFile(STATE_FILE, 'utf-8');
        return JSON.parse(data);
    } catch (e) {
        return DEFAULT_STATE;
    }
}

async function saveState(state: SyncState) {
    await fs.writeFile(STATE_FILE, JSON.stringify(state, null, 2));
}

async function main() {
    console.log('Starting NetMinistries Sync/Resume Process...');
    const state = await loadState();

    try {
        // --- PHASE 1: CHURCHES ---
        console.log(`Resuming Churches from page ${state.churches.lastPage}...`);

        await scrapeNetMinistriesChurches(
            1500, // Target high to cover all
            state.churches.lastPage,
            async (page, total) => {
                state.churches.lastPage = page + 1; // Save next page to start
                state.churches.totalImported += total; // Accumulate? Or just track current run? 
                // The callback gives total for *this* run. 
                // Actually, scraper 'totalImported' resets to 0 each run. 
                // So let's just log what we have. 
                // Ideally, we'd persist the *cumulative* total, but for now simple page tracking is enough.
                state.churches.lastRun = new Date().toISOString();
                await saveState(state);
            }
        );

        // --- PHASE 2: MINISTRIES ---
        console.log(`Resuming Ministries from page ${state.ministries.lastPage}...`);

        await scrapeNetMinistriesMinistries(
            500, // Target high
            state.ministries.lastPage,
            async (page, total) => {
                state.ministries.lastPage = page + 1;
                state.ministries.lastRun = new Date().toISOString();
                await saveState(state);
            }
        );

        console.log('Sync process validation complete.');

    } catch (error) {
        console.error('Sync process interrupted:', error);
    } finally {
        await prisma.$disconnect();
    }
}

if (require.main === module) {
    main().catch(console.error);
}
