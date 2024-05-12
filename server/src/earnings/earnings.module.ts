import { Module } from '@nestjs/common';
import { EarningsRepository } from './repositories/earnings.repository';
import { EarningsService } from './services/earnings.service';
import { PrismaModule } from '@src/database/prisma.module';
import { EarningsController } from './earnings.controller';
import { UsersModule } from '@src/users/users.module';
import { ExchangeModule } from '@src/infrastructure/exchange/exchange.module';

@Module({
  imports: [PrismaModule, UsersModule, ExchangeModule],
  controllers: [EarningsController],
  providers: [EarningsRepository, EarningsService],
  exports: [EarningsService],
})
export class EarningsModule {}
