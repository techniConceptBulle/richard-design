/**
 * Tests unitaires — page Nos conseils personnalisés sur mesure.
 */
import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const html = readFileSync(resolve(process.cwd(), "pages/produits-literie.html"), "utf8");
const css = readFileSync(resolve(process.cwd(), "styles/about-page.css"), "utf8");
const renderJs = readFileSync(resolve(process.cwd(), "js/render.js"), "utf8");

describe("personalized advice page", () => {
  it("uses the conseils sur mesure title and breadcrumb", () => {
    expect(html).toContain(
      "<title>Nos conseils personnalisés sur mesure | Richard La Literie</title>"
    );
    expect(html).toContain('data-page="about-advice"');
    expect(html).toMatch(
      /class="about-hero__title"[^>]*>\s*Nos conseils personnalisés sur mesure\s*</
    );
    expect(html).toContain("Nos conseils personnalisés sur mesure</span>");
  });

  it("includes all editorial text sections from the brief", () => {
    expect(html).toContain("Un accompagnement expert pour une literie parfaitement adaptée");
    expect(html).toContain("Conseils et prises de mesure à domicile");
    expect(html).toContain("Des recommandations au plus près de votre réalité");
    expect(html).toContain("Rendez-vous personnalisé en magasin");
    expect(html).toContain("Un accompagnement dédié, sans attente");
    expect(html).toContain("Diagnostic du sommeil et du confort");
    expect(html).toContain("Une approche experte, centrée sur vous");
    expect(html).toContain("Un accompagnement qui se prolonge après votre achat");
    expect(html).toContain("Un service après-vente à votre écoute");
    expect(html).toContain("Écoute, expertise et proximité");
  });

  it("highlights key phrases and lists expected items", () => {
    expect(html).toContain("<strong>Richard la Literie</strong>");
    expect(html).toContain("<strong>conseils personnalisés sur mesure</strong>");
    expect(html).toContain("<strong>prendre rendez-vous avec M.&nbsp;Richard</strong>");
    expect(html).toContain("<strong>diagnostic du sommeil et du confort</strong>");
    expect(html).toContain("si vous manquez de temps");
    expect(html).toContain("d’un accueil privilégié");
    expect(html).toContain("votre position de sommeil");
    expect(html).toContain("répondre à vos questions après installation");
  });

  it("keeps the contact CTA band and removes the old products univers", () => {
    expect(html).toContain('class="about-contact-cta"');
    expect(html).not.toContain("Nos univers literie");
    expect(html).not.toContain("Nos produits de literie");
  });

  it("registers advice section padding in about-page.css", () => {
    expect(css).toMatch(/\.about-advice__inner\.layout-wide/);
    expect(css).toMatch(/\.about-advice__title\s*\{/);
    expect(css).toMatch(/\.about-advice__list\s*\{/);
  });

  it("updates the À propos submenu label in render.js", () => {
    expect(renderJs).toContain('label: "Nos conseils personnalisés sur mesure"');
    expect(renderJs).not.toContain('label: "Nos produits de literie"');
  });
});
