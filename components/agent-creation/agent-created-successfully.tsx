import Link from 'next/link'
import React from 'react'

function AgentCreatedSuccessfully({url, name, setAgentCreated} : {url: string | null, name: string, setAgentCreated: () => void   }) {
  return (
    <div>
      <div className="flex flex-col items-center justify-center space-y-6 p-8 text-center">
        <div className="rounded-full bg-green-100 p-3 dark:bg-green-900">
          <svg
            className="h-8 w-8 text-green-600 dark:text-green-400"
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

        <h2 className="text-2xl font-bold tracking-tight">
          {name} Created Successfully!
        </h2>
        
        <p className="text-muted-foreground">
          Your AI agent has been created and is ready to be deployed.
        </p>

        <div className="flex flex-col gap-4 sm:flex-row">
          <Link
            href={`/ai/chat/${url}`}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            Go to Agent
          </Link>
          
          <button
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground"
          >
            Deploy Agent
          </button>

          <button
           onClick={() => setAgentCreated()}
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground"
          >
            Create Another Agent
          </button>
        </div>
      </div>

    </div>
  )
}

export default AgentCreatedSuccessfully
