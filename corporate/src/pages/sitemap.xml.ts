/**
 * `/sitemap.xml`, at the literal path scanners look for.
 *
 * Built from `getIndexablePages()`, so a page hidden through `DISABLED_PAGES`
 * is never advertised. See that function and `@zatsit/components/sitemap` for
 * why this is a route rather than `@astrojs/sitemap`.
 */
import type { APIRoute } from 'astro';
import { sitemapResponse } from '@zatsit/components';
import { getIndexablePages } from '../lib/pages';

export const GET: APIRoute = ({ site }) =>
  sitemapResponse(
    getIndexablePages().map(({ path }) => ({ path, priority: path === '/' ? 1.0 : 0.8 })),
    site!,
  );
