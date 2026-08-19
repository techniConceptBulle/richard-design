/**
 * Tests unitaires — menu catalogue, bandeau services, magasin et image fondateur (home).
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
    expect(tokensCss).not.toContain("--envelope-height-mobile: 16.05rem");
    expect(tokensCss).not.toContain("--envelope-height-desktop: 12.55rem");
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

describe("home store card", () => {
  it("places address on the left, phone and directions on the right left-aligned", () => {
    const indexHtml = readFileSync(resolve(rootDir, "index.html"), "utf8");
    const actionsIndex = indexHtml.indexOf("store-card__actions");
    const addressIndex = indexHtml.indexOf("store-card__address");
    expect(addressIndex).toBeGreaterThan(-1);
    expect(actionsIndex).toBeGreaterThan(addressIndex);
    expect(richardCss).toMatch(/\.store-card__address\s*\{[^}]*text-align:\s*left/s);
    expect(richardCss).toMatch(
      /\.store-card__actions\s*\{[^}]*align-items:\s*flex-start/s
    );
  });

  it("centers the store title and increases space below it", () => {
    expect(richardCss).toMatch(
      /\.rd-page\s+\.store-card__header\s*\{[^}]*justify-content:\s*center/s
    );
    expect(richardCss).toMatch(
      /\.rd-page\s+\.store-card\s*\{[^}]*gap:\s*1\.75rem/s
    );
  });

  it("matches store card icon size to history fact icons", () => {
    expect(richardCss).toMatch(
      /\.rd-page\s+\.store-card\s+\.icon-box\s+img\s*\{[^}]*width:\s*2\.25rem/s
    );
    expect(richardCss).toMatch(
      /\.rd-page\s+\.history__fact-icon\s+img\s*\{[^}]*width:\s*2\.25rem/s
    );
  });

  it("restores the appointment section after the brands block on home", () => {
    const indexHtml = readFileSync(resolve(rootDir, "index.html"), "utf8");
    expect(indexHtml).toContain('class="appointment"');
    expect(indexHtml).toContain("Prendre rendez-vous");
    expect(indexHtml).toContain('href="/pages/contact.html">Prendre rendez-vous</a>');
    expect(indexHtml).toContain('src="/assets/icons/calendrier.png"');
    expect(indexHtml).not.toContain('class="product-advice advice"');
    const brandsIdx = indexHtml.indexOf('class="brands brands--static"');
    const appointmentIdx = indexHtml.indexOf('class="appointment"');
    expect(brandsIdx).toBeGreaterThan(-1);
    expect(appointmentIdx).toBeGreaterThan(brandsIdx);
  });
});

describe("home section backgrounds", () => {
  it("uses white univers, cream brands, footer gradient on appointment and white footer", () => {
    expect(richardCss).toMatch(/\.rd-page\s+\.univers\s*\{[^}]*background:\s*#fff/s);
    expect(richardCss).toMatch(/\.rd-page\s+\.brands\s*\{[^}]*background:\s*#fbf6ed/s);
    expect(richardCss).toMatch(
      /\.rd-page\s+\.appointment\s*\{[^}]*background:\s*linear-gradient\(90deg,\s*var\(--color-topbar-start\),\s*var\(--color-topbar-end\)\)/s
    );
    expect(richardCss).toMatch(/\.footer-global\s*\{[^}]*background:\s*#fff/s);
    expect(richardCss).toMatch(/\.footer-global\s*\{[^}]*box-shadow:\s*0 -2px 8px rgba\(8,\s*43,\s*78,\s*0\.04\)/s);
    expect(richardCss).toMatch(/\.footer-global__link\s*\{[^}]*color:\s*var\(--color-text\)/s);
    expect(richardCss).toMatch(/\.rd-page\s+\.appointment\s+\.appt-kicker\s*\{[^}]*color:\s*#fff/s);
    expect(richardCss).toMatch(/\.rd-page\s+\.appointment\s+\.cal-icon img\s*\{[^}]*filter:\s*brightness\(0\) invert\(1\)/s);
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
