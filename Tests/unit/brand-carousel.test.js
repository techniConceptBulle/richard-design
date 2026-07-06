/**
 * Tests unitaires — carousel marques page d'accueil.
 */
import { describe, expect, it } from "vitest";
import {
  getBrandCarouselScrollStep,
  syncBrandCarouselArrows
} from "../../js/brand-carousel.js";

describe("brand-carousel", () => {
  it("returns zero scroll step when container is missing", () => {
    expect(getBrandCarouselScrollStep(null)).toBe(0);
  });

  it("returns slide width plus gap as scroll step", () => {
    const container = document.createElement("div");
    container.style.display = "flex";
    container.style.gap = "24px";

    const slide = document.createElement("div");
    slide.className = "brand-row__slide";
    Object.defineProperty(slide, "offsetWidth", { value: 120, configurable: true });
    container.appendChild(slide);

    document.body.appendChild(container);
    expect(getBrandCarouselScrollStep(container)).toBe(144);
    container.remove();
  });

  it("disables prev arrow at start and next arrow at end", () => {
    const container = document.createElement("div");
    Object.defineProperty(container, "scrollWidth", { value: 500, configurable: true });
    Object.defineProperty(container, "clientWidth", { value: 200, configurable: true });

    const prev = document.createElement("button");
    const next = document.createElement("button");

    container.scrollLeft = 0;
    syncBrandCarouselArrows(container, prev, next);
    expect(prev.disabled).toBe(true);
    expect(next.disabled).toBe(false);

    container.scrollLeft = 300;
    syncBrandCarouselArrows(container, prev, next);
    expect(prev.disabled).toBe(false);
    expect(next.disabled).toBe(true);
  });
});
