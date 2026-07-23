/**
 * Tests E2E — page panier (layout, ligne article, options services).
 */
import { test, expect } from "@playwright/test";

const PRODUCT_URL = "/pages/product.html?slug=matelas-superba-elegance";

/**
 * Ajoute un produit puis ouvre le panier.
 */
async function goToCartWithItem(page) {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto(PRODUCT_URL);
  await page.locator("#product-add-to-cart").click();
  await expect(page.locator(".product-cart-feedback")).toContainText("ajouté au panier");
  await page.goto("/pages/cart.html");
}

test.describe("Cart page layout", () => {
  test("matches product-page title, qty, checkout and borders", async ({ page }) => {
    await goToCartWithItem(page);

    const title = page.getByRole("heading", { name: "Panier", level: 1 });
    await expect(title).toBeVisible();
    await expect(title).toHaveCSS("font-weight", "800");
    await expect(page.locator(".cart-page-shell")).toHaveCSS("padding-top", "40px");
    await expect(page.locator(".cart-page-shell")).toHaveCSS("padding-bottom", "64px");
    await expect(page.getByText("Votre sélection")).toHaveCount(0);
    await expect(page.locator(".cart-item-badges")).toHaveCount(0);
    await expect(page.locator(".cart-item .badge")).toHaveCount(0);

    const item = page.locator(".cart-item").first();
    await expect(item).toHaveCSS("border-top-color", "rgb(216, 216, 216)");

    const name = page.locator(".cart-item-name a").first();
    await expect(name).toHaveCSS("font-weight", "700");

    const top = page.locator(".cart-item-top").first();
    const nameBox = await name.boundingBox();
    const priceBox = await page.locator(".cart-item-price").first().boundingBox();
    expect(nameBox).not.toBeNull();
    expect(priceBox).not.toBeNull();
    expect(Math.abs(nameBox.y - priceBox.y)).toBeLessThan(8);
    expect(priceBox.x).toBeGreaterThan(nameBox.x);

    const controls = page.locator(".cart-item-controls").first();
    await expect(controls).toBeVisible();
    const controlsBox = await controls.boundingBox();
    expect(controlsBox.y).toBeGreaterThan(priceBox.y);

    const qty = page.locator(".cart-item-quantity").first();
    const removeBtn = page.locator(".cart-item-remove").first();
    const qtyBox = await qty.boundingBox();
    const removeBox = await removeBtn.boundingBox();
    expect(qtyBox.height).toBe(40);
    expect(removeBox.height).toBe(qtyBox.height);
    expect(removeBox.width).toBe(qtyBox.height);
    await expect(removeBtn).toHaveAttribute("aria-label", "Retirer du panier");
    await expect(removeBtn).not.toContainText("Retirer");
  });
});

test.describe("Cart page service options", () => {
  test("shows beige selectable service options when cart has items", async ({ page }) => {
    await goToCartWithItem(page);
    const block = page.locator(".cart-service-options");
    await expect(block).toBeVisible();
    await expect(block).toHaveCSS("background-color", "rgb(245, 239, 230)");
    await expect(block.getByRole("button", { name: /Livraison et Installation/i })).toBeVisible();
    await expect(block.getByRole("button", { name: /Recyclage/i })).toBeVisible();
    await expect(block.getByRole("button", { name: /^Garantie$/i })).toBeVisible();

    await block.getByRole("button", { name: /Livraison et Installation/i }).click();
    const panel = page.locator('[data-service-panel-content="delivery"]');
    await expect(panel).toBeVisible();
    await expect(panel.locator('input[type="radio"]')).toHaveCount(3);

    await panel.locator('input[type="radio"][value="1"]').check();
    const stored = await page.evaluate(() =>
      JSON.parse(window.localStorage.getItem("richard_cart_services") || "{}")
    );
    expect(stored.delivery).toBe(1);
  });

  test("hides service options when cart is empty", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto("/pages/cart.html");
    await page.evaluate(() => window.localStorage.removeItem("richard_cart"));
    await page.reload();
    await expect(page.locator(".cart-empty")).toBeVisible();
    await expect(page.locator(".cart-service-options")).toHaveCount(0);
  });
});
