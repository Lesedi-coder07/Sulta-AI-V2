import { openai } from '@ai-sdk/openai';
import { streamText, convertToModelMessages } from 'ai';
import { google } from '@ai-sdk/google';

export const maxDuration = 60;

function  messagesToModelMessages(messages: any[]) {
  //Step 1: Convert the UI messages to model messages
  const messages_step_1 = convertToModelMessages(messages);
  return messages_step_1.map((message: any, index: number) => {
    return {
      role: message.role as any,
      content: message.content.text,
    };
  });
}

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

    console.log("Original messages:", messages);
    const modelMessages = convertToModelMessages(messages);
    console.log("Converted model messages:", modelMessages[0]);
    const cleanedModelMessages = messagesToModelMessages(modelMessages);
    console.log("Cleaned model messages:", cleanedModelMessages[0]);


    const allMessages = [
      {
        role: 'system' as const,
        content: system || 'You are a helpful AI assistant.',
      },
      ...modelMessages,
    ];


    const result = streamText({
      model: google('gemini-2.5-flash'),
      messages: modelMessages,
      temperature: 0.7,
    });


    console.log("result", result);
    return result.toTextStreamResponse();
  } catch (error) {
    console.error('Error in chat API:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
