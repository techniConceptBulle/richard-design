/**
 * Tests unitaires — structure HTML de la page magasin Crissier.
 */
import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const html = readFileSync(
  resolve(process.cwd(), "pages/magasin-crissier.html"),
  "utf8"
);
const css = readFileSync(resolve(process.cwd(), "styles/about-page.css"), "utf8");
const appJs = readFileSync(resolve(process.cwd(), "js/app.js"), "utf8");

describe("magasin-crissier page structure", () => {
  it("uses the mattress store page title", () => {
    expect(html).toContain("<title>Votre magasin de matelas à Crissier | Richard La Literie</title>");
    expect(html).toContain('class="about-hero__title">Votre magasin de matelas à Crissier</h1>');
    expect(html).toContain('class="breadcrumb__current">Votre magasin de matelas à Crissier</span>');
  });

  it("does not include the green store kicker", () => {
    expect(html).not.toContain("about-split__kicker");
    expect(html).not.toContain("Votre magasin de literie à Crissier");
  });

  it("orders three split blocks as left, right, left", () => {
    const leftMatches = [...html.matchAll(/about-split about-split--image-left/g)];
    const rightMatches = [...html.matchAll(/about-split about-split--image-right/g)];
    expect(leftMatches).toHaveLength(2);
    expect(rightMatches).toHaveLength(1);

    const firstLeft = html.indexOf("about-split about-split--image-left");
    const right = html.indexOf("about-split about-split--image-right");
    const secondLeft = html.indexOf("about-split about-split--image-left", firstLeft + 1);

    expect(firstLeft).toBeGreaterThan(-1);
    expect(right).toBeGreaterThan(firstLeft);
    expect(secondLeft).toBeGreaterThan(right);
  });

  it("places trial mattress copy in the image-right block", () => {
    const rightIdx = html.indexOf("about-split about-split--image-right");
    const trialIdx = html.indexOf("Essayer son matelas, un indispensable");
    const pullquoteIdx = html.indexOf("about-split__pullquote");

    expect(rightIdx).toBeGreaterThan(-1);
    expect(trialIdx).toBeGreaterThan(rightIdx);
    expect(html).toContain('id="about-trial-title"');
    expect(pullquoteIdx).toBeGreaterThan(trialIdx);
    expect(html).toContain("essayer le matelas chez vous");
  });

  it("styles pullquote as plain italic text without background", () => {
    expect(css).toMatch(
      /\.about-split__pullquote\s*\{[^}]*background:\s*transparent/s
    );
    expect(css).toMatch(/\.about-split__pullquote\s*\{[^}]*border:\s*0/s);
    expect(css).not.toMatch(
      /\.about-split__pullquote\s*\{[^}]*background:\s*var\(--color-surface-muted\)/s
    );
  });

  it("places holistic sleep approach copy in the third split block", () => {
    expect(html).toContain('id="about-holistic-title"');
    expect(html).toContain("Une approche globale du sommeil");
    expect(html).toContain("le choix ne s'arrête pas au matelas");
    expect(html).toContain("Esprit hôtelier avec les lits boxspring");
    expect(html).toContain("Oreillers ergonomiques");
    expect(html).toContain("about-split--bg-white");
    expect(html).toContain("/assets/images/hero-boxspring.jpg");
  });

  it("forces white background on the holistic split section", () => {
    expect(css).toMatch(
      /\.about-split\.about-split--bg-white\s*\{[^}]*background:\s*#fff/s
    );
  });

  it("renders selected products as a carousel slider", () => {
    expect(html).toMatch(
      /id="about-store-products-title"[^>]*>\s*Des produits séléctionnés avec soin\s*<\/h2>/
    );
    expect(html).not.toContain("Des produits sélectionnés avec soin");
    expect(html).not.toContain("Des produits séléctionnés avec soin&nbsp;:");
    expect(html).toContain('id="store-products-slider"');
    expect(html).toContain("store-products-slider__track");
    expect(html).toContain('aria-roledescription="carousel"');
    expect(html).toContain('aria-label="Catégories précédentes"');
    expect(html).toContain('aria-label="Catégories suivantes"');
    expect(html).toContain('href="/pages/category.html?slug=lit"');
    expect(html).toContain('href="/pages/category.html?slug=matelas"');
    expect(html).toContain('href="/pages/category.html?slug=sommier"');
    expect(html).toContain('href="/pages/category.html?slug=duvets"');
    expect(html).toContain('href="/pages/category.html?slug=oreillers"');
    expect(html).toMatch(/store-products-slider__label">lits</);
    expect(html).toMatch(/store-products-slider__label">matelas</);
    expect(html).toMatch(/store-products-slider__label">sommier</);
    expect(html).toMatch(/store-products-slider__label">duvet</);
    expect(html).toMatch(/store-products-slider__label">oreiller</);
    expect(html).not.toContain("univers__cards--store-five");
  });

  it("maps slider slides to existing category slugs only", () => {
    const categories = JSON.parse(
      readFileSync(resolve(process.cwd(), "data/categories.json"), "utf8")
    );
    const knownSlugs = new Set(categories.map((entry) => entry.slug));
    const hrefs = [...html.matchAll(/store-products-slider__slide"[^>]*href="([^"]+)"/g)].map(
      (match) => match[1]
    );

    expect(hrefs).toHaveLength(5);
    for (const href of hrefs) {
      const slug = new URL(href, "http://localhost").searchParams.get("slug");
      expect(knownSlugs.has(slug)).toBe(true);
    }
  });

  it("keeps slider thumbnails equal height with tight image-to-label gap", () => {
    expect(css).toMatch(
      /\.about-page\s+\.store-products-slider__media\s*\{[^}]*aspect-ratio:\s*4\s*\/\s*3/s
    );
    expect(css).toMatch(
      /\.about-page\s+\.store-products-slider__media\s+img\s*\{[^}]*object-fit:\s*cover/s
    );
    expect(css).toMatch(
      /\.about-page\s+\.store-products-slider__slide\s*\{[^}]*gap:\s*var\(--space-1\)/s
    );
    expect(css).not.toMatch(
      /\.about-page\s+\.store-products-slider__media\s+img\s*\{[^}]*object-fit:\s*contain/s
    );
  });

  it("keeps the products slider title in sentence case", () => {
    expect(css).toMatch(
      /\.about-page\s+\.store-products-slider__title\s*\{[^}]*text-transform:\s*none/s
    );
    expect(css).not.toMatch(
      /\.about-page\s+\.store-products-slider__title\s*\{[^}]*text-transform:\s*uppercase/s
    );
  });

  it("includes the green contact CTA band with button only", () => {
    expect(html).toContain('class="about-contact-cta"');
    expect(html).toContain('class="about-contact-cta__shell layout-wide"');
    expect(html).toContain('class="about-contact-cta__band"');
    expect(html).toContain('class="about-contact-cta__button" href="/pages/contact.html"');
    expect(html).toContain(">Contactez-nous</a>");
  });

  it("styles the products slider for five visible slides on desktop", () => {
    expect(css).toContain(".store-products-slider__track");
    expect(css).toMatch(
      /@media\s*\(min-width:\s*1024px\)\s*\{[^}]*\.store-products-slider__slide\s*\{[^}]*calc\(\(100% - 6rem\) \/ 5\)/s
    );
  });

  it("initializes the store products slider on about-store pages", () => {
    expect(appJs).toContain('case "about-store"');
    expect(appJs).toContain("initStoreProductsSlider()");
  });
});
