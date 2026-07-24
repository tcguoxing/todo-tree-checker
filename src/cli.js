const { Command } = require('commander')
const { scan, resolveConfig } = require('./core')
const { report } = require('./reporters')

/**
 * Run the CLI. Exits the process with 0/1 based on failOnMatch.
 * @param {string[]} [argv]
 * @returns {Promise<number>} exit code
 */
async function run(argv = process.argv) {
  const program = new Command()

  program
    .name('todo-check')
    .description('Scan source files for TODO/FIXME (and custom) comments')
    .option('-p, --path <path...>', 'search path(s)')
    .option('-t, --target <target...>', 'search target keyword(s)')
    .option('--exclude <pattern...>', 'glob patterns to exclude')
    .option('--pretty', 'use Temir pretty terminal UI (default)')
    .option('--no-pretty', 'disable pretty UI, use plain text')
    .option('--fail-on-match', 'exit 1 when matches are found (default)')
    .option('--no-fail-on-match', 'never fail the process on matches')
    .option('--report-file <file>', 'write JSON report to file')
    .showHelpAfterError(
      'Use -p/--path and -t/--target. Config can also live in package.json under "todoTreeChecker".'
    )
    .parse(argv)

  const opts = program.opts()
  const overrides = {}

  if (opts.path) overrides.paths = opts.path
  if (opts.target) overrides.targets = opts.target
  if (opts.exclude) overrides.exclude = opts.exclude
  if (opts.pretty === false) overrides.pretty = false
  if (opts.pretty === true) overrides.pretty = true
  if (opts.failOnMatch === false) overrides.failOnMatch = false
  if (opts.failOnMatch === true) overrides.failOnMatch = true
  if (opts.reportFile) overrides.reportFile = opts.reportFile

  // Positional args fallback: todo-check [path] [target...]
  const args = program.args
  if (!opts.path && args.length > 0) {
    overrides.paths = [args[0]]
    if (args.length > 1 && !opts.target) {
      overrides.targets = args.slice(1)
    }
  }

  const config = resolveConfig(overrides)
  const result = scan(config)
  await report(result, {
    pretty: config.pretty,
    reportFile: config.reportFile,
  })

  const exitCode =
    config.failOnMatch && result.matches.length > 0 ? 1 : 0
  return exitCode
}

module.exports = { run }

if (require.main === module) {
  run()
    .then((code) => {
      process.exitCode = code
    })
    .catch((err) => {
      console.error(err)
      process.exitCode = 1
    })
}
