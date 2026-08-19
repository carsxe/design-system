import { Link, createFileRoute } from "@tanstack/react-router"

import { CopyButton } from "@/components/copy-button"
import { AGENT_PROMPT } from "@/lib/agent-prompt"
import { listSkills } from "@/lib/skills"

export const Route = createFileRoute("/docs/skills/")({
  component: SkillsCatalog,
})

function SkillsCatalog() {
  const skills = listSkills()

  return (
    <article className="flex max-w-2xl flex-col gap-8">
      <header className="flex flex-col gap-2">
        <h1 className="font-heading text-4xl font-semibold tracking-tight">
          Skills
        </h1>
        <p className="text-muted-foreground">
          Copy-pastable agent skills from{" "}
          <code className="font-mono text-foreground">packages/skills</code>.
          Save a skill as{" "}
          <code className="font-mono text-foreground">
            .cursor/skills/&lt;slug&gt;/SKILL.md
          </code>{" "}
          or the equivalent folder for your agent.
        </p>
      </header>

      <section className="flex flex-col gap-3">
        <h2 className="font-heading text-2xl font-medium">Short prompt</h2>
        <div className="relative border border-border bg-muted">
          <div className="absolute top-2 right-2">
            <CopyButton text={AGENT_PROMPT} />
          </div>
          <pre className="overflow-x-auto p-4 pr-24 font-mono text-xs whitespace-pre-wrap">
            {AGENT_PROMPT}
          </pre>
        </div>
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
