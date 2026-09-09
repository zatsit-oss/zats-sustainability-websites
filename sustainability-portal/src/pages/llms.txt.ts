/**
 * `llms.txt`, at the site root.
 *
 * A route rather than a file in `public/`: a hand-written list is wrong the day
 * after the next page ships. Built from the same `INDEXABLE_PAGES` the sitemap
 * reads, so the two can never disagree.
 *
 * A proposal, not a standard: no major provider has committed to reading it, so
 * this is a low-cost bet rather than a requirement, and removing it would cost
 * nothing. Kept factual, with no adjective a machine would have to weigh.
 */
import type { APIRoute } from 'astro';
import { BLOG_URL, ZATSIT_WEBSITE_URL } from 'astro:env/client';
import { INDEXABLE_PAGES, SITE_DESCRIPTION } from '../consts';

export const GET: APIRoute = ({ site }) => {
  const url = (path: string) => new URL(path, site!).href;
  const lines: string[] = [];
  const w = (line = '') => lines.push(line);

  w('# zatsit sustainability');
  w();
  w(`> ${SITE_DESCRIPTION}`);
  w();
  w(
    'Static site, no tracker and no cookie, published by zatsit, a French tech ' +
      'consultancy based in Lille. Written in English; the corporate site is in ' +
      'French. Every page is readable without executing JavaScript.',
  );
  w();

  w('## Pages');
  w();
  for (const { path, title, summary } of INDEXABLE_PAGES) {
    w(`- [${title}](${url(path)}) - ${summary}`);
  }
  w();

  w('## Elsewhere');
  w();
  w(`- [zatsit corporate site](${ZATSIT_WEBSITE_URL}) - who we are and what we do, in French`);
  w(`- [zatsit tech blog](${BLOG_URL}) - articles by our consultants, in French`);
  w();

  // Named so staleness is visible rather than silent: a page list that says
  // nothing about when it was written is worse than no list.
  w(`Generated on ${new Date().toISOString().slice(0, 10)} at build time.`);
  w();

  return new Response(lines.join('\n'), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
