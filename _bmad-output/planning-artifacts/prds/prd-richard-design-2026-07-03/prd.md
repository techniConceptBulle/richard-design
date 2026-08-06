---
title: Richard La Literie — Maquette client (richard-design)
status: final
created: 2026-07-03
updated: 2026-07-03
finalized: 2026-07-03
resolved_oq: 4
stake_level: client_validation
downstream: richard2026-woocommerce
rf_count: 27
lang: fr
stakeholders:
  - Techniconcept (réalisation)
  - Richard SA / Richard La Literie (client)
---

# PRD : Richard La Literie — Maquette client

_Maquette HTML statique pour validation client — prérequis à l'implémentation WooCommerce sur richard2026._

**Statut :** `final` (2026-07-03) — 27 RF, validation client via URL staging.

## 0. Objet du document

Ce PRD définit **quoi** la maquette `richard-design` doit livrer pour permettre au client Richard La Literie de **valider le design** avant développement production.

| Public | Usage |
|--------|-------|
| Équipe Techniconcept | Redesign visuel de la maquette existante |
| Client Richard | Revue et validation du rendu |
| Workflows BMad aval | `bmad-ux` (affinage), puis implémentation dans `richard2026` |

**Ce PRD ne remplace pas** le PRD production [`prd-richard2026-2026-06-15`](file:///Volumes/www/richard2026/_bmad-output/planning-artifacts/prds/prd-richard2026-2026-06-15/prd.md) — il couvre uniquement la **phase maquette**.

Références techniques : `addendum.md`.

---

## 1. Vision

**Richard-design** est une **maquette navigable** (Vite + HTML/JS/CSS) montrant l'expérience Richard La Literie telle qu'elle apparaîtra sur le futur site WooCommerce. Le client peut parcourir les pages clés, juger le design, et donner son accord avant investissement développement WordPress.

**Succès de la maquette :** le client reconnaît l'identité Richard La Literie, valide la direction visuelle alignée sur le projet `richard2026`, et peut se projeter dans un parcours d'achat type (découverte → fiche produit → panier → checkout demo).

**Hors périmètre :** backend, paiement réel, gestion stock, compte client, multilingue, SEO production.

---

## 2. Utilisateur cible

### 2.1 Jobs To Be Done

- **Valider le design** — le client et ses parties prenantes jugent couleurs, typo, mise en page, ton visuel.
- **Parcourir un parcours crédible** — navigation, catalogue, fiche produit, panier sans casser l'illusion.
- **Comparer avec l'intention richard2026** — cohérence avec les maquettes et tokens déjà définis pour le site production.

### 2.2 Non-utilisateurs (maquette)

- Acheteurs réels (pas de transaction).
- Administrateurs WooCommerce.
- Moteurs de recherche (pas d'indexation requise).

### 2.3 Parcours clé

- **UJ-1. La cliente Richard valide la Home.**
  - **Persona :** Responsable marketing Richard, présente la maquette en réunion client.
  - **Parcours :** Ouvre `index.html` → compare hero, bandeau services, univers literie, marques, offres → le rendu correspond à `richard2026` imports/homepage.
  - **Climax :** « C'est bien notre charte » — validation ou liste de retours précis.
  - **Résolution :** Go / retours documentés pour itération.

- **UJ-2. Le client teste un achat fictif.**
  - **Persona :** Gérant Richard, 50 ans, veut voir le tunnel complet.
  - **Parcours :** Matelas → fiche produit → options → panier → checkout demo → confirmation.
  - **Climax :** Parcours fluide, prix CHF lisibles, design cohérent fiche → panier → checkout.
  - **Cas limite :** Message clair que le paiement est simulé.

---

## 3. Glossaire

- **Maquette** — Site statique `richard-design` (Vite), données JSON mock.
- **richard2026** — Projet WordPress/WooCommerce production ; **source de vérité design**.
- **Enveloppe globale** — Header (logo, recherche, actions, nav), footer — commune à toutes les pages.
- **Structure figée** — Arborescence HTML, `data-page`, URLs et hooks JS existants — **non modifiables** sans accord explicite.
- **Redesign** — Refonte CSS, assets visuels, markup interne des composants — **dans la structure figée**.
- **Validation client** — Accord formel (réunion, e-mail, ticket) sur la maquette avant bascule richard2026.

---

## 4. Fonctionnalités

### 4.1 Alignement design system (richard2026)

**Objectif :** Porter l'identité visuelle `richard2026` dans `richard-design`.

- **RF-DESIGN-001** — Les couleurs UI doivent utiliser la palette `theme.js` richard2026 (`primary`, `surface`, `accent-strong`, etc.) — voir `addendum.md` §2.
- **RF-DESIGN-002** — La typographie doit suivre l'échelle sémantique richard2026 (`display-lg` → `label-caps`) ; titres en serif display, corps en sans-serif.
- **RF-DESIGN-003** — Les espacements et rayons doivent être cohérents avec les tokens SCSS richard2026 (sections 48px desktop, gutters responsives).
- **RF-DESIGN-004** — Le logo, pictogrammes et images de marque doivent provenir des assets validés client ou de `richard2026` / charte — pas des placeholders génériques là où des assets existent.
- **RF-DESIGN-005** — Le rendu **desktop et mobile** est requis pour la validation client ; les imports richard2026 en 1080px fixe servent de référence desktop, avec adaptation responsive sur les breakpoints `theme.js` (sm/md/lg).
- **RF-DESIGN-006** — La police **Pryced Serif** (display/titres) doit être embarquée dans la maquette avec **SuisseIntl** en corps — fichiers fonts fournis et chargés via `@font-face` dans `styles/`.

### 4.2 Enveloppe globale

- **RF-ENV-001** — Header : logo Richard La Literie, recherche, « Prendre rendez-vous », « Mon compte », panier avec compteur — design aligné fiche produit richard2026.
- **RF-ENV-002** — Navigation principale : MARQUES, MATELAS, SOMMIERS, LITS, LITERIE, CONSEILS, OFFRES SPÉCIALES % — ordre et libellés conservés.
- **RF-ENV-003** — Footer : colonnes navigation, literie, légal, réseaux — contenu et liens existants, design refondu.
- **RF-ENV-004** — La structure des conteneurs `#site-header` / `#site-footer` et l'injection via `renderSharedLayout()` sont conservées.

### 4.3 Pages — structure conservée, design refondu

| Page | RF | Exigence |
|------|-----|----------|
| Home | RF-PAGE-001 | Hero, services, catégories, marques, liquidations, expert — design richard2026 Home |
| Catégories | RF-PAGE-002 | Liste / recherche — cartes produit redesignées |
| Catégorie | RF-PAGE-003 | Filtres, tri, grille — design archives richard2026 |
| Marques | RF-PAGE-004 | Grille marques partenaires |
| Marque | RF-PAGE-005 | Détail marque + produits associés |
| Fiche produit | RF-PAGE-006 | Galerie, options, prix CHF, accordéons, rails similaires/recommandés, bandeau services, bloc conseil — aligné `fiche-produit.html` |
| Panier | RF-PAGE-007 | Liste articles, quantités, résumé — design cohérent tunnel achat |
| Checkout | RF-PAGE-008 | Formulaire coordonnées, livraison, mock Payrexx — mention demo explicite |
| À propos | RF-PAGE-009 | Page éditoriale — typo et espacements charte |
| Conseils | RF-PAGE-010 | Liste articles — `[ASSUMPTION]` contenu placeholder acceptable |
| Contact | RF-PAGE-011 | Coordonnées showroom Crissier |
| Compte | RF-PAGE-012 | `[ASSUMPTION]` Page placeholder cohérente (compte hors scope production v1) |
| Légal (CGU, confidentialité) | RF-PAGE-013 | Mise en forme `template-legal` richard2026 |

- **RF-PAGE-014** — Aucune page existante ne doit être supprimée ni renommée (URLs, fichiers `pages/*.html`).
- **RF-PAGE-015** — Aucune nouvelle page routable ne doit être ajoutée sans accord explicite (hors scope maquette).

### 4.4 Comportement fonctionnel (conservation)

- **RF-FUNC-001** — Le routage par `data-page` et le switch `app.js` restent inchangés.
- **RF-FUNC-002** — Les données mock (`data/*.json`) et l'API `js/data.js` restent la source catalogue.
- **RF-FUNC-003** — Le panier `localStorage` (`richard_cart`) et les helpers prix (`formatPriceCHF`, variations) restent fonctionnels.
- **RF-FUNC-004** — Les filtres catégorie par slug (`matelas`, `sommier`, `literie`, `liquidation`) restent opérationnels.
- **RF-FUNC-005** — Le checkout demo conserve le flux `?confirmed=true` et vide le panier.

### 4.5 Présentation client

- **RF-DEMO-001** — `npm run dev` lance la maquette sur port 3000 — utilisable en démo live.
- **RF-DEMO-002** — `npm run build` produit un `dist/` déployé sur une **URL staging** — canal principal de validation client.
- **RF-DEMO-003** — Livrable unique : `index.html` + `pages/` + assets associés. Les dossiers `homepage/` et `product/` sont **hors périmètre** (projet richard2026) — ne pas les modifier ni s'en inspirer pour ce redesign.
- **RF-DEMO-004** — L'URL staging doit être partagée au client pour revue autonome desktop et mobile ; les retours sont collectés avant go production richard2026.

---

## 5. Exigences non fonctionnelles

- **NFR-001** — Langue UI : français (fr-CH).
- **NFR-002** — Devise : CHF uniquement.
- **NFR-003** — Accessibilité : conserver les patterns existants (aria-label, sr-only, focus clavier lightbox) ; pas de régression majeure.
- **NFR-004** — Performance maquette : pas de framework lourd ; Vite seul en devDependency.
- **NFR-005** — Compatibilité navigateur : Chrome, Safari, Firefox récents — **desktop et mobile** requis pour validation client (viewport 375px minimum).
- **NFR-006** — Commentaires code : entêtes en français ; identifiants en anglais (convention projet).

---

## 6. Périmètre MVP maquette

### In scope

- Redesign complet CSS + assets visuels sur les 14 pages existantes.
- Alignement tokens richard2026.
- Parcours demo achat bout-en-bout.
- Build statique pour présentation.

### Out of scope

- Intégration WooCommerce, WordPress, ACF.
- Paiement Payrexx réel.
- Import produits XLSX client.
- Compte client, auth, e-mails transactionnels.
- Multilingue WPML.
- Parité fonctionnelle avec les 78 RF du PRD richard2026 production.

---

## 7. Critères de succès / validation client

| Critère | Mesure |
|---------|--------|
| Identité visuelle | Client confirme alignement charte Richard / richard2026 |
| Parcours démo | Home → produit → panier → checkout sans rupture visuelle |
| Responsive | Validation réussie sur desktop **et** mobile via URL staging |
| Structure | URLs et navigation identiques à l'existant |
| Feedback | Retours client documentés après revue staging |
| Go production | Accord explicite avant développement richard2026 |

---

## 8. Décisions résolues

| ID | Question | Décision (2026-07-03) | Réf. PRD |
|----|----------|----------------------|----------|
| OQ-01 | Desktop seul ou mobile requis ? | **Desktop et mobile** — les deux sont requis pour le go client | RF-DESIGN-005, NFR-005 |
| OQ-02 | Pryced Serif embarquée ? | **Oui** — fonts fournies et intégrées dans la maquette | RF-DESIGN-006 |
| OQ-03 | Dossiers `homepage/` et `product/` ? | **Hors périmètre** — projet richard2026, ne pas tenir compte | RF-DEMO-003 |
| OQ-04 | Format validation client ? | **URL staging** — revue autonome sur environnement déployé | RF-DEMO-002, RF-DEMO-004 |

---

## 9. Hypothèses indexées

| ID | Hypothèse | Statut |
|----|-----------|--------|
| A-01 | Enjeu = validation client (rigor modérée), pas lancement production. | Confirmée |
| A-02 | Fast path accepté — inférences documentées ci-dessus. | Confirmée |
| A-03 | richard2026 reste la cible technique post-validation. | Confirmée |
| A-04 | Les retours client sur la maquette alimentent richard2026. | Confirmée |
| A-05 | Contenu texte et produits mock actuels suffisent pour la démo. | Confirmée |
| A-06 | Hébergement staging à provisionner côté Techniconcept `[NOTE]` — URL à communiquer au client une fois déployée. | Ouverte |

---

## 10. Prochaines étapes BMad

1. **Relecture** de ce PRD par Razvan → statut `final`.
2. **`bmad-ux`** — optionnel si affinage par écran avant dev.
3. **Implémentation redesign** — stories ou `bmad-quick-dev` par page.
4. **Post-validation** — reprendre `richard2026` avec PRD production existant.
