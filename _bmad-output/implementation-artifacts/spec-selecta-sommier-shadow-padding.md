---
title: 'Selecta — ombre sommier discrete et paddings verticaux egaux'
type: 'feature'
created: '2026-08-18'
status: 'done'
baseline_commit: 'fb56c866b978dca6bc20e1db9b9c4648bcfc938e'
context:
  - '{project-root}/_bmad-output/project-context.md'
  - '{project-root}/_bmad-output/implementation-artifacts/spec-selecta-brand-page.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** L'ombre de la section « Le sommier Röwa » est trop marquee et n'apparait qu'en bas. Les paddings verticaux de `/marque/selecta.html` ne sont pas partout symetriques (hero bas-only, CTA `space-8`, produits heritent aussi de `.category-archive-page`).

**Approach:** Remplacer l'ombre sommier par une ombre discrete **haut et bas**. Aligner padding-top et padding-bottom de chaque bande de contenu Selecta sur le meme token que les sections (hero : padding-top 0 conserve, padding-bottom deja aligne).

## Boundaries & Constraints

**Always:**
- Scope: page Selecta uniquement (`.page--selecta-brand` / `.selecta-section--sommier`)
- Ombre beaucoup plus discrete que `0 12px 24px -8px rgba(8, 43, 78, 0.14)` : blur plus petit, opacite plus basse, present en haut **et** en bas
- Chaque bande `.selecta-section` et `.selecta-cta` : `padding-top` = `padding-bottom` (`--home-section-padding-y` / `-lg` a 1024px)
- Hero : pas de padding-top (image colle) ; padding-bottom reste `--home-section-padding-y` / `-lg`
- Commentaires FR ; identifiants EN ; tests unitaires + E2E dans la meme livraison
- Ne pas compiler JS/CSS (pas de Gulp / `npm run build` hors Playwright)

**Ask First:**
- Changer l'ombre ou les paddings des autres pages marque (Roviva, Röwa, Swissflex)

**Never:**
- Nouvelle page / URL
- Ombre sur d'autres sections Selecta
- Egaliser le padding-top du hero avec le bas (casserait le flush image)

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| Sommier shadow | `/marque/selecta.html` | `.selecta-section--sommier` a deux ombres (haut + bas), plus legeres que l'ombre actuelle | N/A |
| Section padding | viewport 375 et 1280 | `.selecta-section` computed `padding-top` = `padding-bottom` | N/A |
| CTA padding | `.selecta-cta__inner` | `padding-top` = `padding-bottom`, meme token que les sections | N/A |
| Products extra | section produits a aussi `.category-archive-page` | n'ajoute pas un second padding-block different | N/A |
| Other brands | `/marque/roviva.html` | pas de `.selecta-section--sommier`, paddings fiche generique inchanges | N/A |

</frozen-after-approval>

## Code Map

- [../../styles/brand-selecta.css](../../styles/brand-selecta.css) -- `.selecta-section--sommier` box-shadow ; paddings hero / section / CTA ; override produits
- [../../js/brands-page.js](../../js/brands-page.js) -- classe `selecta-section--sommier` deja posee (pas de changement HTML)
- [../../Tests/unit/selecta-brand-layout.test.js](../../Tests/unit/selecta-brand-layout.test.js) -- assertions CSS ombre + padding-block
- [../../Tests/e2e/brands.spec.js](../../Tests/e2e/brands.spec.js) -- ombre dual ; padding-top = padding-bottom sur sections et CTA

## Tasks & Acceptance

**Execution:**
- [x] [../../styles/brand-selecta.css](../../styles/brand-selecta.css) -- ombre dual discrete + unifier `padding-block` sections/CTA ; neutraliser `.category-archive-page` sur `--products` -- source unique du visuel
- [x] [../../Tests/unit/selecta-brand-layout.test.js](../../Tests/unit/selecta-brand-layout.test.js) -- I/O matrix (ombre haut/bas, tokens padding) -- cas nominal + limite
- [x] [../../Tests/e2e/brands.spec.js](../../Tests/e2e/brands.spec.js) -- padding-top === padding-bottom ; Roviva inchange -- couverture UI

**Acceptance Criteria:**
- Given `/marque/selecta.html`, when la page charge, then la section sommier a une ombre discrete visible en haut et en bas
- Given une `.selecta-section` (hors hero), when on lit les styles computed, then padding-top egale padding-bottom
- Given `.selecta-cta__inner`, when on lit les styles computed, then padding-top egale padding-bottom et correspond au padding des sections
- Given `/marque/roviva.html`, when la page charge, then le gabarit generique n'a pas `.selecta-section--sommier`

## Spec Change Log

## Design Notes

Ombre actuelle trop lourde (offset 12px, blur 24px, alpha 0.14, bas seulement). Cible : deux ombres miroir, alpha ~0.05, blur ~10px, offset ~4px. `z-index: 1` conserve pour passer au-dessus des bandes voisines.

Hero volontairement `padding-top: 0`. CTA aujourd'hui `padding-block: var(--space-8)` (2rem) vs sections `3rem` / `5rem` : a unifier.

`.selecta-section--products` porte aussi `category-archive-page` (`padding-block: var(--space-5)`). Forcer le padding Selecta pour eviter un desequilibre.

## Verification

**Commands:**
- `npm run test:unit -- Tests/unit/selecta-brand-layout.test.js Tests/unit/brands-page.test.js` -- expected: pass
- `CI=1 npx playwright test Tests/e2e/brands.spec.js` -- expected: pass (Playwright peut builder ; ne pas lancer Gulp a part)

**Manual checks (if no CLI):**
- `/marque/selecta.html` : ombre sommier tres legere haut+bas ; rythme vertical homogene entre bandes

## Suggested Review Order

**Ombre sommier**

- Ombre miroir discrete haut et bas, plus legere que l'ancienne.
  [`brand-selecta.css:199`](../../styles/brand-selecta.css#L199)

**Paddings verticaux**

- CTA aligne sur le padding des sections (`--home-section-padding-y`).
  [`brand-selecta.css:364`](../../styles/brand-selecta.css#L364)

- Produits : meme padding-block, pour gagner sur `.category-archive-page`.
  [`brand-selecta.css:270`](../../styles/brand-selecta.css#L270)

- Desktop : CTA et produits passent au token `-lg`.
  [`brand-selecta.css:379`](../../styles/brand-selecta.css#L379)

**Tests**

- CSS source : deux couches d'ombre et tokens padding.
  [`selecta-brand-layout.test.js:75`](../../Tests/unit/selecta-brand-layout.test.js#L75)

- E2E : ombre dual, paddings egaux, Roviva sans sommier.
  [`brands.spec.js:66`](../../Tests/e2e/brands.spec.js#L66)

