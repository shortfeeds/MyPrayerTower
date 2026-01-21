import { Module } from '@nestjs/common';
import { MemorialsService } from './memorials.service';
import { MemorialsController } from './memorials.controller';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
    imports: [PrismaModule],
    controllers: [MemorialsController],
    providers: [MemorialsService],
    exports: [MemorialsService],
})
export class MemorialsModule { }
