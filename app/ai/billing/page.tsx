"use client";
import { AppSidebar } from "@/components/Sidebar/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { SidebarTrigger } from "@/components/ui/sidebar";
import Settings from "@/components/settings/settings";
import Billing from "@/components/billings/billing";




export default function BillingPage() {
  return (
    <SidebarProvider>
    <AppSidebar />




    <main className="container">

        <SidebarTrigger />
           <Billing />

    </main>
</SidebarProvider>
  );
}
