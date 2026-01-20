import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@mpt/database';
import { sendAdminNotification } from '@/lib/email';

const prisma = new PrismaClient();

/**
 * Contact Form API
 * 
 * This endpoint handles contact form submissions.
 * Sends emails to myprayertower2@gmail.com
 * 
 * In production, integrate with:
 * - NodeMailer + SMTP
 * - SendGrid
 * - AWS SES
 * - Resend
 */

interface ContactFormData {
    firstName: string;
    lastName: string;
    email: string;
    message: string;
    subject?: string;
}

export async function POST(request: NextRequest) {
    try {
        const data: ContactFormData = await request.json();

        // Validate required fields
        if (!data.email || !data.message) {
            return NextResponse.json(
                { error: 'Email and message are required' },
                { status: 400 }
            );
        }

        if (!data.email.includes('@')) {
            return NextResponse.json(
                { error: 'Valid email is required' },
                { status: 400 }
            );
        }

        const subject = data.subject || `Contact Form: ${data.firstName} ${data.lastName}`;

        // Send email notification
        await sendAdminNotification({
            type: 'contact',
            subject,
            data: {
                Name: `${data.firstName} ${data.lastName}`,
                Email: data.email,
                Message: data.message
            }
        });

        // Option 3: Store in database for admin dashboard
        await prisma.contactSubmission.create({
            data: {
                firstName: data.firstName,
                lastName: data.lastName,
                email: data.email,
                message: data.message,
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
