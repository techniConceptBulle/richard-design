/**
 * Bloc « Besoin d'un conseil » partagé entre fiche produit et pages À propos.
 * Pictogrammes PNG brandés — panier non concerné.
 */

/**
 * Retourne le markup HTML du bloc conseil (3 cartes + CTA contact).
 * @returns {string}
 */
export function renderProductAdviceSectionHtml() {
  return `
    <section class="product-advice advice" aria-label="Besoin d'un conseil">
      <h3 class="product-advice__title">Besoin d'un conseil ?</h3>
      <p class="product-advice__lead">Nous serions ravis de vous conseiller personnellement</p>
      <div class="product-advice__grid contact-grid">
        <div class="product-advice__card contact">
          <span class="product-advice__icon" aria-hidden="true">
            <img src="/assets/icons/appel.png" alt="" width="40" height="40" loading="lazy" decoding="async">
          </span>
          <div class="product-advice__content">
            <strong class="product-advice__card-title">Appelez-nous</strong>
            <span class="product-advice__card-text"><a href="tel:+41216340476">021 634 04 76</a></span>
          </div>
        </div>
        <div class="product-advice__card contact">
          <span class="product-advice__icon" aria-hidden="true">
            <img src="/assets/icons/enveloppe.png" alt="" width="40" height="40" loading="lazy" decoding="async">
          </span>
          <div class="product-advice__content">
            <strong class="product-advice__card-title">Écrivez-nous</strong>
            <span class="product-advice__card-text"><a href="mailto:info@richard-decoration.ch">info@richard-decoration.ch</a></span>
          </div>
        </div>
        <div class="product-advice__card contact">
          <span class="product-advice__icon" aria-hidden="true">
            <img src="/assets/icons/magasin.png" alt="" width="40" height="40" loading="lazy" decoding="async">
          </span>
          <div class="product-advice__content">
            <strong class="product-advice__card-title">Venez-nous rencontrer</strong>
            <span class="product-advice__card-text">Richard La Literie<br>Rue des Alpes 2<br>1023 Crissier</span>
          </div>
        </div>
      </div>
      <a class="product-advice__cta about-btn" href="/pages/contact.html">Contactez-nous</a>
    </section>
  `;
}

/**
 * Injecte le bloc conseil dans un conteneur de page statique (pages À propos).
 * @param {HTMLElement} container
 */
export function mountProductAdviceSection(container) {
  if (!container) return;
  container.innerHTML = renderProductAdviceSectionHtml();
}
