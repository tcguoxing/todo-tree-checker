#!/usr/bin/env node

const todoChecker = require('./lib')

// import checkTodos from './lib'
console.log('checkTodos: ', todoChecker.checkTodos)
const rawArgv = process.argv.slice(2); // unknown
const args = require("minimist")(rawArgv, {});
const argRootpath = args._[0]; // unknown
const artRegex = args._[1];

console.log();
console.log();
todoChecker.checkTodos(
  argRootpath.trim() === "" ? rootPath : argRootpath.trim(),
  artRegex.trim() === "" ? regex : artRegex.trim()
);
