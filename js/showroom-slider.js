/**
 * Slider showroom — fonds plein largeur + panneau marque fixe (page expert).
 */

const AUTOPLAY_DELAY_MS = 5000;

/**
 * Synchronise slides, puces et attributs ARIA.
 * @param {HTMLElement} root
 * @param {number} index
 * @param {number} slideCount
 */
export function syncShowroomSliderState(root, index, slideCount) {
  const track = root.querySelector("[data-showroom-track]");
  const slides = root.querySelectorAll(".about-showroom-slider__slide");
  const bullets = root.querySelectorAll(".about-showroom-slider__bullet");

  if (track) {
    track.style.transform = `translate3d(-${index * 100}%, 0, 0)`;
  }

  slides.forEach((slide, slideIndex) => {
    const isActive = slideIndex === index;
    slide.classList.toggle("is-active", isActive);
    slide.setAttribute("aria-hidden", isActive ? "false" : "true");
  });

  bullets.forEach((bullet, bulletIndex) => {
    const isActive = bulletIndex === index;
    bullet.classList.toggle("is-active", isActive);
    bullet.setAttribute("aria-selected", isActive ? "true" : "false");
    bullet.tabIndex = isActive ? 0 : -1;
  });

  root.dataset.showroomActiveIndex = String(index);
  root.dataset.showroomSlideCount = String(slideCount);
}

/**
 * Initialise le slider showroom (autoplay + navigation par puces).
 * @param {string} [rootId="about-showroom-slider"]
 * @returns {{ goToSlide: Function, stopAutoplay: Function, startAutoplay: Function } | null}
 */
export function initShowroomSlider(rootId = "about-showroom-slider") {
  const root = document.getElementById(rootId);
  if (!root) return null;

  const slideCount = root.querySelectorAll(".about-showroom-slider__slide").length;
  if (slideCount <= 0) return null;

  let activeIndex = 0;
  let autoplayTimer = null;
  const motionQuery =
    typeof window.matchMedia === "function"
      ? window.matchMedia("(prefers-reduced-motion: reduce)")
      : { matches: false };
  const prefersReducedMotion = motionQuery.matches;
  const autoplayEnabled =
    root.dataset.showroomAutoplay === "true" && slideCount > 1 && !prefersReducedMotion;

  const goToSlide = (nextIndex) => {
    activeIndex = ((nextIndex % slideCount) + slideCount) % slideCount;
    syncShowroomSliderState(root, activeIndex, slideCount);
  };

  const stopAutoplay = () => {
    if (autoplayTimer) {
      window.clearInterval(autoplayTimer);
      autoplayTimer = null;
    }
  };

  const startAutoplay = () => {
    stopAutoplay();
    if (!autoplayEnabled) return;
    autoplayTimer = window.setInterval(() => {
      goToSlide(activeIndex + 1);
    }, AUTOPLAY_DELAY_MS);
  };

  root.querySelectorAll(".about-showroom-slider__bullet").forEach((bullet) => {
    bullet.addEventListener("click", () => {
      const targetIndex = Number(bullet.dataset.showroomIndex);
      if (Number.isNaN(targetIndex)) return;
      goToSlide(targetIndex);
      startAutoplay();
    });
  });

  root.addEventListener("mouseenter", stopAutoplay);
  root.addEventListener("mouseleave", startAutoplay);
  root.addEventListener("focusin", stopAutoplay);
  root.addEventListener("focusout", (event) => {
    if (!root.contains(event.relatedTarget)) {
      startAutoplay();
    }
  });

  syncShowroomSliderState(root, activeIndex, slideCount);
  startAutoplay();

  return { goToSlide, stopAutoplay, startAutoplay };
}
