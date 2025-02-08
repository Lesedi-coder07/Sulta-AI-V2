'use client'
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { tiers } from "./pricing";
import Navbar from "@/components/layout/Navbar";

export default function Home() {
  return ( <>
  <Navbar/>
   
    <main className="min-h-screen ">
      <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100 sm:text-5xl lg:text-6xl">
            Simple, transparent pricing
          </h1>
          <p className="mt-4 text-xl text-neutral-600 dark:text-neutral-400">
            Choose the perfect plan for your AI automation needs
          </p>
        </div>

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
                      <span className="ml-3 text-neutral-600 dark:text-neutral-400">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                <Button 
                  className={`mt-8 w-full ${
                    tier.highlighted 
                      ? 'bg-primary hover:bg-primary/90' 
                      : 'bg-neutral-900 hover:bg-neutral-800 dark:bg-neutral-800 dark:hover:bg-neutral-700'
                  }`}
                >
                  {tier.cta}
                </Button>
              </div>
            </Card>
          ))}
        </div>

        <div className="mt-20 text-center">
          <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
            Trusted by leading companies worldwide
          </h2>
          <div className="mt-8 flex justify-center space-x-12 grayscale opacity-50">
            {/* Add company logos here if needed */}
          </div>
        </div>

        <div className="mt-20 rounded-2xl bg-neutral-900 dark:bg-neutral-800 p-8 lg:p-12">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-white lg:text-3xl">
              Need a custom solution?
            </h2>
            <p className="mt-4 text-lg text-neutral-300">
              Contact our sales team for a tailored package that meets your specific requirements
            </p>
            <Button className="mt-8 bg-white text-neutral-900 hover:bg-neutral-100">
              Contact Sales
            </Button>
          </div>
        </div>
      </div>
    </main> 
    </>
  );
}