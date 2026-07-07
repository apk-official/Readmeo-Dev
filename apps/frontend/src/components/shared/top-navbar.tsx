import { useSidebar } from "@/components/ui/sidebar"
import { Button } from "@base-ui/react"
import {
  IconLayoutSidebarLeftExpand,
  IconLayoutSidebarLeftCollapse,
  IconSun,
  IconMoon,
} from "@tabler/icons-react"
import readmeoLogo from "@/assets/READMEO LOGO.webp"
import { useTheme } from "@/components/theme-provider"

export default function TopNavbar() {
  const { toggleSidebar, state } = useSidebar()
  const { theme, setTheme } = useTheme()

  const toggleTheme = () => setTheme(theme === "dark" ? "light" : "dark")

  return (
    <nav className="flex h-14.5 w-full items-center justify-between border-b bg-background px-12 dark:border-b-neutral-700">
      <div className="flex items-center justify-center gap-2">
        {state === "collapsed" ? (
          <img src={readmeoLogo} alt="Readmeo Logo" className="h-5.5" />
        ) : (
          ""
        )}
        <Button
          onClick={toggleSidebar}
          aria-label="Toggle Sidebar"
          className="flex cursor-pointer items-center justify-center"
        >
          {state === "collapsed" ? (
            <IconLayoutSidebarLeftExpand stroke={1.5} size={24} />
          ) : (
            <IconLayoutSidebarLeftCollapse stroke={1.5} size={24} />
          )}
        </Button>
      </div>
      {/* Dark mode toggle  */}
      <Button
        onClick={toggleTheme}
        aria-label="Toggle theme"
        className="relative flex items-center justify-center cursor-pointer"
      >
        <IconSun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" stroke={1.5} size={24}/>
        <IconMoon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" stroke={1.5} size={24}/>
      </Button>
    </nav>
  )
}
