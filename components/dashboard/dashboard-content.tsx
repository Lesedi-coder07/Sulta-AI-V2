'use client';

import { useState } from 'react';
import { AgentSelector } from '@/components/dashboard/agent-selector';
import { DashboardStats } from '@/components/dashboard/dashboard-stats';
import { RecentlyUsedAgent } from '@/components/dashboard/recently-used-agent';
import { UsageSummary } from '@/components/dashboard/usage-summary';
import { TopAgents } from '@/components/dashboard/top-agents';
import { Agent } from '@/types/agent';

interface DashboardContentProps {
  agents: Agent[];
  userId: string;
}

export function DashboardContent({ agents, userId }: DashboardContentProps) {
  const [agentSelected, setAgentSelected] = useState(false);

  // Get greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className='relative p-6 md:p-8 flex flex-col w-full gap-8'>
      {/* Dashboard content - hidden when agent is selected */}
      {!agentSelected && (
        <>
          {/* Welcome header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight">{getGreeting()}</h1>
              <p className="text-muted-foreground mt-1">
                Here&apos;s an overview of your AI agents and activity
              </p>
            </div>
            <div className="flex items-center gap-2 self-start sm:self-auto">
              <div className="rounded-xl border border-white/8 bg-white/5 px-4 py-2.5 text-sm text-muted-foreground">
                <span className="text-white font-medium">{new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</span>
              </div>
            </div>
          </div>

          {/* Dashboard Stats */}
          <DashboardStats agents={agents} />

          {/* Recently Used Agent and Usage Summary */}
          <div className='grid gap-6 md:grid-cols-2'>
            <RecentlyUsedAgent agents={agents} />
            <UsageSummary agents={agents} />
          </div>

{/*          
          {agents.length > 0 && (
            <TopAgents agents={agents} />
          )} */}

          {/* Divider */}
          <div className="divider-gradient" />
        </>
      )}

      {/* Agents Section - always visible, takes over when agent selected */}
      <div className={agentSelected ? '' : ''}>
        <AgentSelector 
          initialAgents={agents} 
          userId={userId} 
          onAgentSelected={setAgentSelected}
        />
      </div>
    </div>
  );
}
