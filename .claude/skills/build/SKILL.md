---
name: build
description: Run the production build for one of the monorepo projects (corporate or sustainability-portal)
---

This is a monorepo — there is **no `package.json` at the root**. You must `cd` into a project before running `npm run build`.

## Corporate

```bash
cd corporate && npm run build
```

Output: `corporate/dist/`.

## Sustainability Portal

```bash
cd sustainability-portal && npm run build
```

Output: `sustainability-portal/dist/`.

## Notes

- Fix any TypeScript or Astro errors before re-running.
- Preview the production build locally with `npm run preview` from the same project directory.
- Production for both projects is a Google Cloud Storage bucket behind a load balancer. The `firebase.json` of each project only drives pull request previews.
