/**
 * Tests unitaires — le logo marque de la fiche reste dans son slot.
 */
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const rootDir = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const css = readFileSync(resolve(rootDir, "styles/product-page.css"), "utf8");

describe("product brand logo containment", () => {
  it("caps the logo to the brand slot instead of 10rem", () => {
    expect(css).toMatch(
      /\.single-product-page\s+\.product-brand\s*\{[^}]*max-width:\s*6\.5rem/s
    );
    expect(css).toMatch(
      /\.single-product-page\s+\.product-brand__logo\s*\{[^}]*max-width:\s*100%/s
    );
    expect(css).not.toMatch(
      /\.single-product-page\s+\.product-brand__logo\s*\{[^}]*max-width:\s*10rem/s
    );
  });

  it("lets the summary column shrink in the product grid", () => {
    expect(css).toMatch(
      /\.single-product-page\s+\.single-product__summary\s*\{[^}]*min-width:\s*0/s
    );
  });
});
