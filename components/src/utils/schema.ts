/**
 * JSON-LD for the zatsit sites, built at compile time.
 *
 * Emitted at build and never injected by a client script: structured data is
 * text, and text belongs in the build. One audit vendor recommends a library
 * that writes this markup in the reader's browser; that would be a runtime
 * dependency, a render-blocking request and a contradiction on sites that claim
 * eco-design.
 *
 * Ported from `zats-blog/src/utils/schema.ts`, which stays the reference. The
 * difference here is parameterisation: the blog reads its own constants, this
 * module is consumed by two sites and takes what it needs.
 *
 * What is deliberately absent:
 * - `FAQPage`: neither site is a FAQ, and fabricating it is the kind of
 *   structured-data spam search engines penalise. Google withdrew FAQ rich
 *   results in May 2026.
 * - `dateModified`: no site here holds a reliable modification date, and
 *   inventing one is a claim.
 */

/**
 * The publisher's identity, and the one value in this file that must never
 * become a parameter.
 *
 * Every site in the estate references this exact `@id`, so an answer engine
 * resolves the corporate site, the sustainability portal and the blog to **one**
 * organisation instead of three homonyms. Parameterising it per site would
 * silently recreate the homonyms this constant exists to prevent.
 */
export const ZATSIT_ORIGIN = 'https://zatsit.fr';
export const ORGANIZATION_ID = `${ZATSIT_ORIGIN}/#organization`;

/** The brand, in the one spelling used everywhere: lowercase. */
export const BRAND_NAME = 'zatsit';

export interface PostalAddressInput {
  streetAddress: string;
  postalCode: string;
  addressLocality: string;
  addressCountry: string;
}

export interface OrganizationInput {
  /** Absolute URL of the logo, on whichever site is emitting the graph. */
  logo: string;
  sameAs: string[];
  /** Emitted only where the page actually publishes it. */
  address?: PostalAddressInput;
}

/** The publisher, referenced by every page rather than repeated inside it. */
export function organizationSchema(input: OrganizationInput) {
  return {
    '@type': 'Organization',
    '@id': ORGANIZATION_ID,
    name: BRAND_NAME,
    url: ZATSIT_ORIGIN,
    logo: { '@type': 'ImageObject', url: input.logo },
    sameAs: input.sameAs,
    ...(input.address ? { address: { '@type': 'PostalAddress', ...input.address } } : {}),
  };
}

export interface WebSiteInput {
  name: string;
  description: string;
  /** Site root, with its trailing slash. */
  url: string;
  /** BCP 47 tag, so `fr-FR` on corporate and `en` on the portal. */
  inLanguage: string;
}

/** The site itself. Anchored at `<origin>/#website` so pages can point at it. */
export function webSiteSchema(input: WebSiteInput) {
  return {
    '@type': 'WebSite',
    '@id': new URL('#website', input.url).href,
    name: input.name,
    description: input.description,
    url: input.url,
    inLanguage: input.inLanguage,
    publisher: { '@id': ORGANIZATION_ID },
  };
}

export interface WebPageInput {
  name: string;
  description: string;
  /** Canonical URL of this page. */
  url: string;
  inLanguage: string;
  /** Site root, to point `isPartOf` at the WebSite node. */
  siteUrl: string;
  /** Present on every page below the root. */
  breadcrumbId?: string;
}

/**
 * A page below the root. More precise than describing every non-article page as
 * the whole `WebSite`, which is what the blog does and what makes its ten
 * listing pages indistinguishable from its home page.
 */
export function webPageSchema(input: WebPageInput) {
  return {
    '@type': 'WebPage',
    '@id': new URL('#webpage', input.url).href,
    name: input.name,
    description: input.description,
    url: input.url,
    inLanguage: input.inLanguage,
    isPartOf: { '@id': new URL('#website', input.siteUrl).href },
    publisher: { '@id': ORGANIZATION_ID },
    ...(input.breadcrumbId ? { breadcrumb: { '@id': input.breadcrumbId } } : {}),
  };
}

export interface BreadcrumbItem {
  name: string;
  /** Absolute URL. The last item may omit it, per schema.org's guidance. */
  url?: string;
}

/**
 * The trail from the site root to this page.
 *
 * Anchored on the page's own URL so two pages never share a node id. Emitted
 * only when there is a trail to describe: a single-item breadcrumb on the home
 * page says nothing.
 */
export function breadcrumbListSchema(items: BreadcrumbItem[], pageUrl: string) {
  return {
    '@type': 'BreadcrumbList',
    '@id': new URL('#breadcrumb', pageUrl).href,
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      ...(item.url ? { item: item.url } : {}),
    })),
  };
}

/**
 * One graph per page rather than several loose blocks.
 *
 * `@graph` is what lets a page point at its publisher by id instead of
 * repeating the organisation on every page: smaller output, and what the
 * consumers expect.
 */
export function pageGraph(nodes: object[]): string {
  return JSON.stringify({ '@context': 'https://schema.org', '@graph': nodes });
}
