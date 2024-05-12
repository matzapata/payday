import { useAuth } from '@/auth/use-auth';
import { cashoutsService } from '@/services/cashouts';
import { useEffect, useState } from 'react';

export function useCurrencies() {
  const { getToken } = useAuth();
  const [currencies, setCurrencies] = useState<string[]>([]);

  // load up the currencies
  useEffect(() => {
    async function fetchCurrencies() {
      const token = await getToken();
      if (!token) return;

      setCurrencies(await cashoutsService.getCurrencies(token));
    }

    fetchCurrencies();
  }, []);

  return { currencies };
}
