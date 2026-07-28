/**
 * Tests E2E — pages distinctes du menu À propos.
 */
import { test, expect } from "@playwright/test";

test.describe("About menu pages", () => {
  test("opens each submenu item as a dedicated page", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto("/");

    const aboutItem = page.locator(".nav-primary .menu-item--has-children");
    await aboutItem.hover();

    await aboutItem.getByRole("link", { name: "L'expert de la literie à Crissier", exact: true }).click();
    await expect(page).toHaveURL(/\/pages\/expert-literie-crissier\.html$/);
    await expect(
      page.getByRole("heading", { name: /expert de la literie à Crissier depuis 1933/i, level: 1 })
    ).toBeVisible();
    await expect(page.locator(".about-founder__name")).toContainText("Jean-Marc");

    await aboutItem.hover();
    await aboutItem
      .getByRole("link", { name: "Votre magasin de matelas à Crissier", exact: true })
      .click();
    await expect(page).toHaveURL(/\/pages\/magasin-crissier\.html$/);
    await expect(
      page.getByRole("heading", { name: "Votre magasin de matelas à Crissier", level: 1 })
    ).toBeVisible();

    await aboutItem.hover();
    await aboutItem.getByRole("link", { name: "Nos services premium", exact: true }).click();
    await expect(page).toHaveURL(/\/pages\/services-premium\.html$/);
    await expect(page.getByRole("heading", { name: "Nos services premium", level: 1 })).toBeVisible();

    await aboutItem.hover();
    await aboutItem
      .getByRole("link", { name: "Nos conseils personnalisés sur mesure", exact: true })
      .click();
    await expect(page).toHaveURL(/\/pages\/produits-literie\.html$/);
    await expect(
      page.getByRole("heading", { name: "Nos conseils personnalisés sur mesure", level: 1 })
    ).toBeVisible();
    await expect(
      page.getByRole("heading", {
        name: /accompagnement expert pour une literie parfaitement adaptée/i,
        level: 2,
      })
    ).toBeVisible();
  });

  test("redirects legacy about.html to the expert page", async ({ page }) => {
    await page.goto("/pages/about.html");
    await expect(page).toHaveURL(/\/pages\/expert-literie-crissier\.html$/);
  });
});
