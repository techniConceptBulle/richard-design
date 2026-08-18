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

    await expect(page.locator('a.brand-tile[href="/marque/roviva.html"]')).toBeVisible();
    await expect(page.locator('a.brand-tile[href="/marque/selecta.html"]')).toBeVisible();
    await expect(page.locator('a.brand-tile[href="/marque/rowa.html"]')).toBeVisible();
    await expect(page.locator('a.brand-tile[href="/marque/swissflex.html"]')).toBeVisible();

    await page.locator('a.brand-tile[href="/marque/roviva.html"]').click();
    await expect(page).toHaveURL(/\/marque\/roviva\.html/);
    await expect(page.locator("#brand-title")).toHaveClass(/brand-detail__title/);
    await expect(page.locator("#brand-title")).toHaveCSS("position", "absolute");
    await expect(page.locator(".brand-detail__logo")).toBeVisible();
    await expect(page.locator("h2.brand-detail__headline")).toContainText("1748");
    await expect(page.locator(".brand-detail__gallery-item")).toHaveCount(5);
    await expect(page.locator(".brand-detail__gallery-item--featured")).toHaveCount(1);
    await expect(page.locator(".selecta-section--sommier")).toHaveCount(0);
  });

  test("brand gallery opens a lightbox that can be navigated", async ({ page }) => {
    await page.goto("/marque/roviva.html");
    await page.locator('[data-brand-gallery-index="0"]').click();
    await expect(page.locator(".brand-lightbox")).toBeVisible();
    await expect(page.locator(".brand-lightbox__counter")).toHaveText("1 / 5");
    await page.locator('[data-brand-lightbox-direction="next"]').click();
    await expect(page.locator(".brand-lightbox__counter")).toHaveText("2 / 5");
  });

  test("brand logo links to the manufacturer website", async ({ page }) => {
    await page.goto("/marque/swissflex.html");

    const logoLink = page.locator(".brand-detail__logo-link");
    await expect(logoLink).toBeVisible();
    await expect(logoLink).toHaveAttribute("href", "https://www.swissflex.com/ch-fr/home");
    await expect(logoLink).toHaveAttribute("target", "_blank");
  });

  test("selecta uses the block layout and other brands keep the generic template", async ({
    page
  }) => {
    await page.goto("/marque/selecta.html");

    const shell = page.locator(".category-page-shell.layout-wide");
    await expect(shell.locator(".selecta-hero")).toBeVisible();
    await expect(page.locator(".selecta-hero__inner .selecta-hero__image")).toHaveAttribute(
      "src",
      "/assets/marques/selecta.png"
    );
    await expect(page.locator(".selecta-hero__badge")).toHaveCount(0);
    await expect(page.locator(".selecta-hero__inner .selecta-hero__image")).toHaveCSS(
      "object-fit",
      "contain"
    );
    const heroImageWidth = await page.locator(".selecta-hero__inner .selecta-hero__image").evaluate((el) => {
      return Math.round(el.getBoundingClientRect().width);
    });
    const heroInnerContentWidth = await page.locator(".selecta-hero__inner").evaluate((el) => {
      const styles = getComputedStyle(el);
      return Math.round(
        el.clientWidth - parseFloat(styles.paddingLeft) - parseFloat(styles.paddingRight)
      );
    });
    expect(heroImageWidth).toBe(heroInnerContentWidth);
    await expect(page.locator(".brand-detail--selecta .selecta-section__inner").first()).toHaveCSS(
      "max-width",
      "1440px"
    );
    await expect(page.locator(".selecta-hero__inner")).toHaveCSS("max-width", "1440px");
    await expect(page.locator(".selecta-hero")).toHaveCSS("background-color", "rgb(255, 255, 255)");
    await expect(page.locator(".selecta-hero")).toHaveCSS("padding-top", "0px");
    const heroPaddingBottom = await page.locator(".selecta-hero").evaluate((el) => getComputedStyle(el).paddingBottom);
    const nextSectionPaddingTop = await page.locator(".selecta-section").first().evaluate((el) => getComputedStyle(el).paddingTop);
    expect(heroPaddingBottom).toBe(nextSectionPaddingTop);
    await expect(page.locator(".selecta-feature").first()).toHaveCSS("text-align", "center");
    await expect(page.locator(".selecta-cta__button")).toHaveCSS("color", "rgb(255, 255, 255)");
    await expect(page.locator(".selecta-cta__button")).toHaveCSS("background-color", "rgb(39, 116, 93)");
    await expect(page.locator(".footer-global")).toHaveCSS(
      "border-top",
      "1px solid rgba(255, 255, 255, 0.2)"
    );
    const ctaBox = await page.locator(".selecta-cta").boundingBox();
    const footerBox = await page.locator("#site-footer").boundingBox();
    expect(ctaBox).toBeTruthy();
    expect(footerBox).toBeTruthy();
    expect(Math.abs(footerBox.y - (ctaBox.y + ctaBox.height))).toBeLessThanOrEqual(2);
    await expect(page.locator(".selecta-cta__title")).toHaveCSS("color", "rgb(255, 255, 255)");
    await expect(page.locator(".selecta-cta__text")).toHaveCSS("color", "rgb(255, 255, 255)");
    await expect(page.locator(".category-product-card")).toHaveCount(4);
    await expect(page.locator(".category-product-card .category-product-link").first()).toHaveAttribute(
      "href",
      /\/produit\/.+\.html/
    );
    await expect(page.getByRole("heading", { name: "La manufacture du sommeil" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Le sommier Röwa" })).toBeVisible();
    await expect(page.locator(".selecta-split__media--cutout img")).toHaveAttribute(
      "src",
      "/assets/marques/sommier-rowa-radio-m4memory.jpg"
    );
    await expect(page.locator(".selecta-section--sommier")).toHaveCSS("padding-top", "32px");
    await expect(page.locator(".selecta-section--sommier")).toHaveCSS("padding-bottom", "32px");
    await expect(page.locator(".selecta-section").first()).toHaveCSS("padding-top", "80px");
    await expect(page.locator(".selecta-section--sommier")).toHaveCSS(
      "box-shadow",
      /0px -4px 10px -6px.*0px 4px 10px -6px/
    );
    const sectionPads = await page.locator(".selecta-section").evaluateAll((els) =>
      els.map((el) => {
        const styles = getComputedStyle(el);
        return { top: styles.paddingTop, bottom: styles.paddingBottom };
      })
    );
    for (const pad of sectionPads) {
      expect(pad.top).toBe(pad.bottom);
    }
    const ctaPad = await page.locator(".selecta-cta__inner").evaluate((el) => {
      const styles = getComputedStyle(el);
      return { top: styles.paddingTop, bottom: styles.paddingBottom };
    });
    expect(ctaPad.top).toBe(ctaPad.bottom);
    expect(ctaPad.top).toBe(sectionPads[0].top);
    const productsPad = await page.locator(".selecta-section--products").evaluate((el) => {
      const styles = getComputedStyle(el);
      return { top: styles.paddingTop, bottom: styles.paddingBottom };
    });
    expect(productsPad.top).toBe(productsPad.bottom);
    expect(productsPad.top).toBe(sectionPads[0].top);
    await expect(page.locator(".selecta-section--image-right .selecta-split__media img")).toHaveAttribute(
      "src",
      "/assets/marques/matelas-rowa-3.jpg"
    );
    await expect(page.locator(".brand-detail__headline")).toHaveCount(0);
    await expect(page.locator(".brand-detail__gallery")).toHaveCount(0);

    const allButton = page.locator("button.selecta-products__all");
    await expect(allButton).toBeVisible();
    await expect(allButton).not.toHaveAttribute("href");
    await allButton.click();
    await expect(page).toHaveURL(/\/marque\/selecta\.html/);

    await page.locator(".selecta-cta__button").click();
    await expect(page).toHaveURL(/\/pages\/contact\.html/);

    await page.goto("/marque/rowa.html");
    await expect(page.locator("h2.brand-detail__headline")).toContainText("100 ans");
    await expect(page.locator(".selecta-hero")).toHaveCount(0);
    await expect(page.locator(".selecta-section--sommier")).toHaveCount(0);
    await expect(page.locator(".brand-detail__logo-link")).toHaveAttribute(
      "href",
      "https://roewa.com/de-CH/startseite"
    );
  });

  test("selecta splits stay readable on a mobile viewport", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 800 });
    await page.goto("/marque/selecta.html");
    await expect(page.getByRole("heading", { name: "La manufacture du sommeil" })).toBeVisible();
    await expect(page.locator(".selecta-split").first()).toBeVisible();
    const sectionPad = await page.locator(".selecta-section").first().evaluate((el) => {
      const styles = getComputedStyle(el);
      return { top: styles.paddingTop, bottom: styles.paddingBottom };
    });
    expect(sectionPad.top).toBe(sectionPad.bottom);
    const ctaPad = await page.locator(".selecta-cta__inner").evaluate((el) => {
      const styles = getComputedStyle(el);
      return { top: styles.paddingTop, bottom: styles.paddingBottom };
    });
    expect(ctaPad.top).toBe(ctaPad.bottom);
    expect(ctaPad.top).toBe(sectionPad.top);
  });
});
