import { NextResponse } from 'next/server';
import { saveAbandonedCart, markAbandonedCartConverted } from '@/app/actions/cart';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { type, email, name, phone, data, step, source } = body;

        if (!email || !type) {
            return NextResponse.json({ error: 'Missing email or type' }, { status: 400 });
        }

        const result = await saveAbandonedCart({
            type,
            email,
            name,
            phone,
            data: data || {},
            step: step || 'INITIAL',
            source: source || 'WEB'
        });

        if (!result.success) {
            return NextResponse.json({ error: result.error || 'Failed to save' }, { status: 500 });
        }

        return NextResponse.json(result);
    } catch (error) {
        console.error('Error in abandoned-cart POST API:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function PATCH(req: Request) {
    try {
        const body = await req.json();
        const { email, type } = body;

        if (!email) {
            return NextResponse.json({ error: 'Missing email' }, { status: 400 });
        }

        const result = await markAbandonedCartConverted(email, type);
        return NextResponse.json(result);
    } catch (error) {
        console.error('Error in abandoned-cart PATCH API:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
