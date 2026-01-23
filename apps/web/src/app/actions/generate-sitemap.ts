'use server';

import { db } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { NOVENAS } from '@/lib/novenas';

const BASE_URL = 'https://www.myprayertower.com';
const CHUNK_SIZE = 5000;

export async function generateSitemapAction() {
    try {
        console.log('Starting manual sitemap generation...');
        // TODO: Add auth check here (e.g. ensure user is admin)
        // const session = await auth();
        // if (session?.user?.role !== 'ADMIN') throw new Error('Unauthorized');

        let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

        // 1. Static Routes
        const staticRoutes = [
            '', '/candles', '/prayers', '/saints', '/mass-offerings',
            '/about', '/contact', '/donate', '/memorials', '/prayer-wall',
            '/journey', '/bible', '/confession', '/rosary', '/groups',
            '/login', '/register'
        ];

        staticRoutes.forEach(r => {
            xml += `
  <url>
    <loc>${BASE_URL}${r}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>`;
        });

        // 2. Churches
        const churchCount = await db.church.count();
        for (let i = 0; i < churchCount; i += CHUNK_SIZE) {
            const churches = await db.church.findMany({
                select: { slug: true },
                skip: i,
                take: CHUNK_SIZE,
                orderBy: { id: 'asc' }
            });
            churches.forEach(c => {
                xml += `
  <url>
    <loc>${BASE_URL}/churches/${c.slug}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`;
            });
        }

        // 3. Saints
        const saints = await db.saint.findMany({ select: { slug: true } });
        saints.forEach(s => {
            xml += `
  <url>
    <loc>${BASE_URL}/saints/${s.slug}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`;
        });

        // 4. Novenas (Static)
        NOVENAS.forEach(n => {
            xml += `
  <url>
    <loc>${BASE_URL}/novenas/${n.id}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`;
        });

        /*
        // Prayer model not found in schema currently - skipping
        const prayers = await db.prayer.findMany({
            where: { slug: { not: null } },
            select: { slug: true }
        });
        prayers.forEach(p => {
            xml += `
  <url>
    <loc>${BASE_URL}/prayers/${p.slug}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`;
        });
        */

        // 5. Memorials
        const memorials = await db.memorial.findMany({
            where: { isPublic: true },
            select: { slug: true }
        });
        memorials.forEach(m => {
            xml += `
  <url>
    <loc>${BASE_URL}/memorials/${m.slug}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.6</priority>
  </url>`;
        });

        xml += `
</urlset>`;

        // Save to DB
        await db.systemSetting.upsert({
            where: { key: 'sitemap_xml' },
            update: { value: xml },
            create: { key: 'sitemap_xml', value: xml }
        });

        console.log('Sitemap generated and saved to DB.');
        revalidatePath('/sitemap.xml');
        return { success: true, count: staticRoutes.length + churchCount + saints.length + NOVENAS.length + memorials.length };

    } catch (error) {
        console.error('Failed to generate sitemap:', error);
        throw error;
    }
}
