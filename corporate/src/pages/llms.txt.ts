/**
 * `llms.txt`, at the site root.
 *
 * A route rather than a file in `public/`, and that is the whole point: a
 * hand-written list is wrong the day after the next page ships, and wrong the
 * moment `DISABLED_PAGES` hides one. Built from the same source the sitemap
 * reads, so the two can never disagree.
 *
 * A proposal, not a standard: no major provider has committed to reading it, so
 * this is a low-cost bet rather than a requirement, and removing it would cost
 * nothing.
 *
 * The format is Markdown by convention: a title, a summary, then sections of
 * links. Kept factual, with no adjective a machine would have to weigh.
 */
import type { APIRoute } from 'astro';
import { BLOG_URL, GITHUB_URL, LINKEDIN_URL, SUSTAINABILITY_URL } from 'astro:env/client';
import { ADDRESS_LINES, PAGE_SUMMARIES, SITE_DESCRIPTION, SITE_TITLE } from '../consts';
import { getIndexablePages } from '../lib/pages';

export const GET: APIRoute = ({ site }) => {
  const url = (path: string) => new URL(path, site!).href;
  const lines: string[] = [];
  const w = (line = '') => lines.push(line);

  w(`# ${SITE_TITLE}`);
  w();
  w(`> ${SITE_DESCRIPTION}`);
  w();
  w(
    "Site statique, sans traceur ni cookie. Chaque page est lisible sans exécuter " +
      "de JavaScript. Les bureaux sont à " +
      `${ADDRESS_LINES.join(', ')}.`,
  );
  w();

  w('## Pages');
  w();
  for (const { slug, path } of getIndexablePages()) {
    const meta = PAGE_SUMMARIES[slug];
    // A page with no summary is still worth listing: the URL is the useful
    // part, and staying silent about it would be the worse failure.
    w(meta ? `- [${meta.label}](${url(path)}) : ${meta.summary}` : `- ${url(path)}`);
  }
  w();

  w('## Ailleurs');
  w();
  w(`- [Le blog tech de zatsit](${BLOG_URL}) : les articles de nos consultants, en français`);
  w(`- [zatsit sustainability](${SUSTAINABILITY_URL}) : nos outils de mesure d'impact, en anglais`);
  w(`- [LinkedIn](${LINKEDIN_URL})`);
  w(`- [GitHub](${GITHUB_URL})`);
  w();

  // Named to make the staleness visible: a list of pages that says nothing
  // about when it was written is worse than no list.
  w(`Généré le ${new Date().toISOString().slice(0, 10)} à la construction du site.`);
  w();

  return new Response(lines.join('\n'), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
