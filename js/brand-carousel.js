// Carousel marques page d'accueil — défilement par slide (aligné richard2026).

const DEFAULT_SLIDE_COUNT = 9;

/**
 * Calcule le décalage horizontal d'un slide (largeur + gap).
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
 */
export function syncBrandCarouselArrows(container, prevButton, nextButton) {
  if (!container || !prevButton || !nextButton) return;

  const maxScroll = Math.max(0, container.scrollWidth - container.clientWidth);
  const scrollLeft = container.scrollLeft;

  prevButton.disabled = scrollLeft <= 4;
  nextButton.disabled = scrollLeft >= maxScroll - 4;
}

/**
 * Construit les slides Roviva du carousel (référence richard2026).
 */
function renderBrandSlides(container, slideCount, logoSrc, brandHref) {
  const slides = Array.from({ length: slideCount }, (_, index) => {
    const label = `Marque ${index + 1}`;
    return `
      <a
        class="brand-row__slide"
        href="${brandHref}"
        role="group"
        aria-roledescription="slide"
        aria-label="${label}"
      >
        <img class="brand-row__logo" src="${logoSrc}" alt="Roviva" width="300" height="92" loading="lazy" decoding="async">
      </a>
    `;
  });

  container.innerHTML = slides.join("");
}

/**
 * Initialise le carousel marques de la page d'accueil.
 */
export function initBrandCarousel(root = document) {
  const container = root.querySelector("#home-brand-row");
  const wrap = root.querySelector(".brands__slider-wrap");
  if (!container || !wrap) return;

  const prevButton = wrap.querySelector(".arrow.left");
  const nextButton = wrap.querySelector(".arrow.right");
  if (!prevButton || !nextButton) return;

  const slideCount = Number.parseInt(container.dataset.brandSlideCount || "", 10) || DEFAULT_SLIDE_COUNT;
  const logoSrc = container.dataset.brandLogo || "/assets/home/brand-roviva-ref.png";
  const brandHref = container.dataset.brandHref || "/pages/brand.html?slug=roviva";

  renderBrandSlides(container, slideCount, logoSrc, brandHref);

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
