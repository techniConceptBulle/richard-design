// Gestion du panier (localStorage, totaux, quantités).

const CART_KEY = "richard_cart";

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


