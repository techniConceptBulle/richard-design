/**
 * Tests unitaires — parsing des coordonnées carte magasin.
 */
import { describe, expect, it } from "vitest";
import { JSDOM } from "jsdom";
import { parseStoreMapCoords, STORE_MAP_DEFAULTS } from "../../js/store-map.js";

describe("parseStoreMapCoords", () => {
  it("returns lat/lng from data attributes when valid", () => {
    const dom = new JSDOM(`<section data-lat="46.5" data-lng="6.6"></section>`);
    const root = dom.window.document.querySelector("section");
    expect(parseStoreMapCoords(root)).toEqual({ lat: 46.5, lng: 6.6 });
  });

  it("falls back to Crissier defaults when attributes are missing or invalid", () => {
    const dom = new JSDOM(`<section data-lat="abc" data-lng=""></section>`);
    const root = dom.window.document.querySelector("section");
    expect(parseStoreMapCoords(root)).toEqual({
      lat: STORE_MAP_DEFAULTS.lat,
      lng: STORE_MAP_DEFAULTS.lng
    });
    expect(parseStoreMapCoords(null)).toEqual({
      lat: STORE_MAP_DEFAULTS.lat,
      lng: STORE_MAP_DEFAULTS.lng
    });
  });
});
