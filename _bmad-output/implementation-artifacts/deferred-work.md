# Deferred Work

## From spec-migrate-bitbucket (2026-08-06)

- **GitHub remote drift:** Local/`origin` (Bitbucket) includes commit `067cce5` (BMAD artefacts + `.gitignore` `test-results/`). Human declined `git push github main`, so `github` remote remains one commit behind. Revisit when GitHub should be synced or archived as non-canonical.
- **Broader test artefact ignores:** Reviewers noted only `test-results/` was added; other common outputs (`playwright-report/`, `coverage/`, etc.) were not in scope of this migration.

## From spec-selecta-brand-page (2026-08-18)

- **Test services-premium preexistant:** `Tests/unit/services-premium.test.js` attend `margin: 0 0 var(--space-8)` sur `.about-page .about-univers .univers__header` alors que `styles/about-page.css` a `--space-5`. Hors scope de la page Selecta.


- **E2E nav-active:** No Playwright assertion that Matelas nav is `menu-link--active` on `/categorie/matelas` (logic present in `renderSharedLayout`).
- ~~**Production host rewrite:**~~ Done in `render.yaml` (`/categorie` + `/categorie/*` -> `/pages/category.html`).

## From spec-nav-home-magasin-tweaks (2026-08-18)

- **CSS mort `.appointment`:** Les règles `.rd-page .appointment*` / `.store-card*` restent dans [richard-design.css](../../styles/richard-design.css) après remplacement du bloc accueil par `.product-advice`. Nettoyage hors scope de cette passe.
