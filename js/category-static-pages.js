/**
 * Génération des pages HTML statiques /categorie/{slug}.html pour le build.
 * Permet à un hébergeur statique (Render) de servir les pretty URLs sans rewrite.
 */
import { mkdirSync, readFileSync, writeFileSync, existsSync } from "node:fs";
import { dirname, resolve } from "node:path";

/**
 * Construit les chemins relatifs dist pour chaque slug catégorie.
 * @param {Array<{ slug?: string }>} categories
 * @returns {string[]}
 */
export function getCategoryStaticPagePaths(categories) {
  if (!Array.isArray(categories)) {
    return [];
  }
  return categories
    .map((entry) => (entry?.slug ? String(entry.slug).trim() : ""))
    .filter(Boolean)
    .map((slug) => `categorie/${slug}.html`);
}

/**
 * Injecte data-category-slug dans le body (fiable même derrière un proxy type Huddlekit).
 * @param {string} html
 * @param {string} slug
 * @returns {string}
 */
export function injectCategorySlugAttribute(html, slug) {
  if (!html || !slug) {
    return html || "";
  }
  const safeSlug = String(slug).replace(/"/g, "");
  if (/data-category-slug=/.test(html)) {
    return html.replace(
      /data-category-slug="[^"]*"/,
      `data-category-slug="${safeSlug}"`
    );
  }
  return html.replace(
    /(<body\b[^>]*\bdata-page="category")/,
    `$1 data-category-slug="${safeSlug}"`
  );
}

/**
 * Copie pages/category.html vers dist/categorie/{slug}.html pour chaque catégorie.
 * @param {string} outDir - Dossier de sortie Vite (dist)
 * @param {string} categoriesJsonPath - Chemin vers data/categories.json
 * @returns {string[]} Chemins écrits (relatifs à outDir)
 */
export function emitCategoryStaticPages(outDir, categoriesJsonPath) {
  const categoryHtmlPath = resolve(outDir, "pages/category.html");
  if (!existsSync(categoryHtmlPath) || !existsSync(categoriesJsonPath)) {
    return [];
  }

  const html = readFileSync(categoryHtmlPath, "utf8");
  const categories = JSON.parse(readFileSync(categoriesJsonPath, "utf8"));
  const written = [];

  for (const entry of categories) {
    const slug = entry?.slug ? String(entry.slug).trim() : "";
    if (!slug) {
      continue;
    }
    const relativePath = `categorie/${slug}.html`;
    const target = resolve(outDir, relativePath);
    mkdirSync(dirname(target), { recursive: true });
    writeFileSync(target, injectCategorySlugAttribute(html, slug), "utf8");
    written.push(relativePath);
  }

  return written;
}
