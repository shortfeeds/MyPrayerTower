import { Controller, Get, Post, Body, Param, Query, UseGuards, Req } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('notifications')
@UseGuards(JwtAuthGuard)
export class NotificationsController {
    constructor(private readonly notificationsService: NotificationsService) { }

    @Get('admin')
    async findAll(
        @Query('page') page?: string,
        @Query('limit') limit?: string,
    ) {
        return this.notificationsService.findAll(
            page ? parseInt(page) : 1,
            limit ? parseInt(limit) : 20,
        );
    }

    @Post('admin')
    async create(@Body() data: any) {
        // Assume user is admin (guarded by JwtAuthGuard + Admin role check ideally)
        return this.notificationsService.create(data);
    }

    @Post('admin/:id/send')
    async send(@Param('id') id: string) {
        return this.notificationsService.send(id);
    }

    @Post('register-device')
    async registerDevice(@Body() body: { token: string; platform: string }, @Req() req: any) {
        return this.notificationsService.registerDevice(req.user.id, body.token, body.platform);
    }
}
