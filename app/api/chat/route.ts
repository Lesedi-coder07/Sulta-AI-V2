import { openai } from '@ai-sdk/openai';
import { streamText, convertToModelMessages } from 'ai';
import { google } from '@ai-sdk/google';

export const maxDuration = 30;
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

function  messagesToModelMessages(messages: any[]) {
  try {
    //Step 1: Convert the UI messages to model messages
    const messages_step_1 = convertToModelMessages(messages);
    return messages_step_1.map((message: any, index: number) => {
      // Handle different content structures
      let textContent = '';
      
      if (typeof message.content === 'string') {
        textContent = message.content;
      } else if (Array.isArray(message.content) && message.content.length > 0) {
        // Extract text from content array
        const textPart = message.content.find((part: any) => part.type === 'text' || typeof part.text === 'string');
        textContent = textPart?.text || '';
      }
      
      return {
        role: message.role as any,
        content: textContent,
      };
    });
  } catch (error) {
    console.error('Error in messagesToModelMessages:', error);
    throw error;
  }
}

export async function POST(req: Request) {
  try {
    console.log('=== Chat API Request Started ===');
    const body = await req.json();
    console.log('Full request body keys:', Object.keys(body));
    
    // Extract system message from data or body
    const systemFromData = body.data?.system;
    const { system = systemFromData, messages, chatId } = body;
    
    console.log('Request body:', { 
      system: system?.substring(0, 50), 
      messagesCount: messages?.length, 
      chatId,
      hasMessages: !!messages,
      messageTypes: messages?.map((m: any) => m.role),
      hasDataSystem: !!systemFromData
    });

    // Validate that messages is an array
    if (!Array.isArray(messages)) {
      console.error('Messages is not an array:', messages);
      return new Response(JSON.stringify({ error: 'Messages must be an array' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    if (messages.length === 0) {
      console.error('Messages array is empty');
      return new Response(JSON.stringify({ error: 'Messages array cannot be empty' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    console.log("Original messages:", JSON.stringify(messages, null, 2));
    
    // Convert messages
    console.log('Converting messages...');
    const cleanedModelMessages = messagesToModelMessages(messages);
    console.log("Cleaned model messages:", JSON.stringify(cleanedModelMessages, null, 2));

    // Build final message array
    const allMessages = [
      {
        role: 'system' as const,
        content: system || 'You are a helpful AI assistant.',
      },
      ...cleanedModelMessages,
    ];

    console.log('Final messages for API:', JSON.stringify(allMessages, null, 2));

    // Check if API key is available
    if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
      console.error('GOOGLE_GENERATIVE_AI_API_KEY is not set');
      return new Response(JSON.stringify({ error: 'API key not configured' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Create stream
    console.log('Creating stream with Gemini...');
    const result = streamText({
      model: google('gemini-1.5-flash'),
      messages: allMessages,
      temperature: 0.7,
    });

    console.log('Stream created successfully, returning response');
    
    const response = result.toUIMessageStreamResponse();
    console.log('Response object created:', response);
    
    return response;

    
  } catch (error: any) {
    console.error('=== Error in chat API ===');
    console.error('Error message:', error?.message);
    console.error('Error stack:', error?.stack);
    console.error('Full error:', error);
    
    return new Response(JSON.stringify({ 
      error: 'Internal server error',
      details: error?.message || 'Unknown error',
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
