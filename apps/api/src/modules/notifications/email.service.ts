import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as sgMail from '@sendgrid/mail';

export interface EmailOptions {
    to: string;
    subject: string;
    text?: string;
    html?: string;
    templateId?: string;
    dynamicData?: Record<string, any>;
}

@Injectable()
export class EmailService {
    private readonly logger = new Logger(EmailService.name);
    private isConfigured = false;
    private fromEmail: string;
    private fromName: string;

    constructor(private configService: ConfigService) {
        const apiKey = this.configService.get('SENDGRID_API_KEY');
        this.fromEmail = this.configService.get('FROM_EMAIL') || 'noreply@myprayertower.com';
        this.fromName = this.configService.get('FROM_NAME') || 'MyPrayerTower';

        if (apiKey) {
            sgMail.setApiKey(apiKey);
            this.isConfigured = true;
            this.logger.log('SendGrid initialized successfully');
        } else {
            this.logger.warn('SendGrid API key not configured - emails disabled');
        }
    }

    /**
     * Send a basic email
     */
    async send(options: EmailOptions): Promise<boolean> {
        if (!this.isConfigured) {
            this.logger.warn('Email not configured - skipping send');
            return false;
        }

        try {
            const msg: sgMail.MailDataRequired = {
                to: options.to,
                from: { email: this.fromEmail, name: this.fromName },
                subject: options.subject,
                text: options.text,
                html: options.html,
            };

            if (options.templateId) {
                msg.templateId = options.templateId;
                msg.dynamicTemplateData = options.dynamicData;
            }

            await sgMail.send(msg);
            this.logger.log(`Email sent to ${options.to}: ${options.subject}`);
            return true;
        } catch (error: any) {
            this.logger.error(`Failed to send email: ${error.message}`);
            return false;
        }
    }

    // ============ Specific Email Templates ============

    /**
     * Welcome email for new users
     */
    async sendWelcome(email: string, firstName: string) {
        return this.send({
            to: email,
            subject: 'Welcome to MyPrayerTower! 🙏',
            html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #0c4a6e 0%, #0369a1 100%); padding: 40px; text-align: center;">
            <h1 style="color: white; margin: 0;">Welcome to MyPrayerTower</h1>
          </div>
          <div style="padding: 40px; background: #f9fafb;">
            <p style="font-size: 18px; color: #333;">Hi ${firstName},</p>
            <p style="color: #555; line-height: 1.6;">Thank you for joining our prayer community! We're excited to have you.</p>
            <p style="color: #555; line-height: 1.6;">With MyPrayerTower, you can:</p>
            <ul style="color: #555; line-height: 1.8;">
              <li>Find Catholic churches worldwide</li>
              <li>Share and receive prayers on our Prayer Wall</li>
              <li>Access 2,000+ traditional prayers</li>
              <li>Discover daily saints and readings</li>
            </ul>
            <div style="text-align: center; margin: 30px 0;">
              <a href="https://myprayertower.com" style="background: #0ea5e9; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: bold;">Start Exploring</a>
            </div>
            <p style="color: #888; font-size: 14px;">God bless,<br>The MyPrayerTower Team</p>
          </div>
        </div>
      `,
        });
    }

    /**
     * OTP verification email
     */
    async sendOtp(email: string, otp: string, purpose: 'church_claim' | 'password_reset') {
        const titles = {
            church_claim: 'Verify Your Church Claim',
            password_reset: 'Reset Your Password',
        };

        return this.send({
            to: email,
            subject: `${titles[purpose]} - MyPrayerTower`,
            html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #0c4a6e 0%, #0369a1 100%); padding: 40px; text-align: center;">
            <h1 style="color: white; margin: 0;">Verification Code</h1>
          </div>
          <div style="padding: 40px; background: #f9fafb; text-align: center;">
            <p style="color: #555; font-size: 16px;">Your verification code is:</p>
            <div style="background: white; border: 2px dashed #0ea5e9; padding: 20px; margin: 20px 0; border-radius: 8px;">
              <span style="font-size: 36px; font-weight: bold; letter-spacing: 8px; color: #0c4a6e;">${otp}</span>
            </div>
            <p style="color: #888; font-size: 14px;">This code expires in 15 minutes.</p>
            <p style="color: #888; font-size: 14px;">If you didn't request this, please ignore this email.</p>
          </div>
        </div>
      `,
        });
    }

    /**
     * Prayer approved notification
     */
    async sendPrayerApproved(email: string, firstName: string, prayerContent: string) {
        return this.send({
            to: email,
            subject: '✅ Your Prayer Request is Live - MyPrayerTower',
            html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #0c4a6e 0%, #0369a1 100%); padding: 40px; text-align: center;">
            <h1 style="color: white; margin: 0;">Prayer Published</h1>
          </div>
          <div style="padding: 40px; background: #f9fafb;">
            <p style="font-size: 18px; color: #333;">Hi ${firstName},</p>
            <p style="color: #555; line-height: 1.6;">Great news! Your prayer request has been approved and is now visible on the Prayer Wall.</p>
            <div style="background: white; padding: 20px; border-left: 4px solid #0ea5e9; margin: 20px 0; border-radius: 4px;">
              <p style="color: #333; font-style: italic; margin: 0;">"${prayerContent.substring(0, 100)}..."</p>
            </div>
            <p style="color: #555; line-height: 1.6;">People around the world are now able to pray for your intention. 🙏</p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="https://myprayertower.com/prayer-wall" style="background: #0ea5e9; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: bold;">View Prayer Wall</a>
            </div>
          </div>
        </div>
      `,
        });
    }

    /**
     * Weekly digest email
     */
    async sendWeeklyDigest(email: string, firstName: string, stats: { prayerCount: number; newChurches: number }) {
        return this.send({
            to: email,
            subject: '📊 Your Weekly Prayer Update - MyPrayerTower',
            html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #0c4a6e 0%, #0369a1 100%); padding: 40px; text-align: center;">
            <h1 style="color: white; margin: 0;">Weekly Update</h1>
          </div>
          <div style="padding: 40px; background: #f9fafb;">
            <p style="font-size: 18px; color: #333;">Hi ${firstName},</p>
            <p style="color: #555; line-height: 1.6;">Here's what happened this week on MyPrayerTower:</p>
            <div style="display: flex; gap: 20px; margin: 30px 0;">
              <div style="flex: 1; background: white; padding: 20px; text-align: center; border-radius: 8px;">
                <p style="font-size: 32px; font-weight: bold; color: #0ea5e9; margin: 0;">${stats.prayerCount}</p>
                <p style="color: #888; margin: 5px 0 0;">People prayed</p>
              </div>
              <div style="flex: 1; background: white; padding: 20px; text-align: center; border-radius: 8px;">
                <p style="font-size: 32px; font-weight: bold; color: #0ea5e9; margin: 0;">${stats.newChurches}</p>
                <p style="color: #888; margin: 5px 0 0;">New churches</p>
              </div>
            </div>
            <div style="text-align: center;">
              <a href="https://myprayertower.com" style="background: #0ea5e9; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: bold;">Visit MyPrayerTower</a>
            </div>
          </div>
        </div>
      `,
        });
    }
}
