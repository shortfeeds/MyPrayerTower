import { Module } from '@nestjs/common';
import { PrayerWallService } from './prayer-wall.service';
import { PrayerWallController } from './prayer-wall.controller';

@Module({
    providers: [PrayerWallService],
    controllers: [PrayerWallController],
    exports: [PrayerWallService],
})
export class PrayerWallModule { }
