/**
 * Tests unitaires — slider showroom (sync slides / puces).
 */
import { describe, expect, it, beforeEach } from "vitest";
import { JSDOM } from "jsdom";
import { syncShowroomSliderState, initShowroomSlider } from "../../js/showroom-slider.js";

function buildSliderDom() {
  const dom = new JSDOM(`<!doctype html>
    <section id="about-showroom-slider" data-showroom-autoplay="false">
      <div data-showroom-track>
        <div class="about-showroom-slider__slide is-active" aria-hidden="false"></div>
        <div class="about-showroom-slider__slide" aria-hidden="true"></div>
        <div class="about-showroom-slider__slide" aria-hidden="true"></div>
      </div>
      <button class="about-showroom-slider__bullet is-active" data-showroom-index="0" aria-selected="true"></button>
      <button class="about-showroom-slider__bullet" data-showroom-index="1" aria-selected="false"></button>
      <button class="about-showroom-slider__bullet" data-showroom-index="2" aria-selected="false"></button>
    </section>
  `);
  globalThis.window = dom.window;
  globalThis.document = dom.window.document;
  globalThis.HTMLElement = dom.window.HTMLElement;
  return document.getElementById("about-showroom-slider");
}

describe("syncShowroomSliderState", () => {
  it("activates the requested slide and bullet", () => {
    const root = buildSliderDom();
    syncShowroomSliderState(root, 1, 3);

    const slides = root.querySelectorAll(".about-showroom-slider__slide");
    const bullets = root.querySelectorAll(".about-showroom-slider__bullet");
    const track = root.querySelector("[data-showroom-track]");

    expect(slides[1].classList.contains("is-active")).toBe(true);
    expect(slides[0].getAttribute("aria-hidden")).toBe("true");
    expect(slides[1].getAttribute("aria-hidden")).toBe("false");
    expect(bullets[1].classList.contains("is-active")).toBe(true);
    expect(bullets[1].getAttribute("aria-selected")).toBe("true");
    expect(track.style.transform).toBe("translate3d(-100%, 0, 0)");
    expect(root.dataset.showroomActiveIndex).toBe("1");
  });

  it("wraps safely when going to the last slide index", () => {
    const root = buildSliderDom();
    syncShowroomSliderState(root, 2, 3);
    expect(root.dataset.showroomActiveIndex).toBe("2");
    expect(root.querySelectorAll(".about-showroom-slider__bullet")[2].classList.contains("is-active")).toBe(
      true
    );
  });
});

describe("initShowroomSlider", () => {
  beforeEach(() => {
    buildSliderDom();
  });

  it("returns controls and goes to a slide on demand", () => {
    const api = initShowroomSlider();
    expect(api).not.toBeNull();
    api.goToSlide(2);
    const root = document.getElementById("about-showroom-slider");
    expect(root.dataset.showroomActiveIndex).toBe("2");
  });

  it("returns null when the root is missing", () => {
    document.getElementById("about-showroom-slider").remove();
    expect(initShowroomSlider()).toBeNull();
  });
});
