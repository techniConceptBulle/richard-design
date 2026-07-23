/**
 * Tests E2E — page À propos (contenu client).
 */
import { test, expect } from "@playwright/test";

test.describe("About page", () => {
  test("renders hero and founder story sections", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto("/pages/about.html");

    await expect(page).toHaveTitle(/À propos.*Richard La Literie/i);
    await expect(page.locator(".about-hero__title")).toContainText(
      "expert de la literie à Crissier depuis 1933"
    );
    await expect(page.locator(".about-founder__name")).toContainText("Jean-Marc");
    await expect(page.locator(".about-story__title")).toContainText("Richard la Literie");
  });

  test("uses richard2026 typography not Poppins", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto("/pages/about.html");

    const fontFamily = await page.locator(".about-hero__title").evaluate((el) =>
      getComputedStyle(el).fontFamily.toLowerCase()
    );
    expect(fontFamily).not.toContain("poppins");
    expect(fontFamily).toMatch(/pryced|suisse|georgia|serif/);
  });

  test("hero has no border below page title", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto("/pages/about.html");

    const borderBottom = await page.locator(".about-hero").evaluate((el) =>
      getComputedStyle(el).borderBottomWidth
    );
    expect(borderBottom).toBe("0px");
  });

  test("story section has no background with four paragraphs", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto("/pages/about.html");

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

  test("why-try heading sits in right column after store kicker", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto("/pages/about.html");

    const content = page.locator(".about-split--image-left .about-split__content");
    await expect(content.locator(".about-split__kicker")).toContainText(
      "Votre magasin de literie à Crissier"
    );
    await expect(content.locator("#about-why-title")).toContainText("Pourquoi essayer son matelas");

    const order = await content.evaluate((el) => {
      const kicker = el.querySelector(".about-split__kicker");
      const title = el.querySelector("#about-why-title");
      const firstParagraph = el.querySelector("p:not(.about-split__kicker)");
      if (!kicker || !title || !firstParagraph) return null;
      return (
        (kicker.compareDocumentPosition(title) & Node.DOCUMENT_POSITION_FOLLOWING) !== 0 &&
        (title.compareDocumentPosition(firstParagraph) & Node.DOCUMENT_POSITION_FOLLOWING) !== 0
      );
    });
    expect(order).toBeTruthy();
  });

  test("why-try section uses high-resolution showroom image", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto("/pages/about.html");

    const src = await page
      .locator(".about-split--image-left .about-split__media img")
      .getAttribute("src");
    expect(src).toMatch(/hero-slide-bedroom/);
  });

  test("founder identity uses navigation menu color", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto("/pages/about.html");

    const founderColor = await page.locator(".about-founder__identity").evaluate((el) =>
      getComputedStyle(el).color
    );
    const navBg = await page.locator(".nav-primary").evaluate((el) =>
      getComputedStyle(el).backgroundColor
    );

    expect(founderColor).toBe(navBg);
  });

  test("premium services use boxed layout", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto("/pages/about.html");

    await expect(page.locator(".about-premium__boxed")).toBeVisible();
    const borderWidth = await page.locator(".about-premium__boxed").evaluate((el) =>
      getComputedStyle(el).borderTopWidth
    );
    expect(parseFloat(borderWidth)).toBeGreaterThan(0);
  });

  test("renders split sections and premium services grid", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto("/pages/about.html");

    await expect(page.locator(".about-expertise__list li")).toHaveCount(5);
    await expect(page.locator(".about-split--image-right .about-split__title")).toContainText(
      "Essayer son matelas, un indispensable"
    );

    const premiumCards = page.locator(".about-premium-card");
    await expect(premiumCards).toHaveCount(5);
    await expect(page.locator(".about-premium__title")).toHaveText("Nos services premium");
  });

  test("uses consistent heading spacing across page", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto("/pages/about.html");

    const h2Margin = await page.locator(".about-split--image-right .about-split__title").evaluate(
      (el) => getComputedStyle(el).marginBottom
    );
    const h3Margin = await page.locator(".about-expertise__title").evaluate((el) =>
      getComputedStyle(el).marginBottom
    );

    expect(parseFloat(h2Margin)).toBeGreaterThan(parseFloat(h3Margin));
    expect(parseFloat(h2Margin)).toBeCloseTo(32, 0);
    expect(parseFloat(h3Margin)).toBeCloseTo(16, 0);
  });

  test("does not render testimonials section", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto("/pages/about.html");

    await expect(page.locator(".about-reviews")).toHaveCount(0);
    await expect(page.locator('[data-mock="trustindex"]')).toHaveCount(0);
  });

  test("renders home univers literie section instead of discover block", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto("/pages/about.html");

    await expect(page.locator(".about-discover")).toHaveCount(0);
    await expect(page.locator(".about-univers .univers__header h2")).toHaveText(
      "Nos univers literie"
    );
    await expect(page.locator('.about-univers .ucard[href*="slug=matelas"]')).toBeVisible();
    await expect(page.locator(".about-univers .ucard")).toHaveCount(2);
  });

  test("univers decouvrir link matches homepage typography", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto("/");

    const homeLinkSize = await page
      .locator('.univers .ucard[href*="slug=matelas"] .ucard__link')
      .evaluate((el) => getComputedStyle(el).fontSize);

    await page.goto("/pages/about.html");

    const aboutLinkSize = await page
      .locator('.about-univers .ucard[href*="slug=matelas"] .ucard__link')
      .evaluate((el) => getComputedStyle(el).fontSize);

    expect(aboutLinkSize).toBe(homeLinkSize);
    expect(aboutLinkSize).toBe("11px");

    const aboutTextSize = await page
      .locator('.about-univers .ucard[href*="slug=matelas"] .ucard__text')
      .evaluate((el) => getComputedStyle(el).fontSize);
    expect(aboutTextSize).toBe("16px");
  });

  test("founder column is wider than story column on desktop", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto("/pages/about.html");

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

  test("univers literie section has extra bottom spacing on about page", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto("/pages/about.html");

    const paddingBottom = await page
      .locator(".about-univers .univers__inner.layout-wide")
      .evaluate((el) => parseFloat(getComputedStyle(el).paddingBottom));

    expect(paddingBottom).toBeGreaterThanOrEqual(72);
  });

  test("founder photo spans full card width", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto("/pages/about.html");

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
    await page.goto("/pages/about.html");

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
    await page.goto("/pages/about.html");

    const founderGrid = page.locator(".about-founder-story__grid");
    const columns = await founderGrid.evaluate((el) =>
      getComputedStyle(el).gridTemplateColumns
    );
    expect(columns).not.toContain(" ");
    expect(columns).not.toBe("none");
  });
});
