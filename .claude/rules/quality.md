# Quality Principles

These principles must be applied to every change in this monorepo.

**Important**: zatsit promotes eco-design and sustainability. Our own websites must lead by example.

## Performance
- Minimize JavaScript usage (static HTML preferred)
- Optimize images and assets (prefer WebP/AVIF, correct dimensions)
- Lazy load non-critical resources
- Keep bundle size minimal
- Use Astro's partial hydration (`client:*` directives) sparingly

## Accessibility (a11y)
- Use semantic HTML (`<nav>`, `<main>`, `<article>`, `<section>`, `<header>`, `<footer>`)
- Provide `aria-label` for non-text interactive elements
- Ensure sufficient color contrast (WCAG AA minimum)
- Support keyboard navigation, visible focus states
- Add `alt` text for images (empty `alt=""` for purely decorative ones)
- Associate form labels with inputs
- Test with a screen reader when feasible

## Responsive Design
- Mobile-first approach
- Test on multiple breakpoints (mobile, tablet, desktop)
- Use Tailwind responsive prefixes (`sm:`, `md:`, `lg:`)
- Touch targets at least 44x44px on mobile
- Avoid horizontal scroll on any viewport

## Eco-design (Lead by Example)

### Core Principles
- Prefer static generation over client-side rendering
- Minimize HTTP requests
- Use SVG icons (inline or imported as Astro components) rather than icon fonts
- Avoid heavy libraries and frameworks
- Optimize and compress all assets
- Cache aggressively (`Cache-Control` is set per object by the publish workflow, then honoured by Cloud CDN)

### Targets
- Page weight target: < 500KB per page
- Total page weight: < 1MB
- Target EcoIndex grade A
- Minimize DOM complexity (< 50 elements per section when possible)

### Fonts
- **Never** use Google Fonts or external font CDNs
- Self-host fonts via `@fontsource/*` packages (e.g., `@fontsource/poppins`)
- Limit font weights (max 3 weights total: e.g., 400, 600, 700)
- Prefer system fonts when possible

### External Resources
- Avoid external scripts and stylesheets
- No tracking scripts or analytics
- Self-host all critical assets

### Astro Specific
- Use `compressHTML: true` in `astro.config.mjs`
- Minimize client-side JavaScript
- Use `client:visible` for components below the fold (only when JS is required)
- Validate performance on production build (`npm run build && npm run preview`)

## LocalStorage Usage
- Limited to non-sensitive UX preferences (e.g., theme selection)
- Handle missing or corrupted values gracefully (fall back to defaults)

## Testing Checklist
- [ ] Build passes without errors (`npm run build` from the project directory)
- [ ] No TypeScript errors (`npx astro check`)
- [ ] Responsive on mobile, tablet, desktop
- [ ] Keyboard navigation works
- [ ] Dark/light theme works
- [ ] No console errors in the browser
