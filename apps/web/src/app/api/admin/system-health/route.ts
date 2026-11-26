import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { sendTestAdminEmail } from '@/lib/email';

export const dynamic = 'force-dynamic';

const FRONTEND_KEY = 'frontend_studio_config';

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
    let dbOk = false;
    let liturgicalCron: any = null;
    let lifecycleCron: any = null;
    let frontendConfig = { ...DEFAULT_FRONTEND };

    try {
        await db.user.count();
        dbOk = true;

        const settings = await db.systemSetting.findMany({
            where: {
                key: { in: ['cron_last_run_liturgical', 'cron_last_run_lifecycle', FRONTEND_KEY] },
            },
        });

        for (const s of settings) {
            if (s.key === 'cron_last_run_liturgical' && s.value) {
                liturgicalCron = JSON.parse(s.value);
            } else if (s.key === 'cron_last_run_lifecycle' && s.value) {
                lifecycleCron = JSON.parse(s.value);
            } else if (s.key === FRONTEND_KEY && s.value) {
                frontendConfig = { ...DEFAULT_FRONTEND, ...JSON.parse(s.value) };
            }
        }
    } catch (err) {
        console.error('System health check error:', err);
    }

    const paypalConfigured = Boolean(
        process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID && process.env.PAYPAL_CLIENT_SECRET
    );
    const emailConfigured = Boolean(process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD);

    return NextResponse.json({
        success: true,
        health: {
            database: dbOk ? 'HEALTHY' : 'ERROR',
            paypal: {
                configured: paypalConfigured,
                environment: process.env.PAYPAL_ENVIRONMENT || 'sandbox',
            },
            email: {
                configured: emailConfigured,
                sender: process.env.GMAIL_USER || null,
            },
            crons: {
                liturgical: liturgicalCron,
                lifecycle: lifecycleCron,
            },
        },
        frontendConfig,
    });
}

export async function POST(req: Request) {
    try {
        const body = await req.json();

        if (body.action === 'send_test_email') {
            const res = await sendTestAdminEmail(body.toEmail || undefined);
            return NextResponse.json({ success: res.ok, error: res.error });
        }

        if (body.action === 'save_frontend_config' && body.frontendConfig) {
            const merged = { ...DEFAULT_FRONTEND, ...body.frontendConfig };
            await db.systemSetting.upsert({
                where: { key: FRONTEND_KEY },
                update: { value: JSON.stringify(merged) },
                create: { key: FRONTEND_KEY, value: JSON.stringify(merged) },
            });
            return NextResponse.json({ success: true, frontendConfig: merged });
        }

        return NextResponse.json({ success: false, message: 'Unknown action' }, { status: 400 });
    } catch (err: any) {
        return NextResponse.json({ success: false, message: err?.message || 'Error' }, { status: 500 });
    }
}
