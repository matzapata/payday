import { BrandLogo } from '@/components/brand/logo';
import { Button } from '@/components/ui/button';
import { useAuth } from './use-auth';

export function ProtectedRoute({ screen }: { screen: React.ReactNode }) {
  const { isAuthenticated, login, register } = useAuth();

  if (!isAuthenticated) {
    return (
      <div className="bg-blue-100 flex justify-center items-center h-screen">
        <div className="max-w-md text-center space-y-4">
          <div className="space-y-1">
            <BrandLogo />
            <p>
              With $PayDay, every day is pay day.
              <br /> Signin and claim your wages
            </p>
          </div>
          <div className="flex justify-between space-x-2">
            <Button
              variant={'secondary'}
              className="w-full"
              onClick={() => login()}
            >
              Login
            </Button>
            <Button className="w-full" onClick={() => register()}>
              Register
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return <>{screen}</>;
}
