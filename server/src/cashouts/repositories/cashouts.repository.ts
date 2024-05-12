import { Injectable } from '@nestjs/common';
import { Cashout, Prisma } from '@prisma/client';
import { PrismaService } from '@src/database/prisma.service';

@Injectable()
export class CashoutsRepository {
  constructor(private prisma: PrismaService) {}

  createForUserId(
    userId: string,
    data: Prisma.CashoutCreateInput,
  ): Promise<Cashout> {
    return this.prisma.cashout.create({
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

  findByUserId(userId: string): Promise<Cashout[]> {
    return this.prisma.cashout.findMany({
      where: {
        userId,
      },
    });
  }

  sumByUserId(
    userId: string,
    where?: Prisma.CashoutAggregateArgs['where'],
  ): Promise<number> {
    return this.prisma.cashout
      .aggregate({
        where: { userId, ...where },
        _sum: {
          amount: true,
        },
      })
      .then((result) => result._sum.amount ?? 0);
  }
}
