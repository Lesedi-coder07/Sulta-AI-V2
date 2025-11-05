import React from 'react'
import { tiers } from '@/app/pricing/pricing';
import { Check } from "lucide-react";
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

function PricingSection() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
        {tiers.map((tier) => (
          <Card 
            key={tier.name}
            className={`relative flex flex-col rounded-3xl overflow-hidden transition-all duration-300 ${
              tier.highlighted 
                ? 'border-2 border-blue-500 dark:border-blue-500 shadow-2xl shadow-blue-500/20 scale-105 bg-gradient-to-br from-blue-50 to-white dark:from-blue-950/30 dark:to-neutral-900' 
                : 'border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 hover:shadow-xl hover:-translate-y-1'
            }`}
          >
            {tier.highlighted && (
              <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-blue-600 via-blue-500 to-blue-600 px-4 py-2 text-center">
                <span className="text-sm font-bold text-white">⭐ Most Popular</span>
              </div>
            )}

            <div className={`p-8 ${tier.highlighted ? 'pt-16' : 'pt-8'}`}>
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-neutral-900 dark:text-white mb-2">
                  {tier.name}
                </h3>
                <p className="text-neutral-600 dark:text-neutral-400 text-sm leading-relaxed">
                  {tier.description}
                </p>
              </div>

              <div className="mb-8">
                <div className="flex items-end gap-2">
                  <span className="text-5xl font-bold text-neutral-900 dark:text-white">
                    {tier.price}
                  </span>
                  {tier.price !== "Custom" && tier.price !== "Free" && tier.price !== "Pay as you go" && (
                    <span className="text-lg text-neutral-600 dark:text-neutral-400 font-medium mb-2">
                      /month
                    </span>
                  )}
                </div>
              </div>

              <Button 
                className={`w-full mb-8 rounded-full py-6 text-lg font-semibold shadow-lg transition-all duration-300 ${
                  tier.highlighted 
                    ? 'bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white shadow-blue-500/30 hover:shadow-blue-500/50 hover:scale-105' 
                    : 'bg-neutral-900 hover:bg-neutral-800 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-100 text-white hover:scale-105'
                }`}
              >
                {tier.cta}
              </Button>

              <div className="space-y-4">
                <div className="text-sm font-semibold text-neutral-900 dark:text-white mb-4">
                  What's included:
                </div>
                {tier.features.map((feature) => (
                  <div key={feature} className="flex items-start gap-3">
                    <div className={`flex items-center justify-center w-5 h-5 rounded-full mt-0.5 flex-shrink-0 ${
                      tier.highlighted 
                        ? 'bg-blue-500 text-white' 
                        : 'bg-blue-100 dark:bg-blue-950'
                    }`}>
                      <Check className={`w-3 h-3 ${tier.highlighted ? 'text-white' : 'text-blue-600 dark:text-blue-400'}`} />
                    </div>
                    <span className="text-neutral-700 dark:text-neutral-300 text-sm leading-relaxed">
                      {feature}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Value Proposition */}
      <div className="mt-16 text-center">
        <p className="text-sm text-neutral-600 dark:text-neutral-400">
          All plans include access to our core features. No credit card required to start.
        </p>
      </div>
    </div>
  )
}

export default PricingSection
