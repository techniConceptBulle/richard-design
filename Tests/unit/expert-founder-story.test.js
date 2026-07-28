/**
 * Tests unitaires — contenu section fondateur / histoire page expert.
 */
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const rootDir = resolve(dirname(fileURLToPath(import.meta.url)), "../..");

describe("expert founder story content", () => {
  const html = readFileSync(
    resolve(rootDir, "pages/expert-literie-crissier.html"),
    "utf8"
  );
  const css = readFileSync(resolve(rootDir, "styles/about-page.css"), "utf8");

  it("centers text under the founder photo", () => {
    expect(css).toMatch(
      /\.about-founder__body\s*\{[^}]*text-align:\s*center/s
    );
  });

  it("splits the founder quote before Nous ne vendons", () => {
    const quoteMatch = html.match(
      /<blockquote class="about-founder__quote">([\s\S]*?)<\/blockquote>/
    );
    expect(quoteMatch).toBeTruthy();
    const quote = quoteMatch[1];
    expect(quote).toMatch(/besoins et vous guider\.\s*<\/p>/);
    expect(quote).toMatch(/<p>\s*Nous ne vendons pas un produit standard/);
  });

  it("uses the client story copy in the right column", () => {
    expect(html).toContain("Au cœur de Crissier, Rue des Alpes 2");
    expect(html).toContain("adresse emblématique");
    expect(html).toContain("simple clic sur Internet");
    expect(html).toContain("confort sur mesure");
    expect(html).not.toContain("Installés au cœur de Crissier, au 2 rue des Alpes");
  });

  it("keeps breadcrumb current weight regular", () => {
    const baseCss = readFileSync(resolve(rootDir, "styles/base.css"), "utf8");
    expect(baseCss).toMatch(
      /\.breadcrumb\s+\.breadcrumb__current\s*\{[^}]*font-weight:\s*400/s
    );
    expect(baseCss).not.toMatch(
      /\.breadcrumb\s+\.breadcrumb__current\s*\{[^}]*font-weight:\s*700/s
    );
  });

  it("colors founder role with accent green and recenters photo subject", () => {
    expect(css).toMatch(
      /\.about-founder__role\s*\{[^}]*color:\s*var\(--color-accent-strong\)/s
    );
    expect(css).toMatch(/margin-left:\s*-14%/);
    expect(css).toMatch(/width:\s*122%/);
  });
});
