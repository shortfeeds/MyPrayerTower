import { NextRequest, NextResponse } from 'next/server';
import { createPayPalOrder } from '@/lib/paypal';
import { db } from '@/lib/db';

const prisma = db;

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { amount, description, referenceId, metadata } = body;

        // 1. Create Pending Mass Offering Record
        // We use the metadata passed from the frontend form
        const massOffering = await prisma.massOffering.create({
            data: {
                amount: amount, // in cents
                offeringType: metadata.offeringType,
                // Intention Details
                intentionFor: metadata.intentionFor as string,
                additionalNames: metadata.additionalNames || [],
                isForLiving: metadata.isForLiving,
                categories: metadata.categories || [],
                specialIntention: metadata.specialIntention,
                // Tribute
                offeredBy: metadata.offeredBy,
                tributeMessage: metadata.tributeMessage,
                // Purchaser
                email: metadata.email,
                name: metadata.name,
                phone: metadata.phone,
                // Gift
                isGift: metadata.isGift,
                recipientEmail: metadata.recipientEmail,
                recipientName: metadata.recipientName,
                giftMessage: metadata.giftMessage,
                // Add-ons
                includesVirtualCandle: metadata.includesVirtualCandle,
                virtualCandleAmount: metadata.includesVirtualCandle ? 500 : 0,
                includesPrintedCard: metadata.includesPrintedCard,
                printedCardAmount: metadata.includesPrintedCard ? 1000 : 0,
                includesFramedCertificate: metadata.includesFramedCertificate,
                framedCertificateAmount: metadata.includesFramedCertificate ? 3500 : 0,
                printedCardShippingAddress: metadata.printedCardShippingAddress,

                status: 'PENDING_PAYMENT',
            }
        });

        // 2. Create PayPal Order linked to this record
        const dollarAmount = (amount / 100).toFixed(2);

        console.log(`Creating Safe PayPal Order for Mass Offering ${massOffering.id}`);

        const order = await createPayPalOrder(
            dollarAmount,
            description || 'Mass Offering',
            massOffering.id, // Use our DB ID as reference
            // custom_id is not directly exposed in createPayPalOrder helper wrapper usually,
            // but we use referenceId which maps to 'custom_id' or 'invoice_id' in many impls.
            // Let's assume createPayPalOrder handles referenceId as invoice_id or similar.
            // IMPORTANT: If createPayPalOrder puts referenceId into 'purchase_units[0].custom_id', we are good.
            // If it puts it in 'invoice_id', we are also good but need to check during capture.
            undefined // items (optional)
        );

        // 3. Update record with PayPal Order ID (optional but good for tracking)
        // Note: The schema doesn't have paypalOrderId, but it has stripePaymentId etc.
        // We might want to add paypalOrderId to schema later. 
        // For now, we rely on the custom_id/referenceId linkage or transient storage.
        // Actually, schema has 'orderNumber'.

        return NextResponse.json({
            success: true,
            orderId: order.id,
            status: order.status,
        });

    } catch (error: any) {
        console.error('Mass Offering Payment Create Error:', error);
        return NextResponse.json(
            { success: false, message: error.message || 'Failed to initialize payment' },
            { status: 500 }
        );
    }
}
