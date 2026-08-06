---
title: 'Redesign page À propos — contenu client richard2026'
type: 'feature'
created: '2026-07-06'
status: 'done'
baseline_commit: '12f275174e4cb3930d9cb5caae6fbc88cdba7d73'
context:
  - '{project-root}/_bmad-output/project-context.md'
  - '{project-root}/_bmad-output/planning-artifacts/prds/prd-richard-design-2026-07-03/addendum.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** `pages/about.html` est encore un placeholder générique (Poppins, cartes mock) sans le contenu client ni l’alignement visuel richard2026.

**Approach:** Refondre la page en sections statiques (10 blocs) reprenant les captures client : histoire, expertise magasin, services premium, avis Google (placeholder Trustindex), triptyque découverte et CTA contact. Référence visuelle = design system existant (tokens, SuisseIntl/Pryced Serif, `rd-page`).

## Boundaries & Constraints

**Always:**
- Conserver URL `/pages/about.html`, `data-page="about"`, header/footer partagés
- Utiliser `styles/tokens.css`, `styles/fonts.css`, patterns `rd-page` / `layout-wide`
- Contenu textuel Richard La Literie Crissier (pas de contenu franchise La Literie Idéale)
- Section avis = placeholder statique mimant Trustindex (`data-mock="trustindex"`) — pas de plugin en maquette
- Commentaires code en français ; identifiants en anglais
- Livrer tests E2E Playwright

**Ask First:**
- Remplacement des photos placeholder par assets client définitifs

**Never:**
- Implémenter blocs ACF WordPress ou shortcode Trustindex (scope richard2026)
- Modifier routing, `app.js`, ou données JSON catalogue
- Introduire dépendances npm

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| Page load | `/pages/about.html` | 10 sections visibles, typo richard2026 | N/A |
| Mobile | viewport 375px | grilles en colonne unique, texte lisible | N/A |
| CTA contact | clic *Nous contacter* | navigation vers `/pages/contact.html` | N/A |
| Reviews placeholder | section `.about-reviews` | 4 cartes mock + CTA Google | N/A |

</frozen-after-approval>

## Code Map

- [pages/about.html](../../pages/about.html) — markup des 10 sections éditoriales
- [styles/about-page.css](../../styles/about-page.css) — styles dédiés page À propos
- [styles/components.css](../../styles/components.css) — import richard-design (existant)
- [Tests/e2e/about.spec.js](../../Tests/e2e/about.spec.js) — validation sections et responsive

## Tasks & Acceptance

**Execution:**
- [x] `pages/about.html` -- refactor shell `rd-page about-page` + 10 sections contenu client -- remplacer placeholder
- [x] `styles/about-page.css` -- styles sections (founder, split, premium, reviews mock, discover, cta) -- alignement richard2026
- [x] `Tests/e2e/about.spec.js` -- E2E sections, liens CTA, grille avis -- couverture maquette

**Acceptance Criteria:**
- Given `/pages/about.html`, when la page charge, then le H1 *expert de la literie à Crissier depuis 1933*, les sections fondateur, splits, services premium, avis mock et triptyque sont visibles
- Given desktop 1280px, when on inspecte la typo, then la police n’est pas Poppins et les tokens richard2026 s’appliquent
- Given la section avis, when on lit le DOM, then `data-mock="trustindex"` est présent et 4 témoignages placeholder Richard Crissier s’affichent
- Given le bouton *Nous contacter*, when clic, then navigation vers `/pages/contact.html`

## Spec Change Log

- 2026-07-06 — Colonne gérant élargie, espacement bas section univers literie page À propos.

## Verification

**Commands:**
- `npx playwright test Tests/e2e/about.spec.js` -- expected: all tests pass
