import { Controller, Get, Post, Body, Param, UseGuards, Request } from '@nestjs/common';
import { ClaimsService } from './claims.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('claims')
@UseGuards(JwtAuthGuard)
export class ClaimsController {
    constructor(private claimsService: ClaimsService) { }

    @Post('start/:churchId')
    async startClaim(
        @Request() req,
        @Param('churchId') churchId: string,
        @Body() data: {
            claimantName: string;
            claimantTitle: string;
            claimantEmail: string;
            claimantPhone: string;
        },
    ) {
        return this.claimsService.startClaim(req.user.id, churchId, data);
    }

    @Post(':claimId/verify-email')
    async verifyEmail(
        @Param('claimId') claimId: string,
        @Body('otp') otp: string,
    ) {
        return this.claimsService.verifyEmailOtp(claimId, otp);
    }

    @Post(':claimId/verify-sms')
    async verifySms(
        @Param('claimId') claimId: string,
        @Body('otp') otp: string,
    ) {
        return this.claimsService.verifySmsOtp(claimId, otp);
    }

    @Post(':claimId/documents-submitted')
    async markDocumentsSubmitted(@Param('claimId') claimId: string) {
        return this.claimsService.markDocumentsSubmitted(claimId);
    }

    @Get(':claimId')
    async getClaimStatus(@Request() req, @Param('claimId') claimId: string) {
        return this.claimsService.getClaimStatus(claimId, req.user.id);
    }

    @Get()
    async getMyClaims(@Request() req) {
        return this.claimsService.getUserClaims(req.user.id);
    }
}
