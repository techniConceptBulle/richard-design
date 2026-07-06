// Slider hero page d'accueil — copie + médias synchronisés (aligné richard2026).

const AUTOPLAY_DELAY_MS = 5000;

/**
 * Met à jour l'état visuel et ARIA des slides et des puces.
 */
function syncHeroSliderState(root, index, slideCount) {
  const copyTrack = root.querySelector("[data-hero-copy-track]");
  const mediaTrack = root.querySelector("[data-hero-media-track]");
  const bullets = root.querySelectorAll(".hero-slider__bullet");
  const copySlides = root.querySelectorAll(".hero-slider__slide");
  const mediaSlides = root.querySelectorAll(".hero-slider__media-slide");

  if (copyTrack) {
    copyTrack.style.transform = `translate3d(-${index * 100}%, 0, 0)`;
  }

  if (mediaTrack) {
    mediaTrack.style.transform = `translate3d(-${index * 100}%, 0, 0)`;
  }

  bullets.forEach((bullet, bulletIndex) => {
    const isActive = bulletIndex === index;
    bullet.classList.toggle("is-active", isActive);
    bullet.setAttribute("aria-selected", isActive ? "true" : "false");
    bullet.tabIndex = isActive ? 0 : -1;
  });

  copySlides.forEach((slide, slideIndex) => {
    slide.setAttribute("aria-hidden", slideIndex === index ? "false" : "true");
  });

  mediaSlides.forEach((slide, slideIndex) => {
    slide.setAttribute("aria-hidden", slideIndex === index ? "false" : "true");
  });

  root.dataset.heroActiveIndex = String(index);
  root.dataset.heroSlideCount = String(slideCount);
}

/**
 * Initialise le slider hero split (texte + images).
 */
export function initHeroSlider(rootId = "home-hero-slider") {
  const root = document.getElementById(rootId);
  if (!root) return null;

  const slideCount = root.querySelectorAll(".hero-slider__slide").length;
  if (slideCount <= 0) return null;

  let activeIndex = 0;
  let autoplayTimer = null;
  const motionQuery =
    typeof window.matchMedia === "function"
      ? window.matchMedia("(prefers-reduced-motion: reduce)")
      : { matches: false };
  const prefersReducedMotion = motionQuery.matches;
  const autoplayEnabled = root.dataset.heroAutoplay === "true" && slideCount > 1 && !prefersReducedMotion;

  const goToSlide = (nextIndex) => {
    activeIndex = (nextIndex + slideCount) % slideCount;
    syncHeroSliderState(root, activeIndex, slideCount);
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

  root.querySelectorAll(".hero-slider__bullet").forEach((bullet) => {
    bullet.addEventListener("click", () => {
      const targetIndex = Number(bullet.dataset.heroIndex);
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

  document.addEventListener("keydown", (event) => {
    if (!root.contains(document.activeElement) && document.activeElement !== document.body) {
      return;
    }

    if (event.key === "ArrowRight") {
      goToSlide(activeIndex + 1);
      startAutoplay();
    }

    if (event.key === "ArrowLeft") {
      goToSlide(activeIndex - 1);
      startAutoplay();
    }
  });

  syncHeroSliderState(root, activeIndex, slideCount);
  startAutoplay();

  return { goToSlide, stopAutoplay, startAutoplay };
}
