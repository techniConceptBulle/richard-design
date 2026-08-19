/**
 * Tests unitaires — bloc marques + slider + CTA page expert.
 */
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const rootDir = resolve(dirname(fileURLToPath(import.meta.url)), "../..");

describe("expert brands spotlight and slider", () => {
  const html = readFileSync(
    resolve(rootDir, "pages/expert-literie-crissier.html"),
    "utf8"
  );
  const css = readFileSync(resolve(rootDir, "styles/about-page.css"), "utf8");
  const appJs = readFileSync(resolve(rootDir, "js/app.js"), "utf8");
  const carouselJs = readFileSync(resolve(rootDir, "js/brand-carousel.js"), "utf8");

  it("places spotlight then brands slider after the showroom slider", () => {
    const showroomIdx = html.indexOf('id="about-showroom-slider"');
    const spotlightIdx = html.indexOf('class="about-brands-spotlight"');
    const brandsIdx = html.indexOf('id="about-brand-row"');
    const adviceIdx = html.indexOf("data-product-advice-mount");
    expect(showroomIdx).toBeGreaterThan(-1);
    expect(spotlightIdx).toBeGreaterThan(showroomIdx);
    expect(brandsIdx).toBeGreaterThan(spotlightIdx);
    expect(adviceIdx).toBeGreaterThan(brandsIdx);
  });

  it("no longer includes why-try, trial, premium or univers blocks", () => {
    expect(html).not.toContain('id="about-why-title"');
    expect(html).not.toContain('id="about-trial-title"');
    expect(html).not.toContain("about-premium");
    expect(html).not.toContain("about-univers");
    expect(html).not.toContain("Pourquoi essayer son matelas en magasin");
    expect(html).not.toContain("Essayer son matelas, un indispensable");
  });

  it("includes brand copy, Roviva badge and featured brands grid", () => {
    expect(html).toContain("retrouvez les plus grandes marques");
    expect(html).toContain("Swissflex, Roviva, Hasena");
    expect(html).toContain("La marque Roviva");
    expect(html).toContain('data-brand-source="featured"');
    expect(html).toContain("brand-row--grid");
    expect(html).toContain("/assets/home/expert-brands-spotlight-roviva.jpg");
    expect(html).toMatch(/expert-brands-spotlight-roviva\.jpg"[\s\S]*?height="747"/);
    expect(html).toContain("/assets/home/brand-roviva-ref.png");
    expect(html).not.toContain("about-brands-slider__contact");
    expect(html).not.toContain("id=\"about-brands-slider-title\"");
    expect(html).not.toMatch(/<h2[^>]*>Les plus grandes marques de literie<\/h2>/);
    expect(html).not.toContain("data-brand-carousel");
    expect(html).not.toContain("brands__slider-wrap");
  });

  it("styles paragraphs at 16px and transparent badge", () => {
    expect(css).toMatch(
      /\.about-brands-spotlight__text p\s*\{[^}]*font-size:\s*var\(--font-size-body-md\)/s
    );
    expect(css).toMatch(
      /\.about-brands-spotlight__badge\s*\{[^}]*left:\s*0[^}]*background:\s*rgba\(255,\s*255,\s*255,\s*0\.82\)/s
    );
  });

  it("initializes featured brand grid on the about-expert page", () => {
    expect(appJs).toMatch(/case "about-expert":[\s\S]*getFeaturedBrands\(brands\)/);
    expect(appJs).toMatch(/case "about-expert":[\s\S]*initBrandCarousel\(document, \{ featuredBrands:/);
    expect(carouselJs).toContain("#about-brand-row");
    expect(carouselJs).toContain("#home-brand-row");
    expect(carouselJs).toContain("dataset.brandSource === \"featured\"");
  });
});
