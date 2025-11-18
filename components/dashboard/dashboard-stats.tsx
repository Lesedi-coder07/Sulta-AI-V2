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
      color: 'text-blue-500',
    },
    {
      title: 'Total Queries',
      value: totalQueries.toLocaleString(),
      icon: MessageSquare,
      description: 'All time',
      color: 'text-green-500',
    },
    {
      title: 'Total Chats',
      value: totalChats.toLocaleString(),
      icon: Activity,
      description: 'Conversations',
      color: 'text-purple-500',
    },
    {
      title: 'Tokens Used',
      value: totalTokens.toLocaleString(),
      icon: Zap,
      description: 'Total usage',
      color: 'text-orange-500',
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <Icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

