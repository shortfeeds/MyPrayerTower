import { Controller, Get } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

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
                platforms: true,
            }
        });
    }
}
