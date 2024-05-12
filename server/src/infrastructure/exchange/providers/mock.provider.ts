import { Currency } from '@prisma/client';

export class ExchangeMockProvider {
  getSupportedCurrencies(): Promise<Currency[]> {
    return Promise.resolve(Object.values(Currency));
  }

  quote(from: Currency, to: Currency, amount: number): Promise<number> {
    const rates = {
      USD: { ARS: 100 },
      ARS: { USD: 0.01 },
    };

    if (!rates[from] || !rates[from][to]) {
      return Promise.reject('Unsupported currency pair');
    }

    return Promise.resolve(rates[from][to] * amount);
  }
}
