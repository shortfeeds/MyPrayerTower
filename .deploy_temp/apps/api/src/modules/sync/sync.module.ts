import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { SyncService } from './sync.service';
import { SyncController } from './sync.controller';

@Module({
    imports: [ScheduleModule.forRoot()],
    providers: [SyncService],
    controllers: [SyncController],
})
export class SyncModule { }
