import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

export interface PrayerCandle {
    id: string;
    userId: string;
    userName: string;
    intention: string;
    litAt: Date;
    expiresAt: Date;
    color: 'white' | 'red' | 'blue' | 'gold';
}

@Injectable()
export class PrayerCandleService {
    // Candle colors and meanings
    readonly CANDLE_COLORS = {
        white: { name: 'White', meaning: 'Purity, Peace, General Intentions', duration: 24, durationEnum: 'ONE_DAY', amount: 1000 },
        red: { name: 'Red', meaning: 'Holy Spirit, Healing, Love', duration: 48, durationEnum: 'THREE_DAYS', amount: 1000 },
        blue: { name: 'Blue', meaning: 'Blessed Mother, Protection', duration: 72, durationEnum: 'THREE_DAYS', amount: 1000 },
        gold: { name: 'Gold', meaning: 'Saints, Thanksgiving', duration: 168, durationEnum: 'SEVEN_DAYS', amount: 2500 }, // Premium price for gold
    };

    constructor(private prisma: PrismaService) { }

    /**
     * Light a virtual prayer candle
     */
    async lightCandle(
        userId: string,
        data: { intention: string; color?: 'white' | 'red' | 'blue' | 'gold' }
    ) {
        const color = data.color || 'white';
        const duration = this.CANDLE_COLORS[color].duration;
        const expiresAt = new Date(Date.now() + duration * 60 * 60 * 1000);

        const candle = await this.prisma.prayerCandle.create({
            data: {
                userId,
                intention: data.intention,
                color,
                amount: this.CANDLE_COLORS[color].amount,
                duration: this.CANDLE_COLORS[color].durationEnum as any,
                expiresAt,
            },
            include: {
                creator: { select: { firstName: true, lastName: true } },
            },
        });

        const candleResult = candle as any;

        return {
            ...candleResult,
            userName: candleResult.creator ? `${candleResult.creator.firstName} ${candleResult.creator.lastName?.charAt(0) || ''}.` : 'Anonymous',
            colorInfo: this.CANDLE_COLORS[color],
        };
    }

    /**
     * Get active candle wall
     */
    async getCandleWall(limit = 100) {
        const candles = await this.prisma.prayerCandle.findMany({
            where: {
                expiresAt: { gt: new Date() },
            },
            include: {
                creator: { select: { firstName: true, lastName: true } },
            },
            orderBy: { createdAt: 'desc' },
            take: limit,
        });

        return (candles as any[]).map(candle => ({
            id: candle.id,
            userName: candle.creator ? `${candle.creator.firstName} ${candle.creator.lastName?.charAt(0) || ''}.` : 'Anonymous',
            intention: candle.intention,
            color: candle.color,
            litAt: candle.createdAt,
            expiresAt: candle.expiresAt,
            remainingHours: Math.max(0, Math.ceil((candle.expiresAt.getTime() - Date.now()) / (1000 * 60 * 60))),
        }));
    }

    /**
     * Get user's active candles
     */
    async getUserCandles(userId: string) {
        return this.prisma.prayerCandle.findMany({
            where: {
                userId,
                expiresAt: { gt: new Date() },
            },
            orderBy: { createdAt: 'desc' },
        });
    }

    /**
     * Pray for someone's candle
     */
    async prayForCandle(candleId: string, userId: string) {
        const existing = await this.prisma.candlePrayer.findFirst({
            where: { candleId, userId },
        });

        if (existing) {
            return { alreadyPrayed: true };
        }

        await this.prisma.candlePrayer.create({
            data: { candleId, userId },
        });

        // Extend candle by 1 hour per prayer (max 48 hours extra)
        const candle = await this.prisma.prayerCandle.findUnique({
            where: { id: candleId },
        });

        if (candle) {
            const newExpiry = new Date(candle.expiresAt.getTime() + 60 * 60 * 1000);
            const maxExpiry = new Date(candle.createdAt.getTime() + (168 + 48) * 60 * 60 * 1000);

            await this.prisma.prayerCandle.update({
                where: { id: candleId },
                data: {
                    expiresAt: newExpiry < maxExpiry ? newExpiry : maxExpiry,
                    prayerCount: { increment: 1 },
                },
            });
        }

        return { success: true };
    }

    /**
     * Get candle statistics
     */
    async getCandleStats() {
        const [total, active, totalPrayers] = await Promise.all([
            this.prisma.prayerCandle.count(),
            this.prisma.prayerCandle.count({ where: { expiresAt: { gt: new Date() } } }),
            this.prisma.candlePrayer.count(),
        ]);

        return { total, active, totalPrayers };
    }
}
