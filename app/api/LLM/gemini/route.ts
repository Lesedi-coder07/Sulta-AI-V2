import { GoogleGenerativeAI } from "@google/generative-ai"

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

const profmpt = "Explain how AI works";

export async function POST(req: Request) {
    try {
        if (!process.env.GEMINI_API_KEY) {
            throw new Error('GEMINI_API_KEY is not configured');
        }

        const { prompt, history, systemMessage } = await req.json();
        
        if (!prompt) {
            throw new Error('Prompt is required');
        }
        
         // Prepend system message to the prompt if it exists
         const fullPrompt = systemMessage 
         ? `${systemMessage}\n\nUser message: ${prompt}`
         : prompt;


        const formattedHistory = history ? history.map((msg: any) => ({
            role: msg.role,
            parts: [{ text: msg.content , systemMessage: "You are an AI Agent made by Sulta Tech PTY (LTD) "}]
        })) : [];

        const chat = model.startChat({
            history: formattedHistory,
            generationConfig: {
                maxOutputTokens: 1000,
            },
            // systemInstruction: systemMessage
        });

        const response = await chat.sendMessage(fullPrompt);
        const responseText = await response.response.text();

        return new Response(JSON.stringify({ response: responseText }), {
            status: 200,
            headers: {
                "Content-Type": "application/json",
            },
        });
    } catch (error) {
        console.error('Gemini API error:', error);
        return new Response(JSON.stringify({ 
            error: 'Failed to generate response', 
            details: error instanceof Error ? error.message : 'Unknown error'
        }), {
            status: 500,
            headers: {
                "Content-Type": "application/json",
            },
        });
    }
}
