# @carsxe/design-system

Carsxe design system — [shadcn/ui](https://ui.shadcn.com) components themed to the Carsxe brand. Ship consistent UI by installing this package; do not run `shadcn add` in your app.

## Install

```bash
npm install @carsxe/design-system
```

```bash
pnpm add @carsxe/design-system
```

```bash
bun add @carsxe/design-system
```

Peer dependencies: `react` and `react-dom` (v19).

## Load CSS

Import the theme once, near your app entry.

If your app already compiles Tailwind v4:

```ts
import "@carsxe/design-system/globals.css"

// This stylesheet does not bundle the fonts — import them so your bundler
// resolves and fingerprints the woff2 files itself.
import "@fontsource-variable/manrope"
import "@fontsource-variable/dm-sans"
import "@fontsource/dm-mono/300.css"
import "@fontsource/dm-mono/400.css"
import "@fontsource/dm-mono/500.css"
```

Otherwise import the prebuilt stylesheet, which is self-contained (fonts
included):

```ts
import "@carsxe/design-system/styles.css"
```

Fonts are Manrope (UI, body, inputs), DM Sans (headings), and DM Mono (code).
If you load them another way — `next/font`, for example — point `--font-sans`,
`--font-body`, `--font-heading`, and `--font-mono` at your own families instead
of importing the packages above.

## Usage

Prefer the per-component import path:

```tsx
import { Button } from "@carsxe/design-system/components/button"

export function Example() {
  return <Button>Get started</Button>
}
```

The package root also works:

```tsx
import { Button, Card, Input } from "@carsxe/design-system"
```

## Components

Accordion, Alert, Angle Slider, Avatar, Badge, Breadcrumb, Button, Card,
Checkbox, Clipboard, Color Picker, Date Input, Dialog, Dropdown menu, Editable,
Floating Panel, Format, Highlight, Image Cropper, Input, JSON Tree View, Label,
Listbox, Marquee, Navigation menu, Number Input, Pagination, Password Input,
Progress, QR Code, Radio group, Rating Group, Select, Separator, Signature Pad,
Skeleton, Slider, Sonner, Steps, Swap, Switch, Table, Table of Contents, Tabs,
Tags Input, Textarea, Timer, Tour, Tree View, Tooltip.

Each is available from `@carsxe/design-system/components/<name>`. Alert and Badge
add `success` and `warning` variants on top of the usual shadcn set. `Input` has
no `size` variant — use `className` (e.g. `h-8`) for compact heights.

The advanced components are Carsxe-owned implementations and do not depend on
Ark UI or Zag. Interactive transitions use Motion and respect reduced-motion
preferences. Components support controlled and uncontrolled state through
`value`/`defaultValue` and `onValueChange`, or `open`/`defaultOpen` and
`onOpenChange` where applicable.

### Tour

```tsx
const tour = useTour({
  steps: [
    { id: "welcome", type: "dialog", title: "Welcome" },
    { id: "search", target: "#search", title: "Search by VIN" },
  ],
})

return (
  <>
    <button onClick={(event) => tour.start(undefined, event.currentTarget)}>
      Start tour
    </button>
    <Tour tour={tour} />
  </>
)
```

## Theming

Semantic tokens live on `:root` and `.dark`. Customize with CSS variables rather
than forking components.

| Token | Light |
| --- | --- |
| `--primary` | `#065774` |
| `--primary-hover` | `#387990` |
| `--foreground` | `#3A3A3A` |
| `--background` | `#F9F9F9` |
| `--success` | `#00A63E` |
| `--destructive` | `#DA373E` |
| `--warning` | `#F79008` |
| `--radius` | `0` |

`--radius` is `0`, so corners are sharp; circular controls keep `rounded-full`.
Enable dark mode by adding the `dark` class on an ancestor, usually `<html>`:

```html
<html class="dark">
```

## Guidelines

- Do not run `shadcn add` in the consumer app — components ship from this package.
- Do not copy component source into your app or wrap the primitives.
- Customize with `variant`, `size`, `className`, and native element props.

## License

MIT
