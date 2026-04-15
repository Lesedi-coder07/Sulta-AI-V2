import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import { Badge } from '@/components/ui/badge';

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

function CodeBlock({ code, lang }: { code: string; lang?: string }) {
  return (
    <div className="group relative">
      {lang && (
        <span className="absolute right-3 top-3 text-[10px] font-medium uppercase tracking-widest text-white/20 select-none">
          {lang}
        </span>
      )}
      <pre className="overflow-x-auto rounded-lg border border-white/8 bg-[#0a0a0a] p-4 text-xs leading-relaxed text-slate-300">
        <code>{code}</code>
      </pre>
    </div>
  );
}

function MethodBadge({ method }: { method: string }) {
  const colors: Record<string, string> = {
    GET: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20',
    POST: 'text-blue-400 bg-blue-400/10 border-blue-400/20',
    DELETE: 'text-red-400 bg-red-400/10 border-red-400/20',
  };
  return (
    <span className={`inline-flex items-center rounded border px-2 py-0.5 font-mono text-[11px] font-semibold ${colors[method] ?? 'text-slate-300 bg-white/5 border-white/10'}`}>
      {method}
    </span>
  );
}

function EndpointRow({ method, path, description }: { method: string; path: string; description: string }) {
  return (
    <div className="flex flex-col gap-1.5 border-t border-white/8 px-4 py-4 first:border-t-0 sm:flex-row sm:items-start sm:gap-4">
      <MethodBadge method={method} />
      <code className="flex-shrink-0 rounded bg-white/5 px-2 py-0.5 font-mono text-xs text-white/80">{path}</code>
      <p className="text-sm text-white/40">{description}</p>
    </div>
  );
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-lg font-semibold text-white">{children}</h2>
  );
}

function Prose({ children }: { children: React.ReactNode }) {
  return <p className="text-sm leading-7 text-white/50">{children}</p>;
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return <p className="mb-2 text-xs font-medium uppercase tracking-widest text-white/25">{children}</p>;
}

export default function ApiDocsPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-slate-100">
      <Navbar />

      <div className="mx-auto flex max-w-6xl px-4 pt-20 sm:px-6 lg:px-8">
        {/* Sidebar */}
        <aside className="hidden w-52 flex-shrink-0 lg:block">
          <div className="sticky top-24">
            <p className="mb-3 text-[10px] font-semibold uppercase tracking-widest text-white/25">
              API Reference
            </p>
            <nav className="space-y-0.5">
              {sections.map((s) => (
                <a
                  key={s.id}
                  href={`#${s.id}`}
                  className="block rounded px-2 py-1.5 text-sm text-white/40 transition-colors hover:bg-white/5 hover:text-white/80"
                >
                  {s.label}
                </a>
              ))}
            </nav>

            <div className="mt-8 border-t border-white/8 pt-6">
              <p className="mb-3 text-[10px] font-semibold uppercase tracking-widest text-white/25">
                Resources
              </p>
              <nav className="space-y-0.5">
                <Link href="/dashboard" className="block rounded px-2 py-1.5 text-sm text-white/40 transition-colors hover:bg-white/5 hover:text-white/80">
                  Dashboard
                </Link>
                <Link href="/settings" className="block rounded px-2 py-1.5 text-sm text-white/40 transition-colors hover:bg-white/5 hover:text-white/80">
                  API Keys
                </Link>
              </nav>
            </div>
          </div>
        </aside>

        {/* Main content */}
        <main className="min-w-0 flex-1 pb-24 lg:pl-12">
          {/* Page title */}
          <div className="mb-10 border-b border-white/8 pb-8">
            <div className="mb-3 flex items-center gap-2">
              <span className="text-[10px] font-semibold uppercase tracking-widest text-white/25">Sulta AI</span>
              <span className="text-white/15">/</span>
              <span className="text-[10px] font-semibold uppercase tracking-widest text-white/25">API Reference</span>
            </div>
            <h1 className="text-2xl font-semibold text-white">Agent API</h1>
            <p className="mt-1.5 text-sm text-white/40">
              HTTP access to your agents — list, chat, and stream responses.
            </p>
            <div className="mt-3 flex items-center gap-2">
              <span className="rounded border border-white/10 bg-white/5 px-2 py-0.5 font-mono text-[11px] text-white/50">v1</span>
              <span className="rounded border border-white/10 bg-white/5 px-2 py-0.5 font-mono text-[11px] text-white/50">
                https://ai.sultatech.com
              </span>
            </div>
          </div>

          <div className="space-y-14">
            {/* Overview */}
            <section id="overview" className="scroll-mt-24 space-y-3">
              <SectionHeading>Overview</SectionHeading>
              <Prose>
                Access your account agents over HTTP using your account API key. List available agents, send messages to a specific agent by ID, and choose between streaming and non-streaming responses per request.
              </Prose>
              <div className="rounded-lg border border-white/8 bg-white/[0.02] p-4">
                <p className="mb-1 text-xs font-medium text-white/30">Base URL</p>
                <code className="font-mono text-sm text-white/70">https://ai.sultatech.com/api</code>
              </div>
            </section>

            {/* Authentication */}
            <section id="auth" className="scroll-mt-24 space-y-4">
              <SectionHeading>Authentication</SectionHeading>
              <Prose>
                Every request requires your account API key. Generate and rotate keys from the dashboard Settings page.
              </Prose>
              <div className="overflow-hidden rounded-lg border border-white/8">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-white/8 bg-white/[0.02]">
                      <th className="px-4 py-2.5 text-xs font-medium text-white/40">Method</th>
                      <th className="px-4 py-2.5 text-xs font-medium text-white/40">Header</th>
                      <th className="px-4 py-2.5 text-xs font-medium text-white/40">Value</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/8">
                    <tr>
                      <td className="px-4 py-3 text-sm text-white/50">API Key</td>
                      <td className="px-4 py-3 font-mono text-xs text-white/70">X-API-Key</td>
                      <td className="px-4 py-3 font-mono text-xs text-white/50">sulta_sk_xxx...</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 text-sm text-white/50">Bearer</td>
                      <td className="px-4 py-3 font-mono text-xs text-white/70">Authorization</td>
                      <td className="px-4 py-3 font-mono text-xs text-white/50">Bearer sulta_sk_xxx...</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            {/* Endpoints */}
            <section id="endpoints" className="scroll-mt-24 space-y-4">
              <SectionHeading>Endpoints</SectionHeading>
              <div className="overflow-hidden rounded-lg border border-white/8">
                <EndpointRow
                  method="GET"
                  path="/api/agents"
                  description="Returns agents owned by the account tied to the provided API key."
                />
                <EndpointRow
                  method="POST"
                  path="/api/agents/chat"
                  description="Chat with a specific agent by ID. Supports streaming and non-streaming modes."
                />
              </div>
              <FieldLabel>List agents — example</FieldLabel>
              <CodeBlock code={listAgentsCurl} lang="curl" />
            </section>

            {/* Chat API */}
            <section id="chat" className="scroll-mt-24 space-y-5">
              <SectionHeading>Chat API</SectionHeading>
              <Prose>
                Send a message to an agent using <code className="font-mono text-white/70">POST /api/agents/chat</code>. Control whether the response streams back or returns in a single payload.
              </Prose>

              <div>
                <FieldLabel>Request body</FieldLabel>
                <div className="overflow-hidden rounded-lg border border-white/8">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="border-b border-white/8 bg-white/[0.02]">
                        <th className="px-4 py-2.5 text-xs font-medium text-white/40">Field</th>
                        <th className="px-4 py-2.5 text-xs font-medium text-white/40">Type</th>
                        <th className="px-4 py-2.5 text-xs font-medium text-white/40">Required</th>
                        <th className="px-4 py-2.5 text-xs font-medium text-white/40">Description</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/8">
                      {[
                        { field: 'agentId', type: 'string', req: 'yes', desc: 'Target agent to run.' },
                        { field: 'message', type: 'string', req: 'yes*', desc: 'User message. Required unless you pass messages/history.' },
                        { field: 'stream', type: 'boolean', req: 'no', desc: 'If true, returns a streaming text response.' },
                        { field: 'newChat', type: 'boolean', req: 'no', desc: 'Marks the request as a new conversation for analytics.' },
                      ].map((row) => (
                        <tr key={row.field}>
                          <td className="px-4 py-3 font-mono text-xs text-white/80">{row.field}</td>
                          <td className="px-4 py-3 text-xs text-white/40">{row.type}</td>
                          <td className="px-4 py-3 text-xs text-white/40">{row.req}</td>
                          <td className="px-4 py-3 text-sm text-white/40">{row.desc}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="space-y-3">
                <FieldLabel>Non-streaming request</FieldLabel>
                <CodeBlock code={chatJsonExample} lang="json" />
              </div>

              <div className="space-y-3">
                <FieldLabel>cURL</FieldLabel>
                <CodeBlock code={chatCurlExample} lang="curl" />
              </div>

              <div className="space-y-3">
                <FieldLabel>JavaScript — streaming</FieldLabel>
                <CodeBlock code={chatStreamJsExample} lang="js" />
              </div>

              <div className="space-y-3">
                <FieldLabel>Non-streaming response</FieldLabel>
                <CodeBlock code={nonStreamResponse} lang="json" />
              </div>
            </section>

            {/* Error Codes */}
            <section id="errors" className="scroll-mt-24 space-y-4">
              <SectionHeading>Error Codes</SectionHeading>
              <div className="overflow-hidden rounded-lg border border-white/8">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-white/8 bg-white/[0.02]">
                      <th className="px-4 py-2.5 text-xs font-medium text-white/40">Status</th>
                      <th className="px-4 py-2.5 text-xs font-medium text-white/40">Meaning</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/8">
                    {[
                      { code: '401', msg: 'Missing or invalid API key.' },
                      { code: '403', msg: 'API key does not have access to the requested agent.' },
                      { code: '404', msg: 'Agent not found.' },
                      { code: '500', msg: 'Server or model-provider configuration error.' },
                    ].map((row) => (
                      <tr key={row.code}>
                        <td className="px-4 py-3 font-mono text-xs text-white/70">{row.code}</td>
                        <td className="px-4 py-3 text-sm text-white/40">{row.msg}</td>
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
