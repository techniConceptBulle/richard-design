/**
 * Tests unitaires — catalogue matelas Roviva pour la page catégorie.
 */
import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const products = JSON.parse(
  readFileSync(resolve(process.cwd(), "data/products.json"), "utf8")
);

const rovivaMattressNames = [
  "VALEVÅG matelas à ressorts ensachés",
  "VALEVÅG matelas et surmatelas",
  "VESTMARKA matelas à ressorts",
  "ÅKREHAMN matelas en mousse",
  "MATRAND matelas en mousse polyuréthane",
  "HAUGESUND matelas à ressorts ensachés",
  "MORGEDAL matelas en mousse",
  "ÅNNELAND matelas à ressorts"
];

describe("Roviva mattress catalog", () => {
  it("lists eight Roviva-branded mattresses in the matelas category", () => {
    const mattresses = products.filter(
      (product) => product.categoryId === "matelas" && product.brandId === "roviva"
    );

    expect(mattresses).toHaveLength(8);
    expect(mattresses.map((product) => product.name).sort()).toEqual([...rovivaMattressNames].sort());
  });

  it("uses Roviva mattress images from the local roviva assets folder", () => {
    const mattresses = products.filter(
      (product) => product.categoryId === "matelas" && product.brandId === "roviva"
    );

    expect(mattresses.every((product) => product.images?.[0]?.includes("/roviva/"))).toBe(true);
  });
});
