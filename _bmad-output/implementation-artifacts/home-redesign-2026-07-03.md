---
title: Redesign Home — alignement richard2026
status: done
created: 2026-07-03
prd: prd-richard-design-2026-07-03
---

# Implémentation — Home redesign

## Livré

- Tokens CSS alignés sur `richard2026/theme.js` (`styles/tokens.css`)
- Polices SuisseIntl embarquées (`styles/fonts.css`, `assets/fonts/SuisseIntl/`)
- Assets déplacés vers `assets/home/` (hors dossier `homepage/`)
- Chemins mis à jour dans `index.html` et `js/render.js`
- Responsive mobile renforcé (`styles/richard-design.css` — 1080px + 480px)
- Tests E2E Playwright (`Tests/e2e/home.spec.js`)

## Prochaine page suggérée

Fiche produit (`pages/product.html`) — référence `richard2026` imports/fiche-produit.html
