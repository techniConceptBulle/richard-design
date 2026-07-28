/**
 * Tests unitaires — galerie / lightbox pages marque.
 */
import { describe, expect, it } from "vitest";
import {
  buildBrandLightboxHtml,
  getBrandGalleryNeighborIndex,
  normalizeBrandGalleryItems
} from "../../js/brand-gallery.js";

describe("brand-gallery helpers", () => {
  it("normalizes gallery items and drops invalid entries", () => {
    const items = normalizeBrandGalleryItems(
      [{ src: " /a.jpg ", alt: "A" }, { src: "" }, null, { src: "/b.jpg" }],
      "Fallback"
    );
    expect(items).toEqual([
      { src: "/a.jpg", alt: "A" },
      { src: "/b.jpg", alt: "Fallback" }
    ]);
  });

  it("returns empty list for invalid gallery input", () => {
    expect(normalizeBrandGalleryItems(null)).toEqual([]);
    expect(normalizeBrandGalleryItems([])).toEqual([]);
  });

  it("computes neighbor indexes with wrap-around", () => {
    expect(getBrandGalleryNeighborIndex(0, 3, "prev")).toBe(2);
    expect(getBrandGalleryNeighborIndex(2, 3, "next")).toBe(0);
    expect(getBrandGalleryNeighborIndex(1, 3, "next")).toBe(2);
  });

  it("returns zero neighbor index when total is empty", () => {
    expect(getBrandGalleryNeighborIndex(2, 0, "next")).toBe(0);
  });

  it("builds lightbox html with counter and navigation", () => {
    const html = buildBrandLightboxHtml(
      [
        { src: "/a.jpg", alt: "A" },
        { src: "/b.jpg", alt: "B" }
      ],
      1,
      "Roviva"
    );
    expect(html).toContain("/b.jpg");
    expect(html).toContain("2 / 2");
    expect(html).toContain("data-brand-lightbox-direction=\"prev\"");
    expect(html).toContain("data-brand-lightbox-direction=\"next\"");
  });

  it("omits navigation arrows for a single image", () => {
    const html = buildBrandLightboxHtml([{ src: "/a.jpg", alt: "A" }], 0, "Roviva");
    expect(html).toContain("/a.jpg");
    expect(html).not.toContain("data-brand-lightbox-direction");
  });
});
