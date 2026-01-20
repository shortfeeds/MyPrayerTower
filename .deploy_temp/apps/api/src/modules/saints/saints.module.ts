import { Module } from '@nestjs/common';
import { SaintsService } from './saints.service';
import { SaintsController } from './saints.controller';

@Module({
    providers: [SaintsService],
    controllers: [SaintsController],
})
export class SaintsModule { }
