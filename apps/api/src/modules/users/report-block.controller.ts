import { Controller, Post, Get, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ReportBlockService, ReportReason } from './report-block.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class ReportBlockController {
    constructor(private readonly reportBlockService: ReportBlockService) { }

    @Post(':id/report')
    async reportUser(
        @Param('id') reportedUserId: string,
        @Body() body: { reporterId: string; reason: ReportReason; details?: string }
    ) {
        return this.reportBlockService.reportUser(
            body.reporterId,
            reportedUserId,
            body.reason,
            body.details
        );
    }

    @Post(':id/block')
    async blockUser(
        @Param('id') blockedUserId: string,
        @Body() body: { userId: string }
    ) {
        return this.reportBlockService.blockUser(body.userId, blockedUserId);
    }

    @Delete(':id/block')
    async unblockUser(
        @Param('id') blockedUserId: string,
        @Body() body: { userId: string }
    ) {
        return this.reportBlockService.unblockUser(body.userId, blockedUserId);
    }

    @Get('me/blocked')
    async getBlockedUsers(@Body() body: { userId: string }) {
        return this.reportBlockService.getBlockedUsers(body.userId);
    }

    @Get(':id/is-blocked')
    async isBlocked(
        @Param('id') targetUserId: string,
        @Body() body: { userId: string }
    ) {
        const blocked = await this.reportBlockService.isBlocked(body.userId, targetUserId);
        return { isBlocked: blocked };
    }
}
