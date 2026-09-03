# Sustainability portal

Landing pages and static content for the zatsit sustainability work, served in production at [sustainability.zatsit.fr](https://sustainability.zatsit.fr). All illustrations come from [Storyset](https://storyset.com).

## Tech stack

- **Astro 5**, static output, no client framework
- **Tailwind CSS v4** through the `@tailwindcss/vite` plugin, no `tailwind.config` file
- **TypeScript**
- **Poppins**, self-hosted through `@fontsource/poppins`
- **[@zatsit/components](../components)**, the shared header and footer, consumed as source

## Project structure

```text
/
├── public/
│   └── favicon.ico
├── src/
│   ├── assets/                  # Storyset illustrations
│   ├── layouts/
│   │   └── Layout.astro         # Head, theme bootstrap, header, main, footer
│   ├── pages/
│   │   ├── index.astro          # Portal home
│   │   ├── greenscore.astro     # API Green Score landing
│   │   ├── 404.astro
│   │   └── landscape/
│   │       └── [...path].astro  # Sustainability landscape, built by CI
│   └── styles/
│       └── global.css           # Design tokens and semantic classes
├── astro.config.mjs
└── package.json
```

## Commands

Run every command from this directory.

| Command | Action |
|---|---|
| `npm install` | Install dependencies |
| `npm run dev` | Dev server at `localhost:4321` |
| `npm run build` | Production build to `./dist/` |
| `npm run preview` | Preview the production build locally |
| `npx astro check` | TypeScript and Astro type checking |

There are no automated tests. Validate a change by building it and previewing it in a browser, in both themes.

## Design charter

The portal uses the same charter as [corporate](../corporate), the blog and the tech watcher, so the sites read as one. `src/styles/global.css` is the single place where it lives here, and it is deliberately a copy of the corporate definitions rather than a variant. When a component needs a class that is missing, copy the corporate rule verbatim.

**Colours are tokens, never literals.** Each scheme sets the same custom properties, so a component picks `var(--color-text-muted)` or the `.text-muted` class and is correct in both:

| Token | Light | Dark |
|---|---|---|
| `--color-bg` | `#ffffff` | `#1b1b1d` |
| `--color-text` | `#1c1e21` | `#e3e3e3` |
| `--color-text-muted` | `#475569` | `#94a3b8` |
| `--color-surface` | `#f8fafc` | `rgba(255,255,255,.05)` |
| `--color-border` | `#cbd5e1` | `#334155` |
| `--color-primary` | `#0f15fd` | `#f1be51` |
| `--color-on-primary` | `#ffffff` | `#1b1b1d` |

`--color-on-primary` exists because the dark primary is a light gold: white text on it would fall below the AA threshold. Anything sitting on a primary background takes that token, never `white`.

Semantic classes cover the recurring patterns: `.container`, `.section`, `.section--surface`, `.card`, `.card--hover`, `.btn-primary`, `.btn-secondary`, `.text-muted`, `.link`, `.link-primary`, `.glass`, `.footer-social-link`, `.skip-link`. Prefer extending one over composing a long utility string.

### Theme switching

The theme is an attribute, `data-theme="light"` or `data-theme="dark"` on `<html>`, persisted in `localStorage` under `theme` and applied by an inline script in `Layout.astro` before first paint, so no flash. Tailwind's `dark:` variant is rebound to that attribute:

```css
@custom-variant dark (&:where([data-theme="dark"], [data-theme="dark"] *));
```

Both mechanisms therefore agree, and a `dark:` utility keeps working next to a token.

### Scanning the shared components

Tailwind v4 does not scan `node_modules`, and `@zatsit/components` is reached through it. `src/styles/global.css` declares the path explicitly:

```css
@source "../../../components/src";
```

Remove that line and the utilities used only in the header or the footer disappear from the CSS, with no error at build time.

## Accessibility

The monorepo targets WCAG 2.1 AA. What that means in practice here: contrast is measured in **both** themes with the resolved token values, every interactive element keeps a visible `:focus-visible` outline, icon-only controls are at least 44 by 44 pixels, motion is gated behind `prefers-reduced-motion: reduce`, the page has one `<main id="main-content">` provided by the layout, and a skip link precedes the header.

## Deployment

⚠️ **A merge on `main` that touches `sustainability-portal/**` or `components/**` deploys straight to production**, unlike corporate which goes to staging first. See `publish-portal-on-merge.yml`. Pull requests get a Firebase preview, except Dependabot ones.
