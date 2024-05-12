import { Injectable } from '@nestjs/common';
import {
  Cashout,
  CashoutStatus,
  Currency,
  Prisma,
  PrismaClient,
} from '@prisma/client';
import { CashoutsRepository } from '../repositories/cashouts.repository';
import { PrismaService, PrismaTxClient } from '@src/database/prisma.service';
import { ExchangeService } from '@src/infrastructure/exchange/exchange.service';
import { EarningsService } from '@src/earnings/services/earnings.service';

@Injectable()
export class CashoutsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cashoutsRepository: CashoutsRepository,
    private readonly exchangeService: ExchangeService,
    private readonly earningsService: EarningsService,
  ) {}

  createForUserId(
    userId: string,
    data: Prisma.CashoutCreateInput,
    condition: (prisma: PrismaTxClient) => Promise<boolean>,
  ): Promise<Cashout> {
    return this.cashoutsRepository.createForUserId(userId, data, condition);
  }

  findByUserId(userId: string): Promise<Cashout[]> {
    return this.cashoutsRepository.findByUserId(userId);
  }

  sumByUserIdSuccessOrPending(
    userId: string,
    currency: Currency,
  ): Promise<number> {
    return this.cashoutsRepository.sumByUserId(userId, currency, {
      OR: [
        { status: CashoutStatus.COMPLETED },
        { status: CashoutStatus.PENDING },
      ],
    });
  }

  sumByUserIdSuccessOrPendingInTx(
    txClient: PrismaTxClient,
    userId: string,
    currency: Currency,
  ): Promise<number> {
    return this.cashoutsRepository.sumByUserIdInTx(txClient, userId, currency, {
      OR: [
        { status: CashoutStatus.COMPLETED },
        { status: CashoutStatus.PENDING },
      ],
    });
  }

  // This method is used by the non-transactional method
  calculateAvailableForCashout(
    userId: string,
    currency: Currency,
    currencies: Currency[],
  ): Promise<number> {
    return this.calculateAvailableForCashoutClient(
      this.prisma,
      userId,
      currency,
      currencies,
    );
  }

  // This method is used by the transactional method
  calculateAvailableForCashoutInTx(
    txClient: PrismaTxClient,
    userId: string,
    currency: Currency,
    currencies: Currency[],
  ): Promise<number> {
    return this.calculateAvailableForCashoutClient(
      txClient,
      userId,
      currency,
      currencies,
    );
  }

  // This method is used by both the transactional and non-transactional methods
  async calculateAvailableForCashoutClient(
    prismaClient: PrismaTxClient | PrismaClient,
    userId: string,
    targetCurrency: Currency,
    currencies: Currency[],
  ): Promise<number> {
    let available = 0;
    for (const currency of currencies) {
      const [earnings, cashouts] = await Promise.all([
        this.earningsService.sumByUserIdInTx(prismaClient, userId, currency),
        this.sumByUserIdSuccessOrPendingInTx(prismaClient, userId, currency),
      ]);
      const net = earnings - cashouts;

      // net can also be negative. You can extract always in usd but make earnings in ars
      if (net === 0) {
        continue;
      }

      // if the currency is the target currency, no need to convert
      if (currency === targetCurrency) {
        available += net;
      } else {
        available += await this.exchangeService.quote(
          currency,
          targetCurrency,
          net,
        );
      }
    }

    return available;
  }
}
