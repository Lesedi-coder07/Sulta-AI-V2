'use client'

import React from 'react'
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

export default function ContextSheet() {
  return (
    <div className="w-full space-y-4">
      <div className="flex flex-col space-y-2">
        <Label htmlFor="context" className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
          Agent Context & Knowledge Base
        </Label>

        <Textarea
          id="context"
          placeholder={`Give your AI agent context and knowledge to better serve your needs. For example:


• Company information: 'We are a sustainable fashion brand founded in 2020...'
• Behavioral guidelines: 'Always maintain a professional yet friendly tone...'
• Key facts to remember: 'Our return policy is 30 days...'
• Specific responses: 'When asked about pricing, mention our subscription options...'
• Industry knowledge: 'Key terms and concepts in our field...'

The more context you provide, the better your AI agent will understand and represent your business.`}
          className="min-h-[900px] w-full resize-y p-4 text-sm leading-relaxed rounded-md border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-950"
        />
      </div>
      <p className="text-xs text-neutral-500 dark:text-neutral-400">
        Your agent will use this information to provide more accurate and contextual responses.
      </p>
    </div>
  )
}
