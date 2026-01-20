import { Controller, Post, Get, Body, Query, Param, UseGuards, Request } from '@nestjs/common';
import { MassOfferingsService, CreateMassOfferingDto } from './mass-offerings.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('mass-offerings')
export class MassOfferingsController {
    constructor(private readonly massOfferingsService: MassOfferingsService) { }

    /**
     * Get pricing information
     */
    @Get('pricing')
    async getPricing() {
        return this.massOfferingsService.getPricing();
    }

    /**
     * Get intention categories
     */
    @Get('categories')
    async getCategories() {
        return this.massOfferingsService.getIntentionCategories();
    }

    /**
     * Create a new Mass offering checkout session
     */
    @Post('checkout')
    async createCheckout(
        @Body() data: CreateMassOfferingDto,
        @Request() req: any,
    ) {
        const userId = req.user?.id || null;
        return this.massOfferingsService.createMassOfferingCheckout(userId, data);
    }

    /**
     * Get offering by order number (for success page)
     */
    @Get('order/:orderNumber')
    async getByOrderNumber(@Param('orderNumber') orderNumber: string) {
        const offering = await this.massOfferingsService.getOfferingByOrderNumber(orderNumber);
        if (!offering) {
            return { error: 'Order not found' };
        }
        return offering;
    }

    /**
     * Get user's offering history (requires auth)
     */
    @Get('my-offerings')
    @UseGuards(JwtAuthGuard)
    async getMyOfferings(@Request() req: any) {
        return this.massOfferingsService.getUserOfferings(req.user.id);
    }

    /**
     * Admin: Get all offerings
     */
    @Get('admin/all')
    @UseGuards(JwtAuthGuard)
    async getAllOfferings(
        @Query('status') status?: string,
        @Query('limit') limit?: string,
        @Query('offset') offset?: string,
    ) {
        return this.massOfferingsService.getAllOfferings(
            status as any,
            limit ? parseInt(limit) : 50,
            offset ? parseInt(offset) : 0,
        );
    }

    /**
     * Admin: Assign offering to partner
     */
    @Post('admin/:id/assign')
    @UseGuards(JwtAuthGuard)
    async assignToPartner(
        @Param('id') offeringId: string,
        @Body() data: { partnerId: string },
    ) {
        return this.massOfferingsService.assignToPartner(offeringId, data.partnerId);
    }

    /**
     * Admin: Schedule Mass
     */
    @Post('admin/:id/schedule')
    @UseGuards(JwtAuthGuard)
    async scheduleMass(
        @Param('id') offeringId: string,
        @Body() data: { celebrationDate: string; massTime?: string; celebrant?: string },
    ) {
        return this.massOfferingsService.scheduleMass(
            offeringId,
            new Date(data.celebrationDate),
            data.massTime,
            data.celebrant,
        );
    }

    /**
     * Admin: Mark as offered
     */
    @Post('admin/:id/mark-offered')
    @UseGuards(JwtAuthGuard)
    async markAsOffered(@Param('id') offeringId: string) {
        return this.massOfferingsService.markAsOffered(offeringId);
    }
}
