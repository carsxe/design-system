import { Link } from "@tanstack/react-router"

import { Logo } from "@/components/logo"
import { ThemeToggle } from "@/components/theme-toggle"
import { NPM_URL, STORYBOOK_URL } from "@/lib/site"

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-6">
        <Link to="/" className="flex items-center gap-2 text-sm font-medium">
          <Logo />
          <span>Carsxe</span>
        </Link>
        <nav className="flex items-center gap-4 text-sm">
          <Link
            to="/docs"
            className="text-muted-foreground hover:text-foreground"
          >
            Docs
          </Link>
          <a
            href={STORYBOOK_URL}
            className="text-muted-foreground hover:text-foreground"
            target="_blank"
            rel="noreferrer"
          >
            Storybook
          </a>
          <a
            href={NPM_URL}
            className="text-muted-foreground hover:text-foreground"
            target="_blank"
            rel="noreferrer"
          >
            npm
          </a>
          <ThemeToggle />
        </nav>
      </div>
    </header>
  )
}
