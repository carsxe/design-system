# Agent notes

Copy-pastable agent skills live in [`packages/skills`](packages/skills). They are not Cursor-only.

Each skill is a folder of markdown. Copy a skill into the tool you use, for example:

- Cursor: `.cursor/skills/<slug>/`
- Claude Code: the equivalent skills directory for that tool

Register new skills in [`packages/skills/index.ts`](packages/skills/index.ts). The docs catalog at `/docs/skills` lists every registered skill.

The first skill is [`carsxe-design-system`](packages/skills/carsxe-design-system): install `@carsxe/design-system`, import components and CSS, and do not run `shadcn add` in consumer apps.

[`carsxe-migrate-loop`](packages/skills/carsxe-migrate-loop) is a greploop: inventory leftover UI, migrate a slice, browser screenshot/video QA, and repeat until the app is fully on `@carsxe/design-system`. Copy it together with `carsxe-design-system`.

[`carsxe-feature-artwork`](packages/skills/carsxe-feature-artwork) generates the light navy-and-cyan vehicle-workflow illustrations used in auth side panels and marketing layouts. It ships a binary style reference at `assets/vehicle-image-workflow-reference.png`, so copy the whole folder from the repo rather than pasting `SKILL.md` alone from the docs catalog.
