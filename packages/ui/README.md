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
```

Otherwise import the prebuilt stylesheet:

```ts
import "@carsxe/design-system/styles.css"
```

The CSS import also loads the fonts (Manrope, Darker Grotesque, Inter).

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

Accordion, Alert, Avatar, Badge, Breadcrumb, Button, Card, Checkbox, Dialog,
Dropdown menu, Input, Label, Navigation menu, Pagination, Progress, Radio group,
Select, Separator, Skeleton, Slider, Sonner, Switch, Table, Tabs, Textarea, Tooltip.

Each is available from `@carsxe/design-system/components/<name>`. Alert and Badge
add `success` and `warning` variants on top of the usual shadcn set. `Input` has
no `size` variant — use `className` (e.g. `h-8`) for compact heights.

## Theming

Semantic tokens live on `:root` and `.dark`. Customize with CSS variables rather
than forking components.

| Token | Light |
| --- | --- |
| `--primary` | `#065774` |
| `--primary-hover` | `#00B6E5` |
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
