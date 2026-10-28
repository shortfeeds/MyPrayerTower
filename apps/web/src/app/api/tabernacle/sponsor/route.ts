import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { randomUUID } from 'crypto';
import { getUserFromCookie } from '@/lib/auth';
import { dispatchServerNotification } from '@/lib/serverNotifications';
import { revalidatePath, revalidateTag } from 'next/cache';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const {
            familyName,
            intention,
            email,
            durationDays = 7,
            paypalOrderId,
            amount
        } = body;

        const safeFamilyName = (familyName || 'The Faithful Family').trim();
        const safeIntention = (intention || 'In Adoration & Protection of Catholic Families').trim();
        const days = Number(durationDays) || 7;

        // Pricing calculation (default in USD cents)
        const priceCents = amount 
            ? Math.round(Number(amount) * 100) 
            : days === 30 ? 8900 : days === 14 ? 4500 : 2500;

        const durationEnum = days === 30 ? 'THIRTY_DAYS' : days === 14 ? 'FOURTEEN_DAYS' : 'SEVEN_DAYS';

        const now = new Date();
        const expiresAt = new Date(now.getTime() + days * 24 * 3600 * 1000);

        // Check if user is logged in
        const user = await getUserFromCookie().catch(() => null);

        const orderId = paypalOrderId || `TABERNACLE_${randomUUID().slice(0, 8)}_${Date.now()}`;

        // Create persistent PrayerCandle record representing the Sanctuary Tabernacle Lamp
        const lamp = await db.prayerCandle.create({
            data: {
                id: orderId,
                userId: user?.id || null,
                name: safeFamilyName,
                email: email || (user as any)?.email || '',
                intention: `Tabernacle Lamp: ${safeIntention}`,
                amount: priceCents,
                duration: durationEnum,
                litAt: now,
                expiresAt,
                isActive: true,
                paymentStatus: 'PAID',
                paymentId: paypalOrderId || 'DIRECT_SPONSOR',
                prayerCount: 1,
            }
        });

        // Instant cache purge for live sanctuary view
        try {
            revalidatePath('/candles');
            revalidateTag('candles');
        } catch {
            // ignore during static build/render
        }

        // Dispatch in-app notification if user is logged in
        if (user?.id) {
            await dispatchServerNotification({
                userId: user.id,
                title: 'Tabernacle Lamp Consecrated',
                body: `The Sanctuary Tabernacle Lamp is now burning for ${safeFamilyName}. Intention: "${safeIntention.slice(0, 50)}..."`,
                type: 'SYSTEM',
                data: {
                    link: '/candles',
                    lampId: lamp.id,
                    expiresAt: expiresAt.toISOString(),
                }
            });
        }

        return NextResponse.json({
            success: true,
            lamp: {
                id: lamp.id,
                sponsorFamily: lamp.name,
                intention: safeIntention,
                litAt: lamp.litAt.toISOString(),
                expiresAt: lamp.expiresAt.toISOString(),
                durationDays: days,
            }
        });

    } catch (error: any) {
        console.error('Failed to sponsor Tabernacle Lamp:', error);
        return NextResponse.json({
            success: false,
            error: error.message || 'Failed to record Tabernacle Lamp sponsorship'
        }, { status: 500 });
    }
}
