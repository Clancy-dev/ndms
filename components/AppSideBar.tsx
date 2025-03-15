"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { BarChart3, Calendar, ClipboardList, Home, Package, Settings, ShoppingCart, Store, Users } from "lucide-react"
import Image from "next/image"

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
  SidebarRail,
  SidebarTrigger,
} from "@/components/ui/sidebar"

export function AppSidebar() {
  const pathname = usePathname()
  const [activeLocation, setActiveLocation] = useState("nakawa")

  const isActive = (path: string) => {
    return pathname === path
  }

  return (
    <Sidebar>
      <SidebarHeader className="border-b border-sidebar-border/30">
        <div className="flex items-center gap-3 px-4 py-3">
          <Image
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ndms-QZcJczHLZKuhqdi8RF5OWw0bpDtAt1.png"
            alt="Ntake Depot Logo"
            width={40}
            height={40}
            className="rounded-md shadow-sm"
          />
          <div className="flex flex-col">
            <span className="font-bold text-sm tracking-tight">Ntake Depot</span>
            <span className="text-xs text-muted-foreground">Management System</span>
          </div>
          <SidebarTrigger className="ml-auto md:hidden" />
        </div>
      </SidebarHeader>
      <SidebarContent className="px-2 py-4">
        <SidebarGroup>
          <SidebarGroupLabel className="px-3 text-xs font-semibold uppercase tracking-wider text-sidebar-foreground/50 mb-1">
            Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={isActive("/dashboard")}
                  className="transition-all duration-200 hover:bg-sidebar-accent/70 hover:translate-x-1"
                >
                  <Link href="/dashboard">
                    <Home className="h-4 w-4" />
                    <span>Dashboard</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={isActive("/dashboard/activity")}
                  className="transition-all duration-200 hover:bg-sidebar-accent/70 hover:translate-x-1"
                >
                  <Link href="/dashboard/activity">
                    <BarChart3 className="h-4 w-4" />
                    <span>Activity</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={isActive("/dashboard/products")}
                  className="transition-all duration-200 hover:bg-sidebar-accent/70 hover:translate-x-1"
                >
                  <Link href="/dashboard/products">
                    <Package className="h-4 w-4" />
                    <span>Products</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={isActive("/dashboard/categories")}
                  className="transition-all duration-200 hover:bg-sidebar-accent/70 hover:translate-x-1"
                >
                  <Link href="/dashboard/categories">
                    <ClipboardList className="h-4 w-4" />
                    <span>Categories</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={isActive("/dashboard/orders")}
                  className="transition-all duration-200 hover:bg-sidebar-accent/70 hover:translate-x-1"
                >
                  <Link href="/dashboard/orders">
                    <ShoppingCart className="h-4 w-4" />
                    <span>Orders</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={isActive("/dashboard/locations")}
                  className="transition-all duration-200 hover:bg-sidebar-accent/70 hover:translate-x-1"
                >
                  <Link href="/dashboard/locations">
                    <Store className="h-4 w-4" />
                    <span>Locations</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={isActive("/dashboard/users")}
                  className="transition-all duration-200 hover:bg-sidebar-accent/70 hover:translate-x-1"
                >
                  <Link href="/dashboard/users">
                    <Users className="h-4 w-4" />
                    <span>Users</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="mt-6">
          <SidebarGroupLabel className="px-3 text-xs font-semibold uppercase tracking-wider text-sidebar-foreground/50 mb-1">
            Reports
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  className="transition-all duration-200 hover:bg-sidebar-accent/70 hover:translate-x-1"
                >
                  <Link href="/dashboard/statistics">
                    <BarChart3 className="h-4 w-4" />
                    <span>Statistics</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  className="transition-all duration-200 hover:bg-sidebar-accent/70 hover:translate-x-1"
                >
                  <Link href="/dashboard/calendar">
                    <Calendar className="h-4 w-4" />
                    <span>Calendar</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="border-t border-sidebar-border/30 p-4 mt-auto">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild className="transition-all duration-200 hover:bg-sidebar-accent/70">
              <Link href="/dashboard/settings">
                <Settings className="h-4 w-4" />
                <span>Settings</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}

