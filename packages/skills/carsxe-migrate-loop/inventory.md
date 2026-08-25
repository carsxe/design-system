# Leftover UI inventory

Count **covered** hits only. Covered = a primitive that `@carsxe/design-system` ships. Uncovered third-party UI is listed in the report, not counted against done.

## Exclude

Do not search these directories:

```
node_modules
dist
.build
.output
.next
coverage
build
.turbo
.carsxe-migrate-loop
storybook-static
```

Typical ripgrep:

```bash
rg -n --glob '!node_modules/**' --glob '!dist/**' --glob '!.next/**' \
  --glob '!.output/**' --glob '!coverage/**' --glob '!build/**' \
  --glob '!.turbo/**' --glob '!.carsxe-migrate-loop/**' \
  -e '<pattern>'
```

## Covered primitives

These names match `carsxe-design-system/reference.md`:

accordion, alert, alert-dialog, aspect-ratio, attachment, avatar, badge, breadcrumb, bubble, button, button-group, calendar, card, carousel, chart, checkbox, collapsible, combobox, command, context-menu, dialog, direction, drawer, dropdown-menu, empty, field, hover-card, input, input-group, input-otp, item, kbd, label, marker, menubar, message, message-scroller, native-select, navigation-menu, pagination, popover, progress, questionnaire, radio-group, resizable, scroll-area, select, separator, sheet, sidebar, skeleton, slider, sonner, spinner, switch, table, tabs, textarea, toast, toggle, toggle-group, tooltip

`sonner` also appears as `toast` in some shadcn apps. Treat local `sonner.tsx` / `toaster.tsx` that wrap Sonner as covered.

## Patterns to count

### Local shadcn / ui-kit imports

```
from ["']@/components/ui/
from ["']~/components/ui/
from ["']@/components/ui["']
from ["']~/components/ui["']
```

Also count relative imports into a `components/ui/` (or `src/ui/`) folder when the file is a covered primitive, for example:

```
from ["'].*/components/ui/(accordion|alert|alert-dialog|aspect-ratio|attachment|avatar|badge|breadcrumb|bubble|button|button-group|calendar|card|carousel|chart|checkbox|collapsible|combobox|command|context-menu|dialog|direction|drawer|dropdown-menu|empty|field|hover-card|input|input-group|input-otp|item|kbd|label|marker|menubar|message|message-scroller|native-select|navigation-menu|pagination|popover|progress|questionnaire|radio-group|resizable|scroll-area|select|separator|sheet|sidebar|skeleton|slider|sonner|spinner|switch|table|tabs|textarea|toast|toggle|toggle-group|tooltip|toaster)["']
```

### Local source copies

A file is a leftover copy when its path looks like:

```
**/components/ui/<primitive>.tsx
**/components/ui/<primitive>.ts
**/ui/<primitive>.tsx
```

and `<primitive>` is in the covered list (plus `toaster`). Count each such file once, in addition to import hits.

Do **not** count files under `node_modules/@carsxe/design-system`.

### shadcn CLI leftovers aimed at those primitives

Count `shadcn add` / `npx shadcn@latest add` invocations in scripts, README, or comments that add a covered primitive.

A root `components.json` that still aliases `@/components/ui` is a **flag**, not an automatic delete. Note it in the report. Only count it as a hit if the app still resolves covered primitives through that alias.

### Direct headless imports when a DS component exists

Count consumer-app imports of `@radix-ui/*`, `@base-ui/react`, or the direct dependencies used by covered primitives when they duplicate a shipped component.

Do **not** count those imports inside `node_modules`. Do not count app-specific controls whose behavior is materially different from a design-system primitive.

## Do not count (uncovered)

List these in the report under **Uncovered (not blocking)**:

- Maps, editors, and app-specific data grids
- `@carsxe/ui` widgets and edit-mode
- App-specific composites (page shells, feature cards) that compose primitives but are not themselves primitives
- Icon packages (`lucide-react`, and so on)
- `cn()` / `class-variance-authority` utilities in the app, unless they exist only to wrap a covered primitive

## Done check

Covered inventory is 0 when:

1. No import hits for the patterns above
2. No local `components/ui/<primitive>` source files remain for covered primitives
3. No `@radix-ui/*` / `@base-ui/react` hits that duplicate a shipped primitive

After deleting a local primitive, grep once more for that filename so dangling imports are not missed.
