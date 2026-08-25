import { Link } from "@tanstack/react-router"

import { Logo } from "@/components/logo"
import { ThemeToggle } from "@/components/theme-toggle"
import { NPM_URL, STORYBOOK_URL } from "@/lib/site"

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link to="/" className="flex items-center">
          <Logo />
        </Link>
        <nav className="flex items-center gap-3 text-sm sm:gap-4">
          <Link
            to="/docs"
            className="text-muted-foreground hover:text-foreground"
          >
            Docs
          </Link>
          <Link
            to="/docs/changelog"
            className="text-muted-foreground hover:text-foreground"
          >
            Changelog
          </Link>
          <a
            href={STORYBOOK_URL}
            className="hidden text-muted-foreground hover:text-foreground sm:inline"
            target="_blank"
            rel="noreferrer"
          >
            Storybook
          </a>
          <a
            href={NPM_URL}
            className="hidden text-muted-foreground hover:text-foreground sm:inline"
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
