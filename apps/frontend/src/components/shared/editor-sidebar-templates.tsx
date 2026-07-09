export default function EditorSidebarTemplates() {
  return (
    <div className="bg-editor-sidebar h-full w-64 shrink-0 border-l border-border px-4 py-3">
      <p className="pb-5 text-sm font-medium text-muted-foreground">
        Templates
      </p>
      <div className="flex flex-col items-center justify-center gap-2 pb-5">
        <div className="h-32 w-full bg-foreground rounded-xl border-3 border-primary"></div>
        <p className="text-sm text-muted-foreground font-medium">Minimal</p>
      </div>
    </div>
  )
}
