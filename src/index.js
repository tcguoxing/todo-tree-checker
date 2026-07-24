const core = require('./core')

module.exports = {
  ...core,
  scan: core.scan,
  checkTodos: core.checkTodos,
  resolveConfig: core.resolveConfig,
}
