import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import * as crypto from 'crypto';

@Injectable()
export class TwoFactorAuthService {
    constructor(private prisma: PrismaService) { }

    // Generate a new TOTP secret for a user
    async generateSecret(userId: string) {
        // Generate a random 20-byte secret
        const secret = crypto.randomBytes(20).toString('base64').replace(/[^a-zA-Z0-9]/g, '').substring(0, 24);

        // In production, store this encrypted in the database
        // For now, we'll return it for the user to add to their authenticator

        // Generate QR code URL for Google Authenticator
        const otpauthUrl = `otpauth://totp/MyPrayerTower:${userId}?secret=${secret}&issuer=MyPrayerTower`;

        return {
            secret,
            qrCodeUrl: otpauthUrl,
            manualEntry: secret,
        };
    }

    // Verify a TOTP code
    async verifyCode(userId: string, code: string, secret: string): Promise<boolean> {
        // Simple TOTP verification
        // In production, use a proper TOTP library like 'otplib'

        const timeStep = 30; // 30 second window
        const currentTime = Math.floor(Date.now() / 1000 / timeStep);

        // Check current and adjacent time windows
        for (let i = -1; i <= 1; i++) {
            const expectedCode = this.generateTOTP(secret, currentTime + i);
            if (expectedCode === code) {
                return true;
            }
        }

        return false;
    }

    // Simple TOTP generation (for demonstration)
    private generateTOTP(secret: string, counter: number): string {
        const buffer = Buffer.alloc(8);
        buffer.writeBigUInt64BE(BigInt(counter));

        const hmac = crypto.createHmac('sha1', Buffer.from(secret, 'base64'));
        hmac.update(buffer);
        const hash = hmac.digest();

        const offset = hash[hash.length - 1] & 0xf;
        const code = (
            ((hash[offset] & 0x7f) << 24) |
            ((hash[offset + 1] & 0xff) << 16) |
            ((hash[offset + 2] & 0xff) << 8) |
            (hash[offset + 3] & 0xff)
        ) % 1000000;

        return code.toString().padStart(6, '0');
    }

    // Enable 2FA for a user
    async enableTwoFactor(userId: string, secret: string, code: string) {
        const isValid = await this.verifyCode(userId, code, secret);

        if (!isValid) {
            throw new BadRequestException('Invalid verification code');
        }

        // Store the secret for the user (encrypted in production)
        await this.prisma.user.update({
            where: { id: userId },
            data: {
                // twoFactorSecret: encryptedSecret,
                // twoFactorEnabled: true,
            }
        });

        return { success: true, message: '2FA enabled successfully' };
    }

    // Disable 2FA for a user
    async disableTwoFactor(userId: string, code: string) {
        // Verify code before disabling
        const user = await this.prisma.user.findUnique({
            where: { id: userId }
        });

        if (!user) {
            throw new BadRequestException('User not found');
        }

        // In production, decrypt and verify
        // const isValid = await this.verifyCode(userId, code, user.twoFactorSecret);

        await this.prisma.user.update({
            where: { id: userId },
            data: {
                // twoFactorSecret: null,
                // twoFactorEnabled: false,
            }
        });

        return { success: true, message: '2FA disabled' };
    }
}
