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

const formSchema = z.object({
  amount: z.coerce.number().positive(),
  // TODO: This won't scale, what if we want to support more currencies?
  // TODO: fetch from the server
  currency: z.string(),
});

export function CashoutScreen() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {},
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    // This will be type-safe and validated.
    console.log(values);
  }

  // success
  return (
    <div className="bg-blue-100 h-screen w-screen flex justify-center items-center">
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

  // form
  return (
    <div>
      <div className="bg-blue-100">
        <div className="max-w-3xl mx-auto">
          <div className="flex justify-between py-4">
            <h1 className="font-bold">Cashout</h1>
            <Button variant="link">Back</Button>
          </div>

          {/* Available balance */}
          <div className="space-y-1 py-6">
            <p className="font-medium">Available wages</p>
            <h1 className="text-3xl font-bold">$500.000</h1>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto py-10">
        {/* Form */}
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
                        <SelectItem value="USD">USD</SelectItem>
                        <SelectItem value="ARS">ARS</SelectItem>
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

            <Button type="submit">Cashout</Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
