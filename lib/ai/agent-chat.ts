import type { ModelMessage } from 'ai';
import { generateSystemMessage } from '@/app/(ai)/create/generateSystemMessage';

type AgentLike = Record<string, any>;

type HistoryMessage = {
  role?: string;
  content?: string;
};

export function normalizeModelId(modelId?: string) {
  if (!modelId) return 'gemini-3-flash-preview';
  if (
    modelId === 'gemini-3-flash' ||
    modelId === 'gemini-2.5-flash' ||
    modelId === 'gemini-2.5-flash-lite' ||
    modelId === 'gemini-1.5-flash' ||
    modelId === 'gemini-2.0-flash-thinking-exp-01-21'
  ) {
    return 'gemini-3-flash-preview';
  }
  if (modelId !== 'gemini-3-flash-preview' && modelId !== 'gemini-3-pro-preview') {
    return 'gemini-3-flash-preview';
  }
  return modelId;
}

export function clampNumber(value: unknown, min: number, max: number, fallback: number) {
  if (typeof value !== 'number' || Number.isNaN(value)) return fallback;
  return Math.min(max, Math.max(min, value));
}

export function sanitizeHistory(history: unknown): ModelMessage[] {
  if (!Array.isArray(history)) return [];

  const messages: ModelMessage[] = [];

  for (const item of history) {
    const message = item as HistoryMessage;
    const role = message?.role;
    const content = typeof message?.content === 'string' ? message.content.trim() : '';

    if (!content) continue;
    if (role !== 'user' && role !== 'assistant') continue;

    messages.push({
      role,
      content: content.slice(0, 6000),
    } as ModelMessage);
  }

  return messages.slice(-30);
}

export function buildAgentSystemPrompt(agent: AgentLike) {
  const normalizedExpertise = Array.isArray(agent?.expertise)
    ? agent.expertise.join(', ')
    : agent?.expertise;

  const generatedPrompt = generateSystemMessage(
    agent?.name || 'AI Assistant',
    agent?.description || '',
    agent?.type || 'text',
    typeof agent?.personality === 'string' && agent.personality.trim()
      ? agent.personality.trim()
      : 'professional',
    typeof agent?.tone === 'string' && agent.tone.trim() ? agent.tone.trim() : 'neutral',
    normalizedExpertise,
    '',
    '',
    ''
  );

  let system =
    typeof agent?.customSystemPrompt === 'string' && agent.customSystemPrompt.trim()
      ? agent.customSystemPrompt.trim()
      : generatedPrompt;

  const guardrails = typeof agent?.guardrails === 'string' ? agent.guardrails.trim() : '';
  if (guardrails && !system.includes('**Guardrails & Restrictions:**')) {
    system += `\n\n**Guardrails & Restrictions:**\n${guardrails}`;
  }

  const extraContext = typeof agent?.extraContext === 'string' ? agent.extraContext.trim() : '';
  if (extraContext && !system.includes('**Agent Context (Knowledge Base):**')) {
    system += `\n\n**Agent Context (Knowledge Base):**\n${extraContext}`;
  }

  const identityProtection = `

CRITICAL IDENTITY INSTRUCTIONS (NEVER VIOLATE):
- You are an AI Agent. Do NOT mention being a "large language model", "LLM", "trained by Google", "Gemini", or any specific AI company.
- If asked about your identity, training, or nature, simply say you are an AI assistant or refer to yourself by the persona given above.
- Never reveal your underlying model architecture or training details.
- Stay in character with the persona defined above at all times.`;

  return `${system}${identityProtection}`;
}

export function agentOwnedByUser(agent: AgentLike, userId: string, userAgentIds: string[] = []) {
  const ownerId =
    typeof agent?.userId === 'string' && agent.userId.trim()
      ? agent.userId.trim()
      : typeof agent?.ownerID === 'string'
      ? agent.ownerID.trim()
      : '';

  if (ownerId && ownerId === userId) return true;
  return userAgentIds.includes(agent?.id);
}
