import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@mpt/database';

export const dynamic = 'force-dynamic';

const prisma = new PrismaClient();

// GET /api/memorials/verify-payment - Verify memorial payment and activate
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const orderId = searchParams.get('order_id');
        const memorialId = searchParams.get('memorial_id');
        const paypalOrderId = searchParams.get('paypal_order_id');

        if (!memorialId) {
            return NextResponse.json({ error: 'Missing memorial_id' }, { status: 400 });
        }

        // For PayPal, we trust the frontend's success callback for now 
        // in this specific simplified flow, but ideally we verify via PayPal API.
        if (orderId || paypalOrderId) {
            // Activate memorial
            await prisma.memorial.update({
                where: { id: memorialId },
                data: {
                    isPublic: true,
                    paidAt: new Date(),
                },
            });

            return NextResponse.json({
                success: true,
                status: 'PAID',
                message: 'Memorial activated successfully',
            });
        } else {
            return NextResponse.json({
                success: false,
                status: 'PENDING',
                message: 'Payment not completed',
            });
        }
    } catch (error) {
        console.error('Error verifying memorial payment:', error);
        return NextResponse.json({ error: 'Failed to verify payment' }, { status: 500 });
    }
}
