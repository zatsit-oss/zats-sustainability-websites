# Zatsit Website

Official website of **zatsit** — Tech at the service of companies' impact.

## Description

Corporate website of **zatsit**, showcasing our services, expertise, team, and commitments to responsible digital transformation.

## Tech Stack

- **Framework**: [Astro](https://astro.build/) v5
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) v4
- **Language**: TypeScript
- **Font**: Poppins (self-hosted via `@fontsource/poppins`)
- **Deployment**: Google Cloud Storage bucket served through a load balancer with Cloud CDN. Firebase Hosting only serves pull request previews.

## Prerequisites

- Node.js v20+
- npm v10+

## Installation

```bash
# From the monorepo root
cd corporate

# Install dependencies
npm install
```

## Commands

| Command           | Action                                          |
| ----------------- | ----------------------------------------------- |
| `npm run dev`     | Starts dev server on `localhost:4321`            |
| `npm run build`   | Builds the site for production in `./dist/`      |
| `npm run preview` | Previews the build locally before deployment     |

## Project Structure

```
corporate/
├── public/
│   ├── favicon.svg
│   └── images/
│       ├── partners/        # Partner/client logos
│       ├── team/            # Team photos
│       └── technologies/    # Technology logos
├── src/
│   ├── assets/
│   │   └── icons/           # SVG icons imported as components
│   ├── components/
│   │   ├── sections/        # Page sections
│   │   │   ├── Hero.astro
│   │   │   ├── Services.astro
│   │   │   ├── Consultants.astro
│   │   │   ├── Clients.astro
│   │   │   ├── ImpactEnvironmental.astro
│   │   │   └── ImpactSocietal.astro
│   │   ├── Header.astro
│   │   ├── Footer.astro
│   │   ├── Logo.astro
│   │   ├── ThemeToggle.astro
│   │   ├── TechTag.astro
│   │   └── LegalPageLayout.astro
│   ├── layouts/
│   │   └── Layout.astro
│   ├── pages/
│   │   ├── index.astro          # Home
│   │   ├── join-us.astro        # Join us
│   │   ├── work-with-us.astro   # Work with us (contact form)
│   │   ├── team.astro           # Team
│   │   ├── careers.astro        # Careers
│   │   ├── tech.astro           # Technologies
│   │   ├── find-us.astro        # Find us
│   │   ├── legal-notice.astro   # Legal notice
│   │   ├── privacy-policy.astro # Privacy policy
│   │   └── 404.astro            # Not found, emitted as dist/404.html
│   └── styles/
│       └── global.css
├── astro.config.mjs
├── tsconfig.json
└── package.json
```

## Features

- Responsive design (mobile-first)
- Light/dark theme with localStorage persistence
- Eco-design (minimal JavaScript, optimized CSS, self-hosted fonts)
- Accessibility (ARIA labels, keyboard navigation, WCAG AA contrast)
- Typed environment variables

## Environment Variables

Defined in `astro.config.mjs` with default values:

- `SITE_URL`: Main site URL
- `BLOG_URL`: Blog URL
- `LINKEDIN_URL`: LinkedIn page URL
- `GITHUB_URL`: GitHub organization URL
- `SUSTAINABILITY_URL`: Sustainability portal URL

### Conditional Page Generation

Use `DISABLED_PAGES` at build time to exclude specific pages from the generated output.

```bash
# Disable a single page
DISABLED_PAGES=careers npm run build

# Disable multiple pages (comma-separated slugs)
DISABLED_PAGES="careers,find-us,join-us" npm run build
```

**Controllable pages:** `careers`, `find-us`, `join-us`, `team`, `tech`, `work-with-us`

**Always generated (cannot be disabled):** `index` (home), `legal-notice`, `privacy-policy`

When a page is disabled:
- Its HTML file is removed from `dist/` after build → returns 404
- All navigation links and CTAs pointing to it are hidden from the generated HTML

## Redirects

The WordPress site that `zatsit.fr` served until 2026-09-03 exposed a handful of French URLs. They are kept alive as permanent redirects so inbound links and search results do not break.

**These redirects are not part of this Astro project.** They live in the production load balancer, which answers them before any request reaches the bucket: url map `wordpress-lb`, path matcher `zatsit-website-prod-v1`, in the GCP project `sites-web-407116`.

| Legacy URL | Redirects to | Code |
|---|---|---|
| `/contact/` and `/contact` | `/work-with-us/` | 301 |
| `/collaborer-avec-zatsit/` and `/collaborer-avec-zatsit` | `/work-with-us/` | 301 |
| `/mentions-legales/` and `/mentions-legales` | `/legal-notice/` | 301 |

The host is preserved: `www.zatsit.fr/contact/` redirects to `www.zatsit.fr/work-with-us/`.

Two related behaviours, also served by the infrastructure rather than by the build:

- **Trailing slashes.** Every internal link this project emits ends with a slash, and `astro.config.mjs` sets `trailingSlash: 'always'`. A request without the slash gets a `301` to the slash form from the bucket website configuration, so internal navigation never pays that redirect.
- **404.** `src/pages/404.astro` is emitted as `dist/404.html`, which the production bucket declares as its `notFoundPage`. Unknown URLs, and pages excluded through `DISABLED_PAGES`, therefore return a real `404` with our own page.

### Adding a redirect

Redirects are `routeRules` on the path matcher, at priorities `1` and up. The rule that rewrites `/{page=*}/` to `/{page}/index.html` sits at priority `100` and must stay below them, otherwise it swallows the redirect paths first.

```bash
gcloud compute url-maps export wordpress-lb --project=sites-web-407116 --destination=urlmap.yaml
# edit urlmap.yaml, then
gcloud compute url-maps import wordpress-lb --project=sites-web-407116 --source=urlmap.yaml
gcloud compute url-maps invalidate-cdn-cache wordpress-lb --path="/*" --project=sites-web-407116
```

A url map change takes several minutes to reach the edge, while the API already reads back the new configuration. Poll the URL rather than re-importing.

## Contributing

1. Create a branch (`git checkout -b feat/corporate/my-feature`)
2. Commit your changes (`git commit -m "feat(corporate): add my feature"`)
3. Push to the branch (`git push origin feat/corporate/my-feature`)
4. Open a Pull Request

## License

Copyright (c) 2025 **zatsit**. All rights reserved.
