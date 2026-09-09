/**
 * `/sitemap.xml`, at the literal path scanners look for.
 *
 * Built from `INDEXABLE_PAGES` rather than from Astro's route list, so the live
 * `/landscape/` page, which this project does not build, is not silently
 * omitted. See the reasoning in `@zatsit/components/sitemap`.
 */
import type { APIRoute } from 'astro';
import { sitemapResponse } from '@zatsit/components';
import { INDEXABLE_PAGES } from '../consts';

export const GET: APIRoute = ({ site }) =>
  sitemapResponse(
    INDEXABLE_PAGES.map(({ path }) => ({ path, priority: path === '/' ? 1.0 : 0.8 })),
    site!,
  );
