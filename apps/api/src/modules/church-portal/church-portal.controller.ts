import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, Req } from '@nestjs/common';
import { ChurchPortalService } from './church-portal.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('church-portal')
export class ChurchPortalController {
    constructor(private readonly portalService: ChurchPortalService) { }

    // ============================================
    // CLAIM ENDPOINTS
    // ============================================

    @Get(':churchId/claim-status')
    @UseGuards(JwtAuthGuard)
    async getClaimStatus(@Param('churchId') churchId: string, @Req() req: any) {
        return this.portalService.getClaimStatus(churchId, req.user.id);
    }

    @Post(':churchId/claim')
    @UseGuards(JwtAuthGuard)
    async initiateClaim(
        @Param('churchId') churchId: string,
        @Req() req: any,
        @Body() body: {
            claimantName: string;
            claimantTitle: string;
            claimantEmail: string;
            claimantPhone: string;
        }
    ) {
        return this.portalService.initiateChurchClaim(churchId, req.user.id, body);
    }

    @Post('claims/:claimId/verify-email')
    async verifyClaimEmail(
        @Param('claimId') claimId: string,
        @Body() body: { otp: string }
    ) {
        return this.portalService.verifyClaimEmail(claimId, body.otp);
    }

    // ============================================
    // SUBSCRIPTION ENDPOINTS
    // ============================================

    @Get(':churchId/subscription')
    @UseGuards(JwtAuthGuard)
    async getSubscription(@Param('churchId') churchId: string) {
        return this.portalService.getSubscription(churchId);
    }

    @Post(':churchId/upgrade')
    @UseGuards(JwtAuthGuard)
    async upgradeChurch(
        @Param('churchId') churchId: string,
        @Req() req: any,
        @Body() body: { tier: 'BASIC' | 'PRO' | 'CATHEDRAL' | 'DIOCESE'; paymentId: string }
    ) {
        return this.portalService.upgradeChurch(churchId, req.user.id, body.tier as any, body.paymentId);
    }

    // ============================================
    // ANNOUNCEMENTS ENDPOINTS
    // ============================================

    @Get(':churchId/announcements')
    async getAnnouncements(
        @Param('churchId') churchId: string,
        @Query('limit') limit?: string
    ) {
        return this.portalService.getAnnouncements(churchId, limit ? parseInt(limit) : 10);
    }

    @Post(':churchId/announcements')
    @UseGuards(JwtAuthGuard)
    async createAnnouncement(
        @Param('churchId') churchId: string,
        @Req() req: any,
        @Body() body: {
            title: string;
            content: string;
            imageUrl?: string;
            linkUrl?: string;
            linkText?: string;
        }
    ) {
        return this.portalService.createAnnouncement(churchId, req.user.id, body);
    }

    // ============================================
    // FOLLOWERS ENDPOINTS
    // ============================================

    @Post(':churchId/follow')
    @UseGuards(JwtAuthGuard)
    async followChurch(@Param('churchId') churchId: string, @Req() req: any) {
        return this.portalService.followChurch(churchId, req.user.id);
    }

    @Delete(':churchId/follow')
    @UseGuards(JwtAuthGuard)
    async unfollowChurch(@Param('churchId') churchId: string, @Req() req: any) {
        return this.portalService.unfollowChurch(churchId, req.user.id);
    }

    @Get(':churchId/followers')
    @UseGuards(JwtAuthGuard)
    async getFollowers(
        @Param('churchId') churchId: string,
        @Query('page') page?: string,
        @Query('limit') limit?: string
    ) {
        return this.portalService.getFollowers(
            churchId,
            page ? parseInt(page) : 1,
            limit ? parseInt(limit) : 20
        );
    }

    // ============================================
    // ADMIN ENDPOINTS
    // ============================================

    @Post(':churchId/admins')
    @UseGuards(JwtAuthGuard)
    async addAdmin(
        @Param('churchId') churchId: string,
        @Req() req: any,
        @Body() body: { userId: string; role?: 'ADMIN' | 'EDITOR' | 'VIEWER' }
    ) {
        return this.portalService.addChurchAdmin(churchId, req.user.id, body.userId, body.role);
    }

    // ============================================
    // DASHBOARD ENDPOINTS
    // ============================================

    @Get(':churchId/dashboard')
    @UseGuards(JwtAuthGuard)
    async getDashboard(@Param('churchId') churchId: string, @Req() req: any) {
        return this.portalService.getDashboardStats(churchId, req.user.id);
    }
}
