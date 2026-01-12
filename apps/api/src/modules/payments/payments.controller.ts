import { Controller, Post, Body, UseGuards, Get, Query } from '@nestjs/common';
import { PayPalService } from './paypal.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('payments')
export class PaymentsController {
    constructor(private readonly paypalService: PayPalService) { }

    @Post('create-checkout')
    @UseGuards(JwtAuthGuard)
    async createCheckout(
        @Body() body: {
            churchId: string;
            tier: 'BASIC' | 'PRO' | 'CATHEDRAL' | 'DIOCESE';
        }
    ) {
        return this.paypalService.createOrder(
            body.churchId,
            body.tier as any
        );
    }

    @Post('verify-payment')
    @UseGuards(JwtAuthGuard)
    async verifyPayment(
        @Body() body: {
            paypalOrderId: string;
            churchId: string;
            tier: 'BASIC' | 'PRO' | 'CATHEDRAL' | 'DIOCESE';
        }
    ) {
        return this.paypalService.verifyAndActivate(
            body.paypalOrderId,
            body.churchId,
            body.tier as any
        );
    }
}
