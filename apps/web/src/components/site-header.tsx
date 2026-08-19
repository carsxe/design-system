import { Link } from "@tanstack/react-router"

const STORYBOOK_URL = "http://localhost:6006"

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
        <Link to="/" className="flex items-center gap-2 text-sm font-medium">
          <span className="size-5 bg-primary" aria-hidden />
          Carsxe
        </Link>
        <nav className="flex items-center gap-6 text-sm">
          <Link
            to="/docs"
            className="text-muted-foreground hover:text-foreground"
          >
            Docs
          </Link>
          <a
            href={STORYBOOK_URL}
            className="text-muted-foreground hover:text-foreground"
            rel="noreferrer"
          >
            Storybook
          </a>
        </nav>
      </div>
    </header>
  )
}
