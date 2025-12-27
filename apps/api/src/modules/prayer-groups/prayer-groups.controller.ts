import { Controller, Get, Post, Delete, Body, Param, Req, UseGuards } from '@nestjs/common';
import { PrayerGroupsService } from './prayer-groups.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('prayer-groups')
@UseGuards(JwtAuthGuard)
export class PrayerGroupsController {
    constructor(private prayerGroupsService: PrayerGroupsService) { }

    @Post()
    async createGroup(
        @Req() req,
        @Body() body: { name: string; description?: string; isPrivate?: boolean },
    ) {
        return this.prayerGroupsService.createGroup(req.user.id, body);
    }

    @Get()
    async getMyGroups(@Req() req) {
        return this.prayerGroupsService.getUserGroups(req.user.id);
    }

    @Get(':id')
    async getGroup(@Req() req, @Param('id') id: string) {
        return this.prayerGroupsService.getGroup(id, req.user.id);
    }

    @Post(':id/invite')
    async inviteToGroup(
        @Req() req,
        @Param('id') id: string,
        @Body('email') email: string,
    ) {
        return this.prayerGroupsService.inviteToGroup(id, req.user.id, email);
    }

    @Post('invites/:inviteId/accept')
    async acceptInvite(@Req() req, @Param('inviteId') inviteId: string) {
        return this.prayerGroupsService.acceptInvite(inviteId, req.user.id);
    }

    @Post(':id/prayers')
    async addPrayer(
        @Req() req,
        @Param('id') id: string,
        @Body('content') content: string,
    ) {
        return this.prayerGroupsService.addGroupPrayer(id, req.user.id, content);
    }

    @Delete(':id/leave')
    async leaveGroup(@Req() req, @Param('id') id: string) {
        return this.prayerGroupsService.leaveGroup(id, req.user.id);
    }
}
