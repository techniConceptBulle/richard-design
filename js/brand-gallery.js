/**
 * Galerie marque — masonry cliquable + lightbox avec navigation.
 */

/**
 * Échappe le HTML pour l’injection sécurisée.
 * @param {unknown} value
 * @returns {string}
 */
function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/**
 * Normalise la liste des images de galerie.
 * @param {unknown} gallery
 * @param {string} [fallbackAlt]
 * @returns {Array<{ src: string, alt: string }>}
 */
export function normalizeBrandGalleryItems(gallery, fallbackAlt = "Photo de la marque") {
  if (!Array.isArray(gallery)) return [];
  return gallery
    .filter((item) => item && typeof item.src === "string" && item.src.trim())
    .map((item) => ({
      src: item.src.trim(),
      alt: typeof item.alt === "string" && item.alt.trim() ? item.alt.trim() : fallbackAlt
    }));
}

/**
 * Calcule l’index suivant / précédent dans la galerie (boucle).
 * @param {number} currentIndex
 * @param {number} total
 * @param {"prev"|"next"} direction
 * @returns {number}
 */
export function getBrandGalleryNeighborIndex(currentIndex, total, direction) {
  if (!Number.isFinite(total) || total <= 0) return 0;
  const safeIndex = ((Number(currentIndex) % total) + total) % total;
  if (direction === "prev") {
    return (safeIndex - 1 + total) % total;
  }
  return (safeIndex + 1) % total;
}

/**
 * Construit le HTML de la lightbox marque.
 * @param {Array<{ src: string, alt: string }>} items
 * @param {number} activeIndex
 * @param {string} brandName
 * @returns {string}
 */
export function buildBrandLightboxHtml(items, activeIndex, brandName = "Marque") {
  const list = normalizeBrandGalleryItems(items, brandName);
  if (!list.length) return "";
  const index = Math.min(Math.max(0, Number(activeIndex) || 0), list.length - 1);
  const active = list[index];
  const showNav = list.length > 1;

  const safeName = escapeHtml(brandName);
  return `
    <div class="brand-lightbox" data-brand-lightbox-overlay>
      <div class="brand-lightbox__dialog" role="dialog" aria-modal="true" aria-label="Galerie ${safeName}">
        <button type="button" class="brand-lightbox__close" data-brand-lightbox-close aria-label="Fermer la galerie">×</button>
        ${
          showNav
            ? `
          <button type="button" class="brand-lightbox__arrow brand-lightbox__arrow--prev" data-brand-lightbox-direction="prev" aria-label="Image précédente">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 6 9 12l6 6" fill="none" stroke="currentColor" stroke-width="2"/></svg>
          </button>
        `
            : ""
        }
        <div class="brand-lightbox__media">
          <img src="${escapeHtml(active.src)}" alt="${escapeHtml(active.alt)}" class="brand-lightbox__image" />
        </div>
        ${
          showNav
            ? `
          <button type="button" class="brand-lightbox__arrow brand-lightbox__arrow--next" data-brand-lightbox-direction="next" aria-label="Image suivante">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 6l6 6-6 6" fill="none" stroke="currentColor" stroke-width="2"/></svg>
          </button>
        `
            : ""
        }
        <p class="brand-lightbox__counter" aria-live="polite">${index + 1} / ${list.length}</p>
      </div>
    </div>
  `.trim();
}

/**
 * Initialise les interactions lightbox sur un conteneur de galerie.
 * @param {HTMLElement|null} galleryRoot
 * @param {HTMLElement|null} lightboxRoot
 * @param {Array<{ src: string, alt: string }>} items
 * @param {string} brandName
 * @returns {() => void} cleanup
 */
export function initBrandGalleryLightbox(galleryRoot, lightboxRoot, items, brandName) {
  const list = normalizeBrandGalleryItems(items, brandName);
  if (!galleryRoot || !lightboxRoot || !list.length) {
    return () => {};
  }

  let activeIndex = 0;
  let isOpen = false;

  const render = () => {
    if (!isOpen) {
      lightboxRoot.innerHTML = "";
      lightboxRoot.hidden = true;
      document.body.classList.remove("brand-lightbox-open");
      return;
    }
    lightboxRoot.hidden = false;
    document.body.classList.add("brand-lightbox-open");
    lightboxRoot.innerHTML = buildBrandLightboxHtml(list, activeIndex, brandName);

    lightboxRoot.querySelector("[data-brand-lightbox-overlay]")?.addEventListener("click", (event) => {
      if (event.target === event.currentTarget) {
        isOpen = false;
        render();
      }
    });

    lightboxRoot.querySelectorAll("[data-brand-lightbox-close]").forEach((el) => {
      el.addEventListener("click", () => {
        isOpen = false;
        render();
      });
    });

    lightboxRoot.querySelectorAll("[data-brand-lightbox-direction]").forEach((button) => {
      button.addEventListener("click", () => {
        const direction = button.getAttribute("data-brand-lightbox-direction") === "prev" ? "prev" : "next";
        activeIndex = getBrandGalleryNeighborIndex(activeIndex, list.length, direction);
        render();
      });
    });
  };

  const onGalleryClick = (event) => {
    const trigger = event.target.closest("[data-brand-gallery-index]");
    if (!trigger || !galleryRoot.contains(trigger)) return;
    activeIndex = Number(trigger.getAttribute("data-brand-gallery-index")) || 0;
    isOpen = true;
    render();
  };

  const onKeyDown = (event) => {
    if (!isOpen) return;
    if (event.key === "Escape") {
      isOpen = false;
      render();
      return;
    }
    if (event.key === "ArrowLeft") {
      activeIndex = getBrandGalleryNeighborIndex(activeIndex, list.length, "prev");
      render();
    }
    if (event.key === "ArrowRight") {
      activeIndex = getBrandGalleryNeighborIndex(activeIndex, list.length, "next");
      render();
    }
  };

  galleryRoot.addEventListener("click", onGalleryClick);
  document.addEventListener("keydown", onKeyDown);

  return () => {
    galleryRoot.removeEventListener("click", onGalleryClick);
    document.removeEventListener("keydown", onKeyDown);
    isOpen = false;
    lightboxRoot.innerHTML = "";
    lightboxRoot.hidden = true;
    document.body.classList.remove("brand-lightbox-open");
  };
}
