import EditorSidebar from "@/components/shared/editor-sidebar";
import EditorSidebarTemplates from "@/components/shared/editor-sidebar-templates";
import Workspace from "@/components/shared/workspace";

export default function EditorWorkspace() {
  return (
      <div className="flex h-full w-full flex-row">
          <EditorSidebar />
          <Workspace />
          <EditorSidebarTemplates/>
    </div>
  )
}
