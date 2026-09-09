// Site-level constants for the corporate website.

/**
 * The brand, in the one spelling used across the estate: **lowercase**.
 *
 * It was `Zatsit` in the title suffix and in `og:site_name`, while the blog,
 * the schema, this repository and the brand itself all say `zatsit`. A model
 * reconciling two spellings of one company across three sites is being handed
 * avoidable doubt, so there is one spelling now.
 */
export const SITE_TITLE = 'zatsit';

/**
 * Home page title, which cannot be the brand alone, and could not stay
 * `Accueil`: that named a navigation item and a brand, and no subject.
 *
 * 54 characters, inside the 50 to 60 a result page shows without cutting. It
 * already contains the brand, which is what stops BaseHead appending it twice.
 * The wording is the company tagline, so it says the same thing as the hero.
 */
export const HOME_TITLE = "zatsit, la tech au service de l'impact des entreprises";

export const SITE_DESCRIPTION =
  "zatsit accompagne les entreprises sur leurs enjeux tech : architecture, cloud, data, IA et éco-conception. Un collectif de consultantes et consultants basé à Lille.";

export const SITE_LANG = 'fr';
export const SITE_INLANGUAGE = 'fr-FR';
export const SITE_LOCALE = 'fr_FR';

/** Default social card, 1200x630, and the alt text that describes it. */
export const SITE_OG_IMAGE = '/og-image.png';
export const SITE_OG_IMAGE_ALT =
  "zatsit, la tech augmentée au service de l'impact des entreprises";
export const SITE_OG_IMAGE_WIDTH = 1200;
export const SITE_OG_IMAGE_HEIGHT = 630;

/** Organization logo, for the JSON-LD `Organization` node. */
export const SITE_LOGO = '/favicon.svg';

/**
 * Postal address, as the footer prints it and as `/find-us/` describes it.
 *
 * Published on the schema of that page only. The organisation is the same on
 * every page, but the address is worth attaching where the page actually backs
 * it up with a map and directions.
 */
export const ADDRESS = {
  streetAddress: '2 Allée de la Haye du Temple',
  postalCode: '59160',
  addressLocality: 'Lille',
  addressCountry: 'FR',
} as const;

/** How the footer prints it, kept next to the schema version so both move together. */
export const ADDRESS_LINES = ['EURATECHNOPOLYS', '2 Allée de la Haye du Temple', '59160 Lille'];

/**
 * One line per page, for `/llms.txt`.
 *
 * These are **not** the meta descriptions and must not be kept in sync with
 * them: a description is written to be read under a search result, these say
 * what question the page answers so an agent can pick the right one. Each page
 * keeps its own `<Layout title description>` as the display source.
 *
 * Keyed by the slugs in `src/lib/pages.ts`, which is what decides whether a
 * page is built at all.
 */
export const PAGE_SUMMARIES: Record<string, { label: string; summary: string }> = {
  index: {
    label: 'Accueil',
    summary: "ce que fait zatsit, pour qui, et les convictions qui guident nos missions",
  },
  team: {
    label: 'Notre équipe',
    summary: 'les consultantes et consultants de zatsit, avec leur rôle',
  },
  tech: {
    label: 'Notre expertise tech',
    summary:
      "les technologies et les méthodes que nous pratiquons : Java, Node.js, Vue.js, Kubernetes, DDD, contract-first, architecture hexagonale",
  },
  careers: {
    label: "Nos offres d'emploi",
    summary: 'les postes ouverts chez zatsit',
  },
  'join-us': {
    label: 'Ton futur package',
    summary: "ce que zatsit propose à celles et ceux qui nous rejoignent : rémunération, avantages, équipement",
  },
  'work-with-us': {
    label: 'Travaillons ensemble',
    summary: 'le formulaire de contact pour nous parler d’un projet',
  },
  'find-us': {
    label: 'Nous trouver',
    summary: "l'adresse des bureaux, à Euratechnopolys à Lille, et comment y accéder",
  },
  'legal-notice': {
    label: 'Mentions légales',
    summary: "l'éditeur du site, l'hébergeur et les mentions obligatoires",
  },
  'privacy-policy': {
    label: 'Politique de confidentialité',
    summary: 'les données que ce site traite, et celles qu’il ne traite pas',
  },
};
