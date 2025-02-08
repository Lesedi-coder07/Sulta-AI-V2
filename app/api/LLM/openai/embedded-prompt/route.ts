import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
const openai = new OpenAI({
     apiKey: process.env.OPENAI_API_KEY
})

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*', // In production, specify exact origin(s) for security
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export async function OPTIONS ( request: NextRequest){
  return NextResponse.json(null, {status: 200, headers: CORS_HEADERS})
}

export async function POST(request: NextRequest) {
     const body = await request.json();
     const { messages, prompt, systemMessage } = body;


     try {
          const response = await openai.chat.completions.create({
               messages: [
                    { role: 'system', content: systemMessage },
                    ...messages,
                    { role: 'user', content: prompt }
               ],
               model: 'gpt-4o-mini',
          })
          return NextResponse.json(response, { status: 200, headers: CORS_HEADERS });
     } catch (error: any) {
          console.error('Error generating text:', error);
          return NextResponse.json({'Error': error.message || 'Error generating text'}, {status: 500})
     }



}
