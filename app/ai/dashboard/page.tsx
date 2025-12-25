import React from 'react';
import { useState, useEffect } from 'react';
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/Sidebar/app-sidebar"
import AgentCards from '@/components/dashboard/AgentCards'
import { AgentSelector } from '@/components/dashboard/agent-selector';
import { DashboardStats } from '@/components/dashboard/dashboard-stats';
import { QuickActions } from '@/components/dashboard/quick-actions';
import { UsageSummary } from '@/components/dashboard/usage-summary';
import { TopAgents } from '@/components/dashboard/top-agents';
import { AuthProvider } from '@/components/auth/auth-provider';
import { getCurrentUser } from '@/lib/auth-helpers';
import { getAgents } from './actions';
import { redirect } from 'next/navigation';
import { Sparkles } from 'lucide-react';

async function Dashboard() {
    // Fetch user and agents server-side
    const user = await getCurrentUser();

    if (!user) {
        redirect('/login');
    }

    // Fetch agents in parallel with user check
    const agents = await getAgents(user.uid);

    // Get greeting based on time of day
    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Good morning';
        if (hour < 18) return 'Good afternoon';
        return 'Good evening';
    };

    return (
        <AuthProvider>
            <div className="relative min-h-screen">
                <SidebarProvider>
                    <AppSidebar />
                    <main className='relative flex-1 overflow-hidden'>
                        {/* Background decorations */}
                        <div className="absolute inset-0 pointer-events-none overflow-hidden">
                            <div className="absolute -top-[400px] -right-[400px] w-[800px] h-[800px] bg-white/[0.02] rounded-full blur-3xl" />
                            <div className="absolute top-1/2 -left-[300px] w-[600px] h-[600px] bg-white/[0.01] rounded-full blur-3xl" />
                            <div className="absolute inset-0 bg-grid-pattern opacity-30" />
                        </div>

                        <SidebarTrigger />

                        <div className='relative p-6 md:p-8 flex flex-col w-full gap-8'>
                            {/* Welcome header */}
                            <div className="animate-fade-in-up">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="icon-container p-2.5 glass-card">
                                        <Sparkles className="h-5 w-5 text-white/80" />
                                    </div>
                                    <h1 className="text-3xl font-bold tracking-tight">{getGreeting()}</h1>
                                </div>
                                <p className="text-muted-foreground ml-[52px]">
                                    Here's an overview of your AI agents and activity
                                </p>
                            </div>

                            {/* Dashboard Stats */}
                            <DashboardStats agents={agents} />

                            {/* Quick Actions and Usage Summary */}
                            <div className='grid gap-6 md:grid-cols-2'>
                                <QuickActions />
                                <UsageSummary agents={agents} />
                            </div>

                            {/* Top Agents */}
                            {agents.length > 0 && (
                                <TopAgents agents={agents} />
                            )}

                            {/* Divider */}
                            <div className="divider-gradient" />

                            {/* Agents Section */}
                            <div>
                                <AgentSelector initialAgents={agents} userId={user.uid} />
                            </div>
                        </div>
                    </main>
                </SidebarProvider>
            </div>
        </AuthProvider>
    )
}

export default Dashboard
