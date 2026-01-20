import { Module } from '@nestjs/common';
import { PrayersService } from './prayers.service';
import { PrayersController } from './prayers.controller';

@Module({
    providers: [PrayersService],
    controllers: [PrayersController],
    exports: [PrayersService],
})
export class PrayersModule { }
