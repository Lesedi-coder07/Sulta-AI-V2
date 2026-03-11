import Link from 'next/link';

import Footer from '@/components/layout/Footer';
import Navbar from '@/components/layout/Navbar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const sections = [
  { id: 'overview', label: 'Overview' },
  { id: 'auth', label: 'Authentication' },
  { id: 'endpoints', label: 'Endpoints' },
  { id: 'chat', label: 'Chat API' },
  { id: 'errors', label: 'Error Codes' },
];

const listAgentsCurl = `curl -X GET "https://ai.sultatech.com/api/agents" \\
  -H "X-API-Key: sulta_sk_xxx..."`;

const chatJsonExample = `{
  "agentId": "AGENT_ID",
  "message": "Give me a summary of today's support tickets",
  "stream": false,
  "newChat": true
}`;

const chatCurlExample = `curl -X POST "https://ai.sultatech.com/api/agents/chat" \\
  -H "Content-Type: application/json" \\
  -H "X-API-Key: sulta_sk_xxx..." \\
  -d '{
    "agentId": "AGENT_ID",
    "message": "Hello!",
    "stream": false
  }'`;

const chatStreamJsExample = `const response = await fetch("https://ai.sultatech.com/api/agents/chat", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "X-API-Key": "sulta_sk_xxx..."
  },
  body: JSON.stringify({
    agentId: "AGENT_ID",
    message: "Walk me through this month's KPI changes.",
    stream: true
  })
});

if (!response.ok) throw new Error("Request failed");
const reader = response.body?.getReader();
const decoder = new TextDecoder();

while (reader) {
  const { value, done } = await reader.read();
  if (done) break;
  process.stdout.write(decoder.decode(value));
}`;

const nonStreamResponse = `{
  "content": "Here is your agent response...",
  "model": "gemini-3-flash-preview",
  "usage": {
    "inputTokens": 241,
    "outputTokens": 73,
    "totalTokens": 314
  }
}`;

function CodeBlock({ code }: { code: string }) {
  return (
    <pre className="overflow-x-auto rounded-2xl border border-white/10 bg-[#050A13] p-4 text-xs text-slate-200">
      <code>{code}</code>
    </pre>
  );
}

function EndpointRow({
  method,
  path,
  description,
}: {
  method: string;
  path: string;
  description: string;
}) {
  return (
    <div className="grid gap-3 border-t border-white/10 px-5 py-5 first:border-t-0 md:grid-cols-[90px_220px_1fr] md:items-start md:gap-6">
      <Badge className="w-fit border border-white/10 bg-white/[0.05] text-slate-200">{method}</Badge>
      <code className="w-fit rounded bg-white/[0.04] px-2 py-1 text-xs text-slate-200">{path}</code>
      <p className="text-sm leading-7 text-slate-400">{description}</p>
    </div>
  );
}

export default function ApiDocsPage() {
  return (
    <div className="min-h-screen bg-[#03060D] text-slate-100">
      <Navbar />

      <main className="relative overflow-hidden pb-24 pt-16">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-[-120px] top-14 h-[560px] w-[300px] rounded-full bg-white/8 blur-[140px]" />
          <div className="absolute right-[-120px] top-40 h-[540px] w-[260px] rounded-full bg-slate-300/8 blur-[150px]" />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:48px_48px] opacity-25" />
        </div>

        <section className="relative mx-auto max-w-6xl px-4 pb-20 pt-12 text-center sm:px-6 lg:px-8 lg:pt-20">
          <div className="mx-auto max-w-4xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/[0.04] px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-slate-300">
              Docs
            </div>

            <h1 className="mt-8 text-[clamp(2.35rem,6vw,4.4rem)] font-semibold leading-[1.04] text-white [text-wrap:balance]">
              Agent API docs
            </h1>

            <p className="mx-auto mt-8 max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">
              Use account API keys to list agents and chat with them over HTTP, with both streaming and non-streaming
              response modes.
            </p>

            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <Link href="/signup">
                <Button className="h-11 rounded-lg border border-white/15 bg-white px-6 text-sm font-semibold text-slate-950 hover:bg-slate-200">
                  Create Account
                </Button>
              </Link>
              <a href="#endpoints">
                <Button
                  variant="outline"
                  className="h-11 rounded-lg border-white/20 bg-transparent px-6 text-sm text-slate-200 hover:bg-white/5 hover:text-white"
                >
                  Jump to Endpoints
                </Button>
              </a>
            </div>
          </div>
        </section>

        <section className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#070D18]/70 lg:grid lg:grid-cols-[240px_1fr]">
            <aside className="border-b border-white/10 px-5 py-6 lg:border-b-0 lg:border-r lg:px-6 lg:py-8">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Navigation</p>
              <nav className="mt-4 space-y-1">
                {sections.map((section) => (
                  <a
                    key={section.id}
                    href={`#${section.id}`}
                    className="block rounded-lg px-3 py-2 text-sm text-slate-300 transition hover:bg-white/5 hover:text-white"
                  >
                    {section.label}
                  </a>
                ))}
              </nav>
            </aside>

            <div className="space-y-14 px-5 py-6 sm:px-8 sm:py-8">
              <section id="overview" className="space-y-4 scroll-mt-24">
                <Badge className="border border-white/10 bg-white/[0.05] text-slate-200">v1</Badge>
                <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">Overview</h2>
                <p className="max-w-3xl text-sm leading-7 text-slate-400 sm:text-base">
                  Access your account agents over HTTP using your account API key. List available agents, send chats to
                  a specific agent ID, and choose streaming or non-streaming responses per request.
                </p>
              </section>

              <section id="auth" className="space-y-4 scroll-mt-24">
                <h2 className="text-2xl font-semibold tracking-tight text-white">Authentication</h2>
                <p className="text-sm leading-7 text-slate-400">
                  Every API request needs your account key. Generate and rotate keys from the dashboard, then pass them
                  via <code className="text-slate-200">X-API-Key</code> or{' '}
                  <code className="text-slate-200">Authorization: Bearer ...</code>.
                </p>
              </section>

              <section id="endpoints" className="space-y-5 scroll-mt-24">
                <h2 className="text-2xl font-semibold tracking-tight text-white">Endpoints</h2>
                <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#050A13]/70">
                  <EndpointRow
                    method="GET"
                    path="/api/agents"
                    description="Returns agents owned by the account tied to the provided API key."
                  />
                  <EndpointRow
                    method="POST"
                    path="/api/agents/chat"
                    description="Chat with one specific agent by its ID. Supports stream and non-stream modes."
                  />
                </div>
                <CodeBlock code={listAgentsCurl} />
              </section>

              <section id="chat" className="space-y-5 scroll-mt-24">
                <h2 className="text-2xl font-semibold tracking-tight text-white">Chat API</h2>

                <div className="overflow-hidden rounded-2xl border border-white/10">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-white/[0.03] text-slate-300">
                      <tr>
                        <th className="px-4 py-3 font-medium">Field</th>
                        <th className="px-4 py-3 font-medium">Type</th>
                        <th className="px-4 py-3 font-medium">Required</th>
                        <th className="px-4 py-3 font-medium">Description</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/10 text-slate-400">
                      <tr>
                        <td className="px-4 py-3 font-mono text-slate-200">agentId</td>
                        <td className="px-4 py-3">string</td>
                        <td className="px-4 py-3">yes</td>
                        <td className="px-4 py-3">Target agent to run.</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 font-mono text-slate-200">message</td>
                        <td className="px-4 py-3">string</td>
                        <td className="px-4 py-3">yes*</td>
                        <td className="px-4 py-3">User message. Required unless you pass messages/history.</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 font-mono text-slate-200">stream</td>
                        <td className="px-4 py-3">boolean</td>
                        <td className="px-4 py-3">no</td>
                        <td className="px-4 py-3">If true, returns a streaming text response.</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 font-mono text-slate-200">newChat</td>
                        <td className="px-4 py-3">boolean</td>
                        <td className="px-4 py-3">no</td>
                        <td className="px-4 py-3">Marks the request as a new conversation for analytics.</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <p className="text-sm text-slate-400">Non-stream request body</p>
                <CodeBlock code={chatJsonExample} />

                <p className="text-sm text-slate-400">cURL request</p>
                <CodeBlock code={chatCurlExample} />

                <p className="text-sm text-slate-400">JavaScript streaming request</p>
                <CodeBlock code={chatStreamJsExample} />

                <p className="text-sm text-slate-400">Non-stream response shape</p>
                <CodeBlock code={nonStreamResponse} />
              </section>

              <section id="errors" className="space-y-4 scroll-mt-24">
                <h2 className="text-2xl font-semibold tracking-tight text-white">Error Codes</h2>
                <div className="overflow-hidden rounded-2xl border border-white/10">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-white/[0.03] text-slate-300">
                      <tr>
                        <th className="px-4 py-3 font-medium">Status</th>
                        <th className="px-4 py-3 font-medium">Meaning</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/10 text-slate-400">
                      <tr>
                        <td className="px-4 py-3 text-slate-200">401</td>
                        <td className="px-4 py-3">Missing or invalid API key.</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 text-slate-200">403</td>
                        <td className="px-4 py-3">API key does not have access to the requested agent.</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 text-slate-200">404</td>
                        <td className="px-4 py-3">Agent not found.</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 text-slate-200">500</td>
                        <td className="px-4 py-3">Server or model-provider configuration error.</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </section>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
