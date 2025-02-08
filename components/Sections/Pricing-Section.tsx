import React from 'react'
import { tiers } from '@/app/pricing/pricing';
import { Check } from "lucide-react";
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

function PricingSection() {
  return (
    <div>
          <div className="mt-20 grid grid-cols-1 gap-8 lg:grid-cols-3">
          {tiers.map((tier) => (
            <Card 
              key={tier.name}
              className={`relative flex flex-col rounded-2xl ${
                tier.highlighted 
                  ? 'border-2 border-primary shadow-lg scale-105' 
                  : 'border border-neutral-200 dark:border-neutral-800'
              }`}
            >
              {tier.highlighted && (
                <div className="absolute -top-5 left-0 right-0 mx-auto w-32 rounded-full bg-primary px-3 py-2 text-sm font-medium text-primary-foreground text-center">
                  Popular
                </div>
              )}

              <div className="p-8">
                <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
                  {tier.name}
                </h2>
                <p className="mt-4 text-sm text-neutral-600 dark:text-neutral-400">
                  {tier.description}
                </p>
                <p className="mt-8">
                  <span className="text-4xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
                    {tier.price}
                  </span>
                  {tier.price !== "Custom" && (
                    <span className="text-base text-neutral-600 dark:text-neutral-400">/month</span>
                  )}
                </p>

                <ul className="mt-8 space-y-4">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex items-center">
                      <Check className="h-5 w-5 text-primary" />
                      <span className="ml-3 text-neutral-600 dark:text-white">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                <Button 
                  className={`mt-8 w-full ${
                    tier.highlighted 
                      ? 'bg-primary hover:bg-primary/90' 
                      : 'bg-neutral-900 hover:bg-neutral-800 dark:bg-white dark:hover:text-white dark:hover:bg-neutral-700'
                  }`}
                >
                  {tier.cta}
                </Button>
              </div>
            </Card>
          ))}
        </div>
    </div>
  )
}

export default PricingSection
