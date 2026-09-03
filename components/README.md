# @zatsit/components

Shared Astro components for the sustainability portal: the header, the footer and the theme toggle. Their shape is deliberately the same as the corporate, blog and tech watcher chrome, so the sites read as one. This package holds no styles of its own, it uses the semantic classes and design tokens of the zatsit charter, which the consuming project declares.

## Components

| Component | Purpose |
|---|---|
| `Header.astro` | Sticky glass header: brand, page navigation with `aria-current`, ecosystem icon links, theme toggle, and a menu button that reveals the navigation below 1024px |
| `Footer.astro` | Three columns (brand and mission with the carbon badge, address and social links, CSR badges) above a copyright bar |
| `ThemeToggle.astro` | Switches `data-theme` on `<html>` and persists it under the `theme` key |

Icons are local SVG assets in `src/assets`, extracted from Lucide. There is no icon dependency: a bare `@lucide/astro` import cannot resolve from here, since this package sits outside the consumer's dependency tree, and shipping four glyphs beats shipping a library.

## Install

The package is consumed as source, through a local file dependency:

```json
{
  "dependencies": {
    "@zatsit/components": "file:../components"
  }
}
```

```astro
---
import { Header, Footer } from '@zatsit/components';
---
```

## Tailwind

Tailwind v4 needs no `content` array, it discovers its sources on its own. It never scans `node_modules` though, and this package is reached through it, so the consuming stylesheet must declare the path explicitly:

```css
@source "../../../components/src";
```

Without that line the utilities used only inside these components are silently absent from the generated CSS, and the header and footer render half styled. The portal declares it in `src/styles/global.css`.

## Styling contract

These components expect the consumer to provide the charter, meaning the tokens (`--color-primary`, `--color-on-primary`, `--color-surface`, `--color-border`, `--color-text-muted`, `--glass-bg`, `--glass-border`, `--card-bg`) and the semantic classes (`.header`, `.header-nav`, `.header-logo`, `.header-actions`, `.header-action`, `.glass`, `.container`, `.footer-main`, `.footer-social-link`, `.icon-md`, `.link`, `.link-primary`, `.text-muted`, `.icon-primary`). Copy them from `corporate/src/styles/global.css` rather than inventing variants, the point being that the sites read as one.

Dark mode is an attribute, not a class: `data-theme="dark"` on `<html>`. The consumer rebinds Tailwind's `dark:` variant to it:

```css
@custom-variant dark (&:where([data-theme="dark"], [data-theme="dark"] *));
```
