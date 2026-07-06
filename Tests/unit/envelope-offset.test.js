/**
 * Tests unitaires — synchronisation padding enveloppe site.
 */
import { describe, expect, it, beforeEach, afterEach } from "vitest";
import { applyEnvelopeOffset, measureEnvelopeOffset } from "../../js/envelope-offset.js";

describe("envelope-offset", () => {
  beforeEach(() => {
    document.documentElement.style.removeProperty("--envelope-offset");
  });

  afterEach(() => {
    document.documentElement.style.removeProperty("--envelope-offset");
  });

  it("applies rounded envelope offset in pixels", () => {
    applyEnvelopeOffset(154.2);
    expect(
      document.documentElement.style.getPropertyValue("--envelope-offset")
    ).toBe("155px");
  });

  it("returns zero when envelope element is missing", () => {
    expect(measureEnvelopeOffset(null)).toBe(0);
  });

  it("measures envelope height and updates css variable", () => {
    const envelope = document.createElement("div");
    envelope.className = "site-envelope";
    Object.defineProperty(envelope, "getBoundingClientRect", {
      value: () => ({ height: 120.4 }),
    });

    document.body.appendChild(envelope);
    expect(measureEnvelopeOffset(envelope)).toBe(120.4);
    expect(
      document.documentElement.style.getPropertyValue("--envelope-offset")
    ).toBe("121px");
    envelope.remove();
  });
});
