import { Controller, Get, Post, Req, Query, UseGuards } from '@nestjs/common';
import { GamificationService } from './gamification.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('gamification')
export class GamificationController {
    constructor(private gamificationService: GamificationService) { }

    @UseGuards(JwtAuthGuard)
    @Get('stats')
    async getMyStats(@Req() req) {
        return this.gamificationService.getUserStats(req.user.id);
    }

    @UseGuards(JwtAuthGuard)
    @Get('badges')
    async getAvailableBadges() {
        return this.gamificationService.BADGES;
    }

    @Get('leaderboard')
    async getLeaderboard(
        @Query('type') type: 'streak' | 'prayers' | 'community' = 'streak',
        @Query('limit') limit: string = '50',
    ) {
        return this.gamificationService.getLeaderboard(type, parseInt(limit));
    }
}
