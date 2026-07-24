#!/usr/bin/env node
const { run } = require('../src/cli')

run()
  .then((code) => {
    process.exit(code)
  })
  .catch((err) => {
    console.error(err)
    process.exit(1)
  })
