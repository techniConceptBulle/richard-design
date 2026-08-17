/**
 * Tests unitaires — slider catégories produits magasin Crissier.
 */
import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { initStoreProductsSlider } from "../../js/store-products-slider.js";

describe("initStoreProductsSlider", () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <div class="store-products-slider__wrap">
        <button type="button" class="arrow left"></button>
        <button type="button" class="arrow right"></button>
        <div id="store-products-slider" class="store-products-slider__track">
          <a class="store-products-slider__slide" href="/categorie/lit"></a>
          <a class="store-products-slider__slide" href="/categorie/matelas"></a>
        </div>
      </div>
    `;
  });

  afterEach(() => {
    document.body.innerHTML = "";
    vi.restoreAllMocks();
  });

  it("returns false when track is missing", () => {
    document.body.innerHTML = "";
    expect(initStoreProductsSlider()).toBe(false);
  });

  it("returns true and wires arrow click scrolling when markup is valid", () => {
    const track = document.getElementById("store-products-slider");
    const slide = track.querySelector(".store-products-slider__slide");
    Object.defineProperty(slide, "offsetWidth", { value: 100, configurable: true });
    Object.defineProperty(track, "scrollWidth", { value: 500, configurable: true });
    Object.defineProperty(track, "clientWidth", { value: 200, configurable: true });
    track.style.gap = "24px";
    track.scrollLeft = 0;

    const scrollBy = vi.fn();
    track.scrollBy = scrollBy;

    expect(initStoreProductsSlider()).toBe(true);

    document.querySelector(".arrow.right").click();
    expect(scrollBy).toHaveBeenCalledWith({ left: 124, behavior: "smooth" });

    track.scrollLeft = 100;
    track.dispatchEvent(new Event("scroll"));
    document.querySelector(".arrow.left").click();
    expect(scrollBy).toHaveBeenCalledWith({ left: -124, behavior: "smooth" });
  });

  it("disables prev arrow at the start", () => {
    const track = document.getElementById("store-products-slider");
    Object.defineProperty(track, "scrollWidth", { value: 500, configurable: true });
    Object.defineProperty(track, "clientWidth", { value: 200, configurable: true });
    track.scrollLeft = 0;

    initStoreProductsSlider();

    expect(document.querySelector(".arrow.left").disabled).toBe(true);
    expect(document.querySelector(".arrow.right").disabled).toBe(false);
  });
});
