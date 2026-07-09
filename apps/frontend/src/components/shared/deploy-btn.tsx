import { Button } from "../ui/button"
import { IconCloudUpload } from "@tabler/icons-react"
export default function DeployBtn() {
  return (
    <Button className="flex cursor-pointer items-center justify-center gap-2">
      <IconCloudUpload stroke={2} size={20} />
      Deploy
    </Button>
  )
}
