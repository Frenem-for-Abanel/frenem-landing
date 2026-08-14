/**
 * Retired log hashes. Notes live at /engineering/log#slug, and the fragment
 * never reaches the server, so these are resolved in the page (anchor + rewrite)
 * rather than next.config redirects.
 */
export const LOG_SLUG_ALIASES: Record<string, readonly string[]> = {
  "the-backup-test": ["hashing-otps-at-rest"],
  "the-chart-is-not-a-slide": ["saved-views-in-prism"],
}

export function aliasesForSlug(slug: string): readonly string[] {
  return LOG_SLUG_ALIASES[slug] ?? []
}

/** alias → current slug, for rewriting location.hash on the archive. */
export function logAliasRedirects(): Record<string, string> {
  const redirects: Record<string, string> = {}
  for (const [slug, aliases] of Object.entries(LOG_SLUG_ALIASES)) {
    for (const alias of aliases) {
      redirects[alias] = slug
    }
  }
  return redirects
}