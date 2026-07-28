/**
 * Tests unitaires — tokens de largeur, gouttières et shells de page.
 * Une seule largeur de shell (90rem) + gouttières homogènes.
 */
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const rootDir = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const stylesDir = resolve(rootDir, "styles");
const pagesDir = resolve(rootDir, "pages");

/**
 * Lit un fichier CSS du dossier styles.
 * @param {string} fileName Nom du fichier
 * @returns {string} Contenu
 */
function readStyle(fileName) {
  return readFileSync(resolve(stylesDir, fileName), "utf8");
}

/**
 * Lit une page HTML.
 * @param {string} fileName Nom sous pages/ ou index.html
 * @returns {string} Contenu HTML
 */
function readPage(fileName) {
  if (fileName === "index.html") {
    return readFileSync(resolve(rootDir, "index.html"), "utf8");
  }
  return readFileSync(resolve(pagesDir, fileName), "utf8");
}

/**
 * Extrait la valeur d’une custom property CSS.
 * @param {string} source Contenu CSS
 * @param {string} tokenName Nom sans --
 * @returns {string|null} Valeur ou null
 */
function extractTokenValue(source, tokenName) {
  const pattern = new RegExp(`--${tokenName}\\s*:\\s*([^;]+);`);
  const match = source.match(pattern);
  return match ? match[1].trim() : null;
}

describe("layout width tokens", () => {
  const tokens = readStyle("tokens.css");

  it("defines shell width at 90rem", () => {
    expect(extractTokenValue(tokens, "layout-max-width")).toBe("90rem");
    expect(extractTokenValue(tokens, "content-wide-width")).toBe("90rem");
  });

  it("keeps content-max-width for text blocks without changing shell ceiling", () => {
    expect(extractTokenValue(tokens, "content-max-width")).toBe("72rem");
  });

  it("defines unified gutter scale", () => {
    expect(extractTokenValue(tokens, "gutter")).toBe("1.25rem");
    expect(extractTokenValue(tokens, "gutter-md")).toBe("1.5rem");
    expect(extractTokenValue(tokens, "gutter-lg")).toBe("2rem");
  });
});

describe("shared shell utilities", () => {
  const base = readStyle("base.css");

  it("applies the same max-width to layout-wide, layout-content and container", () => {
    expect(base).toMatch(
      /\.layout-wide,\s*\n\s*\.layout-content,\s*\n\s*\.container\s*\{[^}]*max-width:\s*var\(--layout-max-width\)/s
    );
  });

  it("shares the same gutter scale on all shells", () => {
    expect(base).toMatch(
      /\.layout-wide,\s*\n\s*\.layout-content,\s*\n\s*\.container\s*\{[^}]*padding-inline:\s*var\(--gutter\)/s
    );
    expect(base).toMatch(/padding-inline:\s*var\(--gutter-md\)/);
    expect(base).toMatch(/padding-inline:\s*var\(--gutter-lg\)/);
  });

  it("does not force about shells to content-max-width", () => {
    const about = readStyle("about-page.css");
    expect(about).not.toMatch(
      /\.about-page\s+\.layout-(?:wide|content)\s*\{[^}]*max-width:\s*var\(--content-max-width\)/s
    );
  });
});

describe("page shell assignments", () => {
  const pages = [
    "index.html",
    "category.html",
    "brands.html",
    "brand.html",
    "product.html",
    "cart.html",
    "checkout.html",
    "contact.html",
    "privacy.html",
    "terms.html",
    "account.html",
    "advice.html",
    "expert-literie-crissier.html",
    "magasin-crissier.html",
    "services-premium.html",
    "produits-literie.html",
  ];

  it.each(pages)("%s uses layout-wide shell", (fileName) => {
    expect(readPage(fileName)).toContain("layout-wide");
  });

  it("expert page shells are not layout-content", () => {
    expect(readPage("expert-literie-crissier.html")).not.toContain("layout-content");
  });
});
