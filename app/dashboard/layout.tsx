import type React from "react"

import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/AppSideBar"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen">
      <AppSidebar />
      <SidebarInset className="flex-1">
        <div className="sticky top-0 z-10 flex items-center h-14 px-4 border-b bg-background md:px-6">
          <SidebarTrigger className="mr-4" />
          <h1 className="text-lg font-semibold">Ntake Depot Management System</h1>
        </div>
        <div className="flex-1">{children}</div>
      </SidebarInset>
    </div>
  )
}

