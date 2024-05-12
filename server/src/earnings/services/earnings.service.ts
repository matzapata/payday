import { Injectable } from '@nestjs/common';
import { EarningsRepository } from '../repositories/earnings.repository';
import { Currency, Earnings, Prisma } from '@prisma/client';
import { PrismaTxClient } from '@src/database/prisma.service';

@Injectable()
export class EarningsService {
  constructor(private readonly earningsRepo: EarningsRepository) {}

  createForUserId(
    userId: string,
    data: Omit<Prisma.EarningsCreateInput, 'user'>,
  ): Promise<Earnings> {
    return this.earningsRepo.createForUserId(userId, data);
  }

  findByUserId(userId: string): Promise<Earnings[]> {
    return this.earningsRepo.findByUserId(userId);
  }

  sumByUserId(userId: string, currency: Currency): Promise<number> {
    return this.earningsRepo.sumByUserId(userId, currency);
  }

  sumByUserIdInTx(
    txClient: PrismaTxClient,
    userId: string,
    currency: Currency,
  ): Promise<number> {
    return this.earningsRepo.sumByUserIdInTx(txClient, userId, currency);
  }
}
