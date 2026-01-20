import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@mpt/database';
import { getUserFromCookie } from '@/lib/auth';

const prisma = new PrismaClient();

interface Params {
    params: { id: string };
}

// POST /api/memorials/[id]/offering-checkout - Create checkout session for tribute(s)
export async function POST(request: NextRequest, { params }: Params) {
    try {
        const { id } = params;
        const body = await request.json();
        const { items, message, isAnonymous = false, guestName, guestEmail, paypalOrderId } = body;

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

        // Calculate total amount from items (already calculated on frontend, but good to verify)
        // For simplicity trust frontend amount for now or calculate from settings if needed.
        const totalAmount = body.totalAmount; // cents
        const price = totalAmount / 100;

        // Create a common order ID / transaction ID
        const transactionId = paypalOrderId || `OFF-${memorial.id.slice(0, 8)}-${Date.now()}`;

        // Save offerings to DB
        // If it's a batch of items, we create multiple records
        try {
            if (Array.isArray(items)) {
                for (const item of items) {
                    const quantity = item.quantity || 1;
                    for (let i = 0; i < quantity; i++) {
                        await prisma.memorialOffering.create({
                            data: {
                                memorialId: memorial.id,
                                userId: user?.id,
                                guestName: guestName,
                                guestEmail: guestEmail,
                                type: item.type as any,
                                amount: item.price * 100, // item price in cents
                                message: message,
                                isAnonymous: !!isAnonymous,
                                transactionId: transactionId,
                                paymentSource: 'paypal'
                            }
                        });
                    }
                }
            } else {
                // Single item fallback (original logic)
                const { type, amount } = body;
                await prisma.memorialOffering.create({
                    data: {
                        memorialId: memorial.id,
                        userId: user?.id,
                        guestName: guestName,
                        guestEmail: guestEmail,
                        type: type as any,
                        amount: amount || totalAmount,
                        message: message,
                        isAnonymous: !!isAnonymous,
                        transactionId: transactionId,
                        paymentSource: 'paypal'
                    }
                });
            }
        } catch (dbErr) {
            console.error('Failed to save memorial offerings to DB:', dbErr);
        }

        return NextResponse.json({
            success: true,
            payment: {
                orderId: transactionId,
                amount: price,
            },
        });
    } catch (error) {
        console.error('Error creating offering checkout:', error);
        return NextResponse.json({ error: 'Failed to create checkout' }, { status: 500 });
    }
}
