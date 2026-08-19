import { Link, createFileRoute } from "@tanstack/react-router"

import { CodeBlock } from "@/components/code-block"
import { DocsPageHeader } from "@/components/docs-page-header"
import { AGENT_PROMPT } from "@/lib/agent-prompt"
import { listSkills } from "@/lib/skills"

export const Route = createFileRoute("/docs/skills/")({
  component: SkillsCatalog,
})

function skillsCatalogMarkdown() {
  const skills = listSkills()
  const catalog = skills
    .map(
      (skill) =>
        `- [${skill.title}](/docs/skills/${skill.slug}) (\`${skill.slug}\`) — ${skill.description}`
    )
    .join("\n")

  return `# Skills

Copy-pastable agent skills from \`packages/skills\`. Save a skill as \`.cursor/skills/<slug>/SKILL.md\` or the equivalent folder for your agent.

## Short prompt

\`\`\`
${AGENT_PROMPT}
\`\`\`

## Catalog

${catalog}
`
}

function SkillsCatalog() {
  const skills = listSkills()

  return (
    <article className="flex max-w-2xl flex-col gap-8">
      <DocsPageHeader
        title="Skills"
        description={
          <>
            Copy-pastable agent skills from{" "}
            <code className="font-mono text-foreground">packages/skills</code>.
            Save a skill as{" "}
            <code className="font-mono text-foreground">
              .cursor/skills/&lt;slug&gt;/SKILL.md
            </code>{" "}
            or the equivalent folder for your agent.
          </>
        }
        markdown={skillsCatalogMarkdown()}
      />

      <section className="flex flex-col gap-3">
        <h2 className="font-heading text-2xl font-medium">Short prompt</h2>
        <CodeBlock code={AGENT_PROMPT} lang="plaintext" />
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="font-heading text-2xl font-medium">Catalog</h2>
        <ul className="flex flex-col border border-border">
          {skills.map((skill) => (
            <li
              key={skill.slug}
              className="flex flex-col gap-1 border-b border-border p-4 last:border-0"
            >
              <Link
                to="/docs/skills/$slug"
                params={{ slug: skill.slug }}
                className="font-medium text-foreground hover:underline"
              >
                {skill.title}
              </Link>
              <p className="text-sm text-muted-foreground">
                {skill.description}
              </p>
              <p className="font-mono text-xs text-muted-foreground">
                {skill.slug}
              </p>
            </li>
          ))}
        </ul>
      </section>
    </article>
  )
}
