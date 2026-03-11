'use client'
// import { Plus, Phone, VolumeX } from "lucide-react"
import CallControls from '@/components/ai/call/call-controls'

export default function CallInterface({agent_id} : {agent_id: string}) {
  
    return (
    <>
      <div className="app-shell min-h-screen">
      <div className="container mx-auto max-w-4xl px-4 py-8">
        <div className="flex flex-col space-y-4">
          {/* Header */}
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">AI Call Agent</h1>
            <p className="text-muted-foreground">
              Voice interface for your AI agent
            </p>
          </div>


          {/* Call Controls */}
        <CallControls />

          {/* Call Status */}
          <div className="app-panel rounded-2xl p-4 text-center">
            <p className="text-lg font-medium text-slate-200">
              Status: Ready to connect
            </p>
            <p className="text-sm text-slate-400">
              Duration: 00:00
            </p>
          </div>

          {/* Transcript Area */}
          <div className="app-panel h-96 overflow-y-auto rounded-2xl p-4">
            <div className="space-y-4">
              <p className="text-sm text-slate-300">
                Call logs will appear here...
              </p>
            </div>
          </div>
        </div>
      </div>
      </div>
   
    </>
    );
}
