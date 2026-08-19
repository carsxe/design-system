import { Outlet, createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/docs/skills")({
  component: SkillsLayout,
})

function SkillsLayout() {
  return <Outlet />
}
