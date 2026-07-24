const path = require('path')
const fs = require('fs-extra')

/**
 * Print a plain-text scan report to stdout.
 * @param {{ matches: Array, stats: object, config?: object }} result
 */
function reportPlain(result) {
  const { matches, stats } = result

  console.log('')
  console.log('========== todo-tree-checker ==========')
  console.log(`paths:   ${stats.paths.join(', ')}`)
  console.log(`targets: ${stats.targets.join(', ')}`)
  console.log(`files:   ${stats.filesScanned}`)
  console.log(`matches: ${stats.matchCount}`)
  console.log(`time:    ${stats.durationMs}ms`)
  console.log('---------------------------------------')

  if (matches.length === 0) {
    console.log(`No ${stats.targets.join('/')} found.`)
    console.log('=======================================')
    console.log('')
    return
  }

  for (const match of matches) {
    console.log(
      `  ${match.file}:${match.line}:${match.column}  [${match.target}]  ${match.text}`
    )
  }

  console.log('---------------------------------------')
  console.log(`Found ${matches.length} match(es).`)
  console.log('=======================================')
  console.log('')
}

/**
 * Write JSON report to disk when reportFile is set.
 * @param {{ matches: Array, stats: object, config: object }} result
 * @param {string|null} reportFile
 * @param {string} [cwd]
 */
function writeReportFile(result, reportFile, cwd = process.cwd()) {
  if (!reportFile) return null
  const outPath = path.isAbsolute(reportFile)
    ? reportFile
    : path.resolve(cwd, reportFile)
  fs.ensureDirSync(path.dirname(outPath))
  const payload = {
    generatedAt: new Date().toISOString(),
    stats: result.stats,
    matches: result.matches,
  }
  fs.writeJsonSync(outPath, payload, { spaces: 2 })
  return outPath
}

module.exports = {
  reportPlain,
  writeReportFile,
}
