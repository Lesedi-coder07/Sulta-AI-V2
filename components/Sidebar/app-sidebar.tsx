"use client";

import {
    Sidebar,
    SidebarHeader,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,

} from "@/components/ui/sidebar"
import { HomeIcon, PlusIcon, SettingsIcon, DollarSignIcon, LogOutIcon } from "lucide-react"
import { Button } from "../ui/button"
import { auth } from "@/app/api/firebase/firebaseConfig"
import { usePathname } from "next/navigation";

const items = [
    {
        title: "Dashboard",
        href: "/ai/dashboard",
        icon: HomeIcon,
    }, {
        title: 'New Agent',
        href: "/ai/create",
        icon: PlusIcon,
    }, {
        title: "Billing",  // New item
        href: "/ai/billing",
        icon: DollarSignIcon,
    }

  
    , {
        title: "Settings",
        href: "/ai/settings",
        icon: SettingsIcon,
    }
    // ... additional items can be added here
]




export function AppSidebar() {
    const handleLogout = () => {
       auth.signOut();
    }
    const currentPage = usePathname();
    return (
        <Sidebar className="flex flex-col h-full rounded-l-lg bg-sidebar border-r border-sidebar-border">
            <SidebarHeader className="mx-6 py-6 border-b border-sidebar-border">
                <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-primary to-teal rounded-xl flex items-center justify-center shadow-lg">
                        <span className="text-primary-foreground font-bold text-xl">S</span>
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-sidebar-foreground">Sulta</h2>
                        <p className="text-sm text-sidebar-foreground/70 font-medium">AI Platform</p>
                    </div>
                </div>
            </SidebarHeader>
            <SidebarContent className="flex-1 px-4 py-6">
                <SidebarMenu className="space-y-3">
                    {items.map((item) => item && (
                        <SidebarMenuItem key={item.title}>
                            <SidebarMenuButton 
                                asChild 
                                className={`w-full h-16 px-6 py-4 rounded-xl text-left transition-all duration-300 
                                         hover:bg-sidebar-accent hover:text-sidebar-accent-foreground hover:shadow-md hover:scale-[1.02]
                                         data-[state=active]:bg-sidebar-primary data-[state=active]:text-sidebar-primary-foreground
                                         data-[state=active]:shadow-lg data-[state=active]:scale-[1.02] group ${currentPage === item.href ? 'bg-black/20 text-white shadow-lg scale-[1.02]' : ''}`}
                            >
                                <a href={item.href} className="flex items-center space-x-4">
                                    <div className="p-2 rounded-lg bg-sidebar-accent/20 group-hover:bg-sidebar-accent/40 group-data-[state=active]:bg-sidebar-primary-foreground/20 transition-colors">
                                        <item.icon className="w-5 h-5 flex-shrink-0" />
                                    </div>
                                    <span className="text-base font-semibold">{item.title}</span>
                                </a>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    ))}
                </SidebarMenu>
            </SidebarContent>
            <SidebarFooter className="px-4 py-6 border-t border-sidebar-border">
                <SidebarMenuItem className="list-none">
                    <SidebarMenuButton 
                        asChild 
                        className="w-full h-16 px-6 py-4 rounded-xl text-left transition-all duration-300 
                                 hover:bg-destructive/10 hover:text-destructive hover:shadow-md hover:scale-[1.02]
                                 border border-destructive/20 group"
                    >
                        <Button 
                            onClick={handleLogout} 
                            variant="ghost" 
                            className="w-full h-full justify-start p-0 border-none bg-white text-black"
                        >
                            <div className="p-2 rounded-lg transition-colors">
                                <LogOutIcon className="w-5 h-5 flex-shrink-0" />
                            </div>
                            <span className="text-base font-semibold">Logout</span>
                        </Button>
                    </SidebarMenuButton>
                </SidebarMenuItem>
            </SidebarFooter>
        </Sidebar>
    )
}
