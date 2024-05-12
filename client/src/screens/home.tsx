import { useAuth } from '@/auth/use-auth';
import { BrandLogo } from '@/components/brand/logo';
import { AvailableBalance } from '@/components/cashouts/available-balance';
import { TransactionsHistory } from '@/components/cashouts/transactions-history';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

export function HomeScreen() {
  const { logout } = useAuth();

  return (
    <div>
      {/* Header. Balance and cashout button */}
      <div className="bg-blue-100 px-4">
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
              <AvailableBalance />
            </div>

            <Link to="/cashout" className="block">
              <Button className="w-full">Cash out</Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-3xl pt-4 pb-20 mx-auto">
        <TransactionsHistory />
      </div>
    </div>
  );
}
