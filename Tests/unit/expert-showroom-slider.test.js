/**
 * Tests unitaires — markup / styles du slider showroom page expert.
 */
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const rootDir = resolve(dirname(fileURLToPath(import.meta.url)), "../..");

describe("expert showroom slider markup", () => {
  const html = readFileSync(
    resolve(rootDir, "pages/expert-literie-crissier.html"),
    "utf8"
  );
  const css = readFileSync(resolve(rootDir, "styles/about-page.css"), "utf8");

  it("places the showroom slider after the store location block", () => {
    const storeIdx = html.indexOf('class="about-store-location"');
    const sliderIdx = html.indexOf('id="about-showroom-slider"');
    const brandsIdx = html.indexOf('id="about-brand-row"');
    expect(storeIdx).toBeGreaterThan(-1);
    expect(sliderIdx).toBeGreaterThan(storeIdx);
    expect(brandsIdx).toBeGreaterThan(sliderIdx);
  });

  it("keeps the slider inside layout-wide without HTML brand mark", () => {
    expect(html).toContain("about-showroom-slider__inner layout-wide");
    expect(html).toContain("about-showroom-slider__slide");
    expect(html.match(/about-showroom-slider__slide/g)?.length).toBeGreaterThanOrEqual(3);
    expect(html.match(/about-showroom-slider__bullet/g)?.length).toBe(3);
    expect(html).not.toContain("about-showroom-slider__mark");
    expect(html).not.toContain("about-showroom-slider__panel");
    expect(html).toContain("/assets/home/showroom-slide-1.jpg");
    expect(html).toContain('/assets/home/hero-slide-wall.jpg');
  });

  it("styles active bullet in site green and constrains the slider in the container", () => {
    expect(css).toMatch(
      /\.about-showroom-slider__bullet\.is-active\s*\{[^}]*background:\s*var\(--color-accent-strong\)/s
    );
    expect(css).toMatch(/\.about-showroom-slider__inner\.layout-wide/);
    expect(css).not.toMatch(/\.about-showroom-slider__mark\s*\{/);
  });
});
