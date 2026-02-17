import type { Metadata } from 'next';
import Link from 'next/link';
import {
  ArrowRight,
  Bot,
  Compass,
  Database,
  GitBranch,
  Handshake,
  MessageSquareCode,
  Shield,
  Timer,
} from 'lucide-react';

import Footer from '@/components/layout/Footer';
import Navbar from '@/components/layout/Navbar';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
  title: 'Learn More - Sulta AI',
  description: 'See how Sulta AI lets you build, host, and deploy AI agents.',
};

const launchSteps = [
  {
    title: 'Create an agent',
    description: 'Set agent name, description, and type from the dashboard builder.',
    stat: 'Step 01',
  },
  {
    title: 'Configure behavior',
    description: 'Adjust prompt style, context, guardrails, and model configuration.',
    stat: 'Step 02',
  },
  {
    title: 'Use via chat or API',
    description: 'Open the hosted routes or send requests to the agent API endpoints.',
    stat: 'Step 03',
  },
];

const modules = [
  {
    icon: <Bot className="h-5 w-5" />,
    title: 'Agent Builder',
    description: 'Create agents with custom name, description, type, and visibility.',
  },
  {
    icon: <Database className="h-5 w-5" />,
    title: 'Prompt + Context Controls',
    description: 'Set custom system prompts and add extra context in the creation flow.',
  },
  {
    icon: <GitBranch className="h-5 w-5" />,
    title: 'Guardrails + Restrictions',
    description: 'Define behavioral constraints directly in the agent configuration.',
  },
  {
    icon: <Shield className="h-5 w-5" />,
    title: 'LLM Settings',
    description: 'Choose model, temperature, and token limits for each agent.',
  },
  {
    icon: <MessageSquareCode className="h-5 w-5" />,
    title: 'Hosted Chat UI',
    description: 'Run agents through built-in chat pages with live interactions.',
  },
  {
    icon: <Timer className="h-5 w-5" />,
    title: 'Agent API Access',
    description: 'Use API keys to list agents and send chat requests programmatically.',
  },
];

const useCases = [
  {
    title: 'Customer Support Agent',
    description: 'Set tone and policy context for handling common customer questions.',
  },
  {
    title: 'School Agent',
    description: 'Configure school-specific context for student and teacher help flows.',
  },
  {
    title: 'Employee Onboarding Agent',
    description: 'Provide new-hire guidance with company-specific onboarding instructions.',
  },
];

export default function LearnMorePage() {
  return (
    <div className="min-h-screen bg-[#03060D] text-slate-100">
      <Navbar />

      <main className="relative overflow-hidden pb-20 pt-24">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-[-120px] top-16 h-[500px] w-[300px] rounded-full bg-[#fb923c]/18 blur-[145px]" />
          <div className="absolute right-[-110px] top-56 h-[520px] w-[280px] rounded-full bg-[#22d3ee]/12 blur-[145px]" />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:48px_48px] opacity-20" />
        </div>

        <section className="relative mx-auto max-w-7xl px-4 pb-14 sm:px-6 lg:px-8">
          <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
            <article className="rounded-[28px] border border-white/10 bg-[#090F1A]/85 p-7 sm:p-8">
              <p className="inline-flex rounded-full border border-[#fdba74]/45 bg-[#fb923c]/12 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-[#fdba74]">
                Product Tour
              </p>
              <h1 className="mt-6 text-4xl font-semibold leading-tight text-white sm:text-5xl">
                A way to build, host,
                <br />
                and deploy AI agents
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-7 text-slate-300">
                The app lets you create agents, run them through hosted chat routes, and access them with
                API keys.
              </p>

              <div className="mt-8 grid gap-3 sm:grid-cols-3">
                <div className="rounded-xl border border-white/10 bg-[#060B14]/80 p-4">
                  <p className="text-xl font-semibold text-white">4</p>
                  <p className="mt-1 text-xs uppercase tracking-[0.14em] text-slate-500">Agent templates</p>
                </div>
                <div className="rounded-xl border border-white/10 bg-[#060B14]/80 p-4">
                  <p className="text-xl font-semibold text-white">1</p>
                  <p className="mt-1 text-xs uppercase tracking-[0.14em] text-slate-500">Hosted interface (chat)</p>
                </div>
                <div className="rounded-xl border border-white/10 bg-[#060B14]/80 p-4">
                  <p className="text-xl font-semibold text-white">2</p>
                  <p className="mt-1 text-xs uppercase tracking-[0.14em] text-slate-500">API endpoints (list + chat)</p>
                </div>
              </div>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/signup">
                  <Button className="h-11 rounded-lg border border-[#fb923c]/65 bg-gradient-to-r from-[#fb923c] to-[#f97316] px-6 text-slate-950 hover:from-[#fdba74] hover:to-[#fb923c]">
                    Start Free
                    <ArrowRight className="ml-2 h-4 w-4" />
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
            </article>

            <article className="rounded-[28px] border border-white/10 bg-[#090F1A]/85 p-6">
              <p className="text-sm font-semibold text-slate-300">Launch Blueprint</p>
              <div className="mt-5 space-y-3">
                {launchSteps.map((step) => (
                  <div key={step.title} className="rounded-xl border border-white/10 bg-[#060B14]/80 p-4">
                    <p className="text-xs uppercase tracking-[0.14em] text-[#67e8f9]">{step.stat}</p>
                    <h2 className="mt-1 text-base font-semibold text-white">{step.title}</h2>
                    <p className="mt-2 text-sm leading-6 text-slate-400">{step.description}</p>
                  </div>
                ))}
              </div>
            </article>
          </div>
        </section>

        <section className="relative mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#67e8f9]">Core Modules</p>
            <h2 className="mt-4 text-3xl font-semibold text-white sm:text-4xl">
              Core product features available right now
            </h2>
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {modules.map((module) => (
              <article
                key={module.title}
                className="rounded-2xl border border-white/10 bg-[#090F1A]/85 p-5 transition hover:-translate-y-0.5 hover:border-[#fb923c]/40"
              >
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-[#fb923c]/30 to-[#22d3ee]/20 text-[#fdba74]">
                  {module.icon}
                </div>
                <h3 className="mt-4 text-lg font-semibold text-white">{module.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-400">{module.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="relative mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
            <article className="rounded-[26px] border border-white/10 bg-[#090F1A]/85 p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#fdba74]">Who uses Sulta AI</p>
              <h2 className="mt-4 text-2xl font-semibold text-white sm:text-3xl">Common agent types in this app</h2>
              <p className="mt-3 text-sm leading-7 text-slate-400">
                The builder already includes these patterns as supported agent configurations.
              </p>

              <div className="mt-6 space-y-4">
                {useCases.map((useCase) => (
                  <div key={useCase.title} className="rounded-xl border border-white/10 bg-[#060B14]/80 p-4">
                    <h3 className="text-base font-semibold text-white">{useCase.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-slate-400">{useCase.description}</p>
                  </div>
                ))}
              </div>
            </article>

            <article className="rounded-[26px] border border-white/10 bg-[#090F1A]/85 p-6">
              <p className="text-sm font-semibold text-slate-300">What this implementation includes</p>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {[
                  {
                    icon: <Compass className="h-4 w-4" />,
                    label: 'Dashboard + API',
                    body: 'Manage agents in UI and access them programmatically over HTTP.',
                  },
                  {
                    icon: <Handshake className="h-4 w-4" />,
                    label: 'Firebase Storage',
                    body: 'Agents and usage stats are persisted in Firestore documents.',
                  },
                  {
                    icon: <Shield className="h-4 w-4" />,
                    label: 'Access Control',
                    body: 'Agent API key checks enforce ownership or explicit agent access.',
                  },
                  {
                    icon: <Timer className="h-4 w-4" />,
                    label: 'Usage Tracking',
                    body: 'Query, chat, and token counters are incremented during interactions.',
                  },
                ].map((item) => (
                  <div key={item.label} className="rounded-xl border border-white/10 bg-[#060B14]/80 p-4">
                    <p className="inline-flex items-center gap-2 text-sm font-semibold text-white">
                      <span className="text-[#67e8f9]">{item.icon}</span>
                      {item.label}
                    </p>
                    <p className="mt-2 text-sm leading-6 text-slate-400">{item.body}</p>
                  </div>
                ))}
              </div>
            </article>
          </div>
        </section>

        <section className="relative mx-auto max-w-6xl px-4 pb-2 sm:px-6 lg:px-8">
          <div className="rounded-[26px] border border-white/10 bg-gradient-to-r from-[#101728] via-[#111a2e] to-[#0f1f2a] p-8 text-center sm:p-10">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#67e8f9]">Next Step</p>
            <h2 className="mt-4 text-3xl font-semibold text-white sm:text-4xl">Build and test your first agent</h2>
            <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
              Start with the agent creator, test in chat, then connect it to your app through the API.
            </p>
            <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
              <Link href="https://sultatech.com/book" target="_blank" rel="noreferrer noopener">
                <Button className="h-11 rounded-lg border border-[#fb923c]/65 bg-gradient-to-r from-[#fb923c] to-[#f97316] px-6 text-slate-950 hover:from-[#fdba74] hover:to-[#fb923c]">
                  Book Strategy Call
                </Button>
              </Link>
              <Link href="/signup">
                <Button
                  variant="outline"
                  className="h-11 rounded-lg border-white/20 bg-transparent px-6 text-slate-100 hover:bg-white/5"
                >
                  Start Building
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
