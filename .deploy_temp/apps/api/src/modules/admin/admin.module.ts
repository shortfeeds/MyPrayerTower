import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';

import { PublicSettingsController } from './public-settings.controller';

@Module({
    providers: [AdminService],
    controllers: [AdminController, PublicSettingsController],
})
export class AdminModule { }
