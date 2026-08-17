/**
 * Tests unitaires — rewrite Render pour les URLs /categorie/{slug}.html.
 */
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const renderYamlPath = resolve(
  dirname(fileURLToPath(import.meta.url)),
  "../../render.yaml"
);

describe("render.yaml category pretty URLs", () => {
  it("rewrites extensionless /categorie/* as fallback", () => {
    const source = readFileSync(renderYamlPath, "utf8");

    expect(source).toContain("type: rewrite");
    expect(source).toContain("source: /categorie");
    expect(source).toContain("source: /categorie/*");
    expect(source).toContain("destination: /pages/category.html");
    expect(source).not.toContain("source: /categorie/*.html");
  });

  it("keeps static publish path on dist", () => {
    const source = readFileSync(renderYamlPath, "utf8");

    expect(source).toContain("staticPublishPath: ./dist");
    expect(source).not.toContain("destination: /index.html");
  });
});
