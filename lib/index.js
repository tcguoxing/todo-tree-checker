// var regex = /\/\/[ ]*(todos)/;
var hasTodo = false;
var fs = require('fs-extra');
var path = require('path');

var checkTodos = function(rootPath = "src", target = "todos") {
  console.log('rootPath: ', rootPath);
  console.log('target: ', target);
  let regex = new RegExp('\/\/[ ]*(' + target +')'); // 会自动在前后各加一个/。
  // 该功能分两步，第一步是找到所有文件
  const callback = (filePath, dirent) => {
    if (filePath) {
      const result = fs.readFileSync(filePath, "utf8");
      const resultList = result.split('\n');
      for (let index = 0; index < resultList.length; index++) {
        if(regex.test(String(resultList[index]))){
            hasTodo = true;
            let rowIndex = regex.exec(resultList[index]);
            console.log(`_______________filePath_______________ \r\n ${filePath}:${index+1}:${rowIndex}内含有${target}。\r\n_______________filePath_______________ `);
        }
      }
    }
  };
  walkSync(rootPath.trim() !== "" ? rootPath.trim() : "src", callback);
  if (hasTodo) {
    console.log('运行结束，含有todos。');
    process.exit(1);
  } else {
    console.log('不含有todos，运行继续。');
  }
  return "这是我自己写的插件，看看能不能运行吧";
};

var walkSync = function (currentDirPath, callback) {
  const files = fs.readdirSync(currentDirPath, { withFileTypes: true });
  files.forEach(function (dirent) {
    var filePath = path.join(currentDirPath, dirent.name);
    if (dirent.isFile()) {
      callback(filePath, dirent);
    } else if (dirent.isDirectory()) {
      walkSync(filePath, callback);
    } else {
      console.log(`todos检查完成，时间为：${new Date().getTime()}`);
    }
  });
};

// accept reference
// const rawArgv = process.argv.slice(2); // unknown
// const args = require("minimist")(rawArgv, {});
// const argRootpath = args._[0]; // unknown
// const artRegex = args._[1];
// checkTodos(
//   argRootpath.trim() === "" ? rootPath : argRootpath.trim(),
//   artRegex.trim() === "" ? regex : artRegex.trim()
// );

// export function setConfig(rootPath, regex) {
//   rootPath = this.rootPath;
//   regex = this.regex;
// }

module.exports.checkTodos = checkTodos;
