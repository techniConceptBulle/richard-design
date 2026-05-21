// Chargement des données mock (categories, brands, products) depuis /data/*.json.
// Helpers pour filtrer par catégorie, marque, liquidation, etc.

const DATA_BASE_PATH = "/data";

const dataCache = {
  categories: null,
  brands: null,
  products: null
};

async function fetchJsonOnce(key, fileName) {
  if (dataCache[key]) return dataCache[key];
  const res = await fetch(`${DATA_BASE_PATH}/${fileName}`);
  if (!res.ok) {
    throw new Error(`Impossible de charger ${fileName}`);
  }
  const json = await res.json();
  dataCache[key] = json;
  return json;
}

export async function getCategories() {
  return fetchJsonOnce("categories", "categories.json");
}

export async function getBrands() {
  return fetchJsonOnce("brands", "brands.json");
}

export async function getProducts() {
  return fetchJsonOnce("products", "products.json");
}

export async function getMainCategories() {
  const categories = await getCategories();
  return categories.filter(
    (cat) => cat.parentId === null && cat.slug !== "liquidation"
  );
}

export async function getLiquidationProducts() {
  const products = await getProducts();
  return products.filter((p) => p.liquidation === true);
}

export async function getProductBySlug(slug) {
  const products = await getProducts();
  return products.find((p) => p.slug === slug) || null;
}

export async function getCategoryBySlug(slug) {
  const categories = await getCategories();
  return categories.find((c) => c.slug === slug) || null;
}

export async function getBrandBySlug(slug) {
  const brands = await getBrands();
  return brands.find((b) => b.slug === slug) || null;
}


