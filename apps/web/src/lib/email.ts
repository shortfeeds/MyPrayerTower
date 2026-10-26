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
    type: 'contact' | 'donation' | 'mass_offering' | 'candle' | 'bouquet' | 'memorial' | 'memorial_offering' | 'report';
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
    // console.log(body); // Keep logs clean
    console.log('================================');

    try {
        const nodemailer = require('nodemailer');

        if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
            console.warn('⚠️  Email credentials not found (GMAIL_USER, GMAIL_APP_PASSWORD). Skipping actual email send.');
            return false;
        }

        const transporter = nodemailer.createTransporter({
            service: 'gmail',
            auth: {
                user: process.env.GMAIL_USER,
                pass: process.env.GMAIL_APP_PASSWORD,
            },
        });

        await transporter.sendMail({
            from: `"MyPrayerTower" <${process.env.GMAIL_USER}>`,
            to: ADMIN_EMAIL,
            replyTo: data.Email !== 'Not provided' ? data.Email : undefined,
            subject,
            text: body,
        });

        console.log('✅ Email sent successfully via details provided');
        return true;
    } catch (error) {
        console.error('❌ Failed to send email:', error);
        return false;
    }
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

/**
 * Send user confirmation email when a vigil candle is lit
 */
export async function sendVigilConfirmationEmail(data: {
    email: string;
    name?: string;
    intention: string;
    tierLabel?: string;
    durationDays?: number;
}): Promise<boolean> {
    const name = data.name || 'Faithful Soul';
    const duration = data.durationDays || 3;
    const tier = data.tierLabel || 'Devotion Votive';
    const subject = `🕊️ Your Vigil Flame is Burning Before the Lord — MyPrayerTower Sanctuary`;

    const htmlBody = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Your Vigil Flame is Burning</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: #0a0612; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; color: #f3f4f6;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #0a0612; padding: 40px 20px;">
        <tr>
          <td align="center">
            <table width="100%" style="max-width: 540px; background: linear-gradient(180deg, #160d29 0%, #0d071a 100%); border: 2px solid #d4af37; border-radius: 20px; overflow: hidden; padding: 36px 28px; text-align: center; box-shadow: 0 20px 40px rgba(0,0,0,0.8);">
              <tr>
                <td>
                  <p style="text-transform: uppercase; letter-spacing: 0.2em; font-size: 11px; color: #d4af37; margin: 0 0 8px 0; font-weight: bold;">Sanctuary of Perpetual Prayer</p>
                  <h1 style="font-family: Georgia, serif; font-size: 24px; color: #fff8e7; margin: 0 0 16px 0; font-weight: bold;">CERTIFICATE OF SACRED VIGIL</h1>
                  <div style="width: 80px; height: 1px; background: #d4af37; margin: 0 auto 24px auto;"></div>
                  
                  <div style="margin: 20px auto; width: 64px; height: 64px; background: radial-gradient(circle, rgba(245,158,11,0.3) 0%, rgba(0,0,0,0) 70%); border-radius: 50%; line-height: 64px; font-size: 32px;">
                    🕯️
                  </div>

                  <p style="font-size: 14px; color: #e5e7eb; margin: 0 0 8px 0;">Peace be with you, <strong style="color: #ffffff;">${name}</strong>.</p>
                  <p style="font-size: 13px; color: #d1d5db; line-height: 1.6; margin: 0 0 20px 0;">
                    Your holy vigil candle (<strong>${tier} • ${duration} Days</strong>) has been lit before the Lord and is now burning continuously on our digital Sanctuary Prayer Wall.
                  </p>

                  <div style="background: rgba(255,255,255,0.06); border: 1px solid rgba(212,175,55,0.4); border-radius: 12px; padding: 18px; margin: 20px 0;">
                    <p style="text-transform: uppercase; font-size: 10px; color: #d4af37; margin: 0 0 6px 0; letter-spacing: 0.1em; font-weight: bold;">Intention Inscribed</p>
                    <p style="font-family: Georgia, serif; font-size: 18px; color: #fff8e7; font-style: italic; margin: 0; line-height: 1.4;">
                      "${data.intention}"
                    </p>
                  </div>

                  <p style="font-family: Georgia, serif; font-style: italic; font-size: 13px; color: #fde68a; margin: 24px 0 8px 0; line-height: 1.5;">
                    "I am the light of the world; he that followeth me shall not walk in darkness, but shall have the light of life."
                  </p>
                  <p style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; color: #d4af37; margin: 0 0 28px 0;">— John 8:12</p>

                  <a href="https://www.myprayertower.com/candles" style="display: inline-block; background: linear-gradient(135deg, #d4af37 0%, #b8860b 100%); color: #0a0612; font-weight: bold; font-size: 14px; text-decoration: none; padding: 12px 28px; border-radius: 30px; margin-bottom: 24px;">
                    View Your Candle in Sanctuary &rarr;
                  </a>

                  <p style="font-size: 11px; color: #9ca3af; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 20px; margin: 20px 0 0 0;">
                    Download free Android app: <a href="https://www.myprayertower.com/app" style="color: #d4af37;">myprayertower.com/app</a><br />
                    Telegram Prayer Community: <a href="https://t.me/myprayertower" style="color: #d4af37;">t.me/myprayertower</a>
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
    `;

    try {
        const nodemailer = require('nodemailer');
        if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
            console.log(`[VIGIL EMAIL LOG]: To ${data.email} | Intention: "${data.intention}"`);
            return true;
        }

        const transporter = nodemailer.createTransporter({
            service: 'gmail',
            auth: {
                user: process.env.GMAIL_USER,
                pass: process.env.GMAIL_APP_PASSWORD,
            },
        });

        await transporter.sendMail({
            from: `"MyPrayerTower Sanctuary" <${process.env.GMAIL_USER}>`,
            to: data.email,
            subject,
            html: htmlBody,
        });

        return true;
    } catch (err) {
        console.error('Failed to send vigil email:', err);
        return false;
    }
}

/**
 * Send user confirmation email when a Holy Mass offering is made
 */
export async function sendMassConfirmationEmail(data: {
    email: string;
    intentionFor: string;
    massTypeName?: string;
    requestedBy?: string;
}): Promise<boolean> {
    const massType = data.massTypeName || 'Single Holy Mass';
    const by = data.requestedBy || 'Faithful Soul';
    const subject = `🍷 Certificate of Holy Mass Offering — MyPrayerTower Sanctuary`;

    const htmlBody = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Holy Mass Offering Certificate</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: #0a0612; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; color: #f3f4f6;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #0a0612; padding: 40px 20px;">
        <tr>
          <td align="center">
            <table width="100%" style="max-width: 540px; background: linear-gradient(180deg, #140b24 0%, #080410 100%); border: 2px solid #d4af37; border-radius: 20px; overflow: hidden; padding: 36px 28px; text-align: center; box-shadow: 0 20px 40px rgba(0,0,0,0.8);">
              <tr>
                <td>
                  <p style="text-transform: uppercase; letter-spacing: 0.2em; font-size: 11px; color: #d4af37; margin: 0 0 8px 0; font-weight: bold;">Sanctuary of Perpetual Prayer</p>
                  <h1 style="font-family: Georgia, serif; font-size: 24px; color: #fff8e7; margin: 0 0 16px 0; font-weight: bold;">HOLY MASS OFFERING CERTIFICATE</h1>
                  <div style="width: 80px; height: 1px; background: #d4af37; margin: 0 auto 24px auto;"></div>

                  <p style="font-size: 13px; color: #d1d5db; line-height: 1.6; margin: 0 0 20px 0;">
                    Your Mass intention has been recorded with reverence and assigned for celebration by our communion of Catholic priests.
                  </p>

                  <div style="background: rgba(255,255,255,0.06); border: 1px solid rgba(212,175,55,0.4); border-radius: 12px; padding: 18px; margin: 20px 0;">
                    <p style="text-transform: uppercase; font-size: 10px; color: #d4af37; margin: 0 0 6px 0; letter-spacing: 0.1em; font-weight: bold;">Intention Offered For</p>
                    <p style="font-family: Georgia, serif; font-size: 20px; color: #fff8e7; font-style: italic; margin: 0 0 10px 0; line-height: 1.4;">
                      "${data.intentionFor}"
                    </p>
                    <p style="font-size: 12px; color: #d1d5db; margin: 0;">
                      Offering: <strong>${massType}</strong> &bull; Requested by: <strong>${by}</strong>
                    </p>
                  </div>

                  <p style="font-family: Georgia, serif; font-style: italic; font-size: 13px; color: #fde68a; margin: 24px 0 8px 0; line-height: 1.5;">
                    "From the rising of the sun unto the going down of the same, the Lord's name is to be praised."
                  </p>
                  <p style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; color: #d4af37; margin: 0 0 28px 0;">— Psalm 113:3</p>

                  <p style="font-size: 11px; color: #9ca3af; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 20px; margin: 20px 0 0 0;">
                    MyPrayerTower Digital Sanctuary<br />
                    Download free Android app: <a href="https://www.myprayertower.com/app" style="color: #d4af37;">myprayertower.com/app</a>
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
    `;

    try {
        const nodemailer = require('nodemailer');
        if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
            console.log(`[MASS EMAIL LOG]: To ${data.email} | Intention: "${data.intentionFor}"`);
            return true;
        }

        const transporter = nodemailer.createTransporter({
            service: 'gmail',
            auth: {
                user: process.env.GMAIL_USER,
                pass: process.env.GMAIL_APP_PASSWORD,
            },
        });

        await transporter.sendMail({
            from: `"MyPrayerTower Sanctuary" <${process.env.GMAIL_USER}>`,
            to: data.email,
            subject,
            html: htmlBody,
        });

        return true;
    } catch (err) {
        console.error('Failed to send mass email:', err);
        return false;
    }
}

/**
 * Send user notification when their vigil candle finishes its prayer period
 */
export async function sendVigilCompletedEmail(data: {
    email: string;
    name?: string;
    intention: string;
}): Promise<boolean> {
    const subject = `🕊️ Vigil Completed: Your Intention Remains Sealed in Prayer — MyPrayerTower`;

    const htmlBody = `
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8"></head>
    <body style="margin: 0; padding: 0; background-color: #0a0612; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif; color: #f3f4f6;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #0a0612; padding: 40px 20px;">
        <tr>
          <td align="center">
            <table width="100%" style="max-width: 540px; background: linear-gradient(180deg, #140b24 0%, #080410 100%); border: 2px solid #d4af37; border-radius: 20px; overflow: hidden; padding: 36px 28px; text-align: center;">
              <tr>
                <td>
                  <p style="text-transform: uppercase; letter-spacing: 0.2em; font-size: 11px; color: #d4af37; margin: 0 0 8px 0; font-weight: bold;">Sanctuary Perpetual Archives</p>
                  <h1 style="font-family: Georgia, serif; font-size: 22px; color: #fff8e7; margin: 0 0 16px 0;">SACRED VIGIL COMPLETED</h1>
                  <div style="width: 80px; height: 1px; background: #d4af37; margin: 0 auto 24px auto;"></div>

                  <p style="font-size: 13px; color: #d1d5db; line-height: 1.6; margin: 0 0 20px 0;">
                    Dear ${data.name || 'Faithful Soul'}, your sacred vigil candle has completed its dedicated burning period before the Lord.
                  </p>

                  <div style="background: rgba(255,255,255,0.06); border: 1px solid rgba(212,175,55,0.4); border-radius: 12px; padding: 18px; margin: 20px 0;">
                    <p style="text-transform: uppercase; font-size: 10px; color: #d4af37; margin: 0 0 6px 0; letter-spacing: 0.1em; font-weight: bold;">Intention Preserved in Grace</p>
                    <p style="font-family: Georgia, serif; font-size: 18px; color: #fff8e7; font-style: italic; margin: 0; line-height: 1.4;">
                      "${data.intention}"
                    </p>
                  </div>

                  <p style="font-family: Georgia, serif; font-style: italic; font-size: 13px; color: #fde68a; margin: 20px 0 8px 0;">
                    "Let my prayer be set forth before thee as incense; and the lifting up of my hands as the evening sacrifice."
                  </p>
                  <p style="font-size: 11px; text-transform: uppercase; color: #d4af37; margin: 0 0 24px 0;">— Psalm 141:2</p>

                  <a href="https://www.myprayertower.com/my-vigils" style="display: inline-block; background: linear-gradient(135deg, #d4af37 0%, #b8860b 100%); color: #0a0612; font-weight: bold; font-size: 13px; text-decoration: none; padding: 12px 24px; border-radius: 30px; margin-bottom: 20px;">
                    View Memorabilia Certificate &rarr;
                  </a>

                  <p style="font-size: 11px; color: #9ca3af; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 16px; margin: 16px 0 0 0;">
                    MyPrayerTower Sanctuary &bull; <a href="https://www.myprayertower.com/app" style="color: #d4af37;">myprayertower.com/app</a>
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
    `;

    try {
        const nodemailer = require('nodemailer');
        if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
            console.log(`[VIGIL COMPLETED LOG]: To ${data.email} | Intention: "${data.intention}"`);
            return true;
        }

        const transporter = nodemailer.createTransporter({
            service: 'gmail',
            auth: {
                user: process.env.GMAIL_USER,
                pass: process.env.GMAIL_APP_PASSWORD,
            },
        });

        await transporter.sendMail({
            from: `"MyPrayerTower Sanctuary" <${process.env.GMAIL_USER}>`,
            to: data.email,
            subject,
            html: htmlBody,
        });

        return true;
    } catch (err) {
        console.error('Failed to send vigil completed email:', err);
        return false;
    }
}

/**
 * Send automated gift notification email for a scheduled or instant Spiritual Bouquet
 */
export async function sendBouquetGiftEmail(data: {
    recipientEmail: string;
    recipientName: string;
    senderName: string;
    occasion?: string;
    message?: string;
    bouquetId: string;
}): Promise<boolean> {
    const subject = `🌹 A Sacred Spiritual Bouquet has been offered for you by ${data.senderName}`;
    const cardUrl = `https://www.myprayertower.com/bouquets/${data.bouquetId}`;

    const htmlBody = `
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8"></head>
    <body style="margin: 0; padding: 0; background-color: #0c0617; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif; color: #f3f4f6;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #0c0617; padding: 40px 20px;">
        <tr>
          <td align="center">
            <table width="100%" style="max-width: 540px; background: linear-gradient(180deg, #1b0a1c 0%, #100612 100%); border: 2px solid #f43f5e; border-radius: 20px; overflow: hidden; padding: 36px 28px; text-align: center;">
              <tr>
                <td>
                  <p style="text-transform: uppercase; letter-spacing: 0.2em; font-size: 11px; color: #fda4af; margin: 0 0 8px 0; font-weight: bold;">Sanctuary Spiritual Offering</p>
                  <h1 style="font-family: Georgia, serif; font-size: 22px; color: #fff1f2; margin: 0 0 16px 0;">SPIRITUAL BOUQUET OF PRAYERS</h1>
                  <div style="width: 80px; height: 1px; background: #f43f5e; margin: 0 auto 24px auto;"></div>

                  <p style="font-size: 14px; color: #e2e8f0; line-height: 1.6; margin: 0 0 16px 0;">
                    Dear <strong>${data.recipientName}</strong>,
                  </p>
                  <p style="font-size: 13px; color: #cbd5e1; line-height: 1.6; margin: 0 0 20px 0;">
                    <strong>${data.senderName}</strong> has offered a consecrated Spiritual Bouquet of prayers and holy sacrifices for you${data.occasion ? ` for ${data.occasion}` : ''}.
                  </p>

                  ${data.message ? `
                  <div style="background: rgba(255,255,255,0.06); border: 1px solid rgba(244,63,94,0.4); border-radius: 12px; padding: 18px; margin: 20px 0;">
                    <p style="font-family: Georgia, serif; font-size: 16px; color: #fff1f2; font-style: italic; margin: 0; line-height: 1.4;">
                      "${data.message}"
                    </p>
                  </div>
                  ` : ''}

                  <a href="${cardUrl}" style="display: inline-block; background: linear-gradient(135deg, #f43f5e 0%, #e11d48 100%); color: #ffffff; font-weight: bold; font-size: 14px; text-decoration: none; padding: 14px 28px; border-radius: 30px; margin: 16px 0 24px 0; box-shadow: 0 10px 25px rgba(244,63,94,0.4);">
                    View & Download Your Keepsake Certificate &rarr;
                  </a>

                  <p style="font-size: 11px; color: #94a3b8; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 16px; margin: 16px 0 0 0;">
                    MyPrayerTower Digital Sanctuary &bull; <a href="https://www.myprayertower.com/app" style="color: #fda4af;">myprayertower.com/app</a>
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
    `;

    try {
        const nodemailer = require('nodemailer');
        if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
            console.log(`[BOUQUET GIFT EMAIL LOG]: To ${data.recipientEmail} | For ${data.recipientName} from ${data.senderName}`);
            return true;
        }

        const transporter = nodemailer.createTransporter({
            service: 'gmail',
            auth: {
                user: process.env.GMAIL_USER,
                pass: process.env.GMAIL_APP_PASSWORD,
            },
        });

        await transporter.sendMail({
            from: `"MyPrayerTower Sanctuary" <${process.env.GMAIL_USER}>`,
            to: data.recipientEmail,
            subject,
            html: htmlBody,
        });

        return true;
    } catch (err) {
        console.error('Failed to send bouquet gift email:', err);
        return false;
    }
}

