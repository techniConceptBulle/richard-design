/**
 * Tests unitaires — style de l'option selectionnee sur la fiche produit.
 * Vert menu actif (#27745d) + texte blanc, chips uniquement (pas les select).
 */
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const rootDir = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const productCss = readFileSync(resolve(rootDir, "styles/product-page.css"), "utf8");
const navCss = readFileSync(resolve(rootDir, "styles/richard-design.css"), "utf8");

describe("product option selected style", () => {
  it("uses the same green as the active catalogue nav item on chips", () => {
    expect(navCss).toMatch(
      /\.nav-primary\s+\.menu-inner\s*>\s*li\s*>\s*\.menu-link--active[^}]*background:\s*#27745d/s
    );
    expect(productCss).toMatch(
      /\.single-product-page\s+\.product-chip\.active\s*\{[^}]*background:\s*#27745d/s
    );
    expect(productCss).toMatch(
      /\.single-product-page\s+\.product-chip\.active\s*\{[^}]*color:\s*#fff/s
    );
  });

  it("does not apply the green selected fill to select fields", () => {
    expect(productCss).toMatch(
      /\.single-product-page\s+\.product-option-card__select\.is-selected\s*\{[^}]*background:\s*transparent/s
    );
    expect(productCss).not.toMatch(
      /\.single-product-page\s+\.product-option-card__select\.is-selected\s*\{[^}]*background:\s*#27745d/s
    );
    expect(productCss).not.toMatch(
      /\.single-product-page\s+\.product-option-card__select\.is-selected\s*\{[^}]*color:\s*#fff/s
    );
  });

  it("does not keep the previous navy selected border on chips", () => {
    expect(productCss).not.toMatch(
      /\.single-product-page\s+\.product-chip\.active\s*\{[^}]*--product-control-border-selected/s
    );
    expect(productCss).not.toMatch(
      /\.single-product-page\s+\.product-chip\.active\s*\{[^}]*background:\s*transparent/s
    );
  });
});
