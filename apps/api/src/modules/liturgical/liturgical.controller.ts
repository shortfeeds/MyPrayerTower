import { Controller, Get, Query } from '@nestjs/common';
import { LiturgicalCalendarService } from './liturgical-calendar.service';

@Controller('liturgical')
export class LiturgicalController {
    constructor(private readonly liturgicalService: LiturgicalCalendarService) { }

    @Get('today')
    async getTodaysLiturgy() {
        return this.liturgicalService.getTodaysLiturgy();
    }

    @Get('week')
    async getWeekLiturgy(@Query('start') startDate?: string) {
        const start = startDate ? new Date(startDate) : new Date();
        return this.liturgicalService.getWeekLiturgy(start);
    }

    @Get('month')
    async getMonthFeastDays(
        @Query('year') year?: string,
        @Query('month') month?: string
    ) {
        const now = new Date();
        const y = year ? parseInt(year) : now.getFullYear();
        const m = month ? parseInt(month) : now.getMonth() + 1;
        return this.liturgicalService.getMonthFeastDays(y, m);
    }

    @Get('day')
    async getSpecificDay(@Query('date') dateStr: string) {
        const date = new Date(dateStr);
        return this.liturgicalService.getLiturgicalDay(date);
    }
}
