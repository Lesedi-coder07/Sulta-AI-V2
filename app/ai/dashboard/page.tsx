'use client'
import React from 'react';
import { useState , useEffect } from 'react';
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/Sidebar/app-sidebar"
import AgentCards from '@/components/dashboard/AgentCards'
import { AgentSelector } from '@/components/dashboard/agent-selector';
import { GradientText } from "@/components/ui/gradient-text";
import { useRouter } from 'next/navigation';

function Dashboard() {

    const router = useRouter();
    const [auth, setAuth] = useState<any>(null);

    useEffect(() => {
        import('@/app/api/firebase/firebaseConfig').then((firebaseModule) => {
            setAuth(firebaseModule.auth);
        });
    }, []);

    useEffect(() => {
        if (auth) {
            const unsubscribe = auth.onAuthStateChanged((user: any) => {
                if (!user) {
                    router.push('/auth/login');
                }
            });

            return () => unsubscribe();
        }
    }, [auth, router]);
    
    return (
        <div>
            <SidebarProvider>
                <AppSidebar />
                <main className=''>
                    <SidebarTrigger />
                    <div className='p-3 flex flex-col justify-between  w-full gap-9 wz'>
                 
                        <h1 className='mx-4 text-lg font-bold'>Hi, John</h1>
                        <AgentSelector />
                    </div>
                </main>
            </SidebarProvider>
        </div>
    )
}

export default Dashboard
