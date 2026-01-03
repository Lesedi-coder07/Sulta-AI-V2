"use client";

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Settings, CreditCard, BarChart3, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function QuickActions() {
  const router = useRouter();

  const actions = [
    {
      title: 'New Agent',
      description: 'Build a new AI agent',
      icon: Plus,
      onClick: () => router.push("/create"),
    },
    {
      title: 'Billing',
      description: 'Manage subscription',
      icon: CreditCard,
      onClick: () => router.push("/billing"),
    },
    {
      title: 'Settings',
      description: 'Account settings',
      icon: Settings,
      onClick: () => router.push("/settings"),
    },
    {
      title: 'Analytics',
      description: 'View insights',
      icon: BarChart3,
      onClick: () => router.push("/dashboard"),
    },
  ];

  return (
    <Card className="glass-card hover-glow">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <span className="section-header">Quick Actions</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
          {actions.map((action, index) => {
            const Icon = action.icon;
            return (
              <Button
                key={action.title}
                variant="outline"
                className="relative h-auto w-full flex flex-col items-start justify-start p-4 gap-3 
                         border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20 
                         overflow-hidden group transition-all duration-300 hover:scale-[1.02]"
                onClick={action.onClick}
              >
                {/* Gradient border effect on hover */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                  <div className="absolute inset-[-1px] rounded-[inherit] bg-gradient-to-br from-white/20 via-transparent to-white/10 p-[1px]">
                    <div className="w-full h-full rounded-[inherit] bg-card" />
                  </div>
                </div>

                {/* Icon container */}
                <div className="icon-container p-2.5 group-hover:scale-110 transition-transform duration-300">
                  <Icon className="h-4 w-4 text-white/80" />
                </div>

                <div className="text-left w-full min-w-0 flex-1 flex flex-col gap-1 relative">
                  <div className="font-semibold text-sm leading-tight flex items-center gap-2">
                    {action.title}
                    <ArrowRight className="h-3 w-3 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                  </div>
                  <div className="text-xs text-muted-foreground leading-tight line-clamp-2">{action.description}</div>
                </div>
              </Button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
