// Point d'entrée principal de l'application :
// - injection du header / footer partagés
// - initialisation de la page courante (home, catégories, etc.)

import { getCurrentPageKey } from "./utils.js";
import {
  renderSharedLayout,
  initHomePage,
  initCategoryPage,
  initBrandsPage,
  initBrandPage,
  initProductPage,
  initCartPage,
  initCheckoutPage
} from "./render.js";
import { initCartBadge } from "./cart.js";
import { initStoreMaps } from "./store-map.js";
import { initShowroomSlider } from "./showroom-slider.js";
import { getBrands } from "./data.js";
import { getFeaturedBrands } from "./brands-page.js";
import { initBrandCarousel } from "./brand-carousel.js";
import { initStoreProductsSlider } from "./store-products-slider.js";
import { mountProductAdviceSection } from "./product-advice-section.js";

/**
 * Monte le bloc conseil sur les pages À propos (placeholder data-product-advice-mount).
 */
function initAboutProductAdviceMount() {
  document.querySelectorAll("[data-product-advice-mount]").forEach((el) => {
    mountProductAdviceSection(el);
  });
}

async function initPage() {
  renderSharedLayout();
  initAboutProductAdviceMount();
  initCartBadge();

  const page = getCurrentPageKey();

  switch (page) {
    case "home":
      await initHomePage();
      break;
    case "category":
      await initCategoryPage();
      break;
    case "brands":
      await initBrandsPage();
      break;
    case "brand":
      await initBrandPage();
      break;
    case "product":
      await initProductPage();
      break;
    case "cart":
      await initCartPage();
      break;
    case "checkout":
      await initCheckoutPage();
      break;
    case "about-expert":
      await initStoreMaps();
      initShowroomSlider();
      {
        const brands = await getBrands();
        initBrandCarousel(document, { featuredBrands: getFeaturedBrands(brands) });
      }
      break;
    case "about-store":
      initStoreProductsSlider();
      break;
    default:
      break;
  }
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initPage);
} else {
  initPage();
}


