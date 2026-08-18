---
title: 'Bandeau nav plus epais, conseil accueil, copy magasin'
type: 'feature'
created: '2026-08-18'
status: 'done'
baseline_commit: '4173933a765a109ae4f21404ca3e5cbebe48766a'
context:
  - '{project-root}/_bmad-output/project-context.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** Le bandeau bleu du menu est trop bas. Trois textes/blocs client sont faux : titre magasin « essayer », labels categories en minuscules, et la derniere section d'accueil (RDV + photo magasin) doit ceder la place au bloc « Besoin d'un conseil ? » des fiches produit.

**Approach:** Augmenter visiblement la hauteur du bandeau `.nav-primary` d'environ 16px au total (~8px par cote). Remplacer `section.appointment` de l'accueil par le markup du bloc produit `.product-advice`. Sur Magasin a Crissier, remplacer « essayer » par « acheter » et capitaliser la premiere lettre des 5 labels categories.

## Boundaries & Constraints

**Always:**
- Hauteur nette du bandeau bleu plus grande sur mobile et desktop (le padding `__inner` seul ne suffit pas : `margin-block` negatif des `li` desktop l'annule). Aligner `margin-block` sur le nouveau padding Y. Recaler `--envelope-height-mobile` et `--envelope-height-desktop` d'autant (repli avant mesure JS).
- Accueil : HTML statique du bloc conseil (titre, lead, 3 cartes, CTA Contactez-nous). Styles `.product-advice` applicables hors `.single-product-page`. Fiche produit inchangee visuellement.
- Magasin : titre `Pourquoi acheter son matelas en magasin ?`. Labels et aria-labels slides : Lits, Matelas, Sommier, Duvet, Oreiller. Retirer `text-transform: lowercase` sur `.store-products-slider__label`.
- Commentaires de code en francais. Ne pas compiler JS/CSS.

**Ask First:**
- Modifier la structure ou le contenu du bloc conseil sur la fiche produit (pas seulement le rendre reutilisable).
- Remettre photo magasin / carte / CTA « Prendre rendez-vous » en plus du bloc conseil.

**Never:**
- Appeler `renderProductAdviceSection()` depuis la home (fonction privee, home statique).
- Toucher les bandeaux `about-contact-cta` des autres pages.
- Changer les href categories, le titre « Des produits séléctionnés avec soin », ou pluraliser Sommier / Duvet / Oreiller.
- Toucher `--header-height-*` ou `--topbar-height` (logo / topbar, pas la nav).

</frozen-after-approval>

## Code Map

- `styles/richard-design.css` -- padding `.nav-primary__inner` (0.55rem Y, 3 breakpoints), `margin-block: -0.55rem` desktop, padding `.menu-link` desktop 0.65rem Y
- `styles/tokens.css` -- `--envelope-height-mobile: 14.75rem`, `--envelope-height-desktop: 11.25rem`
- `js/envelope-offset.js` -- mesure live, pas a modifier
- `index.html` -- `section.appointment` a remplacer
- `styles/product-page.css` -- `.product-advice` scoped `.single-product-page`
- `js/render.js` -- `renderProductAdviceSection()` source markup, ne pas brancher sur home
- `pages/magasin-crissier.html` -- titre essayer + 5 labels minuscules
- `styles/about-page.css` -- `text-transform: lowercase` sur les labels slider
- `Tests/unit/home-layout-density.test.js` -- regex padding 0.55rem + describe store card
- `Tests/e2e/home.spec.js` -- floor nav + section appointment
- `Tests/unit/magasin-crissier.test.js` -- labels minuscules
- `Tests/e2e/magasin-crissier.spec.js` -- « essayer » + labels minuscules

## Tasks & Acceptance

**Execution:**
- [x] `styles/richard-design.css` -- padding Y nav ~1.05rem partout ; `margin-block` aligne ; padding Y `.menu-link` desktop augmente pour une hauteur nette plus grande
- [x] `styles/tokens.css` -- bump envelope-height d'autant que la barre
- [x] `index.html` -- remplacer `.appointment` par le HTML `.product-advice` (meme contenu que la fiche produit)
- [x] `styles/product-page.css` -- styles `.product-advice` actifs sur `.rd-page` (home + produit)
- [x] `pages/magasin-crissier.html` -- titre acheter ; labels et aria-labels capitalises
- [x] `styles/about-page.css` -- supprimer lowercase sur les labels slider
- [x] `Tests/unit/home-layout-density.test.js` -- regex padding nav ; remplacer assertions store-card par le bloc conseil
- [x] `Tests/e2e/home.spec.js` -- hauteur nav plus stricte ; section conseil a la place d'appointment
- [x] `Tests/unit/magasin-crissier.test.js` -- labels capitalises
- [x] `Tests/e2e/magasin-crissier.spec.js` -- titre acheter + labels capitalises

**Acceptance Criteria:**
- Given desktop 1280px, when on mesure `.nav-primary`, then la hauteur est superieure a l'actuelle (~40px+) d'environ 16px, et l'item actif reste pleine hauteur (vert, sans bandes bleues).
- Given `/`, when la page est chargee, then la derniere section de `main` est `.product-advice` avec « Besoin d'un conseil ? » et le CTA Contactez-nous ; `.appointment` est absent.
- Given une fiche produit, when on affiche le bloc conseil, then titre, cartes et CTA restent identiques.
- Given Magasin a Crissier, when on lit le titre essai magasin, then le texte est « Pourquoi acheter son matelas en magasin ? ».
- Given le slider produits du magasin, when on lit les 5 labels, then ils s'affichent Lits, Matelas, Sommier, Duvet, Oreiller (pas forces en minuscules par le CSS).

## Design Notes

Desktop : `margin-block: -0.55rem` sur `.nav-primary .menu-inner li` etire le fond actif dans le padding. Si on monte le padding `__inner` sans le meme negatif, des bandes bleues apparaissent. Si on monte les deux sans augmenter le padding des `.menu-link`, la hauteur desktop ne bouge pas.

Home : coller le HTML de `renderProductAdviceSection()` en statique. Elargir les selecteurs CSS (ex. `.rd-page .product-advice`) sans changer le layout produit.

## Verification

**Commands:**
- `npm run test:unit -- Tests/unit/home-layout-density.test.js Tests/unit/magasin-crissier.test.js` -- expected: pass
- `npm run test:e2e -- Tests/e2e/home.spec.js Tests/e2e/magasin-crissier.spec.js Tests/e2e/product.spec.js` -- expected: pass (bloc conseil home + produit inchange)

**Manual checks:**
- Desktop et mobile : bandeau bleu visiblement plus epais, item actif pleine hauteur, pas de saut hero (envelope).
- Accueil : plus de photo storefront ni CTA « Prendre rendez-vous » ; bloc conseil aligne sur la fiche produit.

## Suggested Review Order

**Bandeau nav**

- Padding vertical 1.05rem sur le bandeau bleu, tous breakpoints.
  [`richard-design.css:310`](../../styles/richard-design.css#L310)

- Negatif aligne pour garder l'item actif pleine hauteur.
  [`richard-design.css:511`](../../styles/richard-design.css#L511)

- Padding des liens desktop 1.15rem pour une hauteur nette plus grande.
  [`richard-design.css:524`](../../styles/richard-design.css#L524)

- Repli envelope avant mesure JS, +1rem.
  [`tokens.css:118`](../../styles/tokens.css#L118)

**Accueil - bloc conseil**

- Section appointment remplacee par le markup fiche produit, contenu dans layout-wide.
  [`index.html:181`](../../index.html#L181)

- Styles `.product-advice` partages home et fiche via `.rd-page`.
  [`product-page.css:616`](../../styles/product-page.css#L616)

**Magasin Crissier**

- Titre « essayer » remplace par « acheter ».
  [`magasin-crissier.html:42`](../../pages/magasin-crissier.html#L42)

- Labels slider capitalises (Lits, Matelas, Sommier, Duvet, Oreiller).
  [`magasin-crissier.html:229`](../../pages/magasin-crissier.html#L229)

- `text-transform: lowercase` retire, sinon l'affichage restait minuscule.
  [`about-page.css:1242`](../../styles/about-page.css#L1242)

**Tests**

- Regex padding nav et assertions bloc conseil accueil.
  [`home-layout-density.test.js:29`](../../Tests/unit/home-layout-density.test.js#L29)

- E2E hauteur nav et derniere section `.product-advice`.
  [`home.spec.js:116`](../../Tests/e2e/home.spec.js#L116)

- Titre acheter, labels capitalises, pas de lowercase CSS.
  [`magasin-crissier.spec.js:29`](../../Tests/e2e/magasin-crissier.spec.js#L29)

