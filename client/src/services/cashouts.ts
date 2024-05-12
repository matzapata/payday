import { serverService } from '@/services/server';
import { AxiosInstance } from 'axios';

export interface Cashout {
  id: string;
  amount: number;
  status: string;
  currency: string;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
}

export class CashoutsService {
  constructor(private readonly client: AxiosInstance) {}

  async getAvailableBalance(accessToken: string): Promise<number> {
    const res = await this.client.get('/cashouts/balance', {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    return res.data.balance;
  }

  async requestCashout(
    accessToken: string,
    amount: number,
    currency: string,
  ): Promise<any> {
    const res = await this.client.post(
      '/cashouts/request',
      { amount, currency },
      { headers: { Authorization: `Bearer ${accessToken}` } },
    );
    return res.data;
  }

  async getCashoutsHistory(accessToken: string): Promise<Cashout[]> {
    const res = await this.client.get('/cashouts', {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    return res.data.cashouts.map((cashout: any) => ({
      ...cashout,
      createdAt: new Date(cashout.createdAt),
      updatedAt: new Date(cashout.updatedAt),
    }));
  }

  async getCurrencies(accessToken: string): Promise<any> {
    const res = await this.client.get('/cashouts/currencies', {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    return res.data;
  }
}

export const cashoutsService = new CashoutsService(serverService.client);
