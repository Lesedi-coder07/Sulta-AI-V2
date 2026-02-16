import { generateText, type ModelMessage } from 'ai';
import { googleAI } from '@/lib/ai/google-provider';

// Allow streaming responses up to 30 seconds
export const maxDuration = 50;

type InputMessage = {
  role?: unknown;
  content?: unknown;
};

function sanitizeMessages(messages: unknown): ModelMessage[] {
  if (!Array.isArray(messages)) return [];

  const cleaned: ModelMessage[] = [];

  for (const item of messages) {
    const message = item as InputMessage;
    const role = message.role;
    const content = typeof message.content === 'string' ? message.content.trim() : '';
    if (!content) continue;
    if (role !== 'user' && role !== 'assistant' && role !== 'system') continue;

    cleaned.push({
      role,
      content,
    });
  }

  return cleaned.slice(-24);
}

export async function POST(req: Request) {
  const body = await req.json();
  const prompt = typeof body?.prompt === 'string' ? body.prompt.trim() : '';
  const systemMessage = typeof body?.systemMessage === 'string' ? body.systemMessage.trim() : '';
  const messages = body?.messages;

  // Build the final messages array
  const finalMessages: ModelMessage[] = [];
  
  // Add system message if provided
  if (systemMessage) {
    finalMessages.push({ role: 'system', content: systemMessage });
  }
  
  // Add existing conversation messages
  finalMessages.push(...sanitizeMessages(messages));
  
  // Add the new user prompt if provided
  if (prompt) {
    finalMessages.push({ role: 'user', content: prompt });
  }

  const result = await generateText({
    model: googleAI('gemini-3-flash-preview'),
    messages: finalMessages,
  });

  return Response.json({ content: result.text });
}
