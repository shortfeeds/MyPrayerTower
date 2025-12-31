import { Controller, Get, Post, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ContentModerationService } from './content-moderation.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('moderation')
@UseGuards(JwtAuthGuard)
export class ModerationController {
    constructor(private readonly moderationService: ContentModerationService) { }

    @Get('queue')
    async getModerationQueue(@Query('limit') limit?: string) {
        return this.moderationService.getPendingModeration(
            limit ? parseInt(limit) : 20
        );
    }

    @Post('check')
    async checkContent(@Body() body: { content: string }) {
        return this.moderationService.moderateContent(body.content);
    }

    @Post(':id/approve')
    async approvePrayer(
        @Param('id') prayerId: string,
        @Body() body: { moderatorId: string }
    ) {
        return this.moderationService.approvePrayer(prayerId, body.moderatorId);
    }

    @Post(':id/reject')
    async rejectPrayer(
        @Param('id') prayerId: string,
        @Body() body: { moderatorId: string; reason: string }
    ) {
        return this.moderationService.rejectPrayer(prayerId, body.moderatorId, body.reason);
    }
}
