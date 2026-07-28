/**
 * Tests unitaires — mapping des pictogrammes PNG brandés sur le site.
 * Hors scope : panier, calendrier RDV.
 */
import { existsSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "../..");

/** Chemins PNG attendus pour le bandeau services home. */
const HOME_SERVICE_ICONS = [
  "/assets/icons/essai-a-domicile.png",
  "/assets/icons/livraison-rapide.png",
  "/assets/icons/conseils.png",
  "/assets/icons/garantie-satisfaction.png"
];

/** Chemins PNG des cartes services premium (dont garantie fabricants). */
const PREMIUM_SERVICE_ICONS = [
  "/assets/icons/conseils.png",
  "/assets/icons/essai-a-domicile.png",
  "/assets/icons/livraison-rapide.png",
  "/assets/icons/garantie-satisfaction.png",
  "/assets/icons/expertise.png"
];

describe("site pictograms", () => {
  it("keeps branded PNG files available under assets/icons", () => {
    const required = [
      "essai-a-domicile.png",
      "livraison-rapide.png",
      "conseils.png",
      "garantie-satisfaction.png",
      "expertise.png",
      "entreprise-familiale.png",
      "magasin.png",
      "broche-de-localisation.png",
      "appel.png",
      "enveloppe.png"
    ];

    for (const name of required) {
      expect(existsSync(resolve(root, "assets/icons", name))).toBe(true);
    }
  });

  it("wires home services and history facts to branded PNG paths", () => {
    const html = readFileSync(resolve(root, "index.html"), "utf8");

    for (const src of HOME_SERVICE_ICONS) {
      expect(html).toContain(`src="${src}"`);
    }
    expect(html).toContain('src="/assets/icons/expertise.png"');
    expect(html).toContain('src="/assets/icons/entreprise-familiale.png"');
    expect(html).toContain('src="/assets/icons/magasin.png"');
    expect(html).toContain('src="/assets/icons/broche-de-localisation.png"');
    expect(html).not.toMatch(/history__fact-icon[^>]*>⌖</);
  });

  it("wires premium service cards on the premium page", () => {
    const html = readFileSync(resolve(root, "pages/services-premium.html"), "utf8");
    for (const src of PREMIUM_SERVICE_ICONS) {
      expect(html).toContain(`src="${src}"`);
    }
    expect(html).not.toContain("about-premium-card__badge");
    expect(html).not.toContain("/assets/icons/services/customer-service-woman.svg");
  });

  it("wires product advice pictograms without touching cart service SVGs", () => {
    const render = readFileSync(resolve(root, "js/render.js"), "utf8");

    expect(render).toContain('src="/assets/icons/appel.png"');
    expect(render).toContain('src="/assets/icons/enveloppe.png"');
    expect(render).toContain('src="/assets/icons/magasin.png"');
    // Panier inchangé
    expect(render).toContain('icon: "/assets/icons/services/truck.svg"');
    expect(render).toContain('icon: "/assets/icons/services/recycle.svg"');
    expect(render).toContain('icon: "/assets/icons/services/warranty.svg"');
  });
});
