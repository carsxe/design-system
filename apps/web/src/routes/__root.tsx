import {
  HeadContent,
  Outlet,
  Scripts,
  createRootRoute,
} from "@tanstack/react-router"
import { ThemeProvider } from "next-themes"

import { Toaster } from "@carsxe/design-system/components/sonner"
import { TooltipProvider } from "@carsxe/design-system/components/tooltip"

import { SiteHeader } from "@/components/site-header"
import { SITE_DESCRIPTION, SITE_NAME, seo } from "@/lib/seo"

import appCss from "@carsxe/design-system/globals.css?url"
import docsCss from "@/styles/docs.css?url"

const defaults = seo({
  title: SITE_NAME,
  description: SITE_DESCRIPTION,
  path: "/",
  suffix: false,
  eyebrow: "Design system",
})

export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        charSet: "utf-8",
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
      {
        name: "theme-color",
        content: "#065774",
      },
      ...defaults.meta,
    ],
    links: [
      {
        rel: "icon",
        type: "image/png",
        sizes: "32x32",
        href: "/favicon-32.png",
      },
      {
        rel: "icon",
        type: "image/png",
        sizes: "192x192",
        href: "/favicon-192.png",
      },
      {
        rel: "apple-touch-icon",
        href: "/favicon-192.png",
      },
      {
        rel: "stylesheet",
        href: appCss,
      },
      {
        rel: "stylesheet",
        href: docsCss,
      },
    ],
  }),
  notFoundComponent: () => (
    <main className="mx-auto max-w-6xl px-6 py-16">
      <h1 className="font-heading text-3xl font-medium">404</h1>
      <p className="mt-2 text-muted-foreground">
        The requested page could not be found.
      </p>
    </main>
  ),
  component: RootComponent,
  shellComponent: RootDocument,
})

function RootComponent() {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <TooltipProvider>
        <SiteHeader />
        <Outlet />
        <Toaster />
      </TooltipProvider>
    </ThemeProvider>
  )
}

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body className="min-h-screen bg-background text-foreground antialiased">
        {children}
        <Scripts />
      </body>
    </html>
  )
}
