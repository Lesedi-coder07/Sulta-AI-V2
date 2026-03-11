import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Check } from 'lucide-react';
import { tiers } from '@/app/pricing/pricing';

import Footer from '@/components/layout/Footer';
import Navbar from '@/components/layout/Navbar';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export const metadata: Metadata = {
  title: 'Sulta AI - Build, Host, and Deploy AI Agents',
  description: 'A way to build, host, and deploy AI agents with web chat and API access.',
  icons: {
    icon: '/logos/Sulta/fav.png',
    shortcut: { url: '/logos/Sulta/fav.png' },
  },
};

const heroProof = [
  { label: 'Create agents in dashboard', value: 'Builder' },
  { label: 'Run agents in web chat', value: 'Hosted Chat' },
  { label: 'Manage agents by ID', value: 'Agent IDs' },
  { label: 'List and chat over HTTP', value: 'Agent API' },
];

const heroIntegrations = [
  'Custom system prompts',
  'Guardrails field',
  'Extra context',
  'Model settings',
  'Streaming API responses',
  'Per-agent usage tracking',
];

const capabilities = [
  {
    title: 'Create agents in minutes',
    description: 'Set name, description, type, personality, tone, and context from the create page.',
    outcome: 'Technical teams can launch new agents fast instead of building one-off tooling each time.',
  },
  {
    title: 'Tune behavior with prompts',
    description: 'Generate a system prompt, add custom instructions, and set model parameters.',
    outcome: 'Teams get more predictable outputs and spend less time debugging prompt drift.',
  },
  {
    title: 'Host agents for your team',
    description: 'Each agent is stored in your account and available through chat and dashboard views.',
    outcome: 'Operations stay centralized so engineers and operators manage agents from one place.',
  },
  {
    title: 'Deploy hosted chat experiences',
    description: 'Open agents in chat routes with role and context behavior already configured.',
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

export default function Home() {
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
              AI Agent Platform
            </div>

            <h1 className="mt-8 text-[clamp(2.35rem,6.4vw,5.2rem)] font-semibold leading-[1.02] text-white [text-wrap:balance]">
              A way to build, host,
              <br />
              and deploy AI agents
            </h1>

            <p className="mx-auto mt-8 max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">
              Create agents in the dashboard, run them in hosted chat pages, and connect them to your apps through a
              simple agent API. Sulta AI makes AI ops easier for technical teams by reducing setup, integration, and
              maintenance overhead.
            </p>

            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <Link href="/signup">
                <Button className="h-11 rounded-lg border border-white/15 bg-white px-6 text-sm font-semibold text-slate-950 hover:bg-slate-200">
                  Launch Workspace
                  <ArrowRight className="ml-2 h-4 w-4" />
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

            <div className="mt-8 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-xs text-slate-400 sm:text-sm">
              <span>Agent builder</span>
              <span>Hosted chat routes</span>
              <span>API access</span>
              <span>Faster AI ops for technical teams</span>
            </div>
          </div>

          <div className="mx-auto mt-16 w-full max-w-4xl rounded-2xl border border-white/10 bg-[#070D18]/70 px-6 py-7 backdrop-blur-sm sm:px-8 sm:py-10">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-300">What You Can Use Today</p>

            <div className="mt-8 grid gap-8 sm:grid-cols-2 xl:grid-cols-4">
              {heroProof.map((item) => (
                <div key={item.label} className="text-center">
                  <p className="text-xl font-semibold text-white sm:text-2xl">{item.value}</p>
                  <p className="mt-2 text-[11px] uppercase tracking-[0.14em] text-slate-500">{item.label}</p>
                </div>
              ))}
            </div>

            <div className="mt-8 h-px w-full bg-gradient-to-r from-transparent via-white/15 to-transparent" />

            <div className="mx-auto mt-8 flex max-w-3xl flex-wrap items-center justify-center gap-3">
              {heroIntegrations.map((tool) => (
                <span
                  key={tool}
                  className="rounded-full border border-white/15 bg-white/[0.03] px-3 py-1.5 text-xs font-medium text-slate-300"
                >
                  {tool}
                </span>
              ))}
            </div>
          </div>
        </section>

        <section className="relative mx-auto max-w-7xl px-4 pb-24 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-300">Pricing</p>
            <h2 className="mt-5 text-3xl font-semibold text-white sm:text-4xl">Simple token-based pricing</h2>
            <p className="mt-5 text-slate-400">
              Start with 500K monthly tokens for free, then scale to 10M monthly tokens on Pro.
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
                    {tier.features.slice(0, 4).map((feature) => (
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

        <section className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-300">Platform Capabilities</p>
            <h2 className="mt-5 text-3xl font-semibold text-white sm:text-4xl">
              What Sulta AI does
            </h2>
            <p className="mt-5 text-slate-400">
              Core product features, paired with real outcomes for technical teams running AI operations.
            </p>
          </div>

          <div className="mt-14 overflow-hidden rounded-2xl border border-white/10 bg-[#070D18]/70">
            <div className="hidden grid-cols-[90px_1.15fr_1fr] border-b border-white/10 bg-white/[0.03] px-6 py-4 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500 md:grid">
              <p>Area</p>
              <p>Feature</p>
              <p>Outcome for technical teams</p>
            </div>

            {capabilities.map((capability, index) => (
              <article
                key={capability.title}
                className="grid gap-3 border-t border-white/10 px-6 py-6 first:border-t-0 md:grid-cols-[90px_1.15fr_1fr] md:items-start md:gap-8"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-300">
                  {String(index + 1).padStart(2, '0')}
                </p>
                <div>
                  <h3 className="text-lg font-semibold text-white">{capability.title}</h3>
                  <p className="mt-1 text-sm leading-6 text-slate-400">{capability.description}</p>
                </div>
                <p className="text-sm leading-6 text-slate-300 md:pt-0.5">{capability.outcome}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="relative mx-auto max-w-7xl px-4 pt-8 sm:px-6 lg:px-8">
          <div className="rounded-[28px] border border-white/10 bg-gradient-to-r from-[#101728] via-[#11192d] to-[#10202b] p-10 text-center sm:p-12">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-300">Start your rollout</p>
            <h3 className="mt-5 text-3xl font-semibold text-white sm:text-4xl">Deploy your first agent this week</h3>
            <p className="mx-auto mt-5 max-w-2xl text-slate-300">
              Create an agent, test it in chat, then connect it to your app with the API.
            </p>
            <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
              <Link href="/signup">
                <Button className="h-11 rounded-lg border border-white/15 bg-white px-6 text-slate-950 hover:bg-slate-200">
                  Create Free Workspace
                </Button>
              </Link>
              <Link href="/pricing">
                <Button
                  variant="outline"
                  className="h-11 rounded-lg border-white/20 bg-transparent px-6 text-slate-100 hover:bg-white/5"
                >
                  Compare Plans
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
