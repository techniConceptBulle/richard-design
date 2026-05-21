// Fonctions utilitaires génériques (formatage de prix, gestion des query params, etc.).

export function getCurrentPageKey() {
  const body = document.body;
  return body?.dataset.page || "home";
}

export function formatPriceCHF(value) {
  if (typeof value !== "number") return "";
  return new Intl.NumberFormat("fr-CH", {
    style: "currency",
    currency: "CHF"
  }).format(value);
}

export function parseQueryParams(search = window.location.search) {
  const params = new URLSearchParams(search);
  const result = {};
  params.forEach((value, key) => {
    result[key] = value;
  });
  return result;
}

export function getProductImagePlaceholder(productName, color = "#007E9E") {
  const nameLower = (productName || "").toLowerCase();
  let svg = "";
  
  // Matelas
  if (nameLower.includes("matelas")) {
    svg = `
      <svg width="800" height="600" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="matGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style="stop-color:#F8FBFA;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#C2CFB0;stop-opacity:1" />
          </linearGradient>
          <pattern id="matPattern" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
            <circle cx="10" cy="10" r="1" fill="#8CC8A7" opacity="0.3"/>
          </pattern>
        </defs>
        <rect width="800" height="600" fill="#F4F8F7"/>
        <rect x="150" y="150" width="500" height="300" rx="25" fill="url(#matGrad)"/>
        <rect x="150" y="150" width="500" height="300" rx="25" fill="url(#matPattern)"/>
        <rect x="170" y="170" width="460" height="260" rx="20" fill="#ffffff" opacity="0.6"/>
        <line x1="200" y1="300" x2="600" y2="300" stroke="#8CC8A7" stroke-width="2" opacity="0.45"/>
        <line x1="200" y1="320" x2="600" y2="320" stroke="#8CC8A7" stroke-width="2" opacity="0.45"/>
        <rect x="150" y="150" width="500" height="20" rx="25" fill="#8CC8A7" opacity="0.25"/>
        <rect x="150" y="430" width="500" height="20" rx="25" fill="#8CC8A7" opacity="0.25"/>
      </svg>
    `.trim();
  }
  // Cadre de lit
  else if (nameLower.includes("cadre") || nameLower.includes("lit") && !nameLower.includes("boxspring")) {
    svg = `
      <svg width="800" height="600" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="bedGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style="stop-color:#C2CFB0;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#8CC8A7;stop-opacity:1" />
          </linearGradient>
        </defs>
        <rect width="800" height="600" fill="#F4F8F7"/>
        <rect x="200" y="200" width="400" height="250" rx="5" fill="url(#bedGrad)"/>
        <rect x="220" y="220" width="360" height="230" rx="3" fill="#DCE7D3"/>
        <rect x="180" y="180" width="40" height="290" rx="3" fill="url(#bedGrad)"/>
        <rect x="580" y="180" width="40" height="290" rx="3" fill="url(#bedGrad)"/>
        <rect x="200" y="160" width="400" height="30" rx="5" fill="#005670" opacity="0.82"/>
        <line x1="200" y1="200" x2="600" y2="200" stroke="#005670" stroke-width="2"/>
        <line x1="200" y1="450" x2="600" y2="450" stroke="#005670" stroke-width="2"/>
      </svg>
    `.trim();
  }
  // Oreiller
  else if (nameLower.includes("oreiller")) {
    svg = `
      <svg width="800" height="600" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="pillGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style="stop-color:#F8F8F8;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#E8E8E8;stop-opacity:1" />
          </linearGradient>
        </defs>
        <rect width="800" height="600" fill="#F4F8F7"/>
        <ellipse cx="400" cy="300" rx="280" ry="180" fill="url(#pillGrad)"/>
        <ellipse cx="400" cy="280" rx="260" ry="160" fill="#ffffff" opacity="0.7"/>
        <path d="M 200 300 Q 250 250, 300 280 Q 350 310, 400 300 Q 450 290, 500 280 Q 550 270, 600 300" 
              stroke="#8CC8A7" stroke-width="3" fill="none" opacity="0.55"/>
        <path d="M 200 320 Q 250 270, 300 300 Q 350 330, 400 320 Q 450 310, 500 300 Q 550 290, 600 320" 
              stroke="#8CC8A7" stroke-width="3" fill="none" opacity="0.55"/>
        <circle cx="350" cy="280" r="15" fill="#C2CFB0" opacity="0.5"/>
        <circle cx="450" cy="300" r="12" fill="#C2CFB0" opacity="0.5"/>
      </svg>
    `.trim();
  }
  // Duvet
  else if (nameLower.includes("duvet")) {
    svg = `
      <svg width="800" height="600" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="duvGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style="stop-color:#F9FCFB;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#E3F0E8;stop-opacity:1" />
          </linearGradient>
        </defs>
        <rect width="800" height="600" fill="#F4F8F7"/>
        <rect x="150" y="200" width="500" height="200" rx="20" fill="url(#duvGrad)"/>
        <rect x="170" y="220" width="460" height="160" rx="15" fill="#ffffff" opacity="0.8"/>
        <path d="M 200 250 Q 250 240, 300 250 Q 350 260, 400 250 Q 450 240, 500 250 Q 550 260, 600 250" 
              stroke="#8CC8A7" stroke-width="2" fill="none" opacity="0.45"/>
        <path d="M 200 280 Q 250 270, 300 280 Q 350 290, 400 280 Q 450 270, 500 280 Q 550 290, 600 280" 
              stroke="#8CC8A7" stroke-width="2" fill="none" opacity="0.45"/>
        <path d="M 200 310 Q 250 300, 300 310 Q 350 320, 400 310 Q 450 300, 500 310 Q 550 320, 600 310" 
              stroke="#8CC8A7" stroke-width="2" fill="none" opacity="0.45"/>
        <rect x="150" y="200" width="500" height="15" rx="20" fill="#C2CFB0" opacity="0.5"/>
        <rect x="150" y="385" width="500" height="15" rx="20" fill="#C2CFB0" opacity="0.5"/>
      </svg>
    `.trim();
  }
  // Fauteuil relax
  else if (nameLower.includes("fauteuil") || nameLower.includes("relax")) {
    svg = `
      <svg width="800" height="600" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="chairGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style="stop-color:#007E9E;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#005670;stop-opacity:1" />
          </linearGradient>
        </defs>
        <rect width="800" height="600" fill="#F4F8F7"/>
        <path d="M 250 200 L 300 150 L 550 150 L 600 200 L 600 450 L 550 500 L 300 500 L 250 450 Z" 
              fill="url(#chairGrad)"/>
        <path d="M 270 220 L 310 180 L 540 180 L 580 220 L 580 430 L 540 470 L 310 470 L 270 430 Z" 
              fill="#005670"/>
        <rect x="280" y="190" width="240" height="20" rx="5" fill="#003F52" opacity="0.8"/>
        <ellipse cx="400" cy="320" rx="120" ry="80" fill="#003F52" opacity="0.3"/>
        <rect x="250" y="450" width="350" height="30" rx="5" fill="#003F52"/>
        <rect x="280" y="480" width="40" height="20" rx="3" fill="#003F52"/>
        <rect x="480" y="480" width="40" height="20" rx="3" fill="#003F52"/>
      </svg>
    `.trim();
  }
  // Boxspring
  else if (nameLower.includes("boxspring")) {
    svg = `
      <svg width="800" height="600" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="boxGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style="stop-color:#C2CFB0;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#8CC8A7;stop-opacity:1" />
          </linearGradient>
        </defs>
        <rect width="800" height="600" fill="#F4F8F7"/>
        <rect x="150" y="100" width="500" height="400" rx="15" fill="url(#boxGrad)"/>
        <rect x="170" y="120" width="460" height="360" rx="12" fill="#B6DBC0"/>
        <rect x="190" y="140" width="420" height="320" rx="10" fill="#9ECAB0" opacity="0.72"/>
        <rect x="150" y="100" width="500" height="40" rx="15" fill="#005670" opacity="0.82"/>
        <rect x="150" y="460" width="500" height="40" rx="15" fill="#005670" opacity="0.82"/>
        <line x1="200" y1="200" x2="600" y2="200" stroke="#005670" stroke-width="2" opacity="0.32"/>
        <line x1="200" y1="250" x2="600" y2="250" stroke="#005670" stroke-width="2" opacity="0.32"/>
        <line x1="200" y1="300" x2="600" y2="300" stroke="#005670" stroke-width="2" opacity="0.32"/>
        <line x1="200" y1="350" x2="600" y2="350" stroke="#005670" stroke-width="2" opacity="0.32"/>
        <line x1="200" y1="400" x2="600" y2="400" stroke="#005670" stroke-width="2" opacity="0.32"/>
      </svg>
    `.trim();
  }
  // Sommier
  else if (nameLower.includes("sommier")) {
    svg = `
      <svg width="800" height="600" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="somGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style="stop-color:#007E9E;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#005670;stop-opacity:1" />
          </linearGradient>
        </defs>
        <rect width="800" height="600" fill="#F4F8F7"/>
        <rect x="150" y="200" width="500" height="200" rx="10" fill="url(#somGrad)"/>
        <rect x="170" y="220" width="460" height="160" rx="8" fill="#006D88"/>
        <circle cx="250" cy="300" r="8" fill="#C2CFB0" opacity="0.72"/>
        <circle cx="350" cy="300" r="8" fill="#C2CFB0" opacity="0.72"/>
        <circle cx="450" cy="300" r="8" fill="#C2CFB0" opacity="0.72"/>
        <circle cx="550" cy="300" r="8" fill="#C2CFB0" opacity="0.72"/>
        <line x1="200" y1="250" x2="600" y2="250" stroke="#C2CFB0" stroke-width="1" opacity="0.5"/>
        <line x1="200" y1="350" x2="600" y2="350" stroke="#C2CFB0" stroke-width="1" opacity="0.5"/>
        <rect x="150" y="200" width="500" height="20" rx="10" fill="#C2CFB0" opacity="0.28"/>
        <rect x="150" y="380" width="500" height="20" rx="10" fill="#C2CFB0" opacity="0.28"/>
      </svg>
    `.trim();
  }
  // Par défaut
  else {
    svg = `
      <svg width="800" height="600" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="defGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style="stop-color:${color};stop-opacity:1" />
            <stop offset="100%" style="stop-color:#005670;stop-opacity:1" />
          </linearGradient>
        </defs>
        <rect width="800" height="600" fill="url(#defGrad)"/>
        <rect x="100" y="200" width="600" height="200" rx="20" fill="#ffffff" opacity="0.16"/>
        <text x="400" y="320" font-family="Arial, sans-serif" font-size="32" font-weight="bold" fill="#ffffff" text-anchor="middle">${productName}</text>
      </svg>
    `.trim();
  }
  
  return `data:image/svg+xml;base64,${btoa(svg)}`;
}

const PRODUCT_COLORS = {
  "matelas": "#007E9E",
  "cadre": "#C2CFB0",
  "oreiller": "#C2CFB0",
  "duvet": "#8CC8A7",
  "fauteuil": "#005670",
  "boxspring": "#8CC8A7",
  "default": "#007E9E"
};

const CATEGORY_COLORS = {
  "lit": "#C2CFB0",
  "cadre": "#C2CFB0",
  "boxspring": "#8CC8A7",
  "sommier": "#005670",
  "matelas": "#007E9E",
  "literie": "#8CC8A7",
  "duvets": "#C2CFB0",
  "oreillers": "#C2CFB0",
  "surmatelas": "#8CC8A7",
  "fauteuil": "#005670",
  "decoration": "#C2CFB0",
  "liquidation": "#005670",
  "default": "#007E9E"
};

export function getCategoryImageUrl(category) {
  // Utiliser l'image bed.jpg pour toutes les catégories
  return "/assets/images/categories/bed.jpg";
}

export function getBrandImageUrl(brand) {
  const brandName = brand?.name || "Marque";
  const svg = `
    <svg width="400" height="200" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="brandGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style="stop-color:#005670;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#007E9E;stop-opacity:1" />
        </linearGradient>
        <linearGradient id="brandShine" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#ffffff;stop-opacity:0.3" />
          <stop offset="100%" style="stop-color:#ffffff;stop-opacity:0" />
        </linearGradient>
      </defs>
      <rect width="400" height="200" rx="12" fill="url(#brandGrad)"/>
      <rect width="400" height="200" rx="12" fill="url(#brandShine)"/>
      <rect x="20" y="20" width="360" height="160" rx="8" fill="none" stroke="#ffffff" stroke-width="2" opacity="0.2"/>
      <text x="200" y="90" font-family="Arial, sans-serif" font-size="36" font-weight="bold" fill="#ffffff" text-anchor="middle" letter-spacing="0.1em">${brandName}</text>
      <line x1="100" y1="110" x2="300" y2="110" stroke="#ffffff" stroke-width="1" opacity="0.3"/>
      <text x="200" y="135" font-family="Arial, sans-serif" font-size="12" fill="#ffffff" text-anchor="middle" opacity="0.7" letter-spacing="0.2em">CONFORT SUISSE</text>
    </svg>
  `.trim();
  return `data:image/svg+xml;base64,${btoa(svg)}`;
}

export function getProductImageUrl(product, imagePath) {
  if (!imagePath || imagePath.includes("placeholder")) {
    const productName = product?.name || "Produit";
    let color = PRODUCT_COLORS.default;
    
    const nameLower = productName.toLowerCase();
    if (nameLower.includes("matelas")) color = PRODUCT_COLORS.matelas;
    else if (nameLower.includes("cadre")) color = PRODUCT_COLORS.cadre;
    else if (nameLower.includes("oreiller")) color = PRODUCT_COLORS.oreiller;
    else if (nameLower.includes("duvet")) color = PRODUCT_COLORS.duvet;
    else if (nameLower.includes("fauteuil")) color = PRODUCT_COLORS.fauteuil;
    else if (nameLower.includes("boxspring")) color = PRODUCT_COLORS.boxspring;
    
    return getProductImagePlaceholder(productName, color);
  }
  
  // Pour les vraies images, on retourne le chemin
  // Si l'image ne charge pas, le navigateur utilisera le placeholder via onerror
  return imagePath;
}


