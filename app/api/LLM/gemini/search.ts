import { GoogleGenAI } from '@google/genai';
import { googleApiKey } from "@/lib/ai/google-provider";


export async function search(query: string) { 
    try {
    if (!googleApiKey) {
      throw new Error('GEMINI_API_KEY is not configured');
    }

    const ai = new GoogleGenAI({ apiKey: googleApiKey });
    let response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [
           `Search for and answer the following question/query: ${query}. You must return relevant results that will be fed to another LLM for it to generate the final response. Today's date is ${new Date().toISOString().split('T')[0]}`,
        ],
        config: {
          tools: [{
            googleSearchRetrieval:{
              dynamicRetrievalConfig:{
                dynamicThreshold:0.5,
              }
            }
          }],
        },
      })

      console.log("Search response --> ", response.text )
      return response.text
    } catch (error) {
        console.error(error)
    }
}  
