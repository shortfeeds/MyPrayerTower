import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { PrayerGroupsService } from './prayer-groups.service';
import { PrayerGroupsController } from './prayer-groups.controller';

@Module({
    imports: [PrismaModule],
    providers: [PrayerGroupsService],
    controllers: [PrayerGroupsController],
    exports: [PrayerGroupsService],
})
export class PrayerGroupsModule { }
