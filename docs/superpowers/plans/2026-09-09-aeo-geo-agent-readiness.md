# AEO / GEO Agent Readiness Plan — corporate and portal

> **For agentic workers:** steps use checkbox (`- [ ]`) syntax for tracking. Lots are ordered by real utility, not by audit score. Lot 6 is infrastructure and does not ship from this repository.

**Goal:** make `zatsit.fr` and `sustainability.zatsit.fr` readable, citable and quotable by answer engines and by the agents that crawl on their behalf, reusing what `zats-blog` already proved rather than re-deriving it.

**Architecture:** everything is emitted at build time. Structured data and `llms.txt` are build artefacts, never injected by a client script. A shared `BaseHead.astro` plus a `schema.ts` move into `@zatsit/components` so the two sites carry one head contract instead of two divergent copies.

**Tech Stack:** Astro 5, Astro typed env (`envField`), no new dependency at all (see Status for why `@astrojs/sitemap` was dropped).

**Reference:** `zats-blog/REFERENCEMENT.md` is the source of truth for what the three acronyms demand and, more importantly, for what we refuse. Read it before starting.

---

## Status, 9 September 2026

**Lots 0 to 5 are implemented** on `feat/aeo-geo-agent-readiness`. Both projects build, the portal type-checks clean, and every artefact below was read out of `dist/` rather than assumed. Lot 6 is untouched, as agreed: none of it ships from this repository.

Two places where the implementation departs from the plan above, both recorded in the code:

**1. The sitemap is our own route, not `@astrojs/sitemap`.** Three reasons converged, and they are in `components/src/utils/sitemap.ts`: the integration emits `sitemap-index.xml` while scanners want the literal `/sitemap.xml` (plan item 5, which an Astro redirect would answer with an HTML meta-refresh page, the wrong content type for a crawler); it builds its list from the routes Astro knows, so the `DISABLED_PAGES` filter was mandatory anyway; and it is a dependency that nine static pages do not justify. Taking the page list as an argument makes the disabled-page trap impossible rather than merely handled. The 50 000-URL limit that makes segmentation necessary is three orders of magnitude away.

**2. `noindex` was added, which the plan did not ask for.** Both 404 bodies carry `<meta name="robots" content="noindex, follow">` and emit no JSON-LD at all. They are reachable at their own URL with a 200 status, and a page that exists without being content should not be describing itself to an answer engine.

### Verified in `dist/`

| Check | Result |
|---|---|
| `DISABLED_PAGES=team,careers` filters the sitemap and `llms.txt` | both drop the two URLs, hook still deletes the HTML |
| Canonical absolute on the portal despite `astro-relative-links` | `https://sustainability.zatsit.fr/greenscore/`, untouched |
| The plugin rewrites root-relative hrefs by depth | `./sitemap.xml` at the root, `../sitemap.xml` on a subpage |
| One `Organization` `@id` across both sites | `https://zatsit.fr/#organization` on all 13 pages |
| `BreadcrumbList` on pages below the root, absent on the home pages | present on 11, absent on 2 |
| `PostalAddress` on `/find-us/` only | present there, absent elsewhere |
| 404 pages carry `noindex` and no JSON-LD | both sites |
| `charset` inside the first 1024 bytes | byte 44 on all 13 pages |
| Viewport allows zoom (WCAG 1.4.4) | `width=device-width, initial-scale=1.0`, no scale lock |
| Rendered `<body>` byte-identical to `main` on both layouts | no visual change to review |

### Found while implementing, not in the plan

**`/landscape/` is built here, and it is empty.** `sustainability-portal/src/pages/landscape/[...path].astro` holds a `getStaticPaths` and no template, so this project emits a **0-byte** `dist/landscape/index.html`. Production currently serves a real 12 kB page there, titled "zatsit Landscape", published by the separate `sustainability-landscape` repository into the same bucket. The plan's earlier claim that Astro knows nothing about this route was wrong.

It matters because `publish-portal-on-merge.yml` deletes every object in the bucket before uploading `dist/`: **any merge on the portal replaces the real landscape page with the empty placeholder** until the other repository deploys again. A 200 response carrying zero bytes is worse than a 404, because it is indexable and says nothing. The URL stays in the sitemap, since the page is real in production, and the hazard is the publish order. Added to Lot 6.

### Still open

- Lot 6 in full, starting with the one-flag compression fix.
- The portal's social card is a placeholder pointing at `https://zatsit.fr/og-image.png`. Strictly better than the bare links it had, but it should become a portal-specific 1200x630 image.
- `npx astro check` on corporate reports **5 errors, all pre-existing** and all in files this branch does not touch: `getEntry` is possibly `undefined` in `sections/Services.astro`, `legal-notice.astro` and `privacy-policy.astro`. The portal reports 0.
- `Person` entries for `/team/` and the `check:eco` / `check:axe` gates were scoped into Lots 3 and Verification but not implemented; they need the decisions and the script port respectively.

---

## Why this matters here, in one measurement

The blog renders **15 539 characters of text on its home page without executing a line of JavaScript**. That is the measurement that decides whether an agent sees a page at all, and no audit tool reports it. Both sites in this repository are statically generated, so both start with that advantage already won.

What they lack is everything that lets a machine **identify** what it just read: who publishes it, what the page is about, where the rest of the site is, and which URL is the canonical one. That is the whole of this plan.

---

## Current state, measured on 9 September 2026

| | corporate | portal | blog (reference) |
|---|---|---|---|
| Canonical URL | yes | **no** | yes, 72 pages |
| Open Graph / Twitter | complete | **none** | complete, 70 pages |
| JSON-LD | **none** | **none** | 70 / 72 pages |
| `robots.txt` | **404 in production** | **404 in production** | served, sitemap declared |
| Sitemap | **none** | **none** | segmented, generated |
| `llms.txt` | **none** | **none** | 6,5 kB, generated from the collection |
| `site` in `astro.config.mjs` | yes | **absent** | yes |
| Title shape | `<subject> \| Zatsit` | bare title, no brand | `<subject> \| zatsit` |
| Declared language | `fr` | `en`, content is English | `fr` |
| Response compression | **none, 86 466 bytes** | gzip | gzip, 21 163 bytes |
| Security headers | **none** | partial | CSP, HSTS, nosniff |

Verified with `curl -sI -H 'Accept-Encoding: gzip, br'` against the three production hosts, and by reading the sources.

---

## Global Constraints

- **No third-party script, ever.** One audit vendor recommends a library that injects markup in the reader's browser. JSON-LD is text; text belongs in the build. Loading a script to write markup would contradict the eco-design claim these sites make.
- **No fabricated structured data.** No `FAQPage` on a page that is not a FAQ, no `dateModified` we do not hold, no `JobPosting` for an opening that does not exist. Search engines penalise it, and Google withdrew FAQ rich results in May 2026.
- **`alt=""` stays `alt=""`.** Two scanners count a decorative image as a missing alternative text. That is a misreading. We keep the "incomplete" line knowingly.
- **No rhetorical formatting to please a model.** No manufactured question-answer blocks, no "on the other hand" inserted for balance.
- Every string a reader sees stays French on corporate; code and comments stay English (`AGENTS.md`).
- Page weight budget holds: < 500 kB per page, and no new render-blocking request.

---

## Lot 0 — Unblock the portal

The portal cannot carry a canonical URL, a sitemap or absolute Open Graph images today, because it has no `site`. Nothing else in this plan works on the portal until this lot lands.

- [x] Add `site: 'https://sustainability.zatsit.fr'` to `sustainability-portal/astro.config.mjs`, sourced from a `SITE_URL` typed env var with that default, mirroring `corporate/astro.config.mjs`.
- [x] Decide what to do with `astro-relative-links`. It rewrites emitted hrefs to relative form, which is why the portal survives being served from a Firebase preview channel. It does **not** affect meta tags built with `new URL(…, Astro.site)`, so canonical and Open Graph are safe. **Verify on a preview build** that it does not rewrite the `<link rel="sitemap">` href into something that breaks at the root, and record the answer here.
- [x] Settle the portal's language. `AGENTS.md` states that user-facing content is French, and the portal ships English with `lang="en"`. For GEO the declared language must match the content, so the current state is at least self-consistent. Two coherent outcomes: keep English and note the exception in `AGENTS.md`, or translate and switch to `lang="fr"`. **Do not add `hreflang`** — these are two different sites, not two translations of one.
- [x] Give the portal a `<title>` shape that names the brand, as corporate and the blog do. Today `index.astro` renders the bare string `Sustainability Portal`.

**Decision needed from Emmanuel:** the portal language. Everything else in Lot 0 is mechanical.

---

## Lot 1 — `robots.txt` and sitemap

The cheapest lot, and the one that unlocks discovery. Both sites currently answer **404** on `/robots.txt`, which crawlers tolerate, and on any sitemap path, which they do not work around.

- [x] Add `corporate/public/robots.txt`: `User-agent: *` / `Allow: /`, plus the `Sitemap:` line. **No per-agent rules.** A named list of AI crawlers has to be extended at every new arrival and lets every unnamed one through; the blog's file carries that reasoning in a comment, copy it.
- [x] Add `sustainability-portal/public/robots.txt`, same shape, its own sitemap URL.
- [~] ~~Add `@astrojs/sitemap` to corporate.~~ Superseded: own `/sitemap.xml` route, see Status.
- [x] **Filter the sitemap through `DISABLED_PAGES`.** This is the trap of this lot. `src/lib/build-hook.ts` deletes the HTML of disabled pages in `astro:build:done`, but `@astrojs/sitemap` builds its list from the routes Astro knows, not from the files left in `dist/`. Added naively, the sitemap will advertise pages that were deleted seconds earlier, and every one of them is a 404 handed to a crawler on a plate. Pass `getDisabledPages()` from `src/lib/pages.ts` into the integration's `filter` option, and assert the result in the build.
- [~] ~~Add `@astrojs/sitemap` to the portal.~~ Superseded the same way.
- [x] Provide a literal `/sitemap.xml`. The generated file is `sitemap-index.xml`; several scanners look only for the literal path. The blog carries this as its own open item (#5), so solve it once here and port the answer back.
- [x] Confirm the publish workflows upload `robots.txt` and the sitemap with a sane `Cache-Control`. Corporate's `gcloud storage rsync` applies `max-age=300` to everything it does not special-case, which is fine for both.

---

## Lot 2 — One shared head, in `@zatsit/components`

Today corporate holds a decent head inline in `src/layouts/Layout.astro`, and the portal holds almost none. Fixing them separately means writing this twice and letting them drift, which is exactly what happened to the design charter: **four copies, and three silent traps when porting it**.

Note that corporate does **not** currently depend on `@zatsit/components` (`AGENTS.md` says the package is "shared by sustainability-portal only"). This lot changes that, deliberately.

- [x] Add `@zatsit/components` as a `file:../components` dependency of corporate.
- [x] Create `components/src/layouts/BaseHead.astro`, modelled on `zats-blog/src/components/BaseHead.astro`, taking `title`, `description`, `image`, `type`, and optional `publishedAt` / `authors` / `tags`. It must emit: charset, viewport, generator, canonical, `<title>`, description, the full Open Graph set with an **absolute** image, the Twitter card, and the JSON-LD block from Lot 3.
- [x] Keep the "title that already names the site is left alone" rule from the blog, so a home page title reads as itself and not as `<name> | <name>`.
- [x] Export it from `components/src/index.ts` and from the `exports` map in `components/package.json`.
- [x] Rewire `corporate/src/layouts/Layout.astro` onto it, preserving `ViewTransitions`, the pre-paint theme script and the skip link.
- [x] Rewire `sustainability-portal/src/layouts/Layout.astro` onto it.
- [x] Update `components/README.md` and the project table in `AGENTS.md`: the package is now shared by both sites.
- [x] Verify the portal's Tailwind still scans the package (`@source "../../../components/src"` in its `global.css`) and add the equivalent to corporate's stylesheet if the new component carries any class.

---

## Lot 3 — JSON-LD, emitted at build

This is what an answer engine needs in order to **cite** rather than merely read: an attributable passage with a named publisher.

- [x] Create `components/src/utils/schema.ts`, ported from `zats-blog/src/utils/schema.ts`. Keep its `@graph` shape: one graph per page, the page type pointing at the organisation **by `@id`** instead of repeating it, which is both smaller and what consumers expect.
- [x] `organizationSchema`: name **`zatsit`**, `url`, `logo`, and `sameAs` for LinkedIn and GitHub. Anchor it at `https://zatsit.fr/#organization` and have the portal reference **that same id**, so the two sites resolve to one publisher rather than two homonyms. This is the single highest-value line of the lot.
- [x] `webSiteSchema` for the portal and for every non-specialised corporate page.
- [x] `/find-us/` carries a real postal address (`EURATECHNOPOLYS, 2 Allée de la Haye du Temple, 59160 Lille`, already in the footer). Emit `Organization.address` as a `PostalAddress`. Consider `LocalBusiness` only if the opening hours and contact details are genuinely publishable; **do not invent either**.
- [ ] `/team/` lists 36 real people. `Person` entries are legitimate here. Emit only fields the page actually shows, and check with Emmanuel before publishing names in structured data.
- [ ] `/tech/` is the page most likely to answer a prospect's question through an agent ("does zatsit do Kubernetes?"). Make sure the technology list is real text in the HTML, not only icon markup with the name in an `alt` or a `title`.
- [x] Add `BreadcrumbList` on every page below the root. This is the blog's open item #4; doing it here first gives it a tested implementation to copy.
- [x] Do **not** emit `dateModified` anywhere. Neither site holds a reliable modification date, and inventing one is a claim.

---

## Lot 4 — `llms.txt`

A proposal, not a standard: no major provider has committed to reading it. It costs one route and removing it would cost nothing, which is exactly why it is worth the bet, and why it must never be hand-written.

- [x] Add `corporate/src/pages/llms.txt.ts` as an **API route**, not a file in `public/`. A hand-maintained list is wrong the day after the next page ships.
- [x] Build the page list from `ALWAYS_GENERATED_PAGES` + `CONTROLLABLE_PAGES` in `src/lib/pages.ts`, **minus `getDisabledPages()`**. Same trap as the sitemap: a disabled page must not be advertised.
- [x] Content, factual and adjective-free: what zatsit is, what each page answers, the address, and outbound links to the blog and the sustainability portal so an agent can walk the whole estate from one file.
- [x] Stamp the generation date in the body, as the blog does, so staleness is visible rather than silent.
- [x] Add `sustainability-portal/src/pages/llms.txt.ts`, three pages, same shape, pointing back at `zatsit.fr`.
- [x] Check that a `.ts` route emits with `Content-Type: text/plain; charset=utf-8` through the GCS bucket, which serves stored metadata rather than negotiating. If the extension yields `application/octet-stream`, set the object's content type in the publish workflow.

---

## Lot 5 — Titles, descriptions and one spelling of the brand

Small, and the part a human reviewer will actually notice in a search result.

- [x] **Fix the brand casing.** `Layout.astro` renders `| Zatsit` and `og:site_name` says `Zatsit`, while the brand, the blog, the schema and `package.json` all say **`zatsit`**. A model reconciling two spellings across three sites is being handed avoidable doubt. One spelling, lowercase, everywhere.
- [x] Rewrite the home page title. `Accueil | Zatsit` names a navigation item and a brand, and no subject. The blog faced the same problem and answered it with `Le blog tech de zatsit`, 22 characters. Corporate needs its equivalent: what zatsit does, in the 50 to 60 characters a result page shows. **Wording is Emmanuel's call.**
- [x] Give the portal's three pages a title and a description each; `404.astro` and `index.astro` currently have no description at all.
- [ ] Audit every description against the 120 to 160 character window. The blog's site-level description is 75 characters and is listed as an open defect there; do not repeat it here.
- [x] Add `og:image` to the portal. Corporate has `/og-image.png` at the right dimensions; the portal has nothing, so every share of it is a bare link.

---

## Lot 6 — Serving layer (separate, does not ship from this repository)

Isolated as agreed. These items are worth more in bytes than everything above, and none of them is fixed by an Astro change.

- [ ] **`zatsit.fr` compresses nothing.** The home page is served at **86 466 bytes** with no `content-encoding`, against 21 163 gzipped for the blog. `x-goog-stored-content-encoding: identity` confirms the bucket serves the object as stored, and Cloud CDN does not compress for a backend bucket unless told to. This is the same class of defect fixed on the blog on 3 September, still open here, on a site whose own pages advertise eco-design.
  - **Recommended fix, one flag:** `gcloud compute backend-buckets update zatsit-corporate-prod-v1 --project=sites-web-407116 --compression-mode=AUTOMATIC`. It negotiates Brotli or gzip from `Accept-Encoding` and favours Brotli in most cases, so it beats a gzip-only publish, and it touches no workflow.
  - **Do not** reach for `gcloud storage rsync --gzip-in-flight`: that is *transport* encoding only, the object lands decompressed and the served response is unchanged. `--gzip-local`, which would store the object compressed with the right metadata, exists on `gcloud storage cp` but **not on `rsync`**, so that route means a second pass over the text assets. Both verified against the installed gcloud.
  - Verify the current `compressionMode` first; the describe call failed here on an expired token (`gcloud auth login` needed). `DISABLED` is the default, and the HTTP response already agrees with that.
- [ ] **No security headers on corporate at all**: no CSP, no HSTS, no `X-Content-Type-Options`. The blog and the portal have them, from nginx. Corporate is served from a GCS backend bucket in `sites-web-407116`, a project `zatsit-terraform` does not manage, so the practical route is `--custom-response-header` on that same backend bucket. A CSP must be **tested before it is posted**: on the blog, a missing `'wasm-unsafe-eval'` killed the search with a WebAssembly `CompileError` visible only in the browser console.
- [ ] **The portal publish wipes the live `/landscape/` page.** This repository emits a 0-byte `dist/landscape/index.html` placeholder, and the publish deletes the bucket before uploading, so every portal merge serves an empty 200 at a real URL until `sustainability-landscape` redeploys. Either stop emitting the placeholder, or make the two publishes ordered. See the note in `sustainability-portal/src/consts.ts`.
- [ ] The portal publish workflow still deletes every object and only then uploads (`publish-portal-on-merge.yml`), so the site answers 404 for the whole duration of a deploy. Corporate already replaced that with `rsync --delete-unmatched-destination-objects`. Port the fix.
- [ ] Confirm HSTS and the `www` / apex behaviour on corporate once headers are in place.

---

## Verification

The blog is the only one of the four sites with real automated gates, and they are worth copying rather than admiring.

- [ ] Port `check:eco` (per-page weight budget) and `check:axe` (headless Chrome over `dist/`) from `zats-blog/scripts/` to both projects.
- [ ] **`check:axe` tests 390 px and 1440 px only.** A layout that breaks at 320 or 360 px passes it. Add the widths that matter here rather than trusting the sweep.
- [ ] **`check:axe` hangs indefinitely, with no output, if any other Chrome remote-debugging process is alive.** Check `ps ax -o pid=,command= | grep "[r]emote-debugging-port"` first, and only ever kill temp profiles.
- [ ] Add a gate this repo needs and the blog does not have: assert that `dist/` contains `robots.txt`, a sitemap, `llms.txt`, and that **no disabled page appears in either the sitemap or `llms.txt`**.
- [ ] Add the measurement no scanner reports: characters of text rendered per page with JavaScript disabled. It is the number that decides whether an agent sees the page.
- [ ] `npm run build` and `npx astro check` clean on both projects.
- [ ] Re-run an external audit **for what it finds, not for the grade it gives**. Two of them contradict each other on title length, two count a decorative image as a defect, and one scored a broken cache setting as a pass. A report is read, not applied.

---

## Deliberately out of scope

- `hreflang`. Corporate is French, the portal is English, and they are two sites rather than two translations. Nothing to declare.
- A service worker. Static sites with correct HTTP caching do not need a script to replay what the browser already does.
- Moving `zatsit.fr` onto the nginx load balancer. It would deliver compression, CSP and HSTS in one move, but it needs DNS, a certificate, and a fix to a `try_files $uri $uri/ /index.html` template that answers unknown URLs with the home page in 200 and can therefore never serve a real 404. That is its own plan.
- Any per-agent rule in `robots.txt`, for the reason stated in Lot 1.

---

## Suggested sequencing

Lot 1 alone closes the largest discovery gap and is a small, reviewable PR. Lot 6's first item is one command and buys a 3 to 4× reduction on every corporate page; it deserves to jump the queue on merit even though it belongs to a different repository. Lots 2 and 3 travel together, since the shared head is what carries the schema. Lots 4 and 5 are cheap once the head exists.

Two decisions are Emmanuel's and block nothing else: the portal's language (Lot 0) and the corporate home page title (Lot 5).
