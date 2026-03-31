import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
    try {
        const [ads, matrixSetting] = await Promise.all([
            db.adContainer.findMany({
                where: { isActive: true },
                select: {
                    sectionKey: true,
                    adType: true,
                    description: true,
                    androidUnitId: true,
                    iosUnitId: true,
                    webUnitId: true,
                }
            }),
            db.systemSetting.findUnique({
                where: { key: 'ad_placements_matrix' }
            })
        ]);

        let placementsMatrix = {};
        if (matrixSetting) {
            try {
                placementsMatrix = JSON.parse(matrixSetting.value);
            } catch (e) {
                console.error('Failed to parse ad matrix setting');
            }
        }

        // Add cache headers (10 minutes)
        const response = NextResponse.json({ ads, placementsMatrix });
        response.headers.set('Cache-Control', 'public, s-maxage=600, stale-while-revalidate=1200');
        
        return response;
    } catch (error: any) {
        console.error('Ads API Error:', error);
        return NextResponse.json({
            error: 'Failed to fetch ads',
            ads: [],
            placementsMatrix: {}
        }, { status: 500 });
    }
}
