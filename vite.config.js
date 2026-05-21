import { defineConfig } from 'vite'
import { readdirSync, statSync } from 'node:fs'
import { cp } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const rootDir = dirname(fileURLToPath(import.meta.url))

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
      for (const dir of ['data', 'assets']) {
        await cp(resolve(rootDir, dir), resolve(outDir, dir), { recursive: true })
      }
    }
  }
}

export default defineConfig({
  plugins: [copyStaticDirsPlugin()],
  server: {
    port: 3000,
    open: true
  },
  build: {
    rollupOptions: {
      input: collectHtmlInputs(rootDir)
    }
  }
})
