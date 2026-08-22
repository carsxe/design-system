import { createFileRoute } from "@tanstack/react-router"

import { createOgImage } from "@/lib/og"
import { SITE_NAME } from "@/lib/seo"

const HEX_COLOR = /^#[0-9a-f]{6}$/i

export const Route = createFileRoute("/api/og")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const { searchParams } = new URL(request.url)
        const title = searchParams.get("title")?.trim() || SITE_NAME
        const eyebrow = searchParams.get("eyebrow")?.trim() || undefined
        const bgParam = searchParams.get("bg")?.trim()
        const background =
          bgParam && HEX_COLOR.test(bgParam) ? bgParam : undefined

        return createOgImage(title, eyebrow, background)
      },
    },
  },
})
