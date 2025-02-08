'use client'
import { AgentCreationForm } from "@/components/agent-creation/agent-creation-form";
import { AppSidebar } from "@/components/Sidebar/app-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function CreateAgentPage() {

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
        <SidebarProvider>
            <AppSidebar />




            <main className="container">
                <SidebarTrigger />
                <div className="container mx-auto max-w-4xl px-4 py-8">
                    <div className="space-y-2">
                        <h1 className="text-3xl font-bold tracking-tight">Create AI Agent</h1>
                        <p className="text-muted-foreground">
                            Configure your custom AI agent with specialized capabilities
                        </p>
                    </div>
                    <AgentCreationForm />
                </div>

            </main>
        </SidebarProvider>
    );
}