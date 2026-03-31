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
            { sectionKey: 'HOME_TOP_BANNER', description: 'Top banner on the home page', adType: 'BANNER' },
            { sectionKey: 'ARTICLE_LIST_NATIVE', description: 'Native ad in article lists', adType: 'NATIVE' },
            { sectionKey: 'ARTICLE_DETAIL_BOTTOM', description: 'Banner at the bottom of blog articles', adType: 'BANNER' },
            { sectionKey: 'PRAYER_WALL_BANNER', description: 'Banner at the top of the Prayer Wall', adType: 'BANNER' },
            { sectionKey: 'BIBLE_READING_BOTTOM', description: 'Banner at the bottom of Bible reading pages', adType: 'BANNER' },
            { sectionKey: 'DAILY_READING_BOTTOM', description: 'Banner at the bottom of Daily Readings', adType: 'BANNER' },
            { sectionKey: 'CHURCH_LIST_NATIVE', description: 'Native ad in the Church directory list', adType: 'NATIVE' },
            { sectionKey: 'CATECHISM_SIDEBAR', description: 'Sidebar ad in the Catechism section', adType: 'BANNER' },
            { sectionKey: 'PRAYER_SUBMIT_INTERSTITIAL', description: 'Full-screen ad after submitting a prayer (TWA Only)', adType: 'INTERSTITIAL' }
        ];

        let createdCount = 0;
        for (const ad of ads) {
            const existing = await (this.prisma as any).adContainer.findUnique({ where: { sectionKey: ad.sectionKey } });
            if (!existing) {
                await (this.prisma as any).adContainer.create({ data: { ...ad, isActive: true } });
                createdCount++;
            }
        }

        return { message: `Seeded ${createdCount} new ad units.`, total: ads.length };
    }
}
