/**
 * Tests unitaires — dossiers copiés par le plugin Vite post-build.
 */
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const viteConfigPath = resolve(
  dirname(fileURLToPath(import.meta.url)),
  "../../vite.config.js"
);

describe("vite static copy dirs", () => {
  it("copies only data and assets, not deprecated homepage or product", () => {
    const source = readFileSync(viteConfigPath, "utf8");

    expect(source).toContain("STATIC_COPY_DIRS = ['data', 'assets']");
    expect(source).not.toContain("'homepage'");
    expect(source).not.toContain("'product'");
  });

  it("skips missing directories during copy", () => {
    const source = readFileSync(viteConfigPath, "utf8");

    expect(source).toContain("existsSync(src)");
  });
});
