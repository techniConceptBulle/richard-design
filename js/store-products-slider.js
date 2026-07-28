/**
 * Slider catégories produits (page magasin Crissier).
 * Défilement horizontal avec flèches, réutilise la logique du carousel marques.
 */
import {
  getBrandCarouselScrollStep,
  syncBrandCarouselArrows
} from "./brand-carousel.js";

const SLIDE_SELECTOR = ".store-products-slider__slide";

/**
 * Initialise le slider des catégories produits sélectionnés.
 * @param {string} [trackId="store-products-slider"]
 * @returns {boolean} true si le slider a été initialisé
 */
export function initStoreProductsSlider(trackId = "store-products-slider") {
  const track = document.getElementById(trackId);
  if (!track) return false;

  const wrap = track.closest(".store-products-slider__wrap");
  if (!wrap) return false;

  const prevButton = wrap.querySelector(".arrow.left");
  const nextButton = wrap.querySelector(".arrow.right");
  if (!prevButton || !nextButton) return false;

  const scrollByStep = (direction) => {
    const step = getBrandCarouselScrollStep(track, SLIDE_SELECTOR);
    if (!step) return;
    track.scrollBy({ left: direction * step, behavior: "smooth" });
  };

  const onScroll = () => syncBrandCarouselArrows(track, prevButton, nextButton);

  prevButton.addEventListener("click", () => scrollByStep(-1));
  nextButton.addEventListener("click", () => scrollByStep(1));
  track.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);

  onScroll();
  return true;
}
