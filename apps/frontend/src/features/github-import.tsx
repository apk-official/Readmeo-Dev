import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { IconBrandGithub } from "@tabler/icons-react"

export default function GithubImport() {
  return (
    <section className="flex h-full w-full items-center justify-center p-5 text-foreground">
      <div className="flex flex-col items-start gap-2">
        {/* -------------------  */}
        {/* Top badge  */}
        {/* -------------------  */}
        <Badge className="border border-input bg-border text-muted-foreground px-2 py-3">
          <div className="h-2 w-2 rounded-full bg-primary"></div>README
          Generator
        </Badge>
        {/* -------------------  */}
        {/* Heading and Subtext  */}
        {/* -------------------  */}
        <h2 className="text-3xl font-bold">A README that actually <br />looks like you.</h2>
        <p className="max-w-120 text-muted-foreground text-sm">Connect your GitHub account & Readmeo generates polished README cards from your repos and profile + a hosted portfolio site.</p>
        {/* -------------------  */}
        {/* bottom chips  */}
        {/* -------------------  */}
        <div className="flex items-start justify-between gap-2">
          <Badge className="border border-input bg-border text-muted-foreground px-2 py-3">
          <div className="h-2 w-2 rounded-full bg-chart-2"></div>Pulls from GitHub
          </Badge>
          <Badge className="border border-input bg-border text-muted-foreground px-2 py-3">
          <div className="h-2 w-2 rounded-full bg-chart-4"></div>8 templates
          </Badge>
          <Badge className="border border-input bg-border text-muted-foreground px-2 py-3">
          <div className="h-2 w-2 rounded-full bg-chart-3"></div>Live in seconds
        </Badge>
        </div>
        {/* -------------------  */}
        {/* Button  */}
        {/* -------------------  */}
        <Button className="flex items-center justify-center gap-2 py-6 px-7 w-full mt-4 cursor-pointer rounded-2xl shadow-[0_8px_30px_-4px_rgba(202,21,81,0.45)] hover:shadow-[0_10px_36px_-4px_rgba(202,21,81,0.55)]"><IconBrandGithub stroke={2} /><p>Import from Github</p></Button>
      </div>
    </section>
  )
}
