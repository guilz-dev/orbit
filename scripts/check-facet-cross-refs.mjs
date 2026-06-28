#!/usr/bin/env node
/**
 * Validates bundled facet cross-references and en/ja heading parity.
 * Usage: node scripts/check-facet-cross-refs.mjs [--strict]
 */
import { readdir, readFile } from 'node:fs/promises'
import { basename, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(fileURLToPath(new URL('..', import.meta.url)), 'builtins')
const langs = ['en', 'ja']
const strict = process.argv.includes('--strict')
const kinds = ['knowledge', 'personas', 'policies', 'instructions', 'output-contracts']

function facetKeyFromFilename(filename) {
  return basename(filename, '.md')
}

function extractBacktickKeys(text) {
  const keys = new Set()
  for (const match of text.matchAll(/`([a-z0-9][a-z0-9-]*)`/g)) {
    keys.add(match[1])
  }
  return keys
}

function countH2Headings(text) {
  return (text.match(/^## /gm) ?? []).length
}

async function listFacetKeys(lang, kind) {
  const dir = join(root, lang, 'facets', kind)
  let entries
  try {
    entries = await readdir(dir)
  } catch {
    return new Set()
  }
  return new Set(entries.filter((name) => name.endsWith('.md')).map(facetKeyFromFilename))
}

async function buildKeyIndex() {
  const index = new Map()
  for (const lang of langs) {
    for (const kind of kinds) {
      const keys = await listFacetKeys(lang, kind)
      for (const key of keys) {
        index.set(`${lang}/${kind}/${key}`, true)
      }
    }
  }
  return index
}

function keyExists(index, lang, kind, key) {
  return index.has(`${lang}/${kind}/${key}`)
}

async function main() {
  const index = await buildKeyIndex()
  const errors = []
  const warnings = []

  for (const lang of langs) {
    const knowledgeDir = join(root, lang, 'facets', 'knowledge')
    const files = (await readdir(knowledgeDir)).filter((f) => f.endsWith('.md'))

    for (const file of files) {
      const key = facetKeyFromFilename(file)
      const content = await readFile(join(knowledgeDir, file), 'utf8')
      const intro = content.split('\n\n')[0] ?? ''
      const refs = extractBacktickKeys(intro)
      refs.delete(key)

      for (const ref of refs) {
        const inKnowledge = keyExists(index, lang, 'knowledge', ref)
        const inOtherKind =
          keyExists(index, lang, 'personas', ref) ||
          keyExists(index, lang, 'policies', ref) ||
          keyExists(index, lang, 'instructions', ref) ||
          keyExists(index, lang, 'output-contracts', ref)
        if (!inKnowledge && !inOtherKind) {
          errors.push(`${lang}/knowledge/${file}: intro references missing key \`${ref}\``)
        }
      }
    }
  }

  const enKnowledgeDir = join(root, 'en', 'facets', 'knowledge')
  const enFiles = (await readdir(enKnowledgeDir)).filter((f) => f.endsWith('.md'))

  for (const file of enFiles) {
    const enPath = join(enKnowledgeDir, file)
    const jaPath = join(root, 'ja', 'facets', 'knowledge', file)
    const enContent = await readFile(enPath, 'utf8')
    let jaContent
    try {
      jaContent = await readFile(jaPath, 'utf8')
    } catch {
      errors.push(`ja/knowledge/${file}: missing Japanese mirror`)
      continue
    }
    const enH2 = countH2Headings(enContent)
    const jaH2 = countH2Headings(jaContent)
    if (enH2 !== jaH2) {
      const msg = `knowledge/${file}: en has ${enH2} ## headings, ja has ${jaH2}`
      if (strict) errors.push(msg)
      else warnings.push(msg)
    }
  }

  for (const kind of kinds) {
    for (const lang of langs) {
      const dir = join(root, lang, 'facets', kind)
      let files
      try {
        files = (await readdir(dir)).filter((f) => f.endsWith('.md'))
      } catch {
        continue
      }
      const otherLang = lang === 'en' ? 'ja' : 'en'
      const otherDir = join(root, otherLang, 'facets', kind)
      let otherFiles
      try {
        otherFiles = new Set((await readdir(otherDir)).filter((f) => f.endsWith('.md')))
      } catch {
        otherFiles = new Set()
      }
      for (const file of files) {
        if (!otherFiles.has(file)) {
          errors.push(`${otherLang}/${kind}/${file}: missing mirror (present in ${lang})`)
        }
      }
    }
  }

  for (const warning of warnings) {
    console.warn(`[facet-cross-refs] warn: ${warning}`)
  }
  for (const error of errors) {
    console.error(`[facet-cross-refs] error: ${error}`)
  }

  if (errors.length > 0) {
    process.exit(1)
  }
  console.log('[facet-cross-refs] ok')
}

await main()
