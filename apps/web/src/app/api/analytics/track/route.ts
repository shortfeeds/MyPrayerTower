import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json().catch(() => ({}));
        const { eventType, screenName, screenClass, clientId, platform, parameters } = body;

        const ip = req.headers.get('x-forwarded-for')?.split(',')[0].trim() || 'unknown';
        const userAgent = req.headers.get('user-agent') || 'mobile-app';

        // Log screen view in application console / telemetry
        if (eventType === 'screen_view') {
            console.log(`[ANALYTICS] Mobile ScreenView: "${screenName}" (${platform || 'android'}) | Client: ${clientId || ip}`);
        } else {
            console.log(`[ANALYTICS] Mobile Event: "${eventType}" | Details:`, parameters);
        }

        // Return immediately to keep mobile app super fast
        return NextResponse.json({ success: true, trackedAt: new Date().toISOString() });
    } catch (error) {
        return NextResponse.json({ success: false }, { status: 500 });
    }
}
