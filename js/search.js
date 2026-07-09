/**
 * Recherche produits — filtrage texte sur les mocks catalogue.
 */

/**
 * Filtre les produits mock dont le haystack (nom, descriptions, marque, catégorie) contient le terme.
 *
 * @param {Array<object>} products
 * @param {Array<object>} brands
 * @param {Array<object>} categories
 * @param {string} searchTerm
 * @returns {Array<object>}
 */
export function filterProductsBySearchTerm(products, brands, categories, searchTerm) {
  const normalized = (searchTerm || "").trim().toLowerCase();
  if (!normalized) {
    return [...products];
  }

  return products.filter((product) => {
    const brand = brands.find((item) => item.id === product.brandId);
    const category = categories.find((item) => item.id === product.categoryId);
    const haystack = [
      product.name,
      product.shortDescription,
      product.description,
      brand?.name,
      category?.name
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    return haystack.includes(normalized);
  });
}
