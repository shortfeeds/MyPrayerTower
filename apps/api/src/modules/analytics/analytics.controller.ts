import { Controller, Get, UseGuards, Query } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';

@Controller('analytics')
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
