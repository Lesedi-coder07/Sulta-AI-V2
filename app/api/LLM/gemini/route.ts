import { GoogleGenerativeAI } from "@google/generative-ai"
import { generateImage } from "./image"
import { search } from "./search";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function OPTIONS(req: Request) {
    return new Response(JSON.stringify({ message: 'OK' }), {
        status: 200,
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type",
        },
    });
}


export async function POST(req: Request) {
    try {
        if (!process.env.GEMINI_API_KEY) {
            throw new Error('GEMINI_API_KEY is not configured');
        }

        const { prompt, history, systemMessage, base64String, docUrl, powerUpSelected } = await req.json();
        let model = genAI.getGenerativeModel({ model: "gemini-2.5-flash", systemInstruction: systemMessage });


        let imageUrl = null
        let searchResponse = null
        let contextedPrompt = prompt
        if (!prompt) {
            throw new Error('Prompt is required');
        }  

        console.log("powerUpSelected --> ", powerUpSelected)

        if(powerUpSelected) {
            if(powerUpSelected === "think") {
                // TODO: Implement think power up
                model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-thinking-exp-01-21", systemInstruction: systemMessage });


            } else if(powerUpSelected === "imageGen") {
                // TODO: Implement imageGen power up
                try {
                    imageUrl = await generateImage (prompt, base64String)
                } catch (error) {
                    console.error('Error generating image:', error);
                    throw new Error('Failed to generate image');
                }



            } else if(powerUpSelected === "search") 
                
                {

                    console.log("Searching for --> ", prompt)
                // TODO: Implement search power up
                try {
                    searchResponse = await search(prompt)
                    if(searchResponse != undefined && searchResponse != null) {
                        contextedPrompt = `Here is the search response: ${searchResponse}. Use this to help you answer the following question: ${prompt}`
                    }
                } catch (error) {
                    console.error('Error searching:', error);
                 
                }
            }
        }
  
        let newParts = [{ text: contextedPrompt },]

        console.log("docUrl", docUrl)
        if(docUrl){
            const pdfResponse = await fetch(docUrl);
            const pdfBuffer = await pdfResponse.arrayBuffer();
            console.log("WE got the pdf")
            let docPart = {
                inlineData: {
                    mimeType: "application/pdf",
                    data:  Buffer.from(pdfBuffer).toString("base64")
                }
            }

            newParts = [ docPart, prompt]
        }
         
      

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

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-ignore
        const chat = model.startChat({
            history: formattedHistory,
            generationConfig: {
                maxOutputTokens: 4000,
                temperature: 0.6
                
            },
           
              
            
            // systemInstruction: systemMessage
        });
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-ignore
const response = await model.generateContent({
    contents: [
      ...formattedHistory,
      {
        role: 'user',
        parts: [{ text: contextedPrompt }],
      },
    ],
    generationConfig: {
      maxOutputTokens: 4000,
      temperature: 0.9,
    },
    // thinkingConfig: {
    //   thinkingBudget: 0,
    // },
  }as any);
        const responseOld = await chat.sendMessage(newParts);
        const responseText = await response.response.text();

        return new Response(JSON.stringify({ response: responseText, imageUrl: imageUrl }), {
            status: 200,
            headers: {
                "Access-Control-Allow-Origin": "*",
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
