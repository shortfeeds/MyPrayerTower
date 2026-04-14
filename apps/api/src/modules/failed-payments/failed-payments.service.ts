import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { PaymentType } from '@prisma/client';

export interface LogFailedPaymentDto {
  userId?: string;
  userEmail?: string;
  amount?: number;
  currency?: string;
  paymentType: PaymentType;
  failureReason: string;
  stripeSessionId?: string;
  metadata?: any;
}

@Injectable()
export class FailedPaymentsService {
  private readonly logger = new Logger(FailedPaymentsService.name);

  constructor(private prisma: PrismaService) {}

  async log(data: LogFailedPaymentDto) {
    try {
      const log = await this.prisma.failedPayment.create({
        data: {
          userId: data.userId,
          userEmail: data.userEmail,
          amount: data.amount,
          currency: data.currency || 'usd',
          paymentType: data.paymentType,
          failureReason: data.failureReason,
          stripeSessionId: data.stripeSessionId,
          metadata: data.metadata || {},
        },
      });
      this.logger.log(`Logged failed payment: ${log.id} - ${data.failureReason}`);
      return log;
    } catch (error) {
      this.logger.error(`Failed to log failed payment: ${error.message}`, error.stack);
    }
  }

  async findAll(page: number = 1, limit: number = 20, filters?: { type?: PaymentType }) {
    const skip = (page - 1) * limit;
    
    const where = {
      ...(filters?.type && { paymentType: filters.type }),
    };

    const [items, total] = await Promise.all([
      this.prisma.failedPayment.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: {
              firstName: true,
              lastName: true,
              email: true,
            },
          },
        },
      }),
      this.prisma.failedPayment.count({ where }),
    ]);

    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }
}
