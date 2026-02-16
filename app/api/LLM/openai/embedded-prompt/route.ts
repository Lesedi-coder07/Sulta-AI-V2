import { NextRequest, NextResponse } from 'next/server';
import { generateText, type ModelMessage } from 'ai';
import { google } from '@ai-sdk/google';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

type LegacyMessage = {
  role?: string;
  content?: string;
};

function normalizeModelId(modelId?: string) {
  if (!modelId) return 'gemini-3-flash-preview';
  if (
    modelId === 'gemini-3-flash' ||
    modelId === 'gemini-2.5-flash' ||
    modelId === 'gemini-2.5-flash-lite' ||
    modelId === 'gemini-1.5-flash' ||
    modelId === 'gemini-2.0-flash-thinking-exp-01-21'
  ) return 'gemini-3-flash-preview';

  return modelId;
}

function sanitizeMessages(messages: unknown): ModelMessage[] {
  if (!Array.isArray(messages)) return [];

  const cleaned: ModelMessage[] = [];
  for (const item of messages) {
    const message = item as LegacyMessage;
    const role = message?.role;
    const content = typeof message?.content === 'string' ? message.content.trim() : '';

    if (!content) continue;
    if (role !== 'user' && role !== 'assistant' && role !== 'system') continue;

    cleaned.push({
      role: role as 'user' | 'assistant' | 'system',
      content: content.slice(0, 4000),
    } as ModelMessage);
  }

  return cleaned.slice(-24);
}

export async function OPTIONS() {
  return NextResponse.json(null, { status: 200, headers: CORS_HEADERS });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const prompt = typeof body?.prompt === 'string' ? body.prompt.trim() : '';
    const systemMessage = typeof body?.systemMessage === 'string' ? body.systemMessage.trim() : '';
    const modelId = normalizeModelId(body?.modelId);
    const messages = sanitizeMessages(body?.messages);

    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400, headers: CORS_HEADERS }
      );
    }

    const modelMessages = [...messages];
    const lastMessage = modelMessages[modelMessages.length - 1];
    const isDuplicateUserPrompt =
      lastMessage?.role === 'user' &&
      typeof lastMessage.content === 'string' &&
      lastMessage.content.trim() === prompt;

    if (!isDuplicateUserPrompt) {
      modelMessages.push({
        role: 'user',
        content: prompt,
      } as ModelMessage);
    }

    const result = await generateText({
      model: google(modelId),
      system: systemMessage || undefined,
      messages: modelMessages,
      maxRetries: 2,
    });

    const content = result.text || '';
    return NextResponse.json(
      {
        content,
        // Backward compatibility with the previous OpenAI shape used by older widgets.
        choices: [{ message: { content } }],
      },
      { status: 200, headers: CORS_HEADERS }
    );
  } catch (error: any) {
    console.error('Error generating embed text:', error);
    return NextResponse.json(
      { error: error?.message || 'Error generating text' },
      { status: 500, headers: CORS_HEADERS }
    );
  }
}
