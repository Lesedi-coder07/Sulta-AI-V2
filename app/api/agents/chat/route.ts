import { generateText, streamText, type ModelMessage } from 'ai';
import { FieldValue } from 'firebase-admin/firestore';
import { adminDb } from '@/lib/firebase-admin';
import { googleAI, hasGoogleApiKey } from '@/lib/ai/google-provider';
import { findUserByApiKey, getApiKeyFromRequest } from '@/lib/api-keys';
import {
  buildAgentSystemPrompt,
  clampNumber,
  normalizeModelId,
  sanitizeHistory,
} from '@/lib/ai/agent-chat';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-API-Key',
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

async function incrementUsage(agentId: string, tokensUsed: number, newChat = false) {
  const updateData: Record<string, FieldValue> = {
    totalQueries: FieldValue.increment(1),
    tokensUsed: FieldValue.increment(tokensUsed),
  };

  if (newChat) {
    updateData.totalChats = FieldValue.increment(1);
  }

  await adminDb.collection('agents').doc(agentId).update(updateData);
}

export async function OPTIONS() {
  return new Response(null, {
    status: 200,
    headers: CORS_HEADERS,
  });
}

export async function POST(req: Request) {
  try {
    if (!hasGoogleApiKey) {
      return jsonResponse({ error: 'Model provider is not configured' }, 500);
    }

    const apiKey = getApiKeyFromRequest(req);
    if (!apiKey) {
      return jsonResponse({ error: 'Missing API key' }, 401);
    }

    const user = await findUserByApiKey(apiKey);
    if (!user) {
      return jsonResponse({ error: 'Invalid API key' }, 401);
    }

    const body = await req.json();
    const agentId = typeof body?.agentId === 'string' ? body.agentId.trim() : '';
    const stream = Boolean(body?.stream);
    const newChat = Boolean(body?.newChat);
    const message = typeof body?.message === 'string' ? body.message.trim() : '';
    const history = sanitizeHistory(body?.history ?? body?.messages);

    if (!agentId) {
      return jsonResponse({ error: 'agentId is required' }, 400);
    }

    const agentDoc = await adminDb.collection('agents').doc(agentId).get();
    if (!agentDoc.exists) {
      return jsonResponse({ error: 'Agent not found' }, 404);
    }

    const agentData = {
      id: agentDoc.id,
      ...(agentDoc.data() as AgentDoc),
    } as AgentDoc & { id: string };

    const ownerId =
      typeof agentData.userId === 'string' && agentData.userId.trim()
        ? agentData.userId.trim()
        : typeof agentData.ownerID === 'string'
        ? agentData.ownerID.trim()
        : '';
    const userHasAgentInList = Array.isArray(user.agents) && user.agents.includes(agentId);
    if (ownerId !== user.uid && !userHasAgentInList) {
      return jsonResponse({ error: 'This API key cannot access this agent' }, 403);
    }

    const modelMessages: ModelMessage[] = [...history];
    if (message) {
      const lastMessage = modelMessages[modelMessages.length - 1];
      const lastText =
        lastMessage && typeof lastMessage.content === 'string'
          ? lastMessage.content.trim()
          : '';
      if (lastMessage?.role !== 'user' || lastText !== message) {
        modelMessages.push({
          role: 'user',
          content: message,
        } as ModelMessage);
      }
    }

    if (modelMessages.length === 0) {
      return jsonResponse({ error: 'Provide message or messages' }, 400);
    }

    const llmConfig = agentData.llmConfig || {};
    const modelId = normalizeModelId(llmConfig?.model);
    const temperature = clampNumber(llmConfig?.temperature, 0, 2, 0.7);
    const maxOutputTokens = clampNumber(llmConfig?.maxTokens, 100, 100000, 8192);
    const system = buildAgentSystemPrompt(agentData);

    if (stream) {
      const result = streamText({
        model: googleAI(modelId),
        system,
        messages: modelMessages,
        temperature,
        maxOutputTokens,
        maxRetries: 2,
        onFinish: async ({ usage }) => {
          try {
            await incrementUsage(agentId, usage?.totalTokens ?? 0, newChat);
          } catch (analyticsError) {
            console.error('Agent API stream analytics failed:', analyticsError);
          }
        },
      });

      return result.toTextStreamResponse({
        headers: {
          ...CORS_HEADERS,
        },
      });
    }

    const result = await generateText({
      model: googleAI(modelId),
      system,
      messages: modelMessages,
      temperature,
      maxOutputTokens,
      maxRetries: 2,
    });

    try {
      await incrementUsage(agentId, result.usage?.totalTokens ?? 0, newChat);
    } catch (analyticsError) {
      console.error('Agent API analytics failed:', analyticsError);
    }

    return jsonResponse({
      content: (result.text || '').trim(),
      model: modelId,
      usage: result.usage ?? {},
    });
  } catch (error) {
    console.error('Agent API chat error:', error);
    return jsonResponse({ error: 'Internal server error' }, 500);
  }
}
