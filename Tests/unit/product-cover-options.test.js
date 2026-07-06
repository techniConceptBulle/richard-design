/**
 * Tests unitaires — options housse affichées en chips sur la fiche produit.
 */
import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { getProductCoverChipValues } from "../../js/render.js";

describe("getProductCoverChipValues", () => {
  it("returns explicit coverOptions for matelas-superba-elegance", () => {
    const productsPath = resolve(process.cwd(), "data/products.json");
    const products = JSON.parse(readFileSync(productsPath, "utf8"));
    const product = products.find((entry) => entry.slug === "matelas-superba-elegance");

    expect(getProductCoverChipValues(product)).toEqual([
      "Housse amovible et lavable",
      "Thermorégulée"
    ]);
  });

  it("falls back to default mattress cover chips for variable matelas without coverOptions", () => {
    const product = {
      categoryId: "matelas",
      type: "variable",
      variations: [{ cover: "Housse amovible et lavable", size: "90x200", firmness: "firm" }]
    };

    expect(getProductCoverChipValues(product)).toEqual([
      "Housse amovible et lavable",
      "Thermorégulée"
    ]);
  });
});
