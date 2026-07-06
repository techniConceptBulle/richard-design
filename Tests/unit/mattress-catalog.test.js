/**
 * Tests unitaires — catalogue matelas inspiré IKEA pour la page catégorie.
 */
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const rootDir = join(dirname(fileURLToPath(import.meta.url)), "../..");
const products = JSON.parse(readFileSync(join(rootDir, "data/products.json"), "utf8"));

const ikeaMattressNames = [
  "VALEVÅG matelas à ressorts ensachés",
  "VALEVÅG matelas et surmatelas",
  "VESTMARKA matelas à ressorts",
  "ÅKREHAMN matelas en mousse",
  "MATRAND matelas en mousse polyuréthane",
  "HAUGESUND matelas à ressorts ensachés",
  "MORGEDAL matelas en mousse",
  "ÅNNELAND matelas à ressorts"
];

describe("IKEA-inspired mattress catalog", () => {
  it("lists eight IKEA-branded mattresses in the matelas category", () => {
    const mattresses = products.filter(
      (product) => product.categoryId === "matelas" && product.brandId === "ikea"
    );

    expect(mattresses).toHaveLength(8);
    expect(mattresses.map((product) => product.name).sort()).toEqual([...ikeaMattressNames].sort());
  });

  it("uses IKEA mattress images from the local ikea assets folder", () => {
    const mattresses = products.filter(
      (product) => product.categoryId === "matelas" && product.brandId === "ikea"
    );

    expect(mattresses.every((product) => product.images?.[0]?.includes("/ikea/"))).toBe(true);
  });
});
