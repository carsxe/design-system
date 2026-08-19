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
]

export function getSkill(slug: string) {
  return skills.find((skill) => skill.slug === slug)
}
