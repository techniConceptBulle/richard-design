/**
 * Tests unitaires — génération des pages /categorie/{slug}.html au build.
 */
import { describe, expect, it } from "vitest";
import {
  emitBrandStaticPages,
  emitCategoryStaticPages,
  emitProductStaticPages,
  getCategoryStaticPagePaths,
  injectCategorySlugAttribute
} from "../../js/category-static-pages.js";
import { mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

describe("getCategoryStaticPagePaths", () => {
  it("maps each category slug to categorie/{slug}.html", () => {
    expect(
      getCategoryStaticPagePaths([{ slug: "matelas" }, { slug: "sommier" }])
    ).toEqual(["categorie/matelas.html", "categorie/sommier.html"]);
  });

  it("returns empty list for invalid or empty input", () => {
    expect(getCategoryStaticPagePaths([])).toEqual([]);
    expect(getCategoryStaticPagePaths(null)).toEqual([]);
    expect(getCategoryStaticPagePaths([{ slug: "" }, {}])).toEqual([]);
  });
});

describe("injectCategorySlugAttribute", () => {
  it("adds data-category-slug on category body", () => {
    const html = '<body class="page" data-page="category">';
    expect(injectCategorySlugAttribute(html, "matelas")).toContain(
      'data-page="category" data-category-slug="matelas"'
    );
  });

  it("returns original html when slug is empty", () => {
    const html = '<body data-page="category">';
    expect(injectCategorySlugAttribute(html, "")).toBe(html);
  });
});

describe("emitCategoryStaticPages", () => {
  it("writes category.html copies with data-category-slug", () => {
    const root = mkdtempSync(join(tmpdir(), "rd-cat-pages-"));
    const outDir = join(root, "dist");
    mkdirSync(join(outDir, "pages"), { recursive: true });
    writeFileSync(
      join(outDir, "pages/category.html"),
      '<html><body class="page" data-page="category"></body></html>',
      "utf8"
    );
    const categoriesPath = join(root, "categories.json");
    writeFileSync(
      categoriesPath,
      JSON.stringify([{ slug: "matelas" }, { slug: "lit" }]),
      "utf8"
    );

    const written = emitCategoryStaticPages(outDir, categoriesPath);

    expect(written).toEqual(["categorie/matelas.html", "categorie/lit.html"]);
    const matelasHtml = readFileSync(join(outDir, "categorie/matelas.html"), "utf8");
    expect(matelasHtml).toContain('data-category-slug="matelas"');
    expect(readFileSync(join(outDir, "categorie/lit.html"), "utf8")).toContain(
      'data-category-slug="lit"'
    );

    rmSync(root, { recursive: true, force: true });
  });

  it("returns empty when category.html is missing", () => {
    const root = mkdtempSync(join(tmpdir(), "rd-cat-pages-missing-"));
    const written = emitCategoryStaticPages(join(root, "dist"), join(root, "missing.json"));
    expect(written).toEqual([]);
    rmSync(root, { recursive: true, force: true });
  });
});

describe("emitProductStaticPages", () => {
  it("writes product.html copies with data-product-slug", () => {
    const root = mkdtempSync(join(tmpdir(), "rd-prod-pages-"));
    const outDir = join(root, "dist");
    mkdirSync(join(outDir, "pages"), { recursive: true });
    writeFileSync(
      join(outDir, "pages/product.html"),
      '<html><body class="page" data-page="product"></body></html>',
      "utf8"
    );
    const productsPath = join(root, "products.json");
    writeFileSync(productsPath, JSON.stringify([{ slug: "matelas-superba-elegance" }]), "utf8");

    const written = emitProductStaticPages(outDir, productsPath);

    expect(written).toEqual(["produit/matelas-superba-elegance.html"]);
    expect(
      readFileSync(join(outDir, "produit/matelas-superba-elegance.html"), "utf8")
    ).toContain('data-product-slug="matelas-superba-elegance"');

    rmSync(root, { recursive: true, force: true });
  });
});

describe("emitBrandStaticPages", () => {
  it("writes brand.html copies with data-brand-slug", () => {
    const root = mkdtempSync(join(tmpdir(), "rd-brand-pages-"));
    const outDir = join(root, "dist");
    mkdirSync(join(outDir, "pages"), { recursive: true });
    writeFileSync(
      join(outDir, "pages/brand.html"),
      '<html><body class="page" data-page="brand"></body></html>',
      "utf8"
    );
    const brandsPath = join(root, "brands.json");
    writeFileSync(brandsPath, JSON.stringify([{ slug: "roviva" }]), "utf8");

    const written = emitBrandStaticPages(outDir, brandsPath);

    expect(written).toEqual(["marque/roviva.html"]);
    expect(readFileSync(join(outDir, "marque/roviva.html"), "utf8")).toContain(
      'data-brand-slug="roviva"'
    );

    rmSync(root, { recursive: true, force: true });
  });
});
