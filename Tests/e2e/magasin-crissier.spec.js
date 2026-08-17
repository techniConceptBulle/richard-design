/**
 * Tests E2E — page magasin Crissier.
 * Vérifie la structure des blocs split et le slider de catégories.
 */
import { test, expect } from "@playwright/test";

test.describe("Magasin Crissier page", () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto("/pages/magasin-crissier.html");
  });

  test("renders hero without green store kicker", async ({ page }) => {
    await expect(
      page.getByRole("heading", { name: "Votre magasin de matelas à Crissier", level: 1 })
    ).toBeVisible();
    await expect(page.locator(".about-split__kicker")).toHaveCount(0);
    await expect(page.getByText("Votre magasin de literie à Crissier")).toHaveCount(0);
  });

  test("renders three split blocks with alternating image sides", async ({ page }) => {
    const splits = page.locator(".about-split");
    await expect(splits).toHaveCount(3);

    await expect(splits.nth(0)).toHaveClass(/about-split--image-left/);
    await expect(splits.nth(1)).toHaveClass(/about-split--image-right/);
    await expect(splits.nth(2)).toHaveClass(/about-split--image-left/);

    await expect(splits.nth(0).locator(".about-split__title")).toContainText(
      "Pourquoi essayer son matelas en magasin"
    );
    await expect(splits.nth(1).locator(".about-split__title")).toContainText(
      "Essayer son matelas, un indispensable"
    );
    await expect(splits.nth(2).locator(".about-split__title")).toContainText(
      "Une approche globale du sommeil"
    );
  });

  test("block 2 includes trial copy and pullquote", async ({ page }) => {
    const block = page.locator(".about-split--image-right");
    await expect(block.locator("#about-trial-title")).toBeVisible();
    await expect(block.getByText("Un véritable essai demande du temps")).toBeVisible();
    await expect(block.locator(".about-split__pullquote")).toContainText(
      "Je ne pensais pas qu'il pouvait y avoir une telle différence"
    );
    await expect(block.getByText("essayer le matelas chez vous")).toBeVisible();
  });

  test("block 3 includes holistic sleep approach copy", async ({ page }) => {
    const block = page.locator(".about-split").nth(2);
    await expect(block.locator("#about-holistic-title")).toBeVisible();
    await expect(block.getByText("le choix ne s'arrête pas au matelas")).toBeVisible();
    await expect(block.locator(".about-expertise__list li")).toHaveCount(8);
    await expect(block.getByText("Esprit hôtelier avec les lits boxspring")).toBeVisible();
    await expect(block.getByText("Oreillers ergonomiques")).toBeVisible();
    await expect(block).toHaveClass(/about-split--bg-white/);
    await expect(block.locator(".about-split__media img")).toHaveAttribute(
      "src",
      "/assets/images/hero-boxspring.jpg"
    );

    const background = await block.evaluate((el) => getComputedStyle(el).backgroundColor);
    expect(background).toBe("rgb(255, 255, 255)");
  });

  test("trial pullquote has no background nor border", async ({ page }) => {
    const quote = page.locator(".about-split--image-right .about-split__pullquote");
    const styles = await quote.evaluate((el) => {
      const cs = getComputedStyle(el);
      return {
        background: cs.backgroundColor,
        borderLeftWidth: cs.borderLeftWidth,
        padding: cs.padding
      };
    });

    expect(styles.background).toMatch(/^(transparent|rgba\(0,\s*0,\s*0,\s*0\))$/);
    expect(parseFloat(styles.borderLeftWidth)).toBe(0);
    expect(styles.padding).toBe("0px");
  });

  test("renders selected products as a slider", async ({ page }) => {
    const section = page.locator(".store-products-slider");
    await expect(section.locator("#about-store-products-title")).toHaveText(
      "Des produits séléctionnés avec soin"
    );
    const titleTransform = await section
      .locator("#about-store-products-title")
      .evaluate((el) => getComputedStyle(el).textTransform);
    expect(titleTransform).toBe("none");

    const slides = section.locator(".store-products-slider__slide");
    await expect(slides).toHaveCount(5);
    await expect(slides.nth(0)).toHaveAttribute("href", "/categorie/lit.html");
    await expect(slides.nth(1)).toHaveAttribute("href", "/categorie/matelas.html");
    await expect(slides.nth(2)).toHaveAttribute("href", "/categorie/sommier.html");
    await expect(slides.nth(3)).toHaveAttribute("href", "/categorie/duvets.html");
    await expect(slides.nth(4)).toHaveAttribute("href", "/categorie/oreillers.html");

    await expect(slides.nth(0).locator(".store-products-slider__label")).toHaveText("lits");
    await expect(slides.nth(1).locator(".store-products-slider__label")).toHaveText("matelas");
    await expect(slides.nth(2).locator(".store-products-slider__label")).toHaveText("sommier");
    await expect(slides.nth(3).locator(".store-products-slider__label")).toHaveText("duvet");
    await expect(slides.nth(4).locator(".store-products-slider__label")).toHaveText("oreiller");

    await expect(section.locator(".arrow.left")).toBeVisible();
    await expect(section.locator(".arrow.right")).toBeVisible();
  });

  test("renders green contact CTA band with button only", async ({ page }) => {
    const band = page.locator(".about-contact-cta");
    const greenBox = band.locator(".about-contact-cta__band");
    await expect(band).toBeVisible();
    await expect(band.locator(".about-contact-cta__shell")).toBeVisible();
    await expect(band.locator(".about-contact-cta__button")).toHaveText(/Contactez-nous/i);
    await expect(band.locator(".about-contact-cta__button")).toHaveAttribute(
      "href",
      "/pages/contact.html"
    );
    await expect(band.getByText("Besoin d'un conseil")).toHaveCount(0);

    const metrics = await band.evaluate((section) => {
      const shell = section.querySelector(".about-contact-cta__shell");
      const box = section.querySelector(".about-contact-cta__band");
      const footer = document.querySelector("footer");
      if (!shell || !box || !footer) return null;
      const shellCs = getComputedStyle(shell);
      const boxCs = getComputedStyle(box);
      return {
        boxBg: boxCs.backgroundImage,
        shellPaddingBottom: shellCs.paddingBottom,
        gapToFooter: footer.getBoundingClientRect().top - box.getBoundingClientRect().bottom,
        boxWidth: box.getBoundingClientRect().width,
        viewport: window.innerWidth
      };
    });

    expect(metrics?.boxBg).toContain("223, 233, 223");
    expect(parseFloat(metrics?.shellPaddingBottom || "0")).toBeGreaterThanOrEqual(40);
    expect(metrics?.gapToFooter).toBeGreaterThanOrEqual(40);
    expect(metrics?.boxWidth).toBeLessThan(metrics?.viewport || 0);
  });

  test("store products slider shows five slides on desktop", async ({ page }) => {
    const slideWidthRatio = await page.locator(".store-products-slider__slide").first().evaluate((el) => {
      const track = el.parentElement;
      if (!track) return 0;
      return el.getBoundingClientRect().width / track.getBoundingClientRect().width;
    });
    // ~20% of track (5 slides) with gaps — expect roughly one fifth
    expect(slideWidthRatio).toBeGreaterThan(0.15);
    expect(slideWidthRatio).toBeLessThan(0.25);
  });
});
