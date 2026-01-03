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
      gradient: 'from-white/10 to-white/5',
      iconBg: 'bg-white/10',
    },
    {
      title: 'Total Queries',
      value: totalQueries.toLocaleString(),
      icon: MessageSquare,
      description: 'All time',
      gradient: 'from-white/10 to-white/5',
      iconBg: 'bg-white/10',
    },
    {
      title: 'Total Chats',
      value: totalChats.toLocaleString(),
      icon: Activity,
      description: 'Conversations',
      gradient: 'from-white/10 to-white/5',
      iconBg: 'bg-white/10',
    },
    {
      title: 'Tokens Used',
      value: totalTokens.toLocaleString(),
      icon: Zap,
      description: 'Total usage',
      gradient: 'from-white/10 to-white/5',
      iconBg: 'bg-white/10',
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card
            key={stat.title}
            className="relative overflow-hidden glass-card group cursor-default transition-all duration-300 hover:scale-[1.02]"
          >
            {/* Subtle gradient overlay */}
            <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-50`} />

            {/* Shine effect on hover */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            </div>

            <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
              <div className={`${stat.iconBg} p-2.5 rounded-xl border border-white/10 transition-all duration-300 group-hover:scale-110 group-hover:border-white/20`}>
                <Icon className="h-4 w-4 text-white/80" />
              </div>
            </CardHeader>
            <CardContent className="relative">
              <div className="text-3xl font-bold tracking-tight number-animate">{stat.value}</div>
              <p className="text-xs text-muted-foreground mt-1.5 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-white/30" />
                {stat.description}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
