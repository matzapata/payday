import { Currency } from '@prisma/client';

export abstract class ExchangeProvider {
  abstract getSupportedCurrencies(token: string): Promise<Currency[]>;

  abstract quote(from: Currency, to: Currency, amount: number): Promise<number>;
}
