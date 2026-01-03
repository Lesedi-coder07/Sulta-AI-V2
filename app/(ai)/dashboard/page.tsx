import React from 'react';
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/Sidebar/app-sidebar"
import { DashboardContent } from '@/components/dashboard/dashboard-content';
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

                        <DashboardContent agents={agents} userId={user.uid} />
                    </main>
                </SidebarProvider>
            </div>
        </AuthProvider>
    )
}

export default Dashboard
