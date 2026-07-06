/**
 * Tests unitaires — slider hero (navigation et synchronisation).
 */
import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { initHeroSlider } from "../../js/hero-slider.js";

describe("initHeroSlider", () => {
  let container;

  beforeEach(() => {
    document.body.innerHTML = `
      <div id="home-hero-slider" data-hero-autoplay="false">
        <div data-hero-copy-track>
          <div class="hero-slider__slide"></div>
          <div class="hero-slider__slide"></div>
        </div>
        <div data-hero-media-track>
          <div class="hero-slider__media-slide"></div>
          <div class="hero-slider__media-slide"></div>
        </div>
        <button class="hero-slider__bullet is-active" data-hero-index="0"></button>
        <button class="hero-slider__bullet" data-hero-index="1"></button>
      </div>
    `;
    container = document.getElementById("home-hero-slider");
  });

  afterEach(() => {
    document.body.innerHTML = "";
  });

  it("starts on the first slide", () => {
    initHeroSlider();
    const copyTrack = container.querySelector("[data-hero-copy-track]");
    expect(copyTrack.style.transform).toMatch(/translate3d\(-?0%, 0, 0\)/);
    expect(container.dataset.heroActiveIndex).toBe("0");
  });

  it("moves to the selected slide when a bullet is clicked", () => {
    const api = initHeroSlider();
    api.goToSlide(1);

    const copyTrack = container.querySelector("[data-hero-copy-track]");
    expect(copyTrack.style.transform).toBe("translate3d(-100%, 0, 0)");
    expect(container.dataset.heroActiveIndex).toBe("1");
  });

  it("wraps to the first slide after the last one", () => {
    const api = initHeroSlider();
    api.goToSlide(2);
    expect(container.dataset.heroActiveIndex).toBe("0");
  });
});
