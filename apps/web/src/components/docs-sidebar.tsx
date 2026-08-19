import { Link, useRouterState } from "@tanstack/react-router"

import { cn } from "@carsxe/design-system/lib/utils"

const items = [
  {
    to: "/docs",
    label: "Getting started",
    match: (path: string) => path === "/docs" || path === "/docs/",
  },
  {
    to: "/docs/theming",
    label: "Theming",
    match: (path: string) => path === "/docs/theming",
  },
  {
    to: "/docs/components",
    label: "Components",
    match: (path: string) => path === "/docs/components",
  },
  {
    to: "/docs/skills",
    label: "Skills",
    match: (path: string) => path.startsWith("/docs/skills"),
  },
] as const

export function DocsSidebar() {
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  })

  return (
    <aside className="sticky top-14 hidden h-[calc(100vh-3.5rem)] w-56 shrink-0 overflow-y-auto border-r border-border py-8 md:block">
      <p className="px-3 pb-3 text-xs font-medium tracking-wide text-muted-foreground uppercase">
        Docs
      </p>
      <nav className="flex flex-col">
        {items.map((item) => {
          const active = item.match(pathname)
          return (
            <Link
              key={item.to}
              to={item.to}
              className={cn(
                "border-l-2 px-3 py-1.5 text-sm",
                active
                  ? "border-primary font-medium text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              )}
            >
              {item.label}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
