import { cn } from '@/lib/utils';

export function AvailableBalance(props: {
  className?: string;
  loading: boolean;
  balance: number;
}) {
  return (
    <p
      className={cn(
        'text-4xl font-bold',
        props.loading && 'animate-pulse',
        props.className,
      )}
    >
      ${props.balance.toFixed(2)}
    </p>
  );
}
