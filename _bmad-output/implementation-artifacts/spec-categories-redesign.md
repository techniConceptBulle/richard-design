---
title: 'Redesign page archive catégorie — alignement richard2026'
type: 'feature'
created: '2026-07-06'
status: 'done'
baseline_commit: '5c0cfe2acfb5d42b885ed79a79b813550781e7a7'
context:
  - '{project-root}/_bmad-output/project-context.md'
  - '{project-root}/_bmad-output/planning-artifacts/prds/prd-richard-design-2026-07-03/addendum.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** La page `pages/category.html` utilisait encore l’ancien design (Poppins, cartes génériques, styles déconnectés du design system richard2026). Elle ne correspondait pas visuellement au site de référence https://richard2026.ddev.site/.

**Approach:** Redesigner l’archive catégorie en conservant le contenu et le comportement JS existants (données JSON, filtres, tri). La recherche header (`?q=`) est servie par le même template `category.html`. Référence visuelle = richard2026.ddev.site uniquement.

**Scope change (2026-07-09):** La page liste `pages/categories.html` est retirée — les univers literie de la Home et les archives `category.html?slug=` suffisent.

## Boundaries & Constraints

**Always:**
- Conserver URL `pages/category.html`, `data-page`, IDs DOM (`#category-filters`, etc.) et logique `initCategoryPage()` dans `js/render.js`
- Recherche globale via `/pages/category.html?q=` (sans slug)
- Utiliser les tokens `styles/tokens.css` et polices SuisseIntl/Pryced Serif (via `styles/fonts.css`)
- Référence visuelle : https://richard2026.ddev.site/ (breadcrumb, grille produits Woo `ul.products.columns-4`)
- Commentaires code en français ; identifiants en anglais
- Livrer tests E2E Playwright pour archive + recherche

**Ask First:**
- Suppression ou refonte majeure des filtres avancés mock (prix, dureté, etc.) si le rendu richard2026 ne les montre pas
- Changement de structure HTML qui casse les sélecteurs JS existants

**Never:**
- S’inspirer des dossiers `homepage/` ou `product/` à la racine du repo
- Modifier `data/*.json`, routing Vite, ou comportement panier
- Introduire React/TS ou dépendances UI
- Réintroduire `pages/categories.html`

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| Search mode | `/pages/category.html?q=matelas` | Titre résultats, filtres masqués, cartes produit restylées richard2026 | Message vide si 0 résultat |
| Category archive | `/pages/category.html?slug=matelas` | Breadcrumb richard2026, titre H1, barre filtres/tri, grille 4 colonnes desktop | Page vide si slug inconnu (comportement actuel) |
| Filters active | Filtre marque + tri prix | Grille filtrée, pastilles actives visibles, styles cohérents | Réinitialisation via contrôles existants |

</frozen-after-approval>

## Code Map

- `pages/category.html` — shell archive catégorie ; breadcrumb sémantique ; layout `max-w-wide`
- `js/render.js` — `initCategoryPage()` + `renderCategoryProductCard()` : archive, recherche `?q=`, breadcrumb
- `js/search.js` — `filterProductsBySearchTerm()` pour la recherche header
- `styles/categories-page.css` — styles archive catégorie (breadcrumb, filtres, grille produits)
- `Tests/e2e/categories.spec.js` — tests E2E archive + recherche
- `Tests/unit/product-search.test.js` — tests unitaires recherche

## Tasks & Acceptance

**Execution:**
- [x] `pages/category.html` -- refactor shell (breadcrumb `<ol>`, layout wide, sections filtres/grille) -- alignement archive richard2026
- [x] `js/render.js` -- mettre à jour `initCategoryPage` / `renderCategoryProductCard` + mode recherche `?q=` -- markup cohérent
- [x] `js/search.js` -- extraire filtrage recherche produits -- réutilisable et testable
- [x] `styles/categories-page.css` -- styles archive uniquement -- retrait liste catégories
- [x] Retirer `pages/categories.html`, `initCategoriesPage()` et liens associés -- décision produit 2026-07-09
- [x] `Tests/e2e/categories.spec.js` + `Tests/unit/product-search.test.js` -- couverture enterprise

**Acceptance Criteria:**
- Given `/pages/category.html?q=matelas`, when des produits correspondent, then des cartes produit restylées s’affichent avec prix CHF formatés et filtres masqués
- Given `/pages/category.html?slug=matelas`, when la page charge, then un breadcrumb richard2026 (Accueil en vert promo, séparateur ›), un H1, et une grille produits responsive (4 colonnes ≥1024px) sont visibles
- Given une catégorie avec filtres, when l’utilisateur sélectionne une marque, then la grille se met à jour et les contrôles conservent le style richard2026
- Given `/pages/categories.html`, when on tente d’y accéder, then la page n’existe plus (404 build)

## Spec Change Log

| Date | Change |
|------|--------|
| 2026-07-09 | Retrait `pages/categories.html` — archive `category.html` + recherche `?q=` conservées ; Home couvre la navigation par univers |

## Design Notes

Réutiliser les classes existantes `.ucard` / `.univers__*` de `richard-design.css` pour la liste — structure richard2026 :

```html
<article class="ucard">
  <div class="ucard__media"><img …></div>
  <div class="ucard__body">
    <h3 class="ucard__title">Matelas</h3>
    <p class="ucard__text">…</p>
    <span class="ucard__link">Découvrir <span class="ucard__link-arrow">→</span></span>
  </div>
</article>
```

Archive catégorie : breadcrumb comme product page richard2026 (`breadcrumb` + `<strong>Accueil</strong>` vert promo) ; titre non centré ; conserver filtres mock (plus riches que production WP) mais les habiller avec tokens outline-subtle / surface.

## Verification

**Commands:**
- `npm run test:e2e -- Tests/e2e/categories.spec.js` -- expected: all tests pass
- `npm run build` -- expected: build succeeds without errors

**Manual checks:**
- Comparer `/pages/category.html?slug=matelas` avec richard2026.ddev.site (desktop + 375px mobile)

## Suggested Review Order

**Archive catégorie — breadcrumb, filtres, grille**

- Shell archive avec breadcrumb richard2026 et zones filtres/grille
  [`category.html:14`](../../pages/category.html#L14)

- Logique archive, recherche `?q=` et rendu cartes produit
  [`render.js:773`](../../js/render.js#L773)

- Filtrage texte recherche header
  [`search.js:14`](../../js/search.js#L14)

- Styles breadcrumb, toolbar filtres et grille 4 colonnes
  [`categories-page.css:5`](../../styles/categories-page.css#L5)

**Tests**

- Couverture E2E archive + recherche et reset filtres
  [`categories.spec.js:7`](../../Tests/e2e/categories.spec.js#L7)
