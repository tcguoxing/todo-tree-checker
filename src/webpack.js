const { scan, resolveConfig } = require('./core')
const { reportPlain, writeReportFile } = require('./reporters/plain')

/**
 * Format matches into a single message.
 * @param {Array} matches
 * @returns {string}
 */
function formatMatches(matches) {
  return matches
    .map((m) => `${m.file}:${m.line}:${m.column} [${m.target}] ${m.text}`)
    .join('\n')
}

/**
 * Webpack plugin: scan before compiler run.
 * Defaults to plain output.
 */
class TodoTreeCheckerPlugin {
  /**
   * @param {object} [options]
   */
  constructor(options = {}) {
    this.options = {
      pretty: false,
      ...options,
    }
  }

  /**
   * @param {import('webpack').Compiler} compiler
   */
  apply(compiler) {
    const pluginName = 'TodoTreeCheckerPlugin'

    const runScan = (callback) => {
      try {
        const config = resolveConfig(
          this.options,
          this.options.cwd || compiler.context || process.cwd()
        )
        const result = scan(config)
        reportPlain(result)

        if (config.reportFile) {
          writeReportFile(result, config.reportFile, config.cwd)
        }

        if (result.matches.length > 0) {
          const message =
            `todo-tree-checker found ${result.matches.length} match(es):\n` +
            formatMatches(result.matches)

          if (config.failOnMatch) {
            callback(new Error(message))
            return
          }
          // Soft warn via console when not failing
          console.warn(message)
        }
        callback()
      } catch (err) {
        callback(err)
      }
    }

    if (compiler.hooks && compiler.hooks.beforeRun) {
      compiler.hooks.beforeRun.tapAsync(pluginName, (_compiler, callback) => {
        runScan(callback)
      })
    } else if (compiler.plugin) {
      // Webpack 3 fallback
      compiler.plugin('before-run', (_compiler, callback) => {
        runScan(callback)
      })
    }

    // Also hook watchRun so `webpack --watch` / webpack-dev-server re-check
    if (compiler.hooks && compiler.hooks.watchRun) {
      compiler.hooks.watchRun.tapAsync(pluginName, (_compiler, callback) => {
        runScan(callback)
      })
    }
  }
}

module.exports = TodoTreeCheckerPlugin
module.exports.TodoTreeCheckerPlugin = TodoTreeCheckerPlugin
module.exports.default = TodoTreeCheckerPlugin
