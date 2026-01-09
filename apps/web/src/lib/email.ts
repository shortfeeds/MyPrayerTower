/**
 * Email Notification Utility
 * 
 * Sends notification emails to myprayertower2@gmail.com for:
 * - Contact form submissions
 * - Donation checkout
 * - Mass offering requests
 * - Candle purchases
 * - Spiritual bouquet orders
 */

const ADMIN_EMAIL = 'myprayertower2@gmail.com';

interface EmailOptions {
    type: 'contact' | 'donation' | 'mass_offering' | 'candle' | 'bouquet';
    subject: string;
    data: Record<string, any>;
}

/**
 * Send notification email to admin
 * In production, integrate with SendGrid, Resend, or Nodemailer
 */
export async function sendAdminNotification({ type, subject, data }: EmailOptions): Promise<boolean> {
    const timestamp = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });

    let body = `
New ${type.replace('_', ' ').toUpperCase()} Notification
===============================================

Date: ${timestamp}

`;

    // Format data based on type
    for (const [key, value] of Object.entries(data)) {
        if (value !== undefined && value !== null && value !== '') {
            const formattedKey = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
            body += `${formattedKey}: ${value}\n`;
        }
    }

    body += `
---
Sent from MyPrayerTower Admin Notifications
    `.trim();

    // Log for development
    console.log('=== ADMIN EMAIL NOTIFICATION ===');
    console.log(`To: ${ADMIN_EMAIL}`);
    console.log(`Subject: ${subject}`);
    console.log(body);
    console.log('================================');

    // In production, send actual email using:
    // - SendGrid
    // - Resend
    // - Nodemailer with Gmail SMTP
    // - AWS SES

    // Example with Nodemailer:
    // const transporter = nodemailer.createTransporter({
    //     service: 'gmail',
    //     auth: {
    //         user: process.env.GMAIL_USER,
    //         pass: process.env.GMAIL_APP_PASSWORD,
    //     },
    // });
    // await transporter.sendMail({
    //     from: process.env.GMAIL_USER,
    //     to: ADMIN_EMAIL,
    //     subject,
    //     text: body,
    // });

    return true;
}

/**
 * Send donation notification
 */
export async function notifyDonation(data: {
    amount: number;
    name: string;
    email?: string;
    message?: string;
    tier?: string;
}) {
    return sendAdminNotification({
        type: 'donation',
        subject: `New Donation: $${(data.amount / 100).toFixed(2)} from ${data.name}`,
        data: {
            Amount: `$${(data.amount / 100).toFixed(2)}`,
            Name: data.name,
            Email: data.email || 'Not provided',
            Tier: data.tier || 'General',
            Message: data.message || 'None',
        }
    });
}

/**
 * Send mass offering notification
 */
export async function notifyMassOffering(data: {
    offeringType: string;
    intention: string;
    amount: number;
    name: string;
    email?: string;
}) {
    return sendAdminNotification({
        type: 'mass_offering',
        subject: `New Mass Offering: ${data.offeringType} from ${data.name}`,
        data: {
            'Offering Type': data.offeringType,
            Intention: data.intention,
            Amount: `$${(data.amount / 100).toFixed(2)}`,
            'Requested By': data.name,
            Email: data.email || 'Not provided',
        }
    });
}

/**
 * Send candle purchase notification
 */
export async function notifyCandle(data: {
    candleType: string;
    intention: string;
    amount: number;
    name: string;
    email?: string;
}) {
    return sendAdminNotification({
        type: 'candle',
        subject: `New Candle: ${data.candleType} from ${data.name}`,
        data: {
            'Candle Type': data.candleType,
            Intention: data.intention,
            Amount: `$${(data.amount / 100).toFixed(2)}`,
            'Lit By': data.name,
            Email: data.email || 'Not provided',
        }
    });
}

/**
 * Send spiritual bouquet notification
 */
export async function notifyBouquet(data: {
    recipient: string;
    sender: string;
    prayerTypes: string[];
    amount: number;
    email?: string;
}) {
    return sendAdminNotification({
        type: 'bouquet',
        subject: `New Spiritual Bouquet: For ${data.recipient} from ${data.sender}`,
        data: {
            Recipient: data.recipient,
            Sender: data.sender,
            'Prayer Types': data.prayerTypes.join(', '),
            Amount: `$${(data.amount / 100).toFixed(2)}`,
            Email: data.email || 'Not provided',
        }
    });
}

/**
 * Send memorial creation notification
 */
export async function notifyMemorialCreation(data: {
    memorialName: string;
    tier: string;
    createdBy: string;
    email?: string;
}) {
    return sendAdminNotification({
        type: 'memorial' as any,
        subject: `New Memorial Created: ${data.memorialName}`,
        data: {
            Memorial: data.memorialName,
            Tier: data.tier,
            'Created By': data.createdBy,
            Email: data.email || 'Not provided',
        }
    });
}

/**
 * Send memorial offering notification
 */
export async function notifyMemorialOffering(data: {
    memorialName: string;
    offeringType: string;
    amount: number;
    senderName: string;
    message?: string;
}) {
    return sendAdminNotification({
        type: 'memorial_offering' as any,
        subject: `Memorial Offering: ${data.offeringType} for ${data.memorialName}`,
        data: {
            Memorial: data.memorialName,
            'Offering Type': data.offeringType,
            Amount: `$${(data.amount / 100).toFixed(2)}`,
            Sender: data.senderName,
            Message: data.message || 'None',
        }
    });
}

/**
 * Send anniversary reminder email
 * This would be called by a cron job
 */
export async function sendAnniversaryReminder(data: {
    memorialName: string;
    memorialSlug: string;
    anniversaryDate: string;
    recipientEmail: string;
    recipientName?: string;
}) {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://myprayertower.com';
    const memorialUrl = `${baseUrl}/memorials/${data.memorialSlug}`;

    const subject = `🕯️ Anniversary Remembrance: ${data.memorialName}`;
    const body = `
Dear ${data.recipientName || 'Friend'},

Today marks the anniversary of ${data.memorialName}.

Take a moment to light a candle, say a prayer, or leave a message in their memory.

Visit their memorial: ${memorialUrl}

With prayers,
MyPrayerTower Team
    `.trim();

    console.log('=== ANNIVERSARY EMAIL ===');
    console.log(`To: ${data.recipientEmail}`);
    console.log(`Subject: ${subject}`);
    console.log(body);
    console.log('=========================');

    // In production, send actual email
    return true;
}

