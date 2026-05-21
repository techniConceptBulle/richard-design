// Point d'entrée principal de l'application :
// - injection du header / footer partagés
// - initialisation de la page courante (home, catégories, etc.)

import { getCurrentPageKey } from "./utils.js";
import {
  renderSharedLayout,
  initHomePage,
  initCategoriesPage,
  initCategoryPage,
  initBrandsPage,
  initBrandPage,
  initProductPage,
  initCartPage,
  initCheckoutPage
} from "./render.js";
import { initCartBadge } from "./cart.js";

async function initPage() {
  renderSharedLayout();
  initCartBadge();

  const page = getCurrentPageKey();

  switch (page) {
    case "home":
      await initHomePage();
      break;
    case "categories":
      await initCategoriesPage();
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
    default:
      break;
  }
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initPage);
} else {
  initPage();
}


