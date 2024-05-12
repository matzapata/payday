import { Injectable } from '@nestjs/common';
import { Earnings, Prisma } from '@prisma/client';
import { PrismaService } from '@src/database/prisma.service';

@Injectable()
export class EarningsRepository {
  constructor(private prisma: PrismaService) {}

  createForUserId(
    userId: string,
    data: Prisma.EarningsCreateInput,
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

  sumByUserId(
    userId: string,
    where?: Prisma.EarningsAggregateArgs['where'],
  ): Promise<number> {
    return this.prisma.earnings
      .aggregate({
        where: { userId, ...where },
        _sum: {
          amount: true,
        },
      })
      .then((result) => result._sum.amount ?? 0);
  }
}
