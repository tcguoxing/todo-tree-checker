const fs = require('fs-extra')
const path = require('path')

const DEFAULTS = {
  paths: ['src'],
  targets: ['todo'],
  exclude: ['**/node_modules/**', '**/dist/**', '**/.git/**'],
  pretty: true,
  failOnMatch: true,
  reportFile: null,
}

/**
 * Read todoTreeChecker field from the nearest package.json starting at cwd.
 * @param {string} [cwd]
 * @returns {object}
 */
function loadPackageConfig(cwd = process.cwd()) {
  let dir = path.resolve(cwd)
  const root = path.parse(dir).root

  while (true) {
    const pkgPath = path.join(dir, 'package.json')
    if (fs.existsSync(pkgPath)) {
      try {
        const pkg = fs.readJsonSync(pkgPath)
        if (pkg && pkg.todoTreeChecker && typeof pkg.todoTreeChecker === 'object') {
          return { ...pkg.todoTreeChecker, _packageJsonPath: pkgPath }
        }
      } catch {
        // ignore invalid package.json
      }
      // Stop at first package.json even if field is missing
      return {}
    }
    if (dir === root) break
    dir = path.dirname(dir)
  }
  return {}
}

/**
 * Merge config layers: defaults < package.json < plugin/cli overrides.
 * @param {object} [overrides]
 * @param {string} [cwd]
 * @returns {object}
 */
function resolveConfig(overrides = {}, cwd = process.cwd()) {
  const fromPkg = loadPackageConfig(cwd)
  const merged = {
    ...DEFAULTS,
    ...fromPkg,
    ...overrides,
  }

  // Normalize arrays
  if (typeof merged.paths === 'string') merged.paths = [merged.paths]
  if (typeof merged.targets === 'string') merged.targets = [merged.targets]
  if (!Array.isArray(merged.paths) || merged.paths.length === 0) {
    merged.paths = [...DEFAULTS.paths]
  }
  if (!Array.isArray(merged.targets) || merged.targets.length === 0) {
    merged.targets = [...DEFAULTS.targets]
  }
  if (!Array.isArray(merged.exclude)) {
    merged.exclude = [...DEFAULTS.exclude]
  }

  merged.pretty = merged.pretty !== false
  merged.failOnMatch = merged.failOnMatch !== false
  merged.reportFile = merged.reportFile || null
  merged.cwd = cwd

  delete merged._packageJsonPath
  return merged
}

module.exports = {
  DEFAULTS,
  loadPackageConfig,
  resolveConfig,
}
