# Project Rules

## Language

- **Code** (variables, functions, file names, comments, commits): English
- **User-facing content** (website text): French
- **Documentation** (README, guides): English

> See root `AGENTS.md` for the source of truth on language conventions.

## Git Commits (Angular Convention)

Format: `type(scope): description`

### Types
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation only
- `style`: Code style (formatting, missing semicolons, etc.)
- `refactor`: Code change that neither fixes a bug nor adds a feature
- `perf`: Performance improvement
- `test`: Adding or fixing tests
- `chore`: Build process, dependencies, or tooling changes
- `ci`: CI/CD changes

### Scopes (project area affected)
- `corporate` — corporate website (zatsit.fr)
- `portal` — sustainability portal
- `components` — shared components library
- `ci` — GitHub Actions workflows
- Global docs: no scope or `docs`

### Examples
```
feat(corporate): add contact page
fix(portal): fix footer responsive layout
chore(ci): update deploy workflow
docs: update contributing guide
```

### Rules
- Use imperative mood: "add" not "added" or "adds"
- No capital letter at start of description
- No period at end
- Keep description under 72 characters

## Components

### Astro Components
- Keep components small and focused (single responsibility)
- Use TypeScript interfaces for props
- Extract data structures to frontmatter section
- Name files in PascalCase: `Header.astro`, `Footer.astro`, `Hero.astro`

### Component Organization (corporate example)
```
src/components/
├── sections/           # Page sections (Hero, Services, Clients...)
├── Header.astro
├── Footer.astro
├── Logo.astro
├── ThemeToggle.astro
└── ...
```

## Styles

### Corporate (Tailwind v4)
- Configured via `@tailwindcss/vite` plugin
- Use `@theme` directive in `src/styles/global.css` for design tokens
- Utility-first; extract repeating patterns with `@apply` only when it improves readability

### Sustainability Portal (Tailwind v3)
- Configured via `@astrojs/tailwind` integration and `tailwind.config.mjs`
- Uses preset from `components/tailwind.preset.mjs`

### Shared
- Mobile-first responsive utilities (`sm:`, `md:`, `lg:`)
- Support dark/light themes via class strategy and `localStorage` (theme persistence only)

## TypeScript

### Types Location
- Shared types: `src/types/` (when justified)
- Component-specific types: in the component frontmatter

### Naming Conventions
- Interfaces: PascalCase (`HeaderProps`, `TeamMember`)
- Types: PascalCase
- Enums: PascalCase with PascalCase values

## File Structure (corporate)

### Pages
- `src/pages/index.astro` — Home
- `src/pages/join-us.astro` — Join us
- `src/pages/work-with-us.astro`: Work with us (contact form)
- `src/pages/team.astro` — Team
- `src/pages/careers.astro` — Careers
- `src/pages/tech.astro` — Technologies
- `src/pages/find-us.astro` — Find us
- `src/pages/legal-notice.astro` — Legal notice
- `src/pages/privacy-policy.astro` — Privacy policy
- `src/pages/404.astro`: Not found, emitted as `dist/404.html`

Internal links carry a trailing slash (`/join-us/`), matching `trailingSlash: 'always'` and the 301 the production bucket issues for the bare form.

### Assets
- `public/images/` — Static images (partners, team, technologies)
- `src/assets/icons/` — SVG icons imported as components

## Code Quality
- No `any` types — use proper typing
- Handle errors gracefully
- Use early returns to reduce nesting
- Keep functions small and focused
- Prefer static generation; avoid client-side JS unless strictly necessary