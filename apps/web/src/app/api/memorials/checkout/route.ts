import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@mpt/database';
import { getUserFromCookie } from '@/lib/auth';
import { createOrder } from '@/lib/cashfree';

const prisma = new PrismaClient();

// POST /api/memorials/checkout - Create checkout session for memorial creation
export async function POST(request: NextRequest) {
    try {
        const user = await getUserFromCookie();
        if (!user) {
            return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
        }

        const body = await request.json();
        const {
            firstName,
            lastName,
            birthDate,
            deathDate,
            biography,
            shortBio,
            photoUrl,
            tier = 'BASIC',
        } = body;

        if (!firstName || !lastName) {
            return NextResponse.json({ error: 'First name and last name are required' }, { status: 400 });
        }

        // Get pricing from settings
        const settings = await prisma.appSettings.findFirst();
        const price = tier === 'PREMIUM'
            ? (settings?.memorialPremiumPrice || 4900) / 100
            : (settings?.memorialBasicPrice || 2000) / 100;

        // Generate slug
        const baseSlug = `${firstName}-${lastName}`.toLowerCase().replace(/[^a-z0-9-]/g, '-');
        const existingCount = await prisma.memorial.count({
            where: { slug: { startsWith: baseSlug } },
        });
        const slug = existingCount > 0 ? `${baseSlug}-${existingCount + 1}` : baseSlug;

        // Create memorial in PENDING state
        const memorial = await prisma.memorial.create({
            data: {
                slug,
                firstName,
                lastName,
                birthDate: birthDate ? new Date(birthDate) : null,
                deathDate: deathDate ? new Date(deathDate) : null,
                biography,
                shortBio,
                photoUrl,
                tier: tier as 'BASIC' | 'PREMIUM',
                ownerId: user.id,
                isPublic: false, // Not public until paid
            },
        });

        // Create Cashfree order
        const orderId = `MEM-${memorial.id}-${Date.now()}`;
        const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3005';

        const order = await createOrder({
            orderId,
            amount: price,
            currency: 'USD',
            customerId: user.id,
            customerPhone: user.phone || '0000000000',
            customerName: user.displayName || `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'User',
            returnUrl: `${baseUrl}/memorials/payment-success?order_id={order_id}&memorial_id=${memorial.id}`,
        });

        // Update memorial with payment info
        await prisma.memorial.update({
            where: { id: memorial.id },
            data: { paymentId: orderId },
        });

        return NextResponse.json({
            success: true,
            memorial: { id: memorial.id, slug: memorial.slug },
            payment: {
                orderId,
                sessionId: order.payment_session_id,
                paymentLink: order.payment_link,
            },
        });
    } catch (error) {
        console.error('Error creating memorial checkout:', error);
        return NextResponse.json({ error: 'Failed to create checkout' }, { status: 500 });
    }
}
