import * as React from "react"
import {
  Autocomplete,
  AutocompleteChip,
  AutocompleteChips,
  AutocompleteChipsInput,
  AutocompleteContent,
  AutocompleteEmpty,
  AutocompleteGroup,
  AutocompleteInput,
  AutocompleteItem,
  AutocompleteLabel,
  AutocompleteList,
  AutocompleteStatus,
  useAutocompleteAnchor,
} from "@carsxe/design-system/components/autocomplete"

import type { ComponentDoc } from "./types"

const makes = [
  "Acura",
  "Audi",
  "BMW",
  "Chevrolet",
  "Dodge",
  "Ford",
  "Honda",
  "Hyundai",
  "Jeep",
  "Kia",
  "Lexus",
  "Mazda",
  "Mercedes-Benz",
  "Nissan",
  "Porsche",
  "Subaru",
  "Tesla",
  "Toyota",
  "Volkswagen",
  "Volvo",
]

function AutocompleteDefaultExample() {
  return (
    <div className="w-full max-w-sm">
      <Autocomplete<string> items={makes}>
        <AutocompleteInput placeholder="Search vehicle make" />
        <AutocompleteContent>
          <AutocompleteEmpty>No makes found.</AutocompleteEmpty>
          <AutocompleteList>
            {(make: string) => (
              <AutocompleteItem key={make} value={make}>
                {make}
              </AutocompleteItem>
            )}
          </AutocompleteList>
        </AutocompleteContent>
      </Autocomplete>
    </div>
  )
}

function AutocompleteDropdownExample() {
  return (
    <div className="w-full max-w-sm">
      <Autocomplete<string> items={makes} minLength={0}>
        <AutocompleteInput placeholder="Pick a make" showTrigger showClear />
        <AutocompleteContent>
          <AutocompleteEmpty>No makes found.</AutocompleteEmpty>
          <AutocompleteList>
            {(make: string) => (
              <AutocompleteItem key={make} value={make}>
                {make}
              </AutocompleteItem>
            )}
          </AutocompleteList>
        </AutocompleteContent>
      </Autocomplete>
    </div>
  )
}

/**
 * Stands in for a network call so the debounce and loading state are visible
 * without leaving the docs.
 */
function searchMakes(query: string) {
  return new Promise<string[]>((resolve) => {
    setTimeout(() => {
      const needle = query.trim().toLowerCase()
      resolve(makes.filter((make) => make.toLowerCase().includes(needle)))
    }, 450)
  })
}

function AutocompleteAsyncExample() {
  const [suggestions, setSuggestions] = React.useState<string[]>([])
  const [loading, setLoading] = React.useState(false)
  const requestRef = React.useRef(0)

  const handleQueryChange = React.useCallback((query: string) => {
    const request = ++requestRef.current
    setLoading(true)
    searchMakes(query).then((results) => {
      // Ignore responses that arrive after a newer query was issued.
      if (request !== requestRef.current) return
      setSuggestions(results)
      setLoading(false)
    })
  }, [])

  return (
    <div className="grid w-full max-w-sm gap-2">
      <Autocomplete<string>
        items={suggestions}
        delay={400}
        minLength={2}
        loading={loading}
        onQueryChange={handleQueryChange}
      >
        <AutocompleteInput placeholder="Type at least two letters" />
        <AutocompleteContent>
          <AutocompleteStatus>Searching makes…</AutocompleteStatus>
          <AutocompleteEmpty>No makes found.</AutocompleteEmpty>
          <AutocompleteList>
            {(make: string) => (
              <AutocompleteItem key={make} value={make}>
                {make}
              </AutocompleteItem>
            )}
          </AutocompleteList>
        </AutocompleteContent>
      </Autocomplete>
      <p className="text-xs text-muted-foreground">
        Queries fire 400ms after you stop typing, so a burst of keystrokes makes
        a single request.
      </p>
    </div>
  )
}

function AutocompleteMultipleExample() {
  const [value, setValue] = React.useState<string[]>(["Ford"])
  const anchor = useAutocompleteAnchor()

  return (
    <div className="w-full max-w-sm">
      <Autocomplete<string>
        multiple
        items={makes}
        value={value}
        onValueChange={setValue}
      >
        <AutocompleteChips ref={anchor}>
          {value.map((make) => (
            <AutocompleteChip key={make}>{make}</AutocompleteChip>
          ))}
          <AutocompleteChipsInput placeholder="Add makes" />
        </AutocompleteChips>
        <AutocompleteContent anchor={anchor}>
          <AutocompleteEmpty>No makes found.</AutocompleteEmpty>
          <AutocompleteList>
            {(make: string) => (
              <AutocompleteItem key={make} value={make}>
                {make}
              </AutocompleteItem>
            )}
          </AutocompleteList>
        </AutocompleteContent>
      </Autocomplete>
    </div>
  )
}

type Endpoint = { value: string; label: string }

const endpointGroups: { value: string; items: Endpoint[] }[] = [
  {
    value: "Vehicle data",
    items: [
      { value: "vin", label: "VIN Decoder" },
      { value: "specs", label: "Vehicle Specs" },
      { value: "images", label: "Vehicle Images" },
    ],
  },
  {
    value: "History",
    items: [
      { value: "history", label: "Vehicle History" },
      { value: "recalls", label: "Vehicle Recalls" },
      { value: "obd", label: "OBD Codes" },
    ],
  },
]

function AutocompleteGroupedExample() {
  return (
    <div className="w-full max-w-sm">
      <Autocomplete<Endpoint> items={endpointGroups}>
        <AutocompleteInput placeholder="Search endpoints" />
        <AutocompleteContent>
          <AutocompleteEmpty>No endpoints found.</AutocompleteEmpty>
          <AutocompleteList>
            {(group: { value: string; items: Endpoint[] }) => (
              <AutocompleteGroup key={group.value} items={group.items}>
                <AutocompleteLabel>{group.value}</AutocompleteLabel>
                {group.items.map((endpoint) => (
                  <AutocompleteItem key={endpoint.value} value={endpoint}>
                    {endpoint.label}
                  </AutocompleteItem>
                ))}
              </AutocompleteGroup>
            )}
          </AutocompleteList>
        </AutocompleteContent>
      </Autocomplete>
    </div>
  )
}

function AutocompleteForceSelectionExample() {
  return (
    <div className="grid w-full max-w-sm gap-2">
      <Autocomplete<string> items={makes} forceSelection>
        <AutocompleteInput placeholder="Must match a make" showClear />
        <AutocompleteContent>
          <AutocompleteEmpty>No makes found.</AutocompleteEmpty>
          <AutocompleteList>
            {(make: string) => (
              <AutocompleteItem key={make} value={make}>
                {make}
              </AutocompleteItem>
            )}
          </AutocompleteList>
        </AutocompleteContent>
      </Autocomplete>
      <p className="text-xs text-muted-foreground">
        Type something that is not a make, then click away — the input resets.
      </p>
    </div>
  )
}

const autocomplete = {
  slug: "autocomplete",
  title: "Autocomplete",
  description:
    "A text input that suggests options as the user types. Queries are debounced through the delay prop so a burst of keystrokes makes a single request, and passing onQueryChange switches the component into async mode where the caller owns filtering and the supplied items render verbatim. Supports a dropdown trigger, multi-select chips, grouped and object suggestions, forced selection, loading status, and a minimum query length.",
  importName: "Autocomplete",
  importPath: "@carsxe/design-system/components/autocomplete",
  usage: `import {
  Autocomplete,
  AutocompleteContent,
  AutocompleteEmpty,
  AutocompleteInput,
  AutocompleteItem,
  AutocompleteList,
} from "@carsxe/design-system/components/autocomplete"

<Autocomplete items={makes} delay={300} onQueryChange={search}>
  <AutocompleteInput placeholder="Search vehicle make" />
  <AutocompleteContent>
    <AutocompleteEmpty>No makes found.</AutocompleteEmpty>
    <AutocompleteList>
      {(make) => (
        <AutocompleteItem key={make} value={make}>
          {make}
        </AutocompleteItem>
      )}
    </AutocompleteList>
  </AutocompleteContent>
</Autocomplete>`,
  preview: <AutocompleteDefaultExample />,
  previewCode: `<Autocomplete items={makes}>
  <AutocompleteInput placeholder="Search vehicle make" />
  <AutocompleteContent>
    <AutocompleteEmpty>No makes found.</AutocompleteEmpty>
    <AutocompleteList>
      {(make) => (
        <AutocompleteItem key={make} value={make}>{make}</AutocompleteItem>
      )}
    </AutocompleteList>
  </AutocompleteContent>
</Autocomplete>`,
  examples: [
    {
      title: "Debounced async suggestions",
      preview: <AutocompleteAsyncExample />,
      code: `const [suggestions, setSuggestions] = React.useState([])
const [loading, setLoading] = React.useState(false)

// Providing onQueryChange disables built-in filtering: the server decides.
<Autocomplete
  items={suggestions}
  delay={400}
  minLength={2}
  loading={loading}
  onQueryChange={(query) => {
    setLoading(true)
    searchMakes(query).then((results) => {
      setSuggestions(results)
      setLoading(false)
    })
  }}
>
  <AutocompleteInput placeholder="Type at least two letters" />
  <AutocompleteContent>
    <AutocompleteStatus>Searching makes…</AutocompleteStatus>
    <AutocompleteEmpty>No makes found.</AutocompleteEmpty>
    <AutocompleteList>
      {(make) => <AutocompleteItem key={make} value={make}>{make}</AutocompleteItem>}
    </AutocompleteList>
  </AutocompleteContent>
</Autocomplete>`,
    },
    {
      title: "Dropdown trigger and clear button",
      preview: <AutocompleteDropdownExample />,
      code: `// minLength={0} lets the trigger reveal every suggestion.
<Autocomplete items={makes} minLength={0}>
  <AutocompleteInput placeholder="Pick a make" showTrigger showClear />
  <AutocompleteContent>{/* … */}</AutocompleteContent>
</Autocomplete>`,
    },
    {
      title: "Multiple selection with chips",
      preview: <AutocompleteMultipleExample />,
      code: `const [value, setValue] = React.useState(["Ford"])
const anchor = useAutocompleteAnchor()

<Autocomplete multiple items={makes} value={value} onValueChange={setValue}>
  <AutocompleteChips ref={anchor}>
    {value.map((make) => (
      <AutocompleteChip key={make}>{make}</AutocompleteChip>
    ))}
    <AutocompleteChipsInput placeholder="Add makes" />
  </AutocompleteChips>
  <AutocompleteContent anchor={anchor}>{/* … */}</AutocompleteContent>
</Autocomplete>`,
    },
    {
      title: "Grouped object suggestions",
      preview: <AutocompleteGroupedExample />,
      code: `// Object items with a { value, label } shape display their label automatically.
<Autocomplete items={endpointGroups}>
  <AutocompleteInput placeholder="Search endpoints" />
  <AutocompleteContent>
    <AutocompleteList>
      {(group) => (
        <AutocompleteGroup key={group.value} items={group.items}>
          <AutocompleteLabel>{group.value}</AutocompleteLabel>
          {group.items.map((endpoint) => (
            <AutocompleteItem key={endpoint.value} value={endpoint}>
              {endpoint.label}
            </AutocompleteItem>
          ))}
        </AutocompleteGroup>
      )}
    </AutocompleteList>
  </AutocompleteContent>
</Autocomplete>`,
    },
    {
      title: "Force selection",
      preview: <AutocompleteForceSelectionExample />,
      code: `<Autocomplete items={makes} forceSelection>
  <AutocompleteInput placeholder="Must match a make" showClear />
  <AutocompleteContent>{/* … */}</AutocompleteContent>
</Autocomplete>`,
    },
  ],
  props: [
    { name: "items", type: "T[] | { value, items }[]" },
    { name: "delay", type: "number", defaultValue: "250 (ms)" },
    { name: "onQueryChange", type: "(query: string) => void" },
    { name: "minLength", type: "number", defaultValue: "1" },
    { name: "loading", type: "boolean", defaultValue: "false" },
    { name: "filter", type: "null | (item, query) => boolean" },
    { name: "limit", type: "number" },
    { name: "itemToStringValue", type: "(item: T) => string" },
    { name: "multiple", type: "boolean", defaultValue: "false" },
    { name: "forceSelection", type: "boolean", defaultValue: "false" },
    { name: "value", type: "string | T[]" },
    { name: "defaultValue", type: "string | T[]" },
    { name: "onValueChange", type: "(value: string | T[]) => void" },
    { name: "onSelect", type: "(item: T) => void" },
    { name: "onUnselect", type: "(item: T) => void" },
    { name: "onClear", type: "() => void" },
    { name: "open", type: "boolean" },
    { name: "onOpenChange", type: "(open: boolean) => void" },
    {
      name: "autoHighlight",
      type: 'boolean | "always"',
      defaultValue: "false",
    },
    { name: "openOnInputClick", type: "boolean", defaultValue: "false" },
    { name: "disabled", type: "boolean", defaultValue: "false" },
    { name: "readOnly", type: "boolean" },
    { name: "required", type: "boolean" },
    { name: "invalid", type: "boolean", defaultValue: "false" },
    { name: "name", type: "string" },
  ],
} satisfies ComponentDoc

export {
  autocomplete,
  AutocompleteAsyncExample,
  AutocompleteDefaultExample,
  AutocompleteDropdownExample,
  AutocompleteForceSelectionExample,
  AutocompleteGroupedExample,
  AutocompleteMultipleExample,
}
