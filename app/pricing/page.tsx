import type { Metadata } from 'next';
import Link from 'next/link';
import { Check } from 'lucide-react';
import { tiers } from '@/app/pricing/pricing';
import Footer from '@/components/layout/Footer';
import Navbar from '@/components/layout/Navbar';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
  title: 'Pricing — Sulta AI',
  description: 'Pricing for building, hosting, and deploying AI agents.',
};

const faqs = [
  {
    q: 'Can we start small and scale later?',
    a: 'Yes. Start on the Free tier with 500K monthly tokens, then move to Pro when you need more capacity.',
  },
  {
    q: 'How is usage priced?',
    a: 'Pricing is token-based. Your monthly token allowance is tied to the plan, rather than message-count billing.',
  },
  {
    q: 'What does Pro include?',
    a: 'Pro includes 10M monthly tokens, API access, detailed usage analytics, and priority email support.',
  },
  {
    q: 'Can I change plans anytime?',
    a: 'Yes. You can switch plans as your team usage changes.',
  },
];

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-slate-100">
      <Navbar />

      <main className="mx-auto max-w-6xl px-4 pb-24 pt-20 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="border-b border-white/8 pb-10 pt-12">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-white/25">Pricing</p>
          <h1 className="mt-3 text-2xl font-semibold text-white">Token-based pricing</h1>
          <p className="mt-2 max-w-lg text-sm text-white/50">
            Start with 500K monthly tokens for free, then move to 10M on Pro. One quota, no message-based pricing.
          </p>
        </div>

        {/* Plans */}
        <section className="py-12">
          <div className="grid gap-4 sm:grid-cols-2">
            {tiers.map((tier) => (
              <div
                key={tier.name}
                className={`rounded-lg border p-6 ${
                  tier.highlighted ? 'border-white/15 bg-white/[0.04]' : 'border-white/8 bg-white/[0.02]'
                }`}
              >
                {tier.highlighted && (
                  <p className="mb-4 text-[10px] font-semibold uppercase tracking-widest text-white/40">
                    Most popular
                  </p>
                )}
                <div className="flex items-start justify-between">
                  <h2 className="text-base font-semibold text-white">{tier.name}</h2>
                  <div className="text-right">
                    <span className="text-2xl font-semibold text-white">{tier.price}</span>
                    {tier.price !== 'Free' && tier.price !== 'Custom' && (
                      <span className="ml-1 text-xs text-white/30">/month</span>
                    )}
                  </div>
                </div>
                <p className="mt-1 text-xs text-white/40">{tier.description}</p>

                <div className="mt-5 space-y-2.5 border-t border-white/8 pt-5">
                  {tier.features.map((f) => (
                    <div key={f} className="flex items-start gap-2.5">
                      <Check className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-white/30" />
                      <p className="text-sm text-white/50">{f}</p>
                    </div>
                  ))}
                </div>

                <Link href="/signup" className="mt-6 block">
                  <Button
                    className={`h-9 w-full rounded text-sm font-semibold ${
                      tier.highlighted
                        ? 'border border-white/15 bg-white text-slate-950 hover:bg-slate-100'
                        : 'border border-white/10 bg-white/5 text-white/70 hover:bg-white/8 hover:text-white'
                    }`}
                  >
                    {tier.cta}
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/* Comparison table */}
        <section className="border-t border-white/8 py-12">
          <h2 className="mb-6 text-sm font-semibold text-white">Compare plans</h2>
          <div className="overflow-hidden rounded-lg border border-white/8">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-white/8 bg-white/[0.02]">
                  <th className="px-4 py-3 text-xs font-medium text-white/40">Feature</th>
                  <th className="px-4 py-3 text-xs font-medium text-white/40">Free</th>
                  <th className="px-4 py-3 text-xs font-medium text-white/40">Pro</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/8">
                {[
                  { feature: 'Monthly tokens', free: '500K', pro: '10M' },
                  { feature: 'Agent builder', free: '✓', pro: '✓' },
                  { feature: 'Hosted chat', free: '✓', pro: '✓' },
                  { feature: 'API access', free: '—', pro: '✓' },
                  { feature: 'Usage analytics', free: 'Basic', pro: 'Detailed' },
                  { feature: 'Support', free: 'Community', pro: 'Priority email' },
                ].map((row) => (
                  <tr key={row.feature}>
                    <td className="px-4 py-3 text-white/60">{row.feature}</td>
                    <td className="px-4 py-3 text-white/40">{row.free}</td>
                    <td className="px-4 py-3 text-white/60">{row.pro}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* FAQ */}
        <section className="border-t border-white/8 py-12">
          <h2 className="mb-6 text-sm font-semibold text-white">Frequently asked</h2>
          <div className="overflow-hidden rounded-lg border border-white/8">
            {faqs.map((faq) => (
              <div key={faq.q} className="grid gap-2 border-t border-white/8 px-5 py-5 first:border-t-0 md:grid-cols-[0.8fr_1.2fr] md:gap-8">
                <p className="text-sm font-medium text-white/70">{faq.q}</p>
                <p className="text-sm text-white/40">{faq.a}</p>
              </div>
            ))}
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}
