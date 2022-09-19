// import fs from 'fs-extra'
// import path from 'path'
var rootPath = ''
var regex = ''

function checkTodos (rootPath = 'src', regex = '\//[ ]*(todos)') {
 // 该功能分两步，第一步是找到所有文件
 walkSync(rootPath.trim() !== '' ? rootPath.trim() : 'src', function (filePath, dirent) {
 // console.log('allFilePath: ', filePath) // 这里是文件目录
 if (filePath) {
 var fs = require('fs-extra')
 fs.readFile(filePath, 'utf8', (err, data) => {
 // console.log(`________filePath:________ \r\n ${filePath}\r\n________and its file content:________ \r\n`, data)
 if (data.test(regex)) {
 console.log(`________filePath:________ \r\n ${filePath} 内含有todos。`)
 }
 if (err) {
 throw new Error(`文件读取错误：\r\nFile Reading Exception:\r\n${err}`)
 }
 })
 }
 // console.log('allDirent: ', dirent)
 })
 // 第二步对文件内容进行遍历，找到符合匹配的字段
 // console.log('这是我自己写的插件，看看能不能运行吧')
 // console.log('this is my tcguoxing plugin')
 return '这是我自己写的插件，看看能不能运行吧'
}
const rawArgv = process.argv.slice(2) // unknown
const args = require('minimist')(rawArgv, { // unknown
 
})
const argRootpath = args._[0] // unknown
const artRegex = args._[1]
function walkSync (currentDirPath, callback) {
 var fs = require('fs-extra')
 var path = require('path')
 fs.readdirSync(currentDirPath, { withFileTypes: true }).forEach(function (dirent) {
 var filePath = path.join(currentDirPath, dirent.name)
 if (dirent.isFile()) {
 callback(filePath, dirent)
 } else if (dirent.isDirectory()) {
 walkSync(filePath, callback)
 }
 })
}
checkTodos(argRootpath.trim() === '' ? rootPath : argRootpath.trim(), artRegex.trim() === '' ? regex : artRegex.trim())

export function setConfig (rootPath, regex) {
 rootPath = this.rootPath
 regex = this.regex
}