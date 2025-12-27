import { Controller, Get, Param, Query } from '@nestjs/common';
import { PrayersService } from './prayers.service';

@Controller('prayers')
export class PrayersController {
    constructor(private prayersService: PrayersService) { }

    @Get('categories')
    async getCategories() {
        return this.prayersService.getCategories();
    }

    @Get('category/:slug')
    async getPrayersByCategory(
        @Param('slug') slug: string,
        @Query('page') page?: string,
        @Query('limit') limit?: string,
    ) {
        return this.prayersService.getPrayersByCategory(
            slug,
            page ? parseInt(page) : 1,
            limit ? parseInt(limit) : 20,
        );
    }

    @Get('search')
    async searchPrayers(@Query('q') q: string, @Query('limit') limit?: string) {
        return this.prayersService.searchPrayers(q, limit ? parseInt(limit) : 20);
    }

    @Get(':slug')
    async getPrayer(@Param('slug') slug: string) {
        return this.prayersService.getPrayerBySlug(slug);
    }
}
