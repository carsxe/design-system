import * as React from "react"
import { cleanup, render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { afterEach, describe, expect, it, vi } from "vitest"
import { axe } from "vitest-axe"

import {
  Autocomplete,
  AutocompleteChip,
  AutocompleteChips,
  AutocompleteChipsInput,
  AutocompleteContent,
  AutocompleteEmpty,
  AutocompleteInput,
  AutocompleteItem,
  AutocompleteList,
  type AutocompleteSingleProps,
} from "../components/autocomplete"

afterEach(cleanup)

const FRUITS = ["Apple", "Apricot", "Banana", "Cherry"]

type SingleProps = Omit<
  AutocompleteSingleProps<string>,
  "children" | "multiple"
> & { showTrigger?: boolean }

function SingleAutocomplete({
  items = FRUITS,
  showTrigger,
  ...rootProps
}: SingleProps) {
  return (
    <Autocomplete<string> items={items} {...rootProps}>
      <AutocompleteInput placeholder="Search fruit" showTrigger={showTrigger} />
      <AutocompleteContent>
        <AutocompleteEmpty>No results found.</AutocompleteEmpty>
        <AutocompleteList>
          {(item: string) => (
            <AutocompleteItem key={item} value={item}>
              {item}
            </AutocompleteItem>
          )}
        </AutocompleteList>
      </AutocompleteContent>
    </Autocomplete>
  )
}

function input() {
  return screen.getByPlaceholderText("Search fruit")
}

describe("Autocomplete", () => {
  describe("debounced querying", () => {
    const sleep = (ms: number) =>
      new Promise((resolve) => setTimeout(resolve, ms))

    it("fires onQueryChange once with the latest query after the delay", async () => {
      const user = userEvent.setup({ delay: null })
      const onQueryChange = vi.fn()
      render(<SingleAutocomplete delay={120} onQueryChange={onQueryChange} />)

      await user.click(input())
      await user.type(input(), "app")
      // Three keystrokes, but the timer restarts on each one.
      expect(onQueryChange).not.toHaveBeenCalled()

      await waitFor(() => {
        expect(onQueryChange).toHaveBeenCalledTimes(1)
      })
      expect(onQueryChange).toHaveBeenCalledWith("app")
    })

    it("does not query below minLength", async () => {
      const user = userEvent.setup({ delay: null })
      const onQueryChange = vi.fn()
      render(
        <SingleAutocomplete
          delay={20}
          minLength={3}
          onQueryChange={onQueryChange}
        />
      )

      await user.click(input())
      await user.type(input(), "ap")
      await sleep(120)
      expect(onQueryChange).not.toHaveBeenCalled()

      await user.type(input(), "p")
      await waitFor(() => {
        expect(onQueryChange).toHaveBeenCalledWith("app")
      })
      expect(onQueryChange).toHaveBeenCalledTimes(1)
    })
  })

  it("renders provided items verbatim in async mode", async () => {
    // `onQueryChange` disables built-in filtering, so a query that matches
    // nothing locally must still render everything the caller supplied.
    const user = userEvent.setup()
    render(
      <SingleAutocomplete
        items={["Zebra", "Zulu"]}
        onQueryChange={() => {}}
        delay={0}
      />
    )

    await user.click(input())
    await user.type(input(), "aaa")

    await waitFor(() => {
      expect(screen.getByRole("option", { name: "Zebra" })).toBeVisible()
    })
    expect(screen.getByRole("option", { name: "Zulu" })).toBeVisible()
  })

  it("keeps the popup closed until minLength is reached", async () => {
    const user = userEvent.setup()
    render(<SingleAutocomplete minLength={2} />)

    await user.click(input())
    await user.type(input(), "a")
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument()

    await user.type(input(), "p")
    await waitFor(() => {
      expect(screen.getByRole("option", { name: "Apple" })).toBeVisible()
    })
  })

  it("opens the full list from the trigger button regardless of minLength", async () => {
    const user = userEvent.setup()
    render(<SingleAutocomplete showTrigger minLength={3} />)

    await user.click(screen.getByRole("button", { name: "Show suggestions" }))

    await waitFor(() => {
      expect(screen.getByRole("option", { name: "Apple" })).toBeVisible()
    })
    expect(screen.getByRole("option", { name: "Cherry" })).toBeVisible()
  })

  it("selects an item, fills the input, and reports the selection", async () => {
    const user = userEvent.setup()
    const onSelect = vi.fn()
    render(<SingleAutocomplete onSelect={onSelect} />)

    await user.click(input())
    await user.type(input(), "ban")
    await waitFor(() => {
      expect(screen.getByRole("option", { name: "Banana" })).toBeVisible()
    })

    await user.click(screen.getByRole("option", { name: "Banana" }))

    await waitFor(() => {
      expect(input()).toHaveValue("Banana")
    })
    expect(onSelect).toHaveBeenCalledWith("Banana")
  })

  it("clears unmatched text on close when forceSelection is set", async () => {
    const user = userEvent.setup()
    render(<SingleAutocomplete forceSelection />)

    await user.click(input())
    await user.type(input(), "Apricot fake")
    await waitFor(() => expect(input()).toHaveValue("Apricot fake"))

    await user.keyboard("{Escape}")

    await waitFor(() => {
      expect(input()).toHaveValue("")
    })
  })

  it("keeps matching text on close when forceSelection is set", async () => {
    const user = userEvent.setup()
    render(<SingleAutocomplete forceSelection />)

    await user.click(input())
    await user.type(input(), "Apricot")
    await user.keyboard("{Escape}")

    await waitFor(() => {
      expect(input()).toHaveValue("Apricot")
    })
  })

  it("shows the empty message when nothing matches", async () => {
    const user = userEvent.setup()
    render(<SingleAutocomplete />)

    await user.click(input())
    await user.type(input(), "zzz")

    await waitFor(() => {
      expect(screen.getByText("No results found.")).toBeVisible()
    })
  })

  it("submits the current text through a hidden input", () => {
    const { container } = render(
      <SingleAutocomplete name="fruit" defaultValue="Cherry" />
    )
    const hidden = container.querySelector<HTMLInputElement>(
      'input[name="fruit"]'
    )
    expect(hidden).not.toBeNull()
    expect(hidden).toHaveValue("Cherry")
  })

  it("appends and removes chips in multiple mode", async () => {
    const user = userEvent.setup()
    const onValueChange = vi.fn()
    const onUnselect = vi.fn()

    function MultipleAutocomplete() {
      const [value, setValue] = React.useState<string[]>([])
      return (
        <Autocomplete<string>
          multiple
          items={FRUITS}
          value={value}
          onValueChange={(next) => {
            setValue(next)
            onValueChange(next)
          }}
          onUnselect={onUnselect}
        >
          <AutocompleteChips>
            {value.map((item) => (
              <AutocompleteChip key={item}>{item}</AutocompleteChip>
            ))}
            <AutocompleteChipsInput placeholder="Search fruit" />
          </AutocompleteChips>
          <AutocompleteContent>
            <AutocompleteList>
              {(item: string) => (
                <AutocompleteItem key={item} value={item}>
                  {item}
                </AutocompleteItem>
              )}
            </AutocompleteList>
          </AutocompleteContent>
        </Autocomplete>
      )
    }

    render(<MultipleAutocomplete />)

    await user.click(input())
    await user.type(input(), "cher")
    await waitFor(() => {
      expect(screen.getByRole("option", { name: "Cherry" })).toBeVisible()
    })
    await user.click(screen.getByRole("option", { name: "Cherry" }))

    await waitFor(() => {
      expect(onValueChange).toHaveBeenCalledWith(["Cherry"])
    })

    const remove = screen
      .getByText("Cherry")
      .closest('[data-slot="autocomplete-chip"]')
      ?.querySelector<HTMLElement>('[data-slot="autocomplete-chip-remove"]')
    expect(remove).not.toBeNull()
    await user.click(remove!)

    await waitFor(() => {
      expect(onUnselect).toHaveBeenCalledWith("Cherry")
    })
    expect(onValueChange).toHaveBeenLastCalledWith([])
  })

  it("has no accessibility violations", async () => {
    const { container } = render(
      <main>
        <SingleAutocomplete showTrigger />
      </main>
    )
    expect(
      (
        await axe(container, {
          rules: { "color-contrast": { enabled: false } },
        })
      ).violations.map((violation) => violation.id)
    ).toEqual([])
  })
})
