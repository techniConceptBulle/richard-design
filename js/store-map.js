/**
 * Carte Leaflet du magasin (page expert / magasin Crissier).
 * Tuiles Carto Positron + marqueur personnalisé.
 */

const LEAFLET_JS = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
const LEAFLET_INTEGRITY = "sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=";

/** Coordonnées par défaut — Rue des Alpes 2, Crissier. */
export const STORE_MAP_DEFAULTS = {
  lat: 46.54555,
  lng: 6.57555,
  zoom: 16
};

/**
 * Charge le script Leaflet une seule fois (CDN).
 * @returns {Promise<typeof window.L>}
 */
function loadLeaflet() {
  if (typeof window !== "undefined" && window.L) {
    return Promise.resolve(window.L);
  }

  return new Promise((resolve, reject) => {
    const existing = document.querySelector(`script[src="${LEAFLET_JS}"]`);
    if (existing) {
      existing.addEventListener("load", () => resolve(window.L));
      existing.addEventListener("error", () => reject(new Error("Leaflet load failed")));
      return;
    }

    const script = document.createElement("script");
    script.src = LEAFLET_JS;
    script.integrity = LEAFLET_INTEGRITY;
    script.crossOrigin = "";
    script.async = true;
    script.onload = () => resolve(window.L);
    script.onerror = () => reject(new Error("Leaflet load failed"));
    document.head.appendChild(script);
  });
}

/**
 * Parse lat/lng depuis les data-attributes d'une section.
 * @param {HTMLElement} root
 * @returns {{ lat: number, lng: number }}
 */
export function parseStoreMapCoords(root) {
  const lat = Number.parseFloat(root?.dataset?.lat ?? "");
  const lng = Number.parseFloat(root?.dataset?.lng ?? "");

  return {
    lat: Number.isFinite(lat) ? lat : STORE_MAP_DEFAULTS.lat,
    lng: Number.isFinite(lng) ? lng : STORE_MAP_DEFAULTS.lng
  };
}

/**
 * Initialise toutes les cartes magasin présentes dans le document.
 * @param {ParentNode} [scope=document]
 * @returns {Promise<number>} nombre de cartes initialisées
 */
export async function initStoreMaps(scope = document) {
  const roots = scope.querySelectorAll("[data-store-map]");
  if (!roots.length) return 0;

  let L;
  try {
    L = await loadLeaflet();
  } catch {
    return 0;
  }

  if (!L) return 0;

  let count = 0;
  roots.forEach((root) => {
    const canvas = root.querySelector("[data-store-map-canvas]");
    if (!canvas || canvas.dataset.mapReady === "true") return;

    const { lat, lng } = parseStoreMapCoords(root);
    const map = L.map(canvas, {
      scrollWheelZoom: false,
      attributionControl: true
    }).setView([lat, lng], STORE_MAP_DEFAULTS.zoom);

    L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
      subdomains: "abcd",
      maxZoom: 20
    }).addTo(map);

    const markerHtml = `
      <span class="about-store-map__pin" aria-hidden="true">
        <svg viewBox="0 0 24 36" width="28" height="42" focusable="false">
          <path fill="currentColor" d="M12 0C5.9 0 1 4.9 1 11c0 8.3 11 25 11 25s11-16.7 11-25C23 4.9 18.1 0 12 0zm0 15.5a4.5 4.5 0 1 1 0-9 4.5 4.5 0 0 1 0 9z"/>
        </svg>
      </span>
    `;

    const icon = L.divIcon({
      className: "about-store-map__marker",
      html: markerHtml,
      iconSize: [28, 42],
      iconAnchor: [14, 42]
    });

    L.marker([lat, lng], { icon }).addTo(map);
    canvas.dataset.mapReady = "true";
    count += 1;

    // Invalidate après layout (carte dans une grille responsive)
    requestAnimationFrame(() => map.invalidateSize());
  });

  return count;
}
