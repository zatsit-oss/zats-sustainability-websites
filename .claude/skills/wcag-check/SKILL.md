---
name: wcag-check
description: Verify that front-end / Astro UI changes meet WCAG 2.1 AA (contrast in BOTH light and dark themes, visible focus, motion gating, ARIA, semantics) BEFORE declaring UI work done or committing. Use whenever you add or modify a component, page, style, color, or animation in this monorepo. Complements accessibility-a11y (which is for implementation); this is the mandatory verification gate.
---

# WCAG 2.1 AA Verification Gate

WCAG 2.1 AA is **mandatory** for every Astro / front-end change in this monorepo (see the corporate `CLAUDE.md`). This skill is the verification step: run it before claiming UI work is complete and before committing. Do not eyeball contrast — measure it.

## Scope

This gate verifies the UI you **changed**. It does not, by itself, catch pre-existing failures elsewhere on the page. When a change lands in a shared layout or global stylesheet, also check the other components that consume it. For a full-site sweep (every page/section), run the `web-quality-audit` skill instead — a diff-scoped review will miss issues in untouched sections (e.g. a low-opacity label in another component).

## How to use

1. List every color pairing the change introduces or touches (text on background, UI boundary on background, focus ring on adjacent color), for **both themes**.
2. Resolve the design tokens to concrete hex values (see the table below). Composite any `color-mix(... N%, transparent)` over its real backdrop.
3. Run the contrast script (`scripts/contrast.mjs`, or paste it inline) and record ratios to 2 decimals.
4. Walk the checklist. Fix anything that fails, then re-measure.
5. Report the ratios you relied on. Never claim a pass without the number.

## Resolved token values (corporate)

Section backgrounds: `.section--surface` uses `--color-surface`; cards use `--card-bg`.

| Token | Light | Dark (resolved) |
|---|---|---|
| `--color-bg` | `#ffffff` | `#1b1b1d` |
| `--color-surface` | `#f8fafc` | `rgba(255,255,255,.05)` over bg ≈ `#262628` |
| `--card-bg` | `#f8fafc` | `rgba(255,255,255,.05)` over bg ≈ `#262628` (stacked layers ≈ `#313133`) |
| `--color-text` | `#1c1e21` | `#e3e3e3` |
| `--color-text-muted` | `#475569` | `#94a3b8` |
| `--color-primary` | `#0f15fd` | `#f1be51` |
| `--color-on-primary` | `#ffffff` | `#1b1b1d` |
| `--color-border` | `#cbd5e1` | `#334155` |

`rgba(255,255,255,0.05)` over `#1b1b1d` ≈ `#262628`; two stacked such layers ≈ `#313133`. Compute exact values rather than trusting the approximation when a result is borderline.

## Checklist (WCAG 2.1 AA)

- [ ] **1.4.3 Text contrast** ≥ 4.5:1 (≥ 3:1 for large text ≥ 24px, or ≥ 18.66px bold) — light AND dark. Gradient-clipped text must pass at its **worst** stop.
- [ ] **1.4.11 Non-text contrast** ≥ 3:1 — control boundaries (e.g. toggle track), focus indicators, meaningful icons, state indicators. **Check every state** (default, toggled/checked, hover, focus, disabled), not just the initial render — a boundary can pass in one state and fail in another (e.g. a toggle whose border color changes when active).
  - *Decorative exemption:* purely aesthetic borders (card outlines, chips, inactive pills) are exempt when the component and its state are already identifiable by fill + text. Don't force 3:1 on those — it diverges from the site's `--color-border` convention for no accessibility gain. Reserve the 3:1 bar for boundaries that actually convey the control or its state.
- [ ] **2.4.7 Focus visible** — every interactive element has a `:focus-visible` indicator ≥ 3:1 vs adjacent colors. No `outline: none` without an equivalent replacement.
- [ ] **1.4.1 Use of color** — no information conveyed by color alone (pair with shape/position/text/icon).
- [ ] **2.3.3 / 2.2.2 Motion** — every animation and transition gated behind `@media (prefers-reduced-motion: reduce)`, and JS-driven motion gated via `matchMedia('(prefers-reduced-motion: reduce)')`. No ungated infinite animation.
- [ ] **4.1.2 Name/role/value** — semantic element or correct `role`; `aria-label` for icon-only controls; `aria-checked` / `aria-pressed` / `aria-hidden` kept in sync with visual state.
- [ ] **1.3.1 Info & relationships** — semantic structure (lists are `<ul>`/`<ol>`, headings ordered, labels associated with inputs); `<abbr title>` for abbreviations.
- [ ] **2.1.1 Keyboard** — reachable and operable by keyboard, no trap.
- [ ] **2.5.8 Target size** — interactive targets ≥ 24×24px (project rule: aim for 44×44px).

## Brand vs contrast

If a brand color fails as text, **decouple**: use a vivid decorative token for non-text elements (beams, glows, knobs, borders) and a separate AA-safe token for text — do not ship a failing text color.

## Contrast script

`scripts/contrast.mjs` (run with `node`, no deps):

```js
// Usage: node contrast.mjs "#7c3aed" "#f8fafc"
//   or import { contrast, over } and script your own pairings.
const lin = (c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
const lum = (hex) => {
  const n = parseInt(hex.slice(1), 16);
  const [r, g, b] = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((v) => v / 255);
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
};
export const contrast = (a, b) => {
  const [l1, l2] = [lum(a), lum(b)];
  return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
};
// Composite `hex` at `alpha` (e.g. a color-mix N%/transparent) over an opaque `base`.
export const over = (hex, alpha, base) => {
  const p = (h) => [(h >> 16) & 255, (h >> 8) & 255, h & 255];
  const f = p(parseInt(hex.slice(1), 16));
  const b = p(parseInt(base.slice(1), 16));
  const o = f.map((c, i) => Math.round(c * alpha + b[i] * (1 - alpha)));
  return '#' + o.map((x) => x.toString(16).padStart(2, '0')).join('');
};
if (import.meta.url === `file://${process.argv[1]}`) {
  const [, , fg, bg] = process.argv;
  if (fg && bg) console.log(`${fg} on ${bg} = ${contrast(fg, bg).toFixed(2)}:1`);
  else console.log('Usage: node contrast.mjs "#rrggbb" "#rrggbb"');
}
```

Reference implementation of an accessible, brand-preserving pattern: `corporate/src/components/sections/Services.astro` + the `.services-*` / `.sdlc-*` / `.ai-*` blocks in `corporate/src/styles/global.css` (decoupled decorative vs text accent tokens, motion gating, `role="switch"`).
