/**
 * Tests unitaires — la page Selecta reste dans le shell layout-wide.
 */
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const rootDir = resolve(dirname(fileURLToPath(import.meta.url)), "../..");

describe("selecta brand layout container", () => {
  it("keeps brand.html on the shared layout-wide shell", () => {
    const html = readFileSync(resolve(rootDir, "pages/brand.html"), "utf8");
    expect(html).toContain("category-page-shell layout-wide");
  });

  it("does not break the shell max-width or inline gutters", () => {
    const css = readFileSync(resolve(rootDir, "styles/brand-selecta.css"), "utf8");
    expect(css).not.toMatch(/\.page--selecta-brand\s+\.category-page-shell[^{]*\{[^}]*max-width:\s*none/s);
    expect(css).not.toMatch(/\.page--selecta-brand\s+\.category-page-shell[^{]*\{[^}]*padding-inline:\s*0/s);
  });

  it("lets section backgrounds span the viewport and keeps content at the home layout width", () => {
    const css = readFileSync(resolve(rootDir, "styles/brand-selecta.css"), "utf8");
    expect(css).toMatch(/\.selecta-hero,\s*\n\s*\.selecta-section,\s*\n\s*\.selecta-cta\s*\{[^}]*width:\s*100vw/s);
    expect(css).toMatch(
      /\.selecta-section__inner,\s*\n\s*\.selecta-hero__inner,\s*\n\s*\.selecta-cta__inner\s*\{[^}]*max-width:\s*var\(--layout-max-width\)/s
    );
  });

  it("glues the last band to the footer with the copyright separator", () => {
    const css = readFileSync(resolve(rootDir, "styles/brand-selecta.css"), "utf8");
    expect(css).toMatch(
      /\.page--selecta-brand\[data-page="brand"\]\s+\.category-page-shell\s*\{[^}]*padding-bottom:\s*0/s
    );
    expect(css).toMatch(/\.page--selecta-brand\s+#site-footer\s*\{[^}]*margin-top:\s*0/s);
    expect(css).toMatch(
      /\.page--selecta-brand\s+\.footer-global\s*\{[^}]*border-top:\s*1px solid rgba\(8,\s*43,\s*78,\s*0\.12\)/s
    );
    expect(css).toMatch(/\.selecta-cta\s*\{[^}]*margin-top:\s*auto/s);
  });

  it("forces white copy on the last CTA band", () => {
    const css = readFileSync(resolve(rootDir, "styles/brand-selecta.css"), "utf8");
    expect(css).toMatch(/\.brand-detail\s+\.selecta-cta p[\s\S]*color:\s*#fff/);
  });

  it("uses a white hero band with bottom padding, a shorter image and a green CTA button", () => {
    const css = readFileSync(resolve(rootDir, "styles/brand-selecta.css"), "utf8");
    expect(css).toMatch(/\.selecta-hero\s*\{[^}]*background:\s*#fff/s);
    expect(css).toMatch(/\.selecta-hero\s*\{[^}]*padding-bottom:\s*var\(--home-section-padding-y\)/s);
    expect(css).toMatch(
      /@media\s*\(min-width:\s*1024px\)\s*\{[^}]*\.selecta-hero\s*\{[^}]*padding-bottom:\s*var\(--home-section-padding-y-lg\)/s
    );
    expect(css).toMatch(/\.selecta-hero__image\s*\{[^}]*width:\s*100%/s);
    expect(css).toMatch(/\.selecta-hero__image\s*\{[^}]*object-fit:\s*contain/s);
    expect(css).not.toMatch(/\.selecta-hero__image\s*\{[^}]*max-height:/s);
    expect(css).toMatch(/\.selecta-hero__badge\s*\{[^}]*top:\s*85%/s);
    expect(css).toMatch(/\.selecta-feature\s*\{[^}]*text-align:\s*center/s);
    expect(css).toMatch(/\.selecta-cta__button\s*\{[^}]*background:\s*#27745d/s);
    expect(css).toMatch(/\.selecta-cta__button\s*\{[^}]*color:\s*#fff/s);
  });

  it("maps sommier and expertise photos from brands.json", () => {
    const brands = JSON.parse(readFileSync(resolve(rootDir, "data/brands.json"), "utf8"));
    const selecta = brands.find((brand) => brand.slug === "selecta");
    expect(selecta.selectaPage.hero.image).toBe("/assets/marques/selecta.png");
    expect(selecta.selectaPage.hero.logo).toBe("/assets/images/brands/selecta/logo.png?v=20260819b");
    expect(selecta.selectaPage.base.image).toBe("/assets/marques/sommier-rowa-radio-m4memory.jpg");
    expect(selecta.selectaPage.expertise.image).toBe("/assets/marques/matelas-rowa-3.jpg");
  });

  it("uses png logos with alpha for rowa, swissflex and selecta", () => {
    const brands = JSON.parse(readFileSync(resolve(rootDir, "data/brands.json"), "utf8"));
    const rowa = brands.find((brand) => brand.slug === "rowa");
    const swissflex = brands.find((brand) => brand.slug === "swissflex");
    const selecta = brands.find((brand) => brand.slug === "selecta");
    expect(rowa.logo).toBe("/assets/images/brands/rowa/logo.png?v=20260819c");
    expect(swissflex.logo).toBe("/assets/images/brands/swissflex/logo.png?v=20260819b");
    expect(selecta.logo).toBe("/assets/images/brands/selecta/logo.png?v=20260819b");
  });

  it("spreads space between the why icon and title", () => {
    const css = readFileSync(resolve(rootDir, "styles/brand-selecta.css"), "utf8");
    expect(css).toMatch(/\.selecta-why\s*\{[^}]*grid-template-columns:\s*auto minmax\(14rem, 1fr\)/s);
    expect(css).toMatch(/\.selecta-why__title\s*\{[^}]*max-width:\s*none/s);
  });

  it("casts a discreet top and bottom shadow on the sommier section", () => {
    const css = readFileSync(resolve(rootDir, "styles/brand-selecta.css"), "utf8");
    expect(css).toMatch(/\.selecta-section--sommier\s*\{[^}]*0 -4px 10px -6px/s);
    expect(css).toMatch(/\.selecta-section--sommier\s*\{[^}]*0 4px 10px -6px/s);
    expect(css).not.toMatch(/0 12px 24px -8px/);
    expect(css).toMatch(/\.selecta-section--sommier\s*\{[^}]*padding-block:\s*var\(--space-6\)/s);
    expect(css).toMatch(/\.selecta-split__media--cutout img\s*\{[^}]*object-fit:\s*cover/s);
  });

  it("keeps equal vertical padding on sections, products and CTA", () => {
    const css = readFileSync(resolve(rootDir, "styles/brand-selecta.css"), "utf8");
    expect(css).toMatch(/\.selecta-section\s*\{[^}]*padding-block:\s*var\(--home-section-padding-y\)/s);
    expect(css).toMatch(
      /\.selecta-section--products\.category-archive-page\s*\{[^}]*padding-block:\s*var\(--home-section-padding-y\)/s
    );
    expect(css).toMatch(/\.selecta-cta__inner\s*\{[^}]*padding-block:\s*var\(--home-section-padding-y\)/s);
    expect(css).toMatch(
      /\.selecta-cta__inner,\s*\n\s*\.selecta-section--products\.category-archive-page\s*\{[^}]*padding-block:\s*var\(--home-section-padding-y-lg\)/s
    );
  });
});
