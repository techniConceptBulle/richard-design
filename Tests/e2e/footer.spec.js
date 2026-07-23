/**
 * Tests E2E — footer global partagé (contact, liens regroupés, horaires).
 */
import { test, expect } from "@playwright/test";

test.describe("Global footer", () => {
  test("renders contact, five balanced columns and hours on desktop", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto("/");

    const footer = page.locator(".footer-global");

    await expect(footer).toBeVisible();
    await expect(footer.locator(".footer-global__contact-col")).toContainText("Richard La Literie");
    await expect(footer.locator(".footer-global__contact-col")).toContainText("Rue des Alpes 2");
    await expect(footer.getByRole("link", { name: "+41 21 634 04 76" })).toHaveAttribute(
      "href",
      "tel:+41216340476"
    );
    await expect(footer.getByRole("link", { name: "info@richard-decoration.ch" })).toHaveAttribute(
      "href",
      "mailto:info@richard-decoration.ch"
    );
    await expect(footer.locator(".footer-global__links-cluster")).toHaveCount(1);
    await expect(footer.locator(".footer-global__column")).toHaveCount(3);
    await expect(footer.locator(".footer-global__hours-col")).toContainText("Horaires");
    await expect(footer.locator(".footer-global__hours-col")).toContainText("9h00");
    await expect(footer.locator(".footer-global__copyright")).toContainText(/© \d{4} Richard La Literie/);
    await expect(footer.locator(".footer-global__socials")).toHaveCount(0);

    const layout = await page.evaluate(() => {
      const grid = document.querySelector(".footer-global__grid");
      if (!grid) return null;

      const columns = getComputedStyle(grid)
        .gridTemplateColumns.split(" ")
        .map((value) => parseFloat(value))
        .filter((value) => !Number.isNaN(value));

      return {
        columnCount: columns.length,
        columns,
        gridClientWidth: grid.clientWidth,
        gap: parseFloat(getComputedStyle(grid).columnGap) || 0,
      };
    });

    expect(layout?.columnCount).toBe(5);
    const referenceWidth = layout?.columns[0] ?? 0;
    for (const width of layout?.columns ?? []) {
      expect(width).toBeCloseTo(referenceWidth, 0);
    }

    const columnsTotal =
      (layout?.columns ?? []).reduce((sum, width) => sum + width, 0) +
      ((layout?.columnCount ?? 1) - 1) * (layout?.gap ?? 0);
    expect(columnsTotal).toBeCloseTo(layout?.gridClientWidth ?? 0, 0);
  });

  test("uses five equal grid tracks on desktop", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto("/");

    const columnCount = await page.locator(".footer-global__grid").evaluate((grid) => {
      return getComputedStyle(grid).gridTemplateColumns.split(" ").length;
    });
    expect(columnCount).toBe(5);
  });

  test("exposes navigation and legal links with reference labels", async ({ page }) => {
    await page.goto("/pages/product.html");

    const footer = page.locator(".footer-global");
    await expect(footer.getByRole("link", { name: "À propos", exact: true })).toHaveAttribute(
      "href",
      "/pages/about.html"
    );
    await expect(footer.getByRole("link", { name: "Offres du moment", exact: true })).toBeVisible();
    await expect(footer.getByRole("link", { name: "Politique de confidentialité" })).toHaveAttribute(
      "href",
      "/pages/privacy.html"
    );
  });

  test("uses 16px body text and larger column titles on desktop", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto("/");

    const footer = page.locator(".footer-global");
    await expect(footer.locator(".footer-global__contact-link").first()).toHaveCSS(
      "font-size",
      "16px"
    );
    await expect(footer.locator(".footer-global__link").first()).toHaveCSS("font-size", "16px");
    await expect(footer.locator(".footer-global__hours-line").first()).toHaveCSS(
      "font-size",
      "16px"
    );
    await expect(footer.locator(".footer-global__title").first()).toHaveCSS("font-size", "16px");
    await expect(footer.locator(".footer-global__title").first()).toHaveCSS("font-weight", "700");
  });

  test("uses product-style gradient background", async ({ page }) => {
    await page.goto("/");

    await expect(page.locator(".footer-global")).toHaveCSS(
      "background-image",
      /linear-gradient/
    );
  });
});
