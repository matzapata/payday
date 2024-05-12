import { Button } from '@/components/ui/button';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Link } from 'react-router-dom';
import { AvailableBalance } from '@/components/cashouts/available-balance';
import { useCurrencies } from '@/hooks/use-currencies';
import { useState } from 'react';
import { useAvailableBalance } from '@/hooks/use-available-balance';
import { cashoutsService } from '@/services/cashouts';
import { useAuth } from '@/auth/use-auth';

const formSchema = z.object({
  amount: z.coerce.number().positive(),
  currency: z.string(),
});

export function CashoutScreen() {
  const { getToken } = useAuth();
  const currencies = useCurrencies();
  const balances = useAvailableBalance();
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {},
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);

    try {
      const token = await getToken();
      if (!token) return window.alert('You need to login first.');

      await cashoutsService.requestCashout(
        token,
        values.amount,
        values.currency,
      );
      setSuccess(true);
    } catch (error) {
      window.alert('An error occurred. Please try again later.');
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="bg-blue-100 h-screen w-screen px-4 flex justify-center items-center">
        <div className="max-w-lg text-center">
          <div className="space-y-1">
            <h1 className="text-lg font-bold">
              🎉 Your money is on the way! 🎉{' '}
            </h1>
            <p>
              It may take up to 2 working days to complete the payment. You can
              always check the status from the homepage.
            </p>
          </div>
          <Link to={'/'} className="mt-4 block">
            <Button>Continue</Button>
          </Link>
        </div>
      </div>
    );
  } else {
    return (
      <>
        <div className="bg-blue-100 px-4">
          <div className="max-w-3xl mx-auto">
            <div className="flex justify-between items-center py-4">
              <h1 className="font-bold">Cashout</h1>
              <Link to="/">
                <Button variant="link">Back</Button>
              </Link>
            </div>

            {/* Available balance */}
            <div className="space-y-1 pt-6 pb-10">
              <p className="font-medium">Available wages</p>
              <AvailableBalance
                balance={balances.balance}
                loading={balances.loading}
              />
            </div>
          </div>
        </div>

        <div className="max-w-3xl mx-auto py-10 px-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="currency"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Currency</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Currency" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {currencies.currencies.map((currency) => (
                            <SelectItem key={currency} value={currency}>
                              {currency}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="amount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Amount</FormLabel>
                      <FormControl>
                        <Input placeholder="Amount" type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Button type="submit" disabled={loading}>
                {loading ? 'Loading...' : 'Cashout'}
              </Button>
            </form>
          </Form>
        </div>
      </>
    );
  }
}
