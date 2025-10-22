import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

// Optional: use environment variables for multiple model providers
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
})

export const runtime = 'edge'

async function classifyPromptWithLLM(prompt: string): Promise<string> {
    const classificationPrompt = `
  Analyze the following user prompt and classify its complexity and type. Consider:
  - Length and detail requirements
  - Cognitive complexity 
  - Domain expertise needed
  - Response format expectations
  
  Prompt: "${prompt}"
  
  Respond with ONLY one of these classifications:
  - small: Simple questions, summaries, basic explanations (use gpt-3.5-turbo)
  - medium: Analysis, comparisons, moderate complexity (use gpt-4o-mini)  
  - large: Complex reasoning, detailed explanations, code generation (use gpt-4o)
  
  Classification:`
  
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo', // Use the cheapest model for classification
      messages: [{ role: 'user', content: classificationPrompt }],
      max_tokens: 10, // Very constrained response
      temperature: 0, // Deterministic classification
    })
  
    const classification = response.choices[0]?.message?.content?.trim().toLowerCase()
    
    // Fallback to your current logic if LLM fails
    return ['small', 'medium', 'large'].includes(classification ?? '') 
      ? classification ?? 'medium' 
      : classifyPromptWithLLM(prompt) // Your existing fallback
  }

// Route handler
export async function handler (req: NextRequest) {
  try {
    const { prompt } = await req.json()

    if (!prompt) {
      return NextResponse.json({ error: 'No prompt provided' }, { status: 400 })
    }

    // Determine the best model or agent
    const route = await classifyPromptWithLLM(prompt)

    let model: string
    switch (route) {
      case 'small':
        model = 'gpt-3.5-turbo'
        break
      case 'medium':
        model = 'gpt-4o-mini'
        break
      case 'large':
        model = 'gpt-4o'
        break
      default:
        model = 'gpt-3.5-turbo'
    }

    // Optional: define agent behaviors
    const systemPrompt =
      route === 'large'
        ? 'You are an expert reasoning assistant. Provide detailed, structured responses.'
        : route === 'medium'
        ? 'You are a concise, thoughtful assistant. Keep answers balanced.'
        : 'You are a lightweight summarizer. Keep answers short and clear.'

    const completion = await openai.chat.completions.create({
      model,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: prompt },
      ],
    })

    const output = completion.choices[0]?.message?.content || ''

    return NextResponse.json({
      model,
      route,
      output,
    })
  } catch (err: any) {
    console.error(err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}