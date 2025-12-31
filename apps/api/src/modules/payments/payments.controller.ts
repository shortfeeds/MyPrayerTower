import { Controller, Post, Body, Req, Res, UseGuards, RawBodyRequest, Get, Query } from '@nestjs/common';
import { StripeService } from './stripe.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Request, Response } from 'express';

@Controller('payments')
export class PaymentsController {
    constructor(private readonly stripeService: StripeService) { }

    @Post('create-checkout')
    @UseGuards(JwtAuthGuard)
    async createCheckout(
        @Body() body: {
            churchId: string;
            tier: 'BASIC' | 'PRO' | 'CATHEDRAL' | 'DIOCESE';
            successUrl: string;
            cancelUrl: string;
        }
    ) {
        return this.stripeService.createCheckoutSession(
            body.churchId,
            body.tier as any,
            body.successUrl,
            body.cancelUrl
        );
    }

    @Post('webhook')
    async handleWebhook(
        @Req() req: RawBodyRequest<Request>,
        @Res() res: Response
    ) {
        const signature = req.headers['stripe-signature'] as string;

        if (!signature) {
            return res.status(400).json({ error: 'Missing stripe-signature header' });
        }

        try {
            const result = await this.stripeService.handleWebhook(
                req.rawBody as Buffer,
                signature
            );
            return res.json(result);
        } catch (error) {
            console.error('[Stripe Webhook Error]', error);
            return res.status(400).json({ error: (error as Error).message });
        }
    }

    @Get('session-status')
    async getSessionStatus(@Query('session_id') sessionId: string) {
        return this.stripeService.getSessionStatus(sessionId);
    }
}
