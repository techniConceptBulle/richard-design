/**
 * Tests unitaires — dossiers copiés par le plugin Vite post-build.
 */
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const viteConfigPath = resolve(
  dirname(fileURLToPath(import.meta.url)),
  "../../vite.config.js"
);

describe("vite static copy dirs", () => {
  it("copies only data and assets, not deprecated homepage or product", () => {
    const source = readFileSync(viteConfigPath, "utf8");

    expect(source).toContain("STATIC_COPY_DIRS = ['data', 'assets']");
    expect(source).not.toContain("'homepage'");
    expect(source).not.toContain("'product'");
  });

  it("rewrites pretty category, product and brand paths in dev and preview", () => {
    const source = readFileSync(viteConfigPath, "utf8");

    expect(source).toContain("prettyUrlPlugin");
    expect(source).toContain("configurePreviewServer");
    expect(source).toContain("/pages/category.html");
    expect(source).toContain("/pages/product.html");
    expect(source).toContain("/pages/brand.html");
    expect(source).toContain("prefix: 'categorie'");
    expect(source).toContain("prefix: 'produit'");
    expect(source).toContain("prefix: 'marque'");
    expect(source).toContain("bareRoot");
  });

  it("emits physical pretty URL files after build", () => {
    const source = readFileSync(viteConfigPath, "utf8");

    expect(source).toContain("emitCategoryStaticPages");
    expect(source).toContain("emitProductStaticPages");
    expect(source).toContain("emitBrandStaticPages");
    expect(source).toContain("data/categories.json");
    expect(source).toContain("data/products.json");
    expect(source).toContain("data/brands.json");
  });

  it("skips missing directories during copy", () => {
    const source = readFileSync(viteConfigPath, "utf8");

    expect(source).toContain("existsSync(src)");
  });
});
