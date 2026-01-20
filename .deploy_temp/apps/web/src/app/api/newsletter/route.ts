import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Newsletter Subscription API
 * 
 * Handles newsletter subscriptions with database storage.
 */

export async function POST(request: NextRequest) {
    try {
        const { email, name, source } = await request.json();

        if (!email || !email.includes('@')) {
            return NextResponse.json(
                { error: 'Valid email is required' },
                { status: 400 }
            );
        }

        // Check if already subscribed
        const existing = await prisma.newsletterSubscriber.findUnique({
            where: { email: email.toLowerCase() }
        });

        if (existing) {
            if (existing.isActive) {
                return NextResponse.json({
                    success: true,
                    message: 'You are already subscribed to our newsletter!',
                });
            } else {
                // Reactivate subscription
                await prisma.newsletterSubscriber.update({
                    where: { email: email.toLowerCase() },
                    data: {
                        isActive: true,
                        unsubscribedAt: null,
                        name: name || existing.name
                    }
                });
                return NextResponse.json({
                    success: true,
                    message: 'Welcome back! Your subscription has been reactivated.',
                });
            }
        }

        // Create new subscriber
        await prisma.newsletterSubscriber.create({
            data: {
                email: email.toLowerCase(),
                name: name || null,
                source: source || 'footer'
            }
        });

        console.log(`New newsletter subscription: ${email} (${name || 'No name'})`);

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
