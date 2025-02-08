"use client";

import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export default function Billing() {
  const form = useForm({
    defaultValues: {
      plan: "free",
      credits: "0"
    }
  });

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <div className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Billing & Credits</h1>
          <p className="text-muted-foreground">
            Manage your subscription plan and purchase credits
          </p>
        </div>

        <div className="rounded-lg border border-neutral-200 p-6 dark:border-neutral-800">
          <h3 className="text-lg font-semibold">Subscription Plans</h3>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            Choose the plan that best fits your needs
          </p>

          <Form {...form}>
            <div className="mt-6 space-y-6">
              <FormField
                control={form.control}
                name="plan"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="grid grid-cols-1 gap-6 md:grid-cols-3"
                      >
                        <Card className="relative p-6">
                          <RadioGroupItem value="free" className="absolute right-4 top-4" />
                          <div className="space-y-2">
                            <h4 className="font-semibold">Free</h4>
                            <p className="text-sm text-neutral-500">$0/month</p>
                            <ul className="text-sm space-y-2">
                              <li>100 credits/month</li>
                              <li>Basic features</li>
                              <li>Community support</li>
                            </ul>
                          </div>
                        </Card>
                        <Card className="relative p-6">
                          <RadioGroupItem value="pro" className="absolute right-4 top-4" />
                          <div className="space-y-2">
                            <h4 className="font-semibold">Pro</h4>
                            <p className="text-sm text-neutral-500">$29/month</p>
                            <ul className="text-sm space-y-2">
                              <li>1000 credits/month</li>
                              <li>Advanced features</li>
                              <li>Priority support</li>
                            </ul>
                          </div>
                        </Card>
                        <Card className="relative p-6">
                          <RadioGroupItem value="enterprise" className="absolute right-4 top-4" />
                          <div className="space-y-2">
                            <h4 className="font-semibold">Enterprise</h4>
                            <p className="text-sm text-neutral-500">Custom pricing</p>
                            <ul className="text-sm space-y-2">
                              <li>Unlimited credits</li>
                              <li>Custom features</li>
                              <li>Dedicated support</li>
                            </ul>
                          </div>
                        </Card>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </Form>
        </div>

        <div className="rounded-lg border border-neutral-200 p-6 dark:border-neutral-800">
          <h3 className="text-lg font-semibold">Purchase Additional Credits</h3>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            Need more credits? Purchase them here
          </p>

          <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
            <Card className="p-6">
              <div className="space-y-2">
                <h4 className="font-semibold">100 Credits</h4>
                <p className="text-sm text-neutral-500">$10</p>
                <Button className="w-full">Purchase</Button>
              </div>
            </Card>
            <Card className="p-6">
              <div className="space-y-2">
                <h4 className="font-semibold">500 Credits</h4>
                <p className="text-sm text-neutral-500">$45</p>
                <Button className="w-full">Purchase</Button>
              </div>
            </Card>
            <Card className="p-6">
              <div className="space-y-2">
                <h4 className="font-semibold">1000 Credits</h4>
                <p className="text-sm text-neutral-500">$80</p>
                <Button className="w-full">Purchase</Button>
              </div>
            </Card>
          </div>
        </div>

        <div className="rounded-lg border border-neutral-200 p-6 dark:border-neutral-800">
          <h3 className="text-lg font-semibold">Billing History</h3>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            View your past transactions
          </p>

          <div className="mt-6">
            <p className="text-sm text-neutral-500">No transactions yet</p>
          </div>
        </div>
      </div>
    </div>
  );
}
