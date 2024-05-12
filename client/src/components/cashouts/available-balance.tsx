import { useAuth } from '@/auth/use-auth';
import { cn } from '@/lib/utils';
import { cashoutsService } from '@/services/cashouts';
import { useEffect, useState } from 'react';

export function AvailableBalance(props: { className?: string }) {
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

  return (
    <p
      className={cn(
        'text-4xl font-bold',
        loading && 'animate-pulse',
        props.className,
      )}
    >
      ${balance.toFixed(2)}
    </p>
  );
}
