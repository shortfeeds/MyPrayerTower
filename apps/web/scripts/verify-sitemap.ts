
import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

// Use direct connection if possible, fallback to env
const prisma = new PrismaClient({
    datasources: {
        db: {
            url: process.env.DIRECT_URL || process.env.DATABASE_URL
        }
    }
});

const BASE_URL = 'https://myprayertower.com';
const CHUNK_SIZE = 5000;

async function generateAllUrls() {
    console.log('Starting local sitemap verification...');
    console.log(`Connecting to DB: ${process.env.DIRECT_URL ? 'Using DIRECT_URL' : 'Using DATABASE_URL'}`);

    try {
        await prisma.$connect();
        console.log('Connected to database successfully.');

        const urls: string[] = [];

        // 1. Static Routes (Mocked from sitemap.ts)
        const staticRoutes = [
            '', '/candles', '/prayers', '/saints', '/mass-offerings',
            '/about', '/contact', '/donate', '/memorials', '/prayer-wall',
            '/journey', '/bible', '/confession', '/rosary', '/groups',
            '/login', '/register'
        ];
        staticRoutes.forEach(r => urls.push(`${BASE_URL}${r}`));
        console.log(`Added ${staticRoutes.length} static routes.`);

        // 2. Churches
        console.log('Fetching Churches...');
        const churchCount = await prisma.church.count();
        console.log(`Found ${churchCount} churches. Fetching slugs...`);
        let fetchedChurches = 0;
        while (fetchedChurches < churchCount) {
            const churches = await prisma.church.findMany({
                select: { slug: true },
                skip: fetchedChurches,
                take: CHUNK_SIZE,
                orderBy: { id: 'asc' }
            });
            churches.forEach(c => urls.push(`${BASE_URL}/churches/${c.slug}`));
            fetchedChurches += churches.length;
            console.log(`Fetched ${fetchedChurches}/${churchCount} churches...`);
        }

        // 3. Saints
        console.log('Fetching Saints...');
        const saintCount = await prisma.saint.count();
        const saints = await prisma.saint.findMany({ select: { slug: true } });
        saints.forEach(s => urls.push(`${BASE_URL}/saints/${s.slug}`));
        console.log(`Added ${saints.length} saints.`);

        // 4. Prayers
        console.log('Fetching Prayers...');
        const prayerCount = await prisma.prayer.count({ where: { slug: { not: null } } });
        const prayers = await prisma.prayer.findMany({
            where: { slug: { not: null } },
            select: { slug: true }
        });
        prayers.forEach(p => urls.push(`${BASE_URL}/prayers/${p.slug}`));
        console.log(`Added ${prayers.length} prayers.`);

        // 5. Memorials
        console.log('Fetching Memorials...');
        const memorialCount = await prisma.memorial.count({ where: { isPublic: true } });
        const memorials = await prisma.memorial.findMany({
            where: { isPublic: true },
            select: { slug: true }
        });
        memorials.forEach(m => urls.push(`${BASE_URL}/memorials/${m.slug}`));
        console.log(`Added ${memorials.length} memorials.`);

        console.log('------------------------------------------------');
        console.log(`Total URLs Generated: ${urls.length}`);

        // Write to file
        const outputPath = path.join(process.cwd(), 'sitemap_local_urls.txt');
        fs.writeFileSync(outputPath, urls.join('\n'));
        console.log(`All URLs written to: ${outputPath}`);
        console.log('You can inspect this file to see all generated links.');

    } catch (error) {
        console.error('Error generating sitemap:', error);
    } finally {
        await prisma.$disconnect();
    }
}

generateAllUrls();
