import TopNavbarEditor from "@/components/shared/top-navbar-editor"
import EditorWorkspace from "./editor-workspace"

export default function EditorPage() {
  return (
    <div className="flex h-svh w-full flex-col items-start justify-start">
      <TopNavbarEditor />
      <EditorWorkspace/>
    </div>
  )
}
