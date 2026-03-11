import type { Metadata } from 'next';
import Link from 'next/link';
import { Check } from 'lucide-react';

import { tiers } from '@/app/pricing/pricing';
import Footer from '@/components/layout/Footer';
import Navbar from '@/components/layout/Navbar';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export const metadata: Metadata = {
  title: 'Sulta AI Pricing',
  description: 'Pricing for building, hosting, and deploying AI agents.',
};

const pricingSignals = [
  { label: 'Free plan', value: '500K tokens' },
  { label: 'Pro plan', value: '10M tokens' },
  { label: 'Billing model', value: 'Token based' },
  { label: 'API access', value: 'Included on Pro' },
];

const faqs = [
  {
    title: 'Can we start small and scale later?',
    description:
      'Yes. Start on the Free tier with 500K monthly tokens, then move to Pro when you need more capacity.',
  },
  {
    title: 'How is usage priced?',
    description:
      'Pricing is token-based. Your monthly token allowance is tied to the plan, rather than message-count billing.',
  },
  {
    title: 'What does Pro include?',
    description:
      'Pro includes 10M monthly tokens, API access, detailed usage analytics, and priority email support.',
  },
  {
    title: 'Can I change plans anytime?',
    description:
      'Yes. You can switch plans as your team usage changes.',
  },
];

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-[#03060D] text-slate-100">
      <Navbar />

      <main className="relative overflow-hidden pb-24 pt-16">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-[-120px] top-14 h-[560px] w-[300px] rounded-full bg-white/8 blur-[140px]" />
          <div className="absolute right-[-120px] top-40 h-[540px] w-[260px] rounded-full bg-slate-300/8 blur-[150px]" />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:48px_48px] opacity-25" />
        </div>

        <section className="relative mx-auto max-w-6xl px-4 pb-24 pt-12 text-center sm:px-6 lg:px-8 lg:pt-20">
          <div className="mx-auto max-w-4xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/[0.04] px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-slate-300">
              Pricing
            </div>

            <h1 className="mt-8 text-[clamp(2.35rem,6vw,4.7rem)] font-semibold leading-[1.04] text-white [text-wrap:balance]">
              Token-based pricing
              <br />
              that scales cleanly
            </h1>

            <p className="mx-auto mt-8 max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">
              Start with 500K monthly tokens for free, then move to 10M monthly tokens on Pro. One model, one quota,
              and no message-based pricing noise.
            </p>

            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <Link href="/signup">
                <Button className="h-11 rounded-lg border border-white/15 bg-white px-6 text-sm font-semibold text-slate-950 hover:bg-slate-200">
                  Start Free
                </Button>
              </Link>
              <Link href="/chat">
                <Button
                  variant="outline"
                  className="h-11 rounded-lg border-white/20 bg-transparent px-6 text-sm text-slate-200 hover:bg-white/5 hover:text-white"
                >
                  Try Demo
                </Button>
              </Link>
            </div>
          </div>

          <div className="mx-auto mt-16 w-full max-w-4xl rounded-2xl border border-white/10 bg-[#070D18]/70 px-6 py-7 backdrop-blur-sm sm:px-8 sm:py-10">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-300">Plan Signals</p>

            <div className="mt-8 grid gap-8 sm:grid-cols-2 xl:grid-cols-4">
              {pricingSignals.map((item) => (
                <div key={item.label} className="text-center">
                  <p className="text-xl font-semibold text-white sm:text-2xl">{item.value}</p>
                  <p className="mt-2 text-[11px] uppercase tracking-[0.14em] text-slate-500">{item.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="relative mx-auto max-w-7xl px-4 pb-24 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-300">Plans</p>
            <h2 className="mt-5 text-3xl font-semibold text-white sm:text-4xl">Choose the token volume you need</h2>
            <p className="mt-5 text-slate-400">
              Free is enough to get started. Pro is for technical teams running higher-volume agent usage.
            </p>
          </div>

          <div className="mt-14 grid grid-cols-1 gap-8 lg:grid-cols-2">
            {tiers.map((tier) => (
              <Card
                key={tier.name}
                className={`relative overflow-hidden rounded-[26px] border p-0 ${
                  tier.highlighted
                    ? 'border-white/20 bg-gradient-to-b from-white/[0.08] to-[#111827] shadow-[0_16px_60px_rgba(15,23,42,0.35)]'
                    : 'border-white/10 bg-[#090F1A]/85'
                }`}
              >
                {tier.highlighted && (
                  <div className="border-b border-white/10 bg-white/[0.05] px-5 py-2.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-300">
                    Most value for growing teams
                  </div>
                )}

                <div className="p-6 sm:p-7">
                  <h3 className="text-2xl font-semibold text-white">{tier.name}</h3>
                  <p className="mt-3 min-h-[52px] text-sm leading-7 text-slate-300">{tier.description}</p>

                  <div className="mt-7 flex items-end gap-2">
                    <p className="text-4xl font-semibold text-white">{tier.price}</p>
                    {tier.price !== 'Custom' && tier.price !== 'Free' && tier.price !== 'Pay as you go' && (
                      <span className="pb-1.5 text-sm text-slate-400">/month</span>
                    )}
                  </div>

                  <Link href="/signup">
                    <Button
                      className={`mt-7 h-11 w-full rounded-lg text-sm font-semibold ${
                        tier.highlighted
                          ? 'border border-white/15 bg-white text-slate-950 hover:bg-slate-200'
                          : 'border border-white/20 bg-white/5 text-white hover:bg-white/10'
                      }`}
                    >
                      {tier.cta}
                    </Button>
                  </Link>

                  <div className="mt-8 space-y-3">
                    {tier.features.map((feature) => (
                      <div key={feature} className="flex items-start gap-3 rounded-lg border border-white/10 bg-[#050a13]/80 px-4 py-3">
                        <span
                          className={`mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-full ${
                            tier.highlighted ? 'bg-white text-slate-950' : 'bg-white/10 text-slate-200'
                          }`}
                        >
                          <Check className="h-3.5 w-3.5" />
                        </span>
                        <p className="text-sm text-slate-300">{feature}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </section>

        <section className="relative mx-auto max-w-6xl px-4 pb-24 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-300">FAQ</p>
            <h2 className="mt-5 text-3xl font-semibold text-white sm:text-4xl">What teams usually ask</h2>
          </div>

          <div className="mt-14 overflow-hidden rounded-2xl border border-white/10 bg-[#070D18]/70">
            {faqs.map((faq) => (
              <article
                key={faq.title}
                className="grid gap-3 border-t border-white/10 px-6 py-6 first:border-t-0 md:grid-cols-[0.75fr_1.25fr] md:gap-8"
              >
                <h3 className="text-base font-semibold text-white">{faq.title}</h3>
                <p className="text-sm leading-7 text-slate-400">{faq.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="relative mx-auto max-w-7xl px-4 pt-8 sm:px-6 lg:px-8">
          <div className="rounded-[28px] border border-white/10 bg-gradient-to-r from-[#101728] via-[#11192d] to-[#10202b] p-10 text-center sm:p-12">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-300">Ready when you are</p>
            <h3 className="mt-5 text-3xl font-semibold text-white sm:text-4xl">Start free, scale when usage grows</h3>
            <p className="mx-auto mt-5 max-w-2xl text-slate-300">
              Begin with 500K monthly tokens, then move to 10M monthly tokens when your team needs higher throughput.
            </p>
            <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
              <Link href="/signup">
                <Button className="h-11 rounded-lg border border-white/15 bg-white px-6 text-slate-950 hover:bg-slate-200">
                  Start Free
                </Button>
              </Link>
              <Link href="/learn-more">
                <Button
                  variant="outline"
                  className="h-11 rounded-lg border-white/20 bg-transparent px-6 text-slate-100 hover:bg-white/5"
                >
                  Explore Product
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
