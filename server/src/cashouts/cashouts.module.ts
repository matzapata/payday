import { Module } from '@nestjs/common';
import { CashoutsController } from './cashouts.controller';
import { CashoutsRepository } from './repositories/cashouts.repository';
import { CashoutsService } from './services/cashouts.service';
import { ExchangeModule } from '@src/infrastructure/exchange/exchange.module';
import { EarningsModule } from '@src/earnings/earnings.module';
import { PrismaModule } from '@src/database/prisma.module';

@Module({
  controllers: [CashoutsController],
  providers: [CashoutsRepository, CashoutsService],
  imports: [ExchangeModule, EarningsModule, PrismaModule],
  exports: [],
})
export class CashoutsModule {}
