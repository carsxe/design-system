import { createFileRoute, notFound } from "@tanstack/react-router"

import { ComponentDocPage } from "@/components/component-doc-page"
import { getComponentDoc } from "@/docs/components"
import { seo } from "@/lib/seo"

export const Route = createFileRoute("/docs/components/$slug")({
  head: ({ params }) => {
    const doc = getComponentDoc(params.slug)

    if (!doc) {
      return seo({
        title: "Component",
        description: "CarsXE design system component docs.",
        path: `/docs/components/${params.slug}`,
        eyebrow: "Component",
      })
    }

    return seo({
      title: doc.title,
      description: doc.description,
      path: `/docs/components/${doc.slug}`,
      eyebrow: "Component",
    })
  },
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
