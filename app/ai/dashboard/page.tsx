import React from 'react';
import { useState , useEffect } from 'react';
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

async function Dashboard() {
    // Fetch user and agents server-side
    const user = await getCurrentUser();
    
    if (!user) {
        redirect('/login');
    }

    // Fetch agents in parallel with user check
    const agents = await getAgents(user.uid);

    return (
        <AuthProvider>
            <div>
                <SidebarProvider>
                    <AppSidebar />
                    <main className=''>
                        <SidebarTrigger />
                        <div className='p-6 flex flex-col w-full gap-6'>
                            {/* Dashboard Stats */}
                            <DashboardStats agents={agents} />
                            
                            {/* Quick Actions and Usage Summary */}
                            <div className='grid gap-6 md:grid-cols-2'>
                                <QuickActions />
                                <UsageSummary />
                            </div>
                            
                            {/* Top Agents */}
                            {agents.length > 0 && (
                                <TopAgents agents={agents} />
                            )}
                            
                            {/* Agents Section */}
                            <div className='mt-4'>
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
