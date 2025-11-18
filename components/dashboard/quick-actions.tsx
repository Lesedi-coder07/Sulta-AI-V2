"use client";

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Settings, CreditCard, BarChart3 } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function QuickActions() {
  const router = useRouter();

  const actions = [
    {
      title: 'Create Agent',
      description: 'Build a new AI agent',
      icon: Plus,
      onClick: () => router.push('/ai/create'),
      color: 'bg-blue-500 hover:bg-blue-600',
    },
    {
      title: 'Billing',
      description: 'Manage subscription',
      icon: CreditCard,
      onClick: () => router.push('/ai/billing'),
      color: 'bg-green-500 hover:bg-green-600',
    },
    {
      title: 'Settings',
      description: 'Account settings',
      icon: Settings,
      onClick: () => router.push('/ai/settings'),
      color: 'bg-purple-500 hover:bg-purple-600',
    },
    {
      title: 'Analytics',
      description: 'View insights',
      icon: BarChart3,
      onClick: () => router.push('/ai/dashboard'),
      color: 'bg-orange-500 hover:bg-orange-600',
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
                className="h-auto flex flex-col items-start justify-start p-4 space-y-2 hover:bg-neutral-50 dark:hover:bg-neutral-900"
                onClick={action.onClick}
              >
                <div className={`${action.color} p-2 rounded-lg`}>
                  <Icon className="h-4 w-4 text-white" />
                </div>
                <div className="text-left">
                  <div className="font-semibold text-sm">{action.title}</div>
                  <div className="text-xs text-muted-foreground">{action.description}</div>
                </div>
              </Button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

