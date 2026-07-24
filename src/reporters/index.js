const { reportPlain, writeReportFile } = require('./plain')

/**
 * Dispatch to pretty or plain reporter.
 * Pretty is loaded lazily so --no-pretty avoids pulling Temir.
 *
 * @param {{ matches: Array, stats: object, config: object }} result
 * @param {{ pretty?: boolean }} [options]
 * @returns {Promise<void>}
 */
async function report(result, options = {}) {
  const pretty = options.pretty !== false && result.config?.pretty !== false

  if (pretty) {
    try {
      const { reportPretty } = require('./pretty')
      await reportPretty(result)
    } catch (err) {
      console.warn(
        '[todo-tree-checker] Pretty reporter failed, falling back to plain:',
        err.message
      )
      reportPlain(result)
    }
  } else {
    reportPlain(result)
  }

  const reportFile = options.reportFile ?? result.config?.reportFile
  if (reportFile) {
    const out = writeReportFile(result, reportFile, result.config?.cwd)
    if (out) {
      console.log(`Report written to ${out}`)
    }
  }
}

module.exports = {
  report,
  reportPlain,
  writeReportFile,
}
