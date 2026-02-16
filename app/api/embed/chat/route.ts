import { generateText, type ModelMessage } from 'ai';
import { google } from '@ai-sdk/google';
import { adminDb } from '@/lib/firebase-admin';
import { generateSystemMessage } from '@/app/(ai)/create/generateSystemMessage';
import { FieldValue } from 'firebase-admin/firestore';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

type EmbedHistoryMessage = {
  role?: string;
  content?: string;
};

type AgentDoc = Record<string, any>;

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      ...CORS_HEADERS,
      'Content-Type': 'application/json',
    },
  });
}

function normalizeModelId(modelId?: string) {
  if (!modelId) return 'gemini-3-flash-preview';
  if (
    modelId === 'gemini-3-flash' ||
    modelId === 'gemini-2.5-flash' ||
    modelId === 'gemini-2.5-flash-lite' ||
    modelId === 'gemini-1.5-flash' ||
    modelId === 'gemini-2.0-flash-thinking-exp-01-21'
  ) return 'gemini-3-flash-preview';

  if (modelId !== 'gemini-3-flash-preview' && modelId !== 'gemini-3-pro-preview') {
    return 'gemini-3-flash-preview';
  }

  return modelId;
}

function clampNumber(value: unknown, min: number, max: number, fallback: number) {
  if (typeof value !== 'number' || Number.isNaN(value)) return fallback;
  return Math.min(max, Math.max(min, value));
}

function sanitizeHistory(history: unknown): ModelMessage[] {
  if (!Array.isArray(history)) return [];

  const messages: ModelMessage[] = [];
  for (const item of history) {
    const message = item as EmbedHistoryMessage;
    const role = message?.role;
    const content = typeof message?.content === 'string' ? message.content.trim() : '';

    if (!content) continue;
    if (role !== 'user' && role !== 'assistant') continue;

    messages.push({
      role,
      content: content.slice(0, 4000),
    } as ModelMessage);
  }

  return messages.slice(-24);
}

function getTextContent(message: ModelMessage | undefined) {
  if (!message) return '';
  if (typeof message.content === 'string') return message.content.trim();
  return '';
}

function buildSystemPrompt(agent: AgentDoc) {
  const normalizedExpertise = Array.isArray(agent?.expertise)
    ? agent.expertise.join(', ')
    : agent?.expertise;

  const generatedPrompt = generateSystemMessage(
    agent?.name || 'AI Assistant',
    agent?.description || '',
    agent?.type || 'text',
    typeof agent?.personality === 'string' ? agent.personality : undefined,
    typeof agent?.tone === 'string' ? agent.tone : undefined,
    normalizedExpertise,
    '',
    '',
    ''
  );

  let system = typeof agent?.customSystemPrompt === 'string' && agent.customSystemPrompt.trim()
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

export async function OPTIONS() {
  return new Response(null, {
    status: 200,
    headers: CORS_HEADERS,
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const agentId = typeof body?.agentId === 'string' ? body.agentId.trim() : '';
    const message = typeof body?.message === 'string' ? body.message.trim() : '';
    const newChat = Boolean(body?.newChat);

    if (!agentId) {
      return jsonResponse({ error: 'agentId is required', code: 'INVALID_AGENT_ID' }, 400);
    }

    if (!message) {
      return jsonResponse({ error: 'message is required', code: 'INVALID_MESSAGE' }, 400);
    }

    const agentDoc = await adminDb.collection('agents').doc(agentId).get();
    if (!agentDoc.exists) {
      return jsonResponse({ error: 'Agent not found', code: 'AGENT_NOT_FOUND' }, 404);
    }

    const agentData = agentDoc.data() as AgentDoc;
    if (!agentData?.isPublic) {
      return jsonResponse({ error: 'This agent is private', code: 'AGENT_PRIVATE' }, 403);
    }

    const llmConfig = agentData?.llmConfig || {};
    const modelId = normalizeModelId(llmConfig?.model);
    const temperature = clampNumber(llmConfig?.temperature, 0, 2, 0.7);
    const system = buildSystemPrompt(agentData);

    const modelMessages = sanitizeHistory(body?.history);
    const lastMessage = modelMessages[modelMessages.length - 1];
    const shouldAppendMessage =
      lastMessage?.role !== 'user' || getTextContent(lastMessage) !== message;

    if (shouldAppendMessage) {
      modelMessages.push({
        role: 'user',
        content: message,
      } as ModelMessage);
    }

    const result = await generateText({
      model: google(modelId),
      system,
      messages: modelMessages,
      temperature,
      maxRetries: 2,
    });

    const content = (result.text || '').trim();
    if (!content) {
      return jsonResponse({ error: 'Empty model response', code: 'EMPTY_MODEL_RESPONSE' }, 502);
    }

    const tokensUsed = result.usage?.totalTokens ?? 0;
    try {
      const updateData: Record<string, FieldValue> = {
        totalQueries: FieldValue.increment(1),
        tokensUsed: FieldValue.increment(tokensUsed),
      };

      if (newChat) {
        updateData.totalChats = FieldValue.increment(1);
      }

      await adminDb.collection('agents').doc(agentId).update(updateData);
    } catch (analyticsError) {
      // Analytics should never break chat replies.
      console.error('Embed chat analytics update failed:', analyticsError);
    }

    return jsonResponse({
      content,
      model: modelId,
    });
  } catch (error) {
    console.error('Embed chat error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    const lower = errorMessage.toLowerCase();

    if (lower.includes('api key') || lower.includes('google_generative_ai_api_key')) {
      return jsonResponse(
        { error: 'Model provider is not configured', code: 'MODEL_AUTH_ERROR' },
        500
      );
    }

    if (lower.includes('model') && (lower.includes('not found') || lower.includes('unsupported'))) {
      return jsonResponse(
        { error: 'Selected model is unavailable', code: 'MODEL_UNAVAILABLE' },
        502
      );
    }

    return jsonResponse({ error: 'Internal server error', code: 'EMBED_INTERNAL_ERROR' }, 500);
  }
}
