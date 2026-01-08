import { NextRequest, NextResponse } from 'next/server';
import { verifyOrder } from '@/lib/cashfree';

export async function GET(req: NextRequest) {
    const searchParams = req.nextUrl.searchParams;
    const orderId = searchParams.get('order_id');

    if (!orderId) {
        return NextResponse.json({ success: false, message: 'Order ID missing' }, { status: 400 });
    }

    try {
        const orderData = await verifyOrder(orderId);
        const status = orderData.order_status;

        if (status === 'PAID') {
            // Here you would typically update your database
            // E.g., await prisma.candle.update({ where: { id: orderData.order_tags.candleId }, data: { paymentStatus: 'PAID' } })

            // For now, we redirect to a success page or show a success message
            // You can append status to URL to handle it on frontend
            return NextResponse.redirect(new URL('/?payment_status=success&order_id=' + orderId, req.url));
        } else {
            return NextResponse.redirect(new URL('/?payment_status=failed&order_id=' + orderId, req.url));
        }

    } catch (error: any) {
        console.error('Payment verification failed:', error);
        return NextResponse.json({ success: false, message: 'Verification failed', error: error.message }, { status: 500 });
    }
}
