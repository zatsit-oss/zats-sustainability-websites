export { default as Header } from './layouts/Header.astro'
export { default as Footer } from './layouts/Footer.astro'
export { default as ThemeToggle } from './layouts/ThemeToggle.astro'
export { default as BaseHead } from './layouts/BaseHead.astro'

export {
  BRAND_NAME,
  ORGANIZATION_ID,
  ZATSIT_ORIGIN,
  breadcrumbListSchema,
  organizationSchema,
  pageGraph,
  webPageSchema,
  webSiteSchema,
} from './utils/schema'
export type {
  BreadcrumbItem,
  OrganizationInput,
  PostalAddressInput,
  WebPageInput,
  WebSiteInput,
} from './utils/schema'

export { renderSitemap, sitemapResponse } from './utils/sitemap'
export type { SitemapEntry } from './utils/sitemap'
