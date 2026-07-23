/**
 * Tests unitaires — sélection par défaut fiche produit (taille 90×200).
 */
import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { getDefaultProductSelection } from "../../js/render.js";

describe("getDefaultProductSelection", () => {
  it("prefers 90x200 variation when available on matelas-superba-elegance", () => {
    const productsPath = resolve(process.cwd(), "data/products.json");
    const products = JSON.parse(readFileSync(productsPath, "utf8"));
    const product = products.find((entry) => entry.slug === "matelas-superba-elegance");

    const selection = getDefaultProductSelection(product);

    expect(selection.size).toBe("90x200");
    expect(selection.firmness).toBeTruthy();
    expect(selection.cover).toBeTruthy();
  });

  it("falls back to first in-stock variation when 90x200 is missing", () => {
    const product = {
      type: "variable",
      variations: [
        { size: "160x200", firmness: "firm", cover: "Standard", inStock: false },
        { size: "180x200", firmness: "medium", cover: "Thermorégulée", inStock: true }
      ]
    };

    const selection = getDefaultProductSelection(product);

    expect(selection.size).toBe("180x200");
    expect(selection.firmness).toBe("medium");
    expect(selection.cover).toBe("Thermorégulée");
  });
});
