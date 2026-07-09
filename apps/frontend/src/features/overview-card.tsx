import GithubReadme from "@/components/shared/github-readme"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogTrigger } from "@/components/ui/dialog"
import {
  IconBrowserCheck,
  IconExternalLink,
  IconFileTextSpark,
} from "@tabler/icons-react"
import { NavLink } from "react-router"
export default function OverviewCard() {
  return (
    <div className="flex w-full flex-col items-start justify-between gap-4 rounded-2xl bg-card px-6 py-5 lg:flex-row">
      {/* -----------------  */}
      {/* Overview Card  */}
      {/* -----------------  */}
      {/* --------------------  */}
      {/* Overview Card Preview Image and Published texts*/}
      {/* --------------------  */}
      <div className="item-center flex w-full flex-col justify-start gap-4 sm:flex-row">
        <div className="h-36 w-full rounded-xl bg-card-foreground sm:h-28 sm:w-36"></div>
        {/* --------------------  */}
        {/* OVerview Card Publish */}
        {/* --------------------  */}
        <div className="flex flex-col items-start gap-2">
          <p className="text-sm text-muted-foreground">Published</p>
          <a
            href="https://example.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center font-medium text-primary hover:underline"
          >
            username.readmeo.dev
            <IconExternalLink stroke={1} size={24} />
          </a>
          <div className="flex items-center justify-center gap-2">
            <Badge className="border border-input bg-card-foreground p-2 text-chart-3">
              <div className="h-2 w-2 rounded-full bg-chart-3"></div>Live
            </Badge>
            <p className="text-xs text-muted-foreground">
              Created: 02 July 2026
            </p>
          </div>
        </div>
      </div>
      {/* --------------------  */}
      {/* Overview Card Buttons*/}
      {/* --------------------  */}
      <div className="grid w-full grid-cols-2 gap-3 lg:flex lg:w-fit lg:flex-col">
        <Dialog>
          <DialogTrigger className="flex w-full cursor-pointer items-center justify-center gap-1 rounded-lg bg-primary px-3 py-2 text-sm whitespace-nowrap text-neutral-100 hover:bg-primary/80">
            <IconFileTextSpark stroke={1} size={20} />
            Show Readme
          </DialogTrigger>
          <GithubReadme />
        </Dialog>

        <NavLink
          to="/editor"
          className="flex w-full cursor-pointer items-center justify-center gap-1 rounded-lg bg-secondary px-3 py-2 text-sm whitespace-nowrap text-card-foreground hover:bg-secondary/80"
        >
          <IconBrowserCheck stroke={1} size={20} />
          Open Editor
        </NavLink>
      </div>
    </div>
  )
}
