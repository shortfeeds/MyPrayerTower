import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export const revalidate = 60;

const DEFAULT_FRONTEND = {
    heroTitle: 'Enter a Sanctuary of Perpetual Prayer',
    heroSubtitle: 'Light a vigil candle before the altar, unite in the Holy Rosary, and entrust your intentions to priests and faithful worldwide.',
    candlesBurningCount: '12,847',
    faithfulOfferedCount: '428',
    googlePlayUrl: 'https://play.google.com/store/apps/details?id=com.myprayertower.myprayertower_app',
    appRatingText: '4.8 Rating · 100% Free',
    seasonalBannerText: 'Advent & Christmas Gift Bundles Now Available',
};

export async function GET() {
    try {
        const row = await db.systemSetting.findUnique({
            where: { key: 'frontend_studio_config' },
        });
        if (row?.value) {
            return NextResponse.json({
                success: true,
                config: { ...DEFAULT_FRONTEND, ...JSON.parse(row.value) },
            });
        }
    } catch {
        // fallback
    }
    return NextResponse.json({ success: true, config: DEFAULT_FRONTEND });
}
