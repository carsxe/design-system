import * as React from "react"
import { HeartIcon, StarIcon, ThumbsUpIcon } from "lucide-react"
import { Label } from "@carsxe/design-system/components/label"
import { RatingGroup } from "@carsxe/design-system/components/rating-group"

import type { ComponentDoc } from "./types"

function RatingGroupDefaultExample() {
  const [value, setValue] = React.useState(3)

  return (
    <div className="flex flex-col items-start gap-2">
      <RatingGroup
        aria-label="Rate this endpoint"
        value={value}
        onValueChange={setValue}
      />
      <p className="text-xs text-muted-foreground">Rated {value} of 5.</p>
    </div>
  )
}

function RatingGroupHalfExample() {
  return (
    <RatingGroup aria-label="Vehicle condition" allowHalf defaultValue={3.5} />
  )
}

function RatingGroupClearExample() {
  const [value, setValue] = React.useState(4)

  return (
    <div className="flex flex-col items-start gap-2">
      <RatingGroup
        aria-label="Service quality"
        allowClear
        value={value}
        onValueChange={setValue}
      />
      <p className="text-xs text-muted-foreground">
        {value === 0
          ? "No rating. Pick a star to rate."
          : "Pick the same star again, or press Delete, to clear."}
      </p>
    </div>
  )
}

function RatingGroupIconsExample() {
  return (
    <div className="flex flex-col gap-3">
      <RatingGroup aria-label="Favourite" defaultValue={4} icon={HeartIcon} />
      <RatingGroup
        aria-label="Helpful"
        defaultValue={3}
        count={4}
        icon={ThumbsUpIcon}
        emptyIcon={StarIcon}
      />
    </div>
  )
}

function RatingGroupCountExample() {
  return (
    <div className="flex flex-col gap-3">
      <RatingGroup aria-label="Out of three" count={3} defaultValue={2} />
      <RatingGroup aria-label="Out of ten" count={10} defaultValue={7} />
    </div>
  )
}

function RatingGroupVerticalExample() {
  return (
    <RatingGroup
      aria-label="Ride comfort"
      orientation="vertical"
      defaultValue={3}
    />
  )
}

function RatingGroupStatesExample() {
  return (
    <div className="flex flex-col gap-3">
      <RatingGroup aria-label="Read only" defaultValue={4} readOnly />
      <RatingGroup aria-label="Disabled" defaultValue={2} disabled />
    </div>
  )
}

function RatingGroupFormExample() {
  return (
    <form
      className="flex flex-col items-start gap-2"
      onSubmit={(event) => event.preventDefault()}
    >
      <Label>Overall score</Label>
      <RatingGroup aria-label="Overall score" name="score" defaultValue={4} />
    </form>
  )
}

const ratingGroup = {
  slug: "rating-group",
  title: "Rating group",
  description:
    "A star rating that can be read or set. It supports half values from the click position, an optional clear affordance, any icon pair for the filled and empty layers, a custom number of items, vertical layout, read-only and disabled states, and form submission through a hidden input. Arrow keys step the rating; with allowClear, Delete and Backspace reset it.",
  importName: "RatingGroup",
  importPath: "@carsxe/design-system/components/rating-group",
  usage: `import { RatingGroup } from "@carsxe/design-system/components/rating-group"

const [value, setValue] = React.useState(3)

<RatingGroup aria-label="Rate this endpoint" value={value} onValueChange={setValue} />`,
  preview: <RatingGroupDefaultExample />,
  previewCode: `<RatingGroup aria-label="Rate this endpoint" value={value} onValueChange={setValue} />`,
  examples: [
    {
      title: "Half values",
      preview: <RatingGroupHalfExample />,
      code: `// Clicking the left half of an item selects the half value.
<RatingGroup aria-label="Vehicle condition" allowHalf defaultValue={3.5} />`,
    },
    {
      title: "Clearable",
      preview: <RatingGroupClearExample />,
      code: `// Picking the current value again — or pressing Delete — sets 0.
<RatingGroup
  aria-label="Service quality"
  allowClear
  value={value}
  onValueChange={setValue}
/>`,
    },
    {
      title: "Custom icons",
      preview: <RatingGroupIconsExample />,
      code: `<RatingGroup aria-label="Favourite" defaultValue={4} icon={HeartIcon} />

// emptyIcon styles the unfilled layer separately.
<RatingGroup
  aria-label="Helpful"
  defaultValue={3}
  count={4}
  icon={ThumbsUpIcon}
  emptyIcon={StarIcon}
/>`,
    },
    {
      title: "Item count",
      preview: <RatingGroupCountExample />,
      code: `<RatingGroup aria-label="Out of three" count={3} defaultValue={2} />
<RatingGroup aria-label="Out of ten" count={10} defaultValue={7} />`,
    },
    {
      title: "Vertical",
      preview: <RatingGroupVerticalExample />,
      code: `<RatingGroup aria-label="Ride comfort" orientation="vertical" defaultValue={3} />`,
    },
    {
      title: "Read-only and disabled",
      preview: <RatingGroupStatesExample />,
      code: `<RatingGroup aria-label="Read only" defaultValue={4} readOnly />
<RatingGroup aria-label="Disabled" defaultValue={2} disabled />`,
    },
    {
      title: "Inside a form",
      preview: <RatingGroupFormExample />,
      code: `// A name prop renders a hidden input so the rating submits with the form.
<RatingGroup aria-label="Overall score" name="score" defaultValue={4} />`,
    },
  ],
  props: [
    { name: "value", type: "number" },
    { name: "defaultValue", type: "number", defaultValue: "0" },
    { name: "onValueChange", type: "(value: number) => void" },
    { name: "count", type: "number", defaultValue: "5" },
    { name: "allowHalf", type: "boolean", defaultValue: "false" },
    { name: "allowClear", type: "boolean", defaultValue: "false" },
    { name: "icon", type: "ComponentType<{ className?: string }>" },
    { name: "emptyIcon", type: "ComponentType<{ className?: string }>" },
    {
      name: "orientation",
      type: '"horizontal" | "vertical"',
      defaultValue: '"horizontal"',
    },
    { name: "readOnly", type: "boolean", defaultValue: "false" },
    { name: "disabled", type: "boolean", defaultValue: "false" },
    { name: "name", type: "string" },
  ],
} satisfies ComponentDoc

export {
  ratingGroup,
  RatingGroupClearExample,
  RatingGroupCountExample,
  RatingGroupDefaultExample,
  RatingGroupFormExample,
  RatingGroupHalfExample,
  RatingGroupIconsExample,
  RatingGroupStatesExample,
  RatingGroupVerticalExample,
}
