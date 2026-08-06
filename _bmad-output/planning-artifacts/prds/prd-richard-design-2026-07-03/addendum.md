# Addendum — Références techniques et design

_Document complémentaire au PRD `prd.md`. Détails d'implémentation et sources de vérité visuelle — non dupliqués dans le corps du PRD._

---

## 1. Projet source design : richard2026

| Élément | Chemin |
|---------|--------|
| Racine projet | `/Volumes/www/richard2026` |
| Design tokens (couleurs, typo, spacing) | `web/app/themes/techniconcept/theme.js` |
| Tokens SCSS globaux | `web/app/themes/techniconcept/assets/styles/scss/base/_tokens.scss` |
| Tokens WooCommerce | `web/app/themes/techniconcept/assets/styles/scss/modules/woocommerce/_tokens.scss` |
| PRD production (WooCommerce) | `_bmad-output/planning-artifacts/prds/prd-richard2026-2026-06-15/prd.md` |
| Maquettes HTML validées | `_bmad-output/planning-artifacts/ux-designs/ux-richard2026-2026-06-15/imports/` |
| Analyse projet | `docs/project-analysis-richard2026.txt` |

---

## 2. Palette Richard La Literie (theme.js)

| Token | Valeur | Usage |
|-------|--------|-------|
| `primary` | `#004F71` | Actions, liens forts |
| `primary-dark` | `#002B4D` | Topbar, titres foncés |
| `secondary` | `#007D91` | Accents secondaires |
| `accent` | `#91D6AC` | Highlights doux |
| `accent-strong` / `promo` | `#287D63` | Promotions, badges |
| `surface` | `#FBF6ED` | Fonds chauds |
| `surface-alt` | `#F5EFE6` | Bandeaux beige |
| `on-surface` | `#082B4E` | Texte principal |
| `on-surface-muted` | `#6B7378` | Texte secondaire |
| `outline` | `#EADFCE` | Bordures |

Pantone de référence (charte client) : 3025 M, 3145 M, 345 M, 7485 M — voir PRD richard2026 `addendum.md`.

---

## 3. Typographie

| Rôle | Famille | Tailles (desktop) |
|------|---------|-------------------|
| Display / titres | Pryced Serif → SuisseIntl fallback | `display-lg` 36px, `display-md` 27px |
| Sections | idem | `headline-sm` 20px |
| Corps | SuisseIntl | `body-md` 16px, `body-sm` 14px |
| Meta / caps | SuisseIntl | `label-caps` 11px, `caption` 12px |

**Décision OQ-02 :** Pryced Serif **embarquée** dans la maquette (`@font-face` dans `styles/`). SuisseIntl pour le corps. Source fonts : à récupérer depuis richard2026 (`assets/fonts/SuisseIntl/`) ou livrables charte client.

---

## 4. Mapping pages richard-design → référence richard2026

| Page richard-design | `data-page` | Référence visuelle richard2026 |
|---------------------|-------------|--------------------------------|
| `index.html` | home | `imports/homepage.html`, blocs Home PRD §4.1 |
| `pages/product.html` | product | `imports/fiche-produit.html`, `single-product.php` styles |
| `pages/category.html` | category | Archives catégorie Woo + filtres existants |
| `pages/categories.html` | categories | Liste / recherche |
| `pages/brands.html` | brands | Grille marques |
| `pages/brand.html` | brand | Page marque |
| `pages/cart.html` | cart | `[ASSUMPTION]` pas de template cart stylé en richard2026 — extrapoler depuis fiche produit |
| `pages/checkout.html` | checkout | `[ASSUMPTION]` mock Payrexx — extrapoler enveloppe + formulaires |
| `pages/about.html` | about | Page composable À propos |
| `pages/advice.html` | advice | Liste blog Conseils |
| `pages/contact.html` | contact | Bloc contact fiche produit / Home |
| `pages/account.html` | account | `[ASSUMPTION]` icône présente mais compte hors scope v1 production — page placeholder cohérente |
| `pages/privacy.html` | privacy | `template-legal.php` |
| `pages/terms.html` | terms | `template-legal.php` |

**Règle structurelle :** conserver URLs, `data-page`, points d'entrée JS (`app.js` switch) et conteneurs HTML (`#site-header`, `#product-page`, etc.). Seuls CSS, markup interne et assets visuels sont refondus.

**Décision OQ-03 :** les dossiers `homepage/` et `product/` à la racine de richard-design appartiennent au **projet richard2026** — ignorer pour ce redesign.

**Décision OQ-04 :** validation client via **URL staging** (build `dist/` déployé). Revue desktop + mobile requise.

---

## 5. Ce qui reste mock / hors scope maquette

- Données JSON statiques (`data/*.json`) — pas d'import WooCommerce
- Panier `localStorage` — pas de session serveur
- Checkout — redirection demo, Payrexx non branché
- Compte client — pas d'authentification
- Multilingue — français uniquement
- SEO / analytics / RGPD — hors périmètre maquette

---

## 6. Livrable aval (post-validation)

Une fois le client valide la maquette `richard-design`, l'implémentation production se fait dans **richard2026** (WordPress Bedrock + WooCommerce + thème techniconcept), guidée par le PRD richard2026 existant — pas par duplication de ce PRD maquette.
