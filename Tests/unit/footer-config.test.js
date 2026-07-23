/**
 * Tests unitaires — configuration du footer global.
 */
import { describe, expect, it } from "vitest";
import {
  FOOTER_CONTACT,
  FOOTER_HOURS,
  FOOTER_LINK_COLUMNS,
  renderFooterContactColumnHtml,
  renderFooterColumnsHtml,
  renderFooterHoursColumnHtml,
  renderFooterHtml,
  renderFooterLinksClusterHtml
} from "../../js/footer-config.js";

describe("footer-config", () => {
  it("defines contact details and opening hours", () => {
    expect(FOOTER_CONTACT.companyName).toBe("Richard La Literie");
    expect(FOOTER_CONTACT.phone.label).toContain("634 04 76");
    expect(FOOTER_CONTACT.email.label).toBe("info@richard-decoration.ch");
    expect(FOOTER_HOURS.title).toBe("Horaires");
    expect(FOOTER_HOURS.lines.length).toBeGreaterThan(0);
  });

  it("defines three link columns with product labels", () => {
    expect(FOOTER_LINK_COLUMNS).toHaveLength(3);
    expect(FOOTER_LINK_COLUMNS[0].links[0].label).toBe("À propos");
    expect(FOOTER_LINK_COLUMNS[1].links[0].label).toBe("Offres du moment");
  });

  it("renders contact column with company name and contact links", () => {
    const html = renderFooterContactColumnHtml();
    expect(html).toContain('class="footer-global__contact-col"');
    expect(html).toContain(FOOTER_CONTACT.companyName);
    expect(html).toContain("footer-global__title--brand");
    expect(html).toContain(FOOTER_CONTACT.phone.href);
    expect(html).toContain(FOOTER_CONTACT.email.label);
  });

  it("renders hours column without social icons", () => {
    const html = renderFooterHoursColumnHtml();
    expect(html).toContain('class="footer-global__hours-col"');
    expect(html).toContain(FOOTER_HOURS.title);
    expect(html).toContain(FOOTER_HOURS.lines[0]);
    expect(html).not.toContain("footer-global__social");
    expect(html).not.toContain("footer-global__socials");
  });

  it("groups link columns inside a cluster wrapper", () => {
    const html = renderFooterLinksClusterHtml();
    expect(html).toContain('class="footer-global__links-cluster"');
    expect(html).toContain(renderFooterColumnsHtml().trim().slice(0, 40));
  });

  it("renders complete footer with contact, links cluster, hours and copyright", () => {
    const html = renderFooterHtml();
    expect(html).toContain('class="footer-global__contact-col"');
    expect(html).toContain('class="footer-global__links-cluster"');
    expect(html).toContain('class="footer-global__hours-col"');
    expect(html).toContain('class="footer-global__copyright"');
    expect(html).toMatch(/© \d{4} Richard La Literie/);
    expect(html).not.toContain("footer-global__intro-text");
    expect(html).not.toContain("footer-global__tagline");
    expect(html).not.toContain("footer-global__logo");
    expect(html).not.toContain("footer-global__baseline");
    expect(html).not.toContain("footer-global__socials");
  });
});
