import { Injectable } from '@nestjs/common';
import { Cashout, Currency, Prisma, PrismaClient } from '@prisma/client';
import { PrismaService, PrismaTxClient } from '@src/database/prisma.service';

@Injectable()
export class CashoutsRepository {
  constructor(private prisma: PrismaService) {}

  createForUserId(
    userId: string,
    data: Prisma.CashoutCreateInput,
    condition: (prisma: PrismaTxClient) => Promise<boolean>,
  ): Promise<Cashout> {
    return this.prisma.$transaction(async (txClient) => {
      if (!(await condition(txClient))) {
        throw new Error('Condition failed');
      }

      return txClient.cashout.create({
        data: {
          ...data,
          user: { connect: { id: userId } },
        },
      });
    });
  }

  findByUserId(userId: string): Promise<Cashout[]> {
    return this.prisma.cashout.findMany({
      where: {
        userId,
      },
    });
  }

  // This method is used by the non-transactional method
  sumByUserId(
    userId: string,
    currency: Currency,
    where?: Prisma.CashoutAggregateArgs['where'],
  ): Promise<number> {
    return this.sumByUserIdClient(this.prisma, userId, currency, where);
  }

  // This method is used by the transactional method
  sumByUserIdInTx(
    txClient: PrismaTxClient,
    userId: string,
    currency: Currency,
    where?: Prisma.CashoutAggregateArgs['where'],
  ): Promise<number> {
    return this.sumByUserIdClient(txClient, userId, currency, where);
  }

  // This method is used by both the transactional and non-transactional methods
  sumByUserIdClient(
    prismaClient: PrismaTxClient | PrismaClient,
    userId: string,
    currency: Currency,
    where?: Prisma.CashoutAggregateArgs['where'],
  ): Promise<number> {
    return prismaClient.cashout
      .aggregate({
        where: { userId, currency, ...where },
        _sum: {
          amount: true,
        },
      })
      .then((result) => result._sum.amount ?? 0);
  }
}
