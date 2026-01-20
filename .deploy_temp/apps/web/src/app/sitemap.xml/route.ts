import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const setting = await db.systemSetting.findUnique({
            where: { key: 'sitemap_xml' },
        });

        if (!setting || !setting.value) {
            return new NextResponse('Sitemap not generated yet. Please generate it from the Admin Panel.', {
                status: 404,
                headers: { 'Content-Type': 'text/plain' },
            });
        }

        return new NextResponse(setting.value, {
            headers: {
                'Content-Type': 'application/xml',
                'Cache-Control': 'public, max-age=3600, s-maxage=3600', // Cache for 1 hour
            },
        });
    } catch (error) {
        console.error('Error serving sitemap:', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}
