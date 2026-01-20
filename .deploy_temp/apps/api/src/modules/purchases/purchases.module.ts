import { Module } from '@nestjs/common';
import { PurchasesController } from './purchases.controller';
import { GooglePlayService } from './google-play.service';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
    imports: [PrismaModule],
    controllers: [PurchasesController],
    providers: [GooglePlayService],
    exports: [GooglePlayService],
})
export class PurchasesModule { }
