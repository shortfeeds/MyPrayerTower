import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@mpt/database';
import { sendAdminNotification } from '@/lib/email';
import {
    checkRateLimit,
    validateHoneypot,
    validateTimeTrap,
    inspectSpamContent,
    getClientIp
} from '@/lib/spam-protection';

const prisma = new PrismaClient();

/**
 * Contact Form API with Multi-Layer Spam Control
 * 
 * Protects against:
 * - Automated bot scripts (Invisible Honeypots & Time Traps)
 * - Volume flood attacks (IP-based Rate Limiting: 5 per 10 mins)
 * - Disposable/burner email addresses
 * - Spam keywords, backlink promotion, and crypto/gambling payloads
 */

interface ContactFormData {
    firstName: string;
    lastName: string;
    email: string;
    message: string;
    subject?: string;
    website_url?: string;
    company_verification?: string;
    _f_time?: string;
}

export async function POST(request: NextRequest) {
    try {
        const ip = getClientIp(request);

        // 1. IP Rate Limiting: Max 5 submissions per 10 minutes per IP
        const rateLimit = checkRateLimit(ip, 'contact', 5, 600);
        if (!rateLimit.allowed) {
            return NextResponse.json(
                { error: 'Too many requests. Please wait a few minutes before submitting another message.' },
                { status: 429 }
            );
        }

        const data: ContactFormData = await request.json();

        // 2. Invisible Honeypot Check (Silent Shadow Drop)
        // If an automated bot fills in the hidden inputs, accept silently but do NOT store or email.
        const honeypotPassed = validateHoneypot(
            data.website_url,
            data.company_verification
        );
        if (!honeypotPassed) {
            console.warn(`[SPAM SHIELD] Bot honeypot caught submission from IP: ${ip}`);
            return NextResponse.json({
                success: true,
                message: "Your message has been sent! We'll get back to you soon.",
            });
        }

        // 3. Time-Trap Check: Human completion requires at least 2.5 seconds
        if (data._f_time && !validateTimeTrap(data._f_time, 2.5)) {
            console.warn(`[SPAM SHIELD] Sub-human submission speed detected from IP: ${ip}`);
            return NextResponse.json({
                success: true,
                message: "Your message has been sent! We'll get back to you soon.",
            });
        }

        // 4. Validate Required Fields
        if (!data.email || !data.message) {
            return NextResponse.json(
                { error: 'Email and message are required' },
                { status: 400 }
            );
        }

        const emailTrimmed = data.email.trim();
        const messageTrimmed = data.message.trim();
        const firstNameTrimmed = (data.firstName || '').trim();
        const lastNameTrimmed = (data.lastName || '').trim();
        const subject = data.subject?.trim() || `Contact Form: ${firstNameTrimmed} ${lastNameTrimmed}`.trim();

        // Email syntax validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(emailTrimmed)) {
            return NextResponse.json(
                { error: 'Please provide a valid email address.' },
                { status: 400 }
            );
        }

        // Minimum message length for human inquiries
        if (messageTrimmed.length < 10) {
            return NextResponse.json(
                { error: 'Message must be at least 10 characters long.' },
                { status: 400 }
            );
        }

        // 5. Deep Spam & Keyword Inspection
        const spamCheck = inspectSpamContent({
            name: `${firstNameTrimmed} ${lastNameTrimmed}`.trim(),
            email: emailTrimmed,
            subject,
            message: messageTrimmed
        });

        if (spamCheck.isSpam) {
            console.warn(`[SPAM SHIELD] Content inspection blocked submission from IP: ${ip}. Reason: ${spamCheck.reason}`);
            return NextResponse.json(
                { error: spamCheck.reason || 'Your message contains prohibited or promotional content.' },
                { status: 400 }
            );
        }

        // 6. Verified Human Submission: Send email notification to Admin
        await sendAdminNotification({
            type: 'contact',
            subject,
            data: {
                Name: `${firstNameTrimmed} ${lastNameTrimmed}`.trim() || 'Visitor',
                Email: emailTrimmed,
                Subject: subject,
                Message: messageTrimmed,
                IP: ip
            }
        });

        // 7. Store in database for admin dashboard
        await prisma.contactSubmission.create({
            data: {
                firstName: firstNameTrimmed,
                lastName: lastNameTrimmed,
                email: emailTrimmed,
                message: messageTrimmed,
                subject,
                status: 'PENDING'
            }
        });

        return NextResponse.json({
            success: true,
            message: 'Your message has been sent! We\'ll get back to you soon.',
        });

    } catch (error) {
        console.error('Contact form error:', error);
        return NextResponse.json(
            { error: 'Failed to send message. Please try again or email us directly.' },
            { status: 500 }
        );
    }
}

export async function GET() {
    return NextResponse.json({
        message: 'Contact form endpoint. Use POST to submit.'
    });
}
