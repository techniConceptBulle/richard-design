// Synchronisation du décalage body ↔ enveloppe fixe (évite l'espace blanc sous le menu).

/**
 * Applique la hauteur mesurée de l'enveloppe comme padding-top de page.
 */
export function applyEnvelopeOffset(heightPx) {
  const safeHeight = Math.max(0, Math.ceil(heightPx));
  document.documentElement.style.setProperty("--envelope-offset", `${safeHeight}px`);
}

/**
 * Mesure l'enveloppe site et met à jour --envelope-offset.
 */
export function measureEnvelopeOffset(envelopeEl) {
  if (!envelopeEl) return 0;

  const height = envelopeEl.getBoundingClientRect().height;
  applyEnvelopeOffset(height);
  return height;
}

/**
 * Observe l'enveloppe pour recalculer le décalage (resize, logo, menu promo).
 */
export function initEnvelopeOffset(headerEl) {
  const envelope = headerEl?.querySelector(".site-envelope");
  if (!envelope) return;

  const sync = () => {
    measureEnvelopeOffset(envelope);
  };

  sync();

  if (typeof ResizeObserver !== "undefined") {
    const observer = new ResizeObserver(sync);
    observer.observe(envelope);
  } else {
    window.addEventListener("resize", sync);
  }

  envelope.querySelectorAll("img").forEach((img) => {
    if (!img.complete) {
      img.addEventListener("load", sync, { once: true });
    }
  });

  window.addEventListener("load", sync, { once: true });
}
