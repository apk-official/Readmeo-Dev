import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
} from "@/components/ui/sidebar"
import {
  IconHelpHexagon,
  IconHome,
  IconSettings,
  IconLogout,
} from "@tabler/icons-react"
import logoLight from "@/assets/LogoHorizontalLight.webp"
import logoDark from "@/assets/LogoHorizontalDark.webp"
import { NavLink } from "react-router"
import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
const navItems = [
  {
    to: "/",
    icon: <IconHome stroke={1.5} size={20} />,
    label: "Home",
  },
  {
    to: "/settings",
    icon: <IconSettings stroke={1.5} size={20} />,
    label: "Settings",
  },
  {
    to: "/support",
    icon: <IconHelpHexagon stroke={1.5} size={20} />,
    label: "Support",
  },
  {
    to: "/login",
    icon: <IconLogout stroke={1.5} size={20} />,
    label: "Logout",
  },
]

const navLinkBase =
  "w-full flex items-center justify-start gap-2 rounded-lg px-3 py-2.5 border-l-3 mb-2"

export default function AppSidebar() {
  return (
    <Sidebar className="border-none text-sm **:data-[sidebar=sidebar]:bg-background">
      <SidebarHeader className="flex flex-row h-14.5 w-full items-center justify-start border-b dark:border-b-neutral-700">
        
          <img
            src={logoDark}
            alt="Readmeo Logo"
            className="hidden w-32 dark:block"
          />
          <img
            src={logoLight}
            alt="Readmeo Logo"
            className="block w-32 dark:hidden"
          />
     
        
      </SidebarHeader>
      <SidebarContent className="flex items-center p-3">
        <SidebarGroup />
        {navItems.map((navItem) => (
          <NavLink
            key={navItem.label}
            to={navItem.to}
            className={({ isActive }) =>
              cn(
                navLinkBase,
                isActive
                  ? "border-l-primary bg-primary/10 text-primary"
                  : "border-l-transparent text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              )
            }
          >
            {navItem.icon}
            {navItem.label}
          </NavLink>
        ))}
        <SidebarGroup />
      </SidebarContent>
      <SidebarFooter className="mb-3 flex flex-row items-center justify-start gap-4">
        <Avatar>
          <AvatarImage src="https://github.com/shadcn.png" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <p>Abhinav</p>
          <p className="text-xs text-muted-foreground">Free Plan</p>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
