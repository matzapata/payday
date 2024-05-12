import { Injectable } from '@nestjs/common';
import { Currency, Earnings, Prisma, PrismaClient } from '@prisma/client';
import { PrismaService, PrismaTxClient } from '@src/database/prisma.service';

@Injectable()
export class EarningsRepository {
  constructor(private prisma: PrismaService) {}

  createForUserId(
    userId: string,
    data: Omit<Prisma.EarningsCreateInput, 'user'>,
  ): Promise<Earnings> {
    return this.prisma.earnings.create({
      data: {
        ...data,
        user: {
          connect: {
            id: userId,
          },
        },
      },
    });
  }

  findByUserId(userId: string): Promise<Earnings[]> {
    return this.prisma.earnings.findMany({
      where: {
        userId,
      },
    });
  }

  // This method is used by the non-transactional method
  sumByUserId(
    userId: string,
    currency: Currency,
    where?: Prisma.EarningsAggregateArgs['where'],
  ): Promise<number> {
    return this.prisma.earnings
      .aggregate({
        where: { userId, currency, ...where },
        _sum: {
          amount: true,
        },
      })
      .then((result) => result._sum.amount ?? 0);
  }

  // This method is used by the transactional method
  sumByUserIdInTx(
    txClient: PrismaTxClient,
    userId: string,
    currency: Currency,
    where?: Prisma.EarningsAggregateArgs['where'],
  ): Promise<number> {
    return this.sumByUserIdClient(txClient, userId, currency, where);
  }

  // This method is used by both the transactional and non-transactional methods
  sumByUserIdClient(
    prismaClient: PrismaTxClient | PrismaClient,
    userId: string,
    currency: Currency,
    where?: Prisma.EarningsAggregateArgs['where'],
  ): Promise<number> {
    return prismaClient.earnings
      .aggregate({
        where: { userId, currency, ...where },
        _sum: {
          amount: true,
        },
      })
      .then((result) => result._sum.amount ?? 0);
  }
}
