import { Controller, Get, Post, UseGuards } from '@nestjs/common';
import { EarningsService } from '@src/earnings/services/earnings.service';
import { CurrentUser } from '@src/users/decorators/current-user.decorator';
import { AuthGuard } from '@src/users/guards/auth.guard';
import { AuthUser } from '@src/users/middlewares/current-user.middleware';
import { CashoutsService } from './services/cashouts.service';
import { ExchangeService } from '@src/infrastructure/exchange/exchange.service';

@Controller('cashouts')
export class CashoutsController {
  constructor(
    private readonly earningsService: EarningsService,
    private readonly cashoutsService: CashoutsService,
    private readonly exchangeService: ExchangeService,
  ) {}

  @Get()
  @UseGuards(AuthGuard)
  async getTransactions(@CurrentUser() user: AuthUser) {
    const cashouts = await this.cashoutsService.findByUserId(user.id);
    return { cashouts: cashouts };
  }

  @Post()
  @UseGuards(AuthGuard)
  createCashout(@CurrentUser() user: AuthUser) {
    return { user: user };
  }

  @Get('balance')
  @UseGuards(AuthGuard)
  async getBalance(@CurrentUser() user: AuthUser) {
    // fetch earnings and cashouts for the user. Balance is earnings - cashouts (success or pending)
    const [earnings, cashouts] = await Promise.all([
      this.earningsService.sumByUserId(user.id),
      this.cashoutsService.sumByUserIdSuccessOrPending(user.id),
    ]);

    return { balance: earnings - cashouts };
  }

  @Get('currencies')
  @UseGuards(AuthGuard)
  async getCurrencies() {
    const currencies = await this.exchangeService.getSupportedCurrencies();
    return { currencies: currencies };
  }
}
