#!/usr/bin/env node

const todoChecker = require('./lib/index')

const rawArgv = process.argv.slice(2); // unknown
const args = require("minimist")(rawArgv, {});
const searchPath = args._[0] !== undefined && args._[0].trim() !== "" ? args._[0].trim() : 'src'
const target = args._[1] !== undefined && args._[1].trim() !== "" ? args._[1].trim() : 'todo'

todoChecker.checkTodos(
  searchPath, // set default searchPath 'src'
  target // set default target todo
);
