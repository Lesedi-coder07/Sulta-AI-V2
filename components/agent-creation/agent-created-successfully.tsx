import Link from 'next/link'
import React from 'react'

function AgentCreatedSuccessfully({url, name, setAgentCreated} : {url: string | null, name: string, setAgentCreated: () => void   }) {
  return (
    <div>
      <div className="flex flex-col items-center justify-center space-y-6 p-8 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/6 border border-white/10">
          <svg
            className="h-5 w-5 text-white/70"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>

        <div className="space-y-1">
          <h2 className="text-xl font-semibold tracking-tight">{name} created</h2>
          <p className="text-sm text-muted-foreground">Your agent is ready to use.</p>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row">
          <Link
            href={url ? `/chat/${url}` : '/dashboard'}
            className="inline-flex items-center justify-center rounded-lg bg-white px-4 py-2 text-sm font-medium text-black hover:bg-white/90"
          >
            Use Agent
          </Link>

          <button
           onClick={() => setAgentCreated()}
            className="inline-flex items-center justify-center rounded-lg border border-white/10 bg-white/4 px-4 py-2 text-sm font-medium text-white/70 hover:bg-white/8 hover:text-white"
          >
            Create Another
          </button>
        </div>
      </div>

    </div>
  )
}

export default AgentCreatedSuccessfully
