import type { Metadata } from 'next';
import Link from 'next/link';
import { Check, CircleHelp, TrendingUp } from 'lucide-react';

import Footer from '@/components/layout/Footer';
import Navbar from '@/components/layout/Navbar';
import { tiers } from '@/app/pricing/pricing';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export const metadata: Metadata = {
  title: 'Sulta AI Pricing',
  description: 'Pricing for building, hosting, and deploying AI agents.',
};

const faqs = [
  {
    title: 'Can we start small and scale later?',
    description:
      'Yes. Start on the Free tier with 500K monthly tokens, then move to Pro when you need more capacity.',
  },
  {
    title: 'How is usage priced?',
    description:
      'Pricing is fully token-based. Your monthly token allowance is tied to your plan, with no message-based billing.',
  },
  {
    title: 'What does Pro include?',
    description:
      'Pro includes 10M monthly tokens plus API access, priority support, and usage analytics.',
  },
  {
    title: 'Can I change plans anytime?',
    description:
      'Yes. You can switch plans at any time as your team usage changes.',
  },
];

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-[#03060D] text-slate-100">
      <Navbar />

      <main className="relative overflow-hidden pb-14 pt-20">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-[-140px] top-24 h-[520px] w-[320px] rounded-full bg-[#fb923c]/18 blur-[150px]" />
          <div className="absolute right-[-100px] top-56 h-[460px] w-[280px] rounded-full bg-[#22d3ee]/12 blur-[140px]" />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:48px_48px] opacity-20" />
        </div>

        <section className="relative mx-auto max-w-7xl px-4 pb-12 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
            <article className="rounded-[28px] border border-white/10 bg-[#090F1A]/85 p-6 sm:p-7">
              <p className="inline-flex rounded-full border border-[#fdba74]/45 bg-[#fb923c]/12 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-[#fdba74]">
                Pricing
              </p>
              <h1 className="mt-4 text-[clamp(2rem,3.8vw,3.3rem)] font-semibold leading-tight text-white">
                Pricing for building
                <br />
                and deploying agents
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300 sm:text-base">
                Keep pricing simple with token-based plans. Start free with 500K tokens, then scale to 10M tokens on
                Pro for heavier workloads.
              </p>

              <div className="mt-5 grid gap-2.5 text-sm text-slate-300 sm:grid-cols-2">
                {[
                  'Simple token-based pricing',
                  '500K free tokens every month',
                  '10M monthly tokens on Pro',
                  'Same quota for app + API usage',
                ].map((item) => (
                  <div key={item} className="flex items-start gap-2 rounded-lg border border-white/10 bg-[#060B14]/80 p-2.5">
                    <Check className="mt-0.5 h-4 w-4 text-[#67e8f9]" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </article>

            <article className="rounded-[28px] border border-white/10 bg-[#090F1A]/85 p-6">
              <p className="text-sm font-semibold text-slate-300">Token Overview</p>
              <div className="mt-3 rounded-2xl border border-white/10 bg-[#060B14] p-3.5">
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.16em] text-slate-500">Pro Plan</p>
                    <p className="mt-1.5 text-2xl font-semibold text-white">$20 / month</p>
                  </div>
                  <span className="rounded-full bg-[#22d3ee]/15 px-3 py-1 text-xs font-semibold text-[#67e8f9]">
                    <TrendingUp className="mr-1 inline h-3.5 w-3.5" />
                    token based
                  </span>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-2.5">
                  <div className="rounded-lg border border-white/10 bg-[#050a13] p-3">
                    <p className="text-xs text-slate-500">Free plan</p>
                    <p className="mt-1 text-sm font-semibold text-white">500K tokens / month</p>
                  </div>
                  <div className="rounded-lg border border-white/10 bg-[#050a13] p-3">
                    <p className="text-xs text-slate-500">Pro plan</p>
                    <p className="mt-1 text-sm font-semibold text-white">10M tokens / month</p>
                  </div>
                </div>
              </div>

              <div className="mt-4 rounded-2xl border border-white/10 bg-[#060B14] p-3.5 text-sm text-slate-300">
                <p className="font-medium text-white">Need help choosing a plan?</p>
                <p className="mt-2 text-slate-400">
                  Choose based on monthly token volume. Upgrade when your team needs higher throughput.
                </p>
                <Link href="https://sultatech.com/book" target="_blank" rel="noreferrer noopener">
                  <Button
                    variant="outline"
                    className="mt-4 h-10 rounded-lg border-white/20 bg-transparent text-slate-100 hover:bg-white/5"
                  >
                    Talk to Team
                  </Button>
                </Link>
              </div>
            </article>
          </div>
        </section>

        <section className="relative mx-auto max-w-6xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {tiers.map((tier) => (
              <Card
                key={tier.name}
                className={`relative overflow-hidden rounded-[26px] border p-0 ${
                  tier.highlighted
                    ? 'border-[#fb923c]/60 bg-gradient-to-b from-[#211103] to-[#111827] shadow-[0_16px_60px_rgba(251,146,60,0.25)]'
                    : 'border-white/10 bg-[#090F1A]/85'
                }`}
              >
                {tier.highlighted && (
                  <div className="border-b border-[#fb923c]/40 bg-[#fb923c]/20 px-5 py-2.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#fdba74]">
                    Recommended to get started
                  </div>
                )}

                <div className="p-5 sm:p-6">
                  <h2 className="text-2xl font-semibold text-white">{tier.name}</h2>
                  <p className="mt-2 min-h-[40px] text-sm leading-6 text-slate-300">{tier.description}</p>

                  <div className="mt-5 flex items-end gap-2">
                    <p className="text-4xl font-semibold text-white">{tier.price}</p>
                    {tier.price !== 'Custom' && tier.price !== 'Free' && tier.price !== 'Pay as you go' && (
                      <span className="pb-1.5 text-sm text-slate-400">/month</span>
                    )}
                  </div>

                  <Link href="/signup">
                    <Button
                      className={`mt-5 h-10 w-full rounded-lg text-sm font-semibold ${
                        tier.highlighted
                          ? 'border border-[#fb923c]/65 bg-gradient-to-r from-[#fb923c] to-[#f97316] text-slate-950 hover:from-[#fdba74] hover:to-[#fb923c]'
                          : 'border border-white/20 bg-white/5 text-white hover:bg-white/10'
                      }`}
                    >
                      {tier.cta}
                    </Button>
                  </Link>

                  <div className="mt-6 space-y-2.5">
                    {tier.features.slice(0, 4).map((feature) => (
                      <div key={feature} className="flex items-start gap-2.5 rounded-lg border border-white/10 bg-[#050a13]/80 px-3 py-2">
                        <span
                          className={`mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-full ${
                            tier.highlighted ? 'bg-[#fb923c] text-slate-950' : 'bg-[#22d3ee]/15 text-[#67e8f9]'
                          }`}
                        >
                          <Check className="h-3.5 w-3.5" />
                        </span>
                        <p className="text-sm text-slate-300">{feature}</p>
                      </div>
                    ))}
                    {tier.features.length > 4 && (
                      <p className="text-xs text-slate-500">+ {tier.features.length - 4} more included features</p>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </section>

        <section className="relative mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="rounded-[26px] border border-white/10 bg-[#090F1A]/85 p-7 sm:p-8">
            <div className="mb-7 flex items-center gap-2 text-[#67e8f9]">
              <CircleHelp className="h-4 w-4" />
              <p className="text-xs font-semibold uppercase tracking-[0.18em]">FAQ</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {faqs.map((faq) => (
                <article key={faq.title} className="rounded-xl border border-white/10 bg-[#060B14]/80 p-4">
                  <h3 className="text-base font-semibold text-white">{faq.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-400">{faq.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="relative mx-auto max-w-6xl px-4 pb-2 sm:px-6 lg:px-8">
          <div className="rounded-[26px] border border-white/10 bg-gradient-to-r from-[#101728] via-[#111a2e] to-[#0f1f2a] p-8 text-center sm:p-10">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#fdba74]">Ready when you are</p>
            <h2 className="mt-4 text-3xl font-semibold text-white sm:text-4xl">Start free, scale with token-based Pro</h2>
            <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
              Begin with 500K monthly tokens, then move to 10M monthly tokens as your usage grows.
            </p>
            <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
              <Link href="/signup">
                <Button className="h-11 rounded-lg border border-[#fb923c]/65 bg-gradient-to-r from-[#fb923c] to-[#f97316] px-6 text-slate-950 hover:from-[#fdba74] hover:to-[#fb923c]">
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
