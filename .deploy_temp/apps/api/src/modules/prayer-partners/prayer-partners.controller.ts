import { Controller, Get, Post, Delete, Body, Param, UseGuards, Query } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from '@prisma/client';
import { PrayerPartnersService } from './prayer-partners.service';

@Controller('prayer-partners')
@UseGuards(JwtAuthGuard)
export class PrayerPartnersController {
    constructor(private readonly service: PrayerPartnersService) { }

    @Post('invite')
    async invitePartner(
        @CurrentUser() user: User,
        @Body('email') email: string,
    ) {
        return this.service.invitePartner(user.id, email);
    }

    @Post('respond/:requestId')
    async respondToInvite(
        @CurrentUser() user: User,
        @Param('requestId') requestId: string,
        @Body('accept') accept: boolean,
    ) {
        return this.service.respondToInvite(user.id, requestId, accept);
    }

    @Get()
    async getPartners(@CurrentUser() user: User) {
        return this.service.getPartners(user.id);
    }

    @Get('requests')
    async getPendingRequests(@CurrentUser() user: User) {
        return this.service.getPendingRequests(user.id);
    }

    @Delete(':partnerId')
    async removePartner(
        @CurrentUser() user: User,
        @Param('partnerId') partnerId: string,
    ) {
        return this.service.removePartner(user.id, partnerId);
    }
}
