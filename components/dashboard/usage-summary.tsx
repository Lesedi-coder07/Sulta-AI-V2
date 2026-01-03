"use client";

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { CreditCard, TrendingUp, Zap, AlertCircle } from 'lucide-react';
import { Agent } from '@/types/agent';

interface UsageSummaryProps {
  agents: Agent[];
  creditsLimit?: number;
}

export function UsageSummary({
  agents,
  creditsLimit = 500000
}: UsageSummaryProps) {
  // Calculate totals from agent data (similar to dashboard-stats.tsx)
  const creditsUsed = agents.reduce((sum, agent) => sum + (agent.tokensUsed || 0), 0);
  const totalQueries = agents.reduce((sum, agent) => sum + (agent.totalQueries || 0), 0);
  const creditsRemaining = Math.max(0, creditsLimit - creditsUsed);
  const creditsPercentage = creditsLimit > 0 ? (creditsUsed / creditsLimit) * 100 : 0;

  const getProgressColor = () => {
    if (creditsPercentage >= 90) return 'bg-red-500';
    if (creditsPercentage >= 70) return 'bg-yellow-500';
    return 'bg-gradient-to-r from-white/30 to-white/50';
  };

  const getStatusIndicator = () => {
    if (creditsPercentage >= 90) return { icon: AlertCircle, text: 'Critical usage', color: 'text-red-400' };
    if (creditsPercentage >= 70) return { icon: AlertCircle, text: 'High usage', color: 'text-yellow-400' };
    return { icon: Zap, text: 'Normal usage', color: 'text-green-400' };
  };

  const status = getStatusIndicator();
  const StatusIcon = status.icon;

  return (
    <Card className="glass-card">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <div className="icon-container p-2">
            <CreditCard className="h-4 w-4 text-white/80" />
          </div>
          <span>Usage Summary</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        {/* Main usage display */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Tokens Used</span>
            <div className="flex items-center gap-2">
              <StatusIcon className={`h-3.5 w-3.5 ${status.color}`} />
              <span className="font-bold number-animate">
                {creditsUsed.toLocaleString()}
                <span className="text-muted-foreground font-normal"> / {creditsLimit.toLocaleString()}</span>
              </span>
            </div>
          </div>

          {/* Custom styled progress bar */}
          <div className="relative h-2.5 bg-white/10 rounded-full overflow-hidden">
            <div
              className={`absolute inset-y-0 left-0 rounded-full ${getProgressColor()} transition-all duration-500 ease-out`}
              style={{ width: `${Math.min(creditsPercentage, 100)}%` }}
            >
              {/* Animated shine effect */}
              <div className="absolute inset-0 opacity-50 animate-shimmer" />
            </div>
          </div>

          <div className="flex justify-between text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-white/30" />
              {creditsRemaining.toLocaleString()} tokens remaining
            </span>
            <span className={creditsPercentage >= 70 ? status.color : ''}>
              {creditsPercentage.toFixed(0)}% used
            </span>
          </div>
        </div>

        {/* Divider */}
        <div className="divider-gradient" />

        {/* Total queries */}
        <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10">
          <div className="flex items-center gap-3">
            <div className="icon-container p-2">
              <TrendingUp className="h-4 w-4 text-white/70" />
            </div>
            <span className="text-sm text-muted-foreground">Total queries</span>
          </div>
          <span className="font-bold number-animate text-lg">{totalQueries.toLocaleString()}</span>
        </div>
      </CardContent>
    </Card>
  );
}
