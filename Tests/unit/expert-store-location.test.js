/**
 * Tests unitaires — bloc magasin (carte + infos) page expert.
 */
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const rootDir = resolve(dirname(fileURLToPath(import.meta.url)), "../..");

describe("expert store location block", () => {
  const html = readFileSync(
    resolve(rootDir, "pages/expert-literie-crissier.html"),
    "utf8"
  );
  const css = readFileSync(resolve(rootDir, "styles/about-page.css"), "utf8");

  it("places the store location section after the founder story", () => {
    const founderIdx = html.indexOf('class="about-founder-story"');
    const storeIdx = html.indexOf('class="about-store-location"');
    const showroomIdx = html.indexOf('id="about-showroom-slider"');
    expect(founderIdx).toBeGreaterThan(-1);
    expect(storeIdx).toBeGreaterThan(founderIdx);
    expect(showroomIdx).toBeGreaterThan(storeIdx);
  });

  it("includes store copy, phone, hours, reviews and CTA", () => {
    expect(html).toContain("Richard La Literie Crissier");
    expect(html).toContain("Votre magasin de literie au cœur de Crissier");
    expect(html).toContain("Rue des Alpes 2, 1023 Crissier");
    expect(html).toContain("021 634 04 76");
    expect(html).toContain("Ouvert du lundi au vendredi de 10h à 13h");
    expect(html).toContain("Les avis de nos clients");
    expect(html).toContain("4,8");
    expect(html).toContain("(408)");
    expect(html).toContain("À votre tour de laisser un avis");
    expect(html).toMatch(
      /class="btn-green about-store-location__cta"[^>]*href="\/pages\/contact\.html"/
    );
  });

  it("exposes map canvas and storefront photo for the map card", () => {
    expect(html).toContain("data-store-map");
    expect(html).toContain("data-store-map-canvas");
    expect(html).toContain("/assets/home/storefront.jpg");
    expect(html).toContain("leaflet@1.9.4/dist/leaflet.css");
  });

  it("styles title in brand blue and CTA with site green button", () => {
    expect(css).toMatch(
      /\.about-store-location__title\s*\{[^}]*color:\s*var\(--color-primary\)/s
    );
    expect(html).toMatch(
      /class="btn-green about-store-location__cta"[^>]*href="\/pages\/contact\.html"/
    );
    expect(css).not.toMatch(/\.about-store-location__cta\s*\{[^}]*background:\s*#c68b4a/s);
  });
});
