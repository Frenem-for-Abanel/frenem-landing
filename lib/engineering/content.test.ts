import fs from "node:fs"
import os from "node:os"
import path from "node:path"
import { afterEach, describe, expect, it } from "vitest"
import { loadEngineeringContent, tintClass } from "./content"

const roots: string[] = []

afterEach(() => {
  while (roots.length > 0) {
    fs.rmSync(roots.pop() as string, { recursive: true, force: true })
  }
})

/** Write a throwaway content root; paths are "essays/x.mdx" or "log/y.mdx". */
function contentRoot(files: Record<string, string>): string {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "frenem-engineering-"))
  roots.push(root)
  for (const [relative, contents] of Object.entries(files)) {
    const target = path.join(root, relative)
    fs.mkdirSync(path.dirname(target), { recursive: true })
    fs.writeFileSync(target, contents)
  }
  return root
}

const TLDR = `<Tldr>

- First bullet.
- Second bullet.

</Tldr>`

const FIGURE = `<Figure caption="A caption.">
  <svg viewBox="0 0 10 10" />
</Figure>`

function essay(overrides: Record<string, string> = {}, body?: string): string {
  const frontmatter = {
    title: `"An essay"`,
    summary: `"One sentence of standfirst."`,
    date: `"2026-01-02"`,
    type: `"essay"`,
    pillar: `"method"`,
    featured: "true",
    ...overrides,
  }
  const yaml = Object.entries(frontmatter)
    .map(([key, value]) => `${key}: ${value}`)
    .join("\n")
  return `---\n${yaml}\n---\n\n${body ?? `${TLDR}\n\n${FIGURE}\n\nBody prose.`}\n`
}

function note(overrides: Record<string, string> = {}): string {
  const frontmatter = {
    title: `"A note"`,
    summary: `"One sentence."`,
    date: `"2026-01-01"`,
    type: `"note"`,
    ...overrides,
  }
  const yaml = Object.entries(frontmatter)
    .map(([key, value]) => `${key}: ${value}`)
    .join("\n")
  return `---\n${yaml}\n---\n\nNote body.\n`
}

/** The message for a single failing file, without the summary line. */
function failureFor(files: Record<string, string>): string {
  try {
    loadEngineeringContent(contentRoot(files))
  } catch (error) {
    return (error as Error).message
  }
  throw new Error("expected content validation to fail, but it passed")
}

describe("loadEngineeringContent", () => {
  it("reads a valid essay and log entry, newest first", () => {
    const entries = loadEngineeringContent(
      contentRoot({ "essays/an-essay.mdx": essay(), "log/a-note.mdx": note() })
    )
    expect(entries.map((entry) => entry.slug)).toEqual(["an-essay", "a-note"])
    expect(entries[0]).toMatchObject({ type: "essay", pillar: "method", featured: true })
    expect(entries[0].readingTime).toMatch(/min read/)
    expect(entries[1]).toMatchObject({ type: "note", featured: false })
    expect(entries[1].readingTime).toBeUndefined()
  })

  it("orders same-day entries by slug so output is deterministic", () => {
    const entries = loadEngineeringContent(
      contentRoot({
        "essays/an-essay.mdx": essay({ date: `"2026-03-03"` }),
        "log/b-second.mdx": note({ date: `"2026-05-05"` }),
        "log/a-first.mdx": note({ date: `"2026-05-05"` }),
      })
    )
    expect(entries.map((entry) => entry.slug)).toEqual(["a-first", "b-second", "an-essay"])
  })

  it("treats a missing log directory as an empty log", () => {
    const entries = loadEngineeringContent(contentRoot({ "essays/an-essay.mdx": essay() }))
    expect(entries).toHaveLength(1)
  })

  it("returns the opening figure for essays only", () => {
    const [pinned, plain] = loadEngineeringContent(
      contentRoot({ "essays/an-essay.mdx": essay(), "log/a-note.mdx": note() })
    )
    expect(pinned.openingFigure).toContain("<Figure")
    expect(plain.openingFigure).toBeUndefined()
  })

  it("takes the first figure in document order, not the first block form", () => {
    const body = `${TLDR}\n\n<Figure placeholder="Screenshot" />\n\nProse.\n\n${FIGURE}`
    const [entry] = loadEngineeringContent(contentRoot({ "essays/an-essay.mdx": essay({}, body) }))
    expect(entry.openingFigure).toBe(`<Figure placeholder="Screenshot" />`)
  })

  it("excludes code blocks from the reading time", () => {
    const code = ["```python", "x = 1", "```"].join("\n")
    const long = `${TLDR}\n\n${FIGURE}\n\n${code.repeat(40)}`
    const [entry] = loadEngineeringContent(contentRoot({ "essays/an-essay.mdx": essay({}, long) }))
    expect(entry.readingTime).toBe("1 min read")
  })
})

describe("frontmatter rules", () => {
  it("rejects an author field by name", () => {
    const message = failureFor({
      "essays/an-essay.mdx": essay({ author: `"A Person"` }),
    })
    expect(message).toContain("the schema has no author field")
  })

  it("rejects unknown keys such as a location", () => {
    const message = failureFor({
      "essays/an-essay.mdx": essay({ location: `"Somewhere"` }),
    })
    expect(message).toContain(`unknown frontmatter key "location"`)
  })

  it.each([
    ["a timestamp", `"2026-01-02T14:30:00"`],
    ["an unpadded date", `"2026-1-2"`],
    ["a date that does not exist", `"2026-02-31"`],
  ])("rejects %s", (_label, date) => {
    expect(failureFor({ "essays/an-essay.mdx": essay({ date }) })).toContain(
      "dates, never timestamps"
    )
  })

  it("accepts an unquoted YAML date as a plain calendar date", () => {
    const [entry] = loadEngineeringContent(
      contentRoot({ "essays/an-essay.mdx": essay({ date: "2026-04-05" }) })
    )
    expect(entry.date).toBe("2026-04-05")
  })

  it.each([
    ["title", { title: `""` }],
    ["summary", { summary: `""` }],
  ])("requires a non-empty %s", (field, override) => {
    expect(failureFor({ "essays/an-essay.mdx": essay(override) })).toContain(`"${field}" is required`)
  })

  it("requires a pillar on essays and validates its value", () => {
    expect(failureFor({ "essays/an-essay.mdx": essay({ pillar: `"culture"` }) })).toContain(
      `"pillar" must be one of`
    )
  })

  it("validates the product tint", () => {
    expect(failureFor({ "essays/an-essay.mdx": essay({ product: `"pulseX"` }) })).toContain(
      `"product" must be one of`
    )
  })

  it("keeps essays and log entries in their own directories", () => {
    const message = failureFor({
      "essays/an-essay.mdx": essay(),
      "essays/a-note.mdx": note(),
      "log/an-orphan-essay.mdx": essay({ featured: "false" }),
    })
    expect(message).toContain(`content/essays/ may only hold type "essay"`)
    expect(message).toContain("essays live in content/essays/")
  })

  it("rejects a filename that is not a kebab-case slug", () => {
    expect(failureFor({ "essays/An Essay.mdx": essay() })).toContain("kebab-case slug")
  })

  it("rejects non-mdx files in a content directory", () => {
    expect(
      failureFor({ "essays/an-essay.mdx": essay(), "log/notes.txt": "loose" })
    ).toContain("only .mdx files belong in content/")
  })

  it("rejects a slug used twice across directories", () => {
    expect(
      failureFor({ "essays/twice.mdx": essay(), "log/twice.mdx": note() })
    ).toContain(`duplicate slug "twice"`)
  })
})

describe("the pinned essay", () => {
  it("fails when nothing is pinned", () => {
    expect(failureFor({ "essays/an-essay.mdx": essay({ featured: "false" }) })).toContain(
      "none is pinned"
    )
  })

  it("fails when two essays are pinned, naming both", () => {
    const message = failureFor({
      "essays/one.mdx": essay(),
      "essays/two.mdx": essay({ date: `"2026-02-02"` }),
    })
    expect(message).toContain("one, two")
  })

  it("refuses to pin anything that is not an essay", () => {
    expect(
      failureFor({ "essays/an-essay.mdx": essay(), "log/a-note.mdx": note({ featured: "true" }) })
    ).toContain(`only essays may set "featured"`)
  })

  it("explains that a pinned essay left in draft counts as unpinned", () => {
    expect(failureFor({ "essays/an-essay.mdx": essay({ draft: "true" }) })).toContain(
      "a pinned essay left in draft counts as unpinned"
    )
  })
})

describe("drafts", () => {
  it("keeps a draft out of the output", () => {
    const entries = loadEngineeringContent(
      contentRoot({
        "essays/an-essay.mdx": essay(),
        "log/parked.mdx": note({ draft: "true" }),
      })
    )
    expect(entries.map((entry) => entry.slug)).toEqual(["an-essay"])
  })

  it("lets a draft park with incomplete frontmatter", () => {
    const parked = `---\ntitle: "Half written"\ntype: "note"\ndraft: true\n---\n\nStill thinking.\n`
    const entries = loadEngineeringContent(
      contentRoot({ "essays/an-essay.mdx": essay(), "log/parked.mdx": parked })
    )
    expect(entries.map((entry) => entry.slug)).toEqual(["an-essay"])
  })

  it("still catches a draft that squats on a published slug", () => {
    expect(
      failureFor({ "essays/twice.mdx": essay(), "log/twice.mdx": note({ draft: "true" }) })
    ).toContain(`duplicate slug "twice"`)
  })

  it("rejects a non-boolean draft flag rather than guessing", () => {
    expect(
      failureFor({ "essays/an-essay.mdx": essay(), "log/a-note.mdx": note({ draft: `"yes"` }) })
    ).toContain(`"draft" must be a boolean`)
  })
})

describe("essay body rules", () => {
  it("requires a Tldr card", () => {
    const message = failureFor({
      "essays/an-essay.mdx": essay({}, `${FIGURE}\n\nProse.`),
    })
    expect(message).toContain("<Tldr> card")
  })

  it("catches a Tldr list that MDX would flatten into a paragraph", () => {
    const tight = `<Tldr>\n- First bullet.\n- Second bullet.\n</Tldr>`
    const message = failureFor({
      "essays/an-essay.mdx": essay({}, `${tight}\n\n${FIGURE}\n\nProse.`),
    })
    expect(message).toContain("blank line above and below its list")
  })

  it.each([
    ["too few", ["- Only one."]],
    ["too many", ["- One.", "- Two.", "- Three.", "- Four.", "- Five."]],
  ])("rejects %s Tldr bullets", (_label, bullets) => {
    const card = `<Tldr>\n\n${bullets.join("\n")}\n\n</Tldr>`
    const message = failureFor({
      "essays/an-essay.mdx": essay({}, `${card}\n\n${FIGURE}\n\nProse.`),
    })
    expect(message).toContain("takes 2-4 bullets")
  })

  it("requires a figure", () => {
    expect(failureFor({ "essays/an-essay.mdx": essay({}, `${TLDR}\n\nProse only.`) })).toContain(
      "every essay opens with a <Figure>"
    )
  })

  it("enforces figure-first when prose comes before the figure", () => {
    const body = `${TLDR}\n\nProse that jumped the queue.\n\n${FIGURE}`
    expect(failureFor({ "essays/an-essay.mdx": essay({}, body) })).toContain(
      "must come before the prose"
    )
  })

  it("allows comments and the Tldr card above the figure", () => {
    const body = `{/* A note to editors. */}\n\n${TLDR}\n\n${FIGURE}\n\nProse.`
    expect(loadEngineeringContent(contentRoot({ "essays/an-essay.mdx": essay({}, body) }))).toHaveLength(1)
  })

  it("reports every problem in one pass", () => {
    const message = failureFor({
      "essays/an-essay.mdx": essay({ author: `"A Person"`, date: `"2026-01-02T09:00:00"` }, "No card, no figure."),
    })
    expect(message).toContain("author field")
    expect(message).toContain("dates, never timestamps")
    expect(message).toContain("<Tldr> card")
    expect(message).toContain("<Figure>")
  })
})

describe("tintClass", () => {
  it("uses the product signature when set, and the brand tint otherwise", () => {
    expect(tintClass({ product: "prism" })).toBe("tint-prism")
    expect(tintClass({ product: undefined })).toBe("tint-brand")
  })
})
