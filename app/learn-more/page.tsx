import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import Footer from '@/components/layout/Footer';
import Navbar from '@/components/layout/Navbar';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
  title: 'Product — Sulta AI',
  description: 'See how Sulta AI lets technical teams build, host, and deploy AI agents.',
};

const launchSteps = [
  {
    title: 'Create an agent',
    description: 'Start from the dashboard and define the role, description, and base behavior.',
  },
  {
    title: 'Configure how it responds',
    description: 'Set prompts, context, guardrails, and model settings without building a custom backend flow.',
  },
  {
    title: 'Wire tools and pipelines in the playground',
    description: 'Open the visual editor, connect input, agent, tool, and response nodes, and pick which built-in tools the agent can call. Save the full pipeline to the agent in one click.',
  },
  {
    title: 'Use it in chat or through the API',
    description: 'Jump straight from the playground to the live chat, or integrate the agent into your own tools with API keys.',
  },
];

const productAreas = [
  {
    title: 'Agent creation',
    description: 'Create text, customer support, school, or onboarding agents from one builder.',
    outcome: 'Teams can standardize new agent setup instead of starting from scratch every time.',
  },
  {
    title: 'Pipeline playground',
    description: 'A visual node editor for designing agent pipelines. Drag input, agent, tool, and response nodes onto a canvas, connect them, and inspect or edit each node in the right panel. Each agent stores its own pipeline graph.',
    outcome: 'Teams can see, modify, and test agent architecture without reading configuration files or writing backend code.',
  },
  {
    title: 'Tool configuration',
    description: 'Pick which built-in tools — calculator, live weather, current date & time, URL fetch — each agent can use. Tool selection is per-agent and stored alongside the pipeline.',
    outcome: 'Agents gain real capabilities like live data lookup and computation, scoped precisely per agent so there are no unexpected side-effects.',
  },
  {
    title: 'Behavior control',
    description: 'Use system prompts, extra context, model settings, and restrictions to shape outputs.',
    outcome: 'Technical teams get more reliable responses with less prompt drift in production.',
  },
  {
    title: 'Hosted chat delivery',
    description: 'Run agents through the built-in chat routes with their configured behavior and tools already applied. Tool calls surface inline in the conversation so users can see what the agent is doing.',
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
    description: 'Create agents that answer repetitive questions and keep responses aligned with support tone and policy. Attach a URL fetch tool so agents can pull in live product docs or status pages mid-conversation.',
  },
  {
    title: 'Internal enablement',
    description: 'Give teams a fast way to package internal knowledge into agents people can actually use. Use the playground to wire up tool nodes that give agents access to calculators, date utilities, or external data.',
  },
  {
    title: 'Technical products',
    description: 'Expose agent behavior through the API so product teams can integrate it into existing workflows. Configure pipelines in the playground and promote changes to production without code deploys.',
  },
  {
    title: 'Rapid prototyping',
    description: 'Use the playground to sketch out a new agent pipeline, test tool combinations visually, and hand off the saved configuration to production — all without leaving the browser.',
  },
];

export default function LearnMorePage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-slate-100">
      <Navbar />

      <main className="mx-auto max-w-6xl px-4 pb-24 pt-20 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="border-b border-white/8 pb-10 pt-12">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-white/25">Product</p>
          <h1 className="mt-3 text-2xl font-semibold text-white">Built to make AI ops easier</h1>
          <p className="mt-2 max-w-xl text-sm text-white/50">
            Sulta AI gives teams a practical way to create agents, design their pipelines and tool configurations in the visual playground, host them in chat, and integrate them through the API — without rebuilding the same operational layer every time.
          </p>
          <div className="mt-6 flex gap-3">
            <Link href="/signup">
              <Button className="h-9 rounded-lg border border-white/15 bg-white px-5 text-sm font-semibold text-slate-950 hover:bg-slate-100">
                Start building
                <ArrowRight className="ml-2 h-3.5 w-3.5" />
              </Button>
            </Link>
            <Link href="/pricing">
              <Button variant="outline" className="h-9 rounded-lg border-white/15 bg-transparent px-5 text-sm text-white/60 hover:bg-white/5 hover:text-white/90">
                View pricing
              </Button>
            </Link>
          </div>
        </div>

        {/* How it works */}
        <section className="py-12">
          <p className="mb-6 text-[10px] font-semibold uppercase tracking-widest text-white/25">Workflow</p>
          <div className="overflow-hidden rounded-lg border border-white/8">
            <div className="grid divide-y divide-white/8 md:grid-cols-4 md:divide-x md:divide-y-0">
              {launchSteps.map((step, i) => (
                <article key={step.title} className="px-5 py-6">
                  <p className="font-mono text-xs text-white/20">{String(i + 1).padStart(2, '0')}</p>
                  <h3 className="mt-3 text-sm font-semibold text-white">{step.title}</h3>
                  <p className="mt-2 text-sm text-white/40">{step.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Product areas */}
        <section className="border-t border-white/8 py-12">
          <p className="mb-6 text-[10px] font-semibold uppercase tracking-widest text-white/25">Product areas</p>
          <div className="overflow-hidden rounded-lg border border-white/8">
            <div className="hidden grid-cols-[80px_1.2fr_1fr] border-b border-white/8 bg-white/[0.02] px-5 py-3 text-[10px] font-semibold uppercase tracking-widest text-white/25 md:grid">
              <p>#</p>
              <p>Feature</p>
              <p>Outcome</p>
            </div>
            {productAreas.map((area, i) => (
              <article
                key={area.title}
                className="grid gap-2 border-t border-white/8 px-5 py-5 first:border-t-0 md:grid-cols-[80px_1.2fr_1fr] md:items-start md:gap-6"
              >
                <p className="font-mono text-xs text-white/20">{String(i + 1).padStart(2, '0')}</p>
                <div>
                  <h3 className="text-sm font-semibold text-white">{area.title}</h3>
                  <p className="mt-1 text-sm text-white/40">{area.description}</p>
                </div>
                <p className="text-sm text-white/50">{area.outcome}</p>
              </article>
            ))}
          </div>
        </section>

        {/* Use cases */}
        <section className="border-t border-white/8 py-12">
          <p className="mb-6 text-[10px] font-semibold uppercase tracking-widest text-white/25">Use cases</p>
          <div className="overflow-hidden rounded-lg border border-white/8">
            {useCases.map((uc) => (
              <article
                key={uc.title}
                className="grid gap-2 border-t border-white/8 px-5 py-5 first:border-t-0 md:grid-cols-[0.8fr_1.2fr] md:gap-8"
              >
                <h3 className="text-sm font-semibold text-white">{uc.title}</h3>
                <p className="text-sm text-white/40">{uc.description}</p>
              </article>
            ))}
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}
