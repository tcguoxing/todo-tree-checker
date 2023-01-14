var findTarget = '';
var hasTodo = false;
var fs = require('fs-extra');
var path = require('path');



var checkTodos = function(searchPath = "src", target = "todo") {
  findTarget = target;
  let regex = new RegExp('\/\/[ ]*(' + target +' |'+ target + '$)'); // 会自动在前后各加一个/。

  // 该功能分两步，第一步是找到所有文件
  const callback = (filePath, dirent) => {
    if (filePath) {
      const result = fs.readFileSync(filePath, "utf8");
      const resultList = result.split('\n');
      for (let index = 0; index < resultList.length; index++) {
        if(regex.test(resultList[index].trimEnd())){
            hasTodo = true;
            let rowIndex = regex.exec(resultList[index].trimEnd()).index;
            console.log(`_______________filePath_______________ \r\n++\r\n++\r\n ${filePath}:${index+1}:${rowIndex+1} has ${findTarget}。\r\n++\r\n++ `);
        }
      }
    }
  };
  walkSync(searchPath.trim() !== "" ? searchPath.trim() : "src", callback);
  if (hasTodo) {
    console.log(`Scan over and target has ${findTarget}。`);
    process.exit(1);
  } else {
    console.log(`There are no ${findTarget} under the target.`);
  }
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

module.exports.checkTodos = checkTodos;
