export type ChangeType = "added" | "changed" | "fixed"

export type ChangeGroup = {
  type: ChangeType
  items: string[]
}

export type ChangelogSource = {
  label: string
  href: string
}

export type ChangelogEntry = {
  date: string
  title: string
  summary: string
  groups: ChangeGroup[]
  sources: ChangelogSource[]
}

export const changelogEntries = [
  {
    date: "2026-08-25",
    title: "A much larger component library",
    summary:
      "CarsXE apps can now reach for a substantially broader set of production-ready primitives and composition recipes without copying local UI code.",
    groups: [
      {
        type: "added",
        items: [
          "More than 40 shadcn-style components and composition recipes, including Calendar, Carousel, Chart, Combobox, Command, Drawer, Sidebar, and data-table patterns.",
          "Matching component documentation and Storybook coverage for the expanded library.",
          "A parity check that keeps the shipped component catalog aligned with the supported shadcn set.",
        ],
      },
      {
        type: "changed",
        items: [
          "Existing primitives and examples were aligned with the expanded APIs, and hooks became available through package exports.",
        ],
      },
    ],
    sources: [
      {
        label: "View pull request #2",
        href: "https://github.com/carsxe/design-system/pull/2",
      },
    ],
  },
  {
    date: "2026-08-24",
    title: "Sharper type and interaction details",
    summary:
      "Code and token references now use an on-brand monospace face, while primary hover states stay closer to the core CarsXE palette.",
    groups: [
      {
        type: "added",
        items: [
          "DM Mono for code blocks, design tokens, and other technical content across the package and docs.",
        ],
      },
      {
        type: "changed",
        items: [
          "The primary-hover token now uses #387990 in light and dark themes for more consistent interaction states.",
        ],
      },
    ],
    sources: [
      {
        label: "View changes",
        href: "https://github.com/carsxe/design-system/compare/b83165b...65b0599",
      },
    ],
  },
  {
    date: "2026-08-20",
    title: "Reliable installs and official brand assets",
    summary:
      "The published package became dependable in real consumer builds, and the docs gained downloadable CarsXE logo lockups.",
    groups: [
      {
        type: "fixed",
        items: [
          "Package exports now resolve to files that are actually present in the npm tarball.",
          "Tailwind source discovery, bundled shadcn CSS, and font assets now work from installed consumer projects.",
          "A packed-artifact verification script catches broken public entry points before publishing.",
        ],
      },
      {
        type: "added",
        items: [
          "Brand asset documentation with horizontal and vertical lockups for light and dark surfaces, plus downloadable source files.",
        ],
      },
    ],
    sources: [
      {
        label: "View changes",
        href: "https://github.com/carsxe/design-system/compare/984a8a8...254f508",
      },
    ],
  },
  {
    date: "2026-08-19",
    title: "The CarsXE design system launched",
    summary:
      "The first release established a shared package, documentation, and migration path for consistent CarsXE product interfaces.",
    groups: [
      {
        type: "added",
        items: [
          "The @carsxe/design-system package with themed core components, semantic CSS tokens, dark mode, and sharp corners.",
          "Per-component Storybook stories and docs with live previews, API references, syntax highlighting, and Copy page support.",
          "Copy-pastable agent skills for installing the package and migrating consumer apps away from local UI copies.",
          "Search and social metadata, generated Open Graph images, CarsXE favicons, and links to Storybook and npm.",
        ],
      },
      {
        type: "changed",
        items: [
          "Typography settled on DM Sans for headings and Manrope for UI, body copy, and inputs.",
        ],
      },
    ],
    sources: [
      {
        label: "View launch changes",
        href: "https://github.com/carsxe/design-system/compare/a5aa0f2...984a8a8",
      },
    ],
  },
] satisfies ChangelogEntry[]

const changeTypeLabels: Record<ChangeType, string> = {
  added: "Added",
  changed: "Changed",
  fixed: "Fixed",
}

export function changelogToMarkdown(entries: ChangelogEntry[]) {
  const sections = entries.map((entry) => {
    const groups = entry.groups
      .map(
        (group) =>
          `### ${changeTypeLabels[group.type]}\n\n${group.items
            .map((item) => `- ${item}`)
            .join("\n")}`
      )
      .join("\n\n")

    const sources = entry.sources
      .map((source) => `[${source.label}](${source.href})`)
      .join(" · ")

    return `## ${formatChangelogDate(entry.date)} — ${entry.title}\n\n${entry.summary}\n\n${groups}\n\n${sources}`
  })

  return `# Changelog\n\nA curated record of what changed in the CarsXE design system and what those changes mean for the teams using it.\n\n${sections.join("\n\n---\n\n")}\n`
}

export function formatChangelogDate(date: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${date}T00:00:00Z`))
}

export function getChangeTypeLabel(type: ChangeType) {
  return changeTypeLabels[type]
}
