'use client'
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
import { HomeIcon, PlusIcon, SettingsIcon, DollarSignIcon, LogOutIcon, FlaskConical } from "lucide-react"
import { Button } from "../ui/button"
import { auth } from "@/app/api/firebase/firebaseConfig"
import { usePathname } from "next/navigation";

const items = [
    {
        title: "Dashboard",
        href: "/dashboard",
        icon: HomeIcon,
    }, {
        title: 'New Agent',
        href: "/create",
        icon: PlusIcon,
    }, {
        title: "Billing",  // New item
        href: "/billing",
        icon: DollarSignIcon,
    }


    , {
        title: "Playground",
        href: "/playground",
        icon: FlaskConical,
    }, {
        title: "Settings",
        href: "/settings",
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
        <Sidebar className="flex flex-col h-full bg-sidebar border-r-0">
            <SidebarHeader className="px-4 py-5">
                <div className="flex items-center space-x-2.5">
                    <div className="w-6 h-6 bg-white rounded-md flex items-center justify-center">
                        <span className="text-black font-bold text-sm leading-none">S</span>
                    </div>
                    <span className="text-sm font-semibold text-sidebar-foreground">Sulta AI</span>
                </div>
            </SidebarHeader>
            <SidebarContent className="flex-1 px-2 py-2">
                <SidebarMenu className="space-y-0.5">
                    {items.map((item) => item && (
                        <SidebarMenuItem key={item.title}>
                            <SidebarMenuButton
                                asChild
                                className={`w-full h-8 px-3 rounded-md text-left transition-colors duration-150
                                         ${currentPage === item.href
                                            ? 'bg-white/10 text-white'
                                            : 'text-sidebar-foreground/50 hover:bg-white/5 hover:text-sidebar-foreground/80'}`}
                            >
                                <a href={item.href} className="flex items-center space-x-2.5">
                                    <item.icon className="w-4 h-4 flex-shrink-0" />
                                    <span className="text-sm">{item.title}</span>
                                </a>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    ))}
                </SidebarMenu>
            </SidebarContent>
            <SidebarFooter className="px-2 py-3">
                <SidebarMenuItem className="list-none">
                    <SidebarMenuButton
                        asChild
                        className="w-full h-8 px-3 rounded-md text-left transition-colors duration-150
                                 text-sidebar-foreground/50 hover:bg-white/5 hover:text-sidebar-foreground/80 group"
                    >
                        <Button
                            onClick={handleLogout}
                            variant="ghost"
                            className="w-full h-full justify-start p-0 border-none bg-transparent hover:bg-transparent"
                        >
                            <LogOutIcon className="w-4 h-4 flex-shrink-0" />
                            <span className="text-sm ml-2.5">Logout</span>
                        </Button>
                    </SidebarMenuButton>
                </SidebarMenuItem>
            </SidebarFooter>
        </Sidebar>
    )
}
