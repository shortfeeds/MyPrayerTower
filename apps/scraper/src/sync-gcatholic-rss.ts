
// @ts-nocheck
// GCatholic RSS Feed Sync Utility
// For regular updates from GCatholic.org

import 'dotenv/config';
import axios from 'axios';
import { parseStringPromise } from 'xml2js';
import { PrismaClient } from '@mpt/database';

const prisma = new PrismaClient();
const RSS_BASE = 'https://gcatholic.org/rss';

// Key RSS feeds for updates
const RSS_FEEDS = {
    appointments: `${RSS_BASE}/recent.rss`,
    obituary: `${RSS_BASE}/obituary.rss`,
    cardinals: `${RSS_BASE}/cardinals.rss`,
    romancuria: `${RSS_BASE}/romancuria.rss`,
};

interface RSSItem {
    title: string;
    link: string;
    description: string;
    pubDate: string;
}

async function fetchRSSFeed(url: string): Promise<RSSItem[]> {
    try {
        const response = await axios.get(url, {
            headers: { 'User-Agent': 'MyPrayerTower-Sync/1.0' }
        });

        const result = await parseStringPromise(response.data);
        const items = result?.rss?.channel?.[0]?.item || [];

        return items.map((item: any) => ({
            title: item.title?.[0] || '',
            link: item.link?.[0] || '',
            description: item.description?.[0] || '',
            pubDate: item.pubDate?.[0] || '',
        }));
    } catch (error) {
        console.error(`Failed to fetch ${url}:`, error.message);
        return [];
    }
}

async function syncFromRSS() {
    console.log('📡 GCatholic RSS Sync Utility\n');
    console.log('Available RSS Feeds:');
    console.log('- Appointments: https://gcatholic.org/rss/recent.rss');
    console.log('- Obituary: https://gcatholic.org/rss/obituary.rss');
    console.log('- Cardinals: https://gcatholic.org/rss/cardinals.rss');
    console.log('- Country-specific: https://gcatholic.org/rss/country-{CODE}.rss\n');

    // Check recent appointments
    console.log('📰 Recent Appointments & Resignations:');
    const appointments = await fetchRSSFeed(RSS_FEEDS.appointments);
    console.log(`   Found ${appointments.length} recent updates`);

    if (appointments.length > 0) {
        console.log('\n   Latest 5 updates:');
        for (const item of appointments.slice(0, 5)) {
            console.log(`   - ${item.title}`);
        }
    }

    // Check obituary
    console.log('\n📰 Recent Obituaries:');
    const obituary = await fetchRSSFeed(RSS_FEEDS.obituary);
    console.log(`   Found ${obituary.length} entries`);

    // Log sync to database
    try {
        await prisma.syncLog.create({
            data: {
                source: 'gcatholic',
                type: 'rss-check',
                status: 'COMPLETED',
                startedAt: new Date(),
                completedAt: new Date(),
                recordsProcessed: appointments.length + obituary.length,
                triggeredBy: 'manual'
            }
        });
        console.log('\n✅ Sync check logged to database');
    } catch (e) {
        // SyncLog table might not exist
    }

    await prisma.$disconnect();

    console.log('\n💡 To set up automatic syncing:');
    console.log('   1. Run this script daily via cron/scheduled task');
    console.log('   2. Parse RSS items to trigger re-scraping of changed dioceses');
    console.log('   3. Country RSS feeds available at: /rss/country-{CODE}.rss');
}

syncFromRSS();
