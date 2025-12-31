import { NextRequest, NextResponse } from 'next/server';

/**
 * Newsletter Subscription API
 * 
 * This endpoint handles newsletter subscriptions.
 * In production, you would integrate with:
 * - Mailchimp
 * - SendGrid
 * - ConvertKit
 * - or your own email service
 */

export async function POST(request: NextRequest) {
    try {
        const { email, name } = await request.json();

        if (!email || !email.includes('@')) {
            return NextResponse.json(
                { error: 'Valid email is required' },
                { status: 400 }
            );
        }

        // In production, integrate with your email service
        // For now, we'll store in a simple way and/or send to your email

        // Option 1: Send notification email to admin
        const adminEmail = 'myprayertower2@gmail.com';

        // Using mailto fallback for client-side (actual implementation would use NodeMailer or SendGrid)
        console.log(`New newsletter subscription: ${email} (${name || 'No name'})`);

        // Option 2: Store in database (if using Prisma)
        // await prisma.newsletterSubscriber.create({
        //     data: { email, name, subscribedAt: new Date() }
        // });

        // Option 3: Add to Mailchimp/SendGrid list
        // await addToMailingList(email, name);

        return NextResponse.json({
            success: true,
            message: 'Successfully subscribed to newsletter!',
        });

    } catch (error) {
        console.error('Newsletter subscription error:', error);
        return NextResponse.json(
            { error: 'Failed to subscribe. Please try again.' },
            { status: 500 }
        );
    }
}

export async function GET() {
    return NextResponse.json({
        message: 'Newsletter subscription endpoint. Use POST to subscribe.'
    });
}
