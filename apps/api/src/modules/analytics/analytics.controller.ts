import { Controller, Get, UseGuards, Query } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { RolesGuard } from '../../guards/roles.guard';
import { Roles } from '../../decorators/roles.decorator';
import { Role } from '@prisma/client';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('analytics')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN, Role.SUPER_ADMIN)
export class AnalyticsController {
    constructor(private readonly analyticsService: AnalyticsService) { }

    @Get('stats')
    async getPlatformStats() {
        return this.analyticsService.getPlatformStats();
    }

    @Get('heatmap')
    async getPrayerHeatmap(@Query('days') days?: string) {
        return this.analyticsService.getPrayerHeatmap(days ? parseInt(days) : 30);
    }

    @Get('categories')
    async getTopCategories() {
        return this.analyticsService.getTopCategories();
    }

    @Get('geo')
    async getGeographicDistribution() {
        return this.analyticsService.getGeographicDistribution();
    }

    @Get('engagement')
    async getUserEngagement() {
        return this.analyticsService.getUserEngagement();
    }

    @Get('revenue')
    async getRevenueAnalytics(@Query('startDate') startDate?: string, @Query('endDate') endDate?: string) {
        return this.analyticsService.getRevenueAnalytics(
            startDate ? new Date(startDate) : undefined,
            endDate ? new Date(endDate) : undefined
        );
    }
}
