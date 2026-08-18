/**
 * Tests unitaires — menu catalogue, bandeau services, conseil accueil et image fondateur (home).
 */
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const rootDir = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const richardCss = readFileSync(resolve(rootDir, "styles/richard-design.css"), "utf8");
const tokensCss = readFileSync(resolve(rootDir, "styles/tokens.css"), "utf8");

describe("home nav menu density", () => {
  it("forces single-line catalogue labels on desktop", () => {
    expect(richardCss).toMatch(
      /\.nav-primary\s+\.menu-link\s*\{[^}]*white-space:\s*nowrap/s
    );
  });

  it("reduces desktop nav horizontal padding versus previous gutter-lg", () => {
    expect(richardCss).toMatch(
      /@media\s*\(min-width:\s*1280px\)\s*\{[^}]*\.nav-primary__inner\s*\{[^}]*padding:\s*1\.05rem 1rem/s
    );
    expect(richardCss).not.toMatch(
      /@media\s*\(min-width:\s*1280px\)\s*\{[^}]*\.nav-primary__inner\s*\{[^}]*padding:\s*[^;]*var\(--gutter-lg\)/s
    );
  });

  it("uses a thicker vertical padding on the catalogue bar", () => {
    expect(richardCss).toMatch(
      /@media\s*\(min-width:\s*768px\)\s*\{[^}]*\.nav-primary__inner\s*\{[^}]*padding:\s*1\.05rem 0\.75rem/s
    );
    expect(richardCss).toMatch(
      /\.nav-primary\s+\.menu-inner li\s*\{[^}]*margin-block:\s*-1\.05rem/s
    );
    expect(richardCss).toMatch(
      /@media\s*\(min-width:\s*768px\)\s*\{[\s\S]*?\.nav-primary\s+\.menu-link\s*\{[^}]*padding:\s*1\.15rem 0\.25rem/
    );
    expect(richardCss).not.toMatch(
      /@media\s*\(min-width:\s*768px\)\s*\{[^}]*\.nav-primary__inner\s*\{[^}]*padding:\s*0\.55rem 0\.75rem/s
    );
  });

  it("bumps envelope fallback heights with the thicker nav", () => {
    expect(tokensCss).toContain("--envelope-height-mobile: 15.75rem");
    expect(tokensCss).toContain("--envelope-height-desktop: 12.25rem");
    expect(tokensCss).not.toContain("--envelope-height-mobile: 14.75rem");
    expect(tokensCss).not.toContain("--envelope-height-desktop: 11.25rem");
  });
});

describe("home services band", () => {
  it("spreads the four service blocks across the full shell width", () => {
    expect(richardCss).toMatch(
      /\.rd-page\s+\.services__grid\s*\{[^}]*justify-content:\s*space-between/s
    );
    expect(richardCss).toMatch(
      /\.rd-page\s+\.service\s*\{[^}]*flex:\s*1 1 0/s
    );
  });
});

describe("home product advice section", () => {
  const indexHtml = readFileSync(resolve(rootDir, "index.html"), "utf8");
  const productCss = readFileSync(resolve(rootDir, "styles/product-page.css"), "utf8");

  it("replaces the appointment block with the product advice markup", () => {
    expect(indexHtml).toContain('class="product-advice advice"');
    expect(indexHtml).toContain("Besoin d'un conseil ?");
    expect(indexHtml).toContain("Contactez-nous");
    expect(indexHtml).toContain("product-advice__inner layout-wide");
    expect(indexHtml).not.toContain('class="appointment"');
    expect(indexHtml).not.toContain("Prendre rendez-vous");
  });

  it("scopes product-advice styles to .rd-page so home and product share them", () => {
    expect(productCss).toMatch(/\.rd-page\s+\.product-advice\s*\{/);
    expect(productCss).not.toMatch(/\.single-product-page\s+\.product-advice\s*\{/);
  });

  it("places the advice section after the brands block", () => {
    const brandsIdx = indexHtml.indexOf('class="brands brands--static"');
    const adviceIdx = indexHtml.indexOf('class="product-advice advice"');
    expect(brandsIdx).toBeGreaterThan(-1);
    expect(adviceIdx).toBeGreaterThan(brandsIdx);
  });
});

describe("home brand logos grid", () => {
  it("uses a static 4-column grid on desktop instead of a 5-slot carousel track", () => {
    expect(richardCss).toMatch(
      /\.rd-page\s+\.brands--static\s+\.brand-row--grid\s*\{[^}]*grid-template-columns:\s*repeat\(2/s
    );
    expect(richardCss).toMatch(
      /@media\s*\(min-width:\s*768px\)\s*\{[^}]*\.brands--static\s+\.brand-row--grid\s*\{[^}]*repeat\(4/s
    );
    expect(richardCss).toMatch(
      /\.rd-page\s+\.brands--static\s+\.brand-row__logo\s*\{[^}]*object-fit:\s*contain/s
    );
  });
});

describe("home founder image", () => {
  it("uses object-fit contain so the portrait is fully visible", () => {
    expect(richardCss).toMatch(
      /\.rd-page\s+\.history__media\s+img\s*\{[^}]*object-fit:\s*contain/s
    );
    expect(richardCss).not.toMatch(
      /\.rd-page\s+\.history__media\s+img\s*\{[^}]*object-fit:\s*cover/s
    );
  });

  it("does not force a cropped fixed media height on desktop", () => {
    expect(richardCss).not.toMatch(
      /\.rd-page\s+\.history__media\s*\{[^}]*height:\s*15\.875rem/s
    );
  });
});
