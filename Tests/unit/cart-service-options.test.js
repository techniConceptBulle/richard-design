/**
 * Tests unitaires — options services panier + persistance localStorage.
 */
import { beforeEach, describe, expect, it } from "vitest";
import {
  getCartServiceOptions,
  saveCartServiceOptions
} from "../../js/cart.js";
import {
  CART_SERVICE_OPTION_PANELS,
  renderCartServiceOptionsBlock
} from "../../js/render.js";

describe("cart service options storage", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("returns empty object by default", () => {
    expect(getCartServiceOptions()).toEqual({});
  });

  it("persists selected service option indexes", () => {
    saveCartServiceOptions({ delivery: 1, recycle: 2 });
    expect(getCartServiceOptions()).toEqual({ delivery: 1, recycle: 2 });
  });
});

describe("renderCartServiceOptionsBlock", () => {
  it("exposes delivery, recycle and warranty panels", () => {
    expect(Object.keys(CART_SERVICE_OPTION_PANELS)).toEqual([
      "delivery",
      "recycle",
      "warranty"
    ]);
  });

  it("renders selectable radios for cart page", () => {
    const html = renderCartServiceOptionsBlock({ delivery: 1 });
    expect(html).toContain("cart-service-options");
    expect(html).toContain("Options de Livraison et Installation");
    expect(html).toContain('type="radio"');
    expect(html).toContain('name="cart-service-delivery"');
    expect(html).toContain('value="1"');
    expect(html).toContain("checked");
    expect(html).not.toContain("Consultation seule");
  });
});
