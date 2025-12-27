import { Controller, Get, Param, Query } from '@nestjs/common';
import { SaintsService } from './saints.service';

@Controller('saints')
export class SaintsController {
    constructor(private saintsService: SaintsService) { }

    @Get('today')
    async getTodaysSaint() {
        return this.saintsService.getTodaysSaint();
    }

    @Get('month/:month')
    async getSaintsByMonth(@Param('month') month: string) {
        return this.saintsService.getSaintsByMonth(parseInt(month));
    }

    @Get('search')
    async searchSaints(@Query('q') q: string) {
        return this.saintsService.searchSaints(q);
    }

    @Get(':slug')
    async getSaint(@Param('slug') slug: string) {
        return this.saintsService.getSaintBySlug(slug);
    }
}
