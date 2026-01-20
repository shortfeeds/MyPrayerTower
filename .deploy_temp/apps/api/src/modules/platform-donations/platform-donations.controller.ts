import { Controller, Post, Get, Body, Query, Param, Request, UseGuards } from '@nestjs/common';
import { PlatformDonationsService, CreateDonationDto, CreateSubscriptionDto } from './platform-donations.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('donations')
export class PlatformDonationsController {
    constructor(private readonly donationsService: PlatformDonationsService) { }

    /**
     * Get available tiers and subscription plans
     */
    @Get('options')
    async getOptions() {
        return this.donationsService.getTiersAndPlans();
    }

    /**
     * Create a one-time donation checkout
     */
    @Post('checkout')
    async createDonationCheckout(
        @Body() data: CreateDonationDto,
        @Request() req: any,
    ) {
        const userId = req.user?.id || null;
        return this.donationsService.createDonationCheckout(userId, data);
    }

    /**
     * Create a subscription checkout
     */
    @Post('subscribe')
    async createSubscriptionCheckout(
        @Body() data: CreateSubscriptionDto,
        @Request() req: any,
    ) {
        const userId = req.user?.id || null;
        return this.donationsService.createSubscriptionCheckout(userId, data);
    }

    /**
     * Get donation by order number (for success page)
     */
    @Get('order/:orderNumber')
    async getByOrderNumber(@Param('orderNumber') orderNumber: string) {
        const donation = await this.donationsService.getDonationByOrderNumber(orderNumber);
        if (!donation) {
            return { error: 'Donation not found' };
        }
        return donation;
    }

    /**
     * Get user's donation history
     */
    @Get('my-donations')
    async getMyDonations(@Request() req: any) {
        if (!req.user?.id) {
            return { donations: [], message: 'Please log in to view your donations' };
        }
        return this.donationsService.getUserDonations(req.user.id);
    }

    /**
     * Get user's active subscription
     */
    @Get('my-subscription')
    async getMySubscription(@Request() req: any) {
        if (!req.user?.id) {
            return null;
        }
        return this.donationsService.getUserSubscription(req.user.id);
    }

    /**
     * Admin: Get all donations
     */
    @Get('admin/all')
    @UseGuards(JwtAuthGuard)
    async getAllDonations(
        @Query('limit') limit?: string,
        @Query('offset') offset?: string,
    ) {
        return this.donationsService.getAllDonations(
            limit ? parseInt(limit) : 50,
            offset ? parseInt(offset) : 0,
        );
    }

    /**
     * Admin: Get donation statistics
     */
    @Get('admin/statistics')
    @UseGuards(JwtAuthGuard)
    async getStatistics(
        @Query('startDate') startDate?: string,
        @Query('endDate') endDate?: string,
    ) {
        return this.donationsService.getStatistics(
            startDate ? new Date(startDate) : undefined,
            endDate ? new Date(endDate) : undefined,
        );
    }
}
