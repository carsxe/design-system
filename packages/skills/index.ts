export type Skill = {
  slug: string
  title: string
  description: string
  files: string[]
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
]

export function getSkill(slug: string) {
  return skills.find((skill) => skill.slug === slug)
}
