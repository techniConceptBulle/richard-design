/**
 * Carousel marques — bandeau logos (accueil / page expert).
 */

import { escapeHtml, getFeaturedBrands, getBrandLogoSrc } from "./brands-page.js";
import { getBrandUrl } from "./utils.js";

const DEFAULT_SLIDE_COUNT = 9;

/**
 * Calcule le décalage horizontal d'un slide (largeur + gap).
 * @param {HTMLElement|null} container
 * @param {string} [slideSelector]
 * @returns {number}
 */
export function getBrandCarouselScrollStep(container, slideSelector = ".brand-row__slide") {
  if (!container) return 0;

  const slide = container.querySelector(slideSelector);
  if (!slide) return 0;

  const style = getComputedStyle(container);
  const gap = parseFloat(style.columnGap || style.gap) || 0;

  return slide.offsetWidth + gap;
}

/**
 * Met à jour l'état des flèches selon la position de scroll.
 * @param {HTMLElement|null} container
 * @param {HTMLButtonElement|null} prevButton
 * @param {HTMLButtonElement|null} nextButton
 */
export function syncBrandCarouselArrows(container, prevButton, nextButton) {
  if (!container || !prevButton || !nextButton) return;

  const maxScroll = Math.max(0, container.scrollWidth - container.clientWidth);
  const scrollLeft = container.scrollLeft;

  prevButton.disabled = scrollLeft <= 4;
  nextButton.disabled = scrollLeft >= maxScroll - 4;
}

/**
 * Construit le HTML des slides à partir des marques mises en avant.
 * @param {Array<object>} brands
 * @returns {string}
 */
export function buildFeaturedBrandSlidesHtml(brands) {
  const featured = getFeaturedBrands(brands);
  if (!featured.length) return "";

  return featured
    .map((brand) => {
      const name = escapeHtml(brand.name || "Marque");
      const logo = escapeHtml(getBrandLogoSrc(brand));
      return `
      <a
        class="brand-row__slide"
        href="${getBrandUrl(brand.slug)}"
        aria-label="${name}"
      >
        <img class="brand-row__logo" src="${logo}" alt="${name}" width="300" height="92" loading="lazy" decoding="async">
      </a>
    `.trim();
    })
    .join("");
}

/**
 * Construit les slides répétés (comportement legacy page expert).
 * @param {number} slideCount
 * @param {string} logoSrc
 * @param {string} brandHref
 * @param {string} [brandName]
 * @returns {string}
 */
export function buildRepeatedBrandSlidesHtml(
  slideCount,
  logoSrc,
  brandHref,
  brandName = "Roviva"
) {
  const safeName = escapeHtml(brandName);
  const safeSrc = escapeHtml(logoSrc);
  const safeHref = escapeHtml(brandHref);
  const count = Number.isFinite(slideCount) && slideCount > 0 ? slideCount : DEFAULT_SLIDE_COUNT;

  return Array.from({ length: count }, (_, index) => {
    const label = `${safeName} — slide ${index + 1}`;
    return `
      <a
        class="brand-row__slide"
        href="${safeHref}"
        role="group"
        aria-roledescription="slide"
        aria-label="${label}"
      >
        <img class="brand-row__logo" src="${safeSrc}" alt="${safeName}" width="300" height="92" loading="lazy" decoding="async">
      </a>
    `.trim();
  }).join("");
}

/**
 * Branche les flèches et le scroll sur un carousel déjà rempli.
 * @param {HTMLElement} container
 */
function wireBrandCarouselControls(container) {
  const wrap = container.closest(".brands__slider-wrap");
  if (!wrap) return;

  const prevButton = wrap.querySelector(".arrow.left");
  const nextButton = wrap.querySelector(".arrow.right");
  if (!prevButton || !nextButton) return;

  const scrollByStep = (direction) => {
    const step = getBrandCarouselScrollStep(container);
    if (!step) return;
    container.scrollBy({ left: direction * step, behavior: "smooth" });
  };

  const onScroll = () => syncBrandCarouselArrows(container, prevButton, nextButton);

  prevButton.addEventListener("click", () => scrollByStep(-1));
  nextButton.addEventListener("click", () => scrollByStep(1));
  container.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);

  onScroll();
}

/**
 * Initialise un bandeau / carousel marques (accueil grille, ou legacy slider).
 * @param {HTMLElement} container
 * @param {{ featuredBrands?: Array<object> }} [options]
 */
function initOneBrandCarousel(container, options = {}) {
  const useFeatured =
    container.dataset.brandSource === "featured" ||
    container.id === "home-brand-row" ||
    container.id === "about-brand-row";

  if (useFeatured && Array.isArray(options.featuredBrands)) {
    container.innerHTML = buildFeaturedBrandSlidesHtml(options.featuredBrands);
  } else if (container.dataset.brandCarousel === "legacy") {
    const slideCount =
      Number.parseInt(container.dataset.brandSlideCount || "", 10) || DEFAULT_SLIDE_COUNT;
    const logoSrc = container.dataset.brandLogo || "/assets/home/brand-roviva-ref.png";
    const brandHref = container.dataset.brandHref || getBrandUrl("roviva");
    const brandName = container.dataset.brandName || "Roviva";
    container.innerHTML = buildRepeatedBrandSlidesHtml(
      slideCount,
      logoSrc,
      brandHref,
      brandName
    );
  }

  // Flèches uniquement si le wrapper slider est présent (page expert)
  if (container.closest(".brands__slider-wrap")) {
    wireBrandCarouselControls(container);
  }
}

/**
 * Initialise tous les carousels marques présents dans le document.
 * @param {ParentNode} [root=document]
 * @param {{ featuredBrands?: Array<object> }} [options]
 * @returns {number} nombre de carousels initialisés
 */
export function initBrandCarousel(root = document, options = {}) {
  const containers = root.querySelectorAll(
    "#home-brand-row, #about-brand-row, [data-brand-source=\"featured\"]"
  );
  const unique = [...new Set([...containers])];
  unique.forEach((container) => initOneBrandCarousel(container, options));
  return unique.length;
}
