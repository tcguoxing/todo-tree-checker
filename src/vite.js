const { scan, resolveConfig } = require('./core')
const { reportPlain, writeReportFile } = require('./reporters/plain')

/**
 * Format matches into a single error/warning message.
 * @param {Array} matches
 * @returns {string}
 */
function formatMatches(matches) {
  return matches
    .map((m) => `${m.file}:${m.line}:${m.column} [${m.target}] ${m.text}`)
    .join('\n')
}

/**
 * Vite plugin: scan before build starts.
 * Defaults to plain output (more CI-friendly); set pretty: true to opt in.
 *
 * @param {object} [pluginOptions]
 * @returns {import('vite').Plugin}
 */
function todoTreeChecker(pluginOptions = {}) {
  const overrides = {
    pretty: false,
    ...pluginOptions,
  }

  return {
    name: 'todo-tree-checker',
    apply: 'build',
    buildStart() {
      const config = resolveConfig(overrides, overrides.cwd || process.cwd())
      const result = scan(config)

      if (config.pretty) {
        // Avoid Temir in Vite build logs by default; still allow opt-in via plain path
        reportPlain(result)
      } else {
        reportPlain(result)
      }

      if (config.reportFile) {
        writeReportFile(result, config.reportFile, config.cwd)
      }

      if (result.matches.length > 0) {
        const message =
          `todo-tree-checker found ${result.matches.length} match(es):\n` +
          formatMatches(result.matches)

        if (config.failOnMatch) {
          this.error(message)
        } else {
          this.warn(message)
        }
      }
    },
  }
}

module.exports = todoTreeChecker
module.exports.todoTreeChecker = todoTreeChecker
module.exports.default = todoTreeChecker
