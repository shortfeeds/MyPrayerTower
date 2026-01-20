import { Module } from '@nestjs/common';
import { LiturgicalController } from './liturgical.controller';
import { LiturgicalCalendarService } from './liturgical-calendar.service';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
    imports: [PrismaModule],
    controllers: [LiturgicalController],
    providers: [LiturgicalCalendarService],
    exports: [LiturgicalCalendarService],
})
export class LiturgicalModule { }
