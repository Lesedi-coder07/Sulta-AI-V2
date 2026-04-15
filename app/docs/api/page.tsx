import type { Metadata } from 'next';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import { CodeBlock } from '@/components/docs/code-block';

export const metadata: Metadata = {
  title: 'API Reference — Sulta AI',
  description: 'HTTP reference for the Sulta AI Agent API.',
};

// ─── Code examples ────────────────────────────────────────────────────────────

const listAgentsCurl = `curl https://ai.sultatech.com/api/agents \\
  -H "X-API-Key: sulta_sk_..."`;

const listAgentsResponse = `[
  {
    "id": "agent_abc123",
    "name": "Support Bot",
    "type": "customer_support",
    "description": "Handles tier-1 support queries.",
    "isPublic": false
  },
  { ... }
]`;

const chatRequestJson = `{
  "agentId": "agent_abc123",
  "message": "What is your return policy?",
  "stream": false,
  "newChat": true
}`;

const chatCurl = `curl -X POST https://ai.sultatech.com/api/agents/chat \\
  -H "Content-Type: application/json" \\
  -H "X-API-Key: sulta_sk_..." \\
  -d '{
    "agentId": "agent_abc123",
    "message": "What is your return policy?",
    "stream": false
  }'`;

const chatResponseJson = `{
  "content": "Our return policy allows returns within 30 days...",
  "model": "gemini-3-flash-preview",
  "usage": {
    "inputTokens": 241,
    "outputTokens": 73,
    "totalTokens": 314
  }
}`;

const streamJs = `const res = await fetch("https://ai.sultatech.com/api/agents/chat", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "X-API-Key": "sulta_sk_..."
  },
  body: JSON.stringify({
    agentId: "agent_abc123",
    message: "Summarise this month's KPIs.",
    stream: true
  })
});

if (!res.ok) throw new Error(\`\${res.status} \${res.statusText}\`);

const reader = res.body.getReader();
const decoder = new TextDecoder();

while (true) {
  const { value, done } = await reader.read();
  if (done) break;
  process.stdout.write(decoder.decode(value));
}`;

// ─── Sub-components ────────────────────────────────────────────────────────────

function Method({ v }: { v: 'GET' | 'POST' | 'DELETE' | 'PATCH' }) {
  const cls: Record<string, string> = {
    GET:    'text-emerald-400 bg-emerald-400/10 border-emerald-400/25',
    POST:   'text-blue-400   bg-blue-400/10   border-blue-400/25',
    DELETE: 'text-red-400    bg-red-400/10    border-red-400/25',
    PATCH:  'text-amber-400  bg-amber-400/10  border-amber-400/25',
  };
  return (
    <span className={`inline-flex items-center rounded border px-1.5 py-0.5 font-mono text-[11px] font-bold ${cls[v]}`}>
      {v}
    </span>
  );
}

function Required({ optional }: { optional?: boolean }) {
  return optional
    ? <span className="text-xs text-white/25">optional</span>
    : <span className="text-xs text-white/60">required</span>;
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ApiDocsPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-slate-100">
      <Navbar />

      <div className="mx-auto flex max-w-6xl gap-0 px-4 pt-20 sm:px-6 lg:px-8">

        {/* ── Sidebar ── */}
        <aside className="hidden w-56 flex-shrink-0 lg:block">
          <div className="sticky top-24 pr-6">
            <p className="mb-1 text-[11px] font-semibold text-white/30">API Reference</p>
            <nav className="mt-3 space-y-px">
              {[
                { href: '#overview',       label: 'Overview' },
                { href: '#authentication', label: 'Authentication' },
                { href: '#list-agents',    label: 'List agents' },
                { href: '#chat',           label: 'Send a message' },
                { href: '#streaming',      label: 'Streaming' },
                { href: '#errors',         label: 'Error codes' },
              ].map((s) => (
                <a
                  key={s.href}
                  href={s.href}
                  className="block rounded px-2 py-1.5 text-[13px] text-white/40 transition-colors hover:bg-white/5 hover:text-white/80"
                >
                  {s.label}
                </a>
              ))}
            </nav>

            <div className="mt-8 border-t border-white/8 pt-6">
              <p className="mb-1 text-[11px] font-semibold text-white/30">Resources</p>
              <nav className="mt-3 space-y-px">
                <Link href="/dashboard" className="block rounded px-2 py-1.5 text-[13px] text-white/40 transition-colors hover:bg-white/5 hover:text-white/80">Dashboard</Link>
                <Link href="/settings"  className="block rounded px-2 py-1.5 text-[13px] text-white/40 transition-colors hover:bg-white/5 hover:text-white/80">API keys</Link>
                <Link href="/playground" className="block rounded px-2 py-1.5 text-[13px] text-white/40 transition-colors hover:bg-white/5 hover:text-white/80">Playground</Link>
              </nav>
            </div>
          </div>
        </aside>

        {/* ── Main ── */}
        <main className="min-w-0 flex-1 pb-32 lg:pl-4">

          {/* Header */}
          <div className="mb-8 border-b border-white/8 pb-6">
            <p className="mb-1 text-xs text-white/30">
              <Link href="/" className="hover:text-white/60">Sulta AI</Link>
              <span className="mx-1.5 text-white/15">/</span>
              API Reference
            </p>
            <h1 className="text-[22px] font-semibold text-white">Agent API</h1>
            <p className="mt-1 text-sm text-white/50">
              HTTP access to your agents — list, chat, and stream responses.
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <span className="rounded border border-white/10 bg-white/[0.04] px-2 py-0.5 font-mono text-[11px] text-white/40">v1</span>
              <span className="rounded border border-white/10 bg-white/[0.04] px-2 py-0.5 font-mono text-[11px] text-white/40">https://ai.sultatech.com</span>
            </div>
          </div>

          <div className="space-y-16">

            {/* ── Overview ── */}
            <section id="overview" className="scroll-mt-28">
              <h2 className="mb-3 text-base font-semibold text-white">Overview</h2>
              <p className="text-sm leading-7 text-white/60">
                The Sulta AI Agent API lets you list agents in your account and send messages to any agent by ID.
                All requests are authenticated with your account API key. Responses can be returned as a single JSON
                payload or streamed back as plain text using HTTP chunked transfer encoding.
              </p>

              <div className="mt-5 rounded-lg border border-white/10 bg-white/[0.03] px-4 py-3">
                <p className="mb-1 text-[11px] font-medium text-white/30">Base URL</p>
                <code className="font-mono text-sm text-white/80">https://ai.sultatech.com/api</code>
              </div>
            </section>

            {/* ── Authentication ── */}
            <section id="authentication" className="scroll-mt-28">
              <h2 className="mb-3 text-base font-semibold text-white">Authentication</h2>
              <p className="text-sm leading-7 text-white/60">
                Pass your API key in the <code className="rounded bg-white/8 px-1.5 py-0.5 font-mono text-xs text-white/80">X-API-Key</code> header.
                Keys are prefixed <code className="rounded bg-white/8 px-1.5 py-0.5 font-mono text-xs text-white/80">sulta_sk_</code> and
                can be generated or rotated from <Link href="/settings" className="text-white/70 underline underline-offset-2 hover:text-white">Settings → API keys</Link>.
              </p>

              <div className="mt-5 overflow-hidden rounded-lg border border-white/8">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-white/8 bg-white/[0.025]">
                      <th className="px-4 py-2.5 text-xs font-medium text-white/40">Header</th>
                      <th className="px-4 py-2.5 text-xs font-medium text-white/40">Value</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/8">
                    <tr>
                      <td className="px-4 py-3 font-mono text-xs text-white/70">X-API-Key</td>
                      <td className="px-4 py-3 font-mono text-xs text-white/50">sulta_sk_...</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-mono text-xs text-white/70">Authorization</td>
                      <td className="px-4 py-3 font-mono text-xs text-white/50">Bearer sulta_sk_...</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <p className="mt-3 text-xs text-white/35">
                Keep keys secret. Do not expose them in client-side code or public repositories.
              </p>
            </section>

            {/* ── List Agents ── */}
            <section id="list-agents" className="scroll-mt-28">
              <div className="mb-3 flex items-center gap-3">
                <h2 className="text-base font-semibold text-white">List agents</h2>
                <div className="flex items-center gap-2">
                  <Method v="GET" />
                  <code className="rounded bg-white/5 px-2 py-0.5 font-mono text-xs text-white/60">/api/agents</code>
                </div>
              </div>
              <p className="text-sm leading-7 text-white/60">
                Returns all agents owned by the account tied to the supplied API key.
              </p>

              <div className="mt-5 space-y-4">
                <h3 className="text-[13px] font-semibold text-white/70">Request</h3>
                <CodeBlock code={listAgentsCurl} lang="bash" />

                <h3 className="text-[13px] font-semibold text-white/70">Response</h3>
                <CodeBlock code={listAgentsResponse} lang="json" />
              </div>
            </section>

            {/* ── Chat ── */}
            <section id="chat" className="scroll-mt-28">
              <div className="mb-3 flex flex-wrap items-center gap-3">
                <h2 className="text-base font-semibold text-white">Send a message</h2>
                <div className="flex items-center gap-2">
                  <Method v="POST" />
                  <code className="rounded bg-white/5 px-2 py-0.5 font-mono text-xs text-white/60">/api/agents/chat</code>
                </div>
              </div>
              <p className="text-sm leading-7 text-white/60">
                Send a message to a specific agent. The agent's configured system prompt, context, guardrails, and
                enabled tools are applied automatically. Set <code className="rounded bg-white/8 px-1.5 py-0.5 font-mono text-xs text-white/80">stream: true</code> to
                receive a streamed plain-text response.
              </p>

              {/* Request body params */}
              <div className="mt-6">
                <h3 className="mb-3 text-[13px] font-semibold text-white/70">Request body</h3>
                <div className="overflow-hidden rounded-lg border border-white/8">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b border-white/8 bg-white/[0.025]">
                        <th className="px-4 py-2.5 text-xs font-medium text-white/40">Parameter</th>
                        <th className="px-4 py-2.5 text-xs font-medium text-white/40">Type</th>
                        <th className="px-4 py-2.5 text-xs font-medium text-white/40"></th>
                        <th className="px-4 py-2.5 text-xs font-medium text-white/40">Description</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/8">
                      {[
                        { p: 'agentId',  t: 'string',  desc: 'ID of the agent to query. Obtain from List agents.',         req: false  },
                        { p: 'message',  t: 'string',  desc: 'The user message to send.',                                  req: false  },
                        { p: 'stream',   t: 'boolean', desc: 'When true the response is streamed as plain text chunks.',    req: true   },
                        { p: 'newChat',  t: 'boolean', desc: 'Mark the request as a new conversation for usage tracking.', req: true   },
                      ].map((r) => (
                        <tr key={r.p}>
                          <td className="px-4 py-3 font-mono text-xs text-white/80">{r.p}</td>
                          <td className="px-4 py-3 font-mono text-xs text-white/35">{r.t}</td>
                          <td className="px-4 py-3"><Required optional={r.req} /></td>
                          <td className="px-4 py-3 text-sm text-white/50">{r.desc}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Examples */}
              <div className="mt-6 space-y-5">
                <div>
                  <h3 className="mb-3 text-[13px] font-semibold text-white/70">cURL</h3>
                  <CodeBlock code={chatCurl} lang="bash" />
                </div>
                <div>
                  <h3 className="mb-3 text-[13px] font-semibold text-white/70">Request body</h3>
                  <CodeBlock code={chatRequestJson} lang="json" />
                </div>
                <div>
                  <h3 className="mb-3 text-[13px] font-semibold text-white/70">Response</h3>
                  <CodeBlock code={chatResponseJson} lang="json" />
                </div>
              </div>

              {/* Response fields */}
              <div className="mt-6">
                <h3 className="mb-3 text-[13px] font-semibold text-white/70">Response fields</h3>
                <div className="overflow-hidden rounded-lg border border-white/8">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b border-white/8 bg-white/[0.025]">
                        <th className="px-4 py-2.5 text-xs font-medium text-white/40">Field</th>
                        <th className="px-4 py-2.5 text-xs font-medium text-white/40">Type</th>
                        <th className="px-4 py-2.5 text-xs font-medium text-white/40">Description</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/8">
                      {[
                        { f: 'content',             t: 'string', d: 'The agent\'s reply.' },
                        { f: 'model',               t: 'string', d: 'Model identifier used to generate the response.' },
                        { f: 'usage.inputTokens',   t: 'number', d: 'Tokens consumed by the input (prompt + context).' },
                        { f: 'usage.outputTokens',  t: 'number', d: 'Tokens in the generated response.' },
                        { f: 'usage.totalTokens',   t: 'number', d: 'Sum of input and output tokens.' },
                      ].map((r) => (
                        <tr key={r.f}>
                          <td className="px-4 py-3 font-mono text-xs text-white/80">{r.f}</td>
                          <td className="px-4 py-3 font-mono text-xs text-white/35">{r.t}</td>
                          <td className="px-4 py-3 text-sm text-white/50">{r.d}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>

            {/* ── Streaming ── */}
            <section id="streaming" className="scroll-mt-28">
              <h2 className="mb-3 text-base font-semibold text-white">Streaming</h2>
              <p className="text-sm leading-7 text-white/60">
                Pass <code className="rounded bg-white/8 px-1.5 py-0.5 font-mono text-xs text-white/80">"stream": true</code> to
                receive the response as an HTTP chunked stream. Each chunk is a plain-text fragment — concatenate them
                in order to reconstruct the full reply. There is no wrapper envelope or SSE framing.
              </p>
              <div className="mt-5">
                <h3 className="mb-3 text-[13px] font-semibold text-white/70">JavaScript</h3>
                <CodeBlock code={streamJs} lang="js" />
              </div>
            </section>

            {/* ── Errors ── */}
            <section id="errors" className="scroll-mt-28">
              <h2 className="mb-3 text-base font-semibold text-white">Error codes</h2>
              <p className="text-sm leading-7 text-white/60">
                The API returns standard HTTP status codes. Error bodies are plain text.
              </p>
              <div className="mt-5 overflow-hidden rounded-lg border border-white/8">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-white/8 bg-white/[0.025]">
                      <th className="px-4 py-2.5 text-xs font-medium text-white/40">Status</th>
                      <th className="px-4 py-2.5 text-xs font-medium text-white/40">Meaning</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/8">
                    {[
                      { c: '400', m: 'Bad request — missing required fields in the request body.' },
                      { c: '401', m: 'Missing or invalid API key.' },
                      { c: '403', m: 'API key does not have access to the requested agent.' },
                      { c: '404', m: 'Agent not found.' },
                      { c: '429', m: 'Rate limit exceeded. Reduce request frequency and retry.' },
                      { c: '500', m: 'Internal server error or model provider failure.' },
                    ].map((r) => (
                      <tr key={r.c}>
                        <td className="px-4 py-3 font-mono text-xs text-white/70">{r.c}</td>
                        <td className="px-4 py-3 text-sm text-white/50">{r.m}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

          </div>
        </main>
      </div>
    </div>
  );
}
