import OpenAI from 'openai';
import { NextRequest, NextResponse } from 'next/server';



const openai = new OpenAI({apiKey: process.env.OPENAI_API_KEY});


export async function POST(req: NextRequest) {
    try {
      const body = await req.json();
      const {prompt, currentUser, previousMessages, systemMessage} = body;
      
      const currentUserInstruction = currentUser ? `You are currently talking to ${currentUser}.` : '';
  
      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini", // "gpt-4o-mini" appears to be a typo
        messages: [
          ...previousMessages.map((message: any) => ({
            role: message.role, 
            content: message.content || message.message // Handle both content and message properties
          })),
          {
            role: 'system', 
            content: `${systemMessage}. ${currentUserInstruction}. You were made by Sulta Tech on the Sulta AI platform.`
          },
          {role: "user", content: prompt}
        ]
      });
  
      return NextResponse.json(response.choices[0].message);
    } catch (error: any) {
      console.error("Error generating text:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  }
