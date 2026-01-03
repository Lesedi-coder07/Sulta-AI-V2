"use client";

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MessageSquare, ArrowRight, Clock, Sparkles } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Agent } from '@/types/agent';
import { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';

interface RecentlyUsedAgentProps {
  agents: Agent[];
}

export function RecentlyUsedAgent({ agents }: RecentlyUsedAgentProps) {
  const router = useRouter();
  const [recentAgent, setRecentAgent] = useState<Agent | null>(null);

  useEffect(() => {
    if (agents.length === 0) return;

    // Try to get the last used agent from localStorage
    const lastUsedAgentId = localStorage.getItem('lastUsedAgentId');
    
    if (lastUsedAgentId) {
      // Find the agent in the current agents list
      const agent = agents.find(a => a.id === lastUsedAgentId);
      if (agent) {
        setRecentAgent(agent);
        return;
      }
    }
    
    // Fallback: show any agent (first one in the list)
    setRecentAgent(agents[0]);
  }, [agents]);

  // Don't render if there are no agents
  if (agents.length === 0 || !recentAgent) {
    return null;
  }

  const handleUseAgent = () => {
    // Update localStorage with this agent
    localStorage.setItem('lastUsedAgentId', recentAgent.id);
    // Navigate to chat with this agent
    router.push(`/chat/${recentAgent.id}`);
  };

  return (
    <Card className="glass-card">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Clock className="h-5 w-5 text-white/80" />
          <span className="section-header">Recently Used Agent</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative">
          {/* Agent Card */}
          <div className="relative p-5 rounded-xl border border-white/10 bg-white/5">

            {/* Content */}
            <div className="flex items-start justify-between gap-4 relative z-10">
              <div className="flex-1 space-y-3">
                {/* Agent name and icon */}
                <div className="flex items-center gap-3">
                  <div className="icon-container p-2.5">
                    <MessageSquare className="h-5 w-5 text-white/80" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-white">{recentAgent.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge 
                        variant="secondary" 
                        className="capitalize bg-white/10 text-white/70 border-white/10 text-xs"
                      >
                        {recentAgent.type}
                      </Badge>
                      <Badge
                        variant={recentAgent.isPublic ? "default" : "outline"}
                        className={recentAgent.isPublic
                          ? "bg-green-500/20 text-green-400 border-green-500/30 text-xs"
                          : "bg-white/10 text-white/70 border-white/10 text-xs"}
                      >
                        {recentAgent.isPublic ? 'Public' : 'Private'}
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Description */}
                {recentAgent.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {recentAgent.description}
                  </p>
                )}

                {/* Stats */}
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1.5">
                    <MessageSquare className="h-3.5 w-3.5" />
                    <span>{(recentAgent.totalQueries || 0).toLocaleString()} queries</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Sparkles className="h-3.5 w-3.5" />
                    <span>{(recentAgent.tokensUsed || 0).toLocaleString()} tokens</span>
                  </div>
                </div>
              </div>

              {/* Use Agent Button */}
              <Button
                onClick={handleUseAgent}
                className="bg-white/10 hover:bg-white/20 border border-white/10 hover:border-white/20 text-white"
              >
                Use Agent
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
