/**
 * Tests E2E — page archive catégorie alignée richard2026.
 */
import { test, expect } from "@playwright/test";

test.describe("Category archive page", () => {
  test("search mode displays product cards with CHF prices", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto("/pages/category.html?q=matelas");

    await expect(page.locator("#category-title")).toContainText("Resultats");
    await expect(page.locator(".category-archive-controls")).toBeHidden();
    await expect(page.locator("#category-products-grid .category-product-card").first()).toBeVisible();
    await expect(page.locator(".category-product-price-current").first()).toContainText("CHF");
  });

  test("renders centered header, toolbar and rich product cards", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto("/pages/category.html?slug=matelas");

    await expect(page).toHaveTitle(/Matelas.*Richard La Literie/i);

    const homeLink = page.locator(".category-archive-breadcrumb strong");
    await expect(homeLink).toHaveText("Accueil");
    await expect(homeLink).toHaveCSS("color", "rgb(40, 125, 99)");

    await expect(page.locator("#category-title")).toHaveText("Matelas");
    await expect(page.locator("#category-title")).toHaveCSS("text-align", "center");
    await expect(page.locator("#category-description")).toHaveCSS("text-align", "center");

    await expect(page.locator("#category-clear-filters")).toHaveText("Effacer les filtres");
    await expect(page.locator("#category-clear-filters")).toHaveCSS("color", "rgb(8, 43, 78)");
    await expect(page.locator("#category-sort-controls")).toBeVisible();
    const firstFilterSelect = page.locator(
      ".category-archive-filters-panel .category-filter-select:not(.category-sort-select)"
    ).first();
    const searchInput = page.locator("#site-search-input");
    const filterBorder = await firstFilterSelect.evaluate((el) => getComputedStyle(el).border);
    const searchBorder = await searchInput.evaluate((el) => getComputedStyle(el).border);
    expect(filterBorder).toBe(searchBorder);
    await expect(firstFilterSelect).toHaveCSS("border-radius", "8px");
    await expect(page.locator("#category-sort-select")).toHaveCSS("border-top-width", "0px");

    const filtersPanel = page.locator(".category-archive-filters-panel");
    const sortControl = page.locator("#category-sort-controls");
    const clearFilters = page.locator("#category-clear-filters");
    const filtersBox = await filtersPanel.boundingBox();
    const sortBox = await sortControl.boundingBox();
    const clearBox = await clearFilters.boundingBox();
    expect(sortBox).not.toBeNull();
    expect(filtersBox).not.toBeNull();
    expect(clearBox).not.toBeNull();
    await expect(sortControl).not.toHaveCount(0);
    const sortInsideFilters = await sortControl.evaluate(
      (el, panelSelector) => !!el.closest(panelSelector),
      ".category-archive-filters-panel"
    );
    expect(sortInsideFilters).toBe(false);
    await expect(filtersPanel).toHaveCSS("background-color", "rgba(0, 0, 0, 0)");
    const panelBorder = await filtersPanel.evaluate((el) => getComputedStyle(el).border);
    expect(panelBorder).toBe(searchBorder);

    const panelBox = await filtersPanel.boundingBox();
    const filtersGridBox = await page.locator("#category-filters").boundingBox();
    expect(panelBox).not.toBeNull();
    expect(filtersGridBox).not.toBeNull();
    const filtersTopGap = (filtersGridBox?.y ?? 0) - (panelBox?.y ?? 0);
    const filtersBottomGap = (panelBox?.y ?? 0) + (panelBox?.height ?? 0) - ((filtersGridBox?.y ?? 0) + (filtersGridBox?.height ?? 0));
    expect(Math.abs(filtersTopGap - filtersBottomGap)).toBeLessThan(4);

    const filterGroups = page.locator(".category-archive-filters-panel .category-filters-group");
    await expect(filterGroups).toHaveCount(5);
    const filtersLayout = await page.locator("#category-filters").evaluate((el) => {
      const styles = getComputedStyle(el);
      return {
        display: styles.display,
        columns: styles.gridTemplateColumns.split(" ").filter(Boolean).length,
      };
    });
    expect(filtersLayout.display).toBe("grid");
    expect(filtersLayout.columns).toBe(5);
    const groupWidths = await filterGroups.evaluateAll((elements) =>
      elements.map((element) => element.getBoundingClientRect().width)
    );
    expect(Math.max(...groupWidths) - Math.min(...groupWidths)).toBeLessThan(4);
    const panelPadding = await filtersPanel.evaluate((el) => {
      const styles = getComputedStyle(el);
      return {
        left: Number.parseFloat(styles.paddingLeft),
        right: Number.parseFloat(styles.paddingRight),
      };
    });
    const expectedFiltersWidth = (panelBox?.width ?? 0) - panelPadding.left - panelPadding.right;
    expect(Math.abs((filtersGridBox?.width ?? 0) - expectedFiltersWidth)).toBeLessThan(4);

    const sortIcon = page.locator(".category-sort-control .category-filter-icon");
    const sortSelect = page.locator("#category-sort-select");
    const iconBox = await sortIcon.boundingBox();
    const selectBox = await sortSelect.boundingBox();
    expect(iconBox).not.toBeNull();
    expect(selectBox).not.toBeNull();
    expect((selectBox?.x ?? 0) + (selectBox?.width ?? 0) - (iconBox?.x ?? 0) - (iconBox?.width ?? 0)).toBeLessThan(8);

    const textToIconGap = await sortSelect.evaluate((el) => {
      const icon = el.parentElement?.querySelector(".category-filter-icon");
      if (!icon) return 999;
      const selectRect = el.getBoundingClientRect();
      const iconRect = icon.getBoundingClientRect();
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) return 999;
      ctx.font = getComputedStyle(el).font;
      const text = el.options[el.selectedIndex]?.text ?? "";
      const textWidth = ctx.measureText(text).width;
      return iconRect.left - (selectRect.left + textWidth);
    });
    expect(textToIconGap).toBeLessThan(14);

    const firstFilterIcon = page.locator(
      ".category-archive-filters-panel .category-filter-select:not(.category-sort-select)"
    ).first().locator("xpath=../span[contains(@class,'category-filter-icon')]");
    const filterSelectBox = await firstFilterSelect.boundingBox();
    const filterIconBox = await firstFilterIcon.boundingBox();
    expect(filterIconBox).not.toBeNull();
    expect(filterSelectBox).not.toBeNull();
    expect(
      (filterSelectBox?.x ?? 0) + (filterSelectBox?.width ?? 0) - (filterIconBox?.x ?? 0) - (filterIconBox?.width ?? 0)
    ).toBeLessThan(12);
    expect((sortBox?.y ?? 0)).toBeGreaterThan((filtersBox?.y ?? 0) + (filtersBox?.height ?? 0) - 8);
    expect(Math.abs((sortBox?.y ?? 0) - (clearBox?.y ?? 0))).toBeLessThan(36);
    expect((clearBox?.x ?? 0)).toBeGreaterThan((sortBox?.x ?? 0));

    const firstCard = page.locator("#category-products-grid .category-product-card").first();
    await expect(firstCard).toBeVisible();
    await expect(firstCard.locator(".category-product-loop-title")).toContainText(
      /VALEVÅG|VESTMARKA|ÅKREHAMN|MATRAND|HAUGESUND|MORGEDAL|ÅNNELAND/i
    );
    await expect(firstCard.locator(".category-product-loop-title")).toHaveCSS("font-weight", "700");
    await expect(firstCard.locator(".category-product-subtitle")).toHaveCount(0);
    await expect(firstCard.locator(".category-product-media img")).toHaveAttribute(
      "src",
      /\/assets\/images\/products\/ikea\//
    );
    await expect(firstCard.locator(".category-product-badges")).toBeVisible();
    const badge = firstCard.locator(".category-product-badge--discount");
    const defaultShadow = await badge.evaluate((el) => getComputedStyle(el).boxShadow);
    await firstCard.hover();
    const hoverShadow = await badge.evaluate((el) => getComputedStyle(el).boxShadow);
    const hoverTransform = await firstCard.locator(".category-product-media img").evaluate(
      (el) => getComputedStyle(el).transform
    );
    expect(hoverTransform === "none" || hoverTransform === "matrix(1, 0, 0, 1, 0, 0)").toBe(true);
    expect(hoverShadow).not.toBe(defaultShadow);
    await expect(firstCard.locator(".category-product-badge--discount")).toContainText(/-\d+%/);
    await expect(firstCard.locator(".category-product-badge--promo")).toHaveText("Soldes");
    const badgeColor = await firstCard.locator(".category-product-badge--discount").evaluate((el) =>
      getComputedStyle(el).backgroundColor
    );
    expect(badgeColor).toBe("rgb(40, 125, 99)");
    const badgesBox = await firstCard.locator(".category-product-badges").boundingBox();
    const discountBox = await firstCard.locator(".category-product-badge--discount").boundingBox();
    const promoBox = await firstCard.locator(".category-product-badge--promo").boundingBox();
    expect(badgesBox).not.toBeNull();
    expect(discountBox).not.toBeNull();
    expect(promoBox).not.toBeNull();
    expect(Math.abs((discountBox?.y ?? 0) - (promoBox?.y ?? 0))).toBeLessThan(4);
    await expect(firstCard.locator(".category-product-price-old")).toBeVisible();
    await expect(firstCard.locator(".category-product-price-current")).toContainText("CHF");
    await expect(firstCard.locator(".category-product-price-current")).toHaveCSS(
      "color",
      "rgb(8, 43, 78)"
    );
    const imageWidth = await firstCard.locator(".category-product-media img").evaluate((el) =>
      el.getBoundingClientRect().width
    );
    const mediaWidth = await firstCard.locator(".category-product-media").evaluate((el) =>
      el.getBoundingClientRect().width
    );
    expect(imageWidth).toBeCloseTo(mediaWidth, 0);

    const filtersPanelBox = await filtersPanel.boundingBox();
    const cardBox = await firstCard.boundingBox();
    expect(filtersPanelBox).not.toBeNull();
    expect(cardBox).not.toBeNull();
    expect(cardBox?.x ?? 0).toBeCloseTo(filtersPanelBox?.x ?? 0, 0);
    await expect(firstCard.locator(".category-product-rating .category-product-star")).toHaveCount(5);
    await expect(firstCard.locator(".category-product-stock")).not.toBeEmpty();

    const grid = page.locator("#category-products-grid");
    const columns = await grid.evaluate((el) => getComputedStyle(el).gridTemplateColumns);
    expect(columns.split(" ").length).toBeGreaterThanOrEqual(4);
  });

  test("clear filters button resets active filters", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto("/pages/category.html?slug=matelas");

    const brandSelect = page.locator('[data-filter-key="brand"]');
    if ((await brandSelect.count()) === 0) {
      test.skip();
      return;
    }

    const options = await brandSelect.locator("option").allTextContents();
    const firstBrand = options.find((label) => label && !/marque/i.test(label) && label !== "IKEA");
    if (!firstBrand) {
      await brandSelect.selectOption({ index: 1 });
    } else {
      await brandSelect.selectOption({ label: firstBrand });
    }
    await expect(page.locator(".category-active-filters")).toBeVisible();

    await page.locator("#category-clear-filters").click();
    await expect(brandSelect).toHaveValue("");
    await expect(page.locator(".category-active-filters")).toBeHidden();
  });
});
