import { Controller, Get, Post, Put, Delete, Patch, Param, Body, Query, Request, UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('admin')
@UseGuards(JwtAuthGuard)
export class AdminController {
    constructor(private adminService: AdminService) { }

    @Get('dashboard')
    async getDashboard() {
        return this.adminService.getDashboardStats();
    }

    // Prayer moderation
    @Get('prayers/pending')
    async getPendingPrayers(
        @Query('page') page?: string,
        @Query('limit') limit?: string,
    ) {
        return this.adminService.getPendingPrayers(
            page ? parseInt(page) : 1,
            limit ? parseInt(limit) : 20,
        );
    }

    @Post('prayers/:id/approve')
    async approvePrayer(@Param('id') id: string) {
        return this.adminService.approvePrayer(id, 'admin'); // TODO: Get from auth
    }

    @Post('prayers/:id/reject')
    async rejectPrayer(
        @Param('id') id: string,
        @Body('reason') reason: string,
    ) {
        return this.adminService.rejectPrayer(id, 'admin', reason);
    }

    // Claim review
    @Get('claims/pending')
    async getPendingClaims() {
        return this.adminService.getPendingClaims();
    }

    @Post('claims/:id/approve')
    async approveClaim(@Param('id') id: string) {
        return this.adminService.approveClaim(id, 'admin');
    }

    @Post('claims/:id/reject')
    async rejectClaim(
        @Param('id') id: string,
        @Body('reason') reason: string,
    ) {
        return this.adminService.rejectClaim(id, 'admin', reason);
    }

    // Settings
    @Get('settings')
    async getSettings() {
        return this.adminService.getSettings();
    }

    @Post('settings') // Using Post for simplicity, could be Put
    async updateSettings(@Body() data: any) {
        return this.adminService.updateSettings(data);
    }

    // ===== USER MANAGEMENT =====
    @Get('users')
    async getUsers(
        @Query('page') page?: string,
        @Query('limit') limit?: string,
        @Query('search') search?: string,
    ) {
        return this.adminService.getUsers(
            page ? parseInt(page) : 1,
            limit ? parseInt(limit) : 20,
            search,
        );
    }

    @Post('users')
    async createUser(@Body() data: any) {
        return this.adminService.createUser(data);
    }

    @Put('users/:id')
    async updateUser(@Param('id') id: string, @Body() data: any) {
        return this.adminService.updateUser(id, data);
    }

    @Get('users/:id')
    async getUser(@Param('id') id: string) {
        return this.adminService.getUser(id);
    }

    @Delete('users/:id')
    async deleteUser(@Param('id') id: string) {
        return this.adminService.deleteUser(id);
    }

    @Post('users/:id/ban')
    async banUser(@Param('id') id: string, @Body('reason') reason: string) {
        return this.adminService.banUser(id, reason);
    }

    @Post('users/:id/unban')
    async unbanUser(@Param('id') id: string) {
        return this.adminService.unbanUser(id);
    }

    // ===== CHURCH MANAGEMENT =====
    @Get('churches')
    async getChurches(
        @Query('page') page?: string,
        @Query('limit') limit?: string,
        @Query('search') search?: string,
    ) {
        return this.adminService.getChurches(
            page ? parseInt(page) : 1,
            limit ? parseInt(limit) : 20,
            search,
        );
    }

    @Post('churches')
    async createChurch(@Body() data: any) {
        return this.adminService.createChurch(data);
    }

    @Put('churches/:id')
    async updateChurch(@Param('id') id: string, @Body() data: any) {
        return this.adminService.updateChurch(id, data);
    }

    @Delete('churches/:id')
    async deleteChurch(@Param('id') id: string) {
        return this.adminService.deleteChurch(id);
    }

    @Post('churches/unverify-all')
    async unverifyAllChurches() {
        return this.adminService.unverifyAllChurches();
    }

    // ===== ARTICLE MANAGEMENT (CMS) =====
    @Get('articles')
    async getArticles(
        @Query('page') page?: string,
        @Query('limit') limit?: string,
        @Query('category') category?: string,
    ) {
        return this.adminService.getArticles(
            page ? parseInt(page) : 1,
            limit ? parseInt(limit) : 20,
            category,
        );
    }

    @Post('articles')
    async createArticle(@Body() data: any, @Request() req) {
        return this.adminService.createArticle(data, req.user?.userId || 'admin');
    }

    @Put('articles/:id')
    async updateArticle(@Param('id') id: string, @Body() data: any) {
        return this.adminService.updateArticle(id, data);
    }

    @Delete('articles/:id')
    async deleteArticle(@Param('id') id: string) {
        return this.adminService.deleteArticle(id);
    }

    // ===== MEMORIAL MANAGEMENT =====
    @Get('memorials')
    async getMemorials(
        @Query('page') page?: string,
        @Query('limit') limit?: string,
    ) {
        return this.adminService.getMemorials(
            page ? parseInt(page) : 1,
            limit ? parseInt(limit) : 20,
        );
    }

    @Post('memorials')
    async createMemorial(@Body() data: any, @Request() req) {
        return this.adminService.createMemorial(data, req.user.userId);
    }

    @Put('memorials/:id')
    async updateMemorial(@Param('id') id: string, @Body() data: any) {
        return this.adminService.updateMemorial(id, data);
    }

    @Delete('memorials/:id')
    async deleteMemorial(@Param('id') id: string) {
        return this.adminService.deleteMemorial(id);
    }

    // ===== NOTIFICATION MANAGEMENT =====
    @Get('notifications')
    async getNotifications(
        @Query('page') page?: string,
        @Query('limit') limit?: string,
    ) {
        return this.adminService.getNotifications(
            page ? parseInt(page) : 1,
            limit ? parseInt(limit) : 20,
        );
    }

    @Get('notifications/recent')
    async getRecentNotifications() {
        return this.adminService.getRecentNotifications();
    }

    @Post('notifications')
    async sendNotification(@Body() data: any) {
        return this.adminService.sendNotification(data);
    }

    // ===== REPORTS =====
    @Get('reports')
    async getReports(
        @Query('page') page?: string,
        @Query('limit') limit?: string,
        @Query('status') status?: string,
    ) {
        return this.adminService.getReports(
            page ? parseInt(page) : 1,
            limit ? parseInt(limit) : 20,
            status,
        );
    }

    @Put('reports/:id')
    async updateReport(@Param('id') id: string, @Body('action') action: 'resolve' | 'dismiss') {
        return this.adminService.updateReport(id, action);
    }

    @Get('reports/users')
    async getUserReports(
        @Query('startDate') startDate?: string,
        @Query('endDate') endDate?: string,
    ) {
        return this.adminService.getUserReports(startDate, endDate);
    }



    @Get('reports/revenue')
    async getRevenueReports(
        @Query('startDate') startDate?: string,
        @Query('endDate') endDate?: string,
    ) {
        return this.adminService.getRevenueReports(startDate, endDate);
    }

    // ===== OFFERINGS MANAGEMENT =====
    @Get('offerings/stats')
    async getOfferingsStats() {
        return this.adminService.getOfferingsStats();
    }

    @Get('mass-offerings')
    async getMassOfferings(
        @Query('page') page?: string,
        @Query('limit') limit?: string,
        @Query('search') search?: string,
    ) {
        return this.adminService.getMassOfferings(
            page ? parseInt(page) : 1,
            limit ? parseInt(limit) : 20,
            search,
        );
    }

    @Get('candles')
    async getCandles(
        @Query('page') page?: string,
        @Query('limit') limit?: string,
        @Query('search') search?: string,
    ) {
        return this.adminService.getCandles(
            page ? parseInt(page) : 1,
            limit ? parseInt(limit) : 20,
            search,
        );
    }

    @Get('donations')
    async getDonations(
        @Query('page') page?: string,
        @Query('limit') limit?: string,
        @Query('search') search?: string,
    ) {
        return this.adminService.getDonations(
            page ? parseInt(page) : 1,
            limit ? parseInt(limit) : 20,
            search,
        );
    }

    @Get('spiritual-bouquets')
    async getSpiritualBouquets(
        @Query('page') page?: string,
        @Query('limit') limit?: string,
        @Query('search') search?: string,
    ) {
        return this.adminService.getSpiritualBouquets(
            page ? parseInt(page) : 1,
            limit ? parseInt(limit) : 20,
            search,
        );
    }

    // ===== ABANDONED CART MANAGEMENT =====
    @Get('abandoned-carts')
    async getAbandonedCarts(
        @Query('page') page?: string,
        @Query('limit') limit?: string,
        @Query('type') type?: string,
        @Query('source') source?: string,
        @Query('converted') converted?: string,
    ) {
        return this.adminService.getAbandonedCarts(
            page ? parseInt(page) : 1,
            limit ? parseInt(limit) : 20,
            { type, source, converted: converted === 'true' ? true : converted === 'false' ? false : undefined },
        );
    }

    @Get('abandoned-carts/stats')
    async getAbandonedCartStats() {
        return this.adminService.getAbandonedCartStats();
    }

    @Get('abandoned-carts/:id')
    async getAbandonedCart(@Param('id') id: string) {
        return this.adminService.getAbandonedCart(id);
    }

    @Post('abandoned-carts')
    async createAbandonedCart(@Body() data: any) {
        return this.adminService.createAbandonedCart(data);
    }

    @Post('abandoned-carts/:id/remind')
    async sendCartReminder(
        @Param('id') id: string,
        @Body() options?: { email?: boolean; push?: boolean },
    ) {
        return this.adminService.sendCartReminder(id, options);
    }

    @Post('abandoned-carts/bulk-remind')
    async sendBulkCartReminders(@Body() data: { ids: string[]; email?: boolean; push?: boolean }) {
        return this.adminService.sendBulkCartReminders(data.ids, { email: data.email, push: data.push });
    }

    @Patch('abandoned-carts/:id/convert')
    async markCartConverted(@Param('id') id: string) {
        return this.adminService.markCartConverted(id);
    }

    @Delete('abandoned-carts/:id')
    async deleteAbandonedCart(@Param('id') id: string) {
        return this.adminService.deleteAbandonedCart(id);
    }

    // ===== AD MANAGEMENT =====
    @Get('ads')
    async getAdContainers() {
        return this.adminService.getAdContainers();
    }

    @Post('ads')
    async upsertAdContainer(@Body() data: any) {
        return this.adminService.upsertAdContainer(data);
    }

    @Delete('ads/:id')
    async deleteAdContainer(@Param('id') id: string) {
        return this.adminService.deleteAdContainer(id);
    }

    @Get('settings/ad-placements')
    async getAdPlacements() {
        return this.adminService.getAdPlacements();
    }

    @Post('settings/ad-placements')
    async updateAdPlacements(@Body() data: any) {
        return this.adminService.updateAdPlacements(data);
    }
}
