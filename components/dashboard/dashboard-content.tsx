'use client';

import { useState } from 'react';
import { AgentSelector } from '@/components/dashboard/agent-selector';
import { DashboardStats } from '@/components/dashboard/dashboard-stats';
import { QuickActions } from '@/components/dashboard/quick-actions';
import { UsageSummary } from '@/components/dashboard/usage-summary';
import { TopAgents } from '@/components/dashboard/top-agents';
import { Sparkles } from 'lucide-react';
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
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="icon-container p-2.5 glass-card">
                <Sparkles className="h-5 w-5 text-white/80" />
              </div>
              <h1 className="text-3xl font-bold tracking-tight">{getGreeting()}</h1>
            </div>
            <p className="text-muted-foreground ml-[52px]">
              Here's an overview of your AI agents and activity
            </p>
          </div>

          {/* Dashboard Stats */}
          <DashboardStats agents={agents} />

          {/* Quick Actions and Usage Summary */}
          <div className='grid gap-6 md:grid-cols-2'>
            <QuickActions />
            <UsageSummary agents={agents} />
          </div>

          {/* Top Agents */}
          {agents.length > 0 && (
            <TopAgents agents={agents} />
          )}

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
