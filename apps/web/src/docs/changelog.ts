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
    date: "2026-08-31",
    title: "Timeline for ordered events",
    summary:
      "A new Timeline component lays events out along a rail. Content, the opposite side, the marker, and the connector are render props receiving the item and its index, so an event can be a line of text or a full card.",
    groups: [
      {
        type: "added",
        items: [
          "Timeline with vertical and horizontal orientation, and align of start, end, or alternate so the rail can centre itself between sides.",
          "content, opposite, marker, and connector render props, a getKey override defaulting to the item id, and data-slot parts for the event, opposite side, separator, marker, connector, and content.",
          "A Timeline docs page and Storybook stories.",
        ],
      },
    ],
    sources: [],
  },
  {
    date: "2026-08-31",
    title: "Rating group gains clearing, icons, and orientation",
    summary:
      "The rating group can now be cleared, use any icon pair, and stack vertically. Existing usage is unchanged: every new prop is opt-in.",
    groups: [
      {
        type: "added",
        items: [
          "allowClear: picking the current value again, or pressing Delete or Backspace, resets the rating to zero.",
          "icon and emptyIcon props so ratings can use hearts, thumbs, or any other icon for the filled and empty layers, with half values still clipping correctly.",
          "A vertical orientation, reported through aria-orientation and data-orientation, plus a data-fill attribute of empty, partial, or full on every item.",
          "A Rating group docs page and Storybook stories.",
        ],
      },
    ],
    sources: [],
  },
  {
    date: "2026-08-31",
    title: "Knob dial for numeric input",
    summary:
      "A new Knob component enters a number by dragging around a 270° dial. It is fully keyboard operable, prints a templatable value in the centre, and exposes its arc colours as CSS variables.",
    groups: [
      {
        type: "added",
        items: [
          "Knob with pointer dragging, arrow-key stepping, Page Up and Page Down for ten steps, and Home and End for the ends of the range.",
          "Configurable size, stroke width, min, max, and step; a children render prop that replaces the printed value and feeds aria-valuetext; valueColor, rangeColor, and textColor overrides; read-only and disabled states; and a name prop for form submission.",
        ],
      },
    ],
    sources: [],
  },
  {
    date: "2026-08-31",
    title: "Autocomplete with debounced suggestions",
    summary:
      "A new Autocomplete component suggests options as the user types. The delay prop debounces querying so a burst of keystrokes makes a single request, and passing onQueryChange hands filtering to the caller for server-backed search.",
    groups: [
      {
        type: "added",
        items: [
          "Autocomplete with a debounced delay prop, a minLength gate, and a loading state that renders a spinner in the input and a status row in the popup.",
          "Async mode: providing onQueryChange disables built-in filtering so the items you supply render verbatim.",
          "Dropdown trigger and clear button, multi-select chips, grouped and object suggestions, forceSelection, and inline completion modes.",
        ],
      },
    ],
    sources: [],
  },
  {
    date: "2026-08-31",
    title: "Marquee pauses for manual scrolling",
    summary:
      "Hovering or focusing the marquee now stops the loop and lets the user scroll through the items themselves; the marquee resumes from wherever they left it.",
    groups: [
      {
        type: "added",
        items: [
          "Manual scrolling while the marquee is paused: wheel, trackpad, and touch all work, vertical wheel input is mapped onto the strip, and the loop wraps in both directions so there is never an edge.",
          "A dedicated Marquee docs page with reversed and always-running examples.",
        ],
      },
      {
        type: "fixed",
        items: [
          "pauseOnHover previously had no effect because it targeted CSS animation state while the motion was JS-driven; hovering now actually pauses the marquee.",
          "With reduced motion enabled the marquee stays static but remains manually scrollable instead of being frozen.",
        ],
      },
    ],
    sources: [],
  },
  {
    date: "2026-08-31",
    title: "Calendar heatmap",
    summary:
      "A GitHub-style calendar heatmap shows a value per day so quiet stretches and spikes are visible at a glance.",
    groups: [
      {
        type: "added",
        items: [
          "A Heatmap component with weeks as columns, month and weekday labels, keyboard-accessible cells with tooltips, and a Less-to-More legend with the formatted maximum.",
          "Five heatmap color tokens per theme, tuned so intensity steps stay distinguishable on light and dark surfaces and overridable through the colors prop.",
        ],
      },
    ],
    sources: [],
  },
  {
    date: "2026-08-26",
    title: "Shiki code blocks with theme choice",
    summary:
      "Code examples now use the shared design-system viewer with opt-in syntax theme picking and built-in copying.",
    groups: [
      {
        type: "added",
        items: [
          "A public Code Block component with every bundled Shiki theme, all bundled languages, system-aware defaults, and accessible copy feedback.",
          "An opt-in showThemePicker control so viewers can change the syntax theme in the UI; themes stay code-only by default.",
        ],
      },
      {
        type: "changed",
        items: [
          "Documentation code examples now use the exported Code Block instead of a private GitHub-theme-only renderer.",
        ],
      },
    ],
    sources: [],
  },
  {
    date: "2026-08-26",
    title: "Primary hover colors restored",
    summary:
      "Primary hover states once again use the established CarsXE theme colors from the 0.0.4 release.",
    groups: [
      {
        type: "fixed",
        items: [
          "Restored primary-hover to #387990 in light mode and #4DCCEE in dark mode.",
        ],
      },
    ],
    sources: [],
  },
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
          "Complete chart-family recipes plus Sankey, force-directed, treemap, and sunburst visualizations.",
          "A composable, pressure-aware Signature Pad API with history, form submission, and export controls.",
          "A parity check that keeps the shipped component catalog aligned with the supported shadcn set.",
        ],
      },
      {
        type: "changed",
        items: [
          "Existing primitives and examples were aligned with the expanded APIs, and hooks became available through package exports.",
          "Sidebar examples and interaction coverage now exercise desktop collapse, mobile sheets, controlled state, right-side placement, and RTL layouts.",
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
