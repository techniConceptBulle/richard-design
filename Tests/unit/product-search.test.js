/**
 * Tests unitaires — filtrage recherche produits mock.
 */
import { describe, expect, it } from "vitest";
import { filterProductsBySearchTerm } from "../../js/search.js";

const products = [
  {
    id: "p1",
    name: "Matelas Dream",
    shortDescription: "Confort ferme",
    description: "Matelas premium",
    brandId: "b1",
    categoryId: "c1"
  },
  {
    id: "p2",
    name: "Sommier Flex",
    shortDescription: "Sommier réglable",
    description: "",
    brandId: "b2",
    categoryId: "c2"
  }
];

const brands = [
  { id: "b1", name: "Roviva" },
  { id: "b2", name: "Swissflex" }
];

const categories = [
  { id: "c1", name: "Matelas" },
  { id: "c2", name: "Sommiers" }
];

describe("filterProductsBySearchTerm", () => {
  it("returns all products when search term is empty", () => {
    expect(filterProductsBySearchTerm(products, brands, categories, "")).toHaveLength(2);
    expect(filterProductsBySearchTerm(products, brands, categories, "   ")).toHaveLength(2);
  });

  it("matches product name, brand and category labels case-insensitively", () => {
    expect(filterProductsBySearchTerm(products, brands, categories, "matelas")).toHaveLength(1);
    expect(filterProductsBySearchTerm(products, brands, categories, "SWISSFLEX")).toHaveLength(1);
    expect(filterProductsBySearchTerm(products, brands, categories, "sommiers")).toHaveLength(1);
  });

  it("returns empty array when nothing matches", () => {
    expect(filterProductsBySearchTerm(products, brands, categories, "oreiller")).toHaveLength(0);
  });
});
