import { Controller, Get, Post, Body, Param, Req, UseGuards } from '@nestjs/common';
import { PrayerCandleService } from './prayer-candle.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('candles')
export class PrayerCandleController {
    constructor(private candleService: PrayerCandleService) { }

    @Get()
    async getCandleWall() {
        return this.candleService.getCandleWall();
    }

    @Get('stats')
    async getStats() {
        return this.candleService.getCandleStats();
    }

    @Get('colors')
    getColors() {
        return this.candleService.CANDLE_COLORS;
    }

    @UseGuards(JwtAuthGuard)
    @Get('mine')
    async getMyCandles(@Req() req) {
        return this.candleService.getUserCandles(req.user.id);
    }

    @UseGuards(JwtAuthGuard)
    @Post()
    async lightCandle(
        @Req() req,
        @Body() body: { intention: string; color?: 'white' | 'red' | 'blue' | 'gold' },
    ) {
        return this.candleService.lightCandle(req.user.id, body);
    }

    @UseGuards(JwtAuthGuard)
    @Post(':id/pray')
    async prayForCandle(@Req() req, @Param('id') id: string) {
        return this.candleService.prayForCandle(id, req.user.id);
    }
}
