import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@mpt/database';
import { verifyOrder } from '@/lib/cashfree';

export const dynamic = 'force-dynamic';

const prisma = new PrismaClient();

// GET /api/memorials/verify-payment - Verify memorial payment and activate
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const orderId = searchParams.get('order_id');
        const memorialId = searchParams.get('memorial_id');

        if (!orderId || !memorialId) {
            return NextResponse.json({ error: 'Missing order_id or memorial_id' }, { status: 400 });
        }

        // Verify payment with Cashfree
        const order = await verifyOrder(orderId);

        if (order.order_status === 'PAID') {
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
                status: order.order_status,
                message: 'Payment not completed',
            });
        }
    } catch (error) {
        console.error('Error verifying memorial payment:', error);
        return NextResponse.json({ error: 'Failed to verify payment' }, { status: 500 });
    }
}
