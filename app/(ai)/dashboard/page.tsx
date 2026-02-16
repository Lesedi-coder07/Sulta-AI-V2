'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged, User } from 'firebase/auth';
import { collection, doc, getDoc, getDocs, query, where, documentId } from 'firebase/firestore';
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/Sidebar/app-sidebar";
import { DashboardContent } from '@/components/dashboard/dashboard-content';
import { AuthProvider } from '@/components/auth/auth-provider';
import { Agent } from '@/types/agent';
import { Skeleton } from '@/components/ui/skeleton';
import { Sparkles } from 'lucide-react';

function DashboardSkeleton() {
    return (
        <div className='relative p-6 md:p-8 flex flex-col w-full gap-8'>
            {/* Welcome header skeleton */}
            <div>
                <div className="flex items-center gap-3 mb-2">
                    <Skeleton className="h-10 w-10 rounded-lg" />
                    <Skeleton className="h-9 w-48" />
                </div>
                <Skeleton className="h-5 w-72 ml-[52px]" />
            </div>

            {/* Stats skeleton */}
            <div className="grid gap-4 md:grid-cols-3">
                <Skeleton className="h-28 rounded-xl" />
                <Skeleton className="h-28 rounded-xl" />
                <Skeleton className="h-28 rounded-xl" />
            </div>

            {/* Cards skeleton */}
            <div className='grid gap-6 md:grid-cols-2'>
                <Skeleton className="h-48 rounded-xl" />
                <Skeleton className="h-48 rounded-xl" />
            </div>

            {/* Divider */}
            <Skeleton className="h-px w-full" />

            {/* Agents section skeleton */}
            <div className="space-y-4">
                <Skeleton className="h-8 w-32" />
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    <Skeleton className="h-40 rounded-xl" />
                    <Skeleton className="h-40 rounded-xl" />
                    <Skeleton className="h-40 rounded-xl" />
                </div>
            </div>
        </div>
    );
}

function Dashboard() {
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);
    const [agents, setAgents] = useState<Agent[]>([]);
    const [loading, setLoading] = useState(true);
    const [authChecked, setAuthChecked] = useState(false);

    // Check auth state
    useEffect(() => {
        let unsubscribe: (() => void) | undefined;

        import('@/app/api/firebase/firebaseConfig').then((firebaseModule) => {
            unsubscribe = onAuthStateChanged(firebaseModule.auth, (currentUser) => {
                if (currentUser) {
                    setUser(currentUser);
                } else {
                    router.replace('/login');
                }
                setAuthChecked(true);
            });
        });

        return () => {
            if (unsubscribe) unsubscribe();
        };
    }, [router]);

    // Fetch agents when user is available
    useEffect(() => {
        if (!user) return;

        const fetchAgents = async () => {
            try {
                const { db } = await import('@/app/api/firebase/firebaseConfig');
                
                // Get user document to find agent IDs
                const userDoc = await getDoc(doc(db, 'users', user.uid));
                
                if (!userDoc.exists()) {
                    setAgents([]);
                    setLoading(false);
                    return;
                }

                const agentIds: string[] = userDoc.data()?.agents || [];

                if (agentIds.length === 0) {
                    setAgents([]);
                    setLoading(false);
                    return;
                }

                // Fetch all agents in parallel
                const agentPromises = agentIds.map(async (agentId) => {
                    const agentDoc = await getDoc(doc(db, 'agents', agentId));

                    if (!agentDoc.exists()) {
                        return null;
                    }

                    const agentData = agentDoc.data();
                    return {
                        id: agentId,
                        name: agentData?.name || 'Unnamed Agent',
                        type: agentData?.type || 'Text',
                        status: agentData?.isPublic ? 'online' : 'offline',
                        isPublic: agentData?.isPublic || false,
                        totalQueries: agentData?.totalQueries || 0,
                        tokensUsed: agentData?.tokensUsed || 0,
                        totalChats: agentData?.totalChats || 0,
                        description: agentData?.description,
                        createdAt: agentData?.createdAt,
                        personality: agentData?.personality,
                        tone: agentData?.tone,
                        expertise: agentData?.expertise,
                        contextMemory: agentData?.contextMemory,
                        extendedThinking: agentData?.extendedThinking,
                        guardrails: agentData?.guardrails,
                        llmConfig: agentData?.llmConfig,
                        customApiTool: agentData?.customApiTool,
                        customSystemPrompt: agentData?.customSystemPrompt,
                        extraContext: agentData?.extraContext || '',
                    } as Agent;
                });

                const fetchedAgents = await Promise.all(agentPromises);
                setAgents(fetchedAgents.filter((agent): agent is Agent => agent !== null));
            } catch (error) {
                console.error('Error fetching agents:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchAgents();
    }, [user]);

    // Show nothing while checking auth (prevents flash)
    if (!authChecked) {
        return null;
    }

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

                        {loading ? (
                            <DashboardSkeleton />
                        ) : (
                            <DashboardContent agents={agents} userId={user?.uid || ''} />
                        )}
                    </main>
                </SidebarProvider>
            </div>
        </AuthProvider>
    );
}

export default Dashboard;
