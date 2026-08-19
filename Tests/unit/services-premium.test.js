/**
 * Tests unitaires — page Nos services premium.
 */
import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const html = readFileSync(resolve(process.cwd(), "pages/services-premium.html"), "utf8");

describe("services-premium page structure", () => {
  it("keeps premium then reviews then also-block then contact CTA", () => {
    const premiumIdx = html.indexOf('class="about-premium"');
    const reviewsIdx = html.indexOf('class="about-reviews"');
    const universIdx = html.indexOf('class="univers about-univers"');
    const adviceIdx = html.indexOf("data-product-advice-mount");

    expect(premiumIdx).toBeGreaterThan(-1);
    expect(reviewsIdx).toBeGreaterThan(premiumIdx);
    expect(universIdx).toBeGreaterThan(reviewsIdx);
    expect(adviceIdx).toBeGreaterThan(universIdx);
  });

  it("removes accompaniment title and uses branded fabricants icon", () => {
    expect(html).not.toContain("Accompagnement sur mesure");
    expect(html).not.toContain("about-premium-card__badge");
    expect(html).toContain('src="/assets/icons/expertise.png"');
    expect(html).toContain('src="/assets/icons/conseils.png"');
    expect(html).toContain('src="/assets/icons/essai-a-domicile.png"');
    expect(html).toContain('src="/assets/icons/livraison-rapide.png"');
    expect(html).toContain('src="/assets/icons/garantie-satisfaction.png"');
  });

  it("includes google testimonials mock and three discovery cards", () => {
    expect(html).toContain("Quelques témoignages de dormeurs heureux");
    expect(html).toContain('data-mock="trustindex"');
    expect(html).toContain("Richard La Literie c'est aussi :");
    expect(html).toContain("Nos conseils pour mieux dormir");
    expect(html).toContain("Des produits sélectionnés avec soin");
    expect(html).toContain("Des services premium");
    expect(html).toContain('href="/pages/advice.html"');
    expect(html).toContain('href="/pages/produits-literie.html"');
    expect(html).toContain('src="/assets/home/hero-slide-bedroom.jpg"');
    expect(html).not.toContain("<strong>Richard La Literie</strong>");
  });
});

describe("services-premium spacing styles", () => {
  const css = readFileSync(resolve(process.cwd(), "styles/about-page.css"), "utf8");

  it("keeps premium icons borderless and widens intro/row gaps", () => {
    expect(css).toMatch(/\.about-premium-card__icon\s*\{[^}]*border:\s*none/s);
    expect(css).toMatch(/\.about-premium__header\s*\{[^}]*margin:\s*0 auto var\(--space-16\)/s);
    expect(css).toMatch(/\.about-premium__grid\s*\{[^}]*row-gap:\s*var\(--space-16\)/s);
  });

  it("centers also-title with shared section title spacing", () => {
    expect(css).toMatch(
      /\.about-page \.about-univers \.univers__header\s*\{[^}]*text-align:\s*center/s
    );
    expect(css).toMatch(
      /\.about-page \.about-univers \.univers__header\s*\{[^}]*margin:\s*0 0 var\(--space-8\)/s
    );
    expect(css).toMatch(/\.about-page \.about-univers \.ucard__link\s*\{[^}]*margin-top:\s*var\(--space-8\)/s);
  });
});
