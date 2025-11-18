"use client";

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Agent } from '@/types/agent';
import { Bot, TrendingUp } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface TopAgentsProps {
  agents: Agent[];
}

export function TopAgents({ agents }: TopAgentsProps) {
  const router = useRouter();

  // Sort agents by total queries (most used first)
  const topAgents = [...agents]
    .sort((a, b) => (b.totalQueries || 0) - (a.totalQueries || 0))
    .slice(0, 5);

  if (topAgents.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Top Agents
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {topAgents.map((agent, index) => (
            <div
              key={agent.id}
              onClick={() => router.push(`/ai/chat/${agent.id}`)}
              className="flex items-center justify-between p-3 rounded-lg border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-900 cursor-pointer transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                  <Bot className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <div className="font-semibold text-sm">{agent.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {agent.type.charAt(0).toUpperCase() + agent.type.slice(1)} Agent
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={agent.isPublic ? "default" : "secondary"}>
                  {agent.isPublic ? "Public" : "Private"}
                </Badge>
                <div className="text-right">
                  <div className="text-sm font-semibold">
                    {(agent.totalQueries || 0).toLocaleString()}
                  </div>
                  <div className="text-xs text-muted-foreground">queries</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

