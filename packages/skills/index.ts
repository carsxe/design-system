export type SkillExample = {
  /** Site-relative path under apps/web/public. */
  src: string
  alt: string
  caption: string
}

export type Skill = {
  slug: string
  title: string
  description: string
  files: string[]
  /** Sample output, for skills whose result is visual. */
  examples?: SkillExample[]
}

export const skills: Skill[] = [
  {
    slug: "carsxe-design-system",
    title: "Carsxe Design System",
    description:
      "Install and use @carsxe/design-system — shadcn components, Button, CSS tokens. Do not run shadcn add in consumer apps.",
    files: ["SKILL.md", "reference.md"],
  },
  {
    slug: "carsxe-migrate-loop",
    title: "Carsxe migrate loop",
    description:
      "Loop until a consumer app is fully migrated onto @carsxe/design-system: grep leftover UI, migrate a slice, browser screenshot/video QA, repeat until complete.",
    files: ["SKILL.md", "inventory.md", "visual-qa.md"],
  },
  {
    slug: "carsxe-feature-artwork",
    title: "Carsxe feature artwork",
    description:
      "Generate consistent Carsxe technical vehicle-feature artwork for auth side panels, feature carousels, and marketing layouts — light navy-and-cyan workflow style, 1536x1024, #F9F9F9 background.",
    files: ["SKILL.md"],
    examples: [
      {
        src: "/skills/carsxe-feature-artwork/vehicle-image-workflow.webp",
        alt: "Silver sedan connected by cyan lines to a camera frame, input parameters card, angle set, and output library",
        caption:
          "Vehicle images — the bundled style reference (assets/vehicle-image-workflow-reference.png).",
      },
      {
        src: "/skills/carsxe-feature-artwork/vin-specifications-workflow.webp",
        alt: "Silver sedan under a VIN input field, connected to vehicle identity, engine, dimensions, and equipment cards",
        caption:
          "VIN specifications — a primary identifier above the vehicle, four spec cards below.",
      },
      {
        src: "/skills/carsxe-feature-artwork/vehicle-history-workflow.webp",
        alt: "Silver sedan connected to a dated history timeline and cards for ownership, title, accidents, service, and mileage",
        caption:
          "Vehicle history — a timeline panel plus five status cards, same linework and connectors.",
      },
      {
        src: "/skills/carsxe-feature-artwork/market-value-workflow.webp",
        alt: "Silver sedan connected to trade-in, private party, and retail value cards, a price range curve, and comparable sales rows",
        caption:
          "Market value — value tiers, a price range chart, and comparable sales rows.",
      },
    ],
  },
]

export function getSkill(slug: string) {
  return skills.find((skill) => skill.slug === slug)
}
