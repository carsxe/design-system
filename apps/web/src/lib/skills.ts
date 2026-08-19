import { getSkill, skills, type Skill } from "@carsxe/skills"

const skillMarkdown = import.meta.glob("../../../../packages/skills/**/*.md", {
  query: "?raw",
  import: "default",
  eager: true,
})

function fileContent(slug: string, name: string) {
  const suffix = `/packages/skills/${slug}/${name}`
  const entry = Object.entries(skillMarkdown).find(([path]) =>
    path.replaceAll("\\", "/").endsWith(suffix)
  )
  return entry?.[1] ?? ""
}

export type SkillWithFiles = Skill & {
  contents: { name: string; content: string }[]
}

export function listSkills(): Skill[] {
  return skills
}

export function loadSkill(slug: string): SkillWithFiles | undefined {
  const skill = getSkill(slug)
  if (!skill) return undefined

  return {
    ...skill,
    contents: skill.files.map((name) => ({
      name,
      content: fileContent(slug, name),
    })),
  }
}

export function skillMarkdownBody(skill: SkillWithFiles) {
  return skill.contents.find((file) => file.name === "SKILL.md")?.content ?? ""
}
