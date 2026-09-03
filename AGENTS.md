# Zatsit Websites — Monorepo

## Overview

Monorepo hosting all **zatsit** websites and web projects. Each project is independent with its own dependencies, build pipeline, and deployment target.

## Projects

| Project | Path | Stack | Deployment | Description |
|---------|------|-------|------------|-------------|
| **Corporate** | `corporate/` | Astro 5 + Tailwind 4 + TS | GCS bucket + Cloud CDN | Institutional website (zatsit.fr) |
| **Sustainability Portal** | `sustainability-portal/` | Astro 5 + Tailwind 4 + TS | GCS bucket + nginx on Cloud Run | Eco-design portal & GreenScore landing |
| **Components Library** | `components/` | Astro + Tailwind | npm local dep | Shared components for sustainability-portal |

### Project-specific instructions

- **Corporate**: see `corporate/CLAUDE.md`, which is authoritative for that project, on top of this file and `.claude/rules/`
- **Sustainability Portal**: no per-project CLAUDE config — follow this file and `.claude/rules/`
- **Components Library**: shared by sustainability-portal only. It carries no styles: the portal provides the charter, and declares `@source "../../../components/src"` so Tailwind scans it. See `components/README.md`.

Shared rules live in [`.claude/rules/`](.claude/rules/) at the root:
- `rules.md` — conventions (language, git, components, types, file structure)
- `quality.md` — performance, a11y, eco-design, responsive
- `security.md` — secrets, dependencies, content security

## Commands

Each project manages its own scripts. Always `cd` into the project directory first.

```bash
# Corporate
cd corporate && npm install && npm run dev     # port 4321
cd corporate && npm run build                  # production build → dist/

# Sustainability Portal
cd sustainability-portal && npm install && npm run dev
cd sustainability-portal && npm run build
```

## General Conventions

### Language

- **Code** (variables, functions, file names, comments, commits): English
- **User-facing content** (website text): French
- **Documentation** (README, guides): English

### Git Commits (Angular Convention)

Format: `type(scope): description`

**Types**: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `chore`

**Scopes**: project name or area affected
- `corporate` — corporate website changes
- `portal` — sustainability portal changes
- `components` — shared components library
- `ci` — GitHub Actions workflows
- Global docs: use no scope or `docs`

```bash
# Examples
git commit -m "feat(corporate): add contact page"
git commit -m "fix(portal): fix footer responsive layout"
git commit -m "chore(ci): update deploy workflow"
git commit -m "docs: update contributing guide"
```

**Rules**:
- Imperative mood: "add" not "added"
- No capital letter at start
- No period at end
- Under 72 characters

### Naming

- **Files**: kebab-case (`my-component.astro`)
- **Variables/Functions**: camelCase
- **Constants**: UPPER_SNAKE_CASE
- **Classes/Components**: PascalCase

### Brand

- In text: **zatsit** (lowercase, bold)
- In titles/logo: Zatsit (capital Z)

## Tech Stack (shared)

- **Astro** — Static site generator (SSG, zero JS by default)
- **Tailwind CSS** — Utility-first CSS
- **TypeScript** — Type safety
- **Google Cloud Storage** for production hosting, behind a load balancer
- **Firebase Hosting** for pull request previews only, never production
- **Node.js 22** — Runtime

### Key Design Principles

1. **Static generation** — No client-side JS unless strictly necessary
2. **Eco-design** — Lightweight pages (< 500KB), self-hosted fonts, no tracking
3. **Accessibility** — Semantic HTML, ARIA labels, WCAG AA contrast
4. **Responsive** — Mobile-first, test at mobile/tablet/desktop breakpoints

## CI/CD

GitHub Actions workflows in `.github/workflows/`:

- `publish-corporate-on-merge.yml`: publishes corporate on merge to `main`, and on manual dispatch
- `publish-portal-on-merge.yml` — Deploy sustainability-portal on merge to `main`
- `publish-portal-on-PR.yml` — Preview deployment on PRs for sustainability-portal
- `deploy-corporate-on-PR.yml` — Preview deployment on PRs for corporate (Firebase preview channel)

Mind the asymmetry between the two publish workflows: a merge on `main` deploys **corporate to staging** and **the portal straight to production**. Corporate production requires a manual `workflow_dispatch` with `env=production`. Both skip their preview job on Dependabot pull requests, which have no access to the repository secrets.

Custom actions in `.github/actions/`:
- `astro/` — Build an Astro project
- `landscape2/` — Build sustainability landscape content


## Security

- Never commit secrets, API keys, `.env` files
- Validate all user inputs
- No external tracking scripts
