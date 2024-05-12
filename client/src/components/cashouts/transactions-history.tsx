import { useAuth } from '@/auth/use-auth';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Cashout, cashoutsService } from '@/services/cashouts';
import { useEffect, useState } from 'react';

export function TransactionsHistory() {
  const { getToken } = useAuth();
  const [cashouts, setCashouts] = useState<Cashout[]>([]);

  useEffect(() => {
    async function fetchHistory() {
      const token = await getToken();
      if (!token) return;

      setCashouts(await cashoutsService.getCashoutsHistory(token));
    }

    fetchHistory();
  }, [getToken]);

  return (
    <Table>
      <TableHeader>
        <TableRow className="hover:bg-white">
          <TableHead colSpan={3}>History</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {cashouts.map((cashout) => (
          <TableRow key={cashout.id}>
            <TableCell className="font-medium">
              <div className="space-y-1">
                <p>{cashout.createdAt.toDateString()}</p>
                <p className="font-normal">{cashout.status}</p>
              </div>
            </TableCell>
            <TableCell className="hidden">{cashout.status}</TableCell>

            <TableCell className="text-right text-nowrap">
              {cashout.amount} {cashout.currency}
            </TableCell>
          </TableRow>
        ))}

        {cashouts.length === 0 && (
          <div className="py-4">
            <p className="text-center">No transactions yet</p>
          </div>
        )}
      </TableBody>
    </Table>
  );
}
