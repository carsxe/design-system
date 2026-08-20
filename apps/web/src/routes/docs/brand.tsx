import { createFileRoute } from "@tanstack/react-router"
import { DownloadIcon } from "lucide-react"

import { Button } from "@carsxe/design-system/components/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@carsxe/design-system/components/card"

import { DocsPageHeader } from "@/components/docs-page-header"
import { seo } from "@/lib/seo"

export const Route = createFileRoute("/docs/brand")({
  head: () =>
    seo({
      title: "Brand assets",
      description:
        "Download CarsXE lockups for light and dark backgrounds. Use the matching pair, and do not recolor or add effects.",
      path: "/docs/brand",
      eyebrow: "Docs",
    }),
  component: Brand,
})

const lockups = [
  {
    title: "Horizontal",
    description: "Headers, nav, and inline use.",
    preview: "/brand/carsxe-horizontal.svg",
    png: "/brand/carsxe-horizontal.png",
    svg: "/brand/carsxe-horizontal.svg",
    onDark: false,
  },
  {
    title: "Horizontal on dark",
    description: "Dark headers and hero bands.",
    preview: "/brand/carsxe-horizontal-on-dark.svg",
    png: "/brand/carsxe-horizontal-on-dark.png",
    svg: "/brand/carsxe-horizontal-on-dark.svg",
    onDark: true,
  },
  {
    title: "Vertical",
    description: "Splash screens and empty states.",
    preview: "/brand/carsxe-vertical.svg",
    png: "/brand/carsxe-vertical.png",
    svg: "/brand/carsxe-vertical.svg",
    onDark: false,
  },
  {
    title: "Vertical on dark",
    description: "Splash screens on dark surfaces.",
    preview: "/brand/carsxe-vertical-on-dark.svg",
    png: "/brand/carsxe-vertical-on-dark.png",
    svg: "/brand/carsxe-vertical-on-dark.svg",
    onDark: true,
  },
] as const

const sources = [
  {
    label: "Horizontal PSD",
    href: "/brand/carsxe-horizontal.psd",
  },
  {
    label: "Horizontal on dark PSD",
    href: "/brand/carsxe-horizontal-on-dark.psd",
  },
  {
    label: "Vertical PSD",
    href: "/brand/carsxe-vertical.psd",
  },
  {
    label: "Vertical on dark PSD",
    href: "/brand/carsxe-vertical-on-dark.psd",
  },
] as const

const markdown = `# Brand assets

Download CarsXE lockups for light and dark backgrounds. Use the matching pair, and do not recolor or add effects.

## Usage

- Horizontal lockups for headers, nav, and inline use.
- Vertical lockups for splash screens and empty states.
- Use the light pair on light surfaces and the on-dark pair on dark surfaces.
- Do not recolor, outline, rotate, or add shadows or effects.

## Download all

[carsxe-brand-assets.zip](/brand/carsxe-brand-assets.zip)

## Lockups

- Horizontal — PNG + SVG
- Horizontal on dark — PNG + SVG
- Vertical — PNG + SVG
- Vertical on dark — PNG + SVG

## Source files

- [carsxe-horizontal.psd](/brand/carsxe-horizontal.psd)
- [carsxe-horizontal-on-dark.psd](/brand/carsxe-horizontal-on-dark.psd)
- [carsxe-vertical.psd](/brand/carsxe-vertical.psd)
- [carsxe-vertical-on-dark.psd](/brand/carsxe-vertical-on-dark.psd)
`

function Brand() {
  return (
    <article className="flex max-w-2xl flex-col gap-8">
      <DocsPageHeader
        title="Brand assets"
        description="Download CarsXE lockups for light and dark backgrounds. Use the matching pair, and do not recolor or add effects."
        markdown={markdown}
      />

      <section className="flex flex-col gap-3">
        <h2 className="font-heading text-2xl font-medium">Usage</h2>
        <ul className="list-disc space-y-1 pl-5 text-sm text-muted-foreground">
          <li>Horizontal lockups for headers, nav, and inline use.</li>
          <li>Vertical lockups for splash screens and empty states.</li>
          <li>
            Use the light pair on light surfaces and the on-dark pair on dark
            surfaces.
          </li>
          <li>Do not recolor, outline, rotate, or add shadows or effects.</li>
        </ul>
        <div>
          <Button
            nativeButton={false}
            render={<a href="/brand/carsxe-brand-assets.zip" download />}
          >
            <DownloadIcon />
            Download all
          </Button>
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="font-heading text-2xl font-medium">Lockups</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {lockups.map((lockup) => (
            <Card key={lockup.svg} size="sm">
              <CardHeader>
                <CardTitle>{lockup.title}</CardTitle>
                <CardDescription>{lockup.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div
                  className={
                    lockup.onDark
                      ? "flex min-h-28 items-center justify-center bg-black px-6 py-8"
                      : "flex min-h-28 items-center justify-center bg-white px-6 py-8 ring-1 ring-border"
                  }
                >
                  <img
                    src={lockup.preview}
                    alt={lockup.title}
                    className="max-h-20 w-full object-contain"
                  />
                </div>
              </CardContent>
              <CardFooter className="gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  nativeButton={false}
                  render={<a href={lockup.png} download />}
                >
                  PNG
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  nativeButton={false}
                  render={<a href={lockup.svg} download />}
                >
                  SVG
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="font-heading text-2xl font-medium">Source files</h2>
        <ul className="flex flex-col text-sm text-muted-foreground">
          {sources.map((file) => (
            <li key={file.href}>
              <a
                href={file.href}
                download
                className="hover:text-foreground hover:underline"
              >
                {file.label}
              </a>
            </li>
          ))}
        </ul>
      </section>
    </article>
  )
}
