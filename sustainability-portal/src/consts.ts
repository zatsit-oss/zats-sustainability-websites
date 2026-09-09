// Site-level constants for the sustainability portal.

/** The brand, in the one spelling used across the estate: lowercase. */
export const SITE_TITLE = 'zatsit';

/**
 * Home page title, which cannot be the brand alone: "zatsit" says nothing about
 * what this site is, and the previous value, "Sustainability Portal", named a
 * category rather than a subject.
 *
 * 49 characters, inside the 50 to 60 a result page shows without cutting. It
 * already contains the brand, which is what stops BaseHead appending it twice.
 */
export const HOME_TITLE = 'zatsit sustainability, measure your digital impact';

export const SITE_DESCRIPTION =
  'Evaluate and optimize the environmental impact of your web projects with zatsit. Measure, understand, and reduce your digital carbon footprint.';

/**
 * This site is in English while `AGENTS.md` states that user-facing content is
 * French. That is a live divergence, not an oversight of this file: the portal
 * has always shipped English copy.
 *
 * What matters for a generative engine is that the declared language matches
 * the content, so English copy under `lang="en"` is at least self-consistent
 * and safe to publish. **No `hreflang`**: the corporate site is not a
 * translation of this one, they are two different sites.
 */
export const SITE_LANG = 'en';
export const SITE_INLANGUAGE = 'en';
export const SITE_LOCALE = 'en_US';

/**
 * Social card.
 *
 * PLACEHOLDER, pointing at the corporate card on purpose. This site has no
 * card of its own, so every share of it was a bare link; borrowing the brand
 * card is strictly better than that and invents no asset. Replace with a
 * portal-specific 1200x630 image under `public/` when one exists, and drop the
 * absolute origin at the same time.
 */
export const SITE_OG_IMAGE = 'https://zatsit.fr/og-image.png';
export const SITE_OG_IMAGE_ALT =
  'zatsit, tech in the service of business impact';

/** Organization logo, for the JSON-LD `Organization` node. */
export const SITE_LOGO = 'https://zatsit.fr/favicon.svg';

/**
 * Every page a crawler should find, for `/sitemap.xml` and `/llms.txt`.
 *
 * `/404/` is deliberately absent: a sitemap advertises pages worth indexing.
 *
 * **`/landscape/` needs care.** `src/pages/landscape/[...path].astro` holds a
 * `getStaticPaths` and no template at all, so this project emits a **0-byte**
 * `dist/landscape/index.html`: the route is a placeholder reserving the path for
 * the separate `sustainability-landscape` repository, which publishes the real
 * 12 kB page into this same bucket. Production currently serves that real page,
 * titled "zatsit Landscape", and two links on the home page point at it, so it
 * belongs in the sitemap.
 *
 * The hazard is the publish order, not this list: `publish-portal-on-merge.yml`
 * deletes every object in the bucket before uploading `dist/`, so any merge here
 * replaces the real landscape page with the empty placeholder until the other
 * repository deploys again. A 200 response carrying zero bytes is the worst
 * thing to hand a crawler, worse than a 404, because it is indexable and says
 * nothing. Tracked in the plan under Lot 6.
 */
export const INDEXABLE_PAGES: { path: string; title: string; summary: string }[] = [
  {
    path: '/',
    title: HOME_TITLE,
    summary:
      'What eco-designed applications are, why they matter, and the tools zatsit publishes to measure them.',
  },
  {
    path: '/greenscore/',
    title: 'Zats Green Score',
    summary:
      'Two evaluation tools, API Green Score and EROOM, to assess the energy efficiency and optimization potential of a digital service.',
  },
  {
    path: '/landscape/',
    title: 'Sustainability Landscape',
    summary:
      'The state of sustainable development in software engineering: frameworks, methodologies and industry standards. Published from a separate repository.',
  },
];
