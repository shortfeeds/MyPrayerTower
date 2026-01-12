import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
    const searchParams = req.nextUrl.searchParams;
    const orderId = searchParams.get('order_id');
    const status = searchParams.get('status') || 'success';

    if (!orderId) {
        return NextResponse.redirect(new URL('/', req.url));
    }

    // Since PayPal validation happens on frontend -> checkout API, 
    // this route is mainly for redirects if needed by some legacy links.
    return NextResponse.redirect(new URL(`/?payment_status=${status}&order_id=${orderId}`, req.url));
}
