import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Check } from 'lucide-react';
import { tiers } from '@/app/pricing/pricing';
import Footer from '@/components/layout/Footer';
import Navbar from '@/components/layout/Navbar';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
  title: 'Sulta AI — Build, Host, and Deploy AI Agents',
  description: 'A way to build, host, and deploy AI agents with web chat and API access.',
  icons: {
    icon: '/logos/Sulta/fav.png',
    shortcut: { url: '/logos/Sulta/fav.png' },
  },
};

const capabilities = [
  {
    title: 'Create agents in minutes',
    description: 'Set name, description, type, personality, tone, and context from the create page.',
    outcome: 'Technical teams can launch new agents fast instead of building one-off tooling each time.',
  },
  {
    title: 'Design pipelines in the playground',
    description: 'Wire input, agent, tool, and response nodes on a visual canvas. Select which built-in tools each agent can call, then save the full pipeline back to the agent in one click.',
    outcome: 'Teams can prototype and reconfigure agent behavior without touching backend code.',
  },
  {
    title: 'Equip agents with real tools',
    description: 'Attach built-in tools — calculator, live weather, date & time, URL fetch — directly to agents from the playground tool node.',
    outcome: 'Agents move beyond pure text generation and can look up live data or run calculations during a conversation.',
  },
  {
    title: 'Tune behavior with prompts',
    description: 'Generate a system prompt, add custom instructions, and set model parameters.',
    outcome: 'Teams get more predictable outputs and spend less time debugging prompt drift.',
  },
  {
    title: 'Deploy hosted chat experiences',
    description: 'Open agents in chat routes with role, context, and tool behavior already configured. Jump straight from the playground with "Use Agent".',
    outcome: 'Internal users get a consistent interface without custom frontend work for every agent.',
  },
  {
    title: 'Access agents through API',
    description: 'Use account API keys to list agents and send chat requests in stream or non-stream mode.',
    outcome: 'Engineers can integrate agents into existing systems without rebuilding core chat logic.',
  },
  {
    title: 'Track agent usage',
    description: 'The backend increments query, token, and chat counters for each API/chat interaction.',
    outcome: 'Teams get visibility into adoption and usage so AI ops decisions are data-driven.',
  },
];

const features = [
  'Visual pipeline editor',
  'Per-agent tool configuration',
  'Built-in tool library',
  'Custom system prompts',
  'Guardrails field',
  'Streaming API responses',
  'Per-agent usage tracking',
];

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-slate-100">
      <Navbar />

      <main className="mx-auto max-w-6xl px-4 pb-24 pt-20 sm:px-6 lg:px-8">

        {/* Hero */}
        <section className="border-b border-white/8 pb-16 pt-12">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-white/25">Sulta AI</p>
          <h1 className="mt-4 max-w-2xl text-3xl font-semibold leading-snug text-white sm:text-4xl">
            Build, configure, and deploy AI agents
          </h1>
          <p className="mt-4 max-w-xl text-sm leading-7 text-white/50">
            Create agents in the dashboard, design their pipelines and tool configs in the visual playground, run them in hosted chat, and connect them to your apps through the API. Less setup, less maintenance.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link href="/signup">
              <Button className="h-9 rounded-lg border border-white/15 bg-white px-5 text-sm font-semibold text-slate-950 hover:bg-slate-100">
                Get started free
                <ArrowRight className="ml-2 h-3.5 w-3.5" />
              </Button>
            </Link>
            <Link href="/docs/api">
              <Button variant="outline" className="h-9 rounded-lg border-white/15 bg-transparent px-5 text-sm text-white/60 hover:bg-white/5 hover:text-white/90">
                Read the docs
              </Button>
            </Link>
          </div>

          <div className="mt-10 flex flex-wrap gap-2">
            {features.map((f) => (
              <span key={f} className="rounded border border-white/8 bg-white/[0.03] px-2.5 py-1 text-xs text-white/40">
                {f}
              </span>
            ))}
          </div>
        </section>

        {/* Capabilities */}
        <section className="py-16">
          <div className="mb-8">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-white/25">Platform</p>
            <h2 className="mt-2 text-lg font-semibold text-white">What Sulta AI does</h2>
          </div>

          <div className="overflow-hidden rounded-lg border border-white/8">
            <div className="hidden grid-cols-[90px_1.2fr_1fr] border-b border-white/8 bg-white/[0.02] px-5 py-3 text-[10px] font-semibold uppercase tracking-widest text-white/25 md:grid">
              <p>#</p>
              <p>Feature</p>
              <p>Outcome</p>
            </div>
            {capabilities.map((cap, i) => (
              <article
                key={cap.title}
                className="grid gap-2 border-t border-white/8 px-5 py-5 first:border-t-0 md:grid-cols-[90px_1.2fr_1fr] md:items-start md:gap-6"
              >
                <p className="font-mono text-xs text-white/20">{String(i + 1).padStart(2, '0')}</p>
                <div>
                  <h3 className="text-sm font-semibold text-white">{cap.title}</h3>
                  <p className="mt-1 text-sm text-white/40">{cap.description}</p>
                </div>
                <p className="text-sm text-white/50">{cap.outcome}</p>
              </article>
            ))}
          </div>
        </section>

        {/* Pricing preview */}
        <section className="border-t border-white/8 py-16">
          <div className="mb-8">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-white/25">Pricing</p>
            <h2 className="mt-2 text-lg font-semibold text-white">Simple token-based plans</h2>
            <p className="mt-1 text-sm text-white/40">Start free. Scale when you need more.</p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {tiers.map((tier) => (
              <div
                key={tier.name}
                className={`rounded-lg border p-5 ${
                  tier.highlighted ? 'border-white/15 bg-white/[0.04]' : 'border-white/8 bg-white/[0.02]'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-sm font-semibold text-white">{tier.name}</h3>
                    <p className="mt-0.5 text-xs text-white/40">{tier.description}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-semibold text-white">{tier.price}</p>
                    {tier.price !== 'Free' && tier.price !== 'Custom' && (
                      <p className="text-xs text-white/30">/month</p>
                    )}
                  </div>
                </div>
                <div className="mt-4 space-y-2">
                  {tier.features.map((f) => (
                    <div key={f} className="flex items-start gap-2">
                      <Check className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-white/30" />
                      <p className="text-xs text-white/50">{f}</p>
                    </div>
                  ))}
                </div>
                <Link href="/signup" className="mt-5 block">
                  <Button
                    className={`h-8 w-full rounded text-xs font-semibold ${
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
          <p className="mt-4 text-xs text-white/25">
            <Link href="/pricing" className="hover:text-white/50 underline underline-offset-4">Full pricing details →</Link>
          </p>
        </section>

      </main>

      <Footer />
    </div>
  );
}
