import { Controller, Get } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Controller('ads')
export class AdsController {
    constructor(private prisma: PrismaService) { }

    @Get()
    async getActiveAds() {
        const [ads, matrixSetting] = await Promise.all([
            (this.prisma as any).adContainer.findMany({
                where: { isActive: true },
                select: {
                    sectionKey: true,
                    adType: true,
                    description: true,
                    androidUnitId: true,
                    iosUnitId: true,
                    webUnitId: true,
                }
            }),
            this.prisma.systemSetting.findUnique({
                where: { key: 'ad_placements_matrix' }
            })
        ]);

        return {
            ads,
            placementsMatrix: matrixSetting ? JSON.parse(matrixSetting.value) : {}
        };
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

        // 3. Seed the default Respectful Master Matrix
        const defaultMatrix = {
            "home": { "top": true, "inline": true, "bottom": true },
            "churches": { "top": true, "inline": true, "sidebar": true },
            "saints": { "top": true, "inline": true, "sidebar": true },
            "prayers": { "top": true, "inline": true, "sidebar": true }, // Standard list of prayers (not praying them)
            "bible": { "top": true, "sidebar": true },
            "readings": { "top": true, "sidebar": true },
            "blog": { "top": true, "inline": true, "sidebar": true },
            "prayer-wall": { "bottom": true }, // Sacred space, ONLY bottom allowed
            "memorials": { "top": true, "inline": true, "sidebar": true },
        };

        const existingMatrix = await this.prisma.systemSetting.findUnique({ where: { key: 'ad_placements_matrix' } });
        if (!existingMatrix) {
            await this.prisma.systemSetting.create({
                data: {
                    key: 'ad_placements_matrix',
                    value: JSON.stringify(defaultMatrix),
                    description: 'Matrix governing global ad placements.'
                }
            });
        }

        return { message: `Seeded ${createdCount} new global ad units and configured the Ad Placement Matrix.`, total: ads.length };
    }
}
