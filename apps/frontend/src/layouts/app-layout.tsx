import AppSidebar from "@/components/shared/app-sidebar"
import { SidebarProvider } from "@/components/ui/sidebar"
import { Outlet } from "react-router"

export default function AppLayout() {
  return (
    <div>
      <SidebarProvider>
        <AppSidebar />
        <main className="w-full bg-background">
          <Outlet />
        </main>
      </SidebarProvider>
    </div>
  )
}
