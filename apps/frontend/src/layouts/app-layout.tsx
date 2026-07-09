import AppSidebar from "@/components/shared/app-sidebar"
import { SidebarProvider } from "@/components/ui/sidebar"
import { Outlet } from "react-router"
import { Toaster } from "sonner"

export default function AppLayout() {
  return (
    <div>
      <SidebarProvider>
        <AppSidebar />
        <main className="flex h-svh w-full flex-col overflow-hidden bg-background">
          <Outlet />
          <Toaster
            toastOptions={{
              classNames: {
                toast:
                  "bg-card! text-card-foreground! border! border-border! shadow-lg! rounded-xl!",
                title: "text-sm! font-medium!",
                description: "text-sm! text-muted-foreground!",
                actionButton: "bg-primary! text-primary-foreground!",
                cancelButton: "bg-secondary! text-secondary-foreground!",
              },
            }}
          />
        </main>
      </SidebarProvider>
    </div>
  )
}
