'use client'

import React from 'react'
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { BookOpen } from 'lucide-react'

export default function ContextSheet() {
  return (
    <div className="glass-card rounded-xl p-6 space-y-4">
      <div className="flex items-center gap-3 mb-2">
        <div className="icon-container p-2">
          <BookOpen className="h-4 w-4 text-white/80" />
        </div>
        <div>
          <Label htmlFor="context" className="text-base font-semibold text-white">
            Agent Context & Knowledge Base
          </Label>
          <p className="text-sm text-muted-foreground">
            Give your AI agent context and knowledge to better serve your needs
          </p>
        </div>
      </div>

      <Textarea
        id="context"
        placeholder={`For example:

• Company information: 'We are a sustainable fashion brand founded in 2020...'
• Behavioral guidelines: 'Always maintain a professional yet friendly tone...'
• Key facts to remember: 'Our return policy is 30 days...'
• Specific responses: 'When asked about pricing, mention our subscription options...'
• Industry knowledge: 'Key terms and concepts in our field...'`}
        className="min-h-[200px] w-full resize-y p-4 text-sm leading-relaxed rounded-xl 
                   bg-white/5 border-white/10 text-white placeholder:text-white/30
                   focus:border-white/20 focus:ring-1 focus:ring-white/10
                   hover:bg-white/[0.07] transition-colors duration-200"
      />

      <p className="text-xs text-muted-foreground">
        Your agent will use this information to provide more accurate and contextual responses.
      </p>
    </div>
  )
}
