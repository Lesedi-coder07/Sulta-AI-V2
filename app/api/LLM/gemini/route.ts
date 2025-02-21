import { GoogleGenerativeAI } from "@google/generative-ai"

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);




export async function POST(req: Request) {
    try {
        if (!process.env.GEMINI_API_KEY) {
            throw new Error('GEMINI_API_KEY is not configured');
        }

        const { prompt, history, systemMessage, base64String } = await req.json();
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash", systemInstruction: systemMessage });
        
        if (!prompt) {
            throw new Error('Prompt is required');
        }
         
        let newParts = [{ text: prompt },]

         if( base64String ){
            
           let imagePart = {
                inlineData: {
                    mimeType: "image/png", // Or the correct mime type for your image
                    data: base64String.split(',')[1]  // Remove the "data:image/jpeg;base64," prefix
                }
            }

            newParts = [ prompt, imagePart]
         }
        
         // Prepend system message to the prompt if it exists
         const fullPrompt = systemMessage 
         ? `User message: ${prompt}`
         : prompt;


        const formattedHistory = history ? history.map((msg: any) => ({
            role: msg.role === 'assistant' ? 'model': msg.role,
            parts: [{ text: msg.content }]
        })) : [];

        
        const chat = model.startChat({
            history: formattedHistory,
            generationConfig: {
                maxOutputTokens: 4000,
                temperature: 0.6
                
            },
            
            // systemInstruction: systemMessage
        });

        const response = await chat.sendMessage(newParts);
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
