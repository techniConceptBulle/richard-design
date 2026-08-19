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
  buildSelectaBrandPageHtml,
  buildSelectaProductsSectionHtml,
  escapeHtml,
  getFeaturedBrands,
  getSelectaPageProducts,
  isSelectaBrandPage
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
    expect(html).toContain('href="/marque/roviva.html"');
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

describe("selecta brand page helpers", () => {
  const selectaBrand = {
    slug: "selecta",
    name: "Selecta",
    selectaPage: {
      hero: { image: "/hero.jpg", logo: "/logo.jpg", logoAlt: "Selecta" },
      manufacture: { title: "La manufacture du sommeil", image: "/wood.jpg", paragraphs: ["Texte"] },
      people: { title: "Artisans", images: [{ src: "/a.jpg", alt: "A" }], paragraphs: ["P"] },
      expertise: { title: "Selecta by Röwa : la même expertise", image: "/assets/marques/matelas-rowa-3.jpg", paragraphs: ["E"] },
      base: { title: "Le sommier Röwa", image: "/assets/marques/sommier-rowa-radio-m4memory.jpg", paragraphs: ["S"] },
      products: { title: "Découvrez notre sélection Röwa", allLabel: "Voir tous les produits Röwa & Selecta by Röwa" },
      why: { title: "Pourquoi Richard", icon: "/p.png", paragraphs: ["W"] },
      cta: {
        title: "Besoin de conseils personnalisés ?",
        text: "Prenez rendez-vous avec l'un de nos experts.",
        buttonLabel: "Prendre rendez-vous",
        buttonHref: "/pages/contact.html"
      }
    }
  };

  const sampleProducts = [
    {
      slug: "selecta-s5",
      name: "Selecta S5",
      brandId: "selecta",
      shortDescription: "Le confort naturellement équilibré",
      price: 1760,
      images: ["/assets/marques/matelas-rowa-2.jpg"]
    },
    {
      slug: "rowa-n",
      name: "Röwa N",
      brandId: "rowa",
      price: 2140,
      images: ["/assets/marques/sommier-rowa-2.jpg"]
    },
    { slug: "roviva-x", name: "Roviva X", brandId: "roviva", price: 100 }
  ];

  it("detects the selecta layout from the brand slug", () => {
    expect(isSelectaBrandPage(selectaBrand)).toBe(true);
    expect(isSelectaBrandPage({ slug: "selecta" })).toBe(false);
    expect(isSelectaBrandPage({ slug: "rowa" })).toBe(false);
    expect(isSelectaBrandPage(null)).toBe(false);
  });

  it("filters selecta and rowa products and caps the list", () => {
    const filtered = getSelectaPageProducts(sampleProducts, 4);
    expect(filtered.map((item) => item.slug)).toEqual(["selecta-s5", "rowa-n"]);
    expect(getSelectaPageProducts(sampleProducts, 1)).toHaveLength(1);
  });

  it("returns an empty list when products are missing", () => {
    expect(getSelectaPageProducts(null)).toEqual([]);
    expect(getSelectaPageProducts(undefined)).toEqual([]);
    expect(getSelectaPageProducts([])).toEqual([]);
  });

  it("renders the all-products control as a button without href", () => {
    const html = buildSelectaProductsSectionHtml(
      selectaBrand.selectaPage.products,
      '<article class="category-product-card">Selecta S5</article>'
    );
    expect(html).toContain("category-products-grid");
    expect(html).toContain("product-related-header");
    expect(html).toContain('type="button"');
    expect(html).toContain("selecta-products__all");
    expect(html).toContain("Voir tous les produits Röwa &amp; Selecta by Röwa");
    expect(html).not.toMatch(/<button[^>]*href=/);
  });

  it("hides the products section when the catalogue is empty", () => {
    expect(buildSelectaProductsSectionHtml(selectaBrand.selectaPage.products, "")).toBe("");
    expect(buildSelectaProductsSectionHtml(selectaBrand.selectaPage.products, null)).toBe("");
  });

  it("builds the selecta layout blocks and contact CTA", () => {
    const html = buildSelectaBrandPageHtml(selectaBrand, '<article class="category-product-card"></article>');
    expect(html).toContain("selecta-hero");
    expect(html).toMatch(/selecta-hero__inner[\s\S]*selecta-hero__image/);
    expect(html).toContain("selecta-hero__logo");
    expect(html).toContain("La manufacture du sommeil");
    expect(html).toContain("Selecta by Röwa : la même expertise");
    expect(html).toContain("Le sommier Röwa");
    expect(html).toContain("/assets/marques/sommier-rowa-radio-m4memory.jpg");
    expect(html).toContain("/assets/marques/matelas-rowa-3.jpg");
    expect(html).toContain("selecta-split__media--cutout");
    expect(html).toContain("selecta-section--sommier");
    expect(html).toContain("selecta-cta__button");
    expect(html).toContain('href="/pages/contact.html"');
    expect(html).toContain("Prendre rendez-vous");
  });

  it("omits empty image sources from the selecta markup", () => {
    const html = buildSelectaBrandPageHtml(
      {
        slug: "selecta",
        name: "Selecta",
        selectaPage: {
          manufacture: { title: "La manufacture du sommeil" },
          cta: { buttonHref: "/pages/contact.html", buttonLabel: "Prendre rendez-vous" }
        }
      },
      []
    );
    expect(html).not.toContain('src=""');
    expect(html).not.toContain("selecta-hero__badge");
  });

  it("does not build the selecta layout for other brands", () => {
    expect(buildSelectaBrandPageHtml({ slug: "roviva", name: "Roviva" }, [])).toBe("");
  });
});
