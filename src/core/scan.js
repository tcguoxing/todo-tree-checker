const fs = require('fs-extra')
const path = require('path')
const { walkSync } = require('./walk')
const { resolveConfig } = require('./config')

/**
 * Build a line-comment matcher for a target keyword (e.g. todo, fixme).
 * Matches line comments like slash-slash + keyword (optional space / colon).
 * @param {string} target
 * @returns {RegExp}
 */
function buildTargetRegex(target) {
  const escaped = String(target).replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  return new RegExp(`\\/\\/[ ]*(${escaped})(?:\\s|$|:)`, 'i')
}

/**
 * Scan files under configured paths for target comments.
 * Pure: returns structured results, does not process.exit.
 *
 * @param {object} [options] - overrides merged via resolveConfig
 * @param {{ onFile?: (filePath: string) => void }} [hooks]
 * @returns {{ matches: Array, stats: object, config: object }}
 */
function scan(options = {}, hooks = {}) {
  const config = resolveConfig(options, options.cwd || process.cwd())
  const matches = []
  let filesScanned = 0
  const startedAt = Date.now()

  const targetRegexes = config.targets.map((target) => ({
    target,
    regex: buildTargetRegex(target),
  }))

  for (const searchPath of config.paths) {
    const absolutePath = path.isAbsolute(searchPath)
      ? searchPath
      : path.resolve(config.cwd, searchPath)

    if (!fs.existsSync(absolutePath)) {
      continue
    }

    const stat = fs.statSync(absolutePath)
    if (stat.isFile()) {
      filesScanned += 1
      if (hooks.onFile) hooks.onFile(absolutePath)
      scanFile(absolutePath, targetRegexes, matches, config.cwd)
      continue
    }

    walkSync(
      absolutePath,
      (filePath) => {
        filesScanned += 1
        scanFile(filePath, targetRegexes, matches, config.cwd)
      },
      {
        exclude: config.exclude,
        onFile: hooks.onFile,
      }
    )
  }

  return {
    matches,
    stats: {
      filesScanned,
      matchCount: matches.length,
      durationMs: Date.now() - startedAt,
      paths: config.paths,
      targets: config.targets,
    },
    config,
  }
}

/**
 * @param {string} filePath
 * @param {Array<{target: string, regex: RegExp}>} targetRegexes
 * @param {Array} matches
 * @param {string} cwd
 */
function scanFile(filePath, targetRegexes, matches, cwd) {
  let content
  try {
    content = fs.readFileSync(filePath, 'utf8')
  } catch {
    return
  }

  // Skip binary-ish files
  if (content.includes('\u0000')) return

  const lines = content.split(/\r?\n/)
  for (let index = 0; index < lines.length; index++) {
    const line = lines[index]
    for (const { target, regex } of targetRegexes) {
      regex.lastIndex = 0
      const m = regex.exec(line)
      if (m) {
        matches.push({
          file: path.relative(cwd, filePath) || filePath,
          absoluteFile: filePath,
          line: index + 1,
          column: m.index + 1,
          target,
          text: line.trim(),
        })
      }
    }
  }
}

/**
 * Backward-compatible wrapper used by older callers.
 * Scans and returns results (no exit). Prefer `scan()`.
 */
function checkTodos(searchPaths = ['src'], targets = ['todo']) {
  return scan({ paths: searchPaths, targets })
}

module.exports = {
  scan,
  checkTodos,
  buildTargetRegex,
}
