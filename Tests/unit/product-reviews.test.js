/**
 * Tests unitaires — grille d'avis clients dans l'accordéon fiche produit.
 */
import { describe, expect, it } from "vitest";
import { renderProductReviews } from "../../js/render.js";

describe("renderProductReviews", () => {
  it("returns one review card per entry", () => {
    const html = renderProductReviews([
      { author: "Alice", rating: 5, title: "Excellent", text: "Très satisfaite." },
      { author: "Bob", rating: 4, title: "Très bien", text: "Bon confort global." }
    ]);

    expect(html.match(/product-review-card/g)).toHaveLength(2);
    expect(html).toContain("Alice");
    expect(html).toContain('aria-label="5 sur 5"');
    expect(html).toContain('aria-label="4 sur 5"');
  });

  it("returns multiple default reviews when no argument is provided", () => {
    const html = renderProductReviews();

    expect(html).toContain('class="product-reviews"');
    expect(html.match(/product-review-card/g).length).toBeGreaterThanOrEqual(6);
  });
});
