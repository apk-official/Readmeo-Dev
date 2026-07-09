import { cn } from "@/lib/utils"
import DarkModeBtn from "./dark-mode-btn"
import BreadCrumbs from "./bread-crumbs"
import readmeoLogo from "@/assets/READMEO LOGO.webp"
import DeployBtn from "./deploy-btn"
export default function TopNavbarEditor() {
  return (
    <nav
      className={cn(
        "flex h-14.5 w-full items-center justify-between border-b bg-background px-4 dark:border-b-neutral-700"
      )}
    >
      <div className="flex items-center justify-center gap-4">
        <img src={readmeoLogo} alt="readmeo logo" className="h-5.5" />
        <BreadCrumbs />
      </div>
      <div className="flex items-center justify-center gap-4">
        <DarkModeBtn />
        <DeployBtn/>
      </div>
    </nav>


  )
}
