import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@mpt/database';
import { getUserFromCookie } from '@/lib/auth';
import { createOrder } from '@/lib/cashfree';

const prisma = new PrismaClient();

interface Params {
    params: { id: string };
}

// Offering type to price key mapping
const OFFERING_PRICES: Record<string, string> = {
    CANDLE_SMALL: 'memorialCandleSmallPrice',
    CANDLE_MEDIUM: 'memorialCandleMediumPrice',
    CANDLE_LARGE: 'memorialCandleLargePrice',
    FLOWERS: 'memorialFlowersPrice',
    PRAYER_CARD: 'memorialPrayerCardPrice',
    FLORAL_BOUQUET: 'memorialFloralBouquetPrice',
    ROSARY_DECADE: 'memorialRosaryDecadePrice',
    ROSARY_FULL: 'memorialRosaryFullPrice',
    SPIRITUAL_BOUQUET_GARDEN: 'memorialBouquetGardenPrice',
    SPIRITUAL_BOUQUET_HEAVENLY: 'memorialBouquetHeavenlyPrice',
    SPIRITUAL_BOUQUET_ETERNAL: 'memorialBouquetEternalPrice',
    SPIRITUAL_BOUQUET_LEGACY: 'memorialBouquetLegacyPrice',
};

// POST /api/memorials/[id]/offering-checkout - Create checkout for offering
export async function POST(request: NextRequest, { params }: Params) {
    try {
        const { id } = params;
        const body = await request.json();
        const { type, message, isAnonymous = false, guestName, guestEmail } = body;

        if (!type || !OFFERING_PRICES[type]) {
            return NextResponse.json({ error: 'Invalid offering type' }, { status: 400 });
        }

        // Find memorial
        let memorial = await prisma.memorial.findUnique({ where: { id } });
        if (!memorial) {
            memorial = await prisma.memorial.findUnique({ where: { slug: id } });
        }
        if (!memorial) {
            return NextResponse.json({ error: 'Memorial not found' }, { status: 404 });
        }

        // Get user if logged in
        const user = await getUserFromCookie();

        // Get price from settings
        const settings = await prisma.appSettings.findFirst();
        const priceKey = OFFERING_PRICES[type] as keyof typeof settings;
        const priceCents = (settings?.[priceKey] as number) || 100;
        const price = priceCents / 100;

        // Create order ID
        const orderId = `OFF-${memorial.id.slice(0, 8)}-${Date.now()}`;
        const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3005';

        // Create Cashfree order
        const order = await createOrder({
            orderId,
            amount: price,
            currency: 'USD',
            customerId: user?.id || `guest-${Date.now()}`,
            customerPhone: user?.phone || '0000000000',
            customerName: user?.displayName || guestName || 'Visitor',
            returnUrl: `${baseUrl}/memorials/${memorial.slug}/offering-success?order_id={order_id}&type=${type}&message=${encodeURIComponent(message || '')}&anonymous=${isAnonymous}&guest_name=${encodeURIComponent(guestName || '')}&guest_email=${encodeURIComponent(guestEmail || '')}`,
        });

        return NextResponse.json({
            success: true,
            payment: {
                orderId,
                sessionId: order.payment_session_id,
                paymentLink: order.payment_link,
                amount: price,
            },
        });
    } catch (error) {
        console.error('Error creating offering checkout:', error);
        return NextResponse.json({ error: 'Failed to create checkout' }, { status: 500 });
    }
}
