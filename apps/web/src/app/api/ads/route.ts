import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
    try {
        const ads = await db.adContainer.findMany({
            where: { isActive: true },
            select: {
                sectionKey: true,
                adType: true,
                description: true,
                androidUnitId: true,
                iosUnitId: true,
                webUnitId: true,
                platforms: true,
            }
        });

        // Add cache headers (10 minutes)
        const response = NextResponse.json({ ads });
        response.headers.set('Cache-Control', 'public, s-maxage=600, stale-while-revalidate=1200');
        
        return response;
    } catch (error: any) {
        console.error('Ads API Error:', error);
        return NextResponse.json({
            error: 'Failed to fetch ads',
            ads: []
        }, { status: 500 });
    }
}
