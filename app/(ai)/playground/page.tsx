"use client";

import { AppSidebar } from "@/components/Sidebar/app-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { PlaygroundShell } from "@/components/playground/playground-shell";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function PlaygroundPage() {
  const router = useRouter();
  const [auth, setAuth] = useState<any>(null);

  useEffect(() => {
    import("@/app/api/firebase/firebaseConfig").then((m) => setAuth(m.auth));
  }, []);

  useEffect(() => {
    if (!auth) return;
    const unsub = auth.onAuthStateChanged((user: any) => {
      if (!user) router.push("/login");
    });
    return () => unsub();
  }, [auth, router]);

  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="app-shell min-h-screen flex-1 overflow-hidden flex flex-col">
        {/* Top bar */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-white/6 flex-shrink-0">
          <SidebarTrigger />
          <div>
            <h1 className="text-sm font-semibold tracking-tight text-white/90">
              Agent Playground
            </h1>
            <p className="text-[11px] text-white/30">
              Build and test agent pipelines visually
            </p>
          </div>
        </div>

        {/* Editor fills remaining height */}
        <div className="flex-1 overflow-hidden">
          <PlaygroundShell />
        </div>
      </main>
    </SidebarProvider>
  );
}
