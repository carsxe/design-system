import { getSingletonHighlighter, type BundledLanguage } from "shiki"

const langs = [
  "tsx",
  "typescript",
  "javascript",
  "bash",
  "html",
  "css",
  "markdown",
] as const satisfies BundledLanguage[]

const langAlias: Record<string, (typeof langs)[number]> = {
  ts: "typescript",
  js: "javascript",
  shell: "bash",
  sh: "bash",
  md: "markdown",
}

function isLang(value: string): value is (typeof langs)[number] {
  return (langs as readonly string[]).includes(value)
}

export async function highlightCode(code: string, lang = "tsx") {
  const mapped = langAlias[lang] ?? lang
  if (!isLang(mapped)) {
    return null
  }

  const highlighter = await getSingletonHighlighter({
    themes: ["github-light", "github-dark"],
    langs: [...langs],
  })

  return highlighter.codeToHtml(code, {
    lang: mapped,
    themes: {
      light: "github-light",
      dark: "github-dark",
    },
    defaultColor: false,
  })
}
