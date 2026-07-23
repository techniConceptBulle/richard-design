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

    // Offres spéciales : plus de fond vert (réservé à l'état actif)
    const promoLink = mainNav.locator(".menu-item-promo .menu-link");
    await expect(promoLink).toHaveCSS("background-color", "rgba(0, 0, 0, 0)");
  });

  test("keeps topbar text no larger than catalogue menu", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto("/");

    const topbar = page.locator(".topbar__inner");
    const metrics = await topbar.evaluate((el) => {
      const style = getComputedStyle(el);
      return {
        fontSize: parseFloat(style.fontSize),
        paddingTop: parseFloat(style.paddingTop),
        paddingBottom: parseFloat(style.paddingBottom),
      };
    });
    expect(metrics.fontSize).toBeCloseTo(12, 0);
    expect(metrics.paddingTop).toBeGreaterThanOrEqual(6);
    expect(metrics.paddingBottom).toBeGreaterThanOrEqual(6);

    const messageSize = await page.locator(".topbar__message-text").evaluate((el) =>
      parseFloat(getComputedStyle(el).fontSize)
    );
    const linkSize = await page.locator(".topbar__link").first().evaluate((el) =>
      parseFloat(getComputedStyle(el).fontSize)
    );
    const menuSize = await page
      .locator(".nav-primary .menu-inner > li:not(.menu-item-promo) > a.menu-link, .nav-primary .menu-item__parent")
      .first()
      .evaluate((el) => parseFloat(getComputedStyle(el).fontSize));

    expect(messageSize).toBeCloseTo(12, 0);
    expect(linkSize).toBeCloseTo(12, 0);
    expect(menuSize).toBeCloseTo(14, 0);
    expect(messageSize).toBeLessThanOrEqual(menuSize);
    expect(linkSize).toBeLessThanOrEqual(menuSize);
  });

  test("enlarges header cart icon", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto("/");

    const cartIconSize = await page.locator(".header-main__cart-icon svg").evaluate((el) =>
      parseFloat(getComputedStyle(el).width)
    );
    expect(cartIconSize).toBeCloseTo(24, 0);
  });

  test("enlarges header logo on desktop", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto("/");

    // Point 1 debrief — logo header plus grand qu'avant (48px → 64px)
    const logoHeight = await page.locator(".header-main__brand img").evaluate((el) =>
      parseFloat(getComputedStyle(el).height)
    );
    expect(logoHeight).toBeCloseTo(64, 0);
  });

  test("enlarges catalogue nav typography and blue bar height", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto("/");

    const navLink = page
      .locator(".nav-primary .menu-inner > li:not(.menu-item-promo) > a.menu-link, .nav-primary .menu-item__parent")
      .first();
    await expect(navLink).toHaveCSS("font-size", "14px");

    const navPaddingY = await page.locator(".nav-primary__inner").evaluate((el) => {
      const style = getComputedStyle(el);
      return parseFloat(style.paddingTop) + parseFloat(style.paddingBottom);
    });
    expect(navPaddingY).toBeGreaterThanOrEqual(16);

    const navHeight = await page.locator(".nav-primary").evaluate((el) =>
      el.getBoundingClientRect().height
    );
    expect(navHeight).toBeGreaterThan(40);
  });

  test("shows about submenu items and uses green background for active nav page", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto("/pages/about.html");

    const mainNav = page.getByRole("navigation", { name: "Navigation catalogue" });
    const aboutItem = mainNav.locator(".menu-item--has-children");
    await expect(aboutItem).toBeVisible();
    const aboutLink = aboutItem.getByRole("link", { name: "A propos", exact: true });
    await expect(aboutLink).toHaveClass(/menu-link--active/);
    await expect(aboutLink).toHaveCSS("background-color", "rgb(39, 116, 93)");
    await expect(aboutLink).toHaveCSS("color", "rgb(255, 255, 255)");

    // Desktop : sous-menu visible au survol
    await aboutItem.hover();
    const expertLink = aboutItem.getByRole("link", {
      name: "L'expert de la literie à Crissier",
      exact: true
    });
    await expect(expertLink).toBeVisible();
    await expect(
      aboutItem.getByRole("link", { name: "Votre magasin à Crissier", exact: true })
    ).toBeVisible();
    await expect(
      aboutItem.getByRole("link", { name: "Nos services premium", exact: true })
    ).toBeVisible();
    await expect(
      aboutItem.getByRole("link", { name: "Nos produits de literie", exact: true })
    ).toBeVisible();

    await aboutItem.getByRole("link", { name: "Nos services premium", exact: true }).click();
    await expect(page).toHaveURL(/#about-premium/);
    await expect(page.locator("#about-premium")).toBeVisible();
  });

  test("positions about submenu below the primary nav bar", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto("/");

    const aboutItem = page.locator(".nav-primary .menu-item--has-children");
    const navBar = page.locator(".nav-primary");
    await aboutItem.hover();

    const submenu = aboutItem.locator(".submenu");
    await expect(submenu).toBeVisible();

    const submenuFontSize = await submenu.locator(".menu-link").first().evaluate((el) =>
      parseFloat(getComputedStyle(el).fontSize)
    );
    expect(submenuFontSize).toBeCloseTo(16, 0);

    const overlap = await page.evaluate(() => {
      const nav = document.querySelector(".nav-primary");
      const sub = document.querySelector(".nav-primary .submenu");
      if (!nav || !sub) return null;
      const navBox = nav.getBoundingClientRect();
      const subBox = sub.getBoundingClientRect();
      return {
        submenuTop: subBox.top,
        navBottom: navBox.bottom,
        gap: subBox.top - navBox.bottom
      };
    });

    expect(overlap).not.toBeNull();
    expect(overlap.gap).toBeGreaterThanOrEqual(4);
  });

  test("reduces horizontal padding on history facts panel", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto("/");

    const paddingX = await page.locator(".history__facts").evaluate((el) => {
      const style = getComputedStyle(el);
      return {
        left: parseFloat(style.paddingLeft),
        right: parseFloat(style.paddingRight)
      };
    });
    expect(paddingX.left).toBeCloseTo(12, 0);
    expect(paddingX.right).toBeCloseTo(12, 0);
  });

  test("enlarges hero CTA below hero body text", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto("/");

    // Point 4 debrief — CTA plus grand, mais sous le paragraphe au-dessus
    const ctaSize = await page.locator(".hero-slider__cta").first().evaluate((el) =>
      parseFloat(getComputedStyle(el).fontSize)
    );
    const textSize = await page.locator(".hero-slider__text p").first().evaluate((el) =>
      parseFloat(getComputedStyle(el).fontSize)
    );

    expect(ctaSize).toBeCloseTo(14, 0);
    expect(ctaSize).toBeLessThan(textSize);
  });

  test("matches history eyebrow to univers eyebrow and enlarges fact labels", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto("/");

    // Points 6 + 8 — eyebrows alignés et agrandis (11px → 13px)
    const historySize = await page.locator(".history__eyebrow").evaluate((el) =>
      parseFloat(getComputedStyle(el).fontSize)
    );
    const universSize = await page.locator(".univers__eyebrow").evaluate((el) =>
      parseFloat(getComputedStyle(el).fontSize)
    );
    expect(historySize).toBeCloseTo(universSize, 0);
    expect(universSize).toBeCloseTo(13, 0);

    const factSize = await page.locator(".history__fact").first().evaluate((el) =>
      parseFloat(getComputedStyle(el).fontSize)
    );
    expect(factSize).toBeCloseTo(14, 0);
  });

  test("enlarges history outline CTA below history body text", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto("/");

    // Point 7 debrief — « En savoir plus » plus grand, sous le paragraphe
    const ctaSize = await page.locator(".history .btn-outline").evaluate((el) =>
      parseFloat(getComputedStyle(el).fontSize)
    );
    const bodySize = await page.locator(".history__text p").first().evaluate((el) =>
      parseFloat(getComputedStyle(el).fontSize)
    );

    expect(ctaSize).toBeCloseTo(14, 0);
    expect(ctaSize).toBeLessThan(bodySize);
  });

  test("renders univers literie section with two full-width category cards", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto("/");

    await expect(page.locator(".univers__header h2")).toContainText("Nos univers literie");

    const cards = page.locator(".univers__cards .ucard");
    await expect(cards).toHaveCount(2);

    const matelasCard = page.locator('.ucard[href*="slug=matelas"]');
    const sommiersCard = page.locator('.ucard[href*="slug=sommier"]');
    await expect(matelasCard).toBeVisible();
    await expect(sommiersCard).toBeVisible();
    await expect(matelasCard.locator(".ucard__title")).toHaveText("Matelas");
    await expect(sommiersCard.locator(".ucard__title")).toHaveText("Sommiers");
    await expect(matelasCard.locator('img[src*="cat-matelas.jpg"]')).toBeVisible();
    await expect(sommiersCard.locator('img[src*="cat-sommiers.jpg"]')).toBeVisible();

    // Images HD (plus grandes que les anciennes miniatures 300×200)
    const naturalSizes = await page.locator(".univers__cards .ucard img").evaluateAll((imgs) =>
      imgs.map((img) => ({ w: img.naturalWidth, h: img.naturalHeight }))
    );
    expect(naturalSizes[0].w).toBeGreaterThanOrEqual(1920);
    expect(naturalSizes[1].w).toBeGreaterThanOrEqual(1920);
    await expect(matelasCard.locator(".ucard__title")).toHaveCSS("font-weight", "800");
    await expect(matelasCard.locator(".ucard__link")).toContainText("Découvrir");
    await expect(matelasCard.locator(".ucard__text")).toContainText(
      "Soutien, accueil, technologies : trouvez le matelas qui vous correspond."
    );
    await expect(sommiersCard.locator(".ucard__text")).toHaveText(
      "La base d’un bon sommeil. Fixes, relevables ou électriques."
    );

    // Les 2 cartes se partagent toute la largeur de la grille
    const widths = await page.locator(".univers__cards").evaluate((grid) => {
      const style = getComputedStyle(grid);
      const cardsEls = [...grid.querySelectorAll(".ucard")];
      return {
        columns: style.gridTemplateColumns,
        cardWidths: cardsEls.map((el) => el.getBoundingClientRect().width),
        gridWidth: grid.getBoundingClientRect().width,
      };
    });
    expect(widths.cardWidths).toHaveLength(2);
    expect(widths.cardWidths[0]).toBeCloseTo(widths.cardWidths[1], 0);
    expect(widths.cardWidths[0] + widths.cardWidths[1]).toBeGreaterThan(widths.gridWidth * 0.9);

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

  test("uses maquette unicode service icons and enlarged labels", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto("/");

    // Section services — ordre + pictos capture maquette (☾ ▣ ♙ ♢)
    const services = page.locator(".services .service");
    await expect(services).toHaveCount(4);

    const serviceIcons = page.locator(".services .service .sico");
    await expect(serviceIcons.nth(0)).toHaveText("☾");
    await expect(serviceIcons.nth(1)).toHaveText("▣");
    await expect(serviceIcons.nth(2)).toHaveText("♙");
    await expect(serviceIcons.nth(3)).toHaveText("♢");

    await expect(services.nth(0)).toContainText(/Essai à domicile/i);
    await expect(services.nth(1)).toContainText(/Livraison, installation/i);
    await expect(services.nth(2)).toContainText(/Conseils personnalisés/i);
    await expect(services.nth(3)).toContainText(/Garantie/i);

    const labelSize = await services.nth(0).evaluate((el) => parseFloat(getComputedStyle(el).fontSize));
    expect(labelSize).toBeCloseTo(14, 0);

    const iconSize = await serviceIcons.nth(0).evaluate((el) => parseFloat(getComputedStyle(el).fontSize));
    expect(iconSize).toBeCloseTo(40, 0);
  });

  test("uses larger maquette unicode icons for history facts", async ({ page }) => {
    await page.goto("/");

    // Pictos homepage/index.html (☆ ♙ ⌂ ⌖), agrandis
    const factIcons = page.locator(".history__fact-icon");
    await expect(factIcons).toHaveCount(4);
    await expect(factIcons.nth(0)).toHaveText("☆");
    await expect(factIcons.nth(1)).toHaveText("♙");
    await expect(factIcons.nth(2)).toHaveText("⌂");
    await expect(factIcons.nth(3)).toHaveText("⌖");

    const iconSize = await factIcons.nth(0).evaluate((el) => parseFloat(getComputedStyle(el).fontSize));
    expect(iconSize).toBeCloseTo(32, 0);
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

  test("renders appointment and store section at end of home", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto("/");

    const section = page.locator(".appointment");
    await expect(section).toBeVisible();
    await expect(section.locator(".appt-kicker")).toHaveText(/Prenez rendez-vous/i);
    await expect(section.locator("h2")).toContainText("Un conseil personnalisé");
    await expect(section.locator(".btn-green")).toHaveAttribute("href", "/pages/contact.html");
    await expect(section.locator(".btn-green")).toHaveCSS("background-color", "rgb(39, 116, 93)");
    // Fond = section fiche produit « Besoin d'un conseil » (#dfe9df)
    await expect(section).toHaveCSS("background-color", "rgb(223, 233, 223)");
    await expect(section.locator("h2")).toHaveCSS("color", "rgb(8, 43, 78)");

    await expect(section.locator(".store-card h3")).toHaveText(/Notre magasin/i);
    await expect(section.locator(".store-card")).toContainText("Rue des Alpes 2");
    await expect(section.locator(".store-card a[href*='google.com/maps']")).toBeVisible();
    await expect(section.locator(".store-img")).toHaveAttribute("src", /storefront/);

    // 3 blocs égaux (~⅓) ; image collée haut/bas ; carte inset ; padding col. 1 & 3
    const layout = await page.evaluate(() => {
      const history = document.querySelector(".history__inner.layout-wide");
      const section = document.querySelector(".appointment");
      const appointment = document.querySelector(".appointment__inner.layout-wide");
      const grid = document.querySelector(".appointment__grid");
      const media = document.querySelector(".appointment .store-media");
      const img = document.querySelector(".appointment .store-img");
      const left = document.querySelector(".appointment .appt-left");
      const cardWrap = document.querySelector(".appointment .store-card-wrap");
      const card = document.querySelector(".store-card");
      if (!history || !section || !appointment || !grid || !media || !img || !left || !cardWrap || !card) {
        return null;
      }
      const h = history.getBoundingClientRect();
      const a = appointment.getBoundingClientRect();
      const s = section.getBoundingClientRect();
      const m = media.getBoundingClientRect();
      const i = img.getBoundingClientRect();
      const l = left.getBoundingClientRect();
      const c = card.getBoundingClientRect();
      const leftStyle = getComputedStyle(left);
      const wrapStyle = getComputedStyle(cardWrap);
      const cols = getComputedStyle(grid).gridTemplateColumns.split(" ").map((v) => parseFloat(v));
      return {
        leftDiff: Math.abs(h.left - a.left),
        widthDiff: Math.abs(h.width - a.width),
        mediaH: m.height,
        imgH: i.height,
        leftH: l.height,
        cardH: c.height,
        col1: cols[0],
        col2: cols[1],
        col3: cols[2],
        cardJustify: getComputedStyle(card).justifyContent,
        flushTop: Math.abs(m.top - s.top),
        flushBottom: Math.abs(s.bottom - m.bottom),
        leftPadY: parseFloat(leftStyle.paddingTop) + parseFloat(leftStyle.paddingBottom),
        wrapPadY: parseFloat(wrapStyle.paddingTop) + parseFloat(wrapStyle.paddingBottom),
        innerPadY:
          parseFloat(getComputedStyle(appointment).paddingTop) +
          parseFloat(getComputedStyle(appointment).paddingBottom)
      };
    });
    expect(layout).not.toBeNull();
    expect(layout.leftDiff).toBeLessThan(2);
    expect(layout.widthDiff).toBeLessThan(2);
    // Colonnes égales (tolérance 2px de sous-pixel)
    expect(Math.abs(layout.col1 - layout.col2)).toBeLessThan(2);
    expect(Math.abs(layout.col2 - layout.col3)).toBeLessThan(2);
    expect(layout.mediaH).toBeCloseTo(layout.leftH, 0);
    expect(layout.imgH).toBeCloseTo(layout.mediaH, 0);
    expect(layout.cardH).toBeLessThan(layout.mediaH);
    expect(layout.cardJustify).toBe("space-between");
    expect(layout.innerPadY).toBe(0);
    expect(layout.flushTop).toBeLessThan(2);
    expect(layout.flushBottom).toBeLessThan(2);
    // Padding top+bottom ≥ 3rem (48px) sur colonnes 1 et 3
    expect(layout.leftPadY).toBeGreaterThanOrEqual(96);
    expect(layout.wrapPadY).toBeGreaterThanOrEqual(96);

    // Section placée après les marques
    const order = await page.evaluate(() => {
      const brands = document.querySelector(".brands");
      const appointment = document.querySelector(".appointment");
      if (!brands || !appointment) return null;
      return brands.compareDocumentPosition(appointment) & Node.DOCUMENT_POSITION_FOLLOWING
        ? "after"
        : "before";
    });
    expect(order).toBe("after");
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
    await expect(footer.locator(".footer-global__copyright")).toContainText(/© \d{4} Richard La Literie/);
    await expect(footer.locator(".footer-global__socials")).toHaveCount(0);

    const footerPadding = await footer.locator(".footer-global__inner").evaluate((el) => {
      const style = getComputedStyle(el);
      return {
        top: parseFloat(style.paddingTop),
        bottom: parseFloat(style.paddingBottom)
      };
    });
    expect(footerPadding.top).toBeGreaterThanOrEqual(48);
    expect(footerPadding.bottom).toBeGreaterThanOrEqual(32);
  });
});
