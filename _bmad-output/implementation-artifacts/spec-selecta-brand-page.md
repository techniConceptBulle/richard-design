---
title: 'Page marque Selecta — layout maquette blocs'
type: 'feature'
created: '2026-08-18'
status: 'done'
baseline_commit: 'fb56c866b978dca6bc20e1db9b9c4648bcfc938e'
context:
  - '{project-root}/_bmad-output/project-context.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** `/marque/selecta.html` utilise encore le gabarit générique (logo, chapô, sections texte, galerie), alors que la maquette client décrit une page blocs (hero, splits, pictos, sélection produits, CTA).

**Approach:** Réserver ce layout à Selecta uniquement. Contenu = textes Word + visuels `assets/marques/`. Grille produits = vrais items catalogue (exemples Selecta/Röwa à ajouter). Bouton « Voir tous les produits » visible, sans URL.

## Boundaries & Constraints

**Always:**
- Garder l'URL `/marque/selecta.html`, le shell `pages/brand.html`, `data-page="brand"`, header/footer partagés
- Roviva, Swissflex, Röwa et les autres marques restent sur le gabarit actuel (logo, headline, sections, galerie, lightbox)
- Tokens `styles/tokens.css` : titres `var(--font-family-display)`, corps `var(--font-family-base)`, surfaces beige/blanc, CTA bleu `--color-primary` / `--rd-blue`
- Textes Selecta alignés sur `assets/marques/Textes_Page_Marque_Rowa_Selecta.docx` (version courte maquette)
- Pictos et photos depuis `assets/marques/` (ne pas inventer d'images)
- Produits d'exemple : `brandId` `selecta` et/ou `rowa` ; la grille Selecta affiche les deux
- Cartes produit : lien vers `/produit/{slug}.html` ; bouton « Voir tous… » = `<button type="button">` sans `href` ni navigation
- CTA « Prendre rendez-vous » vers `/pages/contact.html` (pattern home / expert)
- Commentaires en français ; identifiants en anglais
- Tests unitaires (helpers + cas limites) et E2E Playwright dans la même livraison
- Ne pas lancer de compilation JS/CSS (pas de `npm run build` / Gulp)

**Ask First:**
- Appliquer le même layout à `/marque/rowa.html`
- Brancher une URL sur « Voir tous les produits »

**Never:**
- Nouvelle page routable ou changement d'URL marque
- Refondre la liste `/pages/brands.html` ou le carrousel home
- Réutiliser `.category-product-card` tel quel (la maquette est plus simple : image, nom, accroche, prix, « Découvrir »)
- Dépendances npm, lightbox galerie sur Selecta (la galerie générique reste pour les autres marques)
- Liens sur le bouton « Voir tous les produits »

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| Selecta load | `/marque/selecta.html` | Hero logo, splits manufacture / artisans / expertise / sommier, pictos, grille produits, encart Richard, barre CTA | N/A |
| Other brand | `/marque/roviva.html` | Gabarit générique inchangé (headline + galerie + lightbox) | N/A |
| Product cards | 4 exemples catalogue `selecta`/`rowa` | Jusqu'à 4 cartes ; clic « Découvrir » -> fiche produit | Si 0 produit : masquer la section sélection |
| Voir tous | clic bouton | Aucune navigation, aucun `href` | N/A |
| RDV CTA | clic « Prendre rendez-vous » | `/pages/contact.html` | N/A |
| Missing slug | `/pages/brand.html` sans slug | Pas de rendu détail (comportement actuel) | N/A |

</frozen-after-approval>

## Code Map

- [pages/brand.html](../../pages/brand.html) — shell détail marque ; ajouter la feuille Selecta
- [js/render.js](../../js/render.js) — `initBrandPage()` branche Selecta vs gabarit générique
- [js/brands-page.js](../../js/brands-page.js) — builders HTML génériques existants ; étendre ou extraire le layout Selecta
- [js/data.js](../../js/data.js) — `getBrandBySlug`, `getProducts` (filtre `brandId`)
- [data/brands.json](../../data/brands.json) — entrée `selecta` (contenu blocs)
- [data/products.json](../../data/products.json) — 4 produits d'exemple Selecta/Röwa
- [assets/marques/](../../assets/marques/) — logos, photos, pictos, Word
- [styles/components.css](../../styles/components.css) — `.brand-detail` générique à ne pas casser
- [Tests/e2e/brands.spec.js](../../Tests/e2e/brands.spec.js) — assertions Selecta actuelles (headline partagé) à adapter
- [Tests/unit/brands-page.test.js](../../Tests/unit/brands-page.test.js) — helpers marques

## Tasks & Acceptance

**Execution:**
- [x] `data/products.json` -- ajouter 4 produits d'exemple (`selecta` + `rowa`, copiés/adaptés d'entrées existantes) -- peupler la grille
- [x] `data/brands.json` -- structurer le contenu Selecta (hero, splits, pictos, CTA) selon le Word/maquette -- source unique du layout
- [x] `js/brands-page.js` -- helpers layout Selecta + filtre produits `selecta`/`rowa` + bouton sans lien -- garder le gabarit générique intact
- [x] `js/render.js` -- `initBrandPage` rend le layout Selecta si `slug === "selecta"` -- pas d'impact Roviva/Röwa
- [x] `pages/brand.html` -- lier `styles/brand-selecta.css` -- styles isolés
- [x] `styles/brand-selecta.css` -- sections maquette (hero, splits 2 col, pictos, cartes, barre CTA) -- tokens existants
- [x] `Tests/unit/brands-page.test.js` -- filtre produits, bouton sans href, HTML Selecta vs générique -- I/O matrix
- [x] `Tests/e2e/brands.spec.js` -- blocs Selecta + régression Roviva ; retirer l'assertion « headline partagé Selecta/Röwa » -- couverture UI

**Acceptance Criteria:**
- Given `/marque/selecta.html`, when la page charge, then les blocs hero, manufacture, artisans, expertise Selecta, sommier, sélection, encart Richard et CTA rendez-vous sont visibles
- Given `/marque/roviva.html`, when la page charge, then headline, galerie et lightbox restent identiques au comportement actuel
- Given la grille Selecta, when des produits `selecta`/`rowa` existent, then jusqu'à 4 cartes s'affichent avec prix CHF et lien produit
- Given le bouton « Voir tous les produits Röwa & Selecta by Röwa », when clic, then l'URL ne change pas
- Given le bouton « Prendre rendez-vous », when clic, then navigation vers `/pages/contact.html`
- Given viewport 375px, when on parcourt Selecta, then les splits passent en une colonne et restent lisibles

## Spec Change Log

- 2026-08-18 — Fonds de bande (hero, sections, CTA) en `100vw` ; contenu dans `.selecta-section__inner` à 62rem. Texte du CTA final en blanc (`#fff`).
- 2026-08-18 — Image hero dans le container ; largeur des inners = `--layout-max-width` (accueil). CTA collé au footer, bordure identique au séparateur copyright (`rgba(255, 255, 255, 0.2)`).
- 2026-08-18 — Hero fond blanc ; pastille logo `.selecta-hero__badge` à `top: 85%` ; pictos `.selecta-feature` centrés.
- 2026-08-18 — Hero : fond transparent (celui de `.page`), hauteur réduite (`max-height: 22rem`, ratio 2.4/1). Bouton CTA final : texte blanc, fond `#27745d`.
- 2026-08-18 — Hero rétabli au format 16/9 (sans `max-height`), image toujours dans le container.
- 2026-08-18 — Hero : fond `#fff`, `padding-bottom: var(--space-8)`, image en ratio `2 / 1` (plus basse que 16/9).
- 2026-08-18 — Padding bas du hero aligné sur celui de la section suivante (`--home-section-padding-y` / `-lg`).
- 2026-08-18 — Ombre bas sur la section sommier (`.selecta-section--sommier`).
- 2026-08-18 — Padding sommier resserre (`--space-6` / `--space-8`) et photo recadree (`object-fit: cover`) pour compenser le blanc studio.
- 2026-08-18 — Hero : image entiere (`object-fit: contain`), hauteur plafonnee a `26rem`.
- 2026-08-18 — Hero : image en pleine largeur (`width: 100%`) et visible en entier (`object-fit: contain`, sans `max-height`).
- 2026-08-18 — Hero : photo `selecta.png` (logo deja dans l'image, pastille HTML desactivee).
- 2026-08-18 — Sommier Röwa : `sommier-rowa-radio-m4memory.jpg`. Selecta by Röwa : `matelas-rowa-3.jpg`. Section « Pourquoi… » : colonnes `auto / 1fr / 1.35fr` pour répartir l'espace icône-titre.

## Design Notes

Ordre des blocs (maquette PDF Selecta) :

1. Hero (photo lit) + pastille logo Selecta, dans le shell `layout-wide`
2. Manufacture du sommeil : photo bois + texte + 4 pictos
3. Femmes et hommes : 2 photos carrées + texte
4. Selecta by Röwa : texte + 4 pictos | photo assemblage
5. Sommier Röwa : photo sommier + texte
6. Découvrez notre sélection Röwa : 4 cartes + bouton mort
7. Pourquoi Richard… : pictogramme personnes + texte
8. Barre CTA bleu + bouton beige

Cartes produit (exemple d'accroche, pas le markup catégorie) :

```html
<article class="selecta-product-card">
  <a href="/produit/selecta-s5.html">
    <img …>
    <h3>Selecta S5</h3>
    <p>Le confort naturellement équilibré</p>
    <p>en CHF 1'760.-</p>
    <span>Découvrir</span>
  </a>
</article>
<button type="button" class="selecta-products__all">Voir tous les produits Röwa & Selecta by Röwa</button>
```

Prix via `formatPriceCHF()`. Pictos : `arbre.png`, `feuille.png`, `assemblage.png`, `panneau-de-localisation.png`, `mousse-soja.png`, `ergonomie.png`, `confort.png`, `lit-double.png`, `personnes.png`.

## Verification

**Commands:**
- `npm run test:unit` -- expected: tous les tests unitaires passent
- `npx playwright test Tests/e2e/brands.spec.js` -- expected: Selecta + régression autres marques OK

**Manual checks (if no CLI):**
- `/marque/selecta.html` vs PDF : rythme beige/blanc, serif titres, pas de Poppins
- `/marque/rowa.html` inchangée

## Suggested Review Order

**Entry point**

- Branche Selecta vs gabarit générique, sans toucher Roviva/Röwa
  [`render.js:1308`](../../js/render.js#L1308)

**Layout blocs**

- HTML des 8 sections maquette (hero, splits, produits, CTA)
  [`brands-page.js:352`](../../js/brands-page.js#L352)

- Détection layout : slug `selecta` + contenu `selectaPage`
  [`brands-page.js:185`](../../js/brands-page.js#L185)

- Grille catalogue `selecta`/`rowa`, bouton « Voir tous » sans URL
  [`brands-page.js:328`](../../js/brands-page.js#L328)

**Données**

- Blocs éditoriaux et pictos depuis `assets/marques/`
  [`brands.json:88`](../../data/brands.json#L88)

- Quatre produits d'exemple pour peupler la grille
  [`products.json:850`](../../data/products.json#L850)

**UI**

- Hero, splits, pictos, cartes et barre rendez-vous
  [`brand-selecta.css:75`](../../styles/brand-selecta.css#L75)

- Feuille isolée branchée sur le shell marque existant
  [`brand.html:13`](../../pages/brand.html#L13)

**Tests**

- E2E Selecta + régression Röwa/Roviva
  [`brands.spec.js:47`](../../Tests/e2e/brands.spec.js#L47)

- Helpers (filtre, bouton mort, images vides)
  [`brands-page.test.js:154`](../../Tests/unit/brands-page.test.js#L154)

