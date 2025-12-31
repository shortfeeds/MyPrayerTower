import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from '../../prisma/prisma.module';
import { CashfreeService } from './cashfree.service';

@Module({
    imports: [ConfigModule, PrismaModule],
    providers: [CashfreeService],
    exports: [CashfreeService],
})
export class CashfreeModule { }
