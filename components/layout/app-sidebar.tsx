"use client"

import {Home, Package, FileText, ChevronDown} from "lucide-react"
import Link from "next/link"

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
} from "@/components/ui/sidebar"
import {
    DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {User2, ChevronUp} from "lucide-react"
import {
    Collapsible, CollapsibleContent, CollapsibleTrigger,
} from "@/components/ui/collapsible"

// Menu items
const menuItems = [
    {
        title: "Dashboard", url: "/dashboard", icon: Home,
    },
    {
        title: "Catalog", icon: Package, items: [
            {
                title: "Categories", url: "/dashboard/categories",
            },
            {
                title: "Products", url: "/dashboard/products",
            },
        ],
    },
    {
        title: "Posts", url: "/dashboard/posts", icon: FileText,
    },
]

export function AppSidebar() {
    return (
        <Sidebar>
            <SidebarHeader>
               <Link href={'/'}>
                   <div className="flex items-center gap-2 px-4 py-2">
                       <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                           <Package className="h-4 w-4"/>
                       </div>
                       <span className="font-semibold">Admin Panel</span>
                   </div>
               </Link>
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Navigation</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {menuItems.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    {item.items ? (
                                        <Collapsible defaultOpen className="group/collapsible">
                                            <CollapsibleTrigger asChild>
                                                <SidebarMenuButton>
                                                    <item.icon/>
                                                    <span>{item.title}</span>
                                                    <ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180"/>
                                                </SidebarMenuButton>
                                            </CollapsibleTrigger>
                                            <CollapsibleContent>
                                                <SidebarMenuSub>
                                                    {item.items.map((subItem) => (
                                                        <SidebarMenuSubItem key={subItem.title}>
                                                            <SidebarMenuSubButton asChild>
                                                                <Link href={subItem.url}>
                                                                    <span>{subItem.title}</span>
                                                                </Link>
                                                            </SidebarMenuSubButton>
                                                        </SidebarMenuSubItem>
                                                    ))}
                                                </SidebarMenuSub>
                                            </CollapsibleContent>
                                        </Collapsible>
                                    ) : (
                                        <SidebarMenuButton asChild>
                                            <Link href={item.url}>
                                                <item.icon/>
                                                <span>{item.title}</span>
                                            </Link>
                                        </SidebarMenuButton>
                                    )}
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <SidebarMenuButton>
                                    <User2/> Admin User
                                    <ChevronUp className="ml-auto"/>
                                </SidebarMenuButton>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                                side="top"
                                align={'end'}
                                className="w-[--radix-popper-anchor-width]"
                            >
                                <DropdownMenuItem>
                                    <span>Account</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    <span>Settings</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    <span>Sign out</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
        </Sidebar>
    )
}