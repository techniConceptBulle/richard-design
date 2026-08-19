/**
 * Tests unitaires — logo marque fiche produit et bandeau accueil.
 */
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { buildFeaturedBrandSlidesHtml } from "../../js/brand-carousel.js";
import { getBrandLogoSrc, getFeaturedBrands } from "../../js/brands-page.js";

const rootDir = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const css = readFileSync(resolve(rootDir, "styles/product-page.css"), "utf8");
const brands = JSON.parse(readFileSync(resolve(rootDir, "data/brands.json"), "utf8"));

describe("product brand logo containment", () => {
  it("caps the logo to the brand slot instead of 10rem", () => {
    expect(css).toMatch(
      /\.single-product-page\s+\.product-summary__header\s*\{[^}]*grid-template-columns:\s*minmax\(0,\s*1fr\)\s*auto/s
    );
    expect(css).toMatch(
      /\.single-product-page\s+\.product-brand\s*\{[^}]*max-width:\s*9rem/s
    );
    expect(css).toMatch(
      /\.single-product-page\s+\.product-brand__logo\s*\{[^}]*max-width:\s*100%/s
    );
    expect(css).toMatch(
      /\.single-product-page\s+\.product-brand__logo\s*\{[^}]*max-height:\s*3\.5rem/s
    );
    expect(css).not.toMatch(
      /\.single-product-page\s+\.product-brand\s*\{[^}]*position:\s*absolute/s
    );
  });

  it("lets the summary column shrink in the product grid", () => {
    expect(css).toMatch(
      /\.single-product-page\s+\.single-product__summary\s*\{[^}]*min-width:\s*0/s
    );
  });
});

describe("product and home brand logo source", () => {
  it("returns the brands.json logo path from getBrandLogoSrc", () => {
    const roviva = brands.find((brand) => brand.slug === "roviva");
    expect(getBrandLogoSrc(roviva)).toBe(roviva.logo);
    expect(getBrandLogoSrc({})).toBe("");
    expect(getBrandLogoSrc(null)).toBe("");
  });

  it("uses the same logo URL in the home slider and on product pages", () => {
    const featured = getFeaturedBrands(brands);
    const html = buildFeaturedBrandSlidesHtml(featured);

    featured.forEach((brand) => {
      const logoSrc = getBrandLogoSrc(brand);
      expect(logoSrc).not.toBe("");
      expect(html).toContain(`src="${logoSrc}"`);
    });
  });
});
