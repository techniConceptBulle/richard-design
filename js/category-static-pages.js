/**
 * Génération des pages HTML statiques pretty-URL au build
 * (/categorie, /produit, /marque) pour Render et Huddlekit.
 */
import { mkdirSync, readFileSync, writeFileSync, existsSync } from "node:fs";
import { dirname, resolve } from "node:path";

/**
 * Construit les chemins relatifs dist pour chaque slug.
 * @param {Array<{ slug?: string }>} entries
 * @param {string} prefix
 * @returns {string[]}
 */
export function getEntityStaticPagePaths(entries, prefix) {
  if (!Array.isArray(entries) || !prefix) {
    return [];
  }
  return entries
    .map((entry) => (entry?.slug ? String(entry.slug).trim() : ""))
    .filter(Boolean)
    .map((slug) => `${prefix}/${slug}.html`);
}

/**
 * Construit les chemins relatifs dist pour chaque slug catégorie.
 * @param {Array<{ slug?: string }>} categories
 * @returns {string[]}
 */
export function getCategoryStaticPagePaths(categories) {
  return getEntityStaticPagePaths(categories, "categorie");
}

/**
 * Injecte un attribut data-{entity}-slug dans le body (fiable derrière un proxy).
 * @param {string} html
 * @param {{ dataPage: string, attrName: string, slug: string }} config
 * @returns {string}
 */
export function injectEntitySlugAttribute(html, { dataPage, attrName, slug }) {
  if (!html || !slug || !attrName || !dataPage) {
    return html || "";
  }
  const safeSlug = String(slug).replace(/"/g, "");
  const attrPattern = new RegExp(`${attrName}="[^"]*"`);
  if (attrPattern.test(html)) {
    return html.replace(attrPattern, `${attrName}="${safeSlug}"`);
  }
  const pagePattern = new RegExp(`(<body\\b[^>]*\\bdata-page="${dataPage}")`);
  return html.replace(pagePattern, `$1 ${attrName}="${safeSlug}"`);
}

/**
 * Injecte data-category-slug dans le body.
 * @param {string} html
 * @param {string} slug
 * @returns {string}
 */
export function injectCategorySlugAttribute(html, slug) {
  return injectEntitySlugAttribute(html, {
    dataPage: "category",
    attrName: "data-category-slug",
    slug
  });
}

/**
 * Copie un shell HTML vers dist/{prefix}/{slug}.html pour chaque entrée.
 * @param {{ outDir: string, htmlRelPath: string, jsonPath: string, prefix: string, dataPage: string, attrName: string }} config
 * @returns {string[]}
 */
export function emitEntityStaticPages({
  outDir,
  htmlRelPath,
  jsonPath,
  prefix,
  dataPage,
  attrName
}) {
  const htmlPath = resolve(outDir, htmlRelPath);
  if (!existsSync(htmlPath) || !existsSync(jsonPath)) {
    return [];
  }

  const html = readFileSync(htmlPath, "utf8");
  const entries = JSON.parse(readFileSync(jsonPath, "utf8"));
  const written = [];

  for (const entry of entries) {
    const slug = entry?.slug ? String(entry.slug).trim() : "";
    if (!slug) {
      continue;
    }
    const relativePath = `${prefix}/${slug}.html`;
    const target = resolve(outDir, relativePath);
    mkdirSync(dirname(target), { recursive: true });
    writeFileSync(
      target,
      injectEntitySlugAttribute(html, { dataPage, attrName, slug }),
      "utf8"
    );
    written.push(relativePath);
  }

  return written;
}

/**
 * Copie pages/category.html vers dist/categorie/{slug}.html.
 * @param {string} outDir
 * @param {string} categoriesJsonPath
 * @returns {string[]}
 */
export function emitCategoryStaticPages(outDir, categoriesJsonPath) {
  return emitEntityStaticPages({
    outDir,
    htmlRelPath: "pages/category.html",
    jsonPath: categoriesJsonPath,
    prefix: "categorie",
    dataPage: "category",
    attrName: "data-category-slug"
  });
}

/**
 * Copie pages/product.html vers dist/produit/{slug}.html.
 * @param {string} outDir
 * @param {string} productsJsonPath
 * @returns {string[]}
 */
export function emitProductStaticPages(outDir, productsJsonPath) {
  return emitEntityStaticPages({
    outDir,
    htmlRelPath: "pages/product.html",
    jsonPath: productsJsonPath,
    prefix: "produit",
    dataPage: "product",
    attrName: "data-product-slug"
  });
}

/**
 * Copie pages/brand.html vers dist/marque/{slug}.html.
 * @param {string} outDir
 * @param {string} brandsJsonPath
 * @returns {string[]}
 */
export function emitBrandStaticPages(outDir, brandsJsonPath) {
  return emitEntityStaticPages({
    outDir,
    htmlRelPath: "pages/brand.html",
    jsonPath: brandsJsonPath,
    prefix: "marque",
    dataPage: "brand",
    attrName: "data-brand-slug"
  });
}
