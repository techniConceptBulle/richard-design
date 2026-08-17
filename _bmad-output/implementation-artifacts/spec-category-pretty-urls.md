---
title: 'Category pretty URLs (/categorie/{slug})'
type: 'feature'
created: '2026-08-17'
status: 'done'
baseline_commit: 'd16c17de2da07842c9c8e93be2cf71b0e3a416bb'
context:
  - '{project-root}/_bmad-output/project-context.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** Category links use query strings (`/pages/category.html?slug=matelas`), which are opaque and not shareable as clean paths. The desired public URL shape is `/categorie/matelas`.

**Approach:** Keep the single `category.html` page. Resolve the category slug from the path `/categorie/{slug}` (with `?slug=` still readable for compatibility). Emit all category navigation/links in the new form. Add Vite rewrites so `/categorie/*` serves the category page in dev and preview.

## Boundaries & Constraints

**Always:**
- Public category hrefs use `/categorie/{slug}` (slug from data, URL-safe as today).
- Search stays on `/pages/category.html?q=...` (forms unchanged).
- Brands and products keep `?slug=` — out of this change.
- Dual read: path `/categorie/:slug` wins when present; else `?slug=`; `?q=` still overrides listing mode.
- Nav active state must recognize `/categorie/{slug}`.
- Assets remain root-absolute (already true on category page).

**Ask First:**
- Adding production host rewrite files (`.htaccess`, nginx, Netlify `_redirects`, etc.) if not already required by deploy docs.
- Hard redirect from `/pages/category.html?slug=x` to `/categorie/x` (beyond keeping both readable).

**Never:**
- One HTML file per category.
- Pretty-URLing brands, products, or search `?q=`.
- SPA router / History API navigation for categories.
- Changing listing/filter behavior or category data model.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| Happy path | GET `/categorie/matelas` | Same category listing as former `?slug=matelas` | N/A |
| Legacy query | GET `/pages/category.html?slug=matelas` | Page still resolves category (no breakage) | N/A unless redirect approved |
| Search | GET `/pages/category.html?q=duvet` | Search mode unchanged; path slug ignored | N/A |
| Unknown slug | `/categorie/does-not-exist` | Same as today: empty shell, no crash | Silent empty (existing) |
| Liquidation | `/categorie/liquidation` | Liquidation listing behavior unchanged | N/A |
| Child category | `/categorie/duvets` | Child listing + filters as today | N/A |
| Missing slug | `/categorie/` or bare category.html | Empty shell (existing no-slug behavior) | Silent return |

</frozen-after-approval>

## Code Map

- `js/utils.js` -- `parseQueryParams()`; add path/slug helpers and `getCategoryUrl(slug)`
- `js/render.js` -- `MAIN_NAV`, `initCategoryPage()`, `isNavItemActive`, product breadcrumbs, home panels
- `js/footer-config.js` -- footer category hrefs
- `js/app.js` -- routes `data-page="category"` to `initCategoryPage()`
- `pages/category.html` -- shell; may need `data-page` detection when rewritten URL is active
- `vite.config.js` -- `configureServer` + `configurePreview` rewrite `/categorie/:slug` -> `/pages/category.html`
- `index.html`, `pages/magasin-crissier.html`, `pages/advice.html`, `pages/contact.html` -- hardcoded category hrefs
- `Tests/e2e/*.spec.js` (+ any unit tests asserting old hrefs) -- update expectations to `/categorie/...`

## Tasks & Acceptance

**Execution:**
- [x] `js/utils.js` -- add `getCategoryUrl(slug)` and `getCategorySlugFromLocation()` (path first, then query) -- single source for link + resolve
- [x] `js/render.js` -- use helpers for nav, breadcrumbs, home links; fix `isNavItemActive` for `/categorie/{slug}`; `initCategoryPage` reads slug via helper
- [x] `js/footer-config.js` -- category hrefs via `getCategoryUrl` or `/categorie/{slug}`
- [x] `index.html`, `pages/magasin-crissier.html`, `pages/advice.html`, `pages/contact.html` -- replace hardcoded `category.html?slug=` with `/categorie/{slug}`
- [x] `vite.config.js` -- rewrite `/categorie/:slug` to category page for dev and preview
- [x] `pages/category.html` / `js/app.js` -- ensure page still initializes when URL is `/categorie/...` (body `data-page` must be present after rewrite)
- [x] `Tests/` -- unit tests for URL helpers (nominal + edge); update E2E/assertions that expect `?slug=` category links
- [x] Unit-test I/O matrix edge cases for `getCategorySlugFromLocation` / `getCategoryUrl`

**Acceptance Criteria:**
- Given a known slug `matelas`, when a user opens `/categorie/matelas` in Vite dev or preview, then the Matelas listing renders as before.
- Given any in-app category link (nav, footer, home, magasin, advice, contact, product breadcrumb), when inspected, then `href` is `/categorie/{slug}` not `category.html?slug=`.
- Given `/pages/category.html?slug=matelas`, when opened, then the listing still works (legacy read).
- Given header search submit, when searching, then URL remains `/pages/category.html?q=...` and search results still show.
- Given current nav item for Matelas, when on `/categorie/matelas`, then that nav item is marked active.
- Given brand/product links, when unchanged scope, then they still use `?slug=` pages.

## Spec Change Log

## Design Notes

Vite has no SPA fallback today. Serve `pages/category.html` for `/categorie/*` in `configureServer` and `configurePreview` so Playwright preview matches production intent. After rewrite, `window.location.pathname` is still `/categorie/matelas` while the HTML body (with `data-page="category"`) comes from `category.html` — init must key off `data-page`, not pathname.

```js
// Golden examples
getCategoryUrl("matelas") // "/categorie/matelas"
// pathname /categorie/matelas -> slug "matelas"
// search ?slug=matelas on category.html -> slug "matelas"
// ?q=foo present -> search mode (existing), slug optional
```

Production static hosts need an equivalent rewrite; do not invent host config unless Ask First is approved.

## Verification

**Commands:**
- `npm test` or project unit runner covering `js/utils.js` helpers -- expected: pass
- Playwright E2E for categories/home (after href updates) -- expected: pass against preview with rewrite

**Manual checks (if no CLI):**
- Open `/categorie/matelas`, `/categorie/liquidation`, and a child slug; confirm listing + nav active.
- Confirm search form still lands on `category.html?q=`.

## Suggested Review Order

**URL helpers**

- Single source for public category hrefs and dual slug resolution
  [`utils.js:30`](../../js/utils.js#L30)

- Path `/categorie/{slug}` wins; legacy `?slug=` only on `category.html`
  [`utils.js:43`](../../js/utils.js#L43)

**Dev/preview rewrite**

- Vite middleware keeps browser URL while serving `category.html`
  [`vite.config.js:59`](../../vite.config.js#L59)

**Page init and nav**

- Category page reads slug from location helper (search `?q=` unchanged)
  [`render.js:889`](../../js/render.js#L889)

- Nav active compares category slugs across pretty and legacy URLs
  [`render.js:218`](../../js/render.js#L218)

- Primary nav emits `/categorie/{slug}` via `getCategoryUrl`
  [`render.js:81`](../../js/render.js#L81)

**Static and footer links**

- Footer category hrefs switched to pretty paths
  [`footer-config.js:33`](../../js/footer-config.js#L33)

- Home / magasin / advice / contact hardcoded hrefs updated
  [`index.html:36`](../../index.html#L36)

**Tests**

- Unit coverage for helpers and I/O edge cases
  [`category-urls.test.js:1`](../../Tests/unit/category-urls.test.js#L1)

- E2E hits `/categorie/matelas` plus legacy `?slug=` smoke
  [`categories.spec.js:19`](../../Tests/e2e/categories.spec.js#L19)
