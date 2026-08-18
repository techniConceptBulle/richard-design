import { defineConfig } from 'vite'
import { existsSync, readdirSync, statSync } from 'node:fs'
import { cp } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import {
  emitBrandStaticPages,
  emitCategoryStaticPages,
  emitProductStaticPages
} from './js/category-static-pages.js'

const rootDir = dirname(fileURLToPath(import.meta.url))

/** Dossiers statiques copiés dans dist après le build Vite. */
const STATIC_COPY_DIRS = ['data', 'assets']

/** Pretty URLs servies par un shell HTML unique (dev + preview). */
const PRETTY_URL_RULES = [
  { prefix: 'categorie', html: '/pages/category.html' },
  { prefix: 'produit', html: '/pages/product.html' },
  { prefix: 'marque', html: '/pages/brand.html' }
]

/** Collecte index.html et pages/*.html pour le build multi-pages. */
function collectHtmlInputs(dir) {
  const inputs = {}

  function addHtml(filePath) {
    const rel = filePath.slice(dir.length + 1).replace(/\\/g, '/')
    inputs[rel.replace(/\.html$/, '')] = filePath
  }

  function walk(current) {
    for (const name of readdirSync(current)) {
      const full = resolve(current, name)
      if (statSync(full).isDirectory()) {
        walk(full)
      } else if (name.endsWith('.html')) {
        addHtml(full)
      }
    }
  }

  addHtml(resolve(dir, 'index.html'))
  walk(resolve(dir, 'pages'))
  return inputs
}

/** Copie data/ et assets/ dans dist (fetch JSON, images, icônes). */
function copyStaticDirsPlugin() {
  return {
    name: 'copy-static-dirs',
    async closeBundle() {
      const outDir = resolve(rootDir, 'dist')
      for (const dir of STATIC_COPY_DIRS) {
        const src = resolve(rootDir, dir)
        if (!existsSync(src)) {
          continue
        }
        await cp(src, resolve(outDir, dir), { recursive: true })
      }
      // Fichiers physiques pretty URLs pour Render (pas de rewrite .html)
      emitCategoryStaticPages(outDir, resolve(rootDir, 'data/categories.json'))
      emitProductStaticPages(outDir, resolve(rootDir, 'data/products.json'))
      emitBrandStaticPages(outDir, resolve(rootDir, 'data/brands.json'))
    }
  }
}

/**
 * Réécrit /categorie|produit|marque/{slug}.html vers le shell HTML correspondant.
 * L'URL navigateur reste pretty ; le HTML servi contient data-page.
 */
function prettyUrlPlugin() {
  /** @param {import('http').IncomingMessage} req */
  function rewritePrettyPath(req, _res, next) {
    const rawUrl = req.url || ''
    const pathOnly = rawUrl.split('?')[0]
    const queryIndex = rawUrl.indexOf('?')
    const query = queryIndex >= 0 ? rawUrl.slice(queryIndex) : ''

    for (const rule of PRETTY_URL_RULES) {
      const withSlug = pathOnly.match(
        new RegExp(`^/${rule.prefix}/([^/]+?)(?:\\.html)?/?$`)
      )
      const bareRoot = pathOnly === `/${rule.prefix}` || pathOnly === `/${rule.prefix}/`
      if (withSlug || bareRoot) {
        req.url = `${rule.html}${query}`
        break
      }
    }
    next()
  }

  return {
    name: 'pretty-urls',
    configureServer(server) {
      server.middlewares.use(rewritePrettyPath)
    },
    configurePreviewServer(server) {
      server.middlewares.use(rewritePrettyPath)
    }
  }
}

export default defineConfig({
  plugins: [copyStaticDirsPlugin(), prettyUrlPlugin()],
  server: {
    port: 3000,
    open: true
  },
  build: {
    // Conserver les chemins fichiers pour le déploiement staging (pas d'inlining base64)
    assetsInlineLimit: 0,
    rollupOptions: {
      input: collectHtmlInputs(rootDir)
    }
  }
})
