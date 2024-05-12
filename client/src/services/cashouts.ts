import { serverService } from '@/services/server';
import { AxiosInstance } from 'axios';

export class CashoutsService {
  constructor(private readonly client: AxiosInstance) {}

  async getAvailableBalance(accessToken: string): Promise<{ balance: number }> {
    const res = await this.client.get('/cashouts/balance', {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    return res.data;
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

  async getHistory(accessToken: string): Promise<any> {
    const res = await this.client.get('/cashouts/history', {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    return res.data;
  }

  async getCurrencies(accessToken: string): Promise<any> {
    const res = await this.client.get('/cashouts/currencies', {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    return res.data;
  }
}

export const cashoutsService = new CashoutsService(serverService.client);
