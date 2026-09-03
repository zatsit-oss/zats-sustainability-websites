# Architecture

## Overview

**zatsit** website is a static, eco-designed corporate website built with Astro and Tailwind CSS. It supports light and dark themes and follows a component-based architecture.

## Tech Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| Astro | 5.x | Static site generator |
| Tailwind CSS | 4.x | Utility-first CSS framework |
| TypeScript | 5.x | Type safety |
| Firebase Hosting | - | Deployment |

## Project Structure

```
zatsit-website/
├── .claude/                    # Claude Code configuration
│   ├── commands/               # Custom slash commands
│   ├── rules/                  # Project rules
│   └── settings.local.json     # Local permissions
├── docs/                       # Documentation
├── public/                     # Static assets (favicon)
├── src/
│   ├── assets/
│   │   └── icons/              # SVG icons (imported as components)
│   ├── components/
│   │   ├── sections/           # Page sections (Hero, Services, etc.)
│   │   ├── Header.astro        # Site header with navigation
│   │   ├── Footer.astro        # Site footer
│   │   ├── Logo.astro          # Zatsit logo component
│   │   └── ThemeToggle.astro   # Light/dark theme switcher
│   ├── layouts/
│   │   └── Layout.astro        # Main page layout
│   ├── pages/                  # File-based routing
│   │   ├── index.astro         # Homepage
│   │   ├── join-us.astro       # Join the team
│   │   ├── work-with-us.astro  # Contact form
│   │   ├── team.astro          # Team page
│   │   ├── tech.astro          # Technologies page
│   │   ├── careers.astro       # Job offers page
│   │   ├── find-us.astro       # Location page
│   │   ├── legal-notice.astro  # Legal mentions
│   │   ├── privacy-policy.astro # Privacy policy
│   │   └── 404.astro           # Not found, emitted as dist/404.html
│   └── styles/
│       └── global.css          # All styles (variables, components)
├── astro.config.mjs            # Astro configuration
├── AGENTS.md                   # AI agent guidelines (root)
├── package.json                # Dependencies and scripts
└── tsconfig.json               # TypeScript configuration
```

## Architecture Decisions

### 1. Static Site Generation
- All pages are pre-rendered at build time
- No client-side JavaScript except for theme toggle and mobile menu
- Optimized for performance and eco-design

### 2. Component Architecture

```
Layout.astro
├── Header.astro
│   ├── Logo.astro
│   └── ThemeToggle.astro
├── <slot /> (page content)
│   └── Section components (Hero, Services, etc.)
└── Footer.astro
```

### 3. Styling Strategy

**Centralized CSS** (`src/styles/global.css`):
- CSS variables for theming
- Reusable component classes (`.btn-primary`, `.section-title`, etc.)
- No inline Tailwind chains for repeated patterns

**Theme System**:
```css
:root { /* Light theme variables */ }
[data-theme="dark"] { /* Dark theme variables */ }
```

### 4. Icon System

- SVG files stored in `src/assets/icons/`
- Imported as Astro components
- Use `currentColor` for theme adaptation
- Size classes: `.icon-sm`, `.icon-md`, `.icon-lg`

```astro
import MailIcon from '../assets/icons/mail.svg';
<MailIcon class="icon-md" />
```

### 5. Environment Variables

Defined in `astro.config.mjs`:
- `SITE_URL` - Main site URL
- `BLOG_URL` - Blog URL
- `LINKEDIN_URL` - LinkedIn company page
- `GITHUB_URL` - GitHub organization

## Data Flow

```
astro.config.mjs (env vars)
        ↓
    Layout.astro
        ↓
    Page (index.astro, etc.)
        ↓
    Section components
        ↓
    global.css (styles)
```

## Build Process

```bash
npm run dev      # Development server (port 4321)
npm run build    # Production build → dist/
npm run preview  # Preview production build
```

## Deployment

Static files in `dist/` are deployed to Firebase Hosting.
