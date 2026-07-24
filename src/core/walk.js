const fs = require('fs-extra')
const path = require('path')

/**
 * Convert a simple glob pattern to a RegExp.
 * Supports `**`, `*`, and path separators.
 * @param {string} pattern
 * @returns {RegExp}
 */
function globToRegExp(pattern) {
  const normalized = pattern.replace(/\\/g, '/')
  let regex = ''
  let i = 0
  while (i < normalized.length) {
    const char = normalized[i]
    if (char === '*' && normalized[i + 1] === '*') {
      regex += '.*'
      i += 2
      if (normalized[i] === '/') i += 1
      continue
    }
    if (char === '*') {
      regex += '[^/]*'
      i += 1
      continue
    }
    if ('()+.^$|{}[]\\'.includes(char)) {
      regex += `\\${char}`
    } else {
      regex += char
    }
    i += 1
  }
  return new RegExp(`^${regex}$`)
}

/**
 * @param {string} filePath
 * @param {string[]} patterns
 * @returns {boolean}
 */
function isExcluded(filePath, patterns = []) {
  if (!patterns.length) return false
  const normalized = filePath.replace(/\\/g, '/')
  return patterns.some((pattern) => {
    const variants = [pattern]
    // `**/foo/**` should also exclude the directory `foo` itself
    if (pattern.endsWith('/**')) {
      variants.push(pattern.slice(0, -3))
    }
    return variants.some((p) => {
      const re = globToRegExp(p)
      if (re.test(normalized)) return true
      return re.test(path.basename(normalized))
    })
  })
}

/**
 * Recursively walk a directory and invoke callback for each file.
 * @param {string} currentDirPath
 * @param {(filePath: string) => void} callback
 * @param {{ exclude?: string[], onFile?: (filePath: string) => void }} options
 */
function walkSync(currentDirPath, callback, options = {}) {
  const { exclude = [], onFile } = options
  let entries
  try {
    entries = fs.readdirSync(currentDirPath, { withFileTypes: true })
  } catch {
    return
  }

  for (const dirent of entries) {
    const filePath = path.join(currentDirPath, dirent.name)
    if (isExcluded(filePath, exclude) || isExcluded(dirent.name, exclude)) {
      continue
    }
    if (dirent.isFile()) {
      if (onFile) onFile(filePath)
      callback(filePath)
    } else if (dirent.isDirectory()) {
      walkSync(filePath, callback, options)
    }
  }
}

module.exports = {
  walkSync,
  isExcluded,
  globToRegExp,
}
