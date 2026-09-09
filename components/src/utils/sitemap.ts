/**
 * A sitemap, rendered from an explicit list of paths.
 *
 * Written by hand rather than pulled from `@astrojs/sitemap`, for three reasons
 * that all point the same way on sites this small:
 *
 * 1. **The literal path.** The integration emits `sitemap-index.xml` plus
 *    `sitemap-0.xml`, and several scanners look only for `/sitemap.xml`. An
 *    Astro redirect would answer that path with an HTML meta-refresh page,
 *    which is the wrong content type for a crawler following it.
 * 2. **`DISABLED_PAGES`.** The integration builds its list from the routes
 *    Astro knows, while `corporate/src/lib/build-hook.ts` deletes disabled
 *    pages in `astro:build:done`. Wired naively it advertises pages that were
 *    deleted seconds earlier. Taking the list as an argument makes that
 *    impossible rather than merely unlikely.
 * 3. **One less dependency**, which the eco-design rules ask for and which ten
 *    static pages do not justify spending.
 *
 * The 50 000-URL and 50 MB limits that make a segmented sitemap necessary are
 * three orders of magnitude away. Revisit this if a site here ever grows a
 * content collection.
 */

export interface SitemapEntry {
  /** Root-relative path, with the trailing slash the site emits. */
  path: string;
  /** 0.0 to 1.0. Omitted from the output when absent, never guessed. */
  priority?: number;
}

function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/**
 * No `lastmod` and no `changefreq`.
 *
 * Both would have to be invented: neither site tracks a per-page modification
 * date, and a build timestamp would claim that every page changed on every
 * deploy, which is worse than saying nothing. Google ignores `changefreq`
 * outright and distrusts a `lastmod` that always equals the crawl date.
 */
export function renderSitemap(entries: SitemapEntry[], site: URL): string {
  const urls = entries
    .map(({ path, priority }) => {
      const loc = escapeXml(new URL(path, site).href);
      const priorityTag =
        priority === undefined ? '' : `\n    <priority>${priority.toFixed(1)}</priority>`;
      return `  <url>\n    <loc>${loc}</loc>${priorityTag}\n  </url>`;
    })
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;
}

/** The response shape both sites' `/sitemap.xml` routes return. */
export function sitemapResponse(entries: SitemapEntry[], site: URL): Response {
  return new Response(renderSitemap(entries, site), {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
}
