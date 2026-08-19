/**
 * Tests unitaires — bloc conseil partagé (fiche produit et pages À propos).
 */
import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import {
  mountProductAdviceSection,
  renderProductAdviceSectionHtml
} from "../../js/product-advice-section.js";

const aboutPages = [
  "pages/expert-literie-crissier.html",
  "pages/magasin-crissier.html",
  "pages/services-premium.html",
  "pages/produits-literie.html"
];

const css = readFileSync(resolve(process.cwd(), "styles/about-page.css"), "utf8");
const appJs = readFileSync(resolve(process.cwd(), "js/app.js"), "utf8");
const renderJs = readFileSync(resolve(process.cwd(), "js/render.js"), "utf8");

describe("product advice section module", () => {
  it("returns the product page advice markup with three contact cards", () => {
    const html = renderProductAdviceSectionHtml();

    expect(html).toContain('class="product-advice advice"');
    expect(html).toContain("Besoin d'un conseil ?");
    expect(html).toContain("Appelez-nous");
    expect(html).toContain("Écrivez-nous");
    expect(html).toContain("Venez-nous rencontrer");
    expect(html).toContain('class="product-advice__cta about-btn" href="/pages/contact.html"');
    expect(html).toContain('src="/assets/icons/appel.png"');
    expect(html).toContain('src="/assets/icons/enveloppe.png"');
    expect(html).toContain('src="/assets/icons/magasin.png"');
  });

  it("mounts the advice block into a placeholder container", () => {
    const container = document.createElement("div");
    mountProductAdviceSection(container);

    expect(container.querySelector(".product-advice")).not.toBeNull();
    expect(container.querySelector(".product-advice__card")).not.toBeNull();
    expect(container.querySelectorAll(".product-advice__card")).toHaveLength(3);
  });

  it("does nothing when mount target is missing", () => {
    expect(() => mountProductAdviceSection(null)).not.toThrow();
  });
});

describe("about pages product advice mount", () => {
  it.each(aboutPages)("includes the advice mount placeholder on %s", (pagePath) => {
    const html = readFileSync(resolve(process.cwd(), pagePath), "utf8");

    expect(html).toContain('class="about-page-advice-shell layout-wide"');
    expect(html).toContain("data-product-advice-mount");
    expect(html).not.toContain('class="about-contact-cta"');
    expect(html.indexOf("about-page-advice-shell")).toBeLessThan(html.indexOf("</main>"));
  });

  it("matches product advice containment on about pages", () => {
    expect(css).toMatch(/\.about-page\s+\.about-page-advice-shell\.layout-wide\s*\{[^}]*padding-bottom:\s*var\(--space-10\)/s);
    expect(css).toMatch(
      /@media\s*\(min-width:\s*1024px\)\s*\{\s*\.about-page\s+\.about-page-advice-shell\.layout-wide\s*\{[^}]*padding-bottom:\s*var\(--space-12\)/s
    );
    expect(css).toMatch(/\.about-page\s+\.about-page-advice-shell\s+\.product-advice\s*\{[^}]*margin-top:\s*0/s);
  });

  it("mounts advice blocks on page init via app.js", () => {
    expect(appJs).toContain("initAboutProductAdviceMount");
    expect(appJs).toContain("mountProductAdviceSection");
    expect(appJs).toContain("[data-product-advice-mount]");
  });

  it("reuses the shared module from render.js for product pages", () => {
    expect(renderJs).toContain('from "./product-advice-section.js"');
    expect(renderJs).toContain("renderProductAdviceSectionHtml()");
  });

  it("removes the former blue brands-slider contact button from the expert page", () => {
    const html = readFileSync(
      resolve(process.cwd(), "pages/expert-literie-crissier.html"),
      "utf8"
    );
    expect(html).not.toContain("about-brands-slider__contact");
    expect(html).not.toContain("about-brands-slider__cta");
  });
});
