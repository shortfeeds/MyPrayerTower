import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export const dynamic = 'force-dynamic';

function buildSundayPrepHtml() {
    return `
    <div style="background:#0A101E;color:#FAF6EE;font-family:Georgia,serif;padding:32px;border-radius:16px;max-width:600px;margin:0 auto;border:1px solid #D4AF37;">
        <div style="text-align:center;border-bottom:1px solid rgba(212,175,55,0.3);padding-bottom:16px;margin-bottom:20px;">
            <div style="color:#D4AF37;font-size:12px;letter-spacing:2px;text-transform:uppercase;font-family:sans-serif;font-weight:bold;">
                ✠ MyPrayerTower Catholic Sanctuary ✠
            </div>
            <h1 style="margin:8px 0 4px;font-size:24px;color:#FAF6EE;">Prepare for Sunday Holy Mass</h1>
            <p style="margin:0;color:#CFC5B4;font-style:italic;font-size:14px;">Weekly Sunday Gospel, Saint Reflection &amp; Community Prayer</p>
        </div>
        <p style="font-family:sans-serif;font-size:14px;line-height:1.6;color:#E5DEC9;">
            Peace be with you. Take a quiet moment tonight to read tomorrow's Sunday Mass Readings, light a free vigil candle for your family, or place your loved ones in Tonight's Rosary Prayer Roll.
        </p>
        <div style="text-align:center;margin:28px 0;">
            <a href="https://www.myprayertower.com/readings" style="display:inline-block;background:#D4AF37;color:#090E18;text-decoration:none;padding:12px 24px;border-radius:999px;font-family:sans-serif;font-weight:bold;font-size:14px;margin:4px;">
                Read Sunday Gospel
            </a>
            <a href="https://www.myprayertower.com/candles" style="display:inline-block;border:1px solid #D4AF37;color:#D4AF37;text-decoration:none;padding:12px 24px;border-radius:999px;font-family:sans-serif;font-weight:bold;font-size:14px;margin:4px;">
                Light a Candle — Free
            </a>
        </div>
        <p style="font-size:11px;color:#9CA3AF;text-align:center;font-family:sans-serif;border-top:1px solid rgba(255,255,255,0.1);padding-top:14px;">
            MyPrayerTower • Serving the global Catholic community since 2018 • <a href="https://www.myprayertower.com" style="color:#D4AF37;">www.myprayertower.com</a>
        </p>
    </div>`;
}

export async function POST(req: NextRequest) {
    try {
        const authHeader = req.headers.get('authorization') || '';
        const cronSecret = process.env.CRON_SECRET || '';
        if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
            return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
        }

        const subscribers = await (db as any).newsletterSubscriber
            .findMany({
                where: { isActive: true },
                select: { email: true },
                take: 250,
            })
            .catch(() => []);

        const html = buildSundayPrepHtml();
        let sentCount = 0;

        if (process.env.SMTP_HOST && subscribers.length > 0) {
            const nodemailer = await import('nodemailer');
            const transporter = nodemailer.default.createTransport({
                host: process.env.SMTP_HOST,
                port: Number(process.env.SMTP_PORT || 587),
                secure: process.env.SMTP_SECURE === 'true',
                auth: {
                    user: process.env.SMTP_USER,
                    pass: process.env.SMTP_PASS,
                },
            });

            for (const sub of subscribers) {
                if (!sub.email) continue;
                await transporter
                    .sendMail({
                        from: process.env.SMTP_FROM || '"MyPrayerTower Sanctuary" <support@myprayertower.com>',
                        to: sub.email,
                        subject: 'Prepare for Sunday Mass: Gospel Readings & Sanctuary Prayer',
                        html,
                    })
                    .then(() => {
                        sentCount += 1;
                    })
                    .catch(() => {});
            }
        }

        return NextResponse.json({
            success: true,
            subscriberCount: subscribers.length,
            sentCount,
        });
    } catch (error: any) {
        console.error('Sunday prep digest error:', error);
        return NextResponse.json({ success: false, error: error?.message || 'Failed' }, { status: 500 });
    }
}
