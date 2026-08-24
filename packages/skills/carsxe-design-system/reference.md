# @carsxe/design-system reference

## CSS

| Import | When to use |
| --- | --- |
| `@carsxe/design-system/globals.css` | The app already compiles Tailwind v4 |
| `@carsxe/design-system/styles.css` | The app does not compile Tailwind; use the prebuilt sheet |

Dark mode is activated with a `.dark` class on an ancestor (typically `<html>`).

## Fonts

Loaded by the CSS import:

- Sans / UI: Manrope (`--font-sans`)
- Headings: DM Sans (`--font-heading`)
- Body / inputs: Manrope (`--font-body`)
- Mono / code: DM Mono (`--font-mono`)

## Radius

`--radius` is `0`. Corners are sharp. Circular controls (`Switch`, radio, slider thumbs, progress, avatars) keep `rounded-full`.

Default control height is `40px` (`h-10`).

## Tokens

Light (`:root`) values:

| Token | Value |
| --- | --- |
| `--primary` | `#065774` |
| `--primary-hover` | `#00B6E5` |
| `--primary-disabled` | `#83BACC` |
| `--foreground` | `#3A3A3A` |
| `--muted-foreground` | `#A8A8A8` |
| `--border` | `#EBEBEB` |
| `--background` | `#F9F9F9` |
| `--success` | `#00A63E` |
| `--destructive` | `#DA373E` |
| `--warning` | `#F79008` |
| `--success-muted` | `#E6F6EC` |
| `--destructive-muted` | `#FDF0F1` |
| `--warning-muted` | `#FEF7E6` |
| `--radius` | `0` |

Also: `--primary-foreground`, `--card`, `--accent`, `--ring`, `--sidebar-*`.

## Components

Import from `@carsxe/design-system/components/<name>` or the package root.

| Component | Path |
| --- | --- |
| Accordion | `@carsxe/design-system/components/accordion` |
| Alert | `@carsxe/design-system/components/alert` |
| Avatar | `@carsxe/design-system/components/avatar` |
| Badge | `@carsxe/design-system/components/badge` |
| Breadcrumb | `@carsxe/design-system/components/breadcrumb` |
| Button | `@carsxe/design-system/components/button` |
| Card | `@carsxe/design-system/components/card` |
| Checkbox | `@carsxe/design-system/components/checkbox` |
| Dialog | `@carsxe/design-system/components/dialog` |
| Dropdown menu | `@carsxe/design-system/components/dropdown-menu` |
| Input | `@carsxe/design-system/components/input` |
| Label | `@carsxe/design-system/components/label` |
| Navigation menu | `@carsxe/design-system/components/navigation-menu` |
| Pagination | `@carsxe/design-system/components/pagination` |
| Progress | `@carsxe/design-system/components/progress` |
| Radio group | `@carsxe/design-system/components/radio-group` |
| Select | `@carsxe/design-system/components/select` |
| Separator | `@carsxe/design-system/components/separator` |
| Skeleton | `@carsxe/design-system/components/skeleton` |
| Slider | `@carsxe/design-system/components/slider` |
| Sonner | `@carsxe/design-system/components/sonner` |
| Switch | `@carsxe/design-system/components/switch` |
| Table | `@carsxe/design-system/components/table` |
| Tabs | `@carsxe/design-system/components/tabs` |
| Textarea | `@carsxe/design-system/components/textarea` |
| Tooltip | `@carsxe/design-system/components/tooltip` |

`Input` has no `size` variant prop — native `<input size>` is a number. Use `className` for compact heights (for example `h-8`).

Alert and Badge include `success` and `warning` variants in addition to the usual shadcn set.

## Example

```tsx
import { Button } from "@carsxe/design-system/components/button"
import "@carsxe/design-system/globals.css"

export function Example() {
  return <Button>Get started</Button>
}
```
