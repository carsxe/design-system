import { Link, createFileRoute, notFound } from "@tanstack/react-router"
import { getSkill } from "@carsxe/skills"

import { Separator } from "@carsxe/design-system/components/separator"

import { CodeBlock } from "@carsxe/design-system/components/code-block"
import { CopyButton } from "@/components/copy-button"
import { DocsPageHeader } from "@/components/docs-page-header"
import { seo } from "@/lib/seo"
import { SITE_URL } from "@/lib/site"
import { loadSkill, skillMarkdownBody } from "@/lib/skills"

export const Route = createFileRoute("/docs/skills/$slug")({
  head: ({ params }) => {
    const skill = getSkill(params.slug)

    if (!skill) {
      return seo({
        title: "Skill",
        description: "Copy-pastable agent skills for @carsxe/design-system.",
        path: `/docs/skills/${params.slug}`,
        eyebrow: "Skill",
      })
    }

    return seo({
      title: skill.title,
      description: skill.description,
      path: `/docs/skills/${skill.slug}`,
      eyebrow: "Skill",
    })
  },
  component: SkillDetail,
})

function SkillDetail() {
  const { slug } = Route.useParams()
  const skill = loadSkill(slug)

  if (!skill) {
    throw notFound()
  }

  const skillMd = skillMarkdownBody(skill)
  const examples = skill.examples ?? []
  const pageMarkdown = [
    `# ${skill.title}`,
    "",
    skill.description,
    "",
    `Save as \`.cursor/skills/${skill.slug}/SKILL.md\`. Copy other files in this skill into the same folder.`,
    "",
    ...(examples.length
      ? [
          "## Examples",
          "",
          ...examples.flatMap((example) => [
            `![${example.alt}](${SITE_URL}${example.src})`,
            "",
            example.caption,
            "",
          ]),
        ]
      : []),
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

      {examples.length ? (
        <section className="flex flex-col gap-3">
          <Separator />
          <h2 className="font-heading text-2xl font-medium">Examples</h2>
          <p className="text-sm text-muted-foreground">
            Artwork this skill produced. Match this style, not these exact
            diagrams.
          </p>
          <div className="flex flex-col gap-6">
            {examples.map((example) => (
              <figure key={example.src} className="flex flex-col gap-2">
                <img
                  src={example.src}
                  alt={example.alt}
                  width={1536}
                  height={1024}
                  loading="lazy"
                  className="w-full border border-border bg-white"
                />
                <figcaption className="text-sm text-muted-foreground">
                  {example.caption}
                </figcaption>
              </figure>
            ))}
          </div>
        </section>
      ) : null}

      {skill.contents.map((file) => (
        <section key={file.name} className="flex flex-col gap-3">
          <Separator />
          <h2 className="font-heading text-2xl font-medium">{file.name}</h2>
          <CodeBlock code={file.content} language="markdown" />
        </section>
      ))}
    </article>
  )
}
