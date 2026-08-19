import { createFileRoute, notFound } from "@tanstack/react-router"

import { ComponentDocPage } from "@/components/component-doc-page"
import { getComponentDoc } from "@/docs/components"

export const Route = createFileRoute("/docs/components/$slug")({
  component: ComponentDetail,
})

function ComponentDetail() {
  const { slug } = Route.useParams()
  const doc = getComponentDoc(slug)

  if (!doc) {
    throw notFound()
  }

  return <ComponentDocPage doc={doc} />
}
