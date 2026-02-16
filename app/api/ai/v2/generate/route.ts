import { generateText, convertToModelMessages } from 'ai';
import { google } from '@ai-sdk/google';

// Allow streaming responses up to 30 seconds
export const maxDuration = 50;

interface Message {
  role: string;
  content: string;
}

export async function POST(req: Request) {
  const { 
    prompt, 
    messages, 
    systemMessage 
  }: { 
    prompt?: string;
    messages: Message[]; 
    systemMessage?: string;
  } = await req.json();

  // Build the final messages array
  const finalMessages: Message[] = [];
  
  // Add system message if provided
  if (systemMessage) {
    finalMessages.push({ role: 'system', content: systemMessage });
  }
  
  // Add existing conversation messages
  finalMessages.push(...messages);
  
  // Add the new user prompt if provided
  if (prompt) {
    finalMessages.push({ role: 'user', content: prompt });
  }

  const result = await generateText({
    model: google('gemini-3-flash-preview'),
    messages: finalMessages,
  });

  return Response.json({ content: result.text });
}
