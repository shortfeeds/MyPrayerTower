import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

interface EmailOptions {
    to: string;
    subject: string;
    html: string;
    attachments?: Array<{
        filename: string;
        path?: string;
        content?: Buffer;
    }>;
}

@Injectable()
export class EmailService {
    private readonly logger = new Logger(EmailService.name);
    private transporter: nodemailer.Transporter | null = null;
    private fromEmail: string;
    private fromName: string = 'MyPrayerTower';

    constructor(private configService: ConfigService) {
        const smtpHost = this.configService.get('SMTP_HOST');
        const smtpUser = this.configService.get('SMTP_USER');
        const smtpPass = this.configService.get('SMTP_PASS');
        this.fromEmail = this.configService.get('FROM_EMAIL') || 'noreply@myprayertower.com';

        if (smtpHost && smtpUser && smtpPass) {
            this.transporter = nodemailer.createTransport({
                host: smtpHost,
                port: parseInt(this.configService.get('SMTP_PORT') || '587'),
                secure: false,
                auth: {
                    user: smtpUser,
                    pass: smtpPass,
                },
            });
            this.logger.log('Email service configured');
        } else {
            this.logger.warn('Email service not configured - emails will be logged only');
        }
    }

    /**
     * Send an email
     */
    async sendEmail(options: EmailOptions): Promise<boolean> {
        if (!this.transporter) {
            this.logger.log(`[Mock Email] To: ${options.to}, Subject: ${options.subject}`);
            return true;
        }

        try {
            await this.transporter.sendMail({
                from: `"${this.fromName}" <${this.fromEmail}>`,
                to: options.to,
                subject: options.subject,
                html: options.html,
                attachments: options.attachments,
            });
            this.logger.log(`Email sent to ${options.to}: ${options.subject}`);
            return true;
        } catch (error: any) {
            this.logger.error(`Failed to send email: ${error.message}`);
            return false;
        }
    }

    /**
     * Send Mass Offering confirmation email
     */
    async sendMassOfferingConfirmation(data: {
        email: string;
        name: string;
        orderNumber: string;
        offeringType: string;
        intentionFor: string;
        isForLiving: boolean;
        amount: number;
        certificateUrl?: string;
    }): Promise<boolean> {
        const offeringLabels: Record<string, string> = {
            REGULAR: 'Single Mass',
            PERPETUAL: 'Perpetual Enrollment',
            NOVENA: 'Novena of Masses',
            GREGORIAN: 'Gregorian Masses',
            EXPEDITED: 'Expedited Mass',
        };

        const html = `
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: 'Georgia', serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; }
        .header { background: linear-gradient(135deg, #D4A373 0%, #A67C52 100%); color: white; padding: 30px; text-align: center; }
        .cross { font-size: 36px; margin-bottom: 10px; }
        .content { padding: 30px; background: #FFFBF0; }
        .order-box { background: white; border: 1px solid #E8D5B7; border-radius: 8px; padding: 20px; margin: 20px 0; }
        .label { color: #666; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; }
        .value { font-size: 16px; font-weight: 600; color: #333; margin-bottom: 15px; }
        .total { font-size: 24px; color: #A67C52; }
        .footer { text-align: center; padding: 20px; color: #888; font-size: 12px; }
        .button { display: inline-block; background: #A67C52; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin-top: 15px; }
    </style>
</head>
<body>
    <div class="header">
        <div class="cross">✝</div>
        <h1 style="margin: 0;">Mass Intention Received</h1>
    </div>
    <div class="content">
        <p>Dear ${data.name},</p>
        <p>Thank you for your Mass intention request. We have received your offering and will have a Holy Mass celebrated for your intention.</p>
        
        <div class="order-box">
            <div class="label">Order Number</div>
            <div class="value">${data.orderNumber}</div>
            
            <div class="label">Offering Type</div>
            <div class="value">${offeringLabels[data.offeringType] || data.offeringType}</div>
            
            <div class="label">Intention For</div>
            <div class="value">${data.intentionFor} (${data.isForLiving ? 'Living' : 'Deceased'})</div>
            
            <div class="label">Amount</div>
            <div class="value total">$${(data.amount / 100).toFixed(2)}</div>
        </div>
        
        <p><strong>What happens next?</strong></p>
        <ol>
            <li>We will assign your intention to one of our partner monasteries</li>
            <li>You will receive an email when the Mass is scheduled</li>
            <li>A notification will be sent when the Mass has been celebrated</li>
        </ol>
        
        ${data.certificateUrl ? `
        <p style="text-align: center;">
            <a href="${data.certificateUrl}" class="button">Download Mass Card</a>
        </p>
        ` : ''}
        
        <p>May God bless you and your loved ones abundantly.</p>
        <p>In Christ,<br>The MyPrayerTower Team</p>
    </div>
    <div class="footer">
        <p>MyPrayerTower • www.myprayertower.com</p>
        <p>This email was sent to ${data.email}</p>
    </div>
</body>
</html>
        `;

        return this.sendEmail({
            to: data.email,
            subject: `✝ Mass Intention Received - Order ${data.orderNumber}`,
            html,
        });
    }

    /**
     * Send donation thank you email
     */
    async sendDonationThankYou(data: {
        email: string;
        name: string;
        orderNumber: string;
        amount: number;
        tier?: string;
    }): Promise<boolean> {
        const tierLabels: Record<string, string> = {
            CANDLE: '🕯️ Light a Candle',
            ROSARY: '📿 Rosary Partner',
            SUPPORTER: '⛪ Parish Supporter',
            GUARDIAN: '👼 Guardian Angel',
            BENEFACTOR: '🌟 Benefactor',
            PATRON: '💎 Patron',
            CORNERSTONE: '🏆 Cornerstone',
            CUSTOM: '❤️ Custom Gift',
        };

        const html = `
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: 'Georgia', serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; }
        .header { background: linear-gradient(135deg, #E91E63 0%, #C2185B 100%); color: white; padding: 30px; text-align: center; }
        .heart { font-size: 36px; margin-bottom: 10px; }
        .content { padding: 30px; background: #FFF0F5; }
        .amount-box { background: white; border: 1px solid #F8BBD0; border-radius: 8px; padding: 20px; margin: 20px 0; text-align: center; }
        .amount { font-size: 36px; color: #C2185B; font-weight: bold; }
        .tier { color: #666; font-size: 14px; margin-top: 5px; }
        .footer { text-align: center; padding: 20px; color: #888; font-size: 12px; }
    </style>
</head>
<body>
    <div class="header">
        <div class="heart">❤️</div>
        <h1 style="margin: 0;">Thank You for Your Gift!</h1>
    </div>
    <div class="content">
        <p>Dear ${data.name},</p>
        <p>Your generous donation to MyPrayerTower has been received. Your support helps us continue serving Catholics worldwide through prayer and spiritual resources.</p>
        
        <div class="amount-box">
            <div class="amount">$${(data.amount / 100).toFixed(2)}</div>
            ${data.tier ? `<div class="tier">${tierLabels[data.tier] || data.tier}</div>` : ''}
            <div style="color: #888; font-size: 12px; margin-top: 10px;">Confirmation: ${data.orderNumber}</div>
        </div>
        
        <p>This email serves as your receipt for tax purposes. MyPrayerTower is a registered non-profit organization.</p>
        
        <p>May God bless you abundantly for your generosity!</p>
        <p>In Christ,<br>The MyPrayerTower Team</p>
    </div>
    <div class="footer">
        <p>MyPrayerTower • www.myprayertower.com</p>
        <p>This email was sent to ${data.email}</p>
    </div>
</body>
</html>
        `;

        return this.sendEmail({
            to: data.email,
            subject: `❤️ Thank You for Your Donation - ${data.orderNumber}`,
            html,
        });
    }

    /**
     * Send Mass celebration notification
     */
    async sendMassCelebrationNotice(data: {
        email: string;
        name: string;
        orderNumber: string;
        intentionFor: string;
        celebrationDate: Date;
        celebrant?: string;
    }): Promise<boolean> {
        const dateStr = data.celebrationDate.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });

        const html = `
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: 'Georgia', serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; }
        .header { background: linear-gradient(135deg, #4CAF50 0%, #388E3C 100%); color: white; padding: 30px; text-align: center; }
        .content { padding: 30px; background: #F1F8E9; }
        .celebration-box { background: white; border: 1px solid #C5E1A5; border-radius: 8px; padding: 25px; margin: 20px 0; text-align: center; }
        .footer { text-align: center; padding: 20px; color: #888; font-size: 12px; }
    </style>
</head>
<body>
    <div class="header">
        <div style="font-size: 36px;">🙏</div>
        <h1 style="margin: 0;">Mass Has Been Celebrated</h1>
    </div>
    <div class="content">
        <p>Dear ${data.name},</p>
        <p>We are pleased to inform you that the Holy Mass for your intention has been celebrated.</p>
        
        <div class="celebration-box">
            <p style="font-size: 18px; color: #388E3C; margin: 0 0 10px 0;">✓ Mass Celebrated</p>
            <p style="font-size: 16px; color: #333; margin: 0;"><strong>${data.intentionFor}</strong></p>
            <p style="color: #666; margin: 10px 0 0 0;">${dateStr}</p>
            ${data.celebrant ? `<p style="color: #888; margin: 5px 0 0 0;">Celebrant: ${data.celebrant}</p>` : ''}
        </div>
        
        <p>We pray that this Mass brings abundant graces and blessings to you and your loved ones.</p>
        
        <p>In Christ,<br>The MyPrayerTower Team</p>
    </div>
    <div class="footer">
        <p>Order: ${data.orderNumber}</p>
        <p>MyPrayerTower • www.myprayertower.com</p>
    </div>
</body>
</html>
        `;

        return this.sendEmail({
            to: data.email,
            subject: `🙏 Mass Celebrated for ${data.intentionFor}`,
            html,
        });
    }

    /**
     * Send subscription welcome email
     */
    async sendSubscriptionWelcome(data: {
        email: string;
        name: string;
        plan: string;
        massesIncluded: number;
    }): Promise<boolean> {
        const planLabels: Record<string, string> = {
            PRAYER_PARTNER: '🙏 Prayer Partner',
            FAMILY_PLAN: '👨‍👩‍👧‍👦 Family Plan',
            PATRON_CIRCLE: '💎 Patron Circle',
        };

        const html = `
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: 'Georgia', serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; }
        .header { background: linear-gradient(135deg, #9C27B0 0%, #7B1FA2 100%); color: white; padding: 30px; text-align: center; }
        .content { padding: 30px; background: #F3E5F5; }
        .benefits { background: white; border-radius: 8px; padding: 20px; margin: 20px 0; }
        .footer { text-align: center; padding: 20px; color: #888; font-size: 12px; }
    </style>
</head>
<body>
    <div class="header">
        <div style="font-size: 36px;">✨</div>
        <h1 style="margin: 0;">Welcome to ${planLabels[data.plan] || data.plan}!</h1>
    </div>
    <div class="content">
        <p>Dear ${data.name},</p>
        <p>Thank you for joining our ${planLabels[data.plan] || data.plan} program! You are now part of a special community of prayer supporters.</p>
        
        <div class="benefits">
            <h3 style="margin-top: 0; color: #7B1FA2;">Your Monthly Benefits:</h3>
            <ul>
                <li>${data.massesIncluded === 999 ? 'Unlimited' : data.massesIncluded} Mass${data.massesIncluded !== 1 ? 'es' : ''} offered monthly for your intentions</li>
                <li>Your name on our Daily Prayer List</li>
                <li>Discounts on all Mass offerings</li>
                <li>Priority intention scheduling</li>
            </ul>
        </div>
        
        <p>To request your monthly Masses, simply visit your dashboard at <a href="https://myprayertower.com/dashboard">myprayertower.com/dashboard</a>.</p>
        
        <p>May God bless you abundantly!</p>
        <p>In Christ,<br>The MyPrayerTower Team</p>
    </div>
    <div class="footer">
        <p>MyPrayerTower • www.myprayertower.com</p>
    </div>
</body>
</html>
        `;

        return this.sendEmail({
            to: data.email,
            subject: `✨ Welcome to ${planLabels[data.plan] || 'MyPrayerTower'}!`,
            html,
        });
    }
}
