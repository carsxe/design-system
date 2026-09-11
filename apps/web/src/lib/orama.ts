import { create, insertMultiple, search } from "@orama/orama"

import {
  searchCatalog,
  type SearchEntry,
  type SearchGroup,
} from "@/lib/search-index"

const schema = {
  title: "string",
  description: "string",
  href: "string",
  group: "enum",
  keywords: "string",
} as const

const db = create({ schema })

insertMultiple(
  db,
  searchCatalog.map((entry) => ({
    id: entry.id,
    title: entry.title,
    description: entry.description,
    href: entry.href,
    group: entry.group,
    keywords: entry.keywords,
  }))
)

function unwrapSync<T>(value: T | Promise<T>, label: string): T {
  if (value instanceof Promise) {
    throw new Error(`${label} was async`)
  }

  return value
}

function isSubsequence(query: string, text: string) {
  let index = 0

  for (const character of text) {
    if (character === query[index]) {
      index += 1
    }

    if (index === query.length) {
      return true
    }
  }

  return false
}

function matchesFuzzy(entry: SearchEntry, query: string) {
  const needle = query.toLowerCase()
  const title = entry.title.toLowerCase()
  const slug = entry.href.split("/").filter(Boolean).at(-1) ?? ""
  const keywords = entry.keywords.toLowerCase()
  const description = entry.description.toLowerCase()

  return (
    title.includes(needle) ||
    slug.includes(needle) ||
    keywords.includes(needle) ||
    description.includes(needle) ||
    isSubsequence(needle, title) ||
    isSubsequence(needle, slug)
  )
}

function toSearchEntry(hit: {
  id: string
  document: {
    title: string
    description: string
    href: string
    group: string | number
    keywords: string
  }
}): SearchEntry {
  return {
    id: hit.id,
    title: hit.document.title,
    description: hit.document.description,
    href: hit.document.href,
    group: hit.document.group as SearchGroup,
    keywords: hit.document.keywords,
  }
}

export function searchDocs(term: string): SearchEntry[] {
  const query = term.trim()

  if (!query) {
    return searchCatalog
  }

  const results = unwrapSync(
    search(db, {
      term: query,
      properties: ["title", "description", "keywords"],
      boost: {
        title: 2,
        keywords: 1.5,
        description: 1,
      },
      tolerance: 1,
      limit: 20,
    }),
    "Orama search"
  )

  const oramaHits = results.hits
    .map(toSearchEntry)
    .filter((entry) => matchesFuzzy(entry, query))
  const seen = new Set(oramaHits.map((entry) => entry.id))
  const extras = searchCatalog
    .filter((entry) => !seen.has(entry.id) && matchesFuzzy(entry, query))
    .sort((left, right) => fuzzyRank(left, query) - fuzzyRank(right, query))

  return [...oramaHits, ...extras].slice(0, 20)
}

function fuzzyRank(entry: SearchEntry, query: string) {
  const needle = query.toLowerCase()
  const title = entry.title.toLowerCase()
  const slug = entry.href.split("/").filter(Boolean).at(-1) ?? ""

  if (title === needle || slug === needle) {
    return 0
  }

  if (title.startsWith(needle) || slug.startsWith(needle)) {
    return 1
  }

  if (title.includes(needle) || slug.includes(needle)) {
    return 2
  }

  return 3 + title.length
}
