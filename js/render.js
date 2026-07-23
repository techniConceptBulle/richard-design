// Fonctions de rendu pour les listes de produits, catégories, marques et fiches produit.

import { initHeroSlider } from "./hero-slider.js";
import { initBrandCarousel } from "./brand-carousel.js";
import { initEnvelopeOffset } from "./envelope-offset.js";
import { renderFooterHtml } from "./footer-config.js";
import {
  getMainCategories,
  getBrands,
  getProducts,
  getCategories,
  getLiquidationProducts,
  getCategoryBySlug,
  getBrandBySlug,
  getProductBySlug
} from "./data.js";
import { formatPriceCHF, parseQueryParams, getProductImageUrl, getCategoryImageUrl, getBrandImageUrl } from "./utils.js";
import { filterProductsBySearchTerm } from "./search.js";
import { addToCart, getCartItems, getCartServiceOptions, saveCartItems, saveCartServiceOptions } from "./cart.js";
import {
  getProductListingRating,
  getProductListingStockLabel,
  renderCategoryProductSaleBadges,
  renderProductStarRating
} from "./category-card.js";

/* HEADER / FOOTER PARTAGÉS — structure alignée sur richard2026 (envelope) */

const FLAG_CH_SVG = `<svg class="topbar__flag-icon" width="14" height="14" viewBox="0 0 20 20" fill="none" aria-hidden="true"><rect width="20" height="20" fill="#FF0000"/><rect x="8" y="3" width="4" height="14" fill="#FFFFFF"/><rect x="3" y="8" width="14" height="4" fill="#FFFFFF"/></svg>`;

const SEARCH_ICON_SVG = `<svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true"><circle cx="9" cy="9" r="6" stroke="currentColor" stroke-width="1.5"/><path d="M14 14L18 18" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>`;

const CART_ICON_SVG = `<svg width="24" height="24" viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M4 4H5.2L6.4 13.2C6.5 13.9 7.1 14.5 7.8 14.5H15.2C15.9 14.5 16.5 13.9 16.6 13.2L17.4 7.5H6.2" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><circle cx="8.5" cy="17" r="1" fill="currentColor"/><circle cx="14.5" cy="17" r="1" fill="currentColor"/></svg>`;

const SUBMENU_CHEVRON_SVG = `<svg viewBox="0 0 12 8" fill="none" aria-hidden="true"><path d="M1 1.5L6 6.5L11 1.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

const TOPBAR_LINKS = [
  { href: "/pages/contact.html", label: "Magasin à Crissier" },
  { href: "/pages/advice.html", label: "Conseils personnalisés" },
  { href: "/pages/about.html", label: "Services" }
];

const PRIMARY_NAV_ITEMS = [
  {
    href: "/pages/about.html",
    label: "A propos",
    children: [
      {
        href: "/pages/about.html#about-expert",
        label: "L'expert de la literie à Crissier"
      },
      {
        href: "/pages/about.html#about-store",
        label: "Votre magasin à Crissier"
      },
      {
        href: "/pages/about.html#about-premium",
        label: "Nos services premium"
      },
      {
        href: "/pages/about.html#about-products",
        label: "Nos produits de literie"
      }
    ]
  },
  { href: "/pages/category.html?slug=matelas", label: "Matelas" },
  { href: "/pages/category.html?slug=sommier", label: "Sommiers" },
  { href: "/pages/category.html?slug=lit", label: "Lits" },
  { href: "/pages/category.html?slug=literie", label: "Literie" },
  { href: "/pages/category.html?slug=liquidation", label: "Offre spéciales %", sale: true },
  { href: "/pages/brands.html", label: "Marques" },
  { href: "/pages/advice.html", label: "Conseils" }
];

/**
 * Active le menu burger mobile et les sous-menus de l'enveloppe site.
 */
function initSiteEnvelope(headerEl) {
  const burger = headerEl.querySelector("#nav-burger");
  const menu = headerEl.querySelector("#nav-menu");

  if (!burger || !menu) return;

  const closeMenu = () => {
    menu.classList.remove("is-active");
    burger.classList.remove("is-active");
    burger.setAttribute("aria-expanded", "false");
    document.body.classList.remove("nav-open");
    menu.querySelectorAll(".submenu.is-open").forEach((submenu) => {
      submenu.classList.remove("is-open");
    });
    menu.querySelectorAll('.submenu-toggle[aria-expanded="true"]').forEach((toggle) => {
      toggle.setAttribute("aria-expanded", "false");
    });
  };

  const mediaQuery = window.matchMedia("(min-width: 768px)");

  const syncMenuAccessibility = () => {
    if (mediaQuery.matches) {
      menu.removeAttribute("aria-hidden");
      closeMenu();
      return;
    }

    menu.setAttribute("aria-hidden", menu.classList.contains("is-active") ? "false" : "true");
  };

  syncMenuAccessibility();
  mediaQuery.addEventListener("change", syncMenuAccessibility);

  burger.addEventListener("click", () => {
    const willOpen = !menu.classList.contains("is-active");
    menu.classList.toggle("is-active", willOpen);
    burger.classList.toggle("is-active", willOpen);
    burger.setAttribute("aria-expanded", willOpen ? "true" : "false");
    menu.setAttribute("aria-hidden", willOpen ? "false" : "true");
    document.body.classList.toggle("nav-open", willOpen);
  });

  menu.querySelectorAll(".submenu-toggle").forEach((toggle) => {
    toggle.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      const parent = toggle.closest(".menu-item--has-children");
      const submenu = parent?.querySelector(":scope > .submenu");
      if (!submenu) return;

      const willOpen = !submenu.classList.contains("is-open");
      submenu.classList.toggle("is-open", willOpen);
      toggle.setAttribute("aria-expanded", willOpen ? "true" : "false");
    });
  });

  menu.querySelectorAll(".menu-link").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeMenu();
  });
}

/**
 * Construit le HTML d'un item de navigation catalogue (avec sous-menu éventuel).
 */
function renderPrimaryNavItem(item, isNavItemActive) {
  const { href, label, sale, children } = item;
  const activeClass = isNavItemActive(href) ? " menu-link--active" : "";
  const promoClass = sale ? " menu-item-promo" : "";

  if (!children?.length) {
    return `<li class="${promoClass.trim()}"><a href="${href}" class="menu-link${activeClass}">${label}</a></li>`;
  }

  const submenuId = "nav-submenu-about";
  const childLinks = children
    .map((child) => {
      const childActive = isNavItemActive(child.href) ? " menu-link--active" : "";
      return `<li><a href="${child.href}" class="menu-link${childActive}">${child.label}</a></li>`;
    })
    .join("");

  return `
    <li class="menu-item--has-children">
      <div class="menu-item__trigger">
        <a href="${href}" class="menu-link menu-item__parent${activeClass}">${label}</a>
        <button
          type="button"
          class="submenu-toggle"
          aria-expanded="false"
          aria-controls="${submenuId}"
          aria-label="Afficher le sous-menu ${label}"
        >
          ${SUBMENU_CHEVRON_SVG}
        </button>
      </div>
      <ul class="submenu" id="${submenuId}">
        ${childLinks}
      </ul>
    </li>
  `;
}

export function renderSharedLayout() {
  const headerEl = document.getElementById("site-header");
  const footerEl = document.getElementById("site-footer");

  if (headerEl) {
    const currentUrl = new URL(window.location.href);
    const isNavItemActive = (href) => {
      const targetUrl = new URL(href, window.location.origin);
      if (currentUrl.pathname !== targetUrl.pathname) return false;

      const targetSlug = targetUrl.searchParams.get("slug");
      const currentSlug = currentUrl.searchParams.get("slug");

      if (targetSlug) {
        return targetSlug === currentSlug;
      }

      // Ancres À propos : actif seulement si le hash correspond
      if (targetUrl.hash) {
        return currentUrl.hash === targetUrl.hash;
      }

      return true;
    };

    const topbarLinks = TOPBAR_LINKS.map(
      ({ href, label }) => `<li><a class="topbar__link" href="${href}">${label}</a></li>`
    ).join("");

    const mainNav = PRIMARY_NAV_ITEMS.map((item) => renderPrimaryNavItem(item, isNavItemActive)).join("");

    headerEl.innerHTML = `
      <div class="site-envelope" id="site-envelope">
        <div class="topbar">
          <div class="topbar__inner">
            <p class="topbar__message">
              <span class="topbar__message-text">Depuis 1933 à Crissier, l'expertise du sommeil</span>
              <span class="topbar__flag" aria-hidden="true">${FLAG_CH_SVG}</span>
            </p>
            <ul class="topbar__links">${topbarLinks}</ul>
          </div>
        </div>

        <div class="header-main">
          <div class="header-main__inner">
            <a href="/" class="header-main__brand" aria-label="Richard La Literie — Accueil">
              <img src="/assets/home/logo.png" alt="Richard La Literie" width="140" height="64">
            </a>

            <form class="header-main__search header-main__search--desktop" role="search" action="/pages/category.html" method="get">
              <label class="sr-only" for="site-search-input">Rechercher un produit</label>
              <div class="header-main__search-field">
                <input
                  id="site-search-input"
                  class="header-main__search-input"
                  type="search"
                  name="q"
                  placeholder="Rechercher un matelas, un sommier ou une marque…"
                  minlength="2"
                />
                <button type="submit" class="header-main__search-submit" aria-label="Lancer la recherche">
                  ${SEARCH_ICON_SVG}
                </button>
              </div>
            </form>

            <div class="header-main__actions">
              <a href="/pages/cart.html" class="header-main__cart" aria-label="Panier">
                <span class="header-main__cart-icon" aria-hidden="true">${CART_ICON_SVG}</span>
                <span class="header-main__cart-label">Panier</span>
                <span id="cart-count-pill" class="header-cart-count" aria-live="polite"></span>
              </a>
            </div>
          </div>

          <form class="header-main__search header-main__search--mobile" role="search" action="/pages/category.html" method="get">
            <label class="sr-only" for="site-search-input-mobile">Rechercher un produit</label>
            <div class="header-main__search-field">
              <input
                id="site-search-input-mobile"
                class="header-main__search-input"
                type="search"
                name="q"
                placeholder="Rechercher un matelas, un sommier ou une marque…"
                minlength="2"
              />
              <button type="submit" class="header-main__search-submit" aria-label="Lancer la recherche">
                ${SEARCH_ICON_SVG}
              </button>
            </div>
          </form>
        </div>

        <nav class="nav-primary" aria-label="Navigation catalogue">
          <div class="nav-primary__inner">
            <div class="nav-primary__menu menu" id="nav-menu">
              <ul class="menu-inner">${mainNav}</ul>
            </div>
            <button
              type="button"
              class="burger nav-primary__burger"
              id="nav-burger"
              aria-label="Ouvrir le menu"
              aria-expanded="false"
              aria-controls="nav-menu"
            >
              <span class="burger-line"></span>
              <span class="burger-line"></span>
            </button>
          </div>
        </nav>
      </div>
    `;

    const currentSearchValue = currentUrl.searchParams.get("q") || "";
    headerEl.querySelectorAll(".header-main__search-input").forEach((input) => {
      input.value = currentSearchValue;
    });

    initSiteEnvelope(headerEl);
    initEnvelopeOffset(headerEl);
  }

  if (footerEl) {
    footerEl.innerHTML = renderFooterHtml();
  }
}

/* PAGE ACCUEIL */

export async function initHomePage() {
  initHeroSlider();
  initBrandCarousel();
}

async function renderHomeMainCategories() {
  const container = document.getElementById("home-main-categories");
  if (!container) return;
  const categories = await getMainCategories();
  // Limiter à 3 catégories pour le triptyque
  const mainCategories = categories.slice(0, 3);
  container.innerHTML = mainCategories
    .map(
      (cat) => `
      <a href="/pages/category.html?slug=${encodeURIComponent(
        cat.slug
      )}" class="category-panel">
        <div class="category-panel-background">
          <img src="${getCategoryImageUrl(cat)}" alt="${cat.name}" />
          <div class="category-panel-overlay"></div>
        </div>
        <div class="category-panel-content">
          <p class="category-panel-kicker">Sélection</p>
          <h2 class="category-panel-title">${cat.name}</h2>
          ${cat.description ? `<p class="category-panel-copy">${cat.description}</p>` : ""}
          <span class="category-panel-button">Découvrir</span>
        </div>
      </a>
    `
    )
    .join("");
}

async function renderHomeBrandsRow() {
  const container = document.getElementById("home-brands-row");
  if (!container) return;
  const brands = await getBrands();
  container.innerHTML = brands
    .map(
      (brand) => `
      <a href="/pages/brand.html?slug=${encodeURIComponent(
        brand.slug
      )}" class="brand-card">
        <div class="brand-card-image">
          <img src="${brand.logo || getBrandImageUrl(brand)}" alt="${brand.name} logo" />
        </div>
        <div class="brand-card-content">
          <h3 class="brand-card-name">${brand.name}</h3>
          ${brand.country ? `<p class="brand-card-country">${brand.country}</p>` : ""}
        </div>
      </a>
    `
    )
    .join("");
}

async function renderHomeBrandsSlider() {
  const container = document.getElementById("home-brands-slider");
  if (!container) return;

  const brands = await getBrands();
  container.innerHTML = `
    <button type="button" class="brands-slider-arrow" data-direction="prev" aria-label="Marques précédentes">
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M14.5 6 8.5 12l6 6" />
      </svg>
    </button>
    <div class="brands-slider-viewport" id="brands-slider-viewport">
      <div class="brands-slider-track">
        ${brands
          .map(
            (brand) => `
              <a href="/pages/brand.html?slug=${encodeURIComponent(
                brand.slug
              )}" class="brands-slider-item" aria-label="Voir la marque ${brand.name}">
                <img src="${brand.logo || getBrandImageUrl(brand)}" alt="${brand.name}" />
              </a>
            `
          )
          .join("")}
      </div>
    </div>
    <button type="button" class="brands-slider-arrow" data-direction="next" aria-label="Marques suivantes">
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="m9.5 6 6 6-6 6" />
      </svg>
    </button>
  `;

  const viewport = container.querySelector(".brands-slider-viewport");
  const prevButton = container.querySelector('[data-direction="prev"]');
  const nextButton = container.querySelector('[data-direction="next"]');
  if (!viewport || !prevButton || !nextButton) return;

  const updateButtons = () => {
    const maxScroll = viewport.scrollWidth - viewport.clientWidth;
    prevButton.disabled = viewport.scrollLeft <= 4;
    nextButton.disabled = viewport.scrollLeft >= maxScroll - 4;
  };

  const scrollByAmount = (direction) => {
    const amount = Math.max(viewport.clientWidth * 0.72, 220) * direction;
    viewport.scrollBy({ left: amount, behavior: "smooth" });
  };

  prevButton.addEventListener("click", () => scrollByAmount(-1));
  nextButton.addEventListener("click", () => scrollByAmount(1));
  viewport.addEventListener("scroll", updateButtons, { passive: true });
  window.addEventListener("resize", updateButtons);
  updateButtons();
}

async function renderHomeLiquidation() {
  const container = document.getElementById("home-liquidation-grid");
  if (!container) return;
  const products = await getLiquidationProducts();
  const brands = await getBrands();
  // Limiter à 4 produits pour le style liquidations
  const bestsellers = products.slice(0, 4);
  container.innerHTML = bestsellers
    .map((product) => {
      const currentPrice = getProductMinimumPrice(product);
      const comparePrice = getProductComparePrice(product);
      const hasSale = productHasPromotion(product);
      const productImage = product.images && product.images.length 
        ? getProductImageUrl(product, product.images[0])
        : getProductImageUrl(product, null);
      const brand = brands.find((b) => b.id === product.brandId);
      const discountPercent = getProductDiscountPercent(product);
      return `
        <a href="/pages/product.html?slug=${encodeURIComponent(
          product.slug
        )}" class="bestseller-card">
          <div class="bestseller-card-image">
            <img src="${productImage}" alt="${product.name}" />
            ${hasSale ? `<span class="bestseller-badge">-${discountPercent}%</span>` : ""}
          </div>
          <div class="bestseller-card-content">
            ${brand ? `<div class="bestseller-brand">${brand.name}</div>` : ""}
            <h3 class="bestseller-title">${product.name}</h3>
            ${
              product.shortDescription
                ? `<p class="bestseller-caption">${product.shortDescription}</p>`
                : ""
            }
            <div class="bestseller-price">
              ${
                hasSale
                  ? `
                      <span class="bestseller-price-new">${formatPriceCHF(currentPrice)}</span>
                      <span class="bestseller-price-old">${formatPriceCHF(comparePrice)}</span>
                    `
                  : `<span class="bestseller-price-new">${formatPriceCHF(currentPrice)}</span>`
              }
            </div>
            <span class="bestseller-link">Voir le produit</span>
          </div>
        </a>
      `;
    })
    .join("");
}

/* PAGE CATÉGORIE ARCHIVE */

const CATEGORY_PAGE_CONTENT = {
  matelas: {
    title: "Matelas",
    intro:
      "Découvrez notre sélection de matelas conçus pour offrir un soutien précis, un accueil confortable et des finitions adaptées à chaque dormeur. Comparez facilement les marques, tailles, niveaux de dureté et types de housse pour trouver le modèle idéal.",
    emptyState:
      "Aucun matelas ne correspond aux filtres sélectionnés pour le moment."
  },
  sommier: {
    title: "Sommiers",
    intro:
      "Explorez notre sélection de sommiers fixes et électriques pensés pour compléter parfaitement votre matelas. Filtrez par marque, dimensions et technologie pour trouver le support le plus adapté à votre confort.",
    emptyState:
      "Aucun sommier ne correspond aux filtres sélectionnés pour le moment."
  },
  literie: {
    title: "Literie",
    intro:
      "Retrouvez notre sélection de literie pour améliorer chaque détail de votre sommeil: oreillers, duvets et surmatelas. Affinez facilement par type, marque et dimensions pour composer un ensemble parfaitement adapté.",
    emptyState:
      "Aucun article de literie ne correspond aux filtres sélectionnés pour le moment."
  },
  liquidation: {
    title: "Offres spéciales",
    intro:
      "Découvrez nos offres spéciales et produits en liquidation: modèles d'exposition, fins de série et dernières pièces disponibles à prix réduits. Une sélection idéale pour profiter de belles conditions sur des produits de qualité.",
    emptyState:
      "Aucune offre spéciale ne correspond aux filtres sélectionnés pour le moment."
  }
};

const FIRMNESS_LABELS = {
  soft: "Souple",
  medium: "Medium",
  firm: "Ferme",
  "extra-firm": "Très ferme"
};

function getProductComparePrice(product, currentPrice = getProductMinimumPrice(product)) {
  if (typeof product.compareAtPrice === "number") {
    if (product.type === "variable") {
      const basePrice = getProductMinimumPrice(product);
      if (basePrice > 0 && currentPrice > 0) {
        return Math.round((currentPrice * product.compareAtPrice) / basePrice / 10) * 10;
      }
    }

    return product.compareAtPrice;
  }

  if (typeof product.salePrice === "number" && typeof product.price === "number") {
    return product.price;
  }

  return null;
}

function getCategoryPageCopy(category) {
  return (
    CATEGORY_PAGE_CONTENT[category.slug] || {
      title: category.name,
      intro:
        category.description ||
        "Découvrez notre sélection de produits disponibles dans cette catégorie.",
      emptyState:
        "Aucun produit ne correspond aux filtres sélectionnés pour le moment."
    }
  );
}

function getProductMinimumPrice(product) {
  if (product.type === "variable" && product.variations?.length) {
    return Math.min(
      ...product.variations
        .map((variation) => variation.price)
        .filter((price) => typeof price === "number")
    );
  }

  return product.salePrice || product.price || product.basePrice || 0;
}

function productHasPromotion(product, currentPrice = getProductMinimumPrice(product)) {
  const comparePrice = getProductComparePrice(product, currentPrice);

  return typeof comparePrice === "number" && comparePrice > currentPrice;
}

function getProductDiscountPercent(product, currentPrice = getProductMinimumPrice(product)) {
  const comparePrice = getProductComparePrice(product, currentPrice);

  if (typeof comparePrice !== "number" || comparePrice <= currentPrice || comparePrice <= 0) {
    return 0;
  }

  return Math.round((1 - currentPrice / comparePrice) * 100);
}

function getProductSizes(product) {
  if (product.variations?.length) {
    return [...new Set(product.variations.map((variation) => variation.size).filter(Boolean))];
  }

  return product.size ? [product.size] : [];
}

function getProductFirmnessValues(product) {
  if (product.variations?.length) {
    return [
      ...new Set(product.variations.map((variation) => variation.firmness).filter(Boolean))
    ];
  }

  return product.firmness ? [product.firmness] : [];
}

function getProductCoverValues(product) {
  if (product.variations?.length) {
    const variationCoverValues = product.variations
      .map((variation) => variation.cover)
      .filter(Boolean);

    if (variationCoverValues.length) {
      return [...new Set(variationCoverValues)];
    }
  }

  return product.cover ? [product.cover] : [];
}

function getProductTechnologyValues(product) {
  return product.technology ? [product.technology] : [];
}

function getProductSubcategoryValue(product, categoriesById) {
  if (product.subcategoryId) {
    return product.subcategoryId;
  }

  const category = categoriesById.get(product.categoryId);
  return category?.parentId ? category.id : product.categoryId;
}

function formatTechnologyLabel(value) {
  return value;
}

function getCategoryProductsForListing(category, allCategories, products) {
  if (category.slug === "liquidation") {
    return products.filter((product) => product.liquidation === true);
  }

  const childCategoryIds = allCategories
    .filter((item) => item.parentId === category.id)
    .map((item) => item.id);
  const effectiveCategoryIds = [category.id, ...childCategoryIds];

  return products.filter((product) => effectiveCategoryIds.includes(product.categoryId));
}

function formatFirmnessLabel(value) {
  return FIRMNESS_LABELS[value] || value;
}

function formatSizeLabel(value) {
  return value.replace("x", " × ");
}

function sortSizes(values) {
  return [...values].sort((a, b) => {
    const isNumericSize = (value) => /^\d+x\d+$/i.test(value);

    if (isNumericSize(a) && isNumericSize(b)) {
      const [aWidth = 0, aLength = 0] = a.split("x").map(Number);
      const [bWidth = 0, bLength = 0] = b.split("x").map(Number);

      if (aWidth !== bWidth) return aWidth - bWidth;
      return aLength - bLength;
    }

    if (isNumericSize(a)) return 1;
    if (isNumericSize(b)) return -1;

    return a.localeCompare(b, "fr");
  });
}

function getProductDisplayBadges(product, limit = 2) {
  return Array.isArray(product.badges) ? product.badges.slice(0, limit) : [];
}

function getProductCardHighlights(product) {
  const highlights = [];
  const sizes = getProductSizes(product);
  const firmnessValues = getProductFirmnessValues(product);
  const technologyValues = getProductTechnologyValues(product);

  if (sizes.length) {
    highlights.push(
      sizes.length > 1 ? `${sizes.length} dimensions` : formatSizeLabel(sizes[0])
    );
  }

  if (firmnessValues.length) {
    highlights.push(`Confort ${formatFirmnessLabel(firmnessValues[0]).toLowerCase()}`);
  } else if (technologyValues.length) {
    highlights.push(formatTechnologyLabel(technologyValues[0]));
  } else if (product.cover) {
    highlights.push(product.cover);
  }

  return highlights.slice(0, 2);
}

function renderCategoryFilterSelect({
  key,
  label,
  placeholder,
  options,
  value = "",
  formatLabel = (option) => option.label || option
}) {
  const normalizedOptions = options.map((option) =>
    typeof option === "string" ? { value: option, label: option } : option
  );

  return `
    <div class="category-filters-group">
      <div class="category-filter-control">
        <select class="category-filter-select" data-filter-key="${key}" aria-label="${label}">
          <option value="">${placeholder || label}</option>
          ${normalizedOptions
            .map(
              (option) =>
                `<option value="${option.value}"${
                  option.value === value ? " selected" : ""
                }>${formatLabel(option)}</option>`
            )
            .join("")}
        </select>
        <span class="category-filter-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24">
            <path d="m6 9 6 6 6-6" />
          </svg>
        </span>
      </div>
    </div>
  `;
}

function renderCategoryPriceFilter({ minValue = "", maxValue = "" }) {
  return `
    <div class="category-filters-group category-price-filter" data-price-filter>
      <button
        type="button"
        class="category-price-trigger"
        aria-expanded="false"
        aria-haspopup="true"
      >
        <span>Prix</span>
        <span class="category-filter-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24">
            <path d="m6 9 6 6 6-6" />
          </svg>
        </span>
      </button>

      <div class="category-price-popover" hidden>
        <div class="category-price-inputs">
          <label class="category-price-field">
            <span class="category-price-label">Minimal</span>
            <span class="category-price-input-shell">
              <input
                type="number"
                min="0"
                inputmode="numeric"
                class="category-price-input"
                data-filter-key="priceMin"
                value="${minValue}"
                placeholder=""
              />
              <span class="category-price-currency">Fr</span>
            </span>
          </label>

          <span class="category-price-separator" aria-hidden="true">-</span>

          <label class="category-price-field">
            <span class="category-price-label">Maximal</span>
            <span class="category-price-input-shell">
              <input
                type="number"
                min="0"
                inputmode="numeric"
                class="category-price-input"
                data-filter-key="priceMax"
                value="${maxValue}"
                placeholder=""
              />
              <span class="category-price-currency">Fr</span>
            </span>
          </label>
        </div>
      </div>
    </div>
  `;
}

function renderCategorySortSelect(value = "") {
  return `
    <div class="category-sort-control">
      <div class="category-filter-control">
        <select class="category-filter-select category-sort-select" id="category-sort-select" aria-label="Trier les produits">
          <option value=""${value === "" ? " selected" : ""}>Trier par</option>
          <option value="alphabetical"${value === "alphabetical" ? " selected" : ""}>Nom du produit</option>
          <option value="price-asc"${value === "price-asc" ? " selected" : ""}>Prix croissant</option>
          <option value="price-desc"${value === "price-desc" ? " selected" : ""}>Prix décroissant</option>
        </select>
        <span class="category-filter-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24">
            <path d="m6 9 6 6 6-6" />
          </svg>
        </span>
      </div>
    </div>
  `;
}

function renderCategoryProductCard(product) {
  const productUrl = `/pages/product.html?slug=${encodeURIComponent(product.slug)}`;
  const productImage =
    product.images && product.images.length
      ? getProductImageUrl(product, product.images[0])
      : getProductImageUrl(product, null);
  const currentPrice = getProductMinimumPrice(product);
  const comparePrice = getProductComparePrice(product);
  const hasSale = productHasPromotion(product);
  const discountPercent = getProductDiscountPercent(product);
  const stock = getProductListingStockLabel(product);
  const rating = getProductListingRating(product);

  return `
    <article class="category-product-card">
      <a href="${productUrl}" class="category-product-link">
        <div class="category-product-media">
          ${hasSale ? renderCategoryProductSaleBadges(discountPercent) : ""}
          <img
            src="${productImage}"
            alt="${product.name}"
            loading="lazy"
            onerror="this.src='${getProductImageUrl(product, null)}'"
          />
        </div>
        <div class="category-product-body">
          <h2 class="category-product-loop-title">${product.name}</h2>
          <div class="category-product-pricing">
            <span class="category-product-price-current">${formatPriceCHF(currentPrice)}</span>
            ${
              hasSale
                ? `<span class="category-product-price-old">${formatPriceCHF(comparePrice)}</span>`
                : ""
            }
          </div>
          <div class="category-product-meta">
            ${renderProductStarRating(rating)}
            <div class="category-product-footer">
              <span class="category-product-stock category-product-stock--${stock.modifier}">
                <span class="category-product-stock-icon" aria-hidden="true">✓</span>
                ${stock.label}
              </span>
            </div>
          </div>
        </div>
      </a>
    </article>
  `;
}

export async function initCategoryPage() {
  const { slug, q } = parseQueryParams();
  const searchTerm = (q || "").trim().toLowerCase();

  const titleEl = document.getElementById("category-title");
  const descriptionEl = document.getElementById("category-description");
  const breadcrumbEl = document.getElementById("category-breadcrumb-current");
  const filtersEl = document.getElementById("category-filters");
  const activeFiltersEl = document.getElementById("category-active-filters");
  const sortControlsEl = document.getElementById("category-sort-controls");
  const clearFiltersEl = document.getElementById("category-clear-filters");
  const gridEl = document.getElementById("category-products-grid");
  if (!titleEl || !descriptionEl || !breadcrumbEl || !filtersEl || !sortControlsEl || !gridEl) return;

  if (searchTerm) {
    const controlsEl = document.querySelector(".category-archive-controls");
    if (controlsEl) {
      controlsEl.hidden = true;
    }

    const [products, brands, categories] = await Promise.all([
      getProducts(),
      getBrands(),
      getCategories()
    ]);
    const results = filterProductsBySearchTerm(products, brands, categories, searchTerm);

    titleEl.textContent = `Resultats pour "${q}"`;
    descriptionEl.textContent = results.length
      ? `${results.length} produit${results.length > 1 ? "s" : ""} correspondant a votre recherche.`
      : "Aucun produit ne correspond a votre recherche pour le moment.";
    breadcrumbEl.textContent = "Recherche";
    document.title = "Recherche | Richard La Literie";

    if (!results.length) {
      gridEl.innerHTML =
        `<div class="category-products-empty">Aucun resultat. Essayez un autre mot-cle comme "matelas", "sommier" ou le nom d'une marque.</div>`;
      return;
    }

    gridEl.innerHTML = results.map((product) => renderCategoryProductCard(product)).join("");
    return;
  }

  if (!slug) return;

  const [category, allCategories, products, brands] = await Promise.all([
    getCategoryBySlug(slug),
    getCategories(),
    getProducts(),
    getBrands()
  ]);
  if (!category) return;

  const pageCopy = getCategoryPageCopy(category);
  const categoriesById = new Map(allCategories.map((item) => [item.id, item]));
  const categoryProducts = getCategoryProductsForListing(category, allCategories, products);
  const brandOptions = brands.filter((brand) =>
    categoryProducts.some((product) => product.brandId === brand.id)
  );
  const sizeOptions = sortSizes(
    [...new Set(categoryProducts.flatMap((product) => getProductSizes(product)))]
  );
  const firmnessOptions = [
    ...new Set(categoryProducts.flatMap((product) => getProductFirmnessValues(product)))
  ];
  const coverOptions = [
    ...new Set(categoryProducts.flatMap((product) => getProductCoverValues(product)))
  ];
  const technologyOptions = [
    ...new Set(categoryProducts.flatMap((product) => getProductTechnologyValues(product)))
  ];
  const subcategoryOptions = [
    ...new Set(
      categoryProducts
        .map((product) => getProductSubcategoryValue(product, categoriesById))
        .filter(Boolean)
    )
  ].map((value) => ({
    value,
    label: categoriesById.get(value)?.name || value
  }));
  const state = {
    brand: "",
    size: "",
    firmness: "",
    cover: "",
    technology: "",
    subcategory: "",
    priceMin: "",
    priceMax: "",
    sort: ""
  };
  const categoryFilterKeys = {
    matelas: ["brand", "size", "firmness", "cover", "price"],
    sommier: ["brand", "size", "technology", "price"],
    literie: ["brand", "subcategory", "size", "price"],
    liquidation: ["brand", "subcategory", "price"]
  };
  const enabledFilterKeys = categoryFilterKeys[category.slug] || ["brand", "price"];
  const filterDefinitions = [
    {
      key: "brand",
      label: "Marque",
      placeholder: "Marque",
      options: brandOptions.map((brand) => ({ value: brand.id, label: brand.name }))
    },
    {
      key: "size",
      label: "Taille",
      placeholder: "Taille",
      options: sizeOptions,
      formatLabel: (option) => formatSizeLabel(option.label || option.value || option)
    },
    {
      key: "firmness",
      label: "Dureté",
      placeholder: "Dureté",
      options: firmnessOptions,
      formatLabel: (option) => formatFirmnessLabel(option.label || option.value || option)
    },
    {
      key: "cover",
      label: "Housse",
      placeholder: "Housse",
      options: coverOptions
    },
    {
      key: "technology",
      label: "Technologie",
      placeholder: "Technologie",
      options: technologyOptions,
      formatLabel: (option) => formatTechnologyLabel(option.label || option.value || option)
    },
    {
      key: "subcategory",
      label: "Type",
      placeholder: "Type",
      options: subcategoryOptions
    }
  ].filter(
    (definition) => enabledFilterKeys.includes(definition.key) && definition.options.length
  );

  titleEl.textContent = pageCopy.title;
  descriptionEl.textContent = pageCopy.intro;
  breadcrumbEl.textContent = pageCopy.title;
  document.title = `${pageCopy.title} | Richard La Literie`;

  filtersEl.innerHTML = [
    ...filterDefinitions.map((definition) =>
      renderCategoryFilterSelect({
        ...definition,
        value: state[definition.key]
      })
    ),
    renderCategoryPriceFilter({
      minValue: state.priceMin,
      maxValue: state.priceMax
    })
  ].join("");
  sortControlsEl.innerHTML = renderCategorySortSelect(state.sort);

  const getFilterDisplayValue = (definition, value) => {
    const option = definition.options.find((item) => item.value === value || item.label === value);
    if (!option) return value;
    return definition.formatLabel ? definition.formatLabel(option) : option.label;
  };

  function syncFilterFieldValues() {
    filtersEl.querySelectorAll("[data-filter-key]").forEach((field) => {
      field.value = state[field.dataset.filterKey] || "";
    });
  }

  function renderActiveFilters() {
    if (!activeFiltersEl) return;

    const activeFilters = filterDefinitions
      .filter((definition) => state[definition.key])
      .map((definition) => ({
        key: definition.key,
        label: `${definition.label} : ${getFilterDisplayValue(definition, state[definition.key])}`
      }));

    if (state.priceMin !== "" || state.priceMax !== "") {
      const priceLabel = [
        state.priceMin !== "" ? `dès ${state.priceMin} CHF` : "",
        state.priceMax !== "" ? `jusqu’à ${state.priceMax} CHF` : ""
      ]
        .filter(Boolean)
        .join(" · ");

      activeFilters.push({
        key: "price",
        label: `Prix : ${priceLabel}`
      });
    }

    if (!activeFilters.length) {
      activeFiltersEl.hidden = true;
      activeFiltersEl.innerHTML = "";
      return;
    }

    activeFiltersEl.hidden = false;
    activeFiltersEl.innerHTML = `
      <div class="category-active-filters-list">
        ${activeFilters
          .map(
            (filter) => `
              <button type="button" class="category-active-filter" data-clear-filter="${filter.key}">
                <span>${filter.label}</span>
                <span aria-hidden="true">×</span>
              </button>
            `
          )
          .join("")}
      </div>
      <button type="button" class="category-clear-all" data-clear-all-filters>
        Effacer les filtres
      </button>
    `;

    activeFiltersEl.querySelectorAll("[data-clear-filter]").forEach((button) => {
      button.addEventListener("click", () => {
        const filterKey = button.dataset.clearFilter;
        if (filterKey === "price") {
          state.priceMin = "";
          state.priceMax = "";
        } else {
          state[filterKey] = "";
        }
        syncFilterFieldValues();
        applyFiltersAndRender();
        syncPriceFilterState();
      });
    });

    activeFiltersEl.querySelector("[data-clear-all-filters]")?.addEventListener("click", () => {
      resetAllFilters();
    });
  }

  function resetAllFilters() {
    filterDefinitions.forEach((definition) => {
      state[definition.key] = "";
    });
    state.priceMin = "";
    state.priceMax = "";
    state.sort = "";
    syncFilterFieldValues();

    const sortSelect = document.getElementById("category-sort-select");
    if (sortSelect) {
      sortSelect.value = "";
    }

    applyFiltersAndRender();
    syncPriceFilterState();
  }

  function applyFiltersAndRender() {
    let filtered = categoryProducts.filter((product) => {
      if (state.brand && product.brandId !== state.brand) return false;
      if (state.size && !getProductSizes(product).includes(state.size)) return false;
      if (state.firmness && !getProductFirmnessValues(product).includes(state.firmness)) {
        return false;
      }
      if (state.cover && !getProductCoverValues(product).includes(state.cover)) return false;
      if (state.technology && !getProductTechnologyValues(product).includes(state.technology)) {
        return false;
      }
      if (
        state.subcategory &&
        getProductSubcategoryValue(product, categoriesById) !== state.subcategory
      ) {
        return false;
      }
      const price = getProductMinimumPrice(product);
      if (state.priceMin !== "" && price < Number(state.priceMin)) return false;
      if (state.priceMax !== "" && price > Number(state.priceMax)) return false;

      return true;
    });

    if (state.sort === "alphabetical") {
      filtered = [...filtered].sort((a, b) => a.name.localeCompare(b.name, "fr"));
    } else if (state.sort === "price-asc") {
      filtered = [...filtered].sort(
        (a, b) => getProductMinimumPrice(a) - getProductMinimumPrice(b)
      );
    } else if (state.sort === "price-desc") {
      filtered = [...filtered].sort(
        (a, b) => getProductMinimumPrice(b) - getProductMinimumPrice(a)
      );
    }

    renderActiveFilters();

    if (!filtered.length) {
      gridEl.innerHTML =
        `<div class="category-products-empty">${pageCopy.emptyState}</div>`;
      return;
    }

    gridEl.innerHTML = filtered
      .map((product, index) => {
        return renderCategoryProductCard(product);
      })
      .join("");
  }

  filtersEl.querySelectorAll("[data-filter-key]").forEach((field) => {
    const isPriceInput = field.classList.contains("category-price-input");
    const eventName = isPriceInput ? "input" : "change";

    field.addEventListener(eventName, () => {
      state[field.dataset.filterKey] = field.value || "";
      applyFiltersAndRender();
      syncPriceFilterState();
    });
  });

  const sortSelectEl = document.getElementById("category-sort-select");
  if (sortSelectEl) {
    sortSelectEl.addEventListener("change", () => {
      state.sort = sortSelectEl.value;
      applyFiltersAndRender();
    });
  }

  clearFiltersEl?.addEventListener("click", () => {
    resetAllFilters();
  });

  const priceFilterEl = filtersEl.querySelector("[data-price-filter]");
  const priceTriggerEl = priceFilterEl?.querySelector(".category-price-trigger");
  const pricePopoverEl = priceFilterEl?.querySelector(".category-price-popover");

  function syncPriceFilterState() {
    if (!priceFilterEl || !priceTriggerEl || !pricePopoverEl) return;
    const hasPriceValue = state.priceMin !== "" || state.priceMax !== "";
    const isOpen = !pricePopoverEl.hidden;

    priceFilterEl.classList.toggle("is-active", hasPriceValue || isOpen);
    priceTriggerEl.setAttribute("aria-expanded", isOpen ? "true" : "false");
  }

  function closePricePopover() {
    if (!pricePopoverEl) return;
    pricePopoverEl.hidden = true;
    syncPriceFilterState();
  }

  if (priceFilterEl && priceTriggerEl && pricePopoverEl) {
    priceTriggerEl.addEventListener("click", (event) => {
      event.stopPropagation();
      pricePopoverEl.hidden = !pricePopoverEl.hidden;
      syncPriceFilterState();
    });

    pricePopoverEl.addEventListener("click", (event) => {
      event.stopPropagation();
    });

    document.addEventListener("click", (event) => {
      if (!priceFilterEl.contains(event.target)) {
        closePricePopover();
      }
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        closePricePopover();
      }
    });
  }

  syncPriceFilterState();
  applyFiltersAndRender();
}

/* PAGE MARQUES (LISTE) */

export async function initBrandsPage() {
  const grid = document.getElementById("brands-grid");
  if (!grid) return;
  const brands = await getBrands();
  const displayBrands = [...brands];
  const demoBrands = [
    {
      id: "huesler-nest",
      name: "Hüsler Nest",
      slug: "huesler-nest",
      country: "Suisse",
      description: "Literie naturelle avec matériaux respirants et soutien ergonomique.",
      logo: "/assets/icons/brand-roviva.png"
    },
    {
      id: "lattoflex",
      name: "Lattoflex",
      slug: "lattoflex",
      country: "Allemagne",
      description: "Systèmes de couchage orientés confort dynamique et alignement du dos.",
      logo: "/assets/icons/brand-roviva.png"
    }
  ];

  demoBrands.forEach((demo) => {
    if (!displayBrands.some((brand) => brand.id === demo.id) && displayBrands.length < 8) {
      displayBrands.push(demo);
    }
  });

  grid.innerHTML = displayBrands
    .map(
      (brand) => `
      <a href="/pages/brand.html?slug=${encodeURIComponent(brand.slug)}" class="brand-card">
        <div class="brand-card-image">
          <img src="${brand.logo || getBrandImageUrl(brand)}" alt="${brand.name}" />
        </div>
        <div class="brand-card-content">
          <h2 class="brand-card-name">${brand.name}</h2>
          <p class="brand-card-country">${brand.country || "Suisse"}</p>
          <p class="brand-card-description">${brand.description || ""}</p>
        </div>
      </a>
    `
    )
    .join("");
}

/* PAGE MARQUE DÉTAILLÉE */

export async function initBrandPage() {
  const { slug } = parseQueryParams();
  if (!slug) return;

  const titleEl = document.getElementById("brand-title");
  const descriptionEl = document.getElementById("brand-description");
  const metaEl = document.getElementById("brand-meta");
  const gridEl = document.getElementById("brand-products-grid");
  if (!titleEl || !descriptionEl || !metaEl || !gridEl) return;

  const [brand, products] = await Promise.all([
    getBrandBySlug(slug),
    getProducts()
  ]);
  if (!brand) return;

  titleEl.textContent = brand.name;
  descriptionEl.textContent =
    brand.description || "Marque partenaire de Richard SA.";

  metaEl.innerHTML = brand.website
    ? `<span>Origine : ${brand.country || "—"} · Site : <a href="${
        brand.website
      }" target="_blank" rel="noreferrer">${brand.website}</a></span>`
    : `<span>Origine : ${brand.country || "—"}</span>`;

  const filtered = products.filter((p) => p.brandId === brand.id);
  if (!filtered.length) {
    gridEl.innerHTML =
      '<div class="category-products-empty">Aucun produit associé à cette marque pour le moment.</div>';
    return;
  }

  gridEl.innerHTML = filtered
    .map((product) => {
      const currentPrice = getProductMinimumPrice(product);
      const comparePrice = getProductComparePrice(product);
      const hasSale = productHasPromotion(product);
      const productImage = product.images && product.images.length 
        ? getProductImageUrl(product, product.images[0])
        : getProductImageUrl(product, null);
      return `
        <a href="/pages/product.html?slug=${encodeURIComponent(
          product.slug
        )}" class="card card-clickable">
          <div class="card-image">
            <img src="${productImage}" alt="${product.name}" />
            ${hasSale ? `<span class="product-badge-sale">-${getProductDiscountPercent(product)}%</span>` : ""}
          </div>
          <div class="card-content">
            <div class="card-meta">Produit</div>
            <h3 class="card-title">${product.name}</h3>
            <p class="card-description">${product.shortDescription || ""}</p>
            <div class="card-price">
              ${
                hasSale
                  ? `
                      <span class="price price-old">${formatPriceCHF(comparePrice)}</span>
                      <span class="price price-new">${formatPriceCHF(currentPrice)}</span>
                    `
                  : `<span class="price">${formatPriceCHF(currentPrice)}</span>`
              }
            </div>
          </div>
        </a>
      `;
    })
    .join("");
}

/* PAGE PRODUIT DÉTAILLÉE */

/* Ordre debrief : Taille → Dureté → Housse (puis finition / technologie si présents) */
const PRODUCT_OPTION_ORDER = ["size", "firmness", "cover", "finish", "technology"];

/** Taille par défaut affichée / sélectionnée sur la fiche produit */
const DEFAULT_PRODUCT_SIZE = "90x200";

const DEFAULT_MATTRESS_COVER_CHIP_VALUES = [
  "Housse amovible et lavable",
  "Thermorégulée"
];

/**
 * Valeurs housse affichées en chips — priorité données explicites, sinon matelas variable.
 */
export function getProductCoverChipValues(product) {
  if (Array.isArray(product?.coverOptions) && product.coverOptions.length) {
    return product.coverOptions;
  }

  const variationCovers = [
    ...new Set((product?.variations || []).map((variation) => variation.cover).filter(Boolean))
  ];

  if (variationCovers.length >= 2) {
    return variationCovers;
  }

  if (product?.categoryId === "matelas" && product?.type === "variable") {
    return DEFAULT_MATTRESS_COVER_CHIP_VALUES;
  }

  return variationCovers;
}

const PRODUCT_OPTION_META = {
  firmness: {
    control: "chips",
    label: "Dureté",
    formatLabel: (value) => formatFirmnessLabel(value)
  },
  size: {
    control: "select",
    label: "Taille",
    formatLabel: (value) => formatSizeLabel(value)
  },
  cover: {
    control: "chips",
    label: "Housse",
    formatLabel: (value) => value
  },
  finish: {
    control: "chips",
    label: "Finition",
    formatLabel: (value) => value
  },
  technology: {
    control: "chips",
    label: "Technologie",
    formatLabel: (value) => formatTechnologyLabel(value)
  }
};

const MATTRESS_GALLERY_IMAGES = [
  "/assets/images/products/roviva/vestmarka.jpg",
  "/assets/images/products/roviva/akrehamn.jpg",
  "/assets/images/products/roviva/haugesund.jpg",
  "/assets/images/products/roviva/morgedal.jpg",
  "/assets/images/products/roviva/matrand.jpg",
  "/assets/images/products/roviva/anneland.jpg",
  "/assets/images/products/roviva/valevag.jpg"
];

const PRODUCT_GALLERY_FALLBACKS = {
  bedding: MATTRESS_GALLERY_IMAGES,
  decor: [
    "/assets/images/products/minimal-4369856_1920.jpg",
    "/assets/images/products/bedroom-6778193_1920.jpg",
    "/assets/images/products/bed-1839183_1920.jpg"
  ],
  armchair: [
    "/assets/images/products/armchair-8275688_1280.jpg",
    "/assets/images/products/bedroom-6778193_1920.jpg",
    "/assets/images/products/bed-1839183_1920.jpg"
  ],
  mattress: MATTRESS_GALLERY_IMAGES
};

function getProductGalleryFallbackSet(product, category) {
  const categoryId = category?.id || product.categoryId || "";

  if (categoryId === "matelas" || categoryId.startsWith("matelas")) {
    return PRODUCT_GALLERY_FALLBACKS.mattress;
  }

  if (categoryId === "fauteuil-relax" || product.name.toLowerCase().includes("fauteuil")) {
    return PRODUCT_GALLERY_FALLBACKS.armchair;
  }

  if (categoryId.startsWith("literie")) {
    return PRODUCT_GALLERY_FALLBACKS.decor;
  }

  return PRODUCT_GALLERY_FALLBACKS.bedding;
}

function getProductGalleryImages(product, category) {
  const sourceImages = [...(product.images || [])];
  const fallbackImages = getProductGalleryFallbackSet(product, category);
  const galleryImages = [];

  [...sourceImages, ...fallbackImages].forEach((imagePath) => {
    const resolvedImage = getProductImageUrl(product, imagePath);
    if (!galleryImages.includes(resolvedImage)) {
      galleryImages.push(resolvedImage);
    }
  });

  if (!galleryImages.length) {
    galleryImages.push(getProductImageUrl(product, null));
  }

  return galleryImages.slice(0, 5);
}

function getProductOptionDefinitions(product, category) {
  return PRODUCT_OPTION_ORDER.map((key) => {
    const variationValues = [
      ...new Set(
        (product.variations || []).map((variation) => variation[key]).filter(Boolean)
      )
    ];
    const values =
      key === "cover"
        ? getProductCoverChipValues(product)
        : variationValues.length
          ? variationValues
          : product[key]
            ? [product[key]]
            : [];
    if (!values.length) return null;

    const meta = PRODUCT_OPTION_META[key];

    return {
      key,
      label: meta?.label || key,
      control: meta?.control || "chips",
      formatLabel: meta?.formatLabel || ((value) => value),
      values: key === "size" ? sortSizes(values) : values
    };
  }).filter(Boolean);
}

/**
 * Sélection initiale : privilégie la taille 90×200 (debrief), sinon premier stock.
 */
export function getDefaultProductSelection(product) {
  const defaultSelection = {};
  const variations = product.variations || [];
  const defaultVariation =
    variations.find(
      (variation) => variation.size === DEFAULT_PRODUCT_SIZE && variation.inStock !== false
    ) ||
    variations.find((variation) => variation.size === DEFAULT_PRODUCT_SIZE) ||
    variations.find((variation) => variation.inStock) ||
    variations[0] ||
    null;

  PRODUCT_OPTION_ORDER.forEach((key) => {
    defaultSelection[key] = defaultVariation?.[key] || product[key] || "";
  });

  return defaultSelection;
}

function getVariationScore(variation, desiredSelection, priorityKey) {
  if (
    priorityKey &&
    desiredSelection[priorityKey] &&
    variation[priorityKey] !== desiredSelection[priorityKey]
  ) {
    return -1;
  }

  let score = variation.inStock ? 0.25 : 0;

  PRODUCT_OPTION_ORDER.forEach((key) => {
    if (!desiredSelection[key]) return;
    if (variation[key] === desiredSelection[key]) {
      score += key === priorityKey ? 100 : 1;
    }
  });

  return score;
}

function syncSelectionWithVariation(product, desiredSelection, priorityKey = "") {
  if (product.type !== "variable" || !product.variations?.length) {
    return {
      variation: null,
      selectedOptions: desiredSelection
    };
  }

  const variation = [...product.variations]
    .sort(
      (a, b) =>
        getVariationScore(b, desiredSelection, priorityKey) -
        getVariationScore(a, desiredSelection, priorityKey)
    )[0];

  const selectedOptions = { ...desiredSelection };
  PRODUCT_OPTION_ORDER.forEach((key) => {
    selectedOptions[key] = variation?.[key] || selectedOptions[key] || product[key] || "";
  });

  return {
    variation: variation || null,
    selectedOptions
  };
}

/**
 * Valeur du délai de livraison (jours ou semaines selon le produit).
 */
export function getProductDeliveryValue(product, variation) {
  if (product.liquidation) {
    return "Retrait ou livraison rapide selon stock";
  }

  if (variation && variation.inStock === false) {
    return "Délai confirmé après validation de commande";
  }

  if (product.type === "variable") {
    return "3 à 4 semaines";
  }

  return "5 à 10 jours ouvrés";
}

function getCategoryAncestors(category, categoriesById) {
  const ancestors = [];
  let currentCategory = category;

  while (currentCategory) {
    ancestors.unshift(currentCategory);
    currentCategory = currentCategory.parentId
      ? categoriesById.get(currentCategory.parentId)
      : null;
  }

  return ancestors;
}

function getRootCategoryId(category, categoriesById) {
  if (!category) return "";
  let currentCategory = category;

  while (currentCategory.parentId) {
    currentCategory = categoriesById.get(currentCategory.parentId) || currentCategory;
    if (!currentCategory.parentId) break;
  }

  return currentCategory.id;
}

function renderParagraphBlocks(text) {
  if (!text) return "";

  return text
    .split(/\n+/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean)
    .map((paragraph) => `<p>${paragraph}</p>`)
    .join("");
}

function buildProductHighlights(product, category, optionDefinitions, variation) {
  const highlights = [];
  const sizes = optionDefinitions.find((option) => option.key === "size")?.values || [];
  const firmnessValues =
    optionDefinitions.find((option) => option.key === "firmness")?.values || [];

  if (sizes.length) {
    highlights.push(
      `${sizes.length > 1 ? `${sizes.length} dimensions disponibles` : `Dimension : ${formatSizeLabel(sizes[0])}`}`
    );
  }

  if (firmnessValues.length) {
    highlights.push(
      `${firmnessValues.length > 1 ? "Plusieurs conforts disponibles" : `Confort ${formatFirmnessLabel(firmnessValues[0]).toLowerCase()}`}`
    );
  }

  if (variation?.inStock === false) {
    highlights.push("Configuration sur commande");
  } else {
    highlights.push("Conseil et accompagnement en magasin");
  }

  if (category?.name) {
    highlights.push(`Sélection ${category.name.toLowerCase()}`);
  }

  return highlights.slice(0, 4);
}

function renderSpecificationRows(product, brand, category, optionDefinitions, variation) {
  const rows = [
    {
      label: "Dimensions",
      values: optionDefinitions.find((option) => option.key === "size")?.values || []
    },
    {
      label: "Dureté",
      values:
        optionDefinitions.find((option) => option.key === "firmness")?.values.map((value) =>
          formatFirmnessLabel(value)
        ) || []
    },
    {
      label: "Housse",
      values: optionDefinitions.find((option) => option.key === "cover")?.values || []
    },
    {
      label: "Finition",
      values: optionDefinitions.find((option) => option.key === "finish")?.values || []
    },
    {
      label: "Technologie",
      values: optionDefinitions.find((option) => option.key === "technology")?.values || []
    },
    {
      label: "Marque",
      values: brand?.name ? [brand.name] : []
    },
    {
      label: "Categorie",
      values: category?.name ? [category.name] : []
    },
    {
      label: "Pays de production",
      values: brand?.country ? [brand.country] : []
    }
  ].filter((row) => row.values.length);

  return rows
    .map(
      (row) => `
        <div class="product-spec-row">
          <div class="product-spec-label">${row.label}</div>
          <div class="product-spec-value">
            ${
              row.values.length > 1
                ? `<ul class="product-spec-list">${row.values
                    .map((value) => `<li>${row.label === "Dimensions" ? formatSizeLabel(value) : value}</li>`)
                    .join("")}</ul>`
                : `<span>${row.label === "Dimensions" ? formatSizeLabel(row.values[0]) : row.values[0]}</span>`
            }
          </div>
        </div>
      `
    )
    .join("");
}

/** Avis clients mock affichés dans l'accordéon fiche produit */
const PRODUCT_ACCORDION_REVIEWS = [
  {
    author: "Boris76",
    rating: 5,
    title: "Bien adapté pour mon usage",
    text: "Commande en grande taille, confortable et durable au quotidien."
  },
  {
    author: "Julie M.",
    rating: 5,
    title: "Très bon soutien du dos",
    text: "Excellent maintien et très bon confort dès les premières nuits."
  },
  {
    author: "Marc D.",
    rating: 5,
    title: "Qualité au rendez-vous",
    text: "Finitions soignées et accueil chaleureux en magasin à Crissier."
  },
  {
    author: "Sophie L.",
    rating: 4,
    title: "Confort progressif",
    text: "Le matelas se bonifie après quelques nuits, très bon rapport qualité-prix."
  },
  {
    author: "Thomas R.",
    rating: 5,
    title: "Livraison impeccable",
    text: "Équipe ponctuelle et installation rapide, produit conforme à la démo."
  },
  {
    author: "Clara B.",
    rating: 5,
    title: "Conseil personnalisé",
    text: "La recommandation en boutique correspond parfaitement à mes attentes de fermeté."
  }
];

/**
 * Génère la grille d'avis clients pour la section accordéon « Avis ».
 */
export function renderProductReviews(reviews = PRODUCT_ACCORDION_REVIEWS) {
  return `
    <div class="product-reviews">
      ${reviews
        .map(
          (review) => `
            <article class="product-review-card">
              <div class="product-review-author">${review.author}</div>
              <div class="product-review-rating" aria-label="${review.rating} sur 5">
                ${"★".repeat(review.rating)}<span>${review.rating}/5</span>
              </div>
              <p class="product-review-meta">${review.title}</p>
              <p class="product-review-text">${review.text}</p>
            </article>
          `
        )
        .join("")}
    </div>
  `;
}

function renderProductAccordion(product, brand, category, optionDefinitions, variation) {
  const highlights = buildProductHighlights(product, category, optionDefinitions, variation);
  const collapsibleSections = [
    {
      title: "Caractéristiques produit",
      content: `<div class="product-spec-grid">${renderSpecificationRows(
        product,
        brand,
        category,
        optionDefinitions,
        variation
      )}</div>`
    },
    {
      title: "Politique de retour",
      content: `
        <p>Un accompagnement Richard SA est prévu avant, pendant et après l'achat.</p>
        <ul class="checks">
          <li>Conseil personnalisé en magasin ou à distance.</li>
          <li>Accompagnement pour choisir la bonne dimension et la bonne configuration.</li>
          <li>Informations de garantie et de SAV confirmées selon la marque et le modèle.</li>
          <li>Les modalités de retour et d'échange sont précisées au moment de la commande.</li>
        </ul>
      `
    },
    {
      title: "Avis",
      content: renderProductReviews()
    }
  ];

  return `
    <section class="product-accordion accordion" aria-label="Informations produit">
      <div class="product-accordion__description panel">
        <h2 class="product-accordion__title">Description</h2>
        <div class="product-accordion__content">
          ${product.shortDescription ? `<p><strong>${product.shortDescription}</strong></p>` : ""}
          ${renderParagraphBlocks(product.description || "")}
          ${
            highlights.length
              ? `<ul class="checks">${highlights.map((item) => `<li>${item}</li>`).join("")}</ul>`
              : ""
          }
        </div>
      </div>
      ${collapsibleSections
        .map(
          (section, index) => `
            <div class="product-accordion__item">
              <button
                type="button"
                class="product-accordion__trigger panel-row"
                data-accordion-trigger
                aria-expanded="false"
                aria-controls="product-panel-${index}"
              >
                <span class="product-accordion__title">${section.title}</span>
                <span class="product-accordion__icon" aria-hidden="true">+</span>
              </button>
              <div id="product-panel-${index}" class="product-accordion__panel panel" hidden data-accordion-panel>
                <div class="product-accordion__content">
                  ${section.content}
                </div>
              </div>
            </div>
          `
        )
        .join("")}
    </section>
  `;
}

function renderProductOptionField(option, selectedValue) {
  if (option.control === "select") {
    return `
      <div class="product-option-card__control select-row">
        <select
          class="product-option-card__select${selectedValue ? " is-selected" : ""}"
          data-option-key="${option.key}"
        >
          ${option.values
            .map(
              (value) => `
                <option value="${value}"${value === selectedValue ? " selected" : ""}>
                  ${option.formatLabel(value)}
                </option>
              `
            )
            .join("")}
        </select>
      </div>
    `;
  }

  return `
    <div class="product-chips__list chips" role="list">
      ${option.values
        .map(
          (value) => `
            <button
              type="button"
              class="product-chip chip${value === selectedValue ? " is-active active" : ""}"
              data-option-key="${option.key}"
              data-option-value="${value}"
            >
              ${option.formatLabel(value)}
            </button>
          `
        )
        .join("")}
    </div>
  `;
}

/**
 * Grille produits liés — même présentation que l'archive catégorie.
 */
function renderProductRelatedSection(title, products) {
  if (!products.length) return "";

  return `
    <section class="product-related-section category-archive-page" aria-label="${title}">
      <div class="category-page-shell layout-wide product-related-shell">
        <header class="category-archive-header product-related-header">
          <h2>${title}</h2>
        </header>
        <section class="category-products-section category-archive-products">
          <div class="category-products-grid">
            ${products.map((item) => renderCategoryProductCard(item)).join("")}
          </div>
        </section>
      </div>
    </section>
  `;
}

/**
 * Panneaux options panier (livraison / recyclage / garantie).
 * Affichés sur la page panier — sélection possible ici (pas sur la fiche).
 */
export const CART_SERVICE_OPTION_PANELS = {
  delivery: {
    id: "delivery",
    label: "Options de Livraison et Installation",
    icon: "/assets/icons/services/truck.svg",
    rows: [
      ["Livraison standard", "À domicile selon zone géographique"],
      ["Livraison + installation", "Mise en place par nos équipes"],
      ["Retrait en magasin", "Rue des Alpes 2, 1023 Crissier"]
    ]
  },
  recycle: {
    id: "recycle",
    label: "Options de Recyclage",
    icon: "/assets/icons/services/recycle.svg",
    rows: [
      ["Reprise ancienne literie", "Enlèvement lors de la livraison"],
      ["Recyclage responsable", "Filière adaptée selon le produit"],
      ["Sans reprise", "Aucun enlèvement demandé"]
    ]
  },
  warranty: {
    id: "warranty",
    label: "Garantie",
    icon: "/assets/icons/services/warranty.svg",
    rows: [
      ["Garantie fabricant", "Selon marque et modèle"],
      ["Satisfaction Richard", "Accompagnement avant / après achat"],
      ["SAV magasin", "Suivi et conseil à Crissier"]
    ]
  }
};

/**
 * Bloc beige options services — page panier (sélection).
 */
export function renderCartServiceOptionsBlock(selectedOptions = {}) {
  const panels = Object.values(CART_SERVICE_OPTION_PANELS);

  return `
    <section class="cart-service-options" aria-label="Livraison, recyclage et garantie">
      <ul class="cart-service-options__list">
        ${panels
          .map(
            (panel) => `
              <li>
                <button
                  type="button"
                  class="cart-service-options__trigger"
                  data-service-panel="${panel.id}"
                  aria-expanded="false"
                  aria-controls="cart-service-panel-${panel.id}"
                >
                  <img class="cart-service-options__icon" src="${panel.icon}" alt="" width="28" height="28" loading="lazy" decoding="async" aria-hidden="true">
                  <span class="cart-service-options__label">${panel.label}</span>
                  <span class="cart-service-options__chevron" aria-hidden="true">›</span>
                </button>
              </li>
            `
          )
          .join("")}
      </ul>
      ${panels
        .map((panel) => {
          const selectedIndex = Number.isInteger(selectedOptions[panel.id])
            ? selectedOptions[panel.id]
            : 0;
          return `
            <div
              id="cart-service-panel-${panel.id}"
              class="cart-service-options__panel"
              data-service-panel-content="${panel.id}"
              hidden
              role="region"
              aria-label="${panel.label}"
            >
              <p class="cart-service-options__hint">Choisissez une option pour votre commande.</p>
              <table class="cart-service-options__table">
                <thead>
                  <tr>
                    <th scope="col">Option</th>
                    <th scope="col">Détail</th>
                  </tr>
                </thead>
                <tbody>
                  ${panel.rows
                    .map(
                      ([name, detail], index) => `
                        <tr>
                          <td>
                            <label class="cart-service-options__choice">
                              <input
                                type="radio"
                                name="cart-service-${panel.id}"
                                value="${index}"
                                data-service-option="${panel.id}"
                                ${index === selectedIndex ? "checked" : ""}
                              >
                              <span>${name}</span>
                            </label>
                          </td>
                          <td>${detail}</td>
                        </tr>
                      `
                    )
                    .join("")}
                </tbody>
              </table>
            </div>
          `;
        })
        .join("")}
    </section>
  `;
}

function renderProductAdviceSection() {
  return `
    <section class="product-advice advice" aria-label="Besoin d'un conseil">
      <h3 class="product-advice__title">Besoin d'un conseil ?</h3>
      <p class="product-advice__lead">Nous serions ravis de vous conseiller personnellement</p>
      <div class="product-advice__grid contact-grid">
        <div class="product-advice__card contact">
          <span class="product-advice__icon" aria-hidden="true">☎</span>
          <div class="product-advice__content">
            <strong class="product-advice__card-title">Appelez-nous</strong>
            <span class="product-advice__card-text"><a href="tel:+41216340476">021 634 04 76</a></span>
          </div>
        </div>
        <div class="product-advice__card contact">
          <span class="product-advice__icon" aria-hidden="true">✉</span>
          <div class="product-advice__content">
            <strong class="product-advice__card-title">Écrivez-nous</strong>
            <span class="product-advice__card-text"><a href="mailto:info@richard-decoration.ch">info@richard-decoration.ch</a></span>
          </div>
        </div>
        <div class="product-advice__card contact">
          <span class="product-advice__icon" aria-hidden="true">⌂</span>
          <div class="product-advice__content">
            <strong class="product-advice__card-title">Venez-nous rencontrer</strong>
            <span class="product-advice__card-text">Richard La Literie<br>Rue des Alpes 2<br>1023 Crissier</span>
          </div>
        </div>
      </div>
      <a class="product-advice__cta about-btn" href="/pages/contact.html">Contactez-nous</a>
    </section>
  `;
}

function getProductBadgeClass(badge, index) {
  const normalized = String(badge).toLowerCase();
  if (normalized.includes("nouve")) return "new";
  if (normalized.includes("best")) return "best";
  return index === 0 ? "new" : "extra";
}

function initProductAccordions(root) {
  root.querySelectorAll("[data-accordion-trigger]").forEach((trigger) => {
    trigger.addEventListener("click", () => {
      const panel = trigger.nextElementSibling;
      if (!panel || !panel.hasAttribute("data-accordion-panel")) return;

      const shouldOpen = panel.hidden;
      panel.hidden = !shouldOpen;
      trigger.setAttribute("aria-expanded", shouldOpen ? "true" : "false");
      const icon = trigger.querySelector("span:last-child");
      if (icon) icon.textContent = shouldOpen ? "−" : "+";
    });
  });
}

function takeRankedProducts(products, scorer, limit) {
  return [...products]
    .map((product) => ({ product, score: scorer(product) }))
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((entry) => entry.product);
}

function getSimilarProducts(product, category, categoriesById, allProducts, limit = 4) {
  const rootCategoryId = getRootCategoryId(category, categoriesById);
  const directMatches = takeRankedProducts(
    allProducts.filter((candidate) => candidate.id !== product.id),
    (candidate) => {
      const candidateCategory = categoriesById.get(candidate.categoryId);
      const candidateRoot = getRootCategoryId(candidateCategory, categoriesById);
      let score = 0;

      if (candidate.categoryId === product.categoryId) score += 120;
      if (candidate.brandId === product.brandId) score += 30;
      if (candidateRoot === rootCategoryId) score += 18;
      if (candidate.liquidation === product.liquidation) score += 2;

      return score;
    },
    limit
  );

  return directMatches;
}

function getRecommendedProducts(product, category, categoriesById, allProducts, limit = 4) {
  const rootCategoryId = getRootCategoryId(category, categoriesById);
  const crossSellTargets = {
    matelas: ["sommier", "lit", "literie"],
    sommier: ["matelas", "literie"],
    lit: ["matelas", "literie"],
    literie: ["matelas", "lit", "sommier"],
    "fauteuil-relax": ["literie", "matelas"]
  };
  const targetRoots = crossSellTargets[rootCategoryId] || ["matelas", "literie"];

  return takeRankedProducts(
    allProducts.filter((candidate) => candidate.id !== product.id),
    (candidate) => {
      const candidateCategory = categoriesById.get(candidate.categoryId);
      const candidateRoot = getRootCategoryId(candidateCategory, categoriesById);
      let score = 0;

      if (targetRoots.includes(candidateRoot)) score += 120;
      if (candidate.brandId === product.brandId) score += 10;
      if (candidateRoot === rootCategoryId) score -= 25;

      return score;
    },
    limit
  );
}

export async function initProductPage() {
  const { slug } = parseQueryParams();
  if (!slug) return;

  const pageEl = document.getElementById("product-page");
  if (!pageEl) return;

  const [product, brands, categories, allProducts] = await Promise.all([
    getProductBySlug(slug),
    getBrands(),
    getCategories(),
    getProducts()
  ]);

  if (!product) {
    pageEl.innerHTML = `
      <div class="content-card content-card--soft">
        <h1>Produit introuvable</h1>
        <p>Le produit demandé n&apos;est pas disponible pour le moment.</p>
      </div>
    `;
    return;
  }

  const brandsById = new Map(brands.map((brand) => [brand.id, brand]));
  const categoriesById = new Map(categories.map((entry) => [entry.id, entry]));
  const brand = brandsById.get(product.brandId);
  const category = categoriesById.get(product.categoryId);
  const categoryAncestors = getCategoryAncestors(category, categoriesById);
  const images = getProductGalleryImages(product, category);
  const optionDefinitions = getProductOptionDefinitions(product, category);
  const similarProducts = getSimilarProducts(
    product,
    category,
    categoriesById,
    allProducts,
    4
  );
  const recommendedProducts = getRecommendedProducts(
    product,
    category,
    categoriesById,
    allProducts,
    4
  );
  const state = {
    currentImageIndex: 0,
    quantity: 1,
    feedback: "",
    selectedOptions: getDefaultProductSelection(product),
    lightboxOpen: false
  };

  pageEl.innerHTML = `
    <nav class="breadcrumb product-page-breadcrumb" aria-label="Fil d'Ariane">
      <a href="/">Accueil</a>
      ${categoryAncestors
        .map(
          (entry) =>
            `<span class="breadcrumb__separator" aria-hidden="true">›</span><a href="/pages/category.html?slug=${encodeURIComponent(entry.slug)}">${entry.name}</a>`
        )
        .join("")}
      <span class="breadcrumb__separator" aria-hidden="true">›</span>
      <span class="breadcrumb__current">${product.name}</span>
    </nav>

    <div class="single-product__layout product">
      <div id="product-gallery-panel" class="single-product__gallery gallery"></div>
      <aside id="product-summary-panel" class="single-product__summary details product-summary"></aside>
    </div>

    <div id="product-details-panel" class="product-details-panel"></div>
    <div id="product-lightbox-root" class="product-lightbox-root"></div>
    ${renderProductRelatedSection("Produits similaires", similarProducts)}
    ${renderProductRelatedSection("Nous vous recommandons aussi", recommendedProducts)}
    ${renderProductAdviceSection()}
  `;

  document.title = `${product.name} | Richard La Literie`;

  const galleryPanelEl = document.getElementById("product-gallery-panel");
  const summaryPanelEl = document.getElementById("product-summary-panel");
  const detailsPanelEl = document.getElementById("product-details-panel");
  const lightboxRootEl = document.getElementById("product-lightbox-root");
  if (!galleryPanelEl || !summaryPanelEl || !detailsPanelEl || !lightboxRootEl) return;

  const syncVariation = (priorityKey = "") => {
    const synced = syncSelectionWithVariation(product, state.selectedOptions, priorityKey);
    state.selectedOptions = synced.selectedOptions;
    return synced.variation;
  };

  const renderLightbox = () => {
    if (!state.lightboxOpen) {
      lightboxRootEl.innerHTML = "";
      return;
    }

    const fallbackImage = getProductImageUrl(product, null);
    const hasMultipleImages = images.length > 1;
    const activeImage = images[state.currentImageIndex] || images[0];

    lightboxRootEl.innerHTML = `
      <div class="product-lightbox" data-lightbox-close>
        <div class="product-lightbox-dialog" role="dialog" aria-modal="true" aria-label="Diaporama produit">
          <button
            type="button"
            class="product-lightbox-close"
            aria-label="Fermer le diaporama"
            data-lightbox-close
          >
            ×
          </button>

          ${
            hasMultipleImages
              ? `
                <button
                  type="button"
                  class="product-lightbox-arrow product-lightbox-arrow--prev"
                  aria-label="Image precedente"
                  data-lightbox-direction="prev"
                >
                  <svg viewBox="0 0 24 24">
                    <path d="M14.5 6 8.5 12l6 6" />
                  </svg>
                </button>
              `
              : ""
          }

          <div class="product-lightbox-media">
            <img
              src="${activeImage}"
              alt="${product.name} - vue ${state.currentImageIndex + 1}"
              class="product-lightbox-image"
              onerror="this.src='${fallbackImage}'"
            />
          </div>

          ${
            hasMultipleImages
              ? `
                <button
                  type="button"
                  class="product-lightbox-arrow product-lightbox-arrow--next"
                  aria-label="Image suivante"
                  data-lightbox-direction="next"
                >
                  <svg viewBox="0 0 24 24">
                    <path d="m9.5 6 6 6-6 6" />
                  </svg>
                </button>
              `
              : ""
          }

          ${
            hasMultipleImages
              ? `
                <div class="product-lightbox-thumbs">
                  ${images
                    .map(
                      (image, index) => `
                        <button
                          type="button"
                          class="product-lightbox-thumb${index === state.currentImageIndex ? " is-active" : ""}"
                          data-lightbox-index="${index}"
                        >
                          <img src="${image}" alt="${product.name} - miniature ${index + 1}" onerror="this.src='${fallbackImage}'" />
                        </button>
                      `
                    )
                    .join("")}
                </div>
              `
              : ""
          }
        </div>
      </div>
    `;

    lightboxRootEl.querySelectorAll("[data-lightbox-close]").forEach((element) => {
      element.addEventListener("click", (event) => {
        if (element !== event.target && !element.hasAttribute("data-lightbox-close")) return;
        state.lightboxOpen = false;
        renderLightbox();
      });
    });

    lightboxRootEl.querySelector(".product-lightbox-dialog")?.addEventListener("click", (event) => {
      event.stopPropagation();
    });

    lightboxRootEl.querySelectorAll("[data-lightbox-direction]").forEach((button) => {
      button.addEventListener("click", () => {
        const direction = button.dataset.lightboxDirection === "next" ? 1 : -1;
        state.currentImageIndex =
          (state.currentImageIndex + direction + images.length) % images.length;
        renderGallery(syncVariation());
        renderLightbox();
      });
    });

    lightboxRootEl.querySelectorAll("[data-lightbox-index]").forEach((button) => {
      button.addEventListener("click", () => {
        state.currentImageIndex = Number(button.dataset.lightboxIndex) || 0;
        renderGallery(syncVariation());
        renderLightbox();
      });
    });
  };

  const renderGallery = (variation = null) => {
    const fallbackImage = getProductImageUrl(product, null);
    const hasMultipleImages = images.length > 1;
    const activeImage = images[state.currentImageIndex] || images[0];
    const badges = getProductDisplayBadges(product, 2);
    const activeVariation = variation ?? syncVariation();
    const currentPrice = activeVariation?.price ?? getProductMinimumPrice(product);
    const hasSale = productHasPromotion(product, currentPrice);
    const discountPercent = hasSale ? getProductDiscountPercent(product, currentPrice) : 0;

    galleryPanelEl.innerHTML = `
      <div class="product-gallery__main photo-wrap">
        ${
          hasSale || badges.length
            ? `
              <div class="product-gallery__badges" aria-hidden="true">
                ${hasSale ? `<span class="product-gallery__badge product-gallery__badge--sale">-${discountPercent}%</span>` : ""}
                ${badges
                  .map((badge) => `<span class="product-gallery__badge product-gallery__badge--label">${badge}</span>`)
                  .join("")}
              </div>
            `
            : ""
        }
        <img src="${activeImage}" alt="${product.name}" onerror="this.src='${fallbackImage}'" data-open-lightbox>
        ${
          hasMultipleImages
            ? `
              <button type="button" class="arrow product-gallery__arrow left" data-gallery-direction="prev" aria-label="Image précédente">‹</button>
              <button type="button" class="arrow product-gallery__arrow right" data-gallery-direction="next" aria-label="Image suivante">›</button>
            `
            : ""
        }
      </div>
      ${
        images.length
          ? `
            <div class="product-gallery__thumbs thumbs">
              ${images
                .map(
                  (image, index) => `
                    <button type="button" class="product-gallery__thumb thumb${index === state.currentImageIndex ? " active is-active" : ""}" data-gallery-index="${index}">
                      <img src="${image}" alt="${product.name} - vue ${index + 1}" onerror="this.src='${fallbackImage}'">
                    </button>
                  `
                )
                .join("")}
            </div>
          `
          : ""
      }
    `;

    galleryPanelEl.querySelectorAll("[data-gallery-index]").forEach((button) => {
      button.addEventListener("click", () => {
        state.currentImageIndex = Number(button.dataset.galleryIndex) || 0;
        renderGallery(syncVariation());
        renderLightbox();
      });
    });

    galleryPanelEl.querySelector("[data-open-lightbox]")?.addEventListener("click", () => {
      state.lightboxOpen = true;
      renderLightbox();
    });

    galleryPanelEl.querySelectorAll("[data-gallery-direction]").forEach((button) => {
      button.addEventListener("click", () => {
        const direction = button.dataset.galleryDirection === "next" ? 1 : -1;
        state.currentImageIndex = (state.currentImageIndex + direction + images.length) % images.length;
        renderGallery(syncVariation());
        renderLightbox();
      });
    });
  };

  document.addEventListener("keydown", (event) => {
    if (!state.lightboxOpen) return;

    if (event.key === "Escape") {
      state.lightboxOpen = false;
      renderLightbox();
      return;
    }

    if (event.key === "ArrowRight") {
      state.currentImageIndex = (state.currentImageIndex + 1) % images.length;
      renderGallery(syncVariation());
      renderLightbox();
      return;
    }

    if (event.key === "ArrowLeft") {
      state.currentImageIndex =
        (state.currentImageIndex - 1 + images.length) % images.length;
      renderGallery(syncVariation());
      renderLightbox();
    }
  });

  const renderSummary = (variation) => {
    const currentPrice = variation?.price ?? getProductMinimumPrice(product);
    const comparePrice = getProductComparePrice(product, currentPrice);
    const hasSale = productHasPromotion(product, currentPrice);
    const discountPercent = getProductDiscountPercent(product, currentPrice);
    const summaryBadges = [
      ...getProductDisplayBadges(product),
      ...(variation?.inStock === false ? ["Sur commande"] : [])
    ].slice(0, 4);

    summaryPanelEl.innerHTML = `
      <div class="product-summary-panel">
        ${
          brand
            ? `<p class="product-brand__name-row"><a href="/pages/brands.html?slug=${encodeURIComponent(brand.slug)}" class="product-brand__name">${brand.name}</a></p>`
            : ""
        }
        <div class="product-summary__header">
          <h1 class="product_title">${product.name}</h1>
          ${
            brand?.logo
              ? `<div class="product-brand">
                  <a href="/pages/brands.html?slug=${encodeURIComponent(brand.slug)}" class="product-brand__link"><img src="${brand.logo}" alt="${brand.name}" class="product-brand__logo"></a>
                </div>`
              : ""
          }
        </div>
        <div class="price-display">
          <div class="price-display__current"><span class="price">${formatPriceCHF(currentPrice)}</span></div>
          ${
            hasSale
              ? `<div class="price-display__catalog"><span>Prix catalogue</span> <span class="price-display__catalog-value">${formatPriceCHF(comparePrice)}</span> <strong class="price-display__discount">-${discountPercent}%</strong></div>`
              : ""
          }
        </div>
        ${
          optionDefinitions.length
            ? `<div class="product-options">${optionDefinitions
                .map((option) => {
                  const summaryOption =
                    option.key === "cover"
                      ? { ...option, values: getProductCoverChipValues(product) }
                      : option;
                  return `
                    <div class="product-option-card option-card">
                      <span class="product-option-card__label">${summaryOption.label}</span>
                      ${renderProductOptionField(summaryOption, state.selectedOptions[summaryOption.key])}
                    </div>
                  `;
                })
                .join("")}</div>`
            : ""
        }
        <div class="product-option-card product-option-card--delivery option-card delivery">
          <span class="product-option-card__label">Délai de livraison :</span>
          <strong class="product-option-card__delivery-value">${getProductDeliveryValue(product, variation)}</strong>
        </div>
        <div class="product-cart-row cart-row">
          <div class="product-cart-row__qty qty" aria-label="Quantité">
            <button type="button" class="product-quantity__btn" data-quantity-action="decrease" aria-label="Diminuer">−</button>
            <span id="product-quantity-display">${state.quantity}</span>
            <button type="button" class="product-quantity__btn" data-quantity-action="increase" aria-label="Augmenter">+</button>
          </div>
          <button type="button" class="product-cart-row__submit add-cart" id="product-add-to-cart">Ajouter au panier</button>
        </div>
        ${state.feedback ? `<p class="cart-feedback product-cart-feedback">${state.feedback}</p>` : ""}
      </div>
    `;

    summaryPanelEl.querySelectorAll("[data-option-key][data-option-value]").forEach((button) => {
      button.addEventListener("click", () => {
        const { optionKey, optionValue } = button.dataset;
        state.selectedOptions[optionKey] = optionValue;
        const nextVariation = syncVariation(optionKey);
        renderSummary(nextVariation);
        renderDetails(nextVariation);
        renderGallery(nextVariation);
      });
    });

    summaryPanelEl.querySelectorAll(".product-option-card__select, .select-row select").forEach((select) => {
      select.addEventListener("change", () => {
        state.selectedOptions[select.dataset.optionKey] = select.value;
        const nextVariation = syncVariation(select.dataset.optionKey);
        renderSummary(nextVariation);
        renderDetails(nextVariation);
        renderGallery(nextVariation);
      });
    });

    summaryPanelEl.querySelectorAll("[data-quantity-action]").forEach((button) => {
      button.addEventListener("click", () => {
        state.quantity = Math.max(
          1,
          state.quantity + (button.dataset.quantityAction === "increase" ? 1 : -1)
        );
        renderSummary(syncVariation());
      });
    });

    const addToCartButton = summaryPanelEl.querySelector("#product-add-to-cart");
    addToCartButton?.addEventListener("click", () => {
      const activeVariation = syncVariation();

      if (product.type === "variable" && activeVariation?.inStock === false) {
        state.feedback = "Cette configuration est actuellement sur commande.";
        renderSummary(activeVariation);
        return;
      }

      const currentVariation = product.type === "variable" ? activeVariation : null;
      const cartItem = {
        productId: product.id,
        productSlug: product.slug,
        productName: product.name,
        variationId: currentVariation?.id || null,
        variationLabel: currentVariation?.label || null,
        price: currentVariation?.price ?? getProductMinimumPrice(product),
        quantity: state.quantity,
        image: images[state.currentImageIndex] || images[0],
        product
      };

      addToCart(cartItem);
      state.feedback = `${state.quantity} × ${product.name}${
        currentVariation?.label ? ` (${currentVariation.label})` : ""
      } ajouté au panier.`;
      renderSummary(currentVariation);
    });
  };

  const renderDetails = (variation) => {
    detailsPanelEl.innerHTML = renderProductAccordion(
      product,
      brand,
      category,
      optionDefinitions,
      variation
    );
    initProductAccordions(detailsPanelEl);
  };

  const initialVariation = syncVariation();
  renderGallery(initialVariation);
  renderSummary(initialVariation);
  renderDetails(initialVariation);
  renderLightbox();
}

/* PAGE PANIER */

export async function initCartPage() {
  const contentsEl = document.getElementById("cart-contents");
  const summaryEl = document.getElementById("cart-summary");
  if (!contentsEl || !summaryEl) return;

  function renderCart() {
    const items = getCartItems();
    
    if (!items.length) {
      contentsEl.innerHTML = `
        <div class="cart-empty">
          <p>Votre panier est vide pour le moment.</p>
          <a href="/" class="btn btn-primary">Continuer les achats</a>
        </div>
      `;
      summaryEl.innerHTML = "";
      return;
    }

    let subtotal = 0;
    contentsEl.innerHTML = `
      <div class="cart-items">
        ${items.map((item, index) => {
          const itemTotal = item.price * item.quantity;
          subtotal += itemTotal;
          return `
            <div class="cart-item" data-index="${index}">
              <div class="cart-item-image">
                <img src="${item.image || getProductImageUrl({ name: item.productName }, null)}" alt="${item.productName}" onerror="this.src='${getProductImageUrl({ name: item.productName }, null)}'" />
              </div>
              <div class="cart-item-body">
                <div class="cart-item-top">
                  <h3 class="cart-item-name">
                    <a href="/pages/product.html?slug=${item.productSlug}">${item.productName}</a>
                  </h3>
                  <div class="cart-item-price">${formatPriceCHF(item.price)}</div>
                </div>
                ${item.variationLabel ? `<p class="cart-item-variation">${item.variationLabel}</p>` : ""}
                <div class="cart-item-controls">
                  <div class="cart-item-quantity" aria-label="Quantité">
                    <button type="button" class="cart-quantity-button" data-cart-quantity-action="decrease" data-index="${index}" aria-label="Diminuer la quantité">−</button>
                    <span class="cart-quantity-display">${item.quantity}</span>
                    <button type="button" class="cart-quantity-button" data-cart-quantity-action="increase" data-index="${index}" aria-label="Augmenter la quantité">+</button>
                  </div>
                  <button type="button" class="cart-item-remove" data-index="${index}" aria-label="Retirer du panier">
                    <svg class="cart-item-remove__icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                      <path d="M9 3h6M4 7h16M8 7v12a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2V7M10 11v6M14 11v6" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          `;
        }).join("")}
      </div>
      ${renderCartServiceOptionsBlock(getCartServiceOptions())}
    `;

    // Gestion modification quantités (stepper comme fiche produit)
    const quantityButtons = contentsEl.querySelectorAll("[data-cart-quantity-action]");
    quantityButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const index = parseInt(button.getAttribute("data-index"));
        const updatedItems = [...items];
        const delta = button.dataset.cartQuantityAction === "increase" ? 1 : -1;
        updatedItems[index].quantity = Math.max(1, updatedItems[index].quantity + delta);
        saveCartItems(updatedItems);
        renderCart();
      });
    });

    // Gestion suppression
    const removeButtons = contentsEl.querySelectorAll(".cart-item-remove");
    removeButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        const index = parseInt(btn.getAttribute("data-index"));
        const updatedItems = items.filter((_, i) => i !== index);
        saveCartItems(updatedItems);
        renderCart();
      });
    });

    // Options services : ouverture panneaux + sélection radio
    contentsEl.querySelectorAll("[data-service-panel]").forEach((trigger) => {
      trigger.addEventListener("click", () => {
        const panelId = trigger.getAttribute("data-service-panel");
        const panel = contentsEl.querySelector(`[data-service-panel-content="${panelId}"]`);
        if (!panel) return;

        const willOpen = panel.hidden;
        contentsEl.querySelectorAll("[data-service-panel-content]").forEach((other) => {
          other.hidden = true;
        });
        contentsEl.querySelectorAll("[data-service-panel]").forEach((btn) => {
          btn.setAttribute("aria-expanded", "false");
        });

        if (willOpen) {
          panel.hidden = false;
          trigger.setAttribute("aria-expanded", "true");
        }
      });
    });

    contentsEl.querySelectorAll("[data-service-option]").forEach((input) => {
      input.addEventListener("change", () => {
        const key = input.getAttribute("data-service-option");
        const next = { ...getCartServiceOptions(), [key]: Number(input.value) };
        saveCartServiceOptions(next);
      });
    });

    // Résumé panier
    summaryEl.innerHTML = `
      <div class="cart-summary-section">
        <h2 class="cart-summary-title">Résumé de la commande</h2>
        <div class="cart-summary-row">
          <span>Sous-total</span>
          <span>${formatPriceCHF(subtotal)}</span>
        </div>
        <div class="cart-summary-row">
          <span>Livraison</span>
          <span class="text-muted">Confirmée selon le mode choisi</span>
        </div>
        <div class="cart-summary-total">
          <span>Total</span>
          <span class="price">${formatPriceCHF(subtotal)}</span>
        </div>
        <div class="cart-summary-notes">
          <p>Validation simple, paiement au checkout et accompagnement possible par notre équipe.</p>
          <p class="text-muted">La disponibilité exacte et les détails de livraison sont confirmés avant finalisation.</p>
        </div>
        <a href="/pages/checkout.html" class="cart-checkout-button">
          Passer au checkout
        </a>
      </div>
    `;
  }

  renderCart();
}

/* PAGE CHECKOUT */

export async function initCheckoutPage() {
  const formEl = document.getElementById("checkout-form");
  const summaryEl = document.getElementById("checkout-summary");
  if (!formEl || !summaryEl) return;

  const items = getCartItems();
  if (!items.length) {
    formEl.innerHTML = `
      <p>Votre panier est vide. <a href="/">Retour à l'accueil</a></p>
    `;
    return;
  }

  let subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  let shippingCost = 0;
  let selectedShipping = "richard";

  function updateSummary() {
    const total = subtotal + shippingCost;
    summaryEl.innerHTML = `
      <div class="checkout-summary-section">
        <h2 class="checkout-summary-title">Récapitulatif</h2>
        <div class="checkout-summary-items">
          ${items.map((item) => `
            <div class="checkout-summary-item">
              <span>${item.quantity}× ${item.productName}${item.variationLabel ? ` (${item.variationLabel})` : ""}</span>
              <span>${formatPriceCHF(item.price * item.quantity)}</span>
            </div>
          `).join("")}
        </div>
        <div class="checkout-summary-row">
          <span>Sous-total</span>
          <span>${formatPriceCHF(subtotal)}</span>
        </div>
        <div class="checkout-summary-row">
          <span>Livraison</span>
          <span id="checkout-shipping-cost">${shippingCost > 0 ? formatPriceCHF(shippingCost) : "—"}</span>
        </div>
        <div class="checkout-summary-total">
          <span>Total</span>
          <span class="price" id="checkout-total">${formatPriceCHF(total)}</span>
        </div>
        <p class="checkout-summary-note">
          Un conseiller Richard SA peut confirmer avec vous les modalités de livraison,
          d’installation et les derniers détails de commande.
        </p>
      </div>
    `;
  }

  formEl.innerHTML = `
    <form id="checkout-form-main" class="checkout-form-main">
      <section class="checkout-section">
        <h2 class="checkout-section-title">Coordonnées</h2>
        <div class="checkout-form-grid">
          <label class="field">
            <span class="field-label">Prénom <span class="field-required">*</span></span>
            <input type="text" class="field-input" name="firstName" required />
          </label>
          <label class="field">
            <span class="field-label">Nom <span class="field-required">*</span></span>
            <input type="text" class="field-input" name="lastName" required />
          </label>
          <label class="field">
            <span class="field-label">Email <span class="field-required">*</span></span>
            <input type="email" class="field-input" name="email" required />
          </label>
          <label class="field">
            <span class="field-label">Téléphone</span>
            <input type="tel" class="field-input" name="phone" />
          </label>
        </div>
      </section>

      <section class="checkout-section">
        <h2 class="checkout-section-title">Adresse de livraison</h2>
        <div class="checkout-form-grid">
          <label class="field">
            <span class="field-label">Rue et numéro <span class="field-required">*</span></span>
            <input type="text" class="field-input" name="street" required />
          </label>
          <label class="field">
            <span class="field-label">Code postal <span class="field-required">*</span></span>
            <input type="text" class="field-input" name="postalCode" required />
          </label>
          <label class="field">
            <span class="field-label">Ville <span class="field-required">*</span></span>
            <input type="text" class="field-input" name="city" required />
          </label>
          <label class="field">
            <span class="field-label">Pays <span class="field-required">*</span></span>
            <select class="field-select" name="country" required>
              <option value="CH" selected>Suisse</option>
            </select>
          </label>
        </div>
      </section>

      <section class="checkout-section">
        <h2 class="checkout-section-title">Mode de livraison</h2>
        <div class="checkout-shipping-options">
          <label class="checkout-shipping-option">
            <input type="radio" name="shipping" value="poste" required />
            <div class="checkout-shipping-option-content">
              <span class="checkout-shipping-option-name">Poste Suisse</span>
              <span class="checkout-shipping-option-price">15.00 CHF</span>
              <span class="checkout-shipping-option-meta">Pour les accessoires et les articles compatibles avec un envoi standard.</span>
            </div>
          </label>
          <label class="checkout-shipping-option">
            <input type="radio" name="shipping" value="richard" required checked />
            <div class="checkout-shipping-option-content">
              <span class="checkout-shipping-option-name">Livraison Richard SA</span>
              <span class="checkout-shipping-option-price">Gratuit (Suisse uniquement)</span>
              <span class="checkout-shipping-option-meta">Idéal pour les articles volumineux, avec confirmation des modalités par notre équipe.</span>
            </div>
          </label>
        </div>
      </section>

      <section class="checkout-section">
        <h2 class="checkout-section-title">Paiement</h2>
        <div class="checkout-payment">
          <p class="checkout-payment-note">Paiement sécurisé via Payrexx au moment de l’intégration finale.</p>
          <div class="checkout-payment-mock">
            <div class="checkout-payment-card">
              <div class="checkout-payment-card-header">
                <span>Payrexx</span>
              </div>
              <div class="checkout-payment-card-body">
                <p>Votre paiement sera confirmé dans un environnement sécurisé une fois l’intégration finalisée.</p>
                <div class="checkout-payment-methods">
                  <span class="badge">Carte bancaire</span>
                  <span class="badge">TWINT</span>
                  <span class="badge">PostFinance</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <button type="submit" class="checkout-submit-button">
        Confirmer ma commande
      </button>
    </form>
  `;

  // Gestion changement livraison
  const shippingInputs = formEl.querySelectorAll('input[name="shipping"]');
  function syncShippingSelectionState() {
    shippingInputs.forEach((input) => {
      input.closest(".checkout-shipping-option")?.classList.toggle("is-selected", input.checked);
    });
  }
  shippingInputs.forEach((input) => {
    input.addEventListener("change", () => {
      selectedShipping = input.value;
      shippingCost = input.value === "poste" ? 15 : 0;
      syncShippingSelectionState();
      updateSummary();
    });
  });

  // Soumission formulaire
  const form = document.getElementById("checkout-form-main");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      // Redirection vers page de confirmation (fake)
      window.location.href = "/pages/checkout.html?confirmed=true";
    });
  }

  // Vérifier si on vient de la confirmation
  const { confirmed } = parseQueryParams();
  if (confirmed === "true") {
    formEl.innerHTML = `
      <div class="checkout-confirmation">
        <h2>Commande confirmée</h2>
        <p>Merci pour votre confiance. Votre demande de commande a bien été enregistrée.</p>
        <p class="text-soft">Dans cette démonstration, aucun paiement réel n’a été effectué.</p>
        <a href="/" class="btn btn-primary">Retour à l'accueil</a>
      </div>
    `;
    // Vider le panier après confirmation
    saveCartItems([]);
    return;
  }

  syncShippingSelectionState();
  updateSummary();
}


