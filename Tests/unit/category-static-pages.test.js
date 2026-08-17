/**
 * Tests unitaires — génération des pages /categorie/{slug}.html au build.
 */
import { describe, expect, it } from "vitest";
import {
  emitCategoryStaticPages,
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
