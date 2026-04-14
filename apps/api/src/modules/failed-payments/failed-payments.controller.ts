import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { FailedPaymentsService } from './failed-payments.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PaymentType } from '@prisma/client';

@Controller('admin/failed-payments')
@UseGuards(JwtAuthGuard)
export class FailedPaymentsController {
  constructor(private readonly failedPaymentsService: FailedPaymentsService) {}

  @Get()
  async findAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('type') type?: PaymentType,
  ) {
    return this.failedPaymentsService.findAll(
      page ? parseInt(page) : 1,
      limit ? parseInt(limit) : 20,
      { type },
    );
  }
}
