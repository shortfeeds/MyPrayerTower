import { Controller, Get } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Controller('ads')
export class AdsController {
    constructor(private prisma: PrismaService) { }

    @Get()
    async getActiveAds() {
        return (this.prisma as any).adContainer.findMany({
            where: { isActive: true },
            select: {
                sectionKey: true,
                adType: true,
                description: true,
                androidUnitId: true,
                iosUnitId: true,
                webUnitId: true,
            }
        });
    }
    @Get('seed')
    async seedAds() {
        const ads = [
            { sectionKey: 'GLOBAL_BANNER', description: 'Standard banner ads (Top, Bottom, Sidebar)', adType: 'BANNER' },
            { sectionKey: 'GLOBAL_NATIVE', description: 'Native inline ads (Article feeds, Lists)', adType: 'NATIVE' },
            { sectionKey: 'GLOBAL_INTERSTITIAL', description: 'Full-screen transitions (e.g. Prayer Submission - TWA only)', adType: 'INTERSTITIAL' }
        ];

        // Delete old keys to clean up admin panel
        const oldKeys = [
            'HOME_TOP_BANNER', 'ARTICLE_LIST_NATIVE', 'ARTICLE_DETAIL_BOTTOM',
            'PRAYER_WALL_BANNER', 'BIBLE_READING_BOTTOM', 'DAILY_READING_BOTTOM',
            'CHURCH_LIST_NATIVE', 'CATECHISM_SIDEBAR', 'PRAYER_SUBMIT_INTERSTITIAL'
        ];
        
        await (this.prisma as any).adContainer.deleteMany({
            where: { sectionKey: { in: oldKeys } }
        });

        let createdCount = 0;
        for (const ad of ads) {
            const existing = await (this.prisma as any).adContainer.findUnique({ where: { sectionKey: ad.sectionKey } });
            if (!existing) {
                await (this.prisma as any).adContainer.create({ data: { ...ad, isActive: true } });
                createdCount++;
            }
        }

        return { message: `Seeded ${createdCount} new global ad units. Old temporary templates removed.`, total: ads.length };
    }
}
