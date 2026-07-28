/**
 * Tests unitaires — espacement titre → contenu des pages À propos.
 */
import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const css = readFileSync(resolve(process.cwd(), "styles/about-page.css"), "utf8");

describe("about page title-to-content spacing", () => {
  it("reduces hero bottom padding under the page H1", () => {
    expect(css).toMatch(
      /\.about-hero__inner\s*\{[^}]*padding-block:\s*var\(--space-10\)\s+var\(--space-4\)/s
    );
    expect(css).toMatch(
      /@media\s*\(min-width:\s*1024px\)\s*\{\s*\.about-hero__inner\s*\{[^}]*padding-block:\s*var\(--space-12\)\s+var\(--space-5\)/s
    );
    expect(css).not.toMatch(
      /\.about-hero__inner\s*\{[^}]*padding-block:\s*var\(--space-10\)\s+var\(--space-8\)/s
    );
  });

  it("reduces first section top padding after the hero", () => {
    expect(css).toMatch(
      /\.about-page\s+\.about-hero\s*\+\s*section\s*>\s*\[class\*="__inner"\]\.layout-wide[^\{]*\{[^}]*padding-top:\s*var\(--space-6\)/s
    );
    expect(css).toMatch(
      /@media\s*\(min-width:\s*1024px\)\s*\{\s*\.about-page\s+\.about-hero\s*\+\s*section\s*>\s*\[class\*="__inner"\]\.layout-wide[^\{]*\{[^}]*padding-top:\s*var\(--space-8\)/s
    );
  });

  it("tightens section heading margin toward following content", () => {
    expect(css).toMatch(/\.about-page\s+h2\s*\{[^}]*margin:\s*0\s+0\s+var\(--space-5\)/s);
    expect(css).toMatch(
      /\.about-page\s+\.about-univers\s+\.univers__header\s*\{[^}]*margin:\s*0\s+0\s+var\(--space-5\)/s
    );
    expect(css).toMatch(
      /\.about-reviews__header\s*\{[^}]*margin:\s*0\s+0\s+var\(--space-5\)/s
    );
  });
});
