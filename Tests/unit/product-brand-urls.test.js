/**
 * Tests unitaires — helpers d'URL produits et marques.
 */
import { describe, expect, it } from "vitest";
import {
  getBrandSlugFromLocation,
  getBrandUrl,
  getProductSlugFromLocation,
  getProductUrl
} from "../../js/utils.js";

describe("getProductUrl", () => {
  it("returns pretty path with .html for a valid slug", () => {
    expect(getProductUrl("matelas-superba-elegance")).toBe(
      "/produit/matelas-superba-elegance.html"
    );
  });

  it("returns trailing path when slug is empty", () => {
    expect(getProductUrl("")).toBe("/produit/");
    expect(getProductUrl(undefined)).toBe("/produit/");
  });
});

describe("getBrandUrl", () => {
  it("returns pretty path with .html for a valid slug", () => {
    expect(getBrandUrl("roviva")).toBe("/marque/roviva.html");
  });

  it("returns trailing path when slug is empty", () => {
    expect(getBrandUrl("")).toBe("/marque/");
  });
});

describe("getProductSlugFromLocation", () => {
  it("reads slug from /produit/{slug}.html", () => {
    expect(
      getProductSlugFromLocation({
        pathname: "/produit/matelas-superba-elegance.html",
        search: ""
      })
    ).toBe("matelas-superba-elegance");
  });

  it("reads data-product-slug only when readDocumentSlug is enabled", () => {
    const originalDocument = globalThis.document;
    globalThis.document = {
      body: { dataset: { productSlug: "matelas-superba-elegance" } }
    };

    expect(
      getProductSlugFromLocation({ pathname: "/proxy/weird", search: "" })
    ).toBeUndefined();
    expect(
      getProductSlugFromLocation(
        { pathname: "/proxy/weird", search: "" },
        { readDocumentSlug: true }
      )
    ).toBe("matelas-superba-elegance");

    globalThis.document = originalDocument;
  });

  it("reads legacy ?slug= on product.html", () => {
    expect(
      getProductSlugFromLocation({
        pathname: "/pages/product.html",
        search: "?slug=matelas-superba-elegance"
      })
    ).toBe("matelas-superba-elegance");
  });
});

describe("getBrandSlugFromLocation", () => {
  it("reads slug from /marque/{slug}.html", () => {
    expect(
      getBrandSlugFromLocation({ pathname: "/marque/roviva.html", search: "" })
    ).toBe("roviva");
  });

  it("reads data-brand-slug only when readDocumentSlug is enabled", () => {
    const originalDocument = globalThis.document;
    globalThis.document = {
      body: { dataset: { brandSlug: "roviva" } }
    };

    expect(
      getBrandSlugFromLocation({ pathname: "/proxy/weird", search: "" })
    ).toBeUndefined();
    expect(
      getBrandSlugFromLocation(
        { pathname: "/proxy/weird", search: "" },
        { readDocumentSlug: true }
      )
    ).toBe("roviva");

    globalThis.document = originalDocument;
  });
});
