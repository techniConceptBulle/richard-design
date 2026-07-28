/**
 * Tests E2E — page Marques et pages détail de marque.
 */
import { expect, test } from "@playwright/test";

test.describe("Brands pages", () => {
  test("lists featured brand tiles and opens a brand detail page", async ({ page }) => {
    await page.goto("/pages/brands.html");

    await expect(page.getByRole("heading", { name: "Nos marques partenaires" })).toBeVisible();

    const tiles = page.locator(".brand-tile");
    await expect(tiles).toHaveCount(4);

    await expect(page.locator('a.brand-tile[href*="slug=roviva"]')).toBeVisible();
    await expect(page.locator('a.brand-tile[href*="slug=selecta"]')).toBeVisible();
    await expect(page.locator('a.brand-tile[href*="slug=rowa"]')).toBeVisible();
    await expect(page.locator('a.brand-tile[href*="slug=swissflex"]')).toBeVisible();

    await page.locator('a.brand-tile[href*="slug=roviva"]').click();
    await expect(page).toHaveURL(/brand\.html\?slug=roviva/);
    await expect(page.getByRole("heading", { name: "Roviva", exact: true })).toBeHidden();
    await expect(page.locator(".brand-detail__logo")).toBeVisible();
    await expect(page.locator("h2.brand-detail__headline")).toContainText("1748");
    await expect(page.locator(".brand-detail__gallery-item")).toHaveCount(5);
    await expect(page.locator(".brand-detail__gallery-item--featured")).toHaveCount(1);
  });

  test("brand gallery opens a lightbox that can be navigated", async ({ page }) => {
    await page.goto("/pages/brand.html?slug=roviva");
    await page.locator('[data-brand-gallery-index="0"]').click();
    await expect(page.locator(".brand-lightbox")).toBeVisible();
    await expect(page.locator(".brand-lightbox__counter")).toHaveText("1 / 5");
    await page.locator('[data-brand-lightbox-direction="next"]').click();
    await expect(page.locator(".brand-lightbox__counter")).toHaveText("2 / 5");
  });

  test("brand logo links to the manufacturer website", async ({ page }) => {
    await page.goto("/pages/brand.html?slug=swissflex");

    const logoLink = page.locator(".brand-detail__logo-link");
    await expect(logoLink).toBeVisible();
    await expect(logoLink).toHaveAttribute("href", "https://www.swissflex.com/ch-fr/home");
    await expect(logoLink).toHaveAttribute("target", "_blank");
  });

  test("selecta and rowa share the same editorial headline", async ({ page }) => {
    await page.goto("/pages/brand.html?slug=selecta");
    const selectaHeadline = await page.locator(".brand-detail__headline").textContent();

    await page.goto("/pages/brand.html?slug=rowa");
    const rowaHeadline = await page.locator(".brand-detail__headline").textContent();

    expect(selectaHeadline?.trim()).toBe(rowaHeadline?.trim());
    expect(selectaHeadline).toContain("100 ans");

    await expect(page.locator(".brand-detail__logo-link")).toHaveAttribute(
      "href",
      "https://roewa.com/de-CH/startseite"
    );
  });
});
