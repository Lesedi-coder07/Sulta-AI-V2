"use client";

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Bot, Activity, MessageSquare, Zap } from 'lucide-react';
import { Agent } from '@/types/agent';

interface DashboardStatsProps {
  agents: Agent[];
}

export function DashboardStats({ agents }: DashboardStatsProps) {
  const totalAgents = agents.length;
  const activeAgents = agents.filter(agent => agent.isPublic).length;

  // Calculate totals from agent data
  const totalQueries = agents.reduce((sum, agent) => sum + (agent.totalQueries || 0), 0);
  const totalTokens = agents.reduce((sum, agent) => sum + (agent.tokensUsed || 0), 0);
  const totalChats = agents.reduce((sum, agent) => sum + (agent.totalChats || 0), 0);

  const stats = [
    {
      title: 'Total Agents',
      value: totalAgents,
      icon: Bot,
      description: `${activeAgents} active`,
    },
    {
      title: 'Total Queries',
      value: totalQueries.toLocaleString(),
      icon: MessageSquare,
      description: 'All time',
    },
    {
      title: 'Total Chats',
      value: totalChats.toLocaleString(),
      icon: Activity,
      description: 'Conversations',
    },
    {
      title: 'Tokens Used',
      value: totalTokens.toLocaleString(),
      icon: Zap,
      description: 'Total usage',
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card
            key={stat.title}
            className="relative overflow-hidden group cursor-default bg-card border-border/60 transition-colors duration-200 hover:border-border"
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{stat.title}</CardTitle>
              <Icon className="h-4 w-4 text-muted-foreground/60" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold tracking-tight number-animate">{stat.value}</div>
              <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
