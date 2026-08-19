import { Link, createFileRoute, notFound } from "@tanstack/react-router"

import { Separator } from "@carsxe/design-system/components/separator"

import { CodeBlock } from "@/components/code-block"
import { CopyButton } from "@/components/copy-button"
import { DocsPageHeader } from "@/components/docs-page-header"
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
  const pageMarkdown = [
    `# ${skill.title}`,
    "",
    skill.description,
    "",
    `Save as \`.cursor/skills/${skill.slug}/SKILL.md\`. Copy other files in this skill into the same folder.`,
    "",
    ...skill.contents.flatMap((file) => [
      `## ${file.name}`,
      "",
      file.content,
      "",
    ]),
  ].join("\n")

  return (
    <article className="flex max-w-2xl flex-col gap-8">
      <Link
        to="/docs/skills"
        className="text-sm text-muted-foreground hover:text-foreground"
      >
        Skills
      </Link>
      <DocsPageHeader
        title={skill.title}
        description={
          <>
            {skill.description}
            <span className="mt-2 block text-sm">
              Save as{" "}
              <code className="font-mono text-foreground">
                .cursor/skills/{skill.slug}/SKILL.md
              </code>
              . Copy other files in this skill into the same folder.
            </span>
          </>
        }
        markdown={pageMarkdown}
      />
      <div>
        <CopyButton
          text={skillMd}
          label="Copy skill"
          copiedLabel="Copied skill"
        />
      </div>

      {skill.contents.map((file) => (
        <section key={file.name} className="flex flex-col gap-3">
          <Separator />
          <h2 className="font-heading text-2xl font-medium">{file.name}</h2>
          <CodeBlock code={file.content} lang="markdown" />
        </section>
      ))}
    </article>
  )
}
