import { Link, useRouterState } from "@tanstack/react-router"

import { cn } from "@carsxe/design-system/lib/utils"

import { componentDocs } from "@/docs/components"

const gettingStarted = [
  {
    to: "/docs",
    label: "Installation",
    match: (path: string) => path === "/docs" || path === "/docs/",
  },
  {
    to: "/docs/theming",
    label: "Theming",
    match: (path: string) => path === "/docs/theming",
  },
] as const

const resources = [
  {
    to: "/docs/changelog",
    label: "Changelog",
    match: (path: string) => path === "/docs/changelog",
  },
  {
    to: "/docs/brand",
    label: "Brand assets",
    match: (path: string) => path === "/docs/brand",
  },
  {
    to: "/docs/skills",
    label: "Skills",
    match: (path: string) => path.startsWith("/docs/skills"),
  },
] as const

function NavLink({
  to,
  active,
  children,
}: {
  to: string
  active: boolean
  children: string
}) {
  return (
    <Link
      to={to}
      className={cn(
        "block px-2 py-1 text-sm",
        active
          ? "font-medium text-foreground"
          : "text-muted-foreground hover:text-foreground"
      )}
    >
      {children}
    </Link>
  )
}

export function DocsSidebar() {
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  })

  return (
    <aside className="sticky top-14 hidden h-[calc(100vh-3.5rem)] w-56 shrink-0 overflow-y-auto border-r border-border py-6 md:block">
      <nav className="flex flex-col gap-6">
        <div>
          <p className="px-2 pb-2 text-xs font-medium text-muted-foreground">
            Get started
          </p>
          <div className="flex flex-col">
            {gettingStarted.map((item) => (
              <NavLink key={item.to} to={item.to} active={item.match(pathname)}>
                {item.label}
              </NavLink>
            ))}
          </div>
        </div>
        <div>
          <p className="px-2 pb-2 text-xs font-medium text-muted-foreground">
            Resources
          </p>
          <div className="flex flex-col">
            {resources.map((item) => (
              <NavLink key={item.to} to={item.to} active={item.match(pathname)}>
                {item.label}
              </NavLink>
            ))}
          </div>
        </div>
        <div>
          <p className="px-2 pb-2 text-xs font-medium text-muted-foreground">
            Components
          </p>
          <div className="flex flex-col">
            {componentDocs.map((doc) => {
              const href = `/docs/components/${doc.slug}`
              return (
                <Link
                  key={doc.slug}
                  to="/docs/components/$slug"
                  params={{ slug: doc.slug }}
                  className={cn(
                    "block px-2 py-1 text-sm",
                    pathname === href
                      ? "font-medium text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {doc.title}
                </Link>
              )
            })}
          </div>
        </div>
      </nav>
    </aside>
  )
}
