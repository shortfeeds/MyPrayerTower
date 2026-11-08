import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import {
    checkRateLimit,
    validateHoneypot,
    validateTimeTrap,
    isDisposableEmail,
    getClientIp
} from '@/lib/spam-protection';

const prisma = new PrismaClient();

/**
 * Newsletter Subscription API with Anti-Spam Control
 * 
 * Protects against:
 * - Automated subscription bots (Honeypot & Time-Trap)
 * - Rate abuse (IP rate limiting: 4 per 10 minutes)
 * - Disposable / burner email domains
 */

export async function POST(request: NextRequest) {
    try {
        const ip = getClientIp(request);

        // 1. IP Rate Limiting: Max 4 newsletter attempts per 10 minutes
        const rateLimit = checkRateLimit(ip, 'newsletter', 4, 600);
        if (!rateLimit.allowed) {
            return NextResponse.json(
                { error: 'Too many requests. Please wait a few minutes before trying again.' },
                { status: 429 }
            );
        }

        const body = await request.json();
        const { email, name, source, website_url, _f_time } = body;

        // 2. Invisible Honeypot Check (Silent Shadow Drop)
        if (!validateHoneypot(website_url)) {
            console.warn(`[SPAM SHIELD] Newsletter honeypot caught bot from IP: ${ip}`);
            return NextResponse.json({
                success: true,
                message: 'Successfully subscribed to newsletter!',
            });
        }

        // 3. Time-Trap Check
        if (_f_time && !validateTimeTrap(_f_time, 2.0)) {
            console.warn(`[SPAM SHIELD] Newsletter sub-human completion speed from IP: ${ip}`);
            return NextResponse.json({
                success: true,
                message: 'Successfully subscribed to newsletter!',
            });
        }

        if (!email || !email.includes('@')) {
            return NextResponse.json(
                { error: 'Valid email is required' },
                { status: 400 }
            );
        }

        const emailClean = email.toLowerCase().trim();

        // 4. Validate Email Format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(emailClean)) {
            return NextResponse.json(
                { error: 'Please enter a valid email address.' },
                { status: 400 }
            );
        }

        // 5. Disposable / Burner Email Check
        if (isDisposableEmail(emailClean)) {
            return NextResponse.json(
                { error: 'Temporary or disposable email addresses are not accepted.' },
                { status: 400 }
            );
        }

        // Check if already subscribed
        const existing = await prisma.newsletterSubscriber.findUnique({
            where: { email: emailClean }
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
                    where: { email: emailClean },
                    data: {
                        isActive: true,
                        unsubscribedAt: null,
                        name: name ? name.trim() : existing.name
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
                email: emailClean,
                name: name ? name.trim() : null,
                source: source || 'footer'
            }
        });

        console.log(`[NEWSLETTER] Verified subscription: ${emailClean} (${name || 'Anonymous'}) [IP: ${ip}]`);

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
