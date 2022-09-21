var rootPath = "src";
var regex = /\/\/[ ]*(todos)/;
var fs = require('fs-extra')
var path = require('path')
var hasTodo = false

function checkTodos(rootPath = "src") {
  // 该功能分两步，第一步是找到所有文件
  const callback = (filePath, dirent) => {
    // console.log('allFilePath: ', filePath) // 这里是文件目录
    if (filePath) {
      let result = fs.readFile(filePath, "utf8")
      if(regex.test(String(result))){
          hasTodo = false
          console.log(`_______________filePath_______________ \r\n ${filePath}内含有todos。`)
      }
    }
    // console.log('allDirent: ', dirent)
  }
  walkSync(rootPath.trim() !== "" ? rootPath.trim() : "src", callback);
  if (hasTodo) {
    console.log('运行结束，含有todos。')
    process.exit(1)
  } else {
    console.log('不含有todos，运行继续。')
  }
  return "这是我自己写的插件，看看能不能运行吧";
}

function walkSync(currentDirPath, callback) {
//   var fs = require("fs-extra");
//   var path = require("path");
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
}

// accept reference
const rawArgv = process.argv.slice(2); // unknown
const args = require("minimist")(rawArgv, {});
const argRootpath = args._[0]; // unknown
const artRegex = args._[1];
checkTodos(
  argRootpath.trim() === "" ? rootPath : argRootpath.trim(),
  artRegex.trim() === "" ? regex : artRegex.trim()
);

export function setConfig(rootPath, regex) {
  rootPath = this.rootPath;
  regex = this.regex;
}
