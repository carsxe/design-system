import { Link, createFileRoute, notFound } from "@tanstack/react-router"

import { Separator } from "@carsxe/design-system/components/separator"

import { CopyButton } from "@/components/copy-button"
import { loadSkill, skillMarkdownBody } from "@/lib/skills"

export const Route = createFileRoute("/docs/skills/$slug")({
  component: SkillDetail,
})

function SkillDetail() {
  const { slug } = Route.useParams()
  const skill = loadSkill(slug)

  if (!skill) {
    throw notFound()
  }

  const skillMd = skillMarkdownBody(skill)

  return (
    <article className="flex max-w-2xl flex-col gap-8">
      <header className="flex flex-col gap-3">
        <Link
          to="/docs/skills"
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          Skills
        </Link>
        <h1 className="font-heading text-4xl font-semibold tracking-tight">
          {skill.title}
        </h1>
        <p className="text-muted-foreground">{skill.description}</p>
        <p className="text-sm text-muted-foreground">
          Save as{" "}
          <code className="font-mono text-foreground">
            .cursor/skills/{skill.slug}/SKILL.md
          </code>
          . Copy other files in this skill into the same folder.
        </p>
        <div>
          <CopyButton
            text={skillMd}
            label="Copy skill"
            copiedLabel="Copied skill"
          />
        </div>
      </header>

      {skill.contents.map((file) => (
        <section key={file.name} className="flex flex-col gap-3">
          <Separator />
          <h2 className="font-heading text-2xl font-medium">{file.name}</h2>
          <pre className="overflow-x-auto border border-border bg-muted p-4 font-mono text-xs whitespace-pre-wrap">
            {file.content}
          </pre>
        </section>
      ))}
    </article>
  )
}
