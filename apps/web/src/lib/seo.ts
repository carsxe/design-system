import { SITE_URL } from "@/lib/site"

export const SITE_NAME = "CarsXE Design System"
export const SITE_DESCRIPTION =
  "Import themed shadcn components from @carsxe/design-system. Do not copy them into your app."

const OG_WIDTH = "1200"
const OG_HEIGHT = "630"

export type SeoInput = {
  title: string
  description: string
  path?: string
  eyebrow?: string
  suffix?: boolean
}

function absoluteUrl(path: string) {
  if (path === "/") {
    return SITE_URL
  }

  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`
}

function ogImageUrl(title: string, eyebrow?: string) {
  const url = new URL("/api/og", SITE_URL)
  url.searchParams.set("title", title)
  if (eyebrow) {
    url.searchParams.set("eyebrow", eyebrow)
  }
  return url.toString()
}

export function seo({
  title,
  description,
  path = "/",
  eyebrow,
  suffix = true,
}: SeoInput) {
  const fullTitle =
    suffix && title !== SITE_NAME ? `${title} — ${SITE_NAME}` : title
  const url = absoluteUrl(path)
  const image = ogImageUrl(title, eyebrow)
  const imageAlt = eyebrow ? `${eyebrow}: ${title}` : title

  return {
    meta: [
      { title: fullTitle },
      { name: "description", content: description },
      { property: "og:title", content: fullTitle },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: url },
      { property: "og:site_name", content: SITE_NAME },
      { property: "og:image", content: image },
      { property: "og:image:width", content: OG_WIDTH },
      { property: "og:image:height", content: OG_HEIGHT },
      { property: "og:image:alt", content: imageAlt },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: fullTitle },
      { name: "twitter:description", content: description },
      { name: "twitter:image", content: image },
    ],
    links: [{ rel: "canonical", href: url }],
  }
}
