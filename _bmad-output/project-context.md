---
project_name: richard-design
user_name: Razvan
date: 2026-07-03
sections_completed:
  - technology_stack
  - language_rules
  - framework_rules
  - testing_rules
  - quality_rules
  - workflow_rules
  - anti_patterns
status: complete
rule_count: 42
optimized_for_llm: true
existing_patterns_found: 18
---

# Project Context for AI Agents

_This file contains critical rules and patterns that AI agents must follow when implementing code in this project. Focus on unobvious details that agents might otherwise miss._

---

## Technology Stack & Versions

| Layer | Choice |
|-------|--------|
| Build | **Vite** `^7.2.4` (`npm run dev` → port **3000**) |
| Language | **Vanilla JavaScript** ES modules (`"type": "module"`) — no React/Vue/TS |
| Markup | **Multi-page HTML** (`index.html` + `pages/*.html`) |
| Styling | Plain **CSS** with design tokens in `styles/tokens.css` |
| Data | Static **JSON** mocks in `data/` (`categories.json`, `brands.json`, `products.json`) |
| Cart | **localStorage** key `richard_cart` |
| Locale | **fr-CH**, prices in **CHF** (`Intl.NumberFormat`) |

---

## Critical Implementation Rules

### Language-Specific Rules

- Use **ES module** imports with explicit `.js` extensions: `import { foo } from "./utils.js"`.
- All new JS files go under `js/`; entry point is `js/app.js` loaded via `<script type="module">`.
- Page identity comes from `document.body.dataset.page` — read via `getCurrentPageKey()` in `js/utils.js`; do not invent another routing mechanism.
- Price formatting must use `formatPriceCHF()` — never hand-format currency strings.
- Query params must use `parseQueryParams()` — product/category/brand pages rely on `?slug=`.
- Data access goes through `js/data.js` (`getProducts`, `getCategories`, etc.) with in-memory cache — do not fetch JSON directly from components.
- File header comments in **French**; identifiers (files, functions, classes, variables) in **English**.

### Framework-Specific Rules

- **No SPA framework** — UI is built with `innerHTML` templates inside `js/render.js`. New dynamic pages follow the same pattern: shell HTML + `initXxxPage()` in `render.js` + case in `app.js` switch.
- Shared chrome (header, footer, nav) is injected by `renderSharedLayout()` — pages must expose `<header id="site-header">` and `<footer id="site-footer">`.
- New routable HTML pages must: (1) live in `pages/` or root, (2) set `data-page` on `<body>`, (3) be picked up by Vite `collectHtmlInputs()` in `vite.config.js`.
- Static assets copied to `dist` on build: `data/`, `assets/`, `homepage/`, `product/` — add new static roots in `copyStaticDirsPlugin()` if needed.
- Product pricing logic is centralized in `render.js` (`getProductMinimumPrice`, `productHasPromotion`, `getProductComparePrice`) — reuse these helpers; variable products use `variations[]` with `size`, `firmness`, `cover`, `technology`, `price`, `inStock`.
- Image fallbacks use `getProductImageUrl()` / SVG placeholders in `utils.js` — always add `onerror` fallback on dynamic `<img>` tags.
- Cart items store `productId`, `variationId`, `price`, `quantity`, `image`, full `product` snapshot — match this shape when extending cart logic.

### Testing Rules

- **No test suite exists yet** for application code — when adding tests, follow enterprise policy: E2E (Playwright preferred) for UI flows, unit tests for pure helpers in `js/utils.js` and `js/data.js`.
- Test titles/describe blocks in **English**; code comments in **French**.
- Minimum per public helper: one nominal case + one edge case.
- Place tests under `Tests/` or `e2e/` per project convention once introduced.

### Code Quality & Style Rules

- CSS design tokens live in `styles/tokens.css` — use `var(--color-primary)`, `var(--font-family-base)`, etc.; brand palette: primary `#007e9e`, strong `#005670`, accent `#8cc8a7`, soft `#c2cfb0`.
- Stylesheet load order on pages: `base.css` → `layout.css` → `components.css` (+ page-specific like `product-page.css` if needed).
- Prefer existing BEM-like prefixes: `rd-` (shell), `category-`, `cart-`, `checkout-`, `product-`.
- HTML `lang="fr"` on all pages; user-facing copy in **French**.
- Accessibility: `aria-label` on icon-only controls, `sr-only` labels on search, keyboard support on modals/lightbox (see product page pattern).

### Development Workflow Rules

- Scripts: `npm run dev` (dev), `npm run build` (prod → `dist/`), `npm run preview`.
- Commit prefixes: `FEATURE:`, `FIX:`, `TASK:`, `DOC:` — description in **French**; never commit without explicit user request.
- Git Flow standard; no force-push to main.
- BMAD artifacts: planning → `_bmad-output/planning-artifacts/`, implementation → `_bmad-output/implementation-artifacts/`, long-term docs → `docs/`.

### Critical Don't-Miss Rules

- **`homepage/` and `product/`** are standalone design mockups with local `index.html` and assets — the live app uses root `index.html` and `pages/*.html` with shared `js/`. Do not wire mockup folders as the main app without explicit intent.
- Adding a page to `pages/` without updating `app.js` switch leaves it static-only (no JS init).
- Category filters are **slug-dependent** (`matelas`, `sommier`, `literie`, `liquidation`) — filter keys differ per slug in `categoryFilterKeys`; extend consistently.
- Checkout is **demo/mock** — Payrexx not integrated; form redirects to `?confirmed=true` and clears cart.
- `src/main.js` and `src/counter.js` are Vite scaffold leftovers — app logic lives in `js/`, not `src/`.
- Do not add npm dependencies without need — project intentionally stays zero-runtime-dependency beyond Vite.
- Never store secrets in repo; no `.env` commits.
- When editing `render.js`, file is large (~2600 lines) — add functions near their page section, avoid unrelated refactors.

---

## Usage Guidelines

**For AI Agents:**

- Read this file before implementing any code.
- Follow ALL rules exactly as documented.
- When in doubt, prefer the more restrictive option.
- Update this file if new patterns emerge.

**For Humans:**

- Keep this file lean and focused on agent needs.
- Update when technology stack changes.
- Review quarterly for outdated rules.
- Remove rules that become obvious over time.

Last Updated: 2026-07-03
