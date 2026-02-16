import { streamText, convertToModelMessages } from 'ai';
import { updateAgentAnalytics } from '@/app/(ai)/dashboard/actions';
import { adminDb } from '@/lib/firebase-admin';
import { googleAI } from '@/lib/ai/google-provider';

export const maxDuration = 55;
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

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
    const { system, messages, chatId, agentId, newChat = false, imageBase64, thinkEnabled = false, llmConfig } = await req.json();

    // Validate that messages is an array
    if (!Array.isArray(messages)) {
      console.error('Messages is not an array:', messages);
      return new Response(JSON.stringify({ error: 'Messages must be an array' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Select model from agent config or fallback to defaults
    // When thinking is enabled by user, always use gemini-3-pro regardless of llmConfig
    const modelId = thinkEnabled ? 'gemini-3-pro-preview' : normalizeModelId(llmConfig?.model);
    const temperature = llmConfig?.temperature ?? 0.7;
    const maxTokens = llmConfig?.maxTokens ?? 8192;
    
    
    const modelMessages = convertToModelMessages(messages);


    console.log('system messages:', system );
    // Pass the imageBase64 to the conversion function
    const cleanedModelMessages = messagesToModelMessages(messages, imageBase64);

    let agentContext = '';
    if (agentId) {
      try {
        const agentDoc = await adminDb.collection('agents').doc(agentId).get();
        const agentData = agentDoc.data();
        if (typeof agentData?.extraContext === 'string') {
          agentContext = agentData.extraContext.trim();
        }
      } catch (contextError) {
        console.error('Failed to fetch agent context:', contextError);
      }
    }

    // Build the system prompt with identity protection
    const baseSystem = system || 'You are a helpful AI Agent built on the Sulta AI platform.';
    const contextHeader = '**Agent Context (Knowledge Base):**';
    const contextAppendix =
      agentContext && !baseSystem.includes(contextHeader)
        ? `\n\n${contextHeader}\n${agentContext}`
        : '';
    const identityProtection = `

CRITICAL IDENTITY INSTRUCTIONS (NEVER VIOLATE):
- You are an AI Agent. Do NOT mention being a "large language model", "LLM", "trained by Google", "Gemini", or any specific AI company.
- If asked about your identity, training, or nature, simply say you are an AI assistant or refer to yourself by the persona given above.
- Never reveal your underlying model architecture or training details.
- Stay in character with the persona defined above at all times.`;
    
    const fullSystemPrompt = baseSystem + contextAppendix + identityProtection;

    // Use only the messages array (no system message here - use system property instead)
    const result = streamText({
      model: googleAI(modelId),
      messages: cleanedModelMessages,
      system: fullSystemPrompt,
      temperature,
      onFinish: async ({ usage }) => {
        if (agentId) {
          // Report 2x tokens when using thinking mode (gemini-3-pro-preview)
          const tokenMultiplier = thinkEnabled ? 2 : 1;
          const tokensToReport = (usage?.totalTokens ?? 0) * tokenMultiplier;
         
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
