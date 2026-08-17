import { defineConfig } from 'vite'
import { existsSync, readdirSync, statSync } from 'node:fs'
import { cp } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { emitCategoryStaticPages } from './js/category-static-pages.js'

const rootDir = dirname(fileURLToPath(import.meta.url))

/** Dossiers statiques copiés dans dist après le build Vite. */
const STATIC_COPY_DIRS = ['data', 'assets']

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
      // Fichiers physiques /categorie/{slug}.html pour Render (pas de rewrite .html)
      emitCategoryStaticPages(outDir, resolve(rootDir, 'data/categories.json'))
    }
  }
}

/**
 * Réécrit /categorie/{slug}.html (et variante sans .html) vers pages/category.html.
 * Inclut /categorie et /categorie/ (slug manquant -> shell vide).
 * L'URL navigateur reste /categorie/... ; le HTML servi contient data-page="category".
 */
function categoryPrettyUrlPlugin() {
  /** @param {import('http').IncomingMessage} req */
  function rewriteCategoryPath(req, _res, next) {
    const rawUrl = req.url || ''
    const pathOnly = rawUrl.split('?')[0]
    const withSlug = pathOnly.match(/^\/categorie\/([^/]+?)(?:\.html)?\/?$/)
    const bareRoot = pathOnly === '/categorie' || pathOnly === '/categorie/'
    if (withSlug || bareRoot) {
      const queryIndex = rawUrl.indexOf('?')
      const query = queryIndex >= 0 ? rawUrl.slice(queryIndex) : ''
      req.url = `/pages/category.html${query}`
    }
    next()
  }

  return {
    name: 'category-pretty-urls',
    configureServer(server) {
      server.middlewares.use(rewriteCategoryPath)
    },
    configurePreviewServer(server) {
      server.middlewares.use(rewriteCategoryPath)
    }
  }
}

export default defineConfig({
  plugins: [copyStaticDirsPlugin(), categoryPrettyUrlPlugin()],
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
