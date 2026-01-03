"use client";
import { AppSidebar } from "@/components/Sidebar/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { SidebarTrigger } from "@/components/ui/sidebar";
import Settings from "@/components/settings/settings";




export default function SettingsPage() {
  return (
    <SidebarProvider>
    <AppSidebar />




    <main className="container">

        <SidebarTrigger />
           <Settings />

    </main>
</SidebarProvider>
  );
}
