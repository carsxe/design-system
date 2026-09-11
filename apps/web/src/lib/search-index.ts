import { componentDocs } from "@/docs/components"
import { listSkills } from "@/lib/skills"

export const SEARCH_GROUPS = ["Pages", "Components", "Skills"] as const

export type SearchGroup = (typeof SEARCH_GROUPS)[number]

export type SearchEntry = {
  id: string
  title: string
  description: string
  href: string
  group: SearchGroup
  keywords: string
}

const pages: SearchEntry[] = [
  {
    id: "page:installation",
    title: "Installation",
    description:
      "Install @carsxe/design-system, load the CSS, and import a component.",
    href: "/docs",
    group: "Pages",
    keywords: "install setup getting started npm bun",
  },
  {
    id: "page:theming",
    title: "Theming",
    description:
      "Tokens, fonts, and dark mode live in the package CSS. Customize with CSS variables.",
    href: "/docs/theming",
    group: "Pages",
    keywords: "theme tokens css variables dark mode fonts",
  },
  {
    id: "page:changelog",
    title: "Changelog",
    description:
      "A curated record of new components, design updates, and fixes.",
    href: "/docs/changelog",
    group: "Pages",
    keywords: "releases updates history",
  },
  {
    id: "page:brand",
    title: "Brand assets",
    description: "Download CarsXE lockups for light and dark backgrounds.",
    href: "/docs/brand",
    group: "Pages",
    keywords: "logo lockup download brand",
  },
  {
    id: "page:skills",
    title: "Skills",
    description: "Copy-pastable agent skills from packages/skills.",
    href: "/docs/skills",
    group: "Pages",
    keywords: "agent cursor skill catalog",
  },
]

const components: SearchEntry[] = componentDocs.map((doc) => ({
  id: `component:${doc.slug}`,
  title: doc.title,
  description: doc.description,
  href: `/docs/components/${doc.slug}`,
  group: "Components",
  keywords: [doc.slug, doc.importName, doc.importPath]
    .filter(Boolean)
    .join(" "),
}))

const skills: SearchEntry[] = listSkills().map((skill) => ({
  id: `skill:${skill.slug}`,
  title: skill.title,
  description: skill.description,
  href: `/docs/skills/${skill.slug}`,
  group: "Skills",
  keywords: skill.slug,
}))

export const searchCatalog: SearchEntry[] = [...pages, ...components, ...skills]

export function groupSearchHits(entries: SearchEntry[]) {
  return SEARCH_GROUPS.map((group) => ({
    group,
    items: entries.filter((entry) => entry.group === group),
  })).filter((section) => section.items.length > 0)
}
