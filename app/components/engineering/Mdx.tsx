import { MDXRemote } from "next-mdx-remote-client/rsc"
import rehypePrettyCode, { type Options } from "rehype-pretty-code"
import type { ComponentPropsWithoutRef } from "react"
import Figure from "./Figure"
import Tldr from "./Tldr"

const prettyCodeOptions: Options = {
  theme: "github-light",
  keepBackground: false,
  defaultLang: "plaintext",
}

/**
 * Inline code stays editorial; fenced blocks arrive from rehype-pretty-code
 * (flagged with data-language) already highlighted and pass through untouched.
 */
function Code(props: ComponentPropsWithoutRef<"code">) {
  if ("data-language" in props) return <code {...props} />
  return (
    <code
      className="rounded border border-line bg-paper-soft px-1.5 py-0.5 font-mono text-[0.85em] text-ink"
      {...props}
    />
  )
}

const components = {
  Figure,
  Tldr,
  h2: (props: ComponentPropsWithoutRef<"h2">) => (
    <h2
      className="mb-4 mt-10 font-display text-[24px] font-semibold leading-tight tracking-[-0.012em] text-ink md:text-[28px]"
      {...props}
    />
  ),
  h3: (props: ComponentPropsWithoutRef<"h3">) => (
    <h3
      className="mb-3 mt-8 font-display text-[19px] font-semibold leading-snug tracking-[-0.01em] text-ink md:text-[21px]"
      {...props}
    />
  ),
  p: (props: ComponentPropsWithoutRef<"p">) => (
    <p className="my-5 text-base leading-[1.75] text-ink-secondary" {...props} />
  ),
  a: (props: ComponentPropsWithoutRef<"a">) => (
    <a
      className="text-ink underline decoration-line-strong underline-offset-4 transition-colors hover:text-(--tint-ink) hover:decoration-(--tint-ink)"
      {...props}
    />
  ),
  strong: (props: ComponentPropsWithoutRef<"strong">) => (
    <strong className="font-semibold text-ink" {...props} />
  ),
  ul: (props: ComponentPropsWithoutRef<"ul">) => (
    <ul className="my-5 list-disc space-y-2 pl-5 marker:text-(--tint-ink)" {...props} />
  ),
  ol: (props: ComponentPropsWithoutRef<"ol">) => (
    <ol
      className="my-5 list-decimal space-y-2 pl-5 marker:font-mono marker:text-[13px] marker:text-ink-tertiary"
      {...props}
    />
  ),
  li: (props: ComponentPropsWithoutRef<"li">) => (
    <li className="pl-1 text-base leading-[1.75] text-ink-secondary" {...props} />
  ),
  blockquote: (props: ComponentPropsWithoutRef<"blockquote">) => (
    <blockquote
      className="my-6 border-l-2 border-(--tint-ink) pl-5 italic [&_p]:text-ink-secondary"
      {...props}
    />
  ),
  hr: (props: ComponentPropsWithoutRef<"hr">) => (
    <hr className="my-10 border-line" {...props} />
  ),
  pre: (props: ComponentPropsWithoutRef<"pre">) => (
    <pre
      className="my-6 overflow-x-auto rounded-lg border border-line bg-paper-soft p-4 font-mono text-[13px] leading-[1.7] sm:p-5"
      {...props}
    />
  ),
  code: Code,
}

/** Shared MDX renderer for essay bodies, inline log entries, and figures. */
export default function Mdx({ source }: { source: string }) {
  return (
    <MDXRemote
      source={source}
      components={components}
      options={{ mdxOptions: { rehypePlugins: [[rehypePrettyCode, prettyCodeOptions]] } }}
    />
  )
}
