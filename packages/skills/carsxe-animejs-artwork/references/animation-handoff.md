# Animation handoff from carsxe-feature-artwork

`carsxe-feature-artwork` produces a bitmap. Before writing SVG, inspect that bitmap at full size and write this handoff. It is the only bridge between the concept and the animation, so keep it short and factual.

## Template

```text
Feature: [feature name, e.g. VIN specifications]
Concept image: [path or URL of the accepted carsxe-feature-artwork output]
Destination: [component/file, rendered size, crop behavior, carousel or static]
ViewBox: 0 0 1536 1024

Composition groups (back to front):
- cx-vehicle: generic silver sedan, [position]
- cx-identifier: [primary input, e.g. VIN field], [position] (optional)
- cx-connectors: [n] cyan connectors from [source] to [targets]
- cx-card-[slug]: [label], [position]   (repeat for 3–6 cards)
- cx-accents: [timeline ticks, chart curve, grid cells…] (optional)

Verified labels (verbatim, uppercase): "[LABEL]", "[LABEL]", …
Placeholder values allowed: [generic values only, or none]

Motion story (2–4 beats):
1. Structure: [what draws first]
2. Flow: [which connector(s) carry a marker, from → to]
3. Result: [which cards/values reveal, in what order]
4. Settle: [final state; optional single ambient pulse]

Token roles: line → --art-line, connectors → --art-connector,
cards → --art-panel / --art-panel-border, fills → --art-tint,
labels → --art-label, canvas → --art-bg

Do not carry over: halftone dot texture, generated lettering errors,
[any stray marks, extra cards, or invented values seen in the bitmap]
```

## Mapping to implementation

| Handoff field | SVG / Anime.js responsibility |
| --- | --- |
| Composition groups | stable `cx-`-prefixed `<g>` layers with `data-anim` hooks |
| Motion story | timeline labels and ordered beats |
| Connectors | `data-path` routes for `svg.createMotionPath()` and `data-anim="draw"` strokes |
| Token roles | `--art-*` variables from the SKILL.md bridge, never sampled hex values |
| Verified labels | SVG `<text>` in `--font-mono`, verbatim |
| Do not carry over | omitted entirely from the SVG |

## Rules

- Keep the concept's layout. Positions in the SVG should land within a few percent of the bitmap so the static state still looks like the approved artwork.
- If the concept contains a label, value, or card that is not verified for the feature, drop it and note it under "Do not carry over" rather than reproducing it.
- If the concept is missing a group the motion story needs, regenerate or correct the concept with `carsxe-feature-artwork` instead of inventing it in SVG.
