import { DialogContent } from "@/components/ui/dialog"
import { IconBrandGithub, IconInfoHexagon } from "@tabler/icons-react"
import { Button } from "../ui/button"
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip"
import { toast } from "sonner"

export default function GithubReadme() {
  return (
    <DialogContent className="w-full max-w-lg gap-0 overflow-hidden bg-background p-0">
      {/* Header */}
      <div className="flex h-12 items-center gap-2 rounded-t-xl border-b bg-card px-4">
        <div className="flex items-center justify-center rounded-md border border-border p-1.5">
          <IconBrandGithub stroke={2} size={16} />
        </div>
        <div className="flex items-center justify-center gap-2">
          <p className="text-sm font-medium">GitHub Profile README.md</p>
          <Tooltip>
            <TooltipTrigger className="cursor-pointer"><IconInfoHexagon stroke={2} size={ 20} className="text-primary"/></TooltipTrigger>
            <TooltipContent>
              <p>Paste this into your GitHub profile README and watch it come to life.</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </div>

      {/* Body */}
      <div className="max-h-96 overflow-y-auto px-4 py-4">
        <p className="text-sm leading-relaxed text-muted-foreground">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat. Duis aute irure dolor in
          reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
          pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
          culpa qui officia deserunt mollit anim id est laborum.
        </p>
      </div>

      {/* Footer */}
      <div className="flex w-full items-center justify-end border-t bg-card px-4 py-3">
        <p className="text-sm text-muted-foreground">
          <Button className="border-bcard-foreground flex cursor-pointer items-center justify-center border bg-card text-card-foreground outline-none hover:bg-secondary" onClick={() => toast("Event has been created", {position: "top-center" })}>
            Copy ReadMe
          </Button>
        </p>
      </div>
    </DialogContent>
  )
}
