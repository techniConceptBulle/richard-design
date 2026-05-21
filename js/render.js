// Fonctions de rendu pour les listes de produits, catégories, marques et fiches produit.

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
import { addToCart, getCartItems, saveCartItems } from "./cart.js";

/* HEADER / FOOTER PARTAGÉS */

const PRIMARY_NAV_ITEMS = [
  { href: "/pages/about.html", label: "À propos" },
  { href: "/pages/category.html?slug=matelas", label: "Matelas" },
  { href: "/pages/category.html?slug=sommier", label: "Sommiers" },
  { href: "/pages/category.html?slug=literie", label: "Literie" },
  { href: "/pages/category.html?slug=liquidation", label: "Offres du moment" },
  { href: "/pages/brands.html", label: "Marques" },
  { href: "/pages/advice.html", label: "Conseils" }
];

export function renderSharedLayout() {
  const headerEl = document.getElementById("site-header");
  const footerEl = document.getElementById("site-footer");

  if (headerEl) {
    const currentUrl = new URL(window.location.href);
    const isCurrentPath = (pathname) => currentUrl.pathname === pathname;
    const isNavItemActive = (href) => {
      const targetUrl = new URL(href, window.location.origin);
      if (currentUrl.pathname !== targetUrl.pathname) return false;

      const targetSlug = targetUrl.searchParams.get("slug");
      const currentSlug = currentUrl.searchParams.get("slug");

      if (targetSlug) {
        return targetSlug === currentSlug;
      }

      return true;
    };
    const desktopNav = PRIMARY_NAV_ITEMS.map(
      ({ href, label }) =>
        `<a href="${href}" class="site-nav-link${isNavItemActive(href) ? " site-nav-link--active" : ""}">${label}</a>`
    ).join("");
    const mobileNavLinks = PRIMARY_NAV_ITEMS.map(
      ({ href, label }) =>
        `<a href="${href}" class="site-nav-mobile-link${isNavItemActive(href) ? " site-nav-mobile-link--active" : ""}">${label}</a>`
    ).join("");
    const renderSearchMarkup = (inputId) => `
      <form class="site-search" role="search" action="/pages/categories.html" method="get">
        <label class="sr-only" for="${inputId}">Rechercher un produit</label>
        <svg class="site-search-icon" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M10.5 4a6.5 6.5 0 1 0 4.1 11.55l4.43 4.42 1.41-1.41-4.42-4.43A6.5 6.5 0 0 0 10.5 4Zm0 2a4.5 4.5 0 1 1 0 9 4.5 4.5 0 0 1 0-9Z" />
        </svg>
        <input
          id="${inputId}"
          class="site-search-input"
          type="search"
          name="q"
          placeholder="Rechercher un matelas, un sommier ou une marque"
        />
      </form>
    `;
    headerEl.innerHTML = `
      <div class="site-header">
        <div class="container site-header-inner">
          <div class="site-header-top">
            <a href="/" class="site-logo">
              <span class="site-logo-main">Richard SA</span>
              <span class="site-logo-sub">Literie &amp; confort</span>
            </a>

            <div class="site-header-search desktop-only">
              ${renderSearchMarkup("site-search-input-desktop")}
            </div>

            <div class="site-header-actions">
              <a href="/pages/account.html" class="header-action-pill${isCurrentPath("/pages/account.html") ? " header-action-pill--active" : ""}" aria-label="Accéder à mon compte">
                <svg class="header-action-icon" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M12 12a4 4 0 1 0-4-4 4 4 0 0 0 4 4Zm0 2c-3.33 0-6 1.79-6 4v1h12v-1c0-2.21-2.67-4-6-4Z" />
                </svg>
                <span>Mon compte</span>
              </a>
              <a href="/pages/cart.html" class="cart-pill header-action-pill${isCurrentPath("/pages/cart.html") ? " header-action-pill--active" : ""}" aria-label="Accéder au panier">
                <svg class="header-action-icon" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M7 18a2 2 0 1 0 2 2 2 2 0 0 0-2-2Zm10 0a2 2 0 1 0 2 2 2 2 0 0 0-2-2ZM6.2 6l.34 2H20l-1.6 6.59a1 1 0 0 1-.97.76H8.1a1 1 0 0 1-.98-.8L5 4H2V2h4a1 1 0 0 1 .98.8L7.38 5H21a1 1 0 0 1 .97 1.24l-1.93 8A3 3 0 0 1 17.13 17H8.1a3 3 0 0 1-2.95-2.4L3.28 4H2V2h1.28a2 2 0 0 1 1.96 1.6L5.55 6Z" />
                </svg>
                <span>Panier</span>
                <span id="cart-count-pill" class="cart-pill-count">0</span>
              </a>
              <button
                type="button"
                class="nav-burger"
                aria-label="Ouvrir le menu"
                aria-expanded="false"
                aria-controls="mobile-nav"
                id="nav-burger-btn"
              >
                <span class="nav-burger-lines" aria-hidden="true">
                  <span class="nav-burger-line"></span>
                  <span class="nav-burger-line"></span>
                </span>
              </button>
            </div>
          </div>

          <nav class="site-nav" aria-label="Navigation principale">
            <div class="site-nav-links">
              ${desktopNav}
            </div>
          </nav>
        </div>
        <div id="mobile-nav" class="site-nav-mobile" hidden>
          <div class="container site-nav-mobile-inner">
            <div class="site-header-search mobile-only">
              ${renderSearchMarkup("site-search-input-mobile")}
            </div>
            <div class="site-nav-mobile-links">
              ${mobileNavLinks}
            </div>
          </div>
        </div>
      </div>
    `;

    const burgerBtn = document.getElementById("nav-burger-btn");
    const mobileNav = document.getElementById("mobile-nav");
    const headerRoot = headerEl.querySelector(".site-header");
    const searchInputs = headerEl.querySelectorAll(".site-search-input");
    const currentSearchValue = currentUrl.searchParams.get("q") || "";

    searchInputs.forEach((input) => {
      input.value = currentSearchValue;
    });

    const syncHeaderScrollState = () => {
      if (!headerRoot) return;
      headerRoot.classList.toggle("site-header--scrolled", window.scrollY > 12);
    };
    syncHeaderScrollState();
    window.addEventListener("scroll", syncHeaderScrollState, { passive: true });

    if (burgerBtn && mobileNav) {
      burgerBtn.addEventListener("click", () => {
        const isOpen = mobileNav.classList.toggle("open");
        burgerBtn.setAttribute("aria-expanded", isOpen ? "true" : "false");
        mobileNav.hidden = !isOpen;
        headerRoot?.classList.toggle("site-header--menu-open", isOpen);
      });
    }
  }

  if (footerEl) {
    const year = new Date().getFullYear();
    const footerNav = PRIMARY_NAV_ITEMS.map(
      ({ href, label }) => `<a href="${href}">${label}</a>`
    ).join("");
    footerEl.innerHTML = `
      <footer class="site-footer">
        <div class="container site-footer-inner">
          <div class="site-footer-grid">
            <div>
              <p class="site-footer-section-title">Richard SA</p>
              <p class="text-soft">
                Depuis 1933, Richard SA sélectionne une literie durable, confortable
                et adaptée à chaque projet de sommeil.
              </p>
            </div>
            <div>
              <p class="site-footer-section-title">Navigation</p>
              <div class="site-footer-links">
                ${footerNav}
              </div>
            </div>
            <div>
              <p class="site-footer-section-title">Légal</p>
              <div class="site-footer-links">
                <a href="/pages/privacy.html">Politique de confidentialité</a>
                <a href="/pages/terms.html">Conditions générales</a>
                <a href="/pages/contact.html">Contact &amp; showroom</a>
              </div>
            </div>
          </div>
          <div class="site-footer-bottom">
            <span>© ${year} Richard SA · Crissier, Suisse</span>
            <span>Conseil, sélection et accompagnement autour du sommeil.</span>
          </div>
        </div>
      </footer>
    `;
  }
}

/* PAGE ACCUEIL */

export async function initHomePage() {
  // Ajouter l'image au hero background
  const heroBgImg = document.getElementById("hero-bg-img");
  if (heroBgImg) {
    // Utiliser l'image de la chambre moderne
    heroBgImg.src = "/assets/images/hero-bedroom.jpg";
    heroBgImg.onerror = function() {
      // Fallback si l'image n'existe pas encore
      const boxspringProduct = {
        name: "Boxspring Richard SA",
        images: ["/assets/images/hero-boxspring.jpg"]
      };
      this.src = getProductImageUrl(boxspringProduct, "/assets/images/hero-boxspring.jpg");
    };
  }

  await renderHomeBrandsSlider();

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

/* PAGE CATÉGORIES (LISTE) */

export async function initCategoriesPage() {
  const container = document.getElementById("categories-listing");
  const titleEl = document.getElementById("categories-title");
  const descriptionEl = document.getElementById("categories-description");
  const kickerEl = document.getElementById("categories-kicker");
  if (!container || !titleEl || !descriptionEl || !kickerEl) return;

  const { q } = parseQueryParams();
  const searchTerm = (q || "").trim().toLowerCase();

  const renderCategoryCards = async () => {
    const categories = await getMainCategories();
    kickerEl.textContent = "Navigation";
    titleEl.textContent = "Catégories";
    descriptionEl.textContent =
      "Aperçu de toutes les catégories et sous-catégories disponibles dans la boutique.";
    container.innerHTML = categories
      .map(
        (cat) => `
        <a href="/pages/category.html?slug=${encodeURIComponent(
          cat.slug
        )}" class="card card-clickable">
          <div class="card-image">
            <img src="${getCategoryImageUrl(cat)}" alt="${cat.name}" />
          </div>
          <div class="card-content">
            <div class="card-meta">Catégorie principale</div>
            <h2 class="card-title">${cat.name}</h2>
            <p class="card-description">${cat.description || ""}</p>
          </div>
        </a>
      `
      )
      .join("");
  };

  if (!searchTerm) {
    await renderCategoryCards();
    return;
  }

  const [products, brands, categories] = await Promise.all([
    getProducts(),
    getBrands(),
    getCategories()
  ]);

  const results = products.filter((product) => {
    const brand = brands.find((item) => item.id === product.brandId);
    const category = categories.find((item) => item.id === product.categoryId);
    const haystack = [
      product.name,
      product.shortDescription,
      product.description,
      brand?.name,
      category?.name
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    return haystack.includes(searchTerm);
  });

  kickerEl.textContent = "Recherche";
  titleEl.textContent = `Resultats pour "${q}"`;
  descriptionEl.textContent = results.length
    ? `${results.length} produit${results.length > 1 ? "s" : ""} correspondant a votre recherche.`
    : "Aucun produit ne correspond a votre recherche pour le moment.";

  if (!results.length) {
    container.innerHTML = `
      <div class="content-card content-card--soft">
        <h2>Aucun resultat</h2>
        <p>
          Essayez un autre mot-cle comme "matelas", "sommier", "oreiller" ou le nom d'une marque.
        </p>
      </div>
    `;
    return;
  }

  container.innerHTML = results
    .map((product) => {
      const currentPrice = getProductMinimumPrice(product);
      const comparePrice = getProductComparePrice(product);
      const hasSale = productHasPromotion(product);
      const brand = brands.find((item) => item.id === product.brandId);
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
            <div class="card-meta">${brand ? `Par ${brand.name}` : "Produit"}</div>
            <h2 class="card-title">${product.name}</h2>
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

/* PAGE CATÉGORIE DÉTAILLÉE */

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

function renderCategoryProductCard(product, brand) {
  const productUrl = `/pages/product.html?slug=${encodeURIComponent(product.slug)}`;
  const productImage =
    product.images && product.images.length
      ? getProductImageUrl(product, product.images[0])
      : getProductImageUrl(product, null);
  const currentPrice = getProductMinimumPrice(product);
  const comparePrice = getProductComparePrice(product);
  const hasSale = productHasPromotion(product);
  const discountPercent = getProductDiscountPercent(product);
  const productBadges = getProductDisplayBadges(product);
  const productHighlights = getProductCardHighlights(product);
  const priceLabel = product.type === "variable" ? "À partir de" : "Prix";

  return `
    <article class="category-product-card">
      <a href="${productUrl}" class="category-product-media">
        <img
          src="${productImage}"
          alt="${product.name}"
          onerror="this.src='${getProductImageUrl(product, null)}'"
        />
        ${hasSale ? `<span class="category-product-badge">-${discountPercent}%</span>` : ""}
      </a>

      <div class="category-product-body">
        <div class="category-product-header">
          <p class="category-product-brand">${brand?.name || "Marque"}</p>
          ${
            productBadges.length
              ? `
                <div class="category-product-badges">
                  ${productBadges
                    .map((badge) => `<span class="category-product-badge-label">${badge}</span>`)
                    .join("")}
                </div>
              `
              : ""
          }
        </div>
        <h3 class="category-product-title">
          <a href="${productUrl}">${product.name}</a>
        </h3>
        ${
          product.shortDescription
            ? `<p class="category-product-description">${product.shortDescription}</p>`
            : ""
        }
        ${
          productHighlights.length
            ? `
              <div class="category-product-meta">
                ${productHighlights
                  .map((item) => `<span class="category-product-meta-item">${item}</span>`)
                  .join("")}
              </div>
            `
            : ""
        }
        <div class="category-product-footer">
          <div class="category-product-prices">
            <span class="category-product-price-label">${priceLabel}</span>
            ${
              hasSale
                ? `
                  <div class="category-product-price-line">
                    <span class="category-product-price-new">${formatPriceCHF(currentPrice)}</span>
                    <span class="category-product-price-old">${formatPriceCHF(comparePrice)}</span>
                  </div>
                `
                : `<span class="category-product-price-new">${formatPriceCHF(currentPrice)}</span>`
            }
          </div>
          <a href="${productUrl}" class="category-product-cta">
            Voir le détail
          </a>
        </div>
      </div>
    </article>
  `;
}

export async function initCategoryPage() {
  const { slug } = parseQueryParams();
  if (!slug) return;

  const titleEl = document.getElementById("category-title");
  const descriptionEl = document.getElementById("category-description");
  const breadcrumbEl = document.getElementById("category-breadcrumb-current");
  const filtersEl = document.getElementById("category-filters");
  const activeFiltersEl = document.getElementById("category-active-filters");
  const resultsMetaEl = document.getElementById("category-results-meta");
  const sortControlsEl = document.getElementById("category-sort-controls");
  const gridEl = document.getElementById("category-products-grid");
  if (!titleEl || !descriptionEl || !breadcrumbEl || !filtersEl || !sortControlsEl || !gridEl) return;

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
  const brandsById = new Map(brands.map((brand) => [brand.id, brand]));
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
  document.title = `${pageCopy.title} | Richard Design`;

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
        Réinitialiser les filtres
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
      filterDefinitions.forEach((definition) => {
        state[definition.key] = "";
      });
      state.priceMin = "";
      state.priceMax = "";
      syncFilterFieldValues();
      applyFiltersAndRender();
      syncPriceFilterState();
    });
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

    if (resultsMetaEl) {
      resultsMetaEl.textContent = `${filtered.length} ${
        filtered.length > 1 ? "produits" : "produit"
      } dans ${pageCopy.title.toLowerCase()}`;
    }

    renderActiveFilters();

    if (!filtered.length) {
      gridEl.innerHTML =
        `<div class="category-products-empty">${pageCopy.emptyState}</div>`;
      return;
    }

    gridEl.innerHTML = filtered
      .map((product) => {
        const brand = brandsById.get(product.brandId);
        return renderCategoryProductCard(product, brand);
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
  grid.innerHTML = brands
    .map(
      (brand) => `
      <a href="/pages/brand.html?slug=${encodeURIComponent(
        brand.slug
      )}" class="card card-clickable">
        <div class="card-image">
          <img src="${getBrandImageUrl(brand)}" alt="${brand.name}" />
        </div>
        <div class="card-content">
          <div class="card-meta">Marque</div>
          <h2 class="card-title">${brand.name}</h2>
          <p class="card-description">${brand.description || ""}</p>
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

const PRODUCT_OPTION_ORDER = ["firmness", "size", "cover", "finish", "technology"];

const PRODUCT_OPTION_META = {
  firmness: {
    control: "chips",
    label: "Confort",
    formatLabel: (value) => formatFirmnessLabel(value)
  },
  size: {
    control: "select",
    label: "Dimensions",
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

const PRODUCT_GALLERY_FALLBACKS = {
  bedding: [
    "/assets/images/products/bed-1839183_1920.jpg",
    "/assets/images/products/bedroom-6778193_1920.jpg",
    "/assets/images/products/minimal-4369856_1920.jpg"
  ],
  decor: [
    "/assets/images/products/minimal-4369856_1920.jpg",
    "/assets/images/products/bedroom-6778193_1920.jpg",
    "/assets/images/products/bed-1839183_1920.jpg"
  ],
  armchair: [
    "/assets/images/products/armchair-8275688_1280.jpg",
    "/assets/images/products/bedroom-6778193_1920.jpg",
    "/assets/images/products/bed-1839183_1920.jpg"
  ]
};

function getProductGalleryFallbackSet(product, category) {
  const categoryId = category?.id || "";

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

  return galleryImages.slice(0, Math.max(3, galleryImages.length));
}

function getProductOptionDefinitions(product, category) {
  return PRODUCT_OPTION_ORDER.map((key) => {
    const values = [
      ...(product.variations?.map((variation) => variation[key]).filter(Boolean) || []),
      ...(product[key] ? [product[key]] : [])
    ];
    const uniqueValues = [...new Set(values)];
    if (!uniqueValues.length) return null;

    const meta = PRODUCT_OPTION_META[key];
    const label =
      key === "size" && category?.id === "matelas"
        ? "Dimensions du matelas (cm)"
        : meta?.label || key;

    return {
      key,
      label,
      control: meta?.control || "chips",
      formatLabel: meta?.formatLabel || ((value) => value),
      values: key === "size" ? sortSizes(uniqueValues) : uniqueValues
    };
  }).filter(Boolean);
}

function getDefaultProductSelection(product) {
  const defaultSelection = {};
  const defaultVariation =
    product.variations?.find((variation) => variation.inStock) ||
    product.variations?.[0] ||
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

function getProductDeliveryLabel(product, variation) {
  if (product.liquidation) {
    return "Retrait ou livraison rapide selon stock";
  }

  if (variation && variation.inStock === false) {
    return "Délai confirmé après validation de commande";
  }

  if (product.type === "variable") {
    return "Livraison indicative : 3 à 4 semaines";
  }

  return "Livraison indicative : 5 à 10 jours ouvrés";
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
      label: "Confort",
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

function renderProductAccordion(product, brand, category, optionDefinitions, variation) {
  const highlights = buildProductHighlights(product, category, optionDefinitions, variation);
  const sections = [
    {
      title: "Description",
      open: true,
      content: `
        <div class="product-copy">
          ${product.shortDescription ? `<p class="product-copy-intro">${product.shortDescription}</p>` : ""}
          ${renderParagraphBlocks(product.description || "")}
          ${
            highlights.length
              ? `<ul class="product-copy-list">${highlights
                  .map((item) => `<li>${item}</li>`)
                  .join("")}</ul>`
              : ""
          }
        </div>
      `
    },
    {
      title: "Caractéristiques produit",
      open: false,
      content: `<div class="product-spec-grid">${renderSpecificationRows(
        product,
        brand,
        category,
        optionDefinitions,
        variation
      )}</div>`
    },
    {
      title: "Livraison",
      open: false,
      content: `
        <div class="product-copy">
          <p class="product-copy-intro">${getProductDeliveryLabel(product, variation)}</p>
          <ul class="product-copy-list">
            <li>Le délai exact est confirmé par notre équipe selon la configuration retenue.</li>
            <li>Retrait en magasin et livraison à domicile possibles selon le produit et la zone.</li>
            <li>Nos conseillers prennent contact pour organiser les détails logistiques si nécessaire.</li>
          </ul>
        </div>
      `
    },
    {
      title: "Conseil expert",
      open: false,
      content: `
        <div class="product-copy">
          <p class="product-copy-intro">Chaque modèle est sélectionné et présenté avec l’appui de nos conseillers sommeil.</p>
          <p>
            En magasin comme à distance, nous aidons à confirmer la bonne dimension,
            le bon niveau de confort et les finitions les plus adaptées à votre usage.
          </p>
        </div>
      `
    },
    {
      title: "Garantie et Service",
      open: false,
      content: `
        <div class="product-copy">
          <p class="product-copy-intro">Un accompagnement Richard SA est prévu avant, pendant et après l’achat.</p>
          <ul class="product-copy-list">
            <li>Conseil personnalisé en magasin ou à distance.</li>
            <li>Accompagnement pour choisir la bonne dimension et la bonne configuration.</li>
            <li>Informations de garantie et de SAV confirmées selon la marque et le modèle.</li>
          </ul>
        </div>
      `
    }
  ];

  return `
    <section class="product-accordion-group">
      ${sections
        .map(
          (section, index) => `
            <article class="product-accordion-item${section.open ? " is-open" : ""}">
              <button
                type="button"
                class="product-accordion-trigger"
                aria-expanded="${section.open ? "true" : "false"}"
                aria-controls="product-accordion-panel-${index}"
              >
                <span>${section.title}</span>
                <span class="product-accordion-icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24">
                    <path d="m6 9 6 6 6-6" />
                  </svg>
                </span>
              </button>
              <div
                id="product-accordion-panel-${index}"
                class="product-accordion-panel"
                ${section.open ? "" : "hidden"}
              >
                ${section.content}
              </div>
            </article>
          `
        )
        .join("")}
    </section>
  `;
}

function renderProductOptionField(option, selectedValue) {
  if (option.control === "select") {
    return `
      <label class="product-option-select-wrap${
        option.key === "size" ? " product-option-select-wrap--size" : ""
      }">
        <select class="product-option-select" data-option-key="${option.key}">
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
        <span class="product-option-select-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24">
            <path d="m6 9 6 6 6-6" />
          </svg>
        </span>
      </label>
    `;
  }

  return `
    <div class="product-option-chips" role="list">
      ${option.values
        .map(
          (value) => `
            <button
              type="button"
              class="product-option-chip${value === selectedValue ? " is-active" : ""}"
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

function renderProductRailCard(product, brand) {
  const currentPrice = getProductMinimumPrice(product);
  const comparePrice = getProductComparePrice(product, currentPrice);
  const hasSale = productHasPromotion(product, currentPrice);
  const image =
    product.images && product.images.length
      ? getProductImageUrl(product, product.images[0])
      : getProductImageUrl(product, null);

  return `
    <article class="product-rail-card">
      <a href="/pages/product.html?slug=${encodeURIComponent(product.slug)}" class="product-rail-card-link">
        <div class="product-rail-media">
          <img
            src="${image}"
            alt="${product.name}"
            onerror="this.src='${getProductImageUrl(product, null)}'"
          />
          ${hasSale ? `<span class="product-rail-badge">-${getProductDiscountPercent(product, currentPrice)}%</span>` : ""}
        </div>
        <div class="product-rail-body">
          <p class="product-rail-brand">${brand?.name || "Richard SA"}</p>
          <h3 class="product-rail-title">${product.name}</h3>
          <div class="product-rail-price">
            ${hasSale ? `<span class="product-rail-price-from">a partir de ${formatPriceCHF(currentPrice)}</span>` : ""}
            <div class="product-rail-price-line">
              <span class="product-rail-price-current">${formatPriceCHF(currentPrice)}</span>
              ${hasSale ? `<span class="product-rail-price-old">${formatPriceCHF(comparePrice)}</span>` : ""}
            </div>
          </div>
        </div>
      </a>
    </article>
  `;
}

function renderProductRail(title, products, brandsById) {
  if (!products.length) return "";

  return `
    <section class="product-rail-section">
      <div class="product-rail-header">
        <h2>${title}</h2>
      </div>
      <div class="product-rail-slider" data-product-slider>
        <button
          type="button"
          class="product-rail-arrow"
          data-direction="prev"
          aria-label="Faire defiler vers la gauche"
        >
          <svg viewBox="0 0 24 24">
            <path d="M14.5 6 8.5 12l6 6" />
          </svg>
        </button>
        <div class="product-rail-viewport">
          <div class="product-rail-track">
            ${products
              .map((item) => renderProductRailCard(item, brandsById.get(item.brandId)))
              .join("")}
          </div>
        </div>
        <button
          type="button"
          class="product-rail-arrow"
          data-direction="next"
          aria-label="Faire defiler vers la droite"
        >
          <svg viewBox="0 0 24 24">
            <path d="m9.5 6 6 6-6 6" />
          </svg>
        </button>
      </div>
    </section>
  `;
}

function initProductRailSliders(root) {
  root.querySelectorAll("[data-product-slider]").forEach((slider) => {
    const viewport = slider.querySelector(".product-rail-viewport");
    const prevButton = slider.querySelector('[data-direction="prev"]');
    const nextButton = slider.querySelector('[data-direction="next"]');

    if (!viewport || !prevButton || !nextButton) return;

    const updateButtons = () => {
      const maxScroll = viewport.scrollWidth - viewport.clientWidth;
      prevButton.disabled = viewport.scrollLeft <= 4;
      nextButton.disabled = viewport.scrollLeft >= maxScroll - 4;
    };

    const scrollByAmount = (direction) => {
      viewport.scrollBy({
        left: Math.max(viewport.clientWidth * 0.82, 260) * direction,
        behavior: "smooth"
      });
    };

    prevButton.addEventListener("click", () => scrollByAmount(-1));
    nextButton.addEventListener("click", () => scrollByAmount(1));
    viewport.addEventListener("scroll", updateButtons, { passive: true });
    window.addEventListener("resize", updateButtons);
    updateButtons();
  });
}

function initProductAccordions(root) {
  root.querySelectorAll(".product-accordion-trigger").forEach((trigger) => {
    trigger.addEventListener("click", () => {
      const item = trigger.closest(".product-accordion-item");
      const panel = item?.querySelector(".product-accordion-panel");
      if (!item || !panel) return;

      const shouldOpen = !item.classList.contains("is-open");
      item.classList.toggle("is-open", shouldOpen);
      trigger.setAttribute("aria-expanded", shouldOpen ? "true" : "false");
      panel.hidden = !shouldOpen;
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
    <nav class="product-breadcrumb" aria-label="Fil d'Ariane">
      <a href="/">Accueil</a>
      ${categoryAncestors
        .map(
          (entry) =>
            `<span class="product-breadcrumb-separator">/</span><a href="/pages/category.html?slug=${encodeURIComponent(
              entry.slug
            )}">${entry.name}</a>`
        )
        .join("")}
      <span class="product-breadcrumb-separator">/</span>
      <span class="product-breadcrumb-current">${product.name}</span>
    </nav>

    <section class="product-hero-grid">
      <div id="product-gallery-panel" class="product-gallery-panel card"></div>
      <aside id="product-summary-panel" class="product-summary-panel card"></aside>
    </section>

    <div id="product-details-panel"></div>
    <div id="product-lightbox-root"></div>

    ${renderProductRail("Produits similaires", similarProducts, brandsById)}
    ${renderProductRail("Nous vous recommandons aussi", recommendedProducts, brandsById)}
  `;

  document.title = `${product.name} | Richard Design`;

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
        renderGallery();
        renderLightbox();
      });
    });

    lightboxRootEl.querySelectorAll("[data-lightbox-index]").forEach((button) => {
      button.addEventListener("click", () => {
        state.currentImageIndex = Number(button.dataset.lightboxIndex) || 0;
        renderGallery();
        renderLightbox();
      });
    });
  };

  const renderGallery = () => {
    const fallbackImage = getProductImageUrl(product, null);
    const hasMultipleImages = images.length > 1;

    galleryPanelEl.innerHTML = `
      <div class="product-gallery-stage">
        <button
          type="button"
          class="product-gallery-open"
          aria-label="Ouvrir le diaporama plein écran"
          data-open-lightbox
        >
          <div class="product-gallery-viewport">
          <div
            class="product-gallery-track"
            style="transform: translateX(-${state.currentImageIndex * 100}%);"
          >
            ${images
              .map(
                (image, index) => `
                  <div class="product-gallery-slide">
                    <div class="product-gallery-frame">
                      <img
                        src="${image}"
                        alt="${product.name} - vue ${index + 1}"
                        class="product-gallery-image"
                        onerror="this.src='${fallbackImage}'"
                      />
                    </div>
                  </div>
                `
              )
              .join("")}
          </div>
          </div>
        </button>
      </div>

      ${
        hasMultipleImages
          ? `
            <div class="product-gallery-thumbs-slider">
              <button
                type="button"
                class="product-gallery-thumbs-arrow"
                data-thumb-direction="prev"
                aria-label="Images précédentes"
              >
                <svg viewBox="0 0 24 24">
                  <path d="M14.5 6 8.5 12l6 6" />
                </svg>
              </button>
              <div class="product-gallery-thumbs-viewport">
                <div class="product-gallery-thumbs-track">
                  ${images
                    .map(
                      (image, index) => `
                        <button
                          type="button"
                          class="product-gallery-thumb${index === state.currentImageIndex ? " is-active" : ""}"
                          data-gallery-index="${index}"
                        >
                          <img src="${image}" alt="${product.name} - vue ${index + 1}" onerror="this.src='${fallbackImage}'" />
                        </button>
                      `
                    )
                    .join("")}
                </div>
              </div>
              <button
                type="button"
                class="product-gallery-thumbs-arrow"
                data-thumb-direction="next"
                aria-label="Images suivantes"
              >
                <svg viewBox="0 0 24 24">
                  <path d="m9.5 6 6 6-6 6" />
                </svg>
              </button>
            </div>
          `
          : ""
      }
    `;

    galleryPanelEl.querySelectorAll("[data-gallery-index]").forEach((button) => {
      button.addEventListener("click", () => {
        state.currentImageIndex = Number(button.dataset.galleryIndex) || 0;
        renderGallery();
        renderLightbox();
      });
    });

    galleryPanelEl.querySelector("[data-open-lightbox]")?.addEventListener("click", () => {
      state.lightboxOpen = true;
      renderLightbox();
    });

    const thumbsViewport = galleryPanelEl.querySelector(".product-gallery-thumbs-viewport");
    const activeThumb = galleryPanelEl.querySelector(".product-gallery-thumb.is-active");
    const thumbPrevButton = galleryPanelEl.querySelector('[data-thumb-direction="prev"]');
    const thumbNextButton = galleryPanelEl.querySelector('[data-thumb-direction="next"]');

    if (thumbsViewport && thumbPrevButton && thumbNextButton) {
      const updateThumbButtons = () => {
        const maxScroll = thumbsViewport.scrollWidth - thumbsViewport.clientWidth;
        thumbPrevButton.disabled = thumbsViewport.scrollLeft <= 4;
        thumbNextButton.disabled = thumbsViewport.scrollLeft >= maxScroll - 4;
      };

      const scrollThumbs = (direction) => {
        thumbsViewport.scrollBy({
          left: Math.max(thumbsViewport.clientWidth * 0.72, 180) * direction,
          behavior: "smooth"
        });
      };

      thumbPrevButton.addEventListener("click", () => scrollThumbs(-1));
      thumbNextButton.addEventListener("click", () => scrollThumbs(1));
      thumbsViewport.addEventListener("scroll", updateThumbButtons, { passive: true });
      requestAnimationFrame(() => {
        activeThumb?.scrollIntoView({ inline: "center", block: "nearest" });
        updateThumbButtons();
      });
    }
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
      renderGallery();
      renderLightbox();
      return;
    }

    if (event.key === "ArrowLeft") {
      state.currentImageIndex =
        (state.currentImageIndex - 1 + images.length) % images.length;
      renderGallery();
      renderLightbox();
    }
  });

  const renderSummary = (variation) => {
    const currentPrice = variation?.price ?? getProductMinimumPrice(product);
    const comparePrice = getProductComparePrice(product, currentPrice);
    const hasSale = productHasPromotion(product, currentPrice);
    const discountPercent = getProductDiscountPercent(product, currentPrice);
    const summaryHighlights = buildProductHighlights(product, category, optionDefinitions, variation);
    const summaryBadges = [
      ...getProductDisplayBadges(product),
      ...(hasSale ? [`-${discountPercent}%`] : []),
      ...(variation?.inStock === false ? ["Sur commande"] : [])
    ].slice(0, 4);

    summaryPanelEl.innerHTML = `
      <div class="product-summary-inner">
        <div class="product-summary-topbar">
          ${
            summaryBadges.length
              ? `
                <div class="product-summary-badges">
                  ${summaryBadges
                    .map((badge) => {
                      const badgeClass =
                        badge.startsWith("-") || badge === "Sur commande"
                          ? "product-summary-badge product-summary-badge--accent"
                          : "product-summary-badge product-summary-badge--light";
                      return `<span class="${badgeClass}">${badge}</span>`;
                    })
                    .join("")}
                </div>
              `
              : "<span></span>"
          }
          ${
            brand?.logo
              ? `<img src="${brand.logo}" alt="${brand.name}" class="product-summary-brand-logo" />`
              : ""
          }
        </div>

        <div class="product-summary-copy">
          ${brand?.name ? `<p class="product-summary-brand">${brand.name}</p>` : ""}
          <h1 class="product-summary-title">${product.name}</h1>
          ${
            product.shortDescription
              ? `<p class="product-summary-description">${product.shortDescription}</p>`
              : ""
          }
          ${
            summaryHighlights.length
              ? `
                <div class="product-summary-highlights">
                  ${summaryHighlights
                    .map((item) => `<span class="product-summary-highlight">${item}</span>`)
                    .join("")}
                </div>
              `
              : ""
          }
        </div>

        <div class="product-summary-price-block">
          <div class="product-summary-price-current">${formatPriceCHF(currentPrice)}</div>
          ${
            hasSale
              ? `
                  <div class="product-summary-price-catalog">
                    <span class="product-summary-price-catalog-label">Prix catalogue</span>
                    <span class="product-summary-price-catalog-value">${formatPriceCHF(comparePrice)}</span>
                    <span class="product-summary-price-catalog-saving">-${discountPercent}%</span>
                  </div>
                `
              : `<p class="product-summary-price-meta">Prix affiché pour la configuration sélectionnée</p>`
          }
        </div>

        ${
          optionDefinitions.length
            ? `
              <div class="product-option-stack">
                ${optionDefinitions
                  .map(
                    (option) => `
                      <section class="product-option-card">
                        <div class="product-option-label">${option.label}</div>
                        ${renderProductOptionField(option, state.selectedOptions[option.key])}
                      </section>
                    `
                  )
                  .join("")}
              </div>
            `
            : ""
        }

        <div class="product-purchase-panel">
          <div class="product-purchase-actions">
            <div class="product-quantity-stepper" aria-label="Quantité">
              <button type="button" class="product-quantity-button" data-quantity-action="decrease">-</button>
              <input
                type="number"
                min="1"
                value="${state.quantity}"
                class="product-quantity-input"
                id="product-quantity-input"
              />
              <button type="button" class="product-quantity-button" data-quantity-action="increase">+</button>
            </div>

            <button type="button" class="btn btn-primary btn-large product-add-to-cart-button" id="product-add-to-cart">
              Ajouter au panier
            </button>
          </div>

          <div class="product-purchase-delivery product-purchase-delivery--after-cta">
            <span class="product-purchase-delivery-label">Délai de livraison</span>
            <span class="product-purchase-delivery-value">${getProductDeliveryLabel(product, variation)}</span>
          </div>

          <div class="product-reassurance-list">
            <div class="product-reassurance-item">Conseil personnalisé en magasin ou à distance</div>
            <div class="product-reassurance-item">Livraison et installation selon le produit et la zone</div>
            <div class="product-reassurance-item">Quantité ajustable ensuite dans le panier</div>
          </div>

          ${
            state.feedback
              ? `<p class="product-cart-feedback">${state.feedback}</p>`
              : ""
          }

          <div class="product-purchase-meta">
            <span>Sélection Richard SA</span>
            <span>Retrait showroom possible</span>
            <span>Paiement confirmé au checkout</span>
          </div>
        </div>
      </div>
    `;

    summaryPanelEl.querySelectorAll("[data-option-key][data-option-value]").forEach((button) => {
      button.addEventListener("click", () => {
        const { optionKey, optionValue } = button.dataset;
        state.selectedOptions[optionKey] = optionValue;
        const nextVariation = syncVariation(optionKey);
        renderSummary(nextVariation);
        renderDetails(nextVariation);
        renderGallery();
      });
    });

    summaryPanelEl.querySelectorAll(".product-option-select").forEach((select) => {
      select.addEventListener("change", () => {
        state.selectedOptions[select.dataset.optionKey] = select.value;
        const nextVariation = syncVariation(select.dataset.optionKey);
        renderSummary(nextVariation);
        renderDetails(nextVariation);
        renderGallery();
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

    const quantityInput = summaryPanelEl.querySelector("#product-quantity-input");
    quantityInput?.addEventListener("input", () => {
      state.quantity = Math.max(1, Number(quantityInput.value) || 1);
      if (quantityInput.value !== String(state.quantity)) {
        quantityInput.value = String(state.quantity);
      }
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
  renderGallery();
  renderSummary(initialVariation);
  renderDetails(initialVariation);
  renderLightbox();
  initProductRailSliders(pageEl);
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
          const itemBadges = getProductDisplayBadges(item.product || {}, 2);
          return `
            <div class="cart-item card" data-index="${index}">
              <div class="cart-item-image">
                <img src="${item.image || getProductImageUrl({ name: item.productName }, null)}" alt="${item.productName}" onerror="this.src='${getProductImageUrl({ name: item.productName }, null)}'" />
              </div>
              <div class="cart-item-details">
                <h3 class="cart-item-name">
                  <a href="/pages/product.html?slug=${item.productSlug}">${item.productName}</a>
                </h3>
                ${item.variationLabel ? `<p class="cart-item-variation">${item.variationLabel}</p>` : ""}
                ${
                  itemBadges.length
                    ? `
                      <div class="cart-item-badges">
                        ${itemBadges.map((badge) => `<span class="badge">${badge}</span>`).join("")}
                      </div>
                    `
                    : ""
                }
                <div class="cart-item-price">${formatPriceCHF(item.price)}</div>
              </div>
              <div class="cart-item-quantity">
                <span class="cart-item-label">Quantité</span>
                <div class="cart-quantity-stepper">
                  <button type="button" class="cart-quantity-button" data-cart-quantity-action="decrease" data-index="${index}" aria-label="Diminuer la quantité">−</button>
                  <input 
                    type="number" 
                    class="cart-quantity-input" 
                    min="1" 
                    value="${item.quantity}" 
                    data-index="${index}"
                  />
                  <button type="button" class="cart-quantity-button" data-cart-quantity-action="increase" data-index="${index}" aria-label="Augmenter la quantité">+</button>
                </div>
              </div>
              <div class="cart-item-total">
                <span class="cart-item-label">Total</span>
                <span class="price">${formatPriceCHF(itemTotal)}</span>
              </div>
              <div class="cart-item-actions">
                <button type="button" class="cart-item-remove" data-index="${index}" aria-label="Supprimer">
                  Retirer
                </button>
              </div>
            </div>
          `;
        }).join("")}
      </div>
    `;

    // Gestion modification quantités
    const quantityInputs = contentsEl.querySelectorAll(".cart-quantity-input");
    quantityInputs.forEach((input) => {
      input.addEventListener("change", (e) => {
        const index = parseInt(e.target.getAttribute("data-index"));
        const newQuantity = parseInt(e.target.value) || 1;
        if (newQuantity < 1) {
          e.target.value = 1;
          return;
        }
        const updatedItems = [...items];
        updatedItems[index].quantity = newQuantity;
        saveCartItems(updatedItems);
        renderCart();
      });
    });

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
        <a href="/pages/checkout.html" class="btn btn-primary btn-large btn-block">
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
        <p class="checkout-section-note">Pour préparer votre commande et assurer le bon suivi.</p>
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
        <p class="checkout-section-note">Nous utilisons ces informations pour confirmer la livraison et l’installation si nécessaire.</p>
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
        <p class="checkout-section-note">Choisissez le mode qui correspond le mieux à votre projet.</p>
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
          <p class="text-soft">Paiement sécurisé via Payrexx au moment de l’intégration finale.</p>
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

      <button type="submit" class="btn btn-primary btn-large btn-block">
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


