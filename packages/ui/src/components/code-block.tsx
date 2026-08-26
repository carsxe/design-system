"use client"

import * as React from "react"
import type { BundledLanguage, BundledTheme } from "shiki"
import { bundledThemesInfo } from "shiki"
import {
  AlertCircleIcon,
  CheckIcon,
  CopyIcon,
  MoonIcon,
  SunIcon,
  SunMoonIcon,
} from "lucide-react"

import { cn } from "@carsxe/design-system/lib/utils"
import { Button } from "@carsxe/design-system/components/button"
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxGroup,
  ComboboxInput,
  ComboboxItem,
  ComboboxLabel,
  ComboboxList,
} from "@carsxe/design-system/components/combobox"

export type CodeBlockTheme = "system" | BundledTheme

export type CodeBlockThemeInfo = {
  id: BundledTheme
  label: string
  type: "light" | "dark"
}

export const CODE_BLOCK_THEMES = Object.freeze(
  bundledThemesInfo.map(({ id, displayName, type }): CodeBlockThemeInfo => ({
    id: id as BundledTheme,
    label: displayName,
    type,
  }))
)

type ThemeOption =
  { id: "system"; label: string; type: "system" } | CodeBlockThemeInfo

const SYSTEM_THEME: ThemeOption = {
  id: "system",
  label: "System",
  type: "system",
}
const THEME_OPTIONS: readonly ThemeOption[] = [
  SYSTEM_THEME,
  ...CODE_BLOCK_THEMES,
]
const LIGHT_THEMES = CODE_BLOCK_THEMES.filter((theme) => theme.type === "light")
const DARK_THEMES = CODE_BLOCK_THEMES.filter((theme) => theme.type === "dark")
const THEME_IDS = new Set<CodeBlockTheme>([
  "system",
  ...CODE_BLOCK_THEMES.map((theme) => theme.id),
])

export type CodeBlockProps = Omit<
  React.ComponentProps<"div">,
  "children" | "onCopy"
> & {
  code: string
  language?: BundledLanguage | "text"
  label?: React.ReactNode
  theme?: CodeBlockTheme
  defaultTheme?: CodeBlockTheme
  lightTheme?: BundledTheme
  darkTheme?: BundledTheme
  onThemeChange?: (theme: CodeBlockTheme) => void
  /** When true, viewers can search and pick a syntax theme. Off by default. */
  showThemePicker?: boolean
  showCopyButton?: boolean
  copyLabel?: string
  copiedLabel?: string
  copyErrorLabel?: string
  copiedDuration?: number
  onCopy?: (code: string) => void
  onCopyError?: (error: unknown) => void
  codeClassName?: string
}

type CopyState = "idle" | "copied" | "error"

function isCodeBlockTheme(value: unknown): value is CodeBlockTheme {
  return typeof value === "string" && THEME_IDS.has(value as CodeBlockTheme)
}

function getThemeOption(theme: CodeBlockTheme) {
  return THEME_OPTIONS.find((option) => option.id === theme) ?? SYSTEM_THEME
}

function ThemeIcon({ type }: { type: ThemeOption["type"] }) {
  if (type === "light") return <SunIcon />
  if (type === "dark") return <MoonIcon />
  return <SunMoonIcon />
}

async function renderHighlightedCode({
  code,
  language,
  theme,
  lightTheme,
  darkTheme,
}: {
  code: string
  language: BundledLanguage | "text"
  theme: CodeBlockTheme
  lightTheme: BundledTheme
  darkTheme: BundledTheme
}) {
  const { bundledLanguages, codeToHtml } = await import("shiki")
  const resolvedLanguage =
    language === "text" || language in bundledLanguages ? language : "text"

  if (theme === "system") {
    return codeToHtml(code, {
      lang: resolvedLanguage,
      themes: { light: lightTheme, dark: darkTheme },
      defaultColor: false,
    })
  }

  return codeToHtml(code, { lang: resolvedLanguage, theme })
}

function CodeBlock({
  code,
  language = "tsx",
  label,
  theme: controlledTheme,
  defaultTheme = "system",
  lightTheme = "github-light",
  darkTheme = "github-dark",
  onThemeChange,
  showThemePicker = false,
  showCopyButton = true,
  copyLabel = "Copy code",
  copiedLabel = "Copied",
  copyErrorLabel = "Copy failed",
  copiedDuration = 2000,
  onCopy,
  onCopyError,
  codeClassName,
  className,
  ...props
}: CodeBlockProps) {
  const [uncontrolledTheme, setUncontrolledTheme] = React.useState(() =>
    isCodeBlockTheme(defaultTheme) ? defaultTheme : "system"
  )
  const selectedTheme = isCodeBlockTheme(controlledTheme)
    ? controlledTheme
    : uncontrolledTheme
  const selectedOption = getThemeOption(selectedTheme)
  const [html, setHtml] = React.useState<string | null>(null)
  const [highlightError, setHighlightError] = React.useState(false)
  const [copyState, setCopyState] = React.useState<CopyState>("idle")
  const copyTimerRef = React.useRef<number | null>(null)

  React.useEffect(() => {
    let current = true
    setHighlightError(false)

    renderHighlightedCode({
      code,
      language,
      theme: selectedTheme,
      lightTheme,
      darkTheme,
    })
      .then((result) => {
        if (!current) return
        setHtml(result)
      })
      .catch(() => {
        if (!current) return
        setHtml(null)
        setHighlightError(true)
      })

    return () => {
      current = false
    }
  }, [code, darkTheme, language, lightTheme, selectedTheme])

  React.useEffect(
    () => () => {
      if (copyTimerRef.current !== null) {
        window.clearTimeout(copyTimerRef.current)
      }
    },
    []
  )

  function selectTheme(option: ThemeOption | null) {
    if (!option || !isCodeBlockTheme(option.id)) return
    if (controlledTheme === undefined) setUncontrolledTheme(option.id)
    onThemeChange?.(option.id)
  }

  async function copyCode() {
    try {
      if (!window.isSecureContext || !navigator.clipboard) {
        throw new Error("Clipboard access requires a secure context")
      }
      await navigator.clipboard.writeText(code)
      setCopyState("copied")
      onCopy?.(code)
    } catch (error) {
      setCopyState("error")
      onCopyError?.(error)
    }

    if (copyTimerRef.current !== null) {
      window.clearTimeout(copyTimerRef.current)
    }
    copyTimerRef.current = window.setTimeout(
      () => setCopyState("idle"),
      copiedDuration
    )
  }

  const copyStateLabel =
    copyState === "copied"
      ? copiedLabel
      : copyState === "error"
        ? copyErrorLabel
        : copyLabel

  return (
    <div
      data-slot="code-block"
      data-code-theme={selectedTheme}
      data-language={language}
      data-loading={html === null && !highlightError ? "true" : undefined}
      className={cn(
        "min-w-0 overflow-hidden border border-border bg-card",
        className
      )}
      {...props}
    >
      <div
        data-slot="code-block-toolbar"
        className="flex min-h-10 min-w-0 flex-wrap items-center gap-2 border-b border-border bg-muted/70 px-3 py-2"
      >
        <div className="mr-auto min-w-0 px-1 font-mono text-xs text-muted-foreground">
          {label ?? language}
        </div>
        {showThemePicker ? (
          <Combobox<ThemeOption>
            items={THEME_OPTIONS}
            value={selectedOption}
            onValueChange={selectTheme}
            itemToStringLabel={(option) => option.label}
            itemToStringValue={(option) => option.id}
          >
            <ComboboxInput
              aria-label="Code theme"
              placeholder="Search themes"
              className="h-7 w-44 max-w-full bg-card text-xs"
            />
            <ComboboxContent className="w-64">
              <ComboboxEmpty>No themes found.</ComboboxEmpty>
              <ComboboxList>
                <ComboboxGroup>
                  <ComboboxLabel>Automatic</ComboboxLabel>
                  <ComboboxItem value={SYSTEM_THEME}>
                    <ThemeIcon type="system" />
                    System
                  </ComboboxItem>
                </ComboboxGroup>
                <ComboboxGroup>
                  <ComboboxLabel>Light themes</ComboboxLabel>
                  {LIGHT_THEMES.map((option) => (
                    <ComboboxItem key={option.id} value={option}>
                      <ThemeIcon type="light" />
                      {option.label}
                    </ComboboxItem>
                  ))}
                </ComboboxGroup>
                <ComboboxGroup>
                  <ComboboxLabel>Dark themes</ComboboxLabel>
                  {DARK_THEMES.map((option) => (
                    <ComboboxItem key={option.id} value={option}>
                      <ThemeIcon type="dark" />
                      {option.label}
                    </ComboboxItem>
                  ))}
                </ComboboxGroup>
              </ComboboxList>
            </ComboboxContent>
          </Combobox>
        ) : null}
        {showCopyButton ? (
          <Button
            type="button"
            size="sm"
            variant="ghost"
            aria-label={copyStateLabel}
            onClick={copyCode}
            className="h-7 shrink-0 px-2 text-xs"
          >
            {copyState === "copied" ? (
              <CheckIcon />
            ) : copyState === "error" ? (
              <AlertCircleIcon />
            ) : (
              <CopyIcon />
            )}
            <span className="hidden sm:inline">{copyStateLabel}</span>
          </Button>
        ) : null}
      </div>
      <div
        data-slot="code-block-content"
        aria-busy={html === null && !highlightError}
        className={cn(
          "min-w-0 overflow-x-auto [&_pre]:m-0 [&_pre]:min-w-max [&_pre]:px-6 [&_pre]:py-5",
          codeClassName
        )}
      >
        {html ? (
          <div dangerouslySetInnerHTML={{ __html: html }} />
        ) : (
          <pre className="bg-transparent font-mono text-[13px] leading-relaxed text-foreground">
            <code>{code}</code>
          </pre>
        )}
      </div>
      <span className="sr-only" aria-live="polite">
        {copyState === "idle" ? "" : copyStateLabel}
        {highlightError ? " Syntax highlighting unavailable." : ""}
      </span>
    </div>
  )
}

export { CodeBlock }
