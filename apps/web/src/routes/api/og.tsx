import { createFileRoute } from "@tanstack/react-router"

import { createOgImage } from "@/lib/og"
import { SITE_NAME } from "@/lib/seo"

export const Route = createFileRoute("/api/og")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const { searchParams } = new URL(request.url)
        const title = searchParams.get("title")?.trim() || SITE_NAME
        const eyebrow = searchParams.get("eyebrow")?.trim() || undefined

        return createOgImage(title, eyebrow)
      },
    },
  },
})
