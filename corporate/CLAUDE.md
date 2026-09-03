# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Accessibility — WCAG 2.1 AA (MANDATORY, non-negotiable)

**Every piece of Astro / front-end code you produce or modify MUST preserve WCAG 2.1 AA.** This is an imperative, not a nice-to-have. Treat an accessibility regression as a build-breaking bug.

- **Before** writing or changing any UI (component, page, style, animation), invoke the **`accessibility-a11y`** skill and apply it. It is not optional and must actually be activated — past work skipped it; do not.
- **Before** declaring any UI work done (and before committing), invoke the **`wcag-check`** skill to verify the change. Do not claim completion without it.
- **Measure, never eyeball.** Contrast must be computed with real ratios, in **both the light and dark themes**, using the resolved values of the design tokens (`--color-*`, and any section-scoped accents).

Minimum bar for any change:
- **Text contrast** ≥ 4.5:1 (≥ 3:1 for large text ≥ 24px or ≥ 18.66px bold) — verify in light **and** dark. Gradient-clipped text (`-webkit-text-fill-color: transparent`) must pass at its **worst** color stop.
- **Non-text / UI contrast** ≥ 3:1 (control boundaries, focus indicators, meaningful icons, state indicators).
- **Visible focus** on every interactive element (`:focus-visible`, ≥ 3:1 against adjacent colors). Never remove outlines without an equal replacement.
- **Motion**: every animation/transition gated behind `@media (prefers-reduced-motion: reduce)` (and in JS via `matchMedia`). No ungated infinite animation.
- **Semantics & ARIA**: semantic HTML first; correct `role` / name / value; keep `aria-checked` / `aria-hidden` in sync with visual state; provide `aria-label` for icon-only controls; expand abbreviations with `<abbr>`.
- **Never convey information by color alone** (WCAG 1.4.1): pair color with shape, position, text, or icon.

If a brand color fails contrast, keep the brand by **decoupling decorative color from text color** (a vivid decorative token for non-text elements, an AA-safe token for text) rather than shipping a failing value.

## Commands

Run all commands from this `corporate/` directory.

| Command | Description |
|---|---|
| `npm run dev` | Dev server at `localhost:4321` |
| `npm run build` | Production build to `./dist/` |
| `npm run preview` | Preview production build locally |
| `npx astro check` | TypeScript / Astro type checking |

There are no automated tests. Validate changes by running the build and previewing in a browser.

## Architecture

**Astro v5 + Tailwind v4** static site published to a Google Cloud Storage bucket served through a load balancer. Firebase Hosting only serves pull request previews.

### Content Collections

All page data lives in `src/content/` as JSON files, validated by Zod schemas in `src/content/config.ts`. Collections: `people`, `services`, `tech`, `legal`. Pages load data via `getEntry('collection', 'slug')`:

```ts
const techData = await getEntry('tech', 'tech');
const { intro, stats, stacks } = techData.data;
```

To add or modify site content (team members, services, tech stacks, legal text), edit the JSON files in `src/content/`.

### Theming

Theme (`light`/`dark`) is stored in `localStorage` under the key `theme` and applied as a `data-theme` attribute on `<html>`. An inline `<script is:inline>` in `Layout.astro` applies the theme before first paint to prevent FOUC, and re-applies it after every Astro ViewTransition (`astro:after-swap`).

CSS custom properties (`--color-*`, `--glass-*`, `--card-bg`, etc.) are defined in `src/styles/global.css` under `[data-theme="light"]`, `[data-theme="dark"]`, and `@media (prefers-color-scheme: dark)`. Always use these tokens rather than hardcoded colors.

### Styling Pattern

Tailwind v4 is configured via `@tailwindcss/vite` (no `tailwind.config` file). Design tokens are declared in a `@theme {}` block in `global.css`.

Rather than composing raw Tailwind utilities everywhere, the codebase uses **semantic CSS classes** defined in `global.css`: `.section`, `.container`, `.btn-primary`, `.btn-secondary`, `.card`, `.service-card`, `.tag`, `.glass`, `.text-gradient`, etc. Prefer extending these or adding new semantic classes over scattering long utility strings in component markup.

### Icons

SVG icons live in `src/assets/icons/` and are imported directly as Astro components:

```astro
import CheckIcon from '../assets/icons/check.svg';
<CheckIcon class="icon-md" />
```

Use `.icon-sm` / `.icon-md` / `.icon-lg` size classes from `global.css`. Never use icon fonts or external icon CDNs.

### Technology Icons

`src/data/technology-icons.ts` maps technology display names (e.g. `'Vue.js'`) to SVG slugs under `public/images/technologies/{slug}.svg`. Add an entry here when introducing a new technology on the tech page.

### Client-Side Scripts

Minimal JS only. Scripts in `src/scripts/` (e.g. `gauge-animation.ts`, `orbit-triangle.ts`) are loaded inline in the specific pages/components that need them. The `ThemeToggle.astro` component is self-contained with its own `<script>`. Re-register event listeners on `astro:after-swap` when using ViewTransitions.

### Scroll-Triggered Animations

Reveal animations (typewriter effects, fade-ins, etc.) must trigger when the target element reaches the **vertical middle of the viewport**, not as soon as it becomes visible. Use an `IntersectionObserver` with `{ root: null, rootMargin: '-50% 0px -50% 0px', threshold: 0 }` and `disconnect()` after the first trigger for one-shot reveals.

Keep the reveal pacing slow and gentle, and always gate motion behind `prefers-reduced-motion: reduce` (render the final state instantly for users who opt out). See `src/components/sections/Services.astro` for the reference implementation.

### Environment Variables

Typed via Astro's `env` schema in `astro.config.mjs`. All variables have default values and are public/client-accessible. No `.env` file is required for local development.
