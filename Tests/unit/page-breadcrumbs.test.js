/**
 * Tests unitaires — fil d'Ariane sur les pages et largeur colonne fondateur.
 */
import { readFileSync, readdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const rootDir = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const pagesDir = resolve(rootDir, "pages");

/**
 * Lit un fichier HTML de pages/.
 * @param {string} fileName Nom du fichier
 * @returns {string} Contenu
 */
function readPage(fileName) {
  return readFileSync(resolve(pagesDir, fileName), "utf8");
}

describe("page breadcrumbs", () => {
  // product.html est un shell vide : le fil d'Ariane est injecté par render.js
  const pagesWithStaticBreadcrumb = [
    "expert-literie-crissier.html",
    "magasin-crissier.html",
    "services-premium.html",
    "produits-literie.html",
    "brands.html",
    "brand.html",
    "cart.html",
    "checkout.html",
    "contact.html",
    "advice.html",
    "account.html",
    "privacy.html",
    "terms.html",
    "category.html",
  ];
  const pagesWithDynamicBreadcrumb = ["product.html"];

  it.each(pagesWithStaticBreadcrumb)("%s includes a Fil d'Ariane breadcrumb", (fileName) => {
    const html = readPage(fileName);
    expect(html).toMatch(/aria-label="Fil d'Ariane"/);
    expect(html).toMatch(/class="[^"]*\bbreadcrumb\b/);
    expect(html).toContain('href="/"');
  });

  it("product page markup in render.js includes Fil d'Ariane", () => {
    const renderJs = readFileSync(resolve(rootDir, "js/render.js"), "utf8");
    expect(renderJs).toMatch(
      /class="breadcrumb product-page-breadcrumb"[^>]*aria-label="Fil d'Ariane"/
    );
  });

  it("skips only redirect and keeps all content pages covered", () => {
    const htmlFiles = readdirSync(pagesDir).filter((f) => f.endsWith(".html"));
    const covered = new Set([
      ...pagesWithStaticBreadcrumb,
      ...pagesWithDynamicBreadcrumb,
    ]);
    const exempt = new Set(["about.html"]);
    const missing = htmlFiles.filter((f) => !exempt.has(f) && !covered.has(f));
    expect(missing).toEqual([]);
  });
});

describe("expert founder column width", () => {
  it("widens the founder photo column beyond the previous 24rem cap", () => {
    const aboutCss = readFileSync(resolve(rootDir, "styles/about-page.css"), "utf8");
    expect(aboutCss).toMatch(
      /\.about-founder-story__grid\s*\{[^}]*minmax\(0,\s*36rem\)/s
    );
    expect(aboutCss).not.toMatch(
      /\.about-founder-story__grid\s*\{[^}]*minmax\(0,\s*24rem\)/s
    );
  });
});
