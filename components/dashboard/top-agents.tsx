"use client";

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Agent } from '@/types/agent';
import { Bot, TrendingUp, Crown } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface TopAgentsProps {
  agents: Agent[];
}

export function TopAgents({ agents }: TopAgentsProps) {
  const router = useRouter();

  // Sort agents by total queries (most used first)
  const topAgents = [...agents]
    .sort((a, b) => (b.totalQueries || 0) - (a.totalQueries || 0))
    .slice(0, 3);

  if (topAgents.length === 0) {
    return null;
  }

  const getRankStyle = (index: number) => {
    if (index === 0) return 'bg-gradient-to-br from-yellow-500/20 to-yellow-600/10 border-yellow-500/30 text-yellow-500';
    if (index === 1) return 'bg-gradient-to-br from-gray-300/20 to-gray-400/10 border-gray-400/30 text-gray-400';
    if (index === 2) return 'bg-gradient-to-br from-orange-600/20 to-orange-700/10 border-orange-600/30 text-orange-600';
    return 'bg-white/5 border-white/10 text-muted-foreground';
  };

  return (
    <Card className="glass-card hover-glow animate-fade-in-up" style={{ animationDelay: '200ms' }}>
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <div className="icon-container p-2">
            <TrendingUp className="h-4 w-4 text-white/80" />
          </div>
          <span>Top Performing Agents</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {topAgents.map((agent, index) => (
            <div
              key={agent.id}
              onClick={() => router.push(`/ai/chat/${agent.id}`)}
              className="relative flex items-center justify-between p-4 rounded-xl 
                       border border-white/10 bg-white/5 
                       hover:bg-white/10 hover:border-white/20 hover:scale-[1.01] 
                       cursor-pointer transition-all duration-300 group
                       animate-fade-in-up"
              style={{ animationDelay: `${(index + 3) * 100}ms` }}
            >
              {/* Rank indicator */}
              <div className="flex items-center gap-4">
                <div className={`flex h-8 w-8 items-center justify-center rounded-lg border ${getRankStyle(index)} font-bold text-sm transition-transform duration-300 group-hover:scale-110`}>
                  {index === 0 ? <Crown className="h-4 w-4" /> : index + 1}
                </div>

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 border border-white/10 group-hover:border-white/20 transition-all duration-300">
                  <Bot className="h-5 w-5 text-white/70" />
                </div>

                <div>
                  <div className="font-semibold text-sm group-hover:text-white transition-colors duration-300">{agent.name}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">{agent.type || 'General'} Agent</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Badge
                  variant={agent.isPublic ? "default" : "secondary"}
                  className={agent.isPublic
                    ? "bg-green-500/20 text-green-400 border border-green-500/30 hover:bg-green-500/30"
                    : "bg-white/10 text-muted-foreground border border-white/10"}
                >
                  {agent.isPublic ? "Public" : "Private"}
                </Badge>

                <div className="text-right min-w-[80px]">
                  <div className="text-sm font-bold number-animate">
                    {(agent.totalQueries || 0).toLocaleString()}
                  </div>
                  <div className="text-xs text-muted-foreground">queries</div>
                </div>
              </div>

              {/* Hover glow effect */}
              <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none bg-gradient-to-r from-white/5 via-transparent to-white/5" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
