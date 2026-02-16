import {generateText} from 'ai';
import { NextResponse } from 'next/server';
import { googleAI } from '@/lib/ai/google-provider';

export const maxDuration = 55;

export async function POST(req: Request) {
    const {prompt, messages, systemMessage} = await req.json();
    if (!prompt || !messages || !systemMessage) {
        return NextResponse.json({error: "Prompt, messages, and systemMessage are required"}, {status: 400});
    }

    if (typeof prompt !== 'string') {
        return NextResponse.json({error: "Prompt must be a string"}, {status: 400});
    }

   
    

    const result = await generateText({
        model: googleAI('gemini-3-flash-preview'),
        prompt: prompt,
        system: systemMessage,
        maxRetries: 3,
    });

    return NextResponse.json(result);
}
