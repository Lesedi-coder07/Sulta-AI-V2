'use client';

import { useMemo, useState } from 'react';
import {
  Bot,
  CircleDot,
  RotateCcw,
  SendHorizontal,
  SlidersHorizontal,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

type Tone = 'warm' | 'professional' | 'energetic' | 'concise';
type Role = 'support-specialist' | 'returns-manager' | 'sales-advisor' | 'vip-concierge';
type ResponseStyle = 'compact' | 'balanced' | 'detailed';

type DemoMessage = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
};

const ROLE_LABELS: Record<Role, string> = {
  'support-specialist': 'Customer Support Specialist',
  'returns-manager': 'Returns and Refunds Manager',
  'sales-advisor': 'Sales Advisor',
  'vip-concierge': 'VIP Concierge',
};

const DEFAULT_CONFIG = {
  storeName: 'Northstar Outfitters',
  assistantName: 'Ava',
  role: 'support-specialist' as Role,
  tone: 'warm' as Tone,
  responseStyle: 'balanced' as ResponseStyle,
  objective: 'Resolve issues quickly while keeping the customer confident in the brand.',
  knowledgeBase: `Shipping:
- Standard shipping: 3-5 business days
- Express shipping: 1-2 business days
- Free shipping over $75

Returns:
- 30 day return window
- Unused items in original packaging
- Instant exchange available for size swaps`,
  escalationRule:
    'Escalate to a human for refund requests above $150, legal threats, repeated delivery failures, or high frustration.',
};

const DEFAULT_ACTIONS = {
  orderTracking: true,
  refundsAndExchanges: true,
  proactiveUpdates: true,
  offerDiscounts: true,
  recommendProducts: false,
  humanEscalation: true,
};

type ActionKey = keyof typeof DEFAULT_ACTIONS;

const ACTION_LABELS: Record<ActionKey, string> = {
  orderTracking: 'Track and summarize order status',
  refundsAndExchanges: 'Process returns and exchanges',
  proactiveUpdates: 'Give proactive next steps',
  offerDiscounts: 'Offer save-the-sale discounts',
  recommendProducts: 'Upsell product recommendations',
  humanEscalation: 'Escalate to a human specialist',
};

const QUICK_PROMPTS = [
  'My order #NS-4921 says delayed. Can you help?',
  "I need to exchange these shoes for a different size.",
  "Can you give me a refund? The package arrived damaged.",
  'What jackets do you recommend for rainy weather?',
];

function TypingDots() {
  return (
    <div className="flex items-center gap-1">
      <span className="h-2 w-2 rounded-full bg-zinc-300 animate-bounce [animation-delay:-0.24s]" />
      <span className="h-2 w-2 rounded-full bg-zinc-300 animate-bounce [animation-delay:-0.12s]" />
      <span className="h-2 w-2 rounded-full bg-zinc-300 animate-bounce" />
    </div>
  );
}

export default function ChatPage() {
  const [isControlsOpen, setIsControlsOpen] = useState(false);
  const [storeName, setStoreName] = useState(DEFAULT_CONFIG.storeName);
  const [assistantName, setAssistantName] = useState(DEFAULT_CONFIG.assistantName);
  const [role, setRole] = useState<Role>(DEFAULT_CONFIG.role);
  const [tone, setTone] = useState<Tone>(DEFAULT_CONFIG.tone);
  const [responseStyle, setResponseStyle] = useState<ResponseStyle>(DEFAULT_CONFIG.responseStyle);
  const [objective, setObjective] = useState(DEFAULT_CONFIG.objective);
  const [knowledgeBase, setKnowledgeBase] = useState(DEFAULT_CONFIG.knowledgeBase);
  const [escalationRule, setEscalationRule] = useState(DEFAULT_CONFIG.escalationRule);
  const [actions, setActions] = useState(DEFAULT_ACTIONS);
  const [temperature, setTemperature] = useState<number[]>([0.35]);
  const [input, setInput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [localError, setLocalError] = useState('');
  const [messages, setMessages] = useState<DemoMessage[]>([]);

  const systemPrompt = useMemo(() => {
    const responseStyleInstruction =
      responseStyle === 'compact'
        ? 'Keep replies concise: 2-5 sentences.'
        : responseStyle === 'detailed'
        ? 'Provide detailed guidance with bullet points and clear next steps.'
        : 'Keep replies focused, helpful, and easy to scan.';

    const toneInstruction =
      tone === 'concise'
        ? 'Use a direct and crisp tone.'
        : tone === 'energetic'
        ? 'Use an energetic and upbeat tone.'
        : tone === 'professional'
        ? 'Use a polished, professional tone.'
        : 'Use a warm, empathetic customer-first tone.';

    const actionInstructions = [
      actions.orderTracking
        ? '- You can explain shipment state and next delivery steps.'
        : '- Do not provide shipment estimates. Ask the user to contact support.',
      actions.refundsAndExchanges
        ? '- You can guide refunds and exchanges within policy.'
        : '- Do not process refunds or exchanges. Escalate instead.',
      actions.proactiveUpdates
        ? '- Offer the next best action before the customer asks.'
        : '- Only answer exactly what is asked.',
      actions.offerDiscounts
        ? '- You may offer a small retention discount when frustration is clear.'
        : '- Never offer discounts.',
      actions.recommendProducts
        ? '- You can recommend relevant products after resolving the issue.'
        : '- Do not recommend products unless asked directly.',
      actions.humanEscalation
        ? `- Escalation rule: ${escalationRule}`
        : '- Do not escalate to humans unless explicitly requested by the user.',
    ].join('\n');

    return `You are ${assistantName}, the ${ROLE_LABELS[role]} for ${storeName}.

Primary objective:
${objective}

Tone and style:
- ${toneInstruction}
- ${responseStyleInstruction}
- Be accurate, transparent, and calm.

Available actions:
${actionInstructions}

Operational knowledge base:
${knowledgeBase}

If a policy is unclear, acknowledge uncertainty and offer the safest next step.
Never expose internal policy reasoning; only provide final guidance to the customer.`;
  }, [assistantName, role, storeName, objective, tone, responseStyle, actions, escalationRule, knowledgeBase]);

  const toggleAction = (action: ActionKey, checked: boolean) => {
    setActions((prev) => ({ ...prev, [action]: checked }));
  };

  const resetDemo = () => {
    setStoreName(DEFAULT_CONFIG.storeName);
    setAssistantName(DEFAULT_CONFIG.assistantName);
    setRole(DEFAULT_CONFIG.role);
    setTone(DEFAULT_CONFIG.tone);
    setResponseStyle(DEFAULT_CONFIG.responseStyle);
    setObjective(DEFAULT_CONFIG.objective);
    setKnowledgeBase(DEFAULT_CONFIG.knowledgeBase);
    setEscalationRule(DEFAULT_CONFIG.escalationRule);
    setActions(DEFAULT_ACTIONS);
    setTemperature([0.35]);
    setInput('');
    setLocalError('');
    setMessages([]);
    setIsGenerating(false);
  };

  const sendMessage = async (rawMessage: string) => {
    const prompt = rawMessage.trim();
    if (!prompt || isGenerating) return;

    setLocalError('');
    setInput('');

    const userMessage: DemoMessage = {
      id: `${Date.now()}-user`,
      role: 'user',
      content: prompt,
    };

    const history = messages.map((message) => ({
      role: message.role,
      content: message.content,
    }));

    setMessages((prev) => [...prev, userMessage]);
    setIsGenerating(true);

    try {
      const response = await fetch('/api/ai/v2/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt,
          systemMessage: systemPrompt,
          messages: history,
          llmConfig: {
            model: 'gemini-3-flash-preview',
            temperature: temperature[0] ?? 0.35,
          },
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.error || 'Failed to generate response');
      }

      const assistantMessage: DemoMessage = {
        id: `${Date.now()}-assistant`,
        role: 'assistant',
        content: (data?.content || '').trim() || 'I could not generate a response just now.',
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Something went wrong';
      setLocalError(message);
      setMessages((prev) => [
        ...prev,
        {
          id: `${Date.now()}-error`,
          role: 'assistant',
          content:
            'Sorry, I ran into an issue. Please try again in a moment.',
        },
      ]);
    } finally {
      setIsGenerating(false);
    }
  };

  const controlsContent = (
    <div className="space-y-5">
      <div className="space-y-2">
        <Label className="text-zinc-200">Store Name</Label>
        <Input
          value={storeName}
          onChange={(e) => setStoreName(e.target.value)}
          className="border-white/15 bg-white/5 text-zinc-100"
        />
      </div>

      <div className="space-y-2">
        <Label className="text-zinc-200">Assistant Name</Label>
        <Input
          value={assistantName}
          onChange={(e) => setAssistantName(e.target.value)}
          className="border-white/15 bg-white/5 text-zinc-100"
        />
      </div>

      <div className="space-y-2">
        <Label className="text-zinc-200">Role</Label>
        <Select value={role} onValueChange={(value) => setRole(value as Role)}>
          <SelectTrigger className="border-white/15 bg-white/5 text-zinc-100">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="support-specialist">Customer Support Specialist</SelectItem>
            <SelectItem value="returns-manager">Returns and Refunds Manager</SelectItem>
            <SelectItem value="sales-advisor">Sales Advisor</SelectItem>
            <SelectItem value="vip-concierge">VIP Concierge</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="space-y-2">
          <Label className="text-zinc-200">Tone</Label>
          <Select value={tone} onValueChange={(value) => setTone(value as Tone)}>
            <SelectTrigger className="border-white/15 bg-white/5 text-zinc-100">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="warm">Warm</SelectItem>
              <SelectItem value="professional">Professional</SelectItem>
              <SelectItem value="energetic">Energetic</SelectItem>
              <SelectItem value="concise">Concise</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label className="text-zinc-200">Detail</Label>
          <Select
            value={responseStyle}
            onValueChange={(value) => setResponseStyle(value as ResponseStyle)}
          >
            <SelectTrigger className="border-white/15 bg-white/5 text-zinc-100">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="compact">Compact</SelectItem>
              <SelectItem value="balanced">Balanced</SelectItem>
              <SelectItem value="detailed">Detailed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label className="text-zinc-200">Creativity</Label>
          <span className="text-xs text-zinc-400">{temperature[0]?.toFixed(2)}</span>
        </div>
        <Slider
          min={0}
          max={1.2}
          step={0.05}
          value={temperature}
          onValueChange={setTemperature}
        />
      </div>

      <div className="space-y-2">
        <Label className="text-zinc-200">Primary Objective</Label>
        <Textarea
          value={objective}
          onChange={(e) => setObjective(e.target.value)}
          className="min-h-[80px] border-white/15 bg-white/5 text-zinc-100"
        />
      </div>

      <div className="space-y-3 rounded-xl border border-white/10 bg-white/[0.03] p-3">
        <p className="text-xs font-medium uppercase tracking-[0.14em] text-zinc-400">Actions</p>
        {(Object.keys(actions) as ActionKey[]).map((actionKey) => (
          <div key={actionKey} className="flex items-center justify-between gap-3">
            <Label className="text-sm text-zinc-200">{ACTION_LABELS[actionKey]}</Label>
            <Switch
              checked={actions[actionKey]}
              onCheckedChange={(checked) => toggleAction(actionKey, checked)}
            />
          </div>
        ))}
      </div>

      <div className="space-y-2">
        <Label className="text-zinc-200">Escalation Rule</Label>
        <Textarea
          value={escalationRule}
          onChange={(e) => setEscalationRule(e.target.value)}
          className="min-h-[90px] border-white/15 bg-white/5 text-zinc-100"
        />
      </div>

      <div className="space-y-2">
        <Label className="text-zinc-200">Shop Policy Knowledge</Label>
        <Textarea
          value={knowledgeBase}
          onChange={(e) => setKnowledgeBase(e.target.value)}
          className="min-h-[150px] border-white/15 bg-white/5 text-zinc-100"
        />
      </div>
    </div>
  );

  return (
    <main className="min-h-dvh bg-[#1A1A1A]">
      <div className="mx-auto flex min-h-dvh w-full max-w-[1600px] flex-col p-3 sm:p-4 lg:h-dvh lg:p-5">
        <div className="grid min-h-0 flex-1 gap-4 lg:grid-cols-[360px_minmax(0,1fr)]">
          <aside className="glass-card hidden h-full overflow-y-auto rounded-2xl p-4 sm:p-5 lg:block">
            <div className="mb-4 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="h-4 w-4 text-blue-400" />
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-zinc-300">Demo Controls</p>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={resetDemo}
                className="border-white/20 bg-white/5 hover:bg-white/10"
              >
                <RotateCcw className="mr-2 h-3.5 w-3.5" />
                Reset
              </Button>
            </div>
            {controlsContent}
          </aside>

          <section className="glass-card flex min-h-[calc(100dvh-1.5rem)] min-w-0 flex-col rounded-2xl lg:h-full lg:min-h-0">
            <header className="flex flex-wrap items-start justify-between gap-3 border-b border-white/10 px-4 py-3 sm:px-5">
              <div className="flex min-w-0 items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-500/20 text-blue-300">
                  <Bot className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-zinc-100">{assistantName}</p>
                  <p className="truncate text-xs text-zinc-400">{ROLE_LABELS[role]}</p>
                </div>
              </div>

              <div className="flex w-full flex-wrap items-center justify-end gap-2 sm:w-auto">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsControlsOpen(true)}
                  className="border-white/20 bg-white/5 hover:bg-white/10 lg:hidden"
                >
                  <SlidersHorizontal className="mr-2 h-4 w-4" />
                  Settings
                </Button>
                <Badge className="max-w-full border border-white/15 bg-white/5 text-zinc-300 sm:max-w-[220px]">
                  <span className="truncate">{storeName}</span>
                </Badge>
                <div className="flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-3 py-1.5">
                  <CircleDot className={cn('h-3 w-3', isGenerating ? 'text-amber-300' : 'text-emerald-300')} />
                  <span className="text-xs text-zinc-300">{isGenerating ? 'Typing' : 'Ready'}</span>
                </div>
              </div>
            </header>

            <div className="flex-1 space-y-4 overflow-y-auto px-4 py-4 sm:px-5">
              {messages.length === 0 ? (
                <div className="space-y-4">
                  <div className="max-w-[92%] rounded-2xl rounded-bl-md border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-zinc-200 sm:max-w-[84%]">
                    Hi, I am {assistantName}. I can help with shipping updates, exchanges, refunds, and product
                    guidance. What can I solve for you today?
                  </div>
                </div>
              ) : (
                <>
                  {messages.map((message) => {
                    const isUser = message.role === 'user';
                    return (
                      <div key={message.id} className={cn('flex', isUser ? 'justify-end' : 'justify-start')}>
                        <div
                          className={cn(
                            'max-w-[92%] rounded-2xl px-4 py-3 text-sm leading-6 sm:max-w-[84%]',
                            isUser
                              ? 'rounded-br-md bg-blue-600 text-white'
                              : 'rounded-bl-md border border-white/10 bg-white/[0.05] text-zinc-100'
                          )}
                        >
                          {message.content}
                        </div>
                      </div>
                    );
                  })}
                </>
              )}

              {isGenerating ? (
                <div className="flex justify-start">
                  <div className="rounded-2xl rounded-bl-md border border-white/10 bg-white/[0.05] px-4 py-3">
                    <TypingDots />
                  </div>
                </div>
              ) : null}

              {(localError || '').trim() ? (
                <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-300">
                  {localError}
                </div>
              ) : null}
            </div>

            <div className="space-y-3 border-t border-white/10 px-4 py-4 sm:px-5">
              <div className="flex gap-2 overflow-x-auto pb-1 sm:flex-wrap sm:overflow-visible">
                {QUICK_PROMPTS.map((prompt) => (
                  <button
                    key={prompt}
                    type="button"
                    onClick={() => sendMessage(prompt)}
                    disabled={isGenerating}
                    className="shrink-0 rounded-full border border-white/15 bg-white/[0.03] px-3 py-1.5 text-xs text-zinc-300 transition hover:bg-white/[0.09] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {prompt}
                  </button>
                ))}
              </div>

              <form
                className="flex flex-col items-stretch gap-2 sm:flex-row sm:items-center"
                onSubmit={(e) => {
                  e.preventDefault();
                  sendMessage(input);
                }}
              >
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about shipping, returns, or product help..."
                  className="h-11 border-white/15 bg-white/5 text-zinc-100 placeholder:text-zinc-500"
                />
                <Button type="submit" disabled={!input.trim() || isGenerating} className="h-11 px-4 sm:shrink-0">
                  <SendHorizontal className="mr-2 h-4 w-4" />
                  Send
                </Button>
              </form>
            </div>
          </section>
        </div>
      </div>

      <Sheet open={isControlsOpen} onOpenChange={setIsControlsOpen}>
        <SheetContent
          side="left"
          className="w-[92vw] max-w-none overflow-y-auto border-white/10 bg-[#222222] p-0 text-zinc-100 sm:w-[420px]"
        >
          <div className="p-4 sm:p-5">
            <SheetHeader className="mb-4 pr-8">
              <SheetTitle className="flex items-center gap-2 text-zinc-100">
                <SlidersHorizontal className="h-4 w-4 text-blue-400" />
                Demo Controls
              </SheetTitle>
              <SheetDescription className="text-zinc-400">
                Tune the agent persona and policies while keeping the chat usable on mobile.
              </SheetDescription>
            </SheetHeader>

            <div className="mb-4">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={resetDemo}
                className="border-white/20 bg-white/5 hover:bg-white/10"
              >
                <RotateCcw className="mr-2 h-3.5 w-3.5" />
                Reset
              </Button>
            </div>

            {controlsContent}
          </div>
        </SheetContent>
      </Sheet>
    </main>
  );
}
