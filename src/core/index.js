var findTarget = '';
var hasTodo = false
var fs = require('fs-extra')
var path = require('path')
var allTargets = []
var pathIterater = function() {}
const { isValidArray, consoleInfo, makeListIterator } = require('../share/util')

var checkTodos = function(searchPaths = ["src"], targets = ["todo"]) {
  if (!isValidArray(searchPaths)) {
    consoleInfo(`Invalid search path and search paths are: ${searchPaths}.`)
    return 
  }
  if (!isValidArray(targets)) {
    consoleInfo(`Invalid search target and search targets are: ${targets}.`)
    return
  }

  pathIterater = makeListIterator(searchPaths)
  allTargets = targets

  findNextPath()
}

function findNextPath() {
  let path = pathIterater.next()
  if (path.done) {
    return
  }
  for (let i = 0; i < allTargets.length; i++) {
    checkTarget(path.value, allTargets[i])
  }
}

function checkTarget(searchPath, target) {
  findTarget = target
  let regex = new RegExp('\/\/[ ]*(' + target +' |'+ target + '$)') // 会自动在前后各加一个/。

  // 该功能分两步，第一步是找到所有文件
  const callback = (filePath, dirent) => {
    if (filePath) {
      const result = fs.readFileSync(filePath, "utf8")
      const resultList = result.split('\n')
      for (let index = 0; index < resultList.length; index++) {
        if(regex.test(resultList[index].trimEnd())){
            hasTodo = true
            let rowIndex = regex.exec(resultList[index].trimEnd()).index
            console.log(`_______________filePath_______________ \r\n++\r\n++\r\n ${filePath}:${index+1}:${rowIndex+1} has ${findTarget}。\r\n++\r\n++ `)
        }
      }
    }
  }

  walkSync(searchPath, callback);
  if (hasTodo) {
    console.log(`Scan over and target has ${findTarget}。`)
    process.exit(1)
  } else {
    console.log(`There are no ${findTarget} under the target.`)
  }
}

var walkSync = function (currentDirPath, callback) {
  // 
  try {
    const files = fs.readdirSync(currentDirPath, { withFileTypes: true })
    files.forEach(function (dirent) {
      var filePath = path.join(currentDirPath, dirent.name);
      if (dirent.isFile()) {
        callback(filePath, dirent);
      } else if (dirent.isDirectory()) {
        walkSync(filePath, callback);
      } else {
        console.log(`todos检查完成，时间为：${new Date().getTime()}`)
      }
    });
    console.log('currentDirPath: ', currentDirPath);
  } catch (error) {
    // 跳过去搜索其他文件夹。
    consoleInfo('no path: ', currentDirPath)
    findNextPath()
  }
}

module.exports.checkTodos = checkTodos
