import { GoogleGenerativeAI } from "@google/generative-ai"
import {GoogleGenAI, DynamicRetrievalConfigMode} from '@google/genai';


const ai = new GoogleGenAI({ apiKey: "GEMINI_API_KEY" });
export async function search(query: string) { 
    try {

    let response = await ai.models.generateContent({
        model: "gemini-1.5-flash",
        contents: [
           `Search for and answer the following question/query: ${query}. You must return relevant results that will be fed to another LLM for it to generate the final response.`,
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
    
      console.log(response.text)
    } catch (error) {
        console.error(error)
    }
}  