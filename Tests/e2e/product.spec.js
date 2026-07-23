/**
 * Tests E2E — fiche produit alignée richard2026.
 */
import { test, expect } from "@playwright/test";

const PRODUCT_SLUG = "matelas-superba-elegance";
const PRODUCT_URL = `/pages/product.html?slug=${PRODUCT_SLUG}`;

test.describe("Product detail page", () => {
  test("renders breadcrumb, layout, title and CHF price", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto(PRODUCT_URL);

    await expect(page).toHaveTitle(/VESTMARKA.*Richard La Literie/i);

    const homeLink = page.locator(".product-page-breadcrumb a").first();
    const currentCrumb = page.locator(".product-page-breadcrumb .breadcrumb__current");
    await expect(homeLink).toHaveText("Accueil");
    await expect(homeLink).toHaveCSS("color", "rgb(8, 43, 78)");
    await expect(homeLink).toHaveCSS("font-weight", "400");
    await expect(currentCrumb).toHaveCSS("color", "rgb(40, 125, 99)");
    await expect(currentCrumb).toHaveCSS("font-weight", "700");
    await expect(page.locator(".product-page-breadcrumb")).toHaveCSS("font-size", "16px");

    await expect(page.locator(".single-product__layout")).toBeVisible();
    await expect(page.locator(".product_title")).toBeVisible();
    await expect(page.locator(".price-display__current")).toContainText("CHF");

    const titleFont = await page.locator(".product_title").evaluate((el) =>
      getComputedStyle(el).fontFamily.toLowerCase()
    );
    expect(titleFont).not.toContain("arial");
    expect(titleFont).not.toContain("poppins");
  });

  test("displays catalog price and discount in promo green", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto(PRODUCT_URL);

    await expect(page.locator(".price-display__catalog")).toContainText("Prix catalogue");
    await expect(page.locator(".price-display__catalog-value")).toBeVisible();
    await expect(page.locator(".price-display__discount")).toContainText("%");
    await expect(page.locator(".price-display__discount")).toHaveCSS(
      "color",
      "rgb(40, 125, 99)"
    );
    // Typo prix agrandie (debrief)
    await expect(page.locator(".price-display__current .price")).toHaveCSS("font-size", "27px");
    await expect(page.locator(".price-display__catalog")).toHaveCSS("font-size", "14px");
    await expect(page.locator(".price-display__discount")).toHaveCSS("font-size", "16px");
  });

  test("defaults to 90x200 size and orders options size then firmness then cover", async ({
    page
  }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto(PRODUCT_URL);

    const optionLabels = page.locator(".product-options .product-option-card__label");
    await expect(optionLabels.nth(0)).toHaveText("Taille");
    await expect(optionLabels.nth(1)).toHaveText("Dureté");
    await expect(optionLabels.nth(2)).toHaveText("Housse");

    const sizeSelect = page.locator('.product-option-card__select[data-option-key="size"]');
    await expect(sizeSelect).toHaveValue("90x200");
  });

  test("activates firmness chip and updates selection style", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto(PRODUCT_URL);

    const mediumChip = page.locator('.product-chip[data-option-key="firmness"][data-option-value="medium"]');
    await expect(mediumChip).toBeVisible();
    await mediumChip.click();
    await expect(mediumChip).toHaveClass(/is-active/);
    await expect(mediumChip).toHaveCSS("border-top-color", "rgb(8, 43, 78)");
    await expect(mediumChip).toHaveCSS("background-color", "rgba(0, 0, 0, 0)");
  });

  test("switches gallery image when thumbnail is clicked", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto(PRODUCT_URL);

    const thumbs = page.locator(".product-gallery__thumb");
    const thumbCount = await thumbs.count();
    test.skip(thumbCount < 2, "Product gallery needs at least two images");

    const mainImage = page.locator(".product-gallery__main img");
    const mainBox = await mainImage.boundingBox();
    expect(mainBox?.height).toBeGreaterThan(280);

    const initialSrc = await mainImage.getAttribute("src");

    await thumbs.nth(1).click();
    await expect(mainImage).not.toHaveAttribute("src", initialSrc || "");
    await expect(thumbs.nth(1)).toHaveClass(/is-active/);
    await expect(thumbs.nth(1)).toHaveCSS("border-top-color", "rgb(216, 216, 216)");
  });

  test("shows confirmation after add to cart", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto(PRODUCT_URL);

    await page.locator("#product-add-to-cart").click();
    await expect(page.locator(".product-cart-feedback")).toContainText("ajouté au panier");
  });

  test("does not render homepage services strip on product page", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto(PRODUCT_URL);

    await expect(page.locator(".product-page-services")).toHaveCount(0);
    await expect(page.locator(".product-accordion")).toBeVisible();
  });

  test("renders delivery delay after options", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto(PRODUCT_URL);

    const deliveryCard = page.locator(".product-option-card--delivery");
    await expect(deliveryCard.locator(".product-option-card__label")).toHaveText(
      "Délai de livraison :"
    );
    await expect(deliveryCard.locator(".product-option-card__delivery-value")).toHaveText(
      "3 à 4 semaines"
    );
    await expect(deliveryCard.locator(".product-option-card__delivery-value")).toHaveCSS(
      "font-weight",
      "400"
    );
    await expect(deliveryCard).toHaveCSS("flex-direction", "row");

    const optionsBox = await page.locator(".product-options").boundingBox();
    const deliveryBox = await deliveryCard.boundingBox();
    const cartBox = await page.locator(".product-cart-row").boundingBox();
    expect(optionsBox && deliveryBox && cartBox).toBeTruthy();
    if (optionsBox && deliveryBox) {
      expect(deliveryBox.y).toBeGreaterThan(optionsBox.y + optionsBox.height - 8);
    }
    if (deliveryBox && cartBox) {
      expect(cartBox.y - (deliveryBox.y + deliveryBox.height)).toBeGreaterThanOrEqual(16);
    }

    const inlineLayout = await deliveryCard.evaluate((el) => {
      const label = el.querySelector(".product-option-card__label");
      const value = el.querySelector(".product-option-card__delivery-value");
      if (!label || !value) return null;
      const l = label.getBoundingClientRect();
      const v = value.getBoundingClientRect();
      return { sameRow: Math.abs(l.top - v.top) < 8, valueAfter: v.left >= l.left };
    });
    expect(inlineLayout).not.toBeNull();
    expect(inlineLayout.sameRow).toBe(true);
    expect(inlineLayout.valueAfter).toBe(true);
  });

  test("does not render service options block on product page", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto(PRODUCT_URL);

    await expect(page.locator(".product-service-options")).toHaveCount(0);
    await expect(page.locator(".cart-service-options")).toHaveCount(0);
  });

  test("renames return policy accordion and removes delivery accordion field", async ({
    page
  }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto(PRODUCT_URL);

    await expect(
      page.locator("[data-accordion-trigger]", { hasText: "Politique de retour" })
    ).toBeVisible();
    await expect(
      page.locator("[data-accordion-trigger]", { hasText: "Garantie et Service" })
    ).toHaveCount(0);
    await expect(
      page.locator("[data-accordion-trigger]", { hasText: /^Livraison$/ })
    ).toHaveCount(0);
  });

  test("renders mattress images in product gallery", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto(PRODUCT_URL);

    const mainSrc = await page.locator(".product-gallery__main img").getAttribute("src");
    expect(mainSrc).toMatch(/\/assets\/images\/products\/roviva\//);

    const thumbSrcs = await page.locator(".product-gallery__thumb img").evaluateAll((images) =>
      images.map((img) => img.getAttribute("src") || "")
    );
    await expect(page.locator(".product-gallery__thumb")).toHaveCount(5);
    thumbSrcs.forEach((src) => {
      expect(src).toMatch(/\/assets\/images\/products\/roviva\//);
    });
  });

  test("renders housse values in product attributes accordion", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto(PRODUCT_URL);

    await page.locator('[data-accordion-trigger]').filter({ hasText: "Caractéristiques produit" }).click();
    const housseRow = page.locator(".product-spec-row").filter({ hasText: "Housse" });
    await expect(housseRow).toBeVisible();
    await expect(housseRow.locator(".product-spec-list li")).toHaveCount(2);
    await expect(housseRow).toContainText("Housse amovible et lavable");
    await expect(housseRow).toContainText("Thermorégulée");
    await expect(housseRow.locator(".product-spec-list li").first()).toHaveCSS("font-size", "16px");
  });

  test("uses 16px body text for accordion paragraphs and lists", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto(PRODUCT_URL);

    const descriptionP = page.locator(".product-accordion__description .product-accordion__content p").first();
    await expect(descriptionP).toHaveCSS("font-size", "16px");

    const checkItem = page.locator(".product-accordion__description .checks li").first();
    if ((await checkItem.count()) > 0) {
      await expect(checkItem).toHaveCSS("font-size", "16px");
    }

    await page.locator("[data-accordion-trigger]", { hasText: "Politique de retour" }).click();
    await expect(
      page.locator("[data-accordion-panel]:not([hidden]) .product-accordion__content p").first()
    ).toHaveCSS("font-size", "16px");

    await expect(page.locator(".product-advice__card-text").first()).toHaveCSS("font-size", "16px");
  });

  test("renders product reviews in three columns on large screens", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto(PRODUCT_URL);

    await page.locator('[data-accordion-trigger]').filter({ hasText: "Avis" }).click();
    const reviews = page.locator(".product-reviews .product-review-card");
    await expect(reviews).toHaveCount(6);

    const columnCount = await page.locator(".product-reviews").evaluate(
      (element) => getComputedStyle(element).gridTemplateColumns.split(" ").length
    );
    expect(columnCount).toBe(3);
  });

  test("applies accordion border-bottom only on last element", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto(PRODUCT_URL);

    const description = page.locator(".product-accordion__description");
    await expect(description).toHaveCSS("border-bottom-width", "0px");

    const triggers = page.locator(".product-accordion__trigger");
    const triggerCount = await triggers.count();
    expect(triggerCount).toBeGreaterThan(1);

    for (let index = 0; index < triggerCount - 1; index += 1) {
      await expect(triggers.nth(index)).toHaveCSS("border-bottom-width", "0px");
    }

    const lastTrigger = triggers.last();
    await expect(lastTrigger).not.toHaveCSS("border-bottom-width", "0px");

    await lastTrigger.click();
    await expect(lastTrigger).toHaveCSS("border-bottom-width", "0px");
    await expect(page.locator(".product-accordion__item:last-child .product-accordion__panel")).not.toHaveCSS(
      "border-bottom-width",
      "0px"
    );
  });

  test("renders larger brand logo at title right and name above title", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto(PRODUCT_URL);

    const logo = page.locator(".product-brand__logo");
    const brandName = page.locator(".product-brand__name");
    const title = page.locator(".product_title");
    await expect(logo).toBeVisible();
    await expect(logo).toHaveCSS("max-height", "52px");
    await expect(brandName).toBeVisible();

    const positions = await page.evaluate(() => {
      const name = document.querySelector(".product-brand__name");
      const h1 = document.querySelector(".product_title");
      const brandLogo = document.querySelector(".product-brand__logo");
      const header = document.querySelector(".product-summary__header");
      const price = document.querySelector(".price-display");
      const options = document.querySelector(".product-options");
      if (!name || !h1 || !brandLogo || !header || !price || !options) return null;
      const nameRect = name.getBoundingClientRect();
      const titleRect = h1.getBoundingClientRect();
      const logoRect = brandLogo.getBoundingClientRect();
      const priceRect = price.getBoundingClientRect();
      const optionsRect = options.getBoundingClientRect();
      return {
        nameAboveTitle: nameRect.bottom <= titleRect.top + 2,
        logoRightOfTitle: logoRect.left >= titleRect.right - 4,
        logoInHeader: header.contains(brandLogo),
        brandToTitleGap: titleRect.top - nameRect.bottom,
        titleToPriceGap: priceRect.top - titleRect.bottom,
        priceToOptionsGap: optionsRect.top - priceRect.bottom
      };
    });
    expect(positions).not.toBeNull();
    expect(positions.nameAboveTitle).toBe(true);
    expect(positions.logoRightOfTitle).toBe(true);
    expect(positions.logoInHeader).toBe(true);
    expect(positions.brandToTitleGap).toBeLessThan(12);
    expect(positions.titleToPriceGap).toBeGreaterThanOrEqual(12);
    expect(positions.priceToOptionsGap).toBeGreaterThanOrEqual(20);
  });

  test("renders advice cards with bold titles and normal details", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto(PRODUCT_URL);

    const cards = page.locator(".product-advice__card");
    await expect(cards).toHaveCount(3);

    const firstBox = await cards.nth(0).boundingBox();
    const secondBox = await cards.nth(1).boundingBox();
    const thirdBox = await cards.nth(2).boundingBox();
    expect(firstBox && secondBox && thirdBox).toBeTruthy();
    if (firstBox && secondBox && thirdBox) {
      expect(Math.abs(firstBox.y - secondBox.y)).toBeLessThan(8);
      expect(Math.abs(secondBox.y - thirdBox.y)).toBeLessThan(8);
      expect(secondBox.x).toBeGreaterThan(firstBox.x + firstBox.width * 0.5);
      expect(thirdBox.x).toBeGreaterThan(secondBox.x + secondBox.width * 0.5);
    }

    const contentWidth = await cards.nth(0).evaluate((card) => {
      const icon = card.querySelector(".product-advice__icon");
      const content = card.querySelector(".product-advice__content");
      if (!icon || !content) return 0;
      const cardWidth = card.getBoundingClientRect().width;
      const usedWidth =
        content.getBoundingClientRect().right - icon.getBoundingClientRect().left;
      return usedWidth / cardWidth;
    });
    expect(contentWidth).toBeGreaterThan(0.72);

    await expect(page.locator(".product-advice__lead")).toHaveCSS("text-align", "center");
    await expect(page.locator(".product-advice__lead")).toHaveCSS("font-size", "16px");
    await expect(page.locator("h3.product-advice__title")).toHaveText("Besoin d'un conseil ?");
    await expect(page.locator("h3.product-advice__title")).toHaveCSS("font-weight", "800");
    // Pictos maquette product/index.html + textes alignés home (magasin / tel)
    await expect(page.locator(".product-advice__icon").nth(0)).toHaveText("☎");
    await expect(page.locator(".product-advice__icon").nth(1)).toHaveText("✉");
    await expect(page.locator(".product-advice__icon").nth(2)).toHaveText("⌂");
    const iconMetrics = await page.locator(".product-advice__icon").evaluateAll((icons) =>
      icons.map((icon) => {
        const style = getComputedStyle(icon);
        return {
          fontSize: style.fontSize,
          width: style.width,
          height: style.height
        };
      })
    );
    expect(iconMetrics).toHaveLength(3);
    expect(iconMetrics[0].fontSize).toBe("40px");
    expect(iconMetrics.every((m) => m.fontSize === iconMetrics[0].fontSize)).toBe(true);
    expect(iconMetrics.every((m) => m.width === iconMetrics[0].width)).toBe(true);
    expect(iconMetrics.every((m) => m.height === iconMetrics[0].height)).toBe(true);
    await expect(page.locator(".product-advice__card-title").nth(0)).toHaveText("Appelez-nous");
    await expect(page.locator(".product-advice__card-text").nth(0)).toContainText("021 634 04 76");
    await expect(page.locator(".product-advice__card-title").nth(1)).toHaveText("Écrivez-nous");
    await expect(page.locator(".product-advice__card-text").nth(1)).toContainText(
      "info@richard-decoration.ch"
    );
    await expect(page.locator(".product-advice__card-title").nth(2)).toHaveText(
      "Venez-nous rencontrer"
    );
    await expect(page.locator(".product-advice__card-text").nth(2)).toContainText(
      "Richard La Literie"
    );
    await expect(page.locator(".product-advice__card-text").nth(2)).toContainText(
      "Rue des Alpes 2"
    );
    await expect(page.locator(".product-advice__cta")).toHaveText("Contactez-nous");
    await expect(page.locator(".product-advice__cta")).toHaveAttribute("href", "/pages/contact.html");
    await expect(page.locator(".product-advice__card").first()).toHaveCSS("column-gap", "18px");
    await expect(page.locator(".product-advice__card").first()).toHaveCSS("padding-left", "40px");
    await expect(page.locator(".product-advice__card-title").first()).toHaveCSS("font-weight", "700");
    await expect(page.locator(".product-advice__card-text").first()).toHaveCSS("font-weight", "400");
  });

  test("renders similar products as category archive cards", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto(PRODUCT_URL);

    const section = page.locator(".product-related-section.category-archive-page").first();
    await expect(section).toBeVisible();
    await expect(section.locator(".product-related-header h2")).toHaveText("Produits similaires");
    const card = section.locator(".category-products-grid .category-product-card").first();
    await expect(card).toBeVisible();
    await expect(card.locator(".category-product-price-current")).toContainText("CHF");
    await expect(card.locator(".category-product-loop-title")).toBeVisible();
  });

  test("does not render duplicate static housse field", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto(PRODUCT_URL);

    const housseLabels = page.locator(".product-option-card__label", { hasText: "Housse" });
    await expect(housseLabels).toHaveCount(1);
    const coverChips = page.locator('.product-chip[data-option-key="cover"]');
    await expect(coverChips).toHaveCount(2);
    await expect(coverChips.filter({ hasText: "Housse amovible et lavable" })).toHaveCount(1);
    await expect(coverChips.filter({ hasText: "Thermorégulée" })).toHaveCount(1);
  });
});

test.describe("Product page — error state", () => {
  test("shows not found message for unknown slug", async ({ page }) => {
    await page.goto("/pages/product.html?slug=inexistant-produit-xyz");
    await expect(page.locator("h1")).toHaveText("Produit introuvable");
  });
});
