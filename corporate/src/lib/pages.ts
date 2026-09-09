export const ALWAYS_GENERATED_PAGES = ['index', 'legal-notice', 'privacy-policy']
export const CONTROLLABLE_PAGES = ['careers', 'find-us', 'join-us', 'team', 'tech', 'work-with-us']

export function getDisabledPages(): string[] {
  const DISABLED_PAGES = process.env.DISABLED_PAGES ?? ''
  if (!DISABLED_PAGES || DISABLED_PAGES.trim() === '') {
    return []
  }
  return DISABLED_PAGES.split(',').map(slug => slug.trim())
}

export function isPageDisabled(slug: string): boolean {
  return getDisabledPages().includes(slug)
}

export interface IndexablePage {
  slug: string
  /** Root-relative path, with the trailing slash `trailingSlash: 'always'` emits. */
  path: string
}

/**
 * Every page a crawler should be told about: what this build actually emits.
 *
 * This is the single source for `/sitemap.xml` and `/llms.txt`, and it exists so
 * neither can advertise a page that `build-hook.ts` deletes.
 *
 * That trap is why the sitemap here is a route rather than `@astrojs/sitemap`:
 * the integration builds its list from the routes Astro knows, and the deletion
 * happens afterwards in `astro:build:done`, so it would publish URLs that 404
 * by the time the build finishes. Deriving the list from `getDisabledPages()`
 * makes the mistake impossible instead of merely unlikely.
 *
 * `404` is absent on purpose: it is emitted as `dist/404.html`, it is not a
 * page worth indexing, and it carries `noindex`.
 */
export function getIndexablePages(): IndexablePage[] {
  const disabled = getDisabledPages()
  return [...ALWAYS_GENERATED_PAGES, ...CONTROLLABLE_PAGES]
    .filter(slug => !disabled.includes(slug))
    .map(slug => ({ slug, path: slug === 'index' ? '/' : `/${slug}/` }))
}
