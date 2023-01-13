#!/usr/bin/env node

const { isDef, isArray, getArrayWithoutKey, consoleInfo } = require('./share/util');
const todoChecker = require('./src/core/index')

const rawArgv = process.argv.slice(2); // process.argv返回一个list，其中第一个有node版本号，第二个是程序开始位置，第三个往后就是所有参数；
// console.log('rawArgv: ', rawArgv)
const result = require("minimist")(rawArgv, "opts['--']");

let searchPath = ['src']
let target = ['todo']
const args = result._
// console.log('args: ', args)
if (isDef(args)) {
  if (!isArray(args)) {
    if (args.indexOf('_')  > -1) {
      // 这是一种默认文件夹的情况，这种情况下所有参数都是入参
      target = getArrayWithoutKey(args, '_')
    } else {
      if (args.indexOf('|') > -1) {
        const index = args.indexOf('1')
        searchPath = args.slice(0, index)
        target = args.slice(index + 1)
      } else {
        searchPath = args.slice(0, 1)
        target = args.slice(1)
      }
    }
  } else {
    consoleInfo('仅仅支持字符输入且彼此间用空格隔开。')
  }
} else {
  consoleInfo('没有入参，默认检查根目录下的src文件夹并寻找todo标签。')
  // const info = 
  // console.log(new Array(info.length*2).join('-'))
  // console.log(info)
  // console.log(new Array(info.length*2).join('-'))
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
