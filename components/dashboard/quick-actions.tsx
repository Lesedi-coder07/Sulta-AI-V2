"use client";

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Settings, CreditCard, BarChart3 } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function QuickActions() {
  const router = useRouter();

  const actions = [
    {
      title: 'New Agent',
      description: 'Build a new AI agent',
      icon: Plus,
      onClick: () => router.push('/ai/create'),
      color: 'bg-white hover:bg-white/80',
    },
    {
      title: 'Billing',
      description: 'Manage subscription',
      icon: CreditCard,
      onClick: () => router.push('/ai/billing'),
      color: 'bg-white hover:bg-white/80',
    },
    {
      title: 'Settings',
      description: 'Account settings',
      icon: Settings,
      onClick: () => router.push('/ai/settings'),
      color: 'bg-white hover:bg-white/80',
    },
    {
      title: 'Analytics',
      description: 'View insights',
      icon: BarChart3,
      onClick: () => router.push('/ai/dashboard'),
      color: 'bg-white hover:bg-white/80',
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
          {actions.map((action) => {
            const Icon = action.icon;
            return (
              <Button
                key={action.title}
                variant="outline"
                className="h-auto w-full flex flex-col items-start justify-start p-4 gap-3 hover:bg-neutral-50 dark:hover:bg-neutral-900 overflow-hidden"
                onClick={action.onClick}
              >
                <div className={`${action.color} p-2 rounded-lg shrink-0 w-fit`}>
                  <Icon className="h-4 w-4 text-black" />
                </div>
                <div className="text-left w-full min-w-0 flex-1 flex flex-col gap-1">
                  <div className="font-semibold text-sm leading-tight">{action.title}</div>
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

