import { useSidebar } from "@/components/ui/sidebar"
import { Button } from "@base-ui/react"
import {
  IconLayoutSidebarLeftExpand,
  IconLayoutSidebarLeftCollapse,
} from "@tabler/icons-react"
import readmeoLogo from "@/assets/READMEO LOGO.webp"
import { cn } from "@/lib/utils"
import DarkModeBtn from "./dark-mode-btn"

export default function TopNavbar() {
  const { state, isMobile, openMobile, toggleSidebar } = useSidebar()
  const isCollapsed = isMobile ? !openMobile : state === "collapsed"

  return (
    <nav
    className={cn(
      "flex h-14.5 w-full items-center justify-between border-b bg-background pr-4 dark:border-b-neutral-700",
      isCollapsed && "pl-4"
    )}
  >
    <div className="flex items-center justify-center gap-2">
      {isCollapsed && (
        <img src={readmeoLogo} alt="Readmeo Logo" className="h-5.5" />
      )}
      <Button
        onClick={toggleSidebar}
        aria-label="Toggle Sidebar"
        className="flex cursor-pointer items-center justify-center"
      >
        {isCollapsed ? (
          <IconLayoutSidebarLeftExpand stroke={1.5} size={24} />
        ) : (
          <IconLayoutSidebarLeftCollapse stroke={1.5} size={24} />
        )}
      </Button>
    </div>
      <DarkModeBtn/>
    </nav>
  )
}
