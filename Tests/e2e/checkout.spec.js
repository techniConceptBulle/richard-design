/**
 * Tests E2E — page checkout (layout aligné panier).
 */
import { test, expect } from "@playwright/test";

const PRODUCT_URL = "/pages/product.html?slug=matelas-superba-elegance";

/**
 * Ajoute un produit puis ouvre le checkout.
 */
async function goToCheckoutWithItem(page) {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto(PRODUCT_URL);
  await page.locator("#product-add-to-cart").click();
  await expect(page.locator(".product-cart-feedback")).toContainText("ajouté au panier");
  await page.goto("/pages/checkout.html");
}

test.describe("Checkout page layout", () => {
  test("matches cart padding, borders and cleaned header", async ({ page }) => {
    await goToCheckoutWithItem(page);

    const shell = page.locator(".checkout-page-shell");
    await expect(shell).toBeVisible();
    await expect(shell).toHaveCSS("padding-top", "40px");
    await expect(shell).toHaveCSS("padding-bottom", "64px");

    await expect(page.getByRole("heading", { name: "Finaliser votre commande", level: 1 })).toBeVisible();
    await expect(page.getByText("Commande", { exact: true })).toHaveCount(0);
    await expect(page.getByText(/Renseignez vos coordonnées/i)).toHaveCount(0);
    await expect(page.locator(".checkout-section-note")).toHaveCount(0);

    await expect(page.locator(".checkout-form")).toHaveCSS("border-top-color", "rgb(216, 216, 216)");
    await expect(page.locator(".checkout-summary")).toHaveCSS("border-top-color", "rgb(216, 216, 216)");
    await expect(page.locator(".checkout-shipping-option").first()).toHaveCSS(
      "border-top-color",
      "rgb(216, 216, 216)"
    );
    await expect(page.locator(".checkout-shipping-option.is-selected")).toHaveCSS(
      "border-top-color",
      "rgb(8, 43, 78)"
    );

    const fields = page.locator(".checkout-form-grid .field");
    await expect(fields.first()).toHaveCSS("margin-bottom", "0px");

    await expect(page.locator(".checkout-submit-button")).toBeVisible();
    await expect(page.locator(".checkout-submit-button")).toHaveCSS(
      "background-color",
      "rgb(6, 47, 82)"
    );
  });
});
