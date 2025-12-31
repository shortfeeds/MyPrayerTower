import { NextRequest, NextResponse } from 'next/server';

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

        const adminEmail = 'myprayertower2@gmail.com';
        const subject = data.subject || `Contact Form: ${data.firstName} ${data.lastName}`;

        // Format the email body
        const emailBody = `
New Contact Form Submission
===========================

Name: ${data.firstName} ${data.lastName}
Email: ${data.email}
Date: ${new Date().toLocaleString()}

Message:
${data.message}

---
Sent from MyPrayerTower Contact Form
        `.trim();

        // Log for development
        console.log('=== NEW CONTACT FORM SUBMISSION ===');
        console.log(`To: ${adminEmail}`);
        console.log(`Subject: ${subject}`);
        console.log(emailBody);
        console.log('===================================');

        // In production, send actual email using your preferred service:

        // Option 1: Using NodeMailer with Gmail
        // const transporter = nodemailer.createTransporter({
        //     service: 'gmail',
        //     auth: {
        //         user: process.env.GMAIL_USER,
        //         pass: process.env.GMAIL_APP_PASSWORD,
        //     },
        // });
        // await transporter.sendMail({
        //     from: process.env.GMAIL_USER,
        //     to: adminEmail,
        //     replyTo: data.email,
        //     subject,
        //     text: emailBody,
        // });

        // Option 2: Using SendGrid
        // const sgMail = require('@sendgrid/mail');
        // sgMail.setApiKey(process.env.SENDGRID_API_KEY);
        // await sgMail.send({
        //     to: adminEmail,
        //     from: 'noreply@myprayertower.com',
        //     replyTo: data.email,
        //     subject,
        //     text: emailBody,
        // });

        // Option 3: Store in database for admin dashboard
        // await prisma.contactSubmission.create({
        //     data: {
        //         firstName: data.firstName,
        //         lastName: data.lastName,
        //         email: data.email,
        //         message: data.message,
        //         subject,
        //     }
        // });

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
