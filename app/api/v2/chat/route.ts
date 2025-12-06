import {google} from '@ai-sdk/google';
import {generateText} from 'ai';
import { NextResponse } from 'next/server';

export const maxDuration = 55;

export async function POST(req: Request) {
    const {prompt, messages, systemMessage} = await req.json();
    const userMessage  = {
        "role": "user",
        "content": prompt
    }
    messages.push(userMessage);

    const result = await generateText({
        model: google('gemini-2.5-flash'),
        messages: messages,
        system: systemMessage,
        maxRetries: 3,
    });

    return NextResponse.json(result);
}
