import { Controller, Get } from '@nestjs/common';
import { AdminService } from './admin.service';

@Controller('public/settings')
export class PublicSettingsController {
    constructor(private adminService: AdminService) { }

    @Get()
    async getSettings() {
        return this.adminService.getSettings();
    }
}
