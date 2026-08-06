---
title: 'Redesign page produit — alignement richard2026'
type: 'feature'
created: '2026-07-06'
status: 'done'
baseline_commit: '12f275174e4cb3930d9cb5caae6fbc88cdba7d73'
context:
  - '{project-root}/_bmad-output/project-context.md'
  - '{project-root}/_bmad-output/planning-artifacts/prds/prd-richard-design-2026-07-03/addendum.md'
  - '{project-root}/_bmad-output/implementation-artifacts/spec-categories-redesign.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** La page `pages/product.html` et ses styles (`styles/product-page.css`) utilisent encore une maquette locale (Arial, classes legacy `.rd-product-page`, cartes rails simplifiées) déconnectée du design system richard2026. Elle ne correspond pas visuellement à la fiche produit de référence https://richard2026.ddev.site/boutique/matelas/matelas-matelas/matelas-dream-away-imperial/.

**Approach:** Redesigner la fiche produit en conservant toute la logique JS existante (`initProductPage()`, variations, panier, lightbox, accordéon, rails, bloc conseil). Aligner le markup généré dans `js/render.js` et les styles sur richard2026 (`single-product.scss`, `product-rail`, accordéon, bandeau services). Référence visuelle = richard2026.ddev.site uniquement — pas le dossier local `product/`.

## Boundaries & Constraints

**Always:**
- Conserver URLs, `data-page="product"`, IDs DOM (`#product-page`, `#product-gallery-panel`, `#product-summary-panel`, `#product-details-panel`, `#product-lightbox-root`, `#product-quantity-display`, `#product-add-to-cart`) et logique `initProductPage()` / helpers prix-variations dans `js/render.js`
- Utiliser les tokens `styles/tokens.css` et polices SuisseIntl/Pryced Serif (via `styles/fonts.css` importé par `base.css`)
- Référence visuelle : richard2026 (breadcrumb vert promo, galerie 2 col ≥1024px, summary avec logo marque, chips variations, prix catalogue + promo, CTA primaire, bandeau services, accordéon, rail produits similaires, bloc conseil)
- Conserver toutes les sections mock existantes (benefits, accordéon Description/Caractéristiques/Livraison/Garantie/Avis, rails similaires + recommandés, conseil) — les habiller richard2026
- Commentaires code en français ; identifiants en anglais
- Livrer tests E2E Playwright pour la page produit

**Ask First:**
- Suppression de sections mock (ex. rail « Nous vous recommandons aussi ») si absentes sur richard2026 prod
- Changement de structure HTML qui casse les sélecteurs JS ou les listeners existants

**Never:**
- S'inspirer du dossier `product/` à la racine du repo
- Modifier `data/*.json`, routing Vite, ou comportement panier
- Introduire React/TS ou dépendances UI

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| Variable product | `/pages/product.html?slug=matelas-superba-elegance` | Breadcrumb, galerie, H1, prix CHF promo, chips/selects variations, quantité, CTA panier, services, accordéon, rails | Message panier si config sur commande |
| Simple product | `/pages/product.html?slug=matelas-richard-signature` | Fiche sans selects variations ; prix et CTA fonctionnels | N/A |
| Unknown slug | `/pages/product.html?slug=inexistant` | Carte « Produit introuvable » | Comportement actuel conservé |
| Gallery multi-images | Produit avec `images[]` | Miniatures grille 5 col, lightbox clavier/souris | Fallback `getProductImageUrl()` |
| Add to cart | Clic « Ajouter au panier » | Feedback texte + item dans `richard_cart` | Variation requise si `type: variable` |

</frozen-after-approval>

## Code Map

- `pages/product.html` — shell fiche produit ; wrapper `main.rd-page` + `layout-wide` ; lier feuilles existantes (pas de Poppins)
- `js/render.js` — `initProductPage()`, `renderSummary()`, `renderGallery()`, `renderProductAccordion()`, `renderProductBenefits()`, rails et cartes : markup classes richard2026 (`single-product__layout`, `product-summary__header`, `product-option-card`, `product-chip`, `product-cart-row`, `product-rail-*`)
- `styles/product-page.css` — refactor tokens/polices ; remplacer Arial et vars locales `--rdp-*` par palette richard2026
- `styles/components.css` — aligner styles partagés lightbox / `product-rail-*` si chevauchement avec fiche produit
- `styles/richard-design.css` — réutiliser patterns breadcrumb / boutons si applicable
- `/Volumes/www/richard2026/.../modules/single-product.scss` — référence layout galerie + summary
- `/Volumes/www/richard2026/.../template-parts/component/product-rail.php` — référence rail similaires
- `/Volumes/www/richard2026/.../template-parts/component/product-accordion.php` — référence accordéon
- `Tests/e2e/product.spec.js` — (nouveau) tests E2E fiche produit variable + slug inconnu

## Tasks & Acceptance

**Execution:**
- [x] `pages/product.html` -- refactor shell (`main.rd-page`, `layout-wide`, structure sémantique) -- alignement layout richard2026
- [x] `js/render.js` -- mettre à jour templates `initProductPage` (breadcrumb `<ol>`, classes galerie/summary/options/cart/benefits/accordion/rails) -- markup cohérent sans casser listeners
- [x] `styles/product-page.css` -- restyler fiche complète (galerie, summary, options, CTA, benefits, accordéon, advice) selon tokens richard2026 -- remplacer styles legacy Arial
- [x] `styles/components.css` -- harmoniser lightbox et `product-rail-*` avec la fiche produit richard2026 -- cohérence visuelle rails
- [x] `Tests/e2e/product.spec.js` -- tests Playwright fiche variable, breadcrumb, promo, accordéon, add-to-cart -- couverture enterprise

**Acceptance Criteria:**
- Given `/pages/product.html?slug=matelas-superba-elegance`, when la page charge, then un breadcrumb richard2026 (Accueil vert promo, séparateur ›), une grille 2 colonnes ≥1024px (galerie + summary), un H1 Pryced/SuisseIntl, et un prix CHF formaté sont visibles
- Given un produit en promotion, when le summary s'affiche, then le prix catalogue barré et le pourcentage promo (`-10%`) apparaissent en vert `#287D63`
- Given un produit variable, when l'utilisateur clique un chip de fermeté, then la sélection s'active visuellement (fond vert promo) et le prix se met à jour
- Given la galerie multi-images, when l'utilisateur clique une miniature, then l'image principale change et la miniature active a une bordure accent
- Given le CTA panier, when l'utilisateur ajoute au panier, then un message de confirmation s'affiche sous le bouton
- Given desktop 1280px, when on compare avec https://richard2026.ddev.site/boutique/matelas/matelas-matelas/matelas-dream-away-imperial/, then palette (`#082B4E`, `#FBF6ED`, `#287D63`) et typo SuisseIntl/Pryced Serif sont cohérentes — sans police Arial/Poppins

## Spec Change Log

- **2026-07-06 — polish summary/galerie** : miniatures sans fond, image principale réduite, options actives = bordure foncée sans fond, quantité non bold, livraison indicative alignée gauche, accordéon bordure recherche, conseil titres bold + détails normaux.
- **2026-07-06 — corrections UX fiche** : image galerie `object-fit: contain` et hauteur réduite ; livraison en carte label/valeur comme Housse ; option « Housse thermorégulée » ; titre conseil en `h3` display bold.
- **2026-07-06 — bloc conseil** : lead 16px ; icônes SVG services (téléphone, courrier, magasin) 48px ; CTA « Contactez-nous » vers page contact.
- **2026-07-06 — galerie et conseil** : image produit agrandie dans le cadre ; cartes conseil pleine largeur (padding horizontal retiré, flex).
- **2026-07-06 — polish fiche** : logo marque réduit ; conseil marges restaurées + intérieur cartes optimisé ; livraison inline ; galerie images matelas Roviva ; housse = 2 valeurs explicites (`coverOptions`) ; galerie limitée à 5 miniatures.
- **2026-07-06 — breadcrumb produit** : couleur uniforme texte (sans vert promo) ; page courante en bold.

## Suggested Review Order

**Shell & layout**

- Point d'entrée : wrapper `main.rd-page` + conteneur wide pour la fiche
  [`product.html:13`](../../pages/product.html#L13)

**Markup dynamique (render.js)**

- Orchestration page : breadcrumb, layout 2 col, rails, accordéon richard2026
  [`render.js:2051`](../../js/render.js#L2051)

- Summary : header titre/marque, prix promo, options chips, CTA panier
  [`render.js:2356`](../../js/render.js#L2356)

- Rails horizontaux réutilisant les cartes archive + scroll prev/next
  [`render.js:1825`](../../js/render.js#L1825)

**Styles**

- Tokens richard2026 scoped `.single-product-page` (galerie, summary, services, rails)
  [`product-page.css:1`](../../styles/product-page.css#L1)

**Tests**

- Couverture E2E fiche variable, promo, galerie, panier, slug inconnu
  [`product.spec.js:1`](../../Tests/e2e/product.spec.js#L1)

## Design Notes

```html
<div class="product-summary__header">
  <h1 class="product_title">…</h1>
  <div class="product-brand">…</div>
</div>
<div class="price-display">
  <div class="price-display__current">CHF …</div>
  <div class="price-display__catalog">Prix catalogue <span>…</span> <strong>-10%</strong></div>
</div>
```

Options : `product-option-card` + `product-chip.is-active` ou `select.product-option-card__select.is-selected`. CTA : `product-cart-row` (qty 3 boutons + bouton primaire caps).

Galerie : image principale `border-radius: 4px`, miniatures grille 5 colonnes, badge promo `accent-strong` en haut à gauche.

## Verification

**Commands:**
- `npm run test:e2e -- Tests/e2e/product.spec.js` -- expected: all tests pass
- `npm run build` -- expected: build succeeds without errors

**Manual checks:**
- Comparer `/pages/product.html?slug=matelas-superba-elegance` avec richard2026.ddev.site (desktop + 375px mobile)
- Vérifier lightbox (Escape, flèches) et accordéon (expand/collapse)
