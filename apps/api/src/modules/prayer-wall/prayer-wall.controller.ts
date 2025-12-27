import { Controller, Get, Post, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { PrayerWallService } from './prayer-wall.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('prayer-wall')
export class PrayerWallController {
    constructor(private prayerWallService: PrayerWallService) { }

    // Public - get prayer wall
    @Get()
    async getPublicPrayers(
        @Query('page') page?: string,
        @Query('limit') limit?: string,
        @Query('category') category?: string,
    ) {
        return this.prayerWallService.getPublicPrayers({
            page: page ? parseInt(page) : 1,
            limit: limit ? parseInt(limit) : 20,
            category,
        });
    }

    // Public - get answered prayers (testimonies)
    @Get('answered')
    async getAnsweredPrayers(@Query('limit') limit?: string) {
        return this.prayerWallService.getAnsweredPrayers(limit ? parseInt(limit) : 10);
    }

    // Auth required - submit prayer request
    @UseGuards(JwtAuthGuard)
    @Post('submit')
    async submitPrayerRequest(
        @Request() req,
        @Body() data: {
            title?: string;
            content: string;
            category: string;
            visibility: string;
            churchId?: string;
        },
    ) {
        return this.prayerWallService.submitPrayerRequest(req.user.id, data);
    }

    // Auth required - pray for someone
    @UseGuards(JwtAuthGuard)
    @Post(':id/pray')
    async prayForRequest(@Request() req, @Param('id') id: string) {
        return this.prayerWallService.prayForRequest(req.user.id, id);
    }

    // Auth required - mark as answered
    @UseGuards(JwtAuthGuard)
    @Post(':id/answered')
    async markAnswered(
        @Request() req,
        @Param('id') id: string,
        @Body('testimony') testimony?: string,
    ) {
        return this.prayerWallService.markAnswered(req.user.id, id, testimony);
    }

    // Auth required - get my prayers
    @UseGuards(JwtAuthGuard)
    @Get('my-prayers')
    async getMyPrayers(@Request() req) {
        return this.prayerWallService.getUserPrayers(req.user.id);
    }
}
