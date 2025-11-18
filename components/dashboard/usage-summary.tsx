"use client";

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { CreditCard, TrendingUp } from 'lucide-react';
import { Agent } from '@/types/agent';

interface UsageSummaryProps {
  agents: Agent[];
  creditsLimit?: number;
}

export function UsageSummary({ 
  agents,
  creditsLimit = 50000
}: UsageSummaryProps) {
  // Calculate totals from agent data (similar to dashboard-stats.tsx)
  const creditsUsed = agents.reduce((sum, agent) => sum + (agent.tokensUsed || 0), 0);
  const totalQueries = agents.reduce((sum, agent) => sum + (agent.totalQueries || 0), 0);
  const creditsRemaining = Math.max(0, creditsLimit - creditsUsed);
  const creditsPercentage = creditsLimit > 0 ? (creditsUsed / creditsLimit) * 100 : 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5" />
          Usage Summary
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Tokens Used</span>
            <span className="font-semibold">
              {creditsUsed.toLocaleString()} / {creditsLimit.toLocaleString()}
            </span>
          </div>
          <Progress value={creditsPercentage} className="h-2" />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{creditsRemaining.toLocaleString()} tokens remaining</span>
            <span>{creditsPercentage.toFixed(0)}% used</span>
          </div>
        </div>
        
        <div className="pt-4 border-t">
          <div className="flex items-center gap-2 text-sm">
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">Total queries:</span>
            <span className="font-semibold">{totalQueries.toLocaleString()}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

