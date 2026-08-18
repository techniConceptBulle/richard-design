/**
 * Tests E2E — page À propos (contenu client).
 */
import { test, expect } from "@playwright/test";

test.describe("About page", () => {
  test("renders hero and founder story sections", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto("/pages/expert-literie-crissier.html");

    await expect(page).toHaveTitle(/expert de la literie à Crissier depuis 1933.*Richard La Literie/i);
    await expect(page.getByRole("navigation", { name: "Fil d'Ariane" })).toBeVisible();
    await expect(page.locator(".about-hero .breadcrumb__current")).toContainText(
      "expert de la literie à Crissier"
    );
    await expect(page.locator(".about-hero__title")).toContainText(
      "expert de la literie à Crissier depuis 1933"
    );
    await expect(page.locator(".about-founder__name")).toContainText("Jean-Marc");
    await expect(page.locator(".about-story__title")).toContainText("Richard La Literie");
    await expect(page.locator(".about-story__text")).toContainText("adresse emblématique");
    await expect(page.locator(".about-story__text")).toContainText(
      "simple clic sur Internet"
    );
  });

  test("centers founder quote and breaks before Nous ne vendons", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto("/pages/expert-literie-crissier.html");

    const quoteAlign = await page.locator(".about-founder__body").evaluate((el) =>
      getComputedStyle(el).textAlign
    );
    expect(quoteAlign).toBe("center");

    const paragraphs = page.locator(".about-founder__quote p");
    await expect(paragraphs).toHaveCount(2);
    await expect(paragraphs.nth(1)).toContainText("Nous ne vendons pas un produit standard");
  });

  test("styles founder role in breadcrumb green and centers photo subject", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto("/pages/expert-literie-crissier.html");

    const roleColor = await page.locator(".about-founder__role").evaluate((el) =>
      getComputedStyle(el).color
    );
    const crumbColor = await page.locator(".breadcrumb__current").evaluate((el) =>
      getComputedStyle(el).color
    );
    expect(roleColor).toBe(crumbColor);

    const crumbWeight = await page.locator(".breadcrumb__current").evaluate((el) =>
      getComputedStyle(el).fontWeight
    );
    expect(crumbWeight).toBe("400");

    const imgShift = await page.locator(".about-founder__media img").evaluate((el) => {
      const cs = getComputedStyle(el);
      return { width: cs.width, marginLeft: cs.marginLeft };
    });
    // Image élargie + décalée pour centrer le sujet
    expect(parseFloat(imgShift.marginLeft)).toBeLessThan(0);
    expect(parseFloat(imgShift.width)).toBeGreaterThan(
      await page.locator(".about-founder__media").evaluate((el) => el.getBoundingClientRect().width)
    );
  });

  test("widens founder photo column on desktop", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto("/pages/expert-literie-crissier.html");

    const width = await page.locator(".about-founder__card").evaluate((el) =>
      el.getBoundingClientRect().width
    );
    // Colonne élargie (ex-24rem ≈ 384px) — attendu ≥ 500px à 1280
    expect(width).toBeGreaterThanOrEqual(500);
  });

  test("renders store location block after founder story", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto("/pages/expert-literie-crissier.html");

    const store = page.locator(".about-store-location");
    await expect(store).toBeVisible();
    await expect(store.locator("#about-store-location-title")).toContainText(
      "Richard La Literie Crissier"
    );
    await expect(store.locator(".about-store-location__subtitle")).toContainText(
      "au cœur de Crissier"
    );
    await expect(store.locator(".about-store-location__details")).toContainText(
      "Rue des Alpes 2, 1023 Crissier"
    );
    await expect(store.getByRole("link", { name: "021 634 04 76" }).first()).toHaveAttribute(
      "href",
      "tel:+41216340476"
    );
    await expect(store.locator(".about-store-location__rating")).toContainText("4,8");
    await expect(store.locator(".about-store-location__cta")).toHaveAttribute(
      "href",
      "/pages/contact.html"
    );
    await expect(store.locator(".about-store-location__cta")).toHaveClass(/btn-green/);

    const ctaBg = await store.locator(".about-store-location__cta").evaluate((el) =>
      getComputedStyle(el).backgroundColor
    );
    // Vert site (.btn-green ≈ #27745d)
    expect(ctaBg).toBe("rgb(39, 116, 93)");

    const order = await page.evaluate(() => {
      const founder = document.querySelector(".about-founder-story");
      const storeBlock = document.querySelector(".about-store-location");
      const showroom = document.querySelector("#about-showroom-slider");
      if (!founder || !storeBlock || !showroom) return null;
      const position = founder.compareDocumentPosition(storeBlock);
      const afterFounder = (position & Node.DOCUMENT_POSITION_FOLLOWING) !== 0;
      const beforeShowroom =
        (storeBlock.compareDocumentPosition(showroom) & Node.DOCUMENT_POSITION_FOLLOWING) !== 0;
      return { afterFounder, beforeShowroom };
    });
    expect(order).toEqual({ afterFounder: true, beforeShowroom: true });

    await expect(store.locator("[data-store-map-canvas]")).toBeVisible();
  });

  test("renders showroom slider after store location", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto("/pages/expert-literie-crissier.html");

    const slider = page.locator("#about-showroom-slider");
    await expect(slider).toBeVisible();
    await expect(slider.locator(".about-showroom-slider__slide")).toHaveCount(3);
    await expect(slider.locator(".about-showroom-slider__bullet")).toHaveCount(3);
    await expect(slider.locator(".about-showroom-slider__inner")).toHaveClass(/layout-wide/);
    await expect(slider.locator(".about-showroom-slider__mark")).toHaveCount(0);

    const order = await page.evaluate(() => {
      const store = document.querySelector(".about-store-location");
      const showroom = document.querySelector("#about-showroom-slider");
      const brands = document.querySelector(".about-brands-spotlight");
      if (!store || !showroom || !brands) return null;
      return {
        afterStore:
          (store.compareDocumentPosition(showroom) & Node.DOCUMENT_POSITION_FOLLOWING) !== 0,
        beforeBrands:
          (showroom.compareDocumentPosition(brands) & Node.DOCUMENT_POSITION_FOLLOWING) !== 0
      };
    });
    expect(order).toEqual({ afterStore: true, beforeBrands: true });

    await slider.locator('.about-showroom-slider__bullet[data-showroom-index="1"]').click();
    await expect(
      slider.locator(".about-showroom-slider__bullet").nth(1)
    ).toHaveClass(/is-active/);
  });

  test("renders brands spotlight, carousel and contact CTA", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto("/pages/expert-literie-crissier.html");

    const spotlight = page.locator(".about-brands-spotlight");
    await expect(spotlight).toBeVisible();
    await expect(spotlight.locator("#about-brands-spotlight-title")).toContainText(
      /plus grandes marques/i
    );
    await expect(spotlight.locator(".about-brands-spotlight__badge")).toContainText(
      /marque Roviva/i
    );

    const brandRow = page.locator("#about-brand-row");
    await expect(brandRow.locator(".brand-row__slide")).toHaveCount(9);

    await expect(page.locator(".about-brands-slider__contact")).toHaveCount(0);
    await expect(page.locator("#about-brands-slider-title")).toHaveCount(0);

    const contactBand = page.locator(".about-contact-cta");
    await expect(contactBand.locator(".about-contact-cta__button")).toHaveText(/Contactez-nous/i);
    await expect(contactBand.locator(".about-contact-cta__button")).toHaveAttribute(
      "href",
      "/pages/contact.html"
    );

    const badgeLeft = await spotlight.locator(".about-brands-spotlight__badge").evaluate((el) =>
      getComputedStyle(el).left
    );
    expect(badgeLeft).toBe("0px");

    const paraSize = await spotlight.locator(".about-brands-spotlight__text p").first().evaluate(
      (el) => getComputedStyle(el).fontSize
    );
    expect(paraSize).toBe("16px");

    const bandBg = await contactBand.locator(".about-contact-cta__band").evaluate((el) =>
      getComputedStyle(el).backgroundImage
    );
    expect(bandBg).toContain("223, 233, 223");

    const logoSrc = await spotlight.locator(".about-brands-spotlight__brand-logo").getAttribute("src");
    expect(logoSrc).toContain("brand-roviva-ref.png");

    const order = await page.evaluate(() => {
      const showroom = document.querySelector("#about-showroom-slider");
      const brands = document.querySelector(".about-brands-spotlight");
      const slider = document.querySelector("#about-brand-row");
      const contact = document.querySelector(".about-contact-cta");
      if (!showroom || !brands || !slider || !contact) return null;
      return {
        afterShowroom:
          (showroom.compareDocumentPosition(brands) & Node.DOCUMENT_POSITION_FOLLOWING) !== 0,
        sliderAfterSpotlight:
          (brands.compareDocumentPosition(slider) & Node.DOCUMENT_POSITION_FOLLOWING) !== 0,
        contactAfterSlider:
          (slider.compareDocumentPosition(contact) & Node.DOCUMENT_POSITION_FOLLOWING) !== 0
      };
    });
    expect(order).toEqual({
      afterShowroom: true,
      sliderAfterSpotlight: true,
      contactAfterSlider: true
    });
  });

  test("uses richard2026 typography not Poppins", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto("/pages/expert-literie-crissier.html");

    const fontFamily = await page.locator(".about-hero__title").evaluate((el) =>
      getComputedStyle(el).fontFamily.toLowerCase()
    );
    expect(fontFamily).not.toContain("poppins");
    expect(fontFamily).toMatch(/pryced|suisse|georgia|serif/);
  });

  test("hero has no border below page title", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto("/pages/expert-literie-crissier.html");

    const borderBottom = await page.locator(".about-hero").evaluate((el) =>
      getComputedStyle(el).borderBottomWidth
    );
    expect(borderBottom).toBe("0px");
  });

  test("story section has no background with four paragraphs", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto("/pages/expert-literie-crissier.html");

    await expect(page.locator(".about-story--boxed")).toBeVisible();
    await expect(page.locator(".about-story__text p")).toHaveCount(4);

    const storyBackground = await page.locator(".about-story--boxed").evaluate((el) =>
      getComputedStyle(el).backgroundColor
    );
    expect(storyBackground).toBe("rgba(0, 0, 0, 0)");

    const paragraphMaxWidth = await page.locator(".about-story__text p").first().evaluate((el) =>
      getComputedStyle(el).maxWidth
    );
    expect(paragraphMaxWidth).toBe("none");
  });

  test("no longer renders why-try, trial, premium or univers blocks", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto("/pages/expert-literie-crissier.html");

    await expect(page.locator("#about-why-title")).toHaveCount(0);
    await expect(page.locator("#about-trial-title")).toHaveCount(0);
    await expect(page.locator(".about-premium")).toHaveCount(0);
    await expect(page.locator(".about-univers")).toHaveCount(0);
    await expect(page.getByText("Pourquoi essayer son matelas en magasin")).toHaveCount(0);
    await expect(page.getByText("Essayer son matelas, un indispensable")).toHaveCount(0);
  });

  test("founder identity uses navigation menu color", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto("/pages/expert-literie-crissier.html");

    const founderColor = await page.locator(".about-founder__identity").evaluate((el) =>
      getComputedStyle(el).color
    );
    const navBg = await page.locator(".nav-primary").evaluate((el) =>
      getComputedStyle(el).backgroundColor
    );

    expect(founderColor).toBe(navBg);
  });

  test("does not render testimonials section", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto("/pages/expert-literie-crissier.html");

    await expect(page.locator(".about-reviews")).toHaveCount(0);
    await expect(page.locator('[data-mock="trustindex"]')).toHaveCount(0);
  });

  test("services premium page hosts reviews and discovery block before contact CTA", async ({
    page
  }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto("/pages/services-premium.html");

    await expect(page.locator(".about-premium__boxed")).toBeVisible();
    await expect(page.locator(".about-premium-card")).toHaveCount(5);
    await expect(page.getByText("Accompagnement sur mesure")).toHaveCount(0);
    await expect(page.locator(".about-reviews")).toBeVisible();
    await expect(page.locator('[data-mock="trustindex"] .about-review-card')).toHaveCount(4);
    await expect(page.locator(".about-univers .univers__header h2")).toHaveText(
      "Richard La Literie c'est aussi :"
    );
    await expect(page.locator(".about-univers .ucard")).toHaveCount(3);

    const order = await page.evaluate(() => {
      const premium = document.querySelector(".about-premium");
      const reviews = document.querySelector(".about-reviews");
      const univers = document.querySelector(".about-univers");
      const contact = document.querySelector(".about-contact-cta");
      if (!premium || !reviews || !univers || !contact) return null;
      return (
        (premium.compareDocumentPosition(reviews) & Node.DOCUMENT_POSITION_FOLLOWING) !== 0 &&
        (reviews.compareDocumentPosition(univers) & Node.DOCUMENT_POSITION_FOLLOWING) !== 0 &&
        (univers.compareDocumentPosition(contact) & Node.DOCUMENT_POSITION_FOLLOWING) !== 0
      );
    });
    expect(order).toBeTruthy();
  });

  test("discovery decouvrir link matches homepage typography on services page", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto("/");

    const homeLinkSize = await page
      .locator('.univers .ucard[href="/categorie/matelas.html"] .ucard__link')
      .evaluate((el) => getComputedStyle(el).fontSize);

    await page.goto("/pages/services-premium.html");

    const aboutLinkSize = await page
      .locator('.about-univers .ucard[href*="produits-literie"] .ucard__link')
      .evaluate((el) => getComputedStyle(el).fontSize);

    expect(aboutLinkSize).toBe(homeLinkSize);
    expect(aboutLinkSize).toBe("12px");

    const aboutTextSize = await page
      .locator('.about-univers .ucard[href*="produits-literie"] .ucard__text')
      .evaluate((el) => getComputedStyle(el).fontSize);
    expect(aboutTextSize).toBe("16px");
  });

  test("founder column is wider than story column on desktop", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto("/pages/expert-literie-crissier.html");

    const columns = await page.locator(".about-founder-story__grid").evaluate((grid) => {
      const founder = grid.querySelector(".about-founder");
      const story = grid.querySelector(".about-story");
      if (!founder || !story) return null;
      return {
        founder: founder.getBoundingClientRect().width,
        story: story.getBoundingClientRect().width,
      };
    });

    expect(columns).not.toBeNull();
    expect(columns?.founder ?? 0).toBeGreaterThanOrEqual(380);
    expect(columns?.founder ?? 0).toBeLessThan(columns?.story ?? 0);
  });

  test("univers literie section has balanced vertical spacing on services page", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto("/pages/services-premium.html");

    const paddings = await page
      .locator(".about-univers .univers__inner.layout-wide")
      .evaluate((el) => {
        const cs = getComputedStyle(el);
        return {
          top: parseFloat(cs.paddingTop),
          bottom: parseFloat(cs.paddingBottom)
        };
      });

    expect(paddings.top).toBeGreaterThanOrEqual(72);
    expect(paddings.bottom).toBeGreaterThanOrEqual(72);
  });

  test("founder photo spans full card width", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto("/pages/expert-literie-crissier.html");

    const widths = await page.locator(".about-founder__card").evaluate((card) => {
      const media = card.querySelector(".about-founder__media");
      const img = card.querySelector(".about-founder__media img");
      if (!media || !img) return null;
      return {
        card: card.getBoundingClientRect().width,
        media: media.getBoundingClientRect().width,
        img: img.getBoundingClientRect().width,
      };
    });

    expect(widths).not.toBeNull();
    expect(Math.abs((widths?.media ?? 0) - (widths?.card ?? 0))).toBeLessThanOrEqual(2);
    expect(Math.abs((widths?.img ?? 0) - (widths?.card ?? 0))).toBeLessThanOrEqual(2);
  });

  test("section headings follow homepage hierarchy", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto("/pages/expert-literie-crissier.html");

    const heroTitle = await page.locator(".about-hero__title").evaluate((el) => {
      const style = getComputedStyle(el);
      return {
        fontWeight: style.fontWeight,
        textTransform: style.textTransform,
        color: style.color,
      };
    });
    expect(heroTitle.fontWeight).toBe("700");
    expect(heroTitle.textTransform).toBe("none");
    expect(heroTitle.color).toBe("rgb(8, 43, 78)");

    const sectionTitle = await page.locator(".about-story__title").evaluate((el) => {
      const style = getComputedStyle(el);
      return {
        fontSize: style.fontSize,
        fontWeight: style.fontWeight,
        textTransform: style.textTransform,
      };
    });
    expect(sectionTitle.fontWeight).toBe("700");
    expect(sectionTitle.textTransform).toBe("none");
    expect(parseFloat(sectionTitle.fontSize)).toBeCloseTo(28, 0);
  });

  test("stacks sections on mobile viewport", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto("/pages/expert-literie-crissier.html");

    const founderGrid = page.locator(".about-founder-story__grid");
    const columns = await founderGrid.evaluate((el) =>
      getComputedStyle(el).gridTemplateColumns
    );
    expect(columns).not.toContain(" ");
    expect(columns).not.toBe("none");
  });
});
