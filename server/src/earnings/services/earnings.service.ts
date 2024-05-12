import { Injectable } from '@nestjs/common';
import { EarningsRepository } from '../repositories/earnings.repository';
import { Earnings, Prisma } from '@prisma/client';

@Injectable()
export class EarningsService {
  constructor(private readonly earningsRepo: EarningsRepository) {}

  createForUserId(
    userId: string,
    data: Prisma.EarningsCreateInput,
  ): Promise<Earnings> {
    return this.earningsRepo.createForUserId(userId, data);
  }

  findByUserId(userId: string): Promise<Earnings[]> {
    return this.earningsRepo.findByUserId(userId);
  }

  sumByUserId(userId: string): Promise<number> {
    return this.earningsRepo.sumByUserId(userId);
  }
}
