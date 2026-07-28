/**
 * Tests unitaires — bandeau CTA Contactez-nous des pages À propos.
 */
import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const aboutPages = [
  "pages/expert-literie-crissier.html",
  "pages/magasin-crissier.html",
  "pages/services-premium.html",
  "pages/produits-literie.html"
];

const css = readFileSync(resolve(process.cwd(), "styles/about-page.css"), "utf8");

describe("about contact CTA band", () => {
  it.each(aboutPages)("includes the green contact band with button only on %s", (pagePath) => {
    const html = readFileSync(resolve(process.cwd(), pagePath), "utf8");

    expect(html).toContain('class="about-contact-cta"');
    expect(html).toContain('class="about-contact-cta__shell layout-wide"');
    expect(html).toContain('class="about-contact-cta__band"');
    expect(html).toContain('class="about-contact-cta__button"');
    expect(html).toMatch(
      /class="about-contact-cta__button"[^>]*href="\/pages\/contact\.html"[^>]*>\s*Contactez-nous\s*</
    );
    expect(html).not.toContain("Besoin d'un conseil");
    expect(html).not.toContain("Appelez-nous");
    expect(html.indexOf("about-contact-cta")).toBeLessThan(html.indexOf("</main>"));
  });

  it("matches product advice containment: band in container with space after", () => {
    expect(css).toMatch(
      /\.about-page\s+\.about-contact-cta__band\s*\{[^}]*background:\s*linear-gradient\(90deg,\s*#dfe9df,\s*#dfe9df\)/s
    );
    expect(css).toMatch(
      /\.about-page\s+\.about-contact-cta__band\s*\{[^}]*padding:\s*var\(--space-8\)\s+var\(--space-8\)\s+var\(--space-10\)/s
    );
    expect(css).toMatch(
      /\.about-page\s+\.about-contact-cta__shell\.layout-wide\s*\{[^}]*padding-top:\s*0/s
    );
    expect(css).toMatch(
      /\.about-page\s+\.about-contact-cta__shell\.layout-wide\s*\{[^}]*padding-bottom:\s*var\(--space-10\)/s
    );
    expect(css).toMatch(
      /@media\s*\(min-width:\s*1024px\)\s*\{\s*\.about-page\s+\.about-contact-cta__shell\.layout-wide\s*\{[^}]*padding-bottom:\s*var\(--space-12\)/s
    );
    expect(css).toMatch(
      /\.about-page\s+\.about-contact-cta__button\s*\{[^}]*border:\s*1px solid var\(--color-accent-strong\)/s
    );
    expect(css).toMatch(
      /\.about-page\s+\.about-contact-cta__button\s*\{[^}]*background:\s*transparent/s
    );
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
