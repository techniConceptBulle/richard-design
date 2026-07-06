/**
 * Tests E2E — page d'accueil Richard La Literie (alignée richard2026).
 */
import { test, expect } from "@playwright/test";

test.describe("Home page", () => {
  test("hero sits flush below fixed navigation without white gap", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto("/");

    const layout = await page.evaluate(() => {
      const envelope = document.querySelector("#site-header .site-envelope");
      const hero = document.querySelector(".hero-slider-block");
      if (!envelope || !hero) return null;

      const envelopeBottom = envelope.getBoundingClientRect().bottom;
      const heroTop = hero.getBoundingClientRect().top;
      const offsetVar = getComputedStyle(document.documentElement)
        .getPropertyValue("--envelope-offset")
        .trim();

      return {
        gap: heroTop - envelopeBottom,
        offsetVar,
        bodyPadding: parseFloat(getComputedStyle(document.body).paddingTop),
      };
    });

    expect(layout).not.toBeNull();
    expect(layout?.gap).toBeLessThan(2);
    expect(layout?.offsetVar).not.toBe("");
    expect(layout?.bodyPadding).toBeCloseTo(parseFloat(layout?.offsetVar ?? "0"), 0);
  });

  test("displays envelope, hero and catalogue navigation", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto("/");

    await expect(page).toHaveTitle(/Richard La Literie/i);
    await expect(page.locator(".topbar__message-text")).toContainText("Depuis 1933");
    await expect(page.locator(".topbar__message-text")).toHaveCSS("color", "rgb(255, 255, 255)");
    await expect(page.locator(".hero-slider__title").first()).toContainText("Le confort commence ici");

    const searchInput = page.getByPlaceholder("Rechercher un matelas, un sommier ou une marque…");
    await expect(searchInput.first()).toBeVisible();

    const mainNav = page.getByRole("navigation", { name: "Navigation catalogue" });
    await expect(mainNav).toBeVisible();
    await expect(mainNav.getByRole("link", { name: "Matelas", exact: true })).toBeVisible();
    await expect(mainNav.getByRole("link", { name: "A propos", exact: true })).toBeVisible();
    await expect(mainNav.getByRole("link", { name: "Offre spéciales %", exact: true })).toBeVisible();
    await expect(mainNav.locator(".menu-inner > li")).toHaveCount(8);

    const promoLink = mainNav.locator(".menu-item-promo .menu-link");
    await expect(promoLink).toHaveCSS("background-color", "rgb(40, 125, 99)");
    await expect(promoLink).toHaveCSS("color", "rgb(255, 255, 255)");

    const navPrimary = page.locator(".nav-primary");
    const promoHeight = await promoLink.evaluate((el) => el.getBoundingClientRect().height);
    const navHeight = await navPrimary.evaluate((el) => el.getBoundingClientRect().height);
    expect(promoHeight).toBeCloseTo(navHeight, 0);
  });

  test("renders univers literie section with category cards", async ({ page }) => {
    await page.goto("/");

    await expect(page.locator(".univers__header h2")).toContainText("Nos univers literie");

    const matelasCard = page.locator('.ucard[href*="slug=matelas"]');
    await expect(matelasCard).toBeVisible();
    await expect(matelasCard.locator(".ucard__title")).toHaveText("Matelas");
    await expect(matelasCard.locator('img[src*="cat-matelas"]')).toBeVisible();
    await expect(matelasCard.locator(".ucard__title")).toHaveCSS("font-weight", "800");
    await expect(matelasCard.locator(".ucard__link")).toContainText("Découvrir");

    const bodySpacing = await matelasCard.locator(".ucard__body").evaluate((el) => {
      const style = getComputedStyle(el);
      return {
        paddingTop: parseFloat(style.paddingTop),
        paddingBottom: parseFloat(style.paddingBottom),
        gap: parseFloat(style.gap),
      };
    });
    expect(bodySpacing.paddingTop).toBe(0);
    expect(bodySpacing.paddingBottom).toBe(0);
    expect(Number.isNaN(bodySpacing.gap) ? 0 : bodySpacing.gap).toBe(0);

    const titleMargin = await matelasCard.locator(".ucard__title").evaluate((el) => {
      const style = getComputedStyle(el);
      return {
        top: parseFloat(style.marginTop),
        bottom: parseFloat(style.marginBottom),
      };
    });
    expect(titleMargin.top).toBeCloseTo(16, 0);
    expect(titleMargin.bottom).toBeCloseTo(8, 0);
  });

  test("univers literie section matches richard2026 proportions", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto("/");

    const matelasCard = page.locator('.ucard[href*="slug=matelas"]');
    const sectionInner = page.locator(".univers__inner.layout-wide");

    const sectionPadding = await sectionInner.evaluate((el) => {
      const style = getComputedStyle(el);
      return {
        top: parseFloat(style.paddingTop),
        bottom: parseFloat(style.paddingBottom),
        left: parseFloat(style.paddingLeft),
      };
    });
    expect(sectionPadding.top).toBeCloseTo(80, 0);
    expect(sectionPadding.bottom).toBeCloseTo(80, 0);
    expect(sectionPadding.left).toBeCloseTo(38, 0);

    await expect(matelasCard.locator(".ucard__title")).toHaveCSS("font-size", "18px");
    await expect(matelasCard.locator(".ucard__text")).toHaveCSS("font-size", "16px");
    await expect(matelasCard.locator(".ucard__link")).toHaveCSS("font-size", "11px");

    const mediaHeight = await matelasCard.locator(".ucard__media").evaluate((el) => {
      const rect = el.getBoundingClientRect();
      const cardRect = el.closest(".ucard")?.getBoundingClientRect();
      if (!cardRect) return null;
      return rect.height / cardRect.width;
    });
    expect(mediaHeight).toBeCloseTo(0.75, 1);
  });

  test("uses 16px body text on desktop for history paragraphs and footer", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto("/");

    const desktopBodySize = "16px";

    await expect(page.locator(".history__text p").first()).toHaveCSS(
      "font-size",
      desktopBodySize
    );

    const footer = page.locator(".footer-global");
    await expect(footer.locator(".footer-global__contact-link").first()).toHaveCSS(
      "font-size",
      desktopBodySize
    );
    await expect(footer.locator(".footer-global__link").first()).toHaveCSS(
      "font-size",
      desktopBodySize
    );
    await expect(footer.locator(".footer-global__hours-line").first()).toHaveCSS(
      "font-size",
      desktopBodySize
    );
    await expect(footer.locator(".footer-global__title").first()).toHaveCSS("font-size", "16px");
    await expect(footer.locator(".footer-global__title").first()).toHaveCSS("font-weight", "700");
  });

  test("uses reference site service and history icons", async ({ page }) => {
    await page.goto("/");

    const serviceIcons = page.locator(".services .service .sico");
    await expect(serviceIcons).toHaveCount(4);
    await expect(serviceIcons.nth(0)).toHaveAttribute("src", /bed-double/);
    await expect(serviceIcons.nth(1)).toHaveAttribute("src", /post-office/);
    await expect(serviceIcons.nth(2)).toHaveAttribute("src", /customer-service-woman/);
    await expect(serviceIcons.nth(3)).toHaveAttribute("src", /customer-service-help/);

    const factIcons = page.locator(".history__fact-icon");
    await expect(factIcons).toHaveCount(4);
    await expect(factIcons.nth(0)).toHaveAttribute("src", /customer-service-help/);
    await expect(factIcons.nth(1)).toHaveAttribute("src", /post-office/);
    await expect(factIcons.nth(2)).toHaveAttribute("src", /bed-double/);
    await expect(factIcons.nth(3)).toHaveAttribute("src", /customer-service-woman/);
  });

  test("section h2 titles share history typography", async ({ page }) => {
    await page.goto("/");

    const historyH2 = page.locator(".history h2");
    const universH2 = page.locator(".univers__header h2");
    const brandsH2 = page.locator(".brands h2");

    await expect(brandsH2).toHaveText(/Les plus grandes marques de literie/i);

    const reference = await historyH2.evaluate((el) => {
      const style = getComputedStyle(el);
      return {
        fontSize: style.fontSize,
        fontWeight: style.fontWeight,
        color: style.color,
        lineHeight: style.lineHeight,
      };
    });

    for (const locator of [brandsH2]) {
      await expect(locator).toHaveCSS("font-size", reference.fontSize);
      await expect(locator).toHaveCSS("font-weight", reference.fontWeight);
      await expect(locator).toHaveCSS("color", reference.color);
      await expect(locator).toHaveCSS("line-height", reference.lineHeight);
    }

    await expect(universH2).toHaveCSS("font-size", "27px");
    await expect(universH2).toHaveCSS("font-weight", reference.fontWeight);
    await expect(universH2).toHaveCSS("color", reference.color);
  });

  test("brands section uses white background", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator(".brands")).toHaveCSS("background-color", "rgb(255, 255, 255)");
  });

  test("hero slider uses reference images and bullet navigation", async ({ page }) => {
    await page.goto("/");

    const slider = page.locator("#home-hero-slider");
    await expect(slider.locator('.hero-slider__image[src*="hero-slide-bedroom"]')).toBeVisible();
    await expect(slider).toHaveAttribute("data-hero-active-index", "0");

    const bedroomPosition = await slider
      .locator(".hero-slider__media-slide--bedroom .hero-slider__image")
      .evaluate((el) => getComputedStyle(el).objectPosition);
    expect(bedroomPosition).toBe("30% 60%");

    await slider.getByRole("tab", { name: "Slide 2" }).click();
    await expect(slider).toHaveAttribute("data-hero-active-index", "1");
    await expect(slider.locator('.hero-slider__image[src*="hero-slide-wall"]')).toBeVisible();
    await expect(slider.locator(".hero-slider__bullet").nth(1)).toHaveClass(/is-active/);

    const mattressPosition = await slider
      .locator(".hero-slider__media-slide--mattress .hero-slider__image")
      .evaluate((el) => getComputedStyle(el).objectPosition);
    expect(mattressPosition).toBe("30% 60%");

    await slider.getByRole("tab", { name: "Slide 1" }).click();
    await expect(slider).toHaveAttribute("data-hero-active-index", "0");
  });

  test("brand carousel shows Roviva slides and scrolls on navigation", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto("/");

    const brandRow = page.locator("#home-brand-row");
    const slides = brandRow.locator(".brand-row__slide");
    await expect(slides).toHaveCount(9);
    await expect(brandRow.locator(".brand-row__logo").first()).toHaveAttribute("src", /brand-roviva-ref/);

    const logoHeight = await brandRow.locator(".brand-row__logo").first().evaluate((el) => {
      const style = getComputedStyle(el);
      return parseFloat(style.maxHeight);
    });
    expect(logoHeight).toBeGreaterThanOrEqual(70);

    const scrollBefore = await brandRow.evaluate((el) => el.scrollLeft);
    await page.getByRole("button", { name: "Marques suivantes" }).click();
    await expect
      .poll(async () => brandRow.evaluate((el) => el.scrollLeft))
      .toBeGreaterThan(scrollBefore);

    await page.getByRole("button", { name: "Marques précédentes" }).click();
    await expect
      .poll(async () => brandRow.evaluate((el) => el.scrollLeft))
      .toBeLessThanOrEqual(scrollBefore + 2);
  });

  test("history and univers sections share the same horizontal alignment", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/");

    const historyInner = page.locator(".history__inner.layout-wide");
    const universInner = page.locator(".univers__inner.layout-wide");
    const historyBox = await historyInner.boundingBox();
    const universBox = await universInner.boundingBox();

    expect(historyBox?.x).toBeCloseTo(universBox?.x ?? 0, 0);
    expect(historyBox?.width).toBeCloseTo(universBox?.width ?? 0, 0);
  });

  test("uses full-width layout container", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/");

    const layoutWide = page.locator(".services__inner.layout-wide").first();
    const box = await layoutWide.boundingBox();
    expect(box?.width).toBeGreaterThan(1200);
  });

  test("content sections share uniform vertical padding", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/");

    const sectionInners = [
      page.locator(".history__inner.layout-wide"),
      page.locator(".univers__inner.layout-wide"),
      page.locator(".brands__inner.layout-wide"),
    ];

    const paddings = await Promise.all(
      sectionInners.map((locator) =>
        locator.evaluate((el) => {
          const style = getComputedStyle(el);
          return {
            top: parseFloat(style.paddingTop),
            bottom: parseFloat(style.paddingBottom),
          };
        })
      )
    );

    const reference = paddings[0];
    for (const pad of paddings) {
      expect(pad.top).toBeCloseTo(reference.top, 0);
      expect(pad.bottom).toBeCloseTo(reference.bottom, 0);
    }

    const servicesPaddingTop = await page.locator(".services__inner").evaluate((el) =>
      parseFloat(getComputedStyle(el).paddingTop)
    );
    expect(servicesPaddingTop).toBeLessThan(reference.top);
  });

  test("footer shows contact, grouped links and opening hours", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto("/");

    const footer = page.locator(".footer-global");
    await expect(footer).toBeVisible();
    await expect(footer.locator(".footer-global__contact-col")).toContainText("Richard La Literie");
    await expect(footer.locator(".footer-global__links-cluster")).toHaveCount(1);
    await expect(footer.locator(".footer-global__column")).toHaveCount(3);
    await expect(footer.locator(".footer-global__hours-col")).toContainText("Horaires");
    await expect(footer.locator(".footer-global__socials")).toHaveCount(0);
  });
});
