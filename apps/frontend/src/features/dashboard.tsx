import TopNavbar from "@/components/shared/top-navbar"
import { Outlet } from "react-router"

export default function Dashboard() {
  return <>
    <div className="flex h-full w-full flex-col overflow-hidden">
      <TopNavbar />
      <div className="flex-1 overflow-y-auto">
        <Outlet />
      </div>
    </div>
  </> 
}
