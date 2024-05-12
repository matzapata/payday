import {
  BadRequestException,
  Body,
  Controller,
  Post,
  UseGuards,
} from '@nestjs/common';
import { EarningsService } from './services/earnings.service';
import { UsersService } from '@src/users/services/users.service';
import { CreateEarningDto } from './dto/create-earning.dto';
import { Currency } from '@prisma/client';
import { ExchangeService } from '@src/infrastructure/exchange/exchange.service';
import { AdminGuard } from '@src/users/guards/admin.guard';

@Controller('earnings')
export class EarningsController {
  constructor(
    private readonly exchangeService: ExchangeService,
    private readonly earningsService: EarningsService,
    private readonly usersService: UsersService,
  ) {}

  @Post()
  @UseGuards(AdminGuard)
  async create(@Body() body: CreateEarningDto) {
    const forUser = await this.usersService.findByEmail(body.for);
    if (!forUser) {
      throw new BadRequestException('User not found');
    }

    const currencies = await this.exchangeService.getSupportedCurrencies();
    if (!currencies.includes(body.currency as Currency)) {
      throw new BadRequestException(
        `Currency ${body.currency} is not supported`,
      );
    }

    return this.earningsService.createForUserId(forUser.id, {
      amount: body.amount,
      currency: body.currency as Currency,
    });
  }
}
