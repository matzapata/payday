import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CurrentUser } from '@src/users/decorators/current-user.decorator';
import { AuthGuard } from '@src/users/guards/auth.guard';
import { AuthUser } from '@src/users/middlewares/current-user.middleware';
import { CashoutsService } from './services/cashouts.service';
import { ExchangeService } from '@src/infrastructure/exchange/exchange.service';
import { CreateCashoutDto } from './dto/create-cashout.dto';
import { CashoutStatus, Currency } from '@prisma/client';
import { PrismaTxClient } from '@src/database/prisma.service';

@Controller('cashouts')
export class CashoutsController {
  constructor(
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
  async createCashout(
    @CurrentUser() user: AuthUser,
    @Body() body: CreateCashoutDto,
  ) {
    // check currency is supported
    const currencies = await this.exchangeService.getSupportedCurrencies();
    if (!currencies.includes(body.currency as Currency)) {
      throw new Error(`Currency ${body.currency} is not supported`);
    }
    const targetCurrency = body.currency as Currency;

    // begin transaction
    const cashout = await this.cashoutsService
      .createForUserId(
        user.id,
        {
          amount: body.amount,
          currency: targetCurrency,
          user: { connect: { id: user.id } },
          status: CashoutStatus.PENDING,
        },
        async (txClient: PrismaTxClient) => {
          // for each currency, sum earnings and convert, sum cashouts and convert, then convert to target currency
          const availableForCashout =
            await this.cashoutsService.calculateAvailableForCashoutInTx(
              txClient,
              user.id,
              targetCurrency,
              currencies,
            );

          return availableForCashout >= body.amount;
        },
      )
      .catch(() => {
        // TODO: Better catch error
        throw new BadRequestException('Failed to create cashout');
      });

    return { cashout: cashout };
  }

  @Get('balance')
  @UseGuards(AuthGuard)
  async getBalance(@CurrentUser() user: AuthUser) {
    const currencies = await this.exchangeService.getSupportedCurrencies();
    const targetCurrency = Currency.USD;

    const balance = await this.cashoutsService.calculateAvailableForCashout(
      user.id,
      targetCurrency,
      currencies,
    );

    return { balance: balance };
  }

  @Get('currencies')
  @UseGuards(AuthGuard)
  async getCurrencies() {
    const currencies = await this.exchangeService.getSupportedCurrencies();
    return { currencies: currencies };
  }
}
