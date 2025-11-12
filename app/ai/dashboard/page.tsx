import React from 'react';
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/Sidebar/app-sidebar"
import { AgentSelector } from '@/components/dashboard/agent-selector';
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
                        <div className='p-3 flex flex-col justify-between w-full gap-9 wz'>
                            <AgentSelector initialAgents={agents} userId={user.uid} />
                        </div>
                    </main>
                </SidebarProvider>
            </div>
        </AuthProvider>
    )
}

export default Dashboard
