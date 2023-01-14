#!/usr/bin/env node

const { isDef, isValidArray, getArrayWithoutKey, consoleInfo } = require('./src/share/util');
const todoChecker = require('./src/core/index')
const { program } = require('commander');

program
.option('-p, --path <path...>', 'search path')
.option('-t, --target [target...]', 'search target')
.showHelpAfterError('请使用-p或--path输入搜索路径，-t或--target输入搜索目标，默认搜索src文件夹下的todo目标。')

program.parse();

let parseArgs = program.opts()
let args = program.args

let searchPath = ['src']
let target = ['todo']


if (isDef(parseArgs) && JSON.stringify(parseArgs)  !== '{}') {
  if (!!parseArgs.path) {
    searchPath = parseArgs.path  
  }
  if (!!parseArgs.target) {
    target = parseArgs.target
  }
} else {
  if (isValidArray(args)) {
    searchPath = [args[0]]
    target = args.slice(1).length > 0 ? args.slice(1) : target
  }
}



console.log('searchPath: ', searchPath)
console.log('target: ', target)

// const searchPath = args._[0] !== undefined && args._[0].trim() !== "" ? args._[0].trim() : 'src'
// const target = args._[1] !== undefined && args._[1].trim() !== "" ? args._[1].trim() : 'todo'

return
todoChecker.checkTodos(
  searchPath, // set default searchPath 'src'
  target // set default target todo
);

// function log() {
//   console.log(Array.from(arguments).reduce((a, b) => String(a) +  String(b) ))
// }
