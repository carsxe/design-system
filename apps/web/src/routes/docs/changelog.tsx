import { createFileRoute } from "@tanstack/react-router"
import { ArrowUpRightIcon } from "lucide-react"

import { DocsPageHeader } from "@/components/docs-page-header"
import {
  changelogEntries,
  changelogToMarkdown,
  formatChangelogDate,
  getChangeTypeLabel,
} from "@/docs/changelog"
import { seo } from "@/lib/seo"

export const Route = createFileRoute("/docs/changelog")({
  head: () =>
    seo({
      title: "Changelog",
      description:
        "A curated record of new components, design updates, and fixes in the CarsXE design system.",
      path: "/docs/changelog",
      eyebrow: "Changelog",
    }),
  component: Changelog,
})

const markdown = changelogToMarkdown(changelogEntries)

function Changelog() {
  return (
    <article className="flex max-w-3xl flex-col gap-10">
      <DocsPageHeader
        title="Changelog"
        description="A curated record of what changed in the CarsXE design system and what those changes mean for the teams using it."
        markdown={markdown}
      />

      <div className="relative before:absolute before:top-2 before:bottom-0 before:left-[5px] before:w-px before:bg-border sm:before:left-[8.75rem]">
        {changelogEntries.map((entry, index) => (
          <section
            key={entry.date}
            className="relative grid gap-4 pb-12 pl-8 last:pb-0 sm:grid-cols-[8rem_minmax(0,1fr)] sm:gap-8 sm:pl-0"
            aria-labelledby={`change-${entry.date}`}
          >
            <div className="sm:text-right">
              <time
                dateTime={entry.date}
                className="font-mono text-xs font-medium tracking-wide text-muted-foreground"
              >
                {formatChangelogDate(entry.date)}
              </time>
            </div>

            <span
              aria-hidden="true"
              className="absolute top-1.5 left-0 size-[11px] border-2 border-primary bg-background sm:left-[8.45rem]"
            />

            <div className="min-w-0">
              <h2
                id={`change-${entry.date}`}
                className="font-heading text-2xl font-semibold tracking-tight"
              >
                {entry.title}
              </h2>
              <p className="mt-2 leading-7 text-muted-foreground">
                {entry.summary}
              </p>

              <div className="mt-6 flex flex-col gap-6">
                {entry.groups.map((group) => (
                  <section key={group.type}>
                    <h3 className="mb-2">
                      <span className="inline-flex border border-border bg-muted px-2 py-1 font-mono text-[11px] font-medium tracking-wider text-foreground uppercase">
                        {getChangeTypeLabel(group.type)}
                      </span>
                    </h3>
                    <ul className="flex flex-col gap-2 text-sm leading-6 text-muted-foreground">
                      {group.items.map((item) => (
                        <li
                          key={item}
                          className="relative pl-4 before:absolute before:top-[0.65rem] before:left-0 before:size-1 before:bg-primary"
                        >
                          {item}
                        </li>
                      ))}
                    </ul>
                  </section>
                ))}
              </div>

              <div className="mt-6 flex flex-wrap gap-x-4 gap-y-2">
                {entry.sources.map((source) => (
                  <a
                    key={source.href}
                    href={source.href}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 font-mono text-xs font-medium text-primary underline-offset-4 hover:underline focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none"
                  >
                    {source.label}
                    <ArrowUpRightIcon className="size-3.5" aria-hidden="true" />
                  </a>
                ))}
              </div>
            </div>

            {index < changelogEntries.length - 1 ? (
              <div className="col-span-full ml-0 border-b border-border pt-2 sm:ml-[10rem]" />
            ) : null}
          </section>
        ))}
      </div>
    </article>
  )
}
