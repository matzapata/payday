import { useAuth } from '@/auth/use-auth';
import { cashoutsService } from '@/services/cashouts';
import { useEffect, useState } from 'react';

export function useAvailableBalance() {
  const { getToken } = useAuth();
  const [loading, setLoading] = useState(true);
  const [balance, setBalance] = useState(0);

  useEffect(() => {
    async function fetchBalance() {
      const token = await getToken();
      if (!token) return;

      const balance = await cashoutsService.getAvailableBalance(token);
      setBalance(balance);
      setLoading(false);
    }

    fetchBalance();
  }, [getToken]);

  return { balance, loading };
}
