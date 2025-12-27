import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { ClaimStatus } from '@prisma/client';

@Injectable()
export class ClaimsService {
    constructor(private prisma: PrismaService) { }

    // Start a claim for a church
    async startClaim(
        userId: string,
        churchId: string,
        data: {
            claimantName: string;
            claimantTitle: string;
            claimantEmail: string;
            claimantPhone: string;
        },
    ) {
        // Check church exists
        const church = await this.prisma.church.findUnique({ where: { id: churchId } });
        if (!church) {
            throw new NotFoundException('Church not found');
        }

        // Check if already verified
        if (church.isVerified) {
            throw new BadRequestException('Church is already verified');
        }

        // Check for existing pending claims
        const existingClaim = await this.prisma.churchClaim.findFirst({
            where: {
                churchId,
                status: { in: [ClaimStatus.PENDING, ClaimStatus.EMAIL_VERIFIED, ClaimStatus.SMS_VERIFIED, ClaimStatus.DOCUMENTS_SUBMITTED, ClaimStatus.UNDER_REVIEW] },
            },
        });

        if (existingClaim) {
            throw new BadRequestException('A claim for this church is already pending');
        }

        // Generate OTPs
        const emailOtp = this.generateOtp();
        const smsOtp = this.generateOtp();
        const otpExpiry = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

        // Create claim
        const claim = await this.prisma.churchClaim.create({
            data: {
                churchId,
                userId,
                claimantName: data.claimantName,
                claimantTitle: data.claimantTitle,
                claimantEmail: data.claimantEmail,
                claimantPhone: data.claimantPhone,
                emailOtp,
                emailOtpExpires: otpExpiry,
                smsOtp,
                smsOtpExpires: otpExpiry,
            },
        });

        // TODO: Send email OTP via SendGrid
        // TODO: Send SMS OTP via Twilio

        return {
            claimId: claim.id,
            claimCode: claim.claimCode,
            message: 'Verification codes sent to email and phone',
        };
    }

    // Verify email OTP
    async verifyEmailOtp(claimId: string, otp: string) {
        const claim = await this.prisma.churchClaim.findUnique({ where: { id: claimId } });

        if (!claim) {
            throw new NotFoundException('Claim not found');
        }

        if (claim.emailVerified) {
            return { success: true, message: 'Email already verified' };
        }

        if (!claim.emailOtp || !claim.emailOtpExpires || claim.emailOtpExpires < new Date()) {
            throw new BadRequestException('OTP expired');
        }

        if (claim.emailOtp !== otp) {
            throw new BadRequestException('Invalid OTP');
        }

        await this.prisma.churchClaim.update({
            where: { id: claimId },
            data: {
                emailVerified: true,
                emailVerifiedAt: new Date(),
                status: ClaimStatus.EMAIL_VERIFIED,
                emailOtp: null,
            },
        });

        return { success: true, message: 'Email verified' };
    }

    // Verify SMS OTP
    async verifySmsOtp(claimId: string, otp: string) {
        const claim = await this.prisma.churchClaim.findUnique({ where: { id: claimId } });

        if (!claim) {
            throw new NotFoundException('Claim not found');
        }

        if (!claim.emailVerified) {
            throw new BadRequestException('Email must be verified first');
        }

        if (claim.smsVerified) {
            return { success: true, message: 'Phone already verified' };
        }

        if (!claim.smsOtp || !claim.smsOtpExpires || claim.smsOtpExpires < new Date()) {
            throw new BadRequestException('OTP expired');
        }

        if (claim.smsOtp !== otp) {
            throw new BadRequestException('Invalid OTP');
        }

        await this.prisma.churchClaim.update({
            where: { id: claimId },
            data: {
                smsVerified: true,
                smsVerifiedAt: new Date(),
                status: ClaimStatus.SMS_VERIFIED,
                smsOtp: null,
            },
        });

        return { success: true, message: 'Phone verified. Please submit documents to verify@myprayertower.com' };
    }

    // Mark documents as submitted
    async markDocumentsSubmitted(claimId: string) {
        const claim = await this.prisma.churchClaim.findUnique({ where: { id: claimId } });

        if (!claim) {
            throw new NotFoundException('Claim not found');
        }

        if (!claim.emailVerified || !claim.smsVerified) {
            throw new BadRequestException('Email and phone must be verified first');
        }

        await this.prisma.churchClaim.update({
            where: { id: claimId },
            data: {
                documentsSubmitted: true,
                status: ClaimStatus.DOCUMENTS_SUBMITTED,
            },
        });

        return { success: true, message: 'Documents marked as submitted. Our team will review within 2-3 business days.' };
    }

    // Get claim status
    async getClaimStatus(claimId: string, userId: string) {
        const claim = await this.prisma.churchClaim.findFirst({
            where: { id: claimId, userId },
            include: { church: true },
        });

        if (!claim) {
            throw new NotFoundException('Claim not found');
        }

        return claim;
    }

    // Get user's claims
    async getUserClaims(userId: string) {
        return this.prisma.churchClaim.findMany({
            where: { userId },
            include: { church: true },
            orderBy: { createdAt: 'desc' },
        });
    }

    private generateOtp(): string {
        return Math.floor(100000 + Math.random() * 900000).toString();
    }
}
