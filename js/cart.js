// Gestion du panier (localStorage, totaux, quantités).

const CART_KEY = "richard_cart";
const CART_SERVICES_KEY = "richard_cart_services";

export function getCartItems() {
  try {
    const raw = window.localStorage.getItem(CART_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveCartItems(items) {
  window.localStorage.setItem(CART_KEY, JSON.stringify(items));
  updateCartBadgeCount(items);
}

/**
 * Options livraison / recyclage / garantie choisies sur la page panier.
 */
export function getCartServiceOptions() {
  try {
    const raw = window.localStorage.getItem(CART_SERVICES_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" && !Array.isArray(parsed) ? parsed : {};
  } catch {
    return {};
  }
}

export function saveCartServiceOptions(options) {
  window.localStorage.setItem(CART_SERVICES_KEY, JSON.stringify(options || {}));
}

export function updateCartBadgeCount(items = null) {
  const pill = document.getElementById("cart-count-pill");
  if (!pill) return;
  const list = items || getCartItems();
  const count = list.reduce((acc, item) => acc + (item.quantity || 1), 0);
  pill.textContent = count > 0 ? String(count) : "";
}

export function initCartBadge() {
  updateCartBadgeCount();
}

export function addToCart(newItem) {
  const items = getCartItems();
  const existingIndex = items.findIndex(
    (item) =>
      item.productId === newItem.productId &&
      item.variationId === newItem.variationId
  );

  if (existingIndex >= 0) {
    items[existingIndex].quantity += newItem.quantity;
  } else {
    items.push(newItem);
  }

  saveCartItems(items);
}
