/**
 * Tests unitaires — génération des pages /categorie/{slug}.html au build.
 */
import { describe, expect, it } from "vitest";
import {
  emitCategoryStaticPages,
  getCategoryStaticPagePaths
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

describe("emitCategoryStaticPages", () => {
  it("writes category.html copies under dist/categorie/", () => {
    const root = mkdtempSync(join(tmpdir(), "rd-cat-pages-"));
    const outDir = join(root, "dist");
    mkdirSync(join(outDir, "pages"), { recursive: true });
    writeFileSync(join(outDir, "pages/category.html"), "<html>category</html>", "utf8");
    const categoriesPath = join(root, "categories.json");
    writeFileSync(
      categoriesPath,
      JSON.stringify([{ slug: "matelas" }, { slug: "lit" }]),
      "utf8"
    );

    const written = emitCategoryStaticPages(outDir, categoriesPath);

    expect(written).toEqual(["categorie/matelas.html", "categorie/lit.html"]);
    expect(readFileSync(join(outDir, "categorie/matelas.html"), "utf8")).toBe(
      "<html>category</html>"
    );
    expect(readFileSync(join(outDir, "categorie/lit.html"), "utf8")).toBe(
      "<html>category</html>"
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
