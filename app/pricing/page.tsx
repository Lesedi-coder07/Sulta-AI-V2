'use client'
import { Check, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { tiers } from "./pricing";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Link from "next/link";

export default function PricingPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen transition-colors duration-300">
        {/* Hero Section */}
        <div className="relative overflow-hidden bg-gradient-to-b from-blue-50/50 via-white to-white dark:from-neutral-950 dark:via-neutral-900 dark:to-background">
          {/* Background Pattern */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#e5e7eb_1px,transparent_1px),linear-gradient(to_bottom,#e5e7eb_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#1f2937_1px,transparent_1px),linear-gradient(to_bottom,#1f2937_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)] opacity-20" />
          
          {/* Gradient Orbs */}
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000" />

          <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 rounded-full border border-blue-200 bg-blue-50/50 dark:bg-blue-950/30 dark:border-blue-900">
                <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                  Simple, Transparent Pricing
                </span>
              </div>

              {/* Headline */}
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6">
                <span className="bg-gradient-to-r from-neutral-900 to-neutral-700 dark:from-white dark:to-neutral-300 bg-clip-text text-transparent">
                  Choose Your
                </span>
                <br />
                <span className="bg-gradient-to-r from-blue-600 to-blue-500 bg-clip-text text-transparent">
                  Perfect Plan
                </span>
              </h1>
              
              <p className="mt-6 text-xl text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto leading-relaxed">
                Start free and scale as you grow. All plans include access to our powerful AI agent platform.
              </p>
            </div>

            {/* Pricing Cards */}
            <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-2 lg:gap-10 max-w-4xl mx-auto">
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
                    <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-blue-600 via-blue-500 to-blue-600 px-4 py-3 text-center">
                      <span className="text-sm font-bold text-white flex items-center justify-center gap-2">
                        <Sparkles className="w-4 h-4" />
                        Most Popular Choice
                      </span>
                    </div>
                  )}

                  <div className={`p-10 flex flex-col flex-1 ${tier.highlighted ? 'pt-20' : 'pt-10'}`}>
                    <h2 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100 mb-3 tracking-tight">
                      {tier.name}
                    </h2>
                    <p className="mt-2 text-base text-neutral-600 dark:text-neutral-400 min-h-[48px] leading-relaxed">
                      {tier.description}
                    </p>
                    
                    <div className="mt-8 flex items-end gap-2 mb-8">
                      <span className="text-6xl font-extrabold tracking-tight text-neutral-900 dark:text-neutral-100">
                        {tier.price}
                      </span>
                      {tier.price !== "Custom" && tier.price !== "Free" && tier.price !== "Pay as you go" && (
                        <span className="text-xl text-neutral-500 dark:text-neutral-400 font-medium mb-2">
                          /month
                        </span>
                      )}
                    </div>

                    <Button
                      className={`w-full py-6 text-lg font-semibold rounded-full shadow-lg transition-all duration-300 ${
                        tier.highlighted
                          ? 'bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white shadow-blue-500/30 hover:shadow-blue-500/50 hover:scale-105'
                          : 'bg-neutral-900 hover:bg-neutral-800 dark:bg-white dark:hover:bg-neutral-100 dark:text-neutral-900 text-white hover:scale-105'
                      }`}
                    >
                      {tier.cta}
                    </Button>

                    <ul className="mt-10 space-y-4 flex-1">
                      <div className="text-sm font-semibold text-neutral-900 dark:text-white mb-4">
                        Everything included:
                      </div>
                      {tier.features.map((feature) => (
                        <li key={feature} className="flex items-start text-base gap-3">
                          <span className={`flex items-center justify-center h-6 w-6 rounded-full mt-0.5 flex-shrink-0 ${
                            tier.highlighted
                              ? 'bg-blue-500'
                              : 'bg-blue-100 dark:bg-blue-950'
                          }`}>
                            <Check className={`h-4 w-4 ${tier.highlighted ? 'text-white' : 'text-blue-600 dark:text-blue-400'}`} />
                          </span>
                          <span className="text-neutral-700 dark:text-neutral-300 leading-relaxed">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* FAQ/Features Section */}
        <div className="relative py-24 bg-white dark:bg-background border-t border-neutral-200 dark:border-neutral-800">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 dark:text-white mb-4">
                Frequently Asked Questions
              </h2>
              <p className="text-lg text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
                Got questions? We've got answers.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              <Card className="p-6 border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
                <h3 className="font-bold text-lg text-neutral-900 dark:text-white mb-2">
                  Can I switch plans anytime?
                </h3>
                <p className="text-neutral-600 dark:text-neutral-400">
                  Yes! You can upgrade, downgrade, or cancel your plan at any time. Changes take effect immediately.
                </p>
              </Card>

              <Card className="p-6 border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
                <h3 className="font-bold text-lg text-neutral-900 dark:text-white mb-2">
                  Do I need a credit card for the free plan?
                </h3>
                <p className="text-neutral-600 dark:text-neutral-400">
                  No credit card required! Start building AI agents immediately with our generous free tier.
                </p>
              </Card>

              <Card className="p-6 border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
                <h3 className="font-bold text-lg text-neutral-900 dark:text-white mb-2">
                  What payment methods do you accept?
                </h3>
                <p className="text-neutral-600 dark:text-neutral-400">
                  We accept all major credit cards, PayPal, and can arrange invoicing for enterprise customers.
                </p>
              </Card>

              <Card className="p-6 border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
                <h3 className="font-bold text-lg text-neutral-900 dark:text-white mb-2">
                  Is there a limit on AI agents?
                </h3>
                <p className="text-neutral-600 dark:text-neutral-400">
                  Create unlimited AI agents on all plans. Usage limits apply to messages and tokens only.
                </p>
              </Card>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="relative py-24 overflow-hidden border-t border-neutral-200 dark:border-neutral-800">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-blue-500 to-blue-700" />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff15_1px,transparent_1px),linear-gradient(to_bottom,#ffffff15_1px,transparent_1px)] bg-[size:4rem_4rem]" />
          
          <div className="relative z-10 mx-auto max-w-4xl px-4 text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to Get Started?
            </h2>
            <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
              Join thousands of users building their AI workforce with Sulta AI today.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/signup">
                <Button size="lg" className="bg-white hover:bg-neutral-100 text-blue-600 px-8 py-6 text-lg rounded-full shadow-xl hover:shadow-2xl transition-all hover:scale-105">
                  Start Building Free
                </Button>
              </Link>
              <Link href="/chat">
                <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white/10 px-8 py-6 text-lg rounded-full transition-all hover:scale-105">
                  Explore AI Agents
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
