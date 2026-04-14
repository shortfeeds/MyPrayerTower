import { Module } from '@nestjs/common';
import { FailedPaymentsService } from './failed-payments.service';
import { FailedPaymentsController } from './failed-payments.controller';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [FailedPaymentsService],
  controllers: [FailedPaymentsController],
  exports: [FailedPaymentsService],
})
export class FailedPaymentsModule {}
