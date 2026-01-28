import { generateText, UIMessage, convertToModelMessages } from 'ai';
import { google } from '@ai-sdk/google';

// Allow streaming responses up to 30 seconds
export const maxDuration = 50;

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();

  const result = generateText({
    model: google('gemini-2.5-flash'),
    messages: convertToModelMessages(messages),
  });


  const data = await result;
  return data.content;
}