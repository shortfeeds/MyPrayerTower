import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../prisma/prisma.service';

interface PrayerSuggestion {
    id: string;
    title: string;
    category: string;
    reason: string;
    confidence: number;
}

@Injectable()
export class AiSuggestionsService {
    private readonly logger = new Logger(AiSuggestionsService.name);

    constructor(
        private prisma: PrismaService,
        private configService: ConfigService,
    ) { }

    /**
     * Get personalized prayer suggestions based on user history
     */
    async getPersonalizedPrayers(userId: string, limit = 5): Promise<PrayerSuggestion[]> {
        // Get user's prayer history
        const userHistory = await this.prisma.prayerRequest.findMany({
            where: { userId },
            select: { category: true, content: true },
            take: 50,
            orderBy: { createdAt: 'desc' },
        });

        // Analyze user preferences
        const categoryCount: Record<string, number> = {};
        for (const prayer of userHistory) {
            if (prayer.category) {
                categoryCount[prayer.category] = (categoryCount[prayer.category] || 0) + 1;
            }
        }

        // Get top categories
        const topCategories = Object.entries(categoryCount)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 3)
            .map(([cat]) => cat);

        // Fetch prayers from library matching user preferences
        const suggestions = await this.prisma.prayer.findMany({
            where: {
                isPublished: true,
                OR: topCategories.length > 0
                    ? topCategories.map(cat => ({
                        category: { name: { contains: cat, mode: 'insensitive' as const } }
                    }))
                    : undefined,
            },
            include: { category: true },
            take: limit * 2,
            orderBy: { viewCount: 'desc' },
        });

        // Score and rank suggestions
        return suggestions
            .map(prayer => ({
                id: prayer.id,
                title: prayer.title,
                category: prayer.category?.name || 'General',
                reason: this.generateReason(prayer.category?.name || '', topCategories),
                confidence: this.calculateConfidence(prayer.category?.name || '', categoryCount),
            }))
            .sort((a, b) => b.confidence - a.confidence)
            .slice(0, limit);
    }

    /**
     * Get today's recommended prayer based on liturgical calendar
     */
    async getDailyRecommendation(): Promise<PrayerSuggestion | null> {
        const today = new Date();
        const month = today.getMonth() + 1;
        const day = today.getDate();

        // Check for saint's feast day
        const saint = await this.prisma.saint.findFirst({
            where: {
                feastMonth: month,
                feastDay: day,
            },
        });

        if (saint) {
            return {
                id: `saint-${saint.id}`,
                title: `Prayer to ${saint.name}`,
                category: 'Saints',
                reason: `Today is the feast of ${saint.name}`,
                confidence: 0.95,
            };
        }

        // Default to popular prayer
        const popular = await this.prisma.prayer.findFirst({
            where: { isPublished: true },
            orderBy: { viewCount: 'desc' },
            include: { category: true },
        });

        if (popular) {
            return {
                id: popular.id,
                title: popular.title,
                category: popular.category?.name || 'General',
                reason: 'Most popular prayer in our library',
                confidence: 0.7,
            };
        }

        return null;
    }

    /**
     * Smart categorization of prayer content
     */
    async categorizeContent(content: string): Promise<{ category: string; confidence: number }> {
        const keywords: Record<string, string[]> = {
            health: ['health', 'healing', 'sick', 'hospital', 'surgery', 'doctor', 'illness', 'pain', 'recovery'],
            family: ['family', 'children', 'parents', 'marriage', 'spouse', 'kids', 'mother', 'father', 'son', 'daughter'],
            work: ['job', 'work', 'career', 'employment', 'business', 'coworkers', 'boss', 'promotion'],
            finances: ['money', 'financial', 'debt', 'bills', 'income', 'afford', 'poverty'],
            relationships: ['relationship', 'friend', 'love', 'reconciliation', 'forgiveness', 'conflict'],
            spiritual: ['faith', 'spiritual', 'god', 'prayer', 'church', 'soul', 'grace', 'blessing'],
            thanksgiving: ['thank', 'grateful', 'blessed', 'answered', 'miracle', 'praise'],
        };

        const lowerContent = content.toLowerCase();
        const scores: Record<string, number> = {};

        for (const [category, words] of Object.entries(keywords)) {
            scores[category] = words.reduce((score, word) => {
                return score + (lowerContent.includes(word) ? 1 : 0);
            }, 0);
        }

        const topCategory = Object.entries(scores)
            .sort((a, b) => b[1] - a[1])[0];

        return {
            category: topCategory[1] > 0 ? topCategory[0] : 'other',
            confidence: topCategory[1] > 0 ? Math.min(topCategory[1] / 3, 1) : 0.5,
        };
    }

    /**
     * Generate similar prayer suggestions
     */
    async getSimilarPrayers(prayerId: string, limit = 5) {
        const prayer = await this.prisma.prayer.findUnique({
            where: { id: prayerId },
            include: { category: true },
        });

        if (!prayer) return [];

        return this.prisma.prayer.findMany({
            where: {
                id: { not: prayerId },
                categoryId: prayer.categoryId,
                isPublished: true,
            },
            take: limit,
            orderBy: { viewCount: 'desc' },
        });
    }

    private generateReason(category: string, userCategories: string[]): string {
        if (userCategories.includes(category)) {
            return `Based on your frequent ${category} prayers`;
        }
        return 'Popular in our community';
    }

    private calculateConfidence(category: string, categoryCount: Record<string, number>): number {
        const count = categoryCount[category] || 0;
        const total = Object.values(categoryCount).reduce((a, b) => a + b, 1);
        return Math.min(0.5 + (count / total) * 0.5, 0.95);
    }
}
