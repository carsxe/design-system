import { useEffect, useMemo, useState } from "react"
import { useNavigate } from "@tanstack/react-router"
import { SearchIcon } from "lucide-react"

import { Button } from "@carsxe/design-system/components/button"
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@carsxe/design-system/components/command"
import { Kbd } from "@carsxe/design-system/components/kbd"

import { searchDocs } from "@/lib/orama"
import { groupSearchHits } from "@/lib/search-index"

function isEditableTarget(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) {
    return false
  }

  return Boolean(
    target.closest("input, textarea, select, [contenteditable=true]")
  )
}

export function DocsSearch() {
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState("")
  const [isMac, setIsMac] = useState(false)

  useEffect(() => {
    setIsMac(/Mac|iPhone|iPad/.test(navigator.platform))
  }, [])

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (
        !(event.metaKey || event.ctrlKey) ||
        event.key.toLowerCase() !== "k"
      ) {
        return
      }

      if (isEditableTarget(event.target) && !open) {
        return
      }

      event.preventDefault()
      setOpen((current) => !current)
    }

    document.addEventListener("keydown", onKeyDown)
    return () => document.removeEventListener("keydown", onKeyDown)
  }, [open])

  const sections = useMemo(() => groupSearchHits(searchDocs(query)), [query])

  function handleOpenChange(nextOpen: boolean) {
    setOpen(nextOpen)
    if (!nextOpen) {
      setQuery("")
    }
  }

  function goTo(href: string) {
    handleOpenChange(false)
    void navigate({ to: href })
  }

  return (
    <>
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        className="md:hidden"
        aria-label="Search docs"
        onClick={() => setOpen(true)}
      >
        <SearchIcon />
      </Button>
      <Button
        type="button"
        variant="secondary"
        size="sm"
        className="hidden h-8 w-full max-w-56 justify-between px-2.5 text-muted-foreground md:inline-flex"
        onClick={() => setOpen(true)}
      >
        <span className="flex items-center gap-2">
          <SearchIcon />
          Search docs…
        </span>
        <Kbd>{isMac ? "⌘K" : "Ctrl+K"}</Kbd>
      </Button>
      <CommandDialog
        open={open}
        onOpenChange={handleOpenChange}
        title="Search docs"
        description="Search pages, components, and skills."
      >
        <Command shouldFilter={false}>
          <CommandInput
            placeholder="Search docs…"
            value={query}
            onValueChange={setQuery}
          />
          <CommandList>
            <CommandEmpty>No results.</CommandEmpty>
            {sections.map((section) => (
              <CommandGroup key={section.group} heading={section.group}>
                {section.items.map((entry) => (
                  <CommandItem
                    key={entry.id}
                    value={entry.id}
                    onSelect={() => goTo(entry.href)}
                  >
                    <span className="flex min-w-0 flex-1 flex-col">
                      <span className="truncate">{entry.title}</span>
                      <span className="truncate text-xs text-muted-foreground">
                        {entry.description}
                      </span>
                    </span>
                  </CommandItem>
                ))}
              </CommandGroup>
            ))}
          </CommandList>
        </Command>
      </CommandDialog>
    </>
  )
}
