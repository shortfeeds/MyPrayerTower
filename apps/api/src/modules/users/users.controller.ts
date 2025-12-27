import { Controller, Get, Put, Body, UseGuards, Request } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
    constructor(private usersService: UsersService) { }

    @Get('profile')
    async getProfile(@Request() req) {
        return this.usersService.findById(req.user.id);
    }

    @Put('profile')
    async updateProfile(@Request() req, @Body() data: any) {
        return this.usersService.updateProfile(req.user.id, data);
    }

    @Put('home-church')
    async setHomeChurch(@Request() req, @Body('churchId') churchId: string) {
        return this.usersService.setHomeChurch(req.user.id, churchId);
    }

    @Put('notifications')
    async updateNotifications(@Request() req, @Body('enabled') enabled: boolean) {
        return this.usersService.updateNotificationSettings(req.user.id, enabled);
    }
}
