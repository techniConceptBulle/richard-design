/**
 * Tests unitaires — helpers carte produit archive catégorie.
 */
import { describe, expect, it } from "vitest";
import {
  getProductInStockVariations,
  getProductListingRating,
  getProductListingStockLabel,
  renderCategoryProductSaleBadges,
  renderProductStarRating
} from "../../js/category-card.js";

const variableProduct = {
  id: "matelas-demo",
  type: "variable",
  variations: [
    { id: "a", inStock: true },
    { id: "b", inStock: true }
  ]
};

const lowStockProduct = {
  id: "lit-demo",
  type: "variable",
  variations: [{ id: "a", inStock: true }, { id: "b", inStock: false }]
};

const unavailableProduct = {
  id: "rupture-demo",
  type: "variable",
  variations: [{ id: "a", inStock: false }]
};

describe("getProductInStockVariations", () => {
  it("returns in-stock variations for variable products", () => {
    expect(getProductInStockVariations(variableProduct)).toHaveLength(2);
  });

  it("returns empty array when no variation is available", () => {
    expect(getProductInStockVariations(unavailableProduct)).toHaveLength(0);
  });
});

describe("getProductListingStockLabel", () => {
  it("returns En stock when multiple variations are available", () => {
    expect(getProductListingStockLabel(variableProduct)).toEqual({
      label: "En stock",
      modifier: "in"
    });
  });

  it("returns Dernière pièce when only one variation is available", () => {
    expect(getProductListingStockLabel(lowStockProduct)).toEqual({
      label: "Dernière pièce",
      modifier: "low"
    });
  });
});

describe("getProductListingRating", () => {
  it("returns a deterministic rating between 0 and 5", () => {
    const rating = getProductListingRating(variableProduct);
    expect(rating).toBeGreaterThanOrEqual(0);
    expect(rating).toBeLessThanOrEqual(5);
    expect(getProductListingRating(variableProduct)).toBe(rating);
  });
});

describe("renderProductStarRating", () => {
  it("renders five stars with filled state", () => {
    const html = renderProductStarRating(3);
    expect(html).toContain('aria-label="Note 3 sur 5"');
    expect(html.match(/category-product-star/g)?.length).toBe(5);
    expect(html.match(/is-filled/g)?.length).toBe(3);
  });

  it("renders empty stars when rating is zero", () => {
    const html = renderProductStarRating(0);
    expect(html).not.toContain("is-filled");
  });
});

describe("renderCategoryProductSaleBadges", () => {
  it("renders discount and Soldes badges for a valid percentage", () => {
    const html = renderCategoryProductSaleBadges(42);

    expect(html).toContain('class="category-product-badges"');
    expect(html).toContain(">-42%<");
    expect(html).toContain(">Soldes<");
    expect(html).toContain('aria-label="Promotion -42 pour cent"');
  });

  it("returns empty markup when discount is zero", () => {
    expect(renderCategoryProductSaleBadges(0)).toBe("");
  });
});
