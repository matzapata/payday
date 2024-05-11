import { useAuth } from '@/auth/use-auth';
import { BrandLogo } from '@/components/brand/logo';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Link } from 'react-router-dom';

const invoices = [
  {
    invoice: 'INV001',
    paymentStatus: 'Paid',
    totalAmount: '$250.00',
    paymentMethod: 'Credit Card',
  },
  {
    invoice: 'INV002',
    paymentStatus: 'Pending',
    totalAmount: '$150.00',
    paymentMethod: 'PayPal',
  },
  {
    invoice: 'INV003',
    paymentStatus: 'Unpaid',
    totalAmount: '$350.00',
    paymentMethod: 'Bank Transfer',
  },
  {
    invoice: 'INV004',
    paymentStatus: 'Paid',
    totalAmount: '$450.00',
    paymentMethod: 'Credit Card',
  },
  {
    invoice: 'INV005',
    paymentStatus: 'Paid',
    totalAmount: '$550.00',
    paymentMethod: 'PayPal',
  },
  {
    invoice: 'INV006',
    paymentStatus: 'Pending',
    totalAmount: '$200.00',
    paymentMethod: 'Bank Transfer',
  },
  {
    invoice: 'INV007',
    paymentStatus: 'Unpaid',
    totalAmount: '$300.00',
    paymentMethod: 'Credit Card',
  },
];

export function HomeScreen() {
  const { logout } = useAuth();

  return (
    <div>
      {/* Header. Balance and cashout button */}
      <div className="bg-blue-100">
        <div className="max-w-3xl mx-auto">
          <div className="justify-between py-4 flex items-center">
            <BrandLogo />
            <Button variant={'link'} onClick={logout}>
              Logout
            </Button>
          </div>

          <div className="space-y-8 py-8">
            {/* Current balance */}
            <div className="space-y-1 text-center">
              <p className="font-medium">Your earned wages</p>
              <h1 className="text-4xl font-bold">$500.000</h1>
              <p>Your available wages will reset on April 1st</p>
            </div>

            <Link to="/cashout" className="block">
              <Button className="w-full">Cash out</Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-3xl pt-4 pb-20 mx-auto">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-white">
              <TableHead colSpan={4}>History</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {invoices.map((invoice) => (
              <TableRow key={invoice.invoice}>
                <TableCell className="font-medium">{invoice.invoice}</TableCell>
                <TableCell>{invoice.paymentStatus}</TableCell>
                <TableCell>{invoice.paymentMethod}</TableCell>
                <TableCell className="text-right">
                  {invoice.totalAmount}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
