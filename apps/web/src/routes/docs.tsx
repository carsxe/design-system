import { Outlet, createFileRoute } from "@tanstack/react-router"

import { DocsSidebar } from "@/components/docs-sidebar"

export const Route = createFileRoute("/docs")({
  component: DocsLayout,
})

function DocsLayout() {
  return (
    <div className="mx-auto flex w-full max-w-6xl">
      <DocsSidebar />
      <div className="min-w-0 flex-1 px-6 py-10">
        <Outlet />
      </div>
    </div>
  )
}
