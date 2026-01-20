import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../prisma/prisma.service';
import * as crypto from 'crypto';

@Injectable()
export class EmailVerificationService {
    private readonly logger = new Logger(EmailVerificationService.name);

    constructor(
        private prisma: PrismaService,
        private config: ConfigService,
    ) { }

    // Generate a 6-digit OTP
    private generateOTP(): string {
        return crypto.randomInt(100000, 999999).toString();
    }

    // Send verification email
    async sendVerificationEmail(userId: string, email: string) {
        const otp = this.generateOTP();
        const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

        // Store OTP (in production, hash this)
        await this.prisma.user.update({
            where: { id: userId },
            data: {
                // emailVerificationCode: otp,
                // emailVerificationExpires: expiresAt,
            }
        });

        // In production, use SendGrid or similar
        // For now, just log
        this.logger.log(`[EMAIL] Verification code for ${email}: ${otp}`);

        // SendGrid example:
        // await sgMail.send({
        //     to: email,
        //     from: 'noreply@myprayertower.com',
        //     subject: 'Verify your email - MyPrayerTower',
        //     text: `Your verification code is: ${otp}. It expires in 15 minutes.`,
        //     html: `<h2>Email Verification</h2><p>Your code is: <strong>${otp}</strong></p>`,
        // });

        return { success: true, message: 'Verification email sent' };
    }

    // Verify the OTP
    async verifyEmail(userId: string, code: string) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId }
        });

        if (!user) {
            throw new BadRequestException('User not found');
        }

        // In production, check against stored code
        // if (user.emailVerificationCode !== code) {
        //     throw new BadRequestException('Invalid verification code');
        // }
        // if (new Date() > user.emailVerificationExpires) {
        //     throw new BadRequestException('Verification code expired');
        // }

        // Mark email as verified
        await this.prisma.user.update({
            where: { id: userId },
            data: {
                emailVerified: true,
                // emailVerificationCode: null,
                // emailVerificationExpires: null,
            }
        });

        return { success: true, message: 'Email verified successfully' };
    }

    // Check if user's email is verified
    async isEmailVerified(userId: string): Promise<boolean> {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: { emailVerified: true }
        });

        return user?.emailVerified ?? false;
    }

    // Enforce email verification for certain actions
    async requireVerifiedEmail(userId: string) {
        const isVerified = await this.isEmailVerified(userId);

        if (!isVerified) {
            throw new BadRequestException('Email verification required. Please verify your email first.');
        }


        return true;
    }
}
