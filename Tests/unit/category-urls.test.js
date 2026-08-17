/**
 * Tests unitaires — helpers d'URL catégories (/categorie/{slug}).
 */
import { describe, expect, it } from "vitest";
import { getCategorySlugFromLocation, getCategoryUrl } from "../../js/utils.js";

describe("getCategoryUrl", () => {
  it("returns pretty path for a valid slug", () => {
    expect(getCategoryUrl("matelas")).toBe("/categorie/matelas");
  });

  it("returns trailing path when slug is empty", () => {
    expect(getCategoryUrl("")).toBe("/categorie/");
    expect(getCategoryUrl(undefined)).toBe("/categorie/");
  });

  it("encodes special characters in slug", () => {
    expect(getCategoryUrl("offre spéciale")).toBe(
      `/categorie/${encodeURIComponent("offre spéciale")}`
    );
  });
});

describe("getCategorySlugFromLocation", () => {
  it("reads slug from /categorie/{slug} pathname", () => {
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
        pathname: "/categorie/lit",
        search: "?slug=matelas"
      })
    ).toBe("lit");
  });
});
