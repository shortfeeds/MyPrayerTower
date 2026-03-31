import { Module } from '@nestjs/common';
import { AdsController } from './ads.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
    imports: [PrismaModule],
    controllers: [AdsController],
})
export class AdsModule { }
