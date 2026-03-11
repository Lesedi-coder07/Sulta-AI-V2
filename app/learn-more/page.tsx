import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

import Footer from '@/components/layout/Footer';
import Navbar from '@/components/layout/Navbar';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
  title: 'Learn More - Sulta AI',
  description: 'See how Sulta AI lets technical teams build, host, and deploy AI agents.',
};

const productSignals = [
  { label: 'Agent templates', value: '4 built in' },
  { label: 'Hosted interface', value: 'Web chat' },
  { label: 'API endpoints', value: 'List + chat' },
  { label: 'Usage visibility', value: 'Tracked per agent' },
];

const launchSteps = [
  {
    title: 'Create an agent',
    description: 'Start from the dashboard and define the role, description, and base behavior.',
  },
  {
    title: 'Configure how it should respond',
    description: 'Set prompts, context, guardrails, and model settings without building a custom backend flow.',
  },
  {
    title: 'Use it in chat or through the API',
    description: 'Run the same agent in the hosted UI or integrate it into your own tools with API keys.',
  },
];

const productAreas = [
  {
    title: 'Agent creation',
    description: 'Create text, customer support, school, or onboarding agents from one builder.',
    outcome: 'Teams can standardize new agent setup instead of starting from scratch every time.',
  },
  {
    title: 'Behavior control',
    description: 'Use system prompts, extra context, model settings, and restrictions to shape outputs.',
    outcome: 'Technical teams get more reliable responses with less prompt drift in production.',
  },
  {
    title: 'Hosted chat delivery',
    description: 'Run agents through the built-in chat routes with their configured behavior already applied.',
    outcome: 'You can ship usable internal or customer-facing agent experiences faster.',
  },
  {
    title: 'API access',
    description: 'List agents and send chat requests over HTTP using account API keys.',
    outcome: 'Engineers can connect agents to existing apps without rebuilding the core interaction layer.',
  },
  {
    title: 'Per-agent tracking',
    description: 'Usage counters track queries, chats, and tokens as agents are used.',
    outcome: 'Teams can make AI ops decisions with actual usage data instead of guesswork.',
  },
];

const useCases = [
  {
    title: 'Support teams',
    description: 'Create agents that answer repetitive questions and keep responses aligned with support tone and policy.',
  },
  {
    title: 'Internal enablement',
    description: 'Give teams a fast way to package internal knowledge into agents people can actually use.',
  },
  {
    title: 'Technical products',
    description: 'Expose agent behavior through the API so product teams can integrate it into existing workflows.',
  },
];

export default function LearnMorePage() {
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
              Product
            </div>

            <h1 className="mt-8 text-[clamp(2.35rem,6vw,4.7rem)] font-semibold leading-[1.04] text-white [text-wrap:balance]">
              Built to make AI ops
              <br />
              easier for technical teams
            </h1>

            <p className="mx-auto mt-8 max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">
              Sulta AI gives teams a practical way to create agents, host them in chat, and integrate them through the
              API without rebuilding the same operational layer over and over.
            </p>

            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <Link href="/signup">
                <Button className="h-11 rounded-lg border border-white/15 bg-white px-6 text-sm font-semibold text-slate-950 hover:bg-slate-200">
                  Start Building
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
          </div>

          <div className="mx-auto mt-16 w-full max-w-4xl rounded-2xl border border-white/10 bg-[#070D18]/70 px-6 py-7 backdrop-blur-sm sm:px-8 sm:py-10">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-300">What You Can Use Today</p>

            <div className="mt-8 grid gap-8 sm:grid-cols-2 xl:grid-cols-4">
              {productSignals.map((item) => (
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
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-300">Workflow</p>
            <h2 className="mt-5 text-3xl font-semibold text-white sm:text-4xl">How teams go from idea to live agent</h2>
          </div>

          <div className="mt-14 overflow-hidden rounded-2xl border border-white/10 bg-[#070D18]/70">
            <div className="grid divide-y divide-white/10 md:grid-cols-3 md:divide-x md:divide-y-0">
              {launchSteps.map((step, index) => (
                <article key={step.title} className="px-6 py-8">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                    Step {String(index + 1).padStart(2, '0')}
                  </p>
                  <h3 className="mt-3 text-xl font-semibold text-white">{step.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-slate-400">{step.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="relative mx-auto max-w-7xl px-4 pb-24 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-300">Product Areas</p>
            <h2 className="mt-5 text-3xl font-semibold text-white sm:text-4xl">What Sulta AI does across the product</h2>
            <p className="mt-5 text-slate-400">
              The platform is opinionated around fast setup, controlled behavior, and easier AI operations.
            </p>
          </div>

          <div className="mt-14 overflow-hidden rounded-2xl border border-white/10 bg-[#070D18]/70">
            <div className="hidden grid-cols-[90px_1.15fr_1fr] border-b border-white/10 bg-white/[0.03] px-6 py-4 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500 md:grid">
              <p>Area</p>
              <p>Feature</p>
              <p>Outcome</p>
            </div>

            {productAreas.map((area, index) => (
              <article
                key={area.title}
                className="grid gap-3 border-t border-white/10 px-6 py-6 first:border-t-0 md:grid-cols-[90px_1.15fr_1fr] md:items-start md:gap-8"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-300">
                  {String(index + 1).padStart(2, '0')}
                </p>
                <div>
                  <h3 className="text-lg font-semibold text-white">{area.title}</h3>
                  <p className="mt-1 text-sm leading-6 text-slate-400">{area.description}</p>
                </div>
                <p className="text-sm leading-6 text-slate-300 md:pt-0.5">{area.outcome}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="relative mx-auto max-w-7xl px-4 pb-24 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-300">Use Cases</p>
            <h2 className="mt-5 text-3xl font-semibold text-white sm:text-4xl">Where teams usually apply it</h2>
          </div>

          <div className="mt-14 overflow-hidden rounded-2xl border border-white/10 bg-[#070D18]/70">
            {useCases.map((useCase) => (
              <article
                key={useCase.title}
                className="grid gap-3 border-t border-white/10 px-6 py-6 first:border-t-0 md:grid-cols-[0.8fr_1.2fr] md:gap-8"
              >
                <h3 className="text-lg font-semibold text-white">{useCase.title}</h3>
                <p className="text-sm leading-7 text-slate-400">{useCase.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="relative mx-auto max-w-7xl px-4 pt-8 sm:px-6 lg:px-8">
          <div className="rounded-[28px] border border-white/10 bg-gradient-to-r from-[#101728] via-[#11192d] to-[#10202b] p-10 text-center sm:p-12">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-300">Next Step</p>
            <h2 className="mt-5 text-3xl font-semibold text-white sm:text-4xl">Build and test your first agent</h2>
            <p className="mx-auto mt-5 max-w-2xl text-slate-300">
              Start with the builder, test in chat, then connect the same agent to your own app through the API.
            </p>
            <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
              <Link href="/signup">
                <Button className="h-11 rounded-lg border border-white/15 bg-white px-6 text-slate-950 hover:bg-slate-200">
                  Start Building
                </Button>
              </Link>
              <Link href="/pricing">
                <Button
                  variant="outline"
                  className="h-11 rounded-lg border-white/20 bg-transparent px-6 text-slate-100 hover:bg-white/5"
                >
                  View Pricing
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
