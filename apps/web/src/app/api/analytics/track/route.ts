import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json().catch(() => ({}));
        
        const ip = req.headers.get('x-forwarded-for')?.split(',')[0].trim() || 
                   req.headers.get('x-real-ip') || 
                   'unknown';
        const userAgent = req.headers.get('user-agent') || 'unknown';
        const country = req.headers.get('cf-ipcountry') || 
                        req.headers.get('x-vercel-ip-country') || 
                        req.headers.get('x-country') || 
                        null;

        // Support array of events or single event payload
        const rawEvents = Array.isArray(body.events) ? body.events : [body];

        const records = rawEvents
            .filter((e) => e && (e.target || e.eventType || e.screenName))
            .map((e) => {
                const isScreenView = e.eventType === 'screen_view' || !!e.screenName;
                const eventType = isScreenView ? 'screen_view' : (e.eventType || 'click');
                const target = e.target || e.screenName || e.action || 'general_click';
                const category = e.category || (isScreenView ? 'navigation' : 'devotional');
                const path = e.path || e.screenClass || e.screenName || null;
                
                // Determine platform
                let platform = (e.platform || '').toLowerCase();
                if (!platform) {
                    if (/android/i.test(userAgent)) platform = 'android';
                    else if (/iphone|ipad|ipod/i.test(userAgent)) platform = 'ios';
                    else platform = 'web';
                }

                return {
                    platform,
                    eventType,
                    target: String(target).slice(0, 200),
                    category: String(category).slice(0, 100),
                    path: path ? String(path).slice(0, 500) : null,
                    metadata: e.metadata || e.parameters || null,
                    clientId: e.clientId ? String(e.clientId).slice(0, 100) : null,
                    userId: e.userId ? String(e.userId).slice(0, 100) : null,
                    ipAddress: ip.slice(0, 60),
                    userAgent: userAgent.slice(0, 300),
                    country: country ? country.slice(0, 10) : null,
                };
            });

        if (records.length > 0) {
            await (db as any).customerInteraction.createMany({
                data: records,
            });
        }

        return NextResponse.json({
            success: true,
            trackedCount: records.length,
            trackedAt: new Date().toISOString(),
        });
    } catch (error) {
        console.error('[ANALYTICS] Tracking error:', error);
        return NextResponse.json({ success: false, error: 'Failed to record interaction' }, { status: 500 });
    }
}

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const days = parseInt(searchParams.get('days') || '7', 10);
        const sinceDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
        const startOfToday = new Date();
        startOfToday.setHours(0, 0, 0, 0);

        // Fetch aggregated interaction data
        const [
            totalInteractions,
            todayInteractions,
            webClicks,
            appClicks,
            topTargets,
            recentInteractions
        ] = await Promise.all([
            (db as any).customerInteraction.count(),
            (db as any).customerInteraction.count({ where: { createdAt: { gte: startOfToday } } }),
            (db as any).customerInteraction.count({ where: { platform: 'web' } }),
            (db as any).customerInteraction.count({ where: { platform: { in: ['android', 'ios'] } } }),
            (db as any).customerInteraction.groupBy({
                by: ['target', 'category', 'platform'],
                _count: { target: true },
                where: { createdAt: { gte: sinceDate } },
                orderBy: { _count: { target: 'desc' } },
                take: 12,
            }),
            (db as any).customerInteraction.findMany({
                take: 10,
                orderBy: { createdAt: 'desc' },
                select: {
                    id: true,
                    platform: true,
                    eventType: true,
                    target: true,
                    category: true,
                    path: true,
                    country: true,
                    createdAt: true,
                },
            }),
        ]);

        return NextResponse.json({
            totalInteractions,
            todayInteractions,
            webClicks,
            appClicks,
            topTargets: topTargets.map((t: any) => ({
                target: t.target,
                category: t.category,
                platform: t.platform,
                count: t._count.target,
            })),
            recentInteractions,
        });
    } catch (error) {
        console.error('[ANALYTICS] Fetch stats error:', error);
        return NextResponse.json({ error: 'Failed to load interaction stats' }, { status: 500 });
    }
}
