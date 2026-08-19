/**
 * Helpers pour la page liste des marques et les pages détail de marque.
 * Contenu éditorial (texte, galerie, logo fabricant) — extensible via brands.json.
 * Le layout Selecta (maquette blocs) est rendu à part, sans toucher au gabarit générique.
 */

import { getBrandUrl } from "./utils.js";

/** Marques affichées dans la grille produits de la page Selecta. */
export const SELECTA_PAGE_BRAND_IDS = ["selecta", "rowa"];

/** Nombre max de cartes sur la page Selecta (maquette : 4). */
export const SELECTA_PRODUCTS_LIMIT = 4;

/** Slug de la page qui utilise le layout blocs maquette. */
export const SELECTA_BRAND_SLUG = "selecta";

/**
 * Échappe le HTML pour l’injection sécurisée dans le DOM.
 * @param {unknown} value
 * @returns {string}
 */
export function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/**
 * Retourne les marques mises en avant sur la page Marques, triées.
 * @param {Array<object>} brands
 * @returns {Array<object>}
 */
export function getFeaturedBrands(brands) {
  if (!Array.isArray(brands)) return [];
  return brands
    .filter((brand) => brand && brand.featured === true)
    .slice()
    .sort((a, b) => {
      const orderA = Number.isFinite(a.sortOrder) ? a.sortOrder : Number.MAX_SAFE_INTEGER;
      const orderB = Number.isFinite(b.sortOrder) ? b.sortOrder : Number.MAX_SAFE_INTEGER;
      if (orderA !== orderB) return orderA - orderB;
      return String(a.name || "").localeCompare(String(b.name || ""), "fr");
    });
}

/**
 * Retourne l'URL du logo marque (accueil, fiche produit, pages marque).
 * Une seule source : brands.json → logo.
 * @param {object|null|undefined} brand
 * @returns {string}
 */
export function getBrandLogoSrc(brand) {
  if (!brand || !brand.logo) return "";
  return String(brand.logo);
}

/**
 * Construit le HTML d’une tuile (encadré) pour la grille Marques.
 * @param {object} brand
 * @returns {string}
 */
export function buildBrandTileHtml(brand) {
  if (!brand || !brand.slug) return "";
  const name = escapeHtml(brand.name || "Marque");
  const cardImage = escapeHtml(brand.cardImage || brand.logo || "");
  return `
    <a href="${getBrandUrl(brand.slug)}" class="brand-tile" aria-label="Découvrir ${name}">
      <img src="${cardImage}" alt="${name}" class="brand-tile__image" loading="lazy" />
    </a>
  `.trim();
}

/**
 * Construit le HTML de la grille des marques mises en avant.
 * @param {Array<object>} brands
 * @returns {string}
 */
export function buildBrandsGridHtml(brands) {
  const featured = getFeaturedBrands(brands);
  if (!featured.length) {
    return '<p class="brands-grid-empty">Aucune marque mise en avant pour le moment.</p>';
  }
  return featured.map((brand) => buildBrandTileHtml(brand)).join("");
}

/**
 * Construit le HTML du logo cliquable vers le site fabricant.
 * @param {object} brand
 * @returns {string}
 */
export function buildBrandLogoLinkHtml(brand) {
  if (!brand) return "";
  const name = escapeHtml(brand.name || "Marque");
  const logo = escapeHtml(getBrandLogoSrc(brand));
  const website = String(brand.website || "").trim();
  const img = `<img src="${logo}" alt="Logo ${name}" class="brand-detail__logo" />`;
  if (!website) {
    return `<div class="brand-detail__logo-wrap">${img}</div>`;
  }
  return `
    <a
      href="${escapeHtml(website)}"
      class="brand-detail__logo-link"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Visiter le site officiel de ${name}"
    >
      ${img}
    </a>
  `.trim();
}

/**
 * Construit le HTML du corps éditorial (chapô + sections).
 * Le chapô (headline) est un h2, plus petit que le h1 du nom de marque.
 * @param {object} brand
 * @returns {string}
 */
export function buildBrandBodyHtml(brand) {
  if (!brand) return "";
  const parts = [];
  const hasHeadline = Boolean(brand.headline);
  if (hasHeadline) {
    parts.push(`<h2 class="brand-detail__headline">${escapeHtml(brand.headline)}</h2>`);
  }
  const sectionTag = hasHeadline ? "h3" : "h2";
  const sections = Array.isArray(brand.sections) ? brand.sections : [];
  sections.forEach((section) => {
    if (!section) return;
    const title = section.title
      ? `<${sectionTag} class="brand-detail__section-title">${escapeHtml(section.title)}</${sectionTag}>`
      : "";
    const paragraphs = Array.isArray(section.paragraphs)
      ? section.paragraphs
          .filter((p) => typeof p === "string" && p.trim())
          .map((p) => `<p class="brand-detail__paragraph">${escapeHtml(p)}</p>`)
          .join("")
      : "";
    if (title || paragraphs) {
      parts.push(`<section class="brand-detail__section">${title}${paragraphs}</section>`);
    }
  });
  if (!parts.length && brand.description) {
    parts.push(`<p class="brand-detail__paragraph">${escapeHtml(brand.description)}</p>`);
  }
  return parts.join("");
}

/**
 * Construit le HTML de la galerie photos masonry de la marque.
 * @param {object} brand
 * @returns {string}
 */
export function buildBrandGalleryHtml(brand) {
  const gallery = Array.isArray(brand?.gallery) ? brand.gallery : [];
  if (!gallery.length) return "";
  const items = gallery
    .filter((item) => item && item.src)
    .map((item, index) => {
      const src = escapeHtml(item.src);
      const alt = escapeHtml(item.alt || brand.name || "Photo de la marque");
      const featuredClass = index === 0 ? " brand-detail__gallery-item--featured" : "";
      return `
        <figure class="brand-detail__gallery-item${featuredClass}">
          <button
            type="button"
            class="brand-detail__gallery-trigger"
            data-brand-gallery-index="${index}"
            aria-label="Agrandir l'image : ${alt}"
          >
            <img src="${src}" alt="${alt}" loading="lazy" />
          </button>
        </figure>
      `.trim();
    })
    .join("");
  if (!items) return "";
  return `
    <div class="brand-detail__gallery" role="list">
      ${items}
    </div>
  `.trim();
}

/**
 * Indique si la marque doit utiliser le layout blocs Selecta.
 * @param {object} brand
 * @returns {boolean}
 */
export function isSelectaBrandPage(brand) {
  return Boolean(brand && brand.slug === SELECTA_BRAND_SLUG && brand.selectaPage);
}

/**
 * Filtre les produits catalogue affichés sur la page Selecta (selecta + rowa).
 * @param {Array<object>} products
 * @param {number} [limit]
 * @returns {Array<object>}
 */
export function getSelectaPageProducts(products, limit = SELECTA_PRODUCTS_LIMIT) {
  if (!Array.isArray(products)) return [];
  const max = Number.isFinite(limit) && limit >= 0 ? limit : SELECTA_PRODUCTS_LIMIT;
  return products
    .filter(
      (product) =>
        product &&
        product.slug &&
        SELECTA_PAGE_BRAND_IDS.includes(product.brandId)
    )
    .slice(0, max);
}

/**
 * Joint les paragraphes éditoriaux en HTML échappé.
 * @param {string[]} paragraphs
 * @param {string} className
 * @returns {string}
 */
function buildSelectaParagraphsHtml(paragraphs, className) {
  if (!Array.isArray(paragraphs)) return "";
  return paragraphs
    .filter((paragraph) => typeof paragraph === "string" && paragraph.trim())
    .map((paragraph) => `<p class="${className}">${escapeHtml(paragraph)}</p>`)
    .join("");
}

/**
 * Image éditoriale Selecta — omise si le src est vide (évite un <img src="">).
 * @param {string} src
 * @param {string} alt
 * @param {string} [className]
 * @returns {string}
 */
function buildSelectaImgHtml(src, alt, className) {
  if (typeof src !== "string" || !src.trim()) return "";
  const cls = className ? ` class="${className}"` : "";
  return `<img src="${escapeHtml(src)}" alt="${escapeHtml(alt || "")}"${cls} loading="lazy" />`;
}

/**
 * Grille de pictos (titre + texte court).
 * @param {Array<object>} features
 * @returns {string}
 */
function buildSelectaFeaturesHtml(features) {
  if (!Array.isArray(features) || !features.length) return "";
  const items = features
    .filter((feature) => feature && (feature.title || feature.icon))
    .map((feature) => {
      const icon = buildSelectaImgHtml(feature.icon, "", "selecta-feature__icon");
      const title = feature.title
        ? `<h3 class="selecta-feature__title">${escapeHtml(feature.title)}</h3>`
        : "";
      const text = feature.text
        ? `<p class="selecta-feature__text">${escapeHtml(feature.text)}</p>`
        : "";
      return `<li class="selecta-feature">${icon}${title}${text}</li>`;
    })
    .join("");
  if (!items) return "";
  return `<ul class="selecta-features">${items}</ul>`;
}

/**
 * Section sélection produits — mêmes cartes que « Produits similaires » (fiche produit).
 * @param {object} copy
 * @param {string} productsHtml
 * @returns {string}
 */
export function buildSelectaProductsSectionHtml(copy, productsHtml) {
  const cards = typeof productsHtml === "string" ? productsHtml.trim() : "";
  if (!cards) return "";
  const title = copy?.title
    ? `<h2>${escapeHtml(copy.title)}</h2>`
    : "";
  const allLabel = copy?.allLabel || "Voir tous les produits Röwa & Selecta by Röwa";
  return `
    <section class="selecta-section selecta-section--products product-related-section category-archive-page" aria-label="${escapeHtml(copy?.title || "Sélection")}">
      <div class="selecta-section__inner">
        <header class="product-related-header">${title}</header>
        <div class="category-products-grid">${cards}</div>
        <button type="button" class="selecta-products__all">${escapeHtml(allLabel)}</button>
      </div>
    </section>
  `.trim();
}

/**
 * Construit le HTML complet du layout blocs Selecta.
 * @param {object} brand
 * @param {string} [productsHtml] Cartes catalogue (même markup que la fiche produit)
 * @returns {string}
 */
export function buildSelectaBrandPageHtml(brand, productsHtml = "") {
  if (!isSelectaBrandPage(brand)) return "";
  const page = brand.selectaPage || {};
  const name = escapeHtml(brand.name || "Selecta");
  const hero = page.hero || {};
  const manufacture = page.manufacture || {};
  const people = page.people || {};
  const expertise = page.expertise || {};
  const base = page.base || {};
  const why = page.why || {};
  const cta = page.cta || {};

  const heroImage = buildSelectaImgHtml(hero.image, hero.imageAlt || name, "selecta-hero__image");
  const heroLogo = buildSelectaImgHtml(hero.logo, hero.logoAlt || name, "selecta-hero__logo");

  const peopleImages = Array.isArray(people.images)
    ? people.images
        .map((item) => buildSelectaImgHtml(item?.src, item?.alt || ""))
        .filter(Boolean)
        .join("")
    : "";

  const ctaHref = cta.buttonHref || "/pages/contact.html";
  const ctaLabel = cta.buttonLabel || "Prendre rendez-vous";

  return `
    <h1 class="selecta-brand__title">${name}</h1>
    <section class="selecta-hero" aria-label="${name}">
      <div class="selecta-hero__inner">
        ${heroImage}
        ${heroLogo ? `<div class="selecta-hero__badge">${heroLogo}</div>` : ""}
      </div>
    </section>
    <section class="selecta-section selecta-section--split selecta-section--surface">
      <div class="selecta-section__inner selecta-split">
        <div class="selecta-split__media">
          ${buildSelectaImgHtml(manufacture.image, manufacture.imageAlt || "")}
        </div>
        <div class="selecta-split__content">
          <h2 class="selecta-section__title">${escapeHtml(manufacture.title || "")}</h2>
          ${buildSelectaParagraphsHtml(manufacture.paragraphs, "selecta-section__text")}
        </div>
      </div>
      <div class="selecta-section__inner">
        ${buildSelectaFeaturesHtml(manufacture.features)}
      </div>
    </section>
    <section class="selecta-section selecta-section--split">
      <div class="selecta-section__inner selecta-split">
        <div class="selecta-split__media selecta-split__media--pair">${peopleImages}</div>
        <div class="selecta-split__content">
          <h2 class="selecta-section__title">${escapeHtml(people.title || "")}</h2>
          ${buildSelectaParagraphsHtml(people.paragraphs, "selecta-section__text")}
        </div>
      </div>
    </section>
    <section class="selecta-section selecta-section--split selecta-section--surface selecta-section--image-right">
      <div class="selecta-section__inner selecta-split">
        <div class="selecta-split__content">
          <h2 class="selecta-section__title">${escapeHtml(expertise.title || "")}</h2>
          ${buildSelectaParagraphsHtml(expertise.paragraphs, "selecta-section__text")}
          ${buildSelectaFeaturesHtml(expertise.features)}
        </div>
        <div class="selecta-split__media">
          ${buildSelectaImgHtml(expertise.image, expertise.imageAlt || "")}
        </div>
      </div>
    </section>
    <section class="selecta-section selecta-section--split selecta-section--sommier">
      <div class="selecta-section__inner selecta-split">
        <div class="selecta-split__media selecta-split__media--cutout">
          ${buildSelectaImgHtml(base.image, base.imageAlt || "")}
        </div>
        <div class="selecta-split__content">
          <h2 class="selecta-section__title">${escapeHtml(base.title || "")}</h2>
          ${buildSelectaParagraphsHtml(base.paragraphs, "selecta-section__text")}
        </div>
      </div>
    </section>
    ${buildSelectaProductsSectionHtml(page.products, productsHtml)}
    <section class="selecta-section selecta-section--why selecta-section--surface">
      <div class="selecta-section__inner selecta-why">
        <div class="selecta-why__icon">
          ${buildSelectaImgHtml(why.icon, why.iconAlt || "")}
        </div>
        <h2 class="selecta-section__title selecta-why__title">${escapeHtml(why.title || "")}</h2>
        <div class="selecta-why__text">
          ${buildSelectaParagraphsHtml(why.paragraphs, "selecta-section__text")}
        </div>
      </div>
    </section>
    <section class="selecta-cta" aria-label="${escapeHtml(cta.title || ctaLabel)}">
      <div class="selecta-cta__inner">
        <span class="selecta-cta__icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none">
            <rect x="3" y="4.5" width="18" height="17" rx="2" stroke="currentColor" stroke-width="1.8"/>
            <path d="M7 2.5v4M17 2.5v4M3 9h18" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
          </svg>
        </span>
        <div class="selecta-cta__copy">
          <p class="selecta-cta__title">${escapeHtml(cta.title || "")}</p>
          <p class="selecta-cta__text">${escapeHtml(cta.text || "")}</p>
        </div>
        <a class="selecta-cta__button" href="${escapeHtml(ctaHref)}">${escapeHtml(ctaLabel)}</a>
      </div>
    </section>
  `.trim();
}
