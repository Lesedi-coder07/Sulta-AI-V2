import { openai } from '@ai-sdk/openai';
import { streamText, UIMessage, convertToModelMessages } from 'ai';
import { google } from '@ai-sdk/google';

// Allow streaming responses up to 30 seconds
export const maxDuration = 100;

export async function POST(req: Request) {
  try {
    const { system, messages, chatId } = await req.json();

    // Validate that messages is an array
    if (!Array.isArray(messages)) {
      console.error('Messages is not an array:', messages);
      return new Response(JSON.stringify({ error: 'Messages must be an array' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const allMessages = [
      {
        role: 'system',
        content: system || 'You are a helpful AI assistant.',
      },
      ...messages,
    ];

    console.log("allMessages", allMessages);

    const result = streamText({
      model: google('gemini-2.5-flash'),
      messages: convertToModelMessages(allMessages),
      temperature: 0.7,
    });

    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.error('Error in chat API:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
