# @carsxe/design-system reference

## CSS

| Import                              | When to use                                               |
| ----------------------------------- | --------------------------------------------------------- |
| `@carsxe/design-system/globals.css` | The app already compiles Tailwind v4                      |
| `@carsxe/design-system/styles.css`  | The app does not compile Tailwind; use the prebuilt sheet |

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

| Token                 | Value     |
| --------------------- | --------- |
| `--primary`           | `#065774` |
| `--primary-hover`     | `#387990` |
| `--primary-disabled`  | `#83BACC` |
| `--foreground`        | `#3A3A3A` |
| `--muted-foreground`  | `#A8A8A8` |
| `--border`            | `#EBEBEB` |
| `--background`        | `#F9F9F9` |
| `--success`           | `#00A63E` |
| `--destructive`       | `#DA373E` |
| `--warning`           | `#F79008` |
| `--success-muted`     | `#E6F6EC` |
| `--destructive-muted` | `#FDF0F1` |
| `--warning-muted`     | `#FEF7E6` |
| `--radius`            | `0`       |

Also: `--primary-foreground`, `--card`, `--accent`, `--ring`, `--sidebar-*`.

## Components

Import from `@carsxe/design-system/components/<name>` or the package root.

| Component         | Path                                                 |
| ----------------- | ---------------------------------------------------- |
| Accordion         | `@carsxe/design-system/components/accordion`         |
| Alert             | `@carsxe/design-system/components/alert`             |
| Alert dialog      | `@carsxe/design-system/components/alert-dialog`      |
| Angle Slider      | `@carsxe/design-system/components/angle-slider`      |
| Aspect ratio      | `@carsxe/design-system/components/aspect-ratio`      |
| Attachment        | `@carsxe/design-system/components/attachment`        |
| Avatar            | `@carsxe/design-system/components/avatar`            |
| Badge             | `@carsxe/design-system/components/badge`             |
| Breadcrumb        | `@carsxe/design-system/components/breadcrumb`        |
| Bubble            | `@carsxe/design-system/components/bubble`            |
| Button            | `@carsxe/design-system/components/button`            |
| Button group      | `@carsxe/design-system/components/button-group`      |
| Calendar          | `@carsxe/design-system/components/calendar`          |
| Card              | `@carsxe/design-system/components/card`              |
| Carousel          | `@carsxe/design-system/components/carousel`          |
| Chart             | `@carsxe/design-system/components/chart`             |
| D3 Charts         | `@carsxe/design-system/components/d3-chart`          |
| Checkbox          | `@carsxe/design-system/components/checkbox`          |
| Clipboard         | `@carsxe/design-system/components/clipboard`         |
| Code Block        | `@carsxe/design-system/components/code-block`        |
| Collapsible       | `@carsxe/design-system/components/collapsible`       |
| Color Picker      | `@carsxe/design-system/components/color-picker`      |
| Combobox          | `@carsxe/design-system/components/combobox`          |
| Command           | `@carsxe/design-system/components/command`           |
| Context menu      | `@carsxe/design-system/components/context-menu`      |
| Date Input        | `@carsxe/design-system/components/date-input`        |
| Dialog            | `@carsxe/design-system/components/dialog`            |
| Direction         | `@carsxe/design-system/components/direction`         |
| Drawer            | `@carsxe/design-system/components/drawer`            |
| Dropdown menu     | `@carsxe/design-system/components/dropdown-menu`     |
| Editable          | `@carsxe/design-system/components/editable`          |
| Empty             | `@carsxe/design-system/components/empty`             |
| Field             | `@carsxe/design-system/components/field`             |
| Floating Panel    | `@carsxe/design-system/components/floating-panel`    |
| Format            | `@carsxe/design-system/components/format`            |
| Heatmap           | `@carsxe/design-system/components/heatmap`           |
| Highlight         | `@carsxe/design-system/components/highlight`         |
| Hover card        | `@carsxe/design-system/components/hover-card`        |
| Image Cropper     | `@carsxe/design-system/components/image-cropper`     |
| Input             | `@carsxe/design-system/components/input`             |
| Input group       | `@carsxe/design-system/components/input-group`       |
| Input OTP         | `@carsxe/design-system/components/input-otp`         |
| Item              | `@carsxe/design-system/components/item`              |
| JSON Tree View    | `@carsxe/design-system/components/json-tree-view`    |
| Kbd               | `@carsxe/design-system/components/kbd`               |
| Label             | `@carsxe/design-system/components/label`             |
| Listbox           | `@carsxe/design-system/components/listbox`           |
| Marker            | `@carsxe/design-system/components/marker`            |
| Marquee           | `@carsxe/design-system/components/marquee`           |
| Menubar           | `@carsxe/design-system/components/menubar`           |
| Message           | `@carsxe/design-system/components/message`           |
| Message scroller  | `@carsxe/design-system/components/message-scroller`  |
| Native select     | `@carsxe/design-system/components/native-select`     |
| Navigation menu   | `@carsxe/design-system/components/navigation-menu`   |
| Number Input      | `@carsxe/design-system/components/number-input`      |
| Pagination        | `@carsxe/design-system/components/pagination`        |
| Password Input    | `@carsxe/design-system/components/password-input`    |
| Popover           | `@carsxe/design-system/components/popover`           |
| Progress          | `@carsxe/design-system/components/progress`          |
| QR Code           | `@carsxe/design-system/components/qr-code`           |
| Questionnaire     | `@carsxe/design-system/components/questionnaire`     |
| Radio group       | `@carsxe/design-system/components/radio-group`       |
| Rating Group      | `@carsxe/design-system/components/rating-group`      |
| Resizable         | `@carsxe/design-system/components/resizable`         |
| Scroll area       | `@carsxe/design-system/components/scroll-area`       |
| Select            | `@carsxe/design-system/components/select`            |
| Separator         | `@carsxe/design-system/components/separator`         |
| Sheet             | `@carsxe/design-system/components/sheet`             |
| Sidebar           | `@carsxe/design-system/components/sidebar`           |
| Signature Pad     | `@carsxe/design-system/components/signature-pad`     |
| Skeleton          | `@carsxe/design-system/components/skeleton`          |
| Slider            | `@carsxe/design-system/components/slider`            |
| Sonner            | `@carsxe/design-system/components/sonner`            |
| Spinner           | `@carsxe/design-system/components/spinner`           |
| Steps             | `@carsxe/design-system/components/steps`             |
| Swap              | `@carsxe/design-system/components/swap`              |
| Switch            | `@carsxe/design-system/components/switch`            |
| Table             | `@carsxe/design-system/components/table`             |
| Table of Contents | `@carsxe/design-system/components/table-of-contents` |
| Tabs              | `@carsxe/design-system/components/tabs`              |
| Tags Input        | `@carsxe/design-system/components/tags-input`        |
| Textarea          | `@carsxe/design-system/components/textarea`          |
| Timer             | `@carsxe/design-system/components/timer`             |
| Toast             | `@carsxe/design-system/components/toast`             |
| Toggle            | `@carsxe/design-system/components/toggle`            |
| Toggle group      | `@carsxe/design-system/components/toggle-group`      |
| Tour              | `@carsxe/design-system/components/tour`              |
| Tree View         | `@carsxe/design-system/components/tree-view`         |
| Tooltip           | `@carsxe/design-system/components/tooltip`           |

Sidebar also exposes `useIsMobile` from `@carsxe/design-system/hooks/use-mobile`.

Chart includes token-aware Recharts composition for Area, Bar, Line, Pie/Donut,
Radar, and Radial charts. D3 Charts exports `SankeyChart`,
`ForceDirectedGraph`, `TreemapChart`, and `SunburstChart` for relationship and
hierarchy data.

Heatmap is a GitHub-style calendar heatmap. Pass
`data={[{ date: "2026-08-12", value: 1240 }]}` (string dates are `YYYY-MM-DD`,
parsed as local days); values quantize into as many levels as the `colors`
array (five heatmap tokens by default, theme-aware), with zero or missing days
rendered in `emptyColor`. It has no `height` prop — height derives from width
and the number of weeks so cells stay square. `valueFormatter` drives both the
cell tooltips and the legend's "up to" maximum.

Code Block uses Shiki with a searchable catalog of all bundled light and dark
themes. It follows the app's `.dark` class by default, loads the selected theme
and language on demand, and includes copy feedback. Pass `theme="dracula"` for
an explicit theme or keep `theme="system"` for light/dark defaults.

Signature Pad can be used as the `SignaturePad` convenience component or with
the compound `SignaturePadRoot`, `SignaturePadLabel`, `SignaturePadControl`,
`SignaturePadSegment`, `SignaturePadGuide`, history triggers, and
`SignaturePadHiddenInput`. Use `useSignaturePad` with
`SignaturePadRootProvider` when the state and export methods must be controlled
outside the component tree.

Data Table, Date Picker, Forms, and Typography are composition recipes in the docs, not component import paths.

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
