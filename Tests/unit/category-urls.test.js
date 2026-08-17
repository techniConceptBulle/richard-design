/**
 * Tests unitaires — helpers d'URL catégories (/categorie/{slug}.html).
 */
import { describe, expect, it } from "vitest";
import { getCategorySlugFromLocation, getCategoryUrl } from "../../js/utils.js";

describe("getCategoryUrl", () => {
  it("returns pretty path with .html for a valid slug", () => {
    expect(getCategoryUrl("matelas")).toBe("/categorie/matelas.html");
  });

  it("returns trailing path when slug is empty", () => {
    expect(getCategoryUrl("")).toBe("/categorie/");
    expect(getCategoryUrl(undefined)).toBe("/categorie/");
  });

  it("encodes special characters in slug", () => {
    expect(getCategoryUrl("offre spéciale")).toBe(
      `/categorie/${encodeURIComponent("offre spéciale")}.html`
    );
  });
});

describe("getCategorySlugFromLocation", () => {
  it("reads slug from /categorie/{slug}.html pathname", () => {
    expect(
      getCategorySlugFromLocation({ pathname: "/categorie/matelas.html", search: "" })
    ).toBe("matelas");
  });

  it("still reads extensionless /categorie/{slug} for compatibility", () => {
    expect(
      getCategorySlugFromLocation({ pathname: "/categorie/matelas", search: "" })
    ).toBe("matelas");
  });

  it("reads legacy ?slug= only on category.html", () => {
    expect(
      getCategorySlugFromLocation({
        pathname: "/pages/category.html",
        search: "?slug=sommier"
      })
    ).toBe("sommier");
    expect(
      getCategorySlugFromLocation({
        pathname: "/pages/category.html/",
        search: "?slug=lit"
      })
    ).toBe("lit");
  });

  it("returns undefined for missing slug and non-category pages", () => {
    expect(
      getCategorySlugFromLocation({ pathname: "/categorie/", search: "" })
    ).toBeUndefined();
    expect(
      getCategorySlugFromLocation({
        pathname: "/pages/product.html",
        search: "?slug=matelas"
      })
    ).toBeUndefined();
    expect(
      getCategorySlugFromLocation({ pathname: "/pages/category.html", search: "" })
    ).toBeUndefined();
  });

  it("prefers path slug over query when both are present", () => {
    expect(
      getCategorySlugFromLocation({
        pathname: "/categorie/lit.html",
        search: "?slug=matelas"
      })
    ).toBe("lit");
  });

  it("reads data-category-slug only when readDocumentSlug is enabled", () => {
    const originalDocument = globalThis.document;
    globalThis.document = {
      body: { dataset: { categorySlug: "matelas" } }
    };

    expect(
      getCategorySlugFromLocation({ pathname: "/proxy/weird", search: "" })
    ).toBeUndefined();
    expect(
      getCategorySlugFromLocation(
        { pathname: "/proxy/weird", search: "" },
        { readDocumentSlug: true }
      )
    ).toBe("matelas");

    globalThis.document = originalDocument;
  });

  it("does not apply document slug when parsing a different href pathname", () => {
    const originalDocument = globalThis.document;
    globalThis.document = {
      body: { dataset: { categorySlug: "lit" } }
    };

    expect(
      getCategorySlugFromLocation({ pathname: "/categorie/matelas.html", search: "" })
    ).toBe("matelas");

    globalThis.document = originalDocument;
  });

  it("reads slug when pathname has a proxy prefix", () => {
    expect(
      getCategorySlugFromLocation({
        pathname: "/proxy/view/categorie/sommier.html",
        search: ""
      })
    ).toBe("sommier");
  });
});
