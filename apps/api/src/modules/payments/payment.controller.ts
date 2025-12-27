import { Controller, Get, Post, Body, Req, Headers, RawBodyRequest, UseGuards } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';

@Controller('payments')
export class PaymentController {
    private stripe: Stripe | null = null;

    constructor(
        private paymentService: PaymentService,
        private configService: ConfigService,
    ) {
        const stripeKey = this.configService.get('STRIPE_SECRET_KEY');
        if (stripeKey) {
            this.stripe = new Stripe(stripeKey, { apiVersion: '2023-10-16' });
        }
    }

    @Get('plans')
    getPlans() {
        return this.paymentService.getPlans();
    }

    @UseGuards(JwtAuthGuard)
    @Post('create-checkout')
    async createCheckout(@Req() req, @Body('planId') planId: string) {
        const url = await this.paymentService.createCheckoutSession(req.user.id, planId);
        return { url };
    }

    @UseGuards(JwtAuthGuard)
    @Post('create-portal')
    async createPortal(@Req() req) {
        const url = await this.paymentService.createPortalSession(req.user.id);
        return { url };
    }

    @Post('webhook')
    async handleWebhook(
        @Req() req: RawBodyRequest<Request>,
        @Headers('stripe-signature') signature: string,
    ) {
        if (!this.stripe) {
            return { received: false };
        }

        const webhookSecret = this.configService.get('STRIPE_WEBHOOK_SECRET');

        try {
            const event = this.stripe.webhooks.constructEvent(
                req.rawBody as Buffer,
                signature,
                webhookSecret,
            );

            await this.paymentService.handleWebhook(event);
            return { received: true };
        } catch (error) {
            return { received: false, error: error.message };
        }
    }
}
