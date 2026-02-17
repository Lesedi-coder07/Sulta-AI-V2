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
    message: "Walk me through this month\\'s KPI changes.",
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
    <pre className="overflow-x-auto rounded-xl border border-white/10 bg-black/40 p-4 text-xs text-zinc-200">
      <code>{code}</code>
    </pre>
  );
}

function EndpointCard({
  method,
  path,
  description,
}: {
  method: string;
  path: string;
  description: string;
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
      <div className="flex items-center gap-3">
        <Badge className="bg-zinc-800 text-zinc-200 border border-white/10">{method}</Badge>
        <code className="rounded bg-black/40 px-2 py-1 text-xs text-zinc-200">{path}</code>
      </div>
      <p className="mt-3 text-sm text-zinc-400">{description}</p>
    </div>
  );
}

export default function ApiDocsPage() {
  return (
    <main className="min-h-screen w-screen bg-[radial-gradient(circle_at_top,rgba(72,72,80,0.5),rgba(24,24,27,1)_45%)] text-zinc-100">
      <div className="min-h-screen w-full border-y border-white/10 bg-[linear-gradient(180deg,#0a0a0f_0%,#050507_100%)] shadow-2xl shadow-black/40 lg:border-x-0">
        <div className="grid min-h-screen gap-0 lg:grid-cols-[260px_1fr]">
          <aside className="border-b border-white/10 p-6 lg:sticky lg:top-0 lg:h-screen lg:border-b-0 lg:border-r">
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.16em] text-zinc-500">Sulta API</p>
            <nav className="space-y-1">
              {sections.map((section) => (
                <a
                  key={section.id}
                  href={`#${section.id}`}
                  className="block rounded-lg px-3 py-2 text-sm text-zinc-300 transition hover:bg-white/5 hover:text-white"
                >
                  {section.label}
                </a>
              ))}
            </nav>
          </aside>

          <div className="space-y-12 p-6 sm:p-10">
            <section id="overview" className="space-y-4 scroll-mt-16">
              <Badge className="border border-sky-500/40 bg-sky-500/10 text-sky-300">v1</Badge>
              <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Agent API</h1>
              <p className="max-w-3xl text-sm leading-7 text-zinc-400 sm:text-base">
                Access your account agents over HTTP using your account API key. List available agents, send chats to a
                specific agent ID, and choose streaming or non-streaming responses per request.
              </p>
            </section>

            <section id="auth" className="space-y-4 scroll-mt-16">
              <h2 className="text-2xl font-semibold tracking-tight">Authentication</h2>
              <p className="text-sm text-zinc-400">
                Every API request needs your account key. Generate and rotate keys from the dashboard only, then pass
                them via <code className="text-zinc-200">X-API-Key</code> or{' '}
                <code className="text-zinc-200">Authorization: Bearer ...</code>.
              </p>
            </section>

            <section id="endpoints" className="space-y-4 scroll-mt-16">
              <h2 className="text-2xl font-semibold tracking-tight">Endpoints</h2>
              <EndpointCard
                method="GET"
                path="/api/agents"
                description="Returns agents owned by the account tied to the provided API key."
              />
              <CodeBlock code={listAgentsCurl} />
              <EndpointCard
                method="POST"
                path="/api/agents/chat"
                description="Chat with one specific agent by its ID. Supports stream and non-stream modes."
              />
            </section>

            <section id="chat" className="space-y-5 scroll-mt-16">
              <h2 className="text-2xl font-semibold tracking-tight">Chat API</h2>

              <div className="overflow-hidden rounded-xl border border-white/10">
                <table className="w-full text-left text-sm">
                  <thead className="bg-white/[0.03] text-zinc-300">
                    <tr>
                      <th className="px-4 py-3 font-medium">Field</th>
                      <th className="px-4 py-3 font-medium">Type</th>
                      <th className="px-4 py-3 font-medium">Required</th>
                      <th className="px-4 py-3 font-medium">Description</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/10 text-zinc-400">
                    <tr>
                      <td className="px-4 py-3 font-mono text-zinc-200">agentId</td>
                      <td className="px-4 py-3">string</td>
                      <td className="px-4 py-3">yes</td>
                      <td className="px-4 py-3">Target agent to run.</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-mono text-zinc-200">message</td>
                      <td className="px-4 py-3">string</td>
                      <td className="px-4 py-3">yes*</td>
                      <td className="px-4 py-3">User message. Required unless you pass messages/history.</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-mono text-zinc-200">stream</td>
                      <td className="px-4 py-3">boolean</td>
                      <td className="px-4 py-3">no</td>
                      <td className="px-4 py-3">If true, returns a streaming text response.</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-mono text-zinc-200">newChat</td>
                      <td className="px-4 py-3">boolean</td>
                      <td className="px-4 py-3">no</td>
                      <td className="px-4 py-3">Marks the request as a new conversation for analytics.</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <p className="text-sm text-zinc-400">Non-stream request body</p>
              <CodeBlock code={chatJsonExample} />

              <p className="text-sm text-zinc-400">cURL request</p>
              <CodeBlock code={chatCurlExample} />

              <p className="text-sm text-zinc-400">JavaScript streaming request</p>
              <CodeBlock code={chatStreamJsExample} />

              <p className="text-sm text-zinc-400">Non-stream response shape</p>
              <CodeBlock code={nonStreamResponse} />
            </section>

            <section id="errors" className="space-y-4 scroll-mt-16">
              <h2 className="text-2xl font-semibold tracking-tight">Error Codes</h2>
              <div className="overflow-hidden rounded-xl border border-white/10">
                <table className="w-full text-left text-sm">
                  <thead className="bg-white/[0.03] text-zinc-300">
                    <tr>
                      <th className="px-4 py-3 font-medium">Status</th>
                      <th className="px-4 py-3 font-medium">Meaning</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/10 text-zinc-400">
                    <tr>
                      <td className="px-4 py-3 text-zinc-200">401</td>
                      <td className="px-4 py-3">Missing or invalid API key.</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 text-zinc-200">403</td>
                      <td className="px-4 py-3">API key does not have access to the requested agent.</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 text-zinc-200">404</td>
                      <td className="px-4 py-3">Agent not found.</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 text-zinc-200">500</td>
                      <td className="px-4 py-3">Server or model-provider configuration error.</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}
