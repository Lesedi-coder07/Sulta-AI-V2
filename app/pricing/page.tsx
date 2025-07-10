'use client'
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { tiers } from "./pricing";
import Navbar from "@/components/layout/Navbar";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen  transition-colors duration-300">
        <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-extrabold tracking-tight text-neutral-900 dark:text-neutral-100 sm:text-5xl lg:text-6xl drop-shadow-sm">
              Simple, transparent pricing
            </h1>
            <p className="mt-4 text-xl text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
              Choose the perfect plan for your AI automation needs
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 gap-10 md:grid-cols-2 lg:gap-16">
            {tiers.map((tier) => (
              <Card
                key={tier.name}
                className={`relative flex flex-col rounded-3xl shadow-xl overflow-hidden border-0 transition-transform duration-200 hover:scale-[1.03] ${
                  tier.highlighted
                    ? 'ring-2 ring-primary/80 bg-white dark:bg-neutral-900 scale-105 shadow-2xl'
                    : 'border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900'
                }`}
              >
               
                

                <div className="p-10 flex flex-col flex-1">
                  <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-2 tracking-tight">
                    {tier.name}
                  </h2>
                  <p className="mt-2 text-base text-neutral-600 dark:text-neutral-400 min-h-[48px]">
                    {tier.description}
                  </p>
                  <div className="mt-8 flex items-end gap-2">
                    <span className="text-5xl font-extrabold tracking-tight text-neutral-900 dark:text-neutral-100">
                      {tier.price}
                    </span>
                    {tier.price !== "Custom" && (
                      <span className="text-lg text-neutral-500 dark:text-neutral-400 font-medium mb-1">
                        /month
                      </span>
                    )}
                  </div>

                  <ul className="mt-8 space-y-4">
                    {tier.features.map((feature) => (
                      <li key={feature} className="flex items-center text-base">
                        <span className="flex items-center justify-center h-7 w-7 rounded-full bg-primary/10 dark:bg-primary/20 mr-3">
                          <Check className="h-5 w-5 text-primary" />
                        </span>
                        <span className="text-neutral-700 dark:text-neutral-300">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button
                    className={`mt-10 w-full py-3 text-lg font-semibold rounded-xl shadow-md transition-colors duration-150 ${
                      tier.highlighted
                        ? 'bg-gradient-to-r from-black to-blue-500 text-white hover:from-primary/90 hover:to-blue-500/90'
                        : 'bg-neutral-900 hover:bg-neutral-800 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-white'
                    }`}
                  >
                    {tier.cta}
                  </Button>
                </div>
              </Card>
            ))}
          </div>

          <div className="mt-24 text-center">
            <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-4">
              Trusted by leading companies worldwide
            </h2>
            <div className="mt-8 flex flex-wrap justify-center gap-10 grayscale opacity-60">
              {/* Example company logos */}
              <img src="/logos/google.svg" alt="Google" className="h-10 w-auto" />
              <img src="/logos/microsoft.svg" alt="Microsoft" className="h-10 w-auto" />
              <img src="/logos/amazon.svg" alt="Amazon" className="h-10 w-auto" />
              <img src="/logos/meta.svg" alt="Meta" className="h-10 w-auto" />
              {/* Add more logos as needed */}
            </div>
          </div>

          <div className="mt-24 rounded-3xl bg-gradient-to-br from-primary to-blue-600 dark:from-primary dark:to-blue-900 p-10 lg:p-16 shadow-2xl">
            <div className="text-center">
              <h2 className="text-3xl font-extrabold text-white mb-2 drop-shadow">
                Need a custom solution?
              </h2>
              <p className="mt-4 text-lg text-blue-100 max-w-2xl mx-auto">
                Contact our sales team for a tailored package that meets your specific requirements.
              </p>
              <Button className="mt-8 bg-white text-primary font-bold px-8 py-3 rounded-xl shadow-lg hover:bg-neutral-100 transition-colors duration-150">
                Contact Sales
              </Button>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}