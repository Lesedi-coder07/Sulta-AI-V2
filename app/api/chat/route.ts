import { openai } from '@ai-sdk/openai';
import { streamText, convertToModelMessages } from 'ai';
import { google } from '@ai-sdk/google';
import { updateAgentAnalytics } from '@/app/ai/dashboard/actions';

export const maxDuration = 55;
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function messagesToModelMessages(messages: any[], imageBase64?: string | null) {
  //Step 1: Convert the UI messages to model messages
  const messages_step_1 = convertToModelMessages(messages);
  return messages_step_1.map((message: any, index: number) => {
    // Check if the original message has file parts (images)
    const originalMessage = messages[index];
    const fileParts = originalMessage?.parts?.filter((part: any) => part.type === 'file') || [];
    const hasFiles = fileParts.length > 0;

    // Check if this is the last user message and we have an imageBase64
    const isLastMessage = index === messages_step_1.length - 1;
    const shouldAddImage = isLastMessage && message.role === 'user' && imageBase64;

    if ((hasFiles || shouldAddImage) && message.role === 'user') {
      // Build content array with images and text
      const contentParts: any[] = [];

      // Add image from imageBase64 if this is the last message
      if (shouldAddImage) {
        contentParts.push({
          type: 'image',
          image: imageBase64,
        });
      }

      // Add images from file parts
      for (const filePart of fileParts) {
        if (filePart.mediaType?.startsWith('image/')) {
          contentParts.push({
            type: 'image',
            image: filePart.url, // base64 data URL
          });
        }
      }

      // Add the text content
      const textContent = message.content[0]?.text || originalMessage?.content || '';
      contentParts.push({
        type: 'text',
        text: textContent,
      });

      return {
        role: message.role as any,
        content: contentParts,
      };
    }

    return {
      role: message.role as any,
      content: message.content[0]?.text || '',
    };
  });
}

export async function POST(req: Request) {
  try {
    const { system, messages, chatId, agentId, newChat = false, imageBase64, thinkEnabled = false } = await req.json();

    // Validate that messages is an array
    if (!Array.isArray(messages)) {
      console.error('Messages is not an array:', messages);
      return new Response(JSON.stringify({ error: 'Messages must be an array' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Select model based on thinking mode
    const modelId = thinkEnabled ? 'gemini-3-pro-preview' : 'gemini-2.5-flash-lite';
    console.log(`Using model: ${modelId} (thinking mode: ${thinkEnabled})`);

    const modelMessages = convertToModelMessages(messages);

    // Pass the imageBase64 to the conversion function
    const cleanedModelMessages = messagesToModelMessages(messages, imageBase64);


    const allMessages = [
      {
        role: 'system' as const,
        content: system || 'You are a helpful AI assistant.',
      },
      ...cleanedModelMessages,
    ];

    const result = streamText({
      model: google(modelId),
      messages: allMessages,
      temperature: 0.7,
      onFinish: async ({ usage }) => {
        if (agentId) {
          // Report 2x tokens when using thinking mode (gemini-3-pro-preview)
          const tokenMultiplier = thinkEnabled ? 2 : 1;
          const tokensToReport = (usage?.totalTokens ?? 0) * tokenMultiplier;
          console.log(`Reporting tokens: ${tokensToReport} (multiplier: ${tokenMultiplier})`);
          await updateAgentAnalytics(agentId, 1, tokensToReport, newChat ? 1 : 0);
        }
      },
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