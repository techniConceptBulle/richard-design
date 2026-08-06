---
title: 'Accueil — padding univers literie et images hero'
type: 'feature'
created: '2026-07-06'
status: 'done'
route: 'one-shot'
---

## Intent

**Problem:** Sur la page d'accueil, la section « Nos univers literie » avait un padding vertical réduit (28px/22px) par rapport à la section « histoire » précédente (80px desktop). Les visuels du hero utilisaient d'anciennes photos stock.

**Approach:** Aligner `.univers__inner` sur le même `padding-block` que `.history__inner` (tokens `--home-section-padding-y`), en conservant les règles spécifiques pour `categories-page`. Remplacer les deux images du slider hero par les visuels client fournis. Recadrer chaque slide via `object-position` (slide chambre : `42% 30%`, slide matelas : `center 26%`).

## Suggested Review Order

1. [index.html](../../index.html) — chemins des images hero
2. [richard-design.css](../../styles/richard-design.css) — padding vertical univers (accueil)
3. [assets/home/hero-slide-bedroom.png](../../assets/home/hero-slide-bedroom.png) — visuel slide 1
4. [assets/home/hero-slide-wall.png](../../assets/home/hero-slide-wall.png) — visuel slide 2
5. [Tests/e2e/home.spec.js](../../Tests/e2e/home.spec.js) — assertions padding et hero

## Code Map

- `index.html` — src des images hero slider
- `styles/richard-design.css` — padding-block uniforme history / univers / brands sur `.rd-page`
- `assets/home/hero-slide-bedroom.png` — nouvelle image slide 1
- `assets/home/hero-slide-wall.png` — nouvelle image slide 2
- `Tests/e2e/home.spec.js` — padding univers + liste sections uniformes

## Tasks & Acceptance

**Execution:**
- [x] `styles/richard-design.css` — univers accueil dans le bloc padding-block commun
- [x] `index.html` — hero images PNG client
- [x] `assets/home/` — copie des deux visuels attachés
- [x] `Tests/e2e/home.spec.js` — padding 80px desktop + univers dans test uniformité

**Acceptance Criteria:**
- Given desktop 1280px sur `/`, when on compare padding vertical de `.history__inner` et `.univers__inner`, then top et bottom sont identiques (5rem)
- Given la page d'accueil, when le hero slide 1 est visible, then l'image `hero-slide-bedroom.png` s'affiche
- Given le hero slide 2, when on clique sur la puce 2, then `hero-slide-wall.png` s'affiche

## Verification

**Commands:**
- `npm run test:e2e -- Tests/e2e/home.spec.js` — 13/14 pass (échec promo couleur préexistant, hors scope)

**Manual checks:**
- Vérifier visuellement le padding entre histoire et univers literie sur desktop et mobile
- Vérifier qualité et cadrage des deux nouvelles images hero
