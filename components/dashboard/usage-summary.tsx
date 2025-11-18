"use client";

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { CreditCard, TrendingUp } from 'lucide-react';

interface UsageSummaryProps {
  creditsRemaining?: number;
  creditsLimit?: number;
  monthlyUsage?: number;
}

export function UsageSummary({ 
  creditsRemaining = 0, 
  creditsLimit = 100,
  monthlyUsage = 0 
}: UsageSummaryProps) {
  const creditsUsed = creditsLimit - creditsRemaining;
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
            <span className="text-muted-foreground">Credits Used</span>
            <span className="font-semibold">
              {creditsUsed.toLocaleString()} / {creditsLimit.toLocaleString()}
            </span>
          </div>
          <Progress value={creditsPercentage} className="h-2" />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{creditsRemaining.toLocaleString()} credits remaining</span>
            <span>{creditsPercentage.toFixed(0)}% used</span>
          </div>
        </div>
        
        <div className="pt-4 border-t">
          <div className="flex items-center gap-2 text-sm">
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">This month:</span>
            <span className="font-semibold">{monthlyUsage.toLocaleString()} queries</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

