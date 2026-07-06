/**
 * Helpers carte produit — page archive catégorie (maquette richard2026).
 */

/**
 * Retourne les variations encore disponibles à la vente.
 */
export function getProductInStockVariations(product) {
  if (product.type === "variable" && product.variations?.length) {
    return product.variations.filter((variation) => variation.inStock !== false);
  }

  return product.inStock !== false ? [product] : [];
}

/**
 * Libellé de disponibilité affiché sur la carte produit.
 */
export function getProductListingStockLabel(product) {
  const inStockVariations = getProductInStockVariations(product);

  if (!inStockVariations.length) {
    return { label: "Sur commande", modifier: "unavailable" };
  }

  if (inStockVariations.length === 1) {
    return { label: "Dernière pièce", modifier: "low" };
  }

  return { label: "En stock", modifier: "in" };
}

/**
 * Note mock déterministe — les données JSON n'incluent pas encore d'avis clients.
 */
export function getProductListingRating(product) {
  let hash = 0;

  for (let index = 0; index < product.id.length; index += 1) {
    hash = (hash + product.id.charCodeAt(index) * (index + 1)) % 6;
  }

  return hash;
}

/**
 * Génère le HTML des étoiles de notation (0 à 5).
 */
export function renderProductStarRating(rating) {
  const stars = [];

  for (let index = 1; index <= 5; index += 1) {
    stars.push(
      `<span class="category-product-star${index <= rating ? " is-filled" : ""}" aria-hidden="true">★</span>`
    );
  }

  return `<div class="category-product-rating" aria-label="Note ${rating} sur 5">${stars.join("")}</div>`;
}

/**
 * Badges promo superposés à l'image produit (-X %, Soldes).
 */
export function renderCategoryProductSaleBadges(discountPercent) {
  if (!discountPercent || discountPercent <= 0) {
    return "";
  }

  return `
    <div class="category-product-badges" aria-label="Promotion -${discountPercent} pour cent">
      <span class="category-product-badge category-product-badge--discount">-${discountPercent}%</span>
      <span class="category-product-badge category-product-badge--promo">Soldes</span>
    </div>
  `;
}
