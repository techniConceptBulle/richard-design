# Deferred Work

## From spec-migrate-bitbucket (2026-08-06)

- **GitHub remote drift:** Local/`origin` (Bitbucket) includes commit `067cce5` (BMAD artefacts + `.gitignore` `test-results/`). Human declined `git push github main`, so `github` remote remains one commit behind. Revisit when GitHub should be synced or archived as non-canonical.
- **Broader test artefact ignores:** Reviewers noted only `test-results/` was added; other common outputs (`playwright-report/`, `coverage/`, etc.) were not in scope of this migration.

## From spec-category-pretty-urls (2026-08-17)

- **E2E nav-active:** No Playwright assertion that Matelas nav is `menu-link--active` on `/categorie/matelas` (logic present in `renderSharedLayout`).
- ~~**Production host rewrite:**~~ Done in `render.yaml` (`/categorie` + `/categorie/*` -> `/pages/category.html`).
