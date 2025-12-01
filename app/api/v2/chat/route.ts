import {google} from '@ai-sdk/google';
import {generateText} from 'ai';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    const {prompt, messages, systemMessage} = await req.json();

    const result = await generateText({
        model: google('gemini-2.5-flash'),
        prompt: prompt,
        messages: messages,
        system: systemMessage,
        maxRetries: 3,
    });

    return NextResponse.json(result);
}