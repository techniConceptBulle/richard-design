// Configuration et rendu du footer global — contact, liens et horaires.

/** Coordonnées affichées dans la première colonne du footer. */
export const FOOTER_CONTACT = {
  companyName: "Richard La Literie",
  addressLines: ["Rue des Alpes 2", "1023 Crissier"],
  phone: {
    href: "tel:+41216340476",
    label: "+41 21 634 04 76"
  },
  email: {
    href: "mailto:info@richard-decoration.ch",
    label: "info@richard-decoration.ch"
  }
};

/** Horaires d'ouverture du showroom (dernière colonne). */
export const FOOTER_HOURS = {
  title: "Horaires",
  lines: [
    "Lun. – Ven. : 9h00 – 18h30",
    "Sam. : 9h00 – 17h00",
    "Dim. : fermé"
  ]
};

/** Colonnes de liens du footer (regroupées au centre sur desktop). */
export const FOOTER_LINK_COLUMNS = [
  {
    title: "Navigation",
    links: [
      { href: "/pages/about.html", label: "À propos" },
      { href: "/pages/category.html?slug=matelas", label: "Matelas" },
      { href: "/pages/category.html?slug=sommier", label: "Sommiers" }
    ]
  },
  {
    title: "Literie",
    links: [
      { href: "/pages/category.html?slug=liquidation", label: "Offres du moment" },
      { href: "/pages/brands.html", label: "Marques" },
      { href: "/pages/advice.html", label: "Conseils" }
    ]
  },
  {
    title: "Légal",
    links: [
      { href: "/pages/privacy.html", label: "Politique de confidentialité" },
      { href: "/pages/terms.html", label: "Conditions générales" },
      { href: "/pages/contact.html", label: "Contact & showroom" }
    ]
  }
];

/**
 * Génère la colonne contact (nom, adresse, téléphone, e-mail).
 */
export function renderFooterContactColumnHtml() {
  const addressHtml = FOOTER_CONTACT.addressLines
    .map((line) => `<span class="footer-global__contact-line">${line}</span>`)
    .join("");

  return `
    <div class="footer-global__contact-col">
      <h3 class="footer-global__title footer-global__title--brand">${FOOTER_CONTACT.companyName}</h3>
      <div class="footer-global__contact-block">
        ${addressHtml}
      </div>
      <a class="footer-global__contact-link" href="${FOOTER_CONTACT.phone.href}">${FOOTER_CONTACT.phone.label}</a>
      <a class="footer-global__contact-link" href="${FOOTER_CONTACT.email.href}">${FOOTER_CONTACT.email.label}</a>
    </div>
  `;
}

/**
 * Génère la colonne horaires (dernière colonne desktop).
 */
export function renderFooterHoursColumnHtml() {
  const linesHtml = FOOTER_HOURS.lines
    .map((line) => `<span class="footer-global__hours-line">${line}</span>`)
    .join("");

  return `
    <div class="footer-global__hours-col">
      <h3 class="footer-global__title">${FOOTER_HOURS.title}</h3>
      <div class="footer-global__hours-block">
        ${linesHtml}
      </div>
    </div>
  `;
}

/**
 * Génère le HTML des colonnes de liens du footer.
 */
export function renderFooterColumnsHtml() {
  return FOOTER_LINK_COLUMNS.map(
    (column) => `
      <div class="footer-global__column">
        <h3 class="footer-global__title">${column.title}</h3>
        <ul class="footer-global__links">
          ${column.links
            .map(({ href, label }) => `<li><a class="footer-global__link" href="${href}">${label}</a></li>`)
            .join("")}
        </ul>
      </div>
    `
  ).join("");
}

/**
 * Regroupe les trois colonnes de liens pour un espacement resserré sur desktop.
 */
export function renderFooterLinksClusterHtml() {
  return `
    <div class="footer-global__links-cluster">
      ${renderFooterColumnsHtml()}
    </div>
  `;
}

/**
 * @deprecated Utiliser renderFooterHoursColumnHtml — conservé pour compatibilité tests internes.
 */
export function renderFooterTaglineColumnHtml() {
  return renderFooterHoursColumnHtml();
}

/**
 * @deprecated Utiliser renderFooterHoursColumnHtml — conservé pour compatibilité tests internes.
 */
export function renderFooterAsideHtml() {
  return renderFooterHoursColumnHtml();
}

/**
 * Génère le markup complet du footer global.
 */
export function renderFooterHtml() {
  const year = new Date().getFullYear();

  return `
    <footer class="footer-global" id="footer">
      <div class="footer-global__inner">
        <div class="footer-global__grid">
          ${renderFooterContactColumnHtml()}
          ${renderFooterLinksClusterHtml()}
          ${renderFooterHoursColumnHtml()}
        </div>
        <p class="footer-global__copyright">
          © ${year} Richard La Literie. Tous droits réservés.
        </p>
      </div>
    </footer>
  `;
}
