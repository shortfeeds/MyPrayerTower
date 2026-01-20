import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class DevotionalsService {
    private readonly logger = new Logger(DevotionalsService.name);

    constructor(private prisma: PrismaService) { }

    /**
     * Get today's devotional
     */
    async getTodaysDevotional() {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Try to get pre-scheduled devotional
        let devotional = await this.prisma.dailyDevotional.findFirst({
            where: {
                publishDate: today,
                isPublished: true,
            },
        });

        if (!devotional) {
            // Generate from saint of the day
            devotional = await this.generateDevotionalFromSaint(today);
        }

        return devotional;
    }

    /**
     * Get devotional by date
     */
    async getDevotionalByDate(date: Date) {
        return this.prisma.dailyDevotional.findFirst({
            where: {
                publishDate: date,
                isPublished: true,
            },
        });
    }

    /**
     * Get devotional archive
     */
    async getArchive(page = 1, limit = 30) {
        const skip = (page - 1) * limit;

        const [devotionals, total] = await Promise.all([
            this.prisma.dailyDevotional.findMany({
                where: { isPublished: true, publishDate: { lt: new Date() } },
                skip,
                take: limit,
                orderBy: { publishDate: 'desc' },
            }),
            this.prisma.dailyDevotional.count({
                where: { isPublished: true, publishDate: { lt: new Date() } },
            }),
        ]);

        return { devotionals, total, page, totalPages: Math.ceil(total / limit) };
    }

    /**
     * Create/update devotional (admin)
     */
    async upsertDevotional(data: {
        id?: string;
        date: Date;
        title: string;
        scripture: string;
        scriptureReference: string;
        reflection: string;
        prayer: string;
        audioUrl?: string;
    }) {
        return this.prisma.dailyDevotional.upsert({
            where: { id: data.id || '' },
            create: {
                publishDate: data.date,
                title: data.title,
                scripture: data.scripture,
                scriptureReference: data.scriptureReference,
                reflection: data.reflection,
                closingPrayer: data.prayer,
                audioUrl: data.audioUrl,
                isPublished: true,
            },
            update: {
                title: data.title,
                scripture: data.scripture,
                scriptureReference: data.scriptureReference,
                reflection: data.reflection,
                closingPrayer: data.prayer,
                audioUrl: data.audioUrl,
            },
        });
    }

    /**
     * Generate devotional from saint
     */
    private async generateDevotionalFromSaint(date: Date) {
        const month = date.getMonth() + 1;
        const day = date.getDate();

        const saint = await this.prisma.saint.findFirst({
            where: { feastMonth: month, feastDayOfMonth: day },
        });

        if (!saint) {
            // Return a generic devotional
            return {
                id: `auto-${date.toISOString()}`,
                title: 'Daily Reflection',
                scripture: 'Trust in the Lord with all your heart and lean not on your own understanding.',
                scriptureReference: 'Proverbs 3:5',
                reflection: 'Let us begin this day by placing our trust in God, knowing that He guides our steps.',
                closingPrayer: 'Lord, guide me through this day. Help me to trust in Your plan. Amen.',
                publishDate: date,
            } as any;
        }

        return {
            id: `saint-${saint.id}`,
            title: `Feast of ${saint.name}`,
            scripture: saint.patronOf?.join(', ') || 'Saints show us the path to holiness.',
            scriptureReference: 'See also: Hebrews 12:1',
            reflection: saint.biography?.substring(0, 500) || `Today we celebrate ${saint.name}.`,
            closingPrayer: `Saint ${saint.name}, pray for us that we may follow your example of faith. Amen.`,
            publishDate: date,
            saint: {
                id: saint.id,
                name: saint.name,
                feastDay: `${saint.feastMonth}/${saint.feastDayOfMonth}`,
            },
        } as any;
    }

    /**
     * Send morning devotional notifications
     */
    @Cron('0 6 * * *') // 6 AM daily
    async sendMorningDevotional() {
        this.logger.log('Sending morning devotional notifications');
        // TODO: Integrate with push notification service
    }
}
