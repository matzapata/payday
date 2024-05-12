import { Module } from '@nestjs/common';
import { EarningsRepository } from './repositories/earnings.repository';
import { EarningsService } from './services/earnings.service';
import { PrismaModule } from '@src/database/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [],
  providers: [EarningsRepository, EarningsService],
  exports: [EarningsService],
})
export class EarningsModule {}
