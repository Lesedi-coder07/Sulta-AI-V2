import { openai } from '@ai-sdk/openai';
import { streamText, convertToModelMessages } from 'ai';
import { google } from '@ai-sdk/google';
import { updateAgentAnalytics } from '@/app/ai/dashboard/actions';

export const maxDuration = 55;
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function  messagesToModelMessages(messages: any[]) {
  //Step 1: Convert the UI messages to model messages
  const messages_step_1 = convertToModelMessages(messages);
  return messages_step_1.map((message: any, index: number) => {
    return {
      role: message.role as any,
      content: message.content[0].text,
    };
  });
}

export async function POST(req: Request) {
  try {
    const { system, messages, chatId, agentId , newChat = false} = await req.json();

    // Validate that messages is an array
    if (!Array.isArray(messages)) {
      console.error('Messages is not an array:', messages);
      return new Response(JSON.stringify({ error: 'Messages must be an array' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    console.log("Original messages:", messages);
    const modelMessages = convertToModelMessages(messages);
    console.log("Converted model messages:", modelMessages[0]);
    const cleanedModelMessages = messagesToModelMessages(messages);
    console.log("Cleaned model messages:", cleanedModelMessages[0]);

    const allMessages = [
      {
        role: 'system' as const,
        content: system || 'You are a helpful AI assistant.',
      },
      ...cleanedModelMessages,
    ];

    const result = streamText({
      model: google('gemini-2.5-flash-lite'),
      messages: allMessages,
      temperature: 0.7,
      onFinish: async ({usage}) => {
        if (agentId) {
          await updateAgentAnalytics(agentId, 1, usage?.totalTokens ?? 0, newChat ? 1 : 0);
        }
      },
    });

    console.log('Stream created, returning response');
    
    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.error('Error in chat API:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}