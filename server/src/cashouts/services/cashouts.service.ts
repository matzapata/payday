import { Injectable } from '@nestjs/common';
import { Cashout, CashoutStatus, Prisma } from '@prisma/client';
import { CashoutsRepository } from '../repositories/cashouts.repository';

@Injectable()
export class CashoutsService {
  constructor(private readonly cashoutsRepository: CashoutsRepository) {}

  createForUserId(
    userId: string,
    data: Prisma.CashoutCreateInput,
  ): Promise<Cashout> {
    return this.cashoutsRepository.createForUserId(userId, data);
  }

  findByUserId(userId: string): Promise<Cashout[]> {
    return this.cashoutsRepository.findByUserId(userId);
  }

  sumByUserIdSuccessOrPending(userId: string): Promise<number> {
    return this.cashoutsRepository.sumByUserId(userId, {
      OR: [
        { status: CashoutStatus.COMPLETED },
        { status: CashoutStatus.PENDING },
      ],
    });
  }
}
