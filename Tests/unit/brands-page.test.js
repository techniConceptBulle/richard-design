/**
 * Tests unitaires — helpers pages marques (liste + détail).
 */
import { describe, expect, it } from "vitest";
import {
  buildBrandBodyHtml,
  buildBrandGalleryHtml,
  buildBrandLogoLinkHtml,
  buildBrandTileHtml,
  buildBrandsGridHtml,
  escapeHtml,
  getFeaturedBrands
} from "../../js/brands-page.js";

describe("brands-page helpers", () => {
  const sampleBrands = [
    {
      id: "swissflex",
      name: "Swissflex",
      slug: "swissflex",
      featured: true,
      sortOrder: 4,
      logo: "/assets/images/brands/swissflex/logo.png",
      cardImage: "/assets/images/brands/swissflex/card.jpg",
      website: "https://www.swissflex.com/ch-fr/home"
    },
    {
      id: "roviva",
      name: "Roviva",
      slug: "roviva",
      featured: true,
      sortOrder: 1,
      logo: "/assets/images/brands/roviva/logo.jpg",
      cardImage: "/assets/images/brands/roviva/card.jpg",
      website: "https://www.roviva.ch/fr/"
    },
    {
      id: "bico",
      name: "Bico",
      slug: "bico",
      featured: false,
      logo: "/assets/icons/brand-roviva.png"
    }
  ];

  it("returns featured brands sorted by sortOrder", () => {
    const featured = getFeaturedBrands(sampleBrands);
    expect(featured).toHaveLength(2);
    expect(featured.map((b) => b.id)).toEqual(["roviva", "swissflex"]);
  });

  it("returns empty array for invalid brands input", () => {
    expect(getFeaturedBrands(null)).toEqual([]);
    expect(getFeaturedBrands(undefined)).toEqual([]);
    expect(getFeaturedBrands([])).toEqual([]);
  });

  it("builds a brand tile linking to the detail page", () => {
    const html = buildBrandTileHtml(sampleBrands[1]);
    expect(html).toContain('href="/pages/brand.html?slug=roviva"');
    expect(html).toContain('src="/assets/images/brands/roviva/card.jpg"');
    expect(html).toContain("brand-tile");
  });

  it("returns empty tile html when slug is missing", () => {
    expect(buildBrandTileHtml({ name: "X" })).toBe("");
    expect(buildBrandTileHtml(null)).toBe("");
  });

  it("builds grid html only for featured brands", () => {
    const html = buildBrandsGridHtml(sampleBrands);
    expect(html).toContain("roviva");
    expect(html).toContain("swissflex");
    expect(html).not.toContain("bico");
  });

  it("shows empty message when no featured brands", () => {
    const html = buildBrandsGridHtml([{ id: "x", featured: false }]);
    expect(html).toContain("brands-grid-empty");
  });

  it("builds logo link to manufacturer website", () => {
    const html = buildBrandLogoLinkHtml(sampleBrands[0]);
    expect(html).toContain('href="https://www.swissflex.com/ch-fr/home"');
    expect(html).toContain('target="_blank"');
    expect(html).toContain("brand-detail__logo");
  });

  it("renders logo without link when website is missing", () => {
    const html = buildBrandLogoLinkHtml({ name: "Test", logo: "/logo.png" });
    expect(html).toContain("brand-detail__logo-wrap");
    expect(html).not.toContain("<a ");
  });

  it("builds body html from headline as h2 and sections as h3", () => {
    const html = buildBrandBodyHtml({
      headline: "Titre principal",
      sections: [
        { title: "Section A", paragraphs: ["Paragraphe 1", ""] },
        { title: null, paragraphs: ["Intro sans titre"] }
      ]
    });
    expect(html).toContain("<h2 class=\"brand-detail__headline\">");
    expect(html).toContain("Titre principal");
    expect(html).toContain("<h3 class=\"brand-detail__section-title\">");
    expect(html).toContain("Section A");
    expect(html).toContain("Paragraphe 1");
    expect(html).toContain("Intro sans titre");
  });

  it("falls back to description when no sections", () => {
    const html = buildBrandBodyHtml({ description: "Description courte" });
    expect(html).toContain("Description courte");
  });

  it("builds gallery html with featured first item and lightbox triggers", () => {
    const html = buildBrandGalleryHtml({
      name: "Roviva",
      gallery: [
        { src: "/a.jpg", alt: "Photo A" },
        { src: "" },
        null,
        { src: "/b.jpg" }
      ]
    });
    expect(html).toContain("/a.jpg");
    expect(html).toContain("/b.jpg");
    expect(html).toContain("Photo A");
    expect(html).toContain("brand-detail__gallery");
    expect(html).toContain("brand-detail__gallery-item--featured");
    expect(html).toContain('data-brand-gallery-index="0"');
    expect(html).toContain('data-brand-gallery-index="1"');
  });

  it("returns empty gallery html when gallery is missing", () => {
    expect(buildBrandGalleryHtml({})).toBe("");
    expect(buildBrandGalleryHtml(null)).toBe("");
  });

  it("escapes html special characters", () => {
    expect(escapeHtml('<script>"x"&\'')).toBe(
      "&lt;script&gt;&quot;x&quot;&amp;&#39;"
    );
    expect(escapeHtml(null)).toBe("");
  });
});
