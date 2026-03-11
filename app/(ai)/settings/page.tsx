"use client";
import { AppSidebar } from "@/components/Sidebar/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { SidebarTrigger } from "@/components/ui/sidebar";
import Settings from "@/components/settings/settings";




export default function SettingsPage() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="app-shell min-h-screen flex-1 overflow-hidden">
        <div className="relative z-10 px-4 py-4 md:px-6">
          <SidebarTrigger />
          <Settings />
        </div>
      </main>
    </SidebarProvider>
  );
}
