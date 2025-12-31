import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

interface ModerationResult {
    approved: boolean;
    flagged: boolean;
    reasons: string[];
    confidence: number;
}

@Injectable()
export class ContentModerationService {
    private readonly logger = new Logger(ContentModerationService.name);

    // Blocked words/phrases (expand as needed)
    private readonly blockedPatterns = [
        // Profanity (basic list - expand for production)
        /\b(damn|hell|crap)\b/gi,
        // Spam patterns
        /\b(click here|buy now|free money|make \$|earn \$)\b/gi,
        // Contact info spam
        /\b\d{10,}\b/g, // Long number sequences
        // URL spam (multiple URLs)
        /(https?:\/\/[^\s]+){2,}/gi,
    ];

    // Suspicious patterns (flag for review, don't auto-reject)
    private readonly flaggedPatterns = [
        /\b(hate|kill|attack|violence)\b/gi,
        /\b(suicide|self-harm)\b/gi,
        /\b(scam|fraud|fake)\b/gi,
    ];

    constructor(private prisma: PrismaService) { }

    async moderateContent(content: string): Promise<ModerationResult> {
        const reasons: string[] = [];
        let flagged = false;

        // Check blocked patterns
        for (const pattern of this.blockedPatterns) {
            if (pattern.test(content)) {
                reasons.push(`Blocked content detected: ${pattern.source}`);
            }
        }

        // Check flagged patterns
        for (const pattern of this.flaggedPatterns) {
            if (pattern.test(content)) {
                flagged = true;
                reasons.push(`Flagged for review: ${pattern.source}`);
            }
        }

        // Check for excessive caps (shouting)
        const upperRatio = (content.match(/[A-Z]/g) || []).length / content.length;
        if (content.length > 20 && upperRatio > 0.7) {
            flagged = true;
            reasons.push('Excessive capitalization');
        }

        // Check for repetitive characters
        if (/(.)\1{4,}/g.test(content)) {
            flagged = true;
            reasons.push('Repetitive characters detected');
        }

        const approved = reasons.filter(r => r.startsWith('Blocked')).length === 0;

        return {
            approved,
            flagged: flagged || !approved,
            reasons,
            confidence: reasons.length === 0 ? 1 : Math.max(0, 1 - (reasons.length * 0.2)),
        };
    }

    async moderatePrayer(prayerId: string) {
        const prayer = await this.prisma.prayerRequest.findUnique({
            where: { id: prayerId }
        });

        if (!prayer) return null;

        const result = await this.moderateContent(`${prayer.title} ${prayer.content}`);

        // Auto-approve clean content, otherwise queue for review
        if (result.approved && !result.flagged) {
            await this.prisma.prayerRequest.update({
                where: { id: prayerId },
                data: {
                    // Assuming there's an approval field
                    // isApproved: true 
                }
            });
            this.logger.log(`Prayer ${prayerId} auto-approved`);
        } else {
            // Add to moderation queue
            this.logger.log(`Prayer ${prayerId} flagged for review: ${result.reasons.join(', ')}`);
        }

        return result;
    }

    async getPendingModeration(limit = 20) {
        // Get prayers that need moderation
        // This assumes we add an 'isApproved' or 'moderationStatus' field
        return this.prisma.prayerRequest.findMany({
            take: limit,
            orderBy: { createdAt: 'desc' },
            include: {
                user: {
                    select: { id: true, displayName: true, email: true }
                }
            }
        });
    }

    async approvePrayer(prayerId: string, moderatorId: string) {
        return this.prisma.prayerRequest.update({
            where: { id: prayerId },
            data: {
                // isApproved: true,
                // moderatedBy: moderatorId,
                // moderatedAt: new Date(),
            }
        });
    }

    async rejectPrayer(prayerId: string, moderatorId: string, reason: string) {
        return this.prisma.prayerRequest.update({
            where: { id: prayerId },
            data: {
                // isApproved: false,
                // moderatedBy: moderatorId,
                // moderatedAt: new Date(),
                // rejectionReason: reason,
            }
        });
    }
}
