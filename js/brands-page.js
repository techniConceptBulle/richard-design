/**
 * Helpers pour la page liste des marques et les pages détail de marque.
 * Contenu éditorial (texte, galerie, logo fabricant) — extensible via brands.json.
 */

import { getBrandUrl } from "./utils.js";

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
  const logo = escapeHtml(brand.logo || "");
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
