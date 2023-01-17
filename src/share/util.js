function isValidArray(params) {
    return Object.prototype.toString.call(params) === '[object Array]' && params.length > 0
}

function isDef(params) {
    return params !== undefined && params !== null
}

function getArrayWithoutKey (args, key) {
    let list = []
    for (let index = 0; index < args.length; index++) {
        const element = args[index].trim()
        if (element !== key) {
            list.push(element)
        }
    }
    console.log(list);
    return list
}

function consoleInfo(params) {
    if (params.length < 1) {
        return 
    } else {
        console.log(new Array(params.length * 2).join('-'))
        console.log(new Array(params.length * 2).join('-'))
        console.log(params)
        console.log(new Array(params.length * 2).join('-'))
        console.log(new Array(params.length * 2).join('-'))
    }
}

function makeListIterator(list, step = 1) {
    if (!this.isValidArray(list)) {
        return undefined
    }
    let nextIndex = 0; // 初始化索引值
    let end = list.length; // 最大索引值
    let iterationCount = 0;

    const rangeIterator = {
       next: function() {
           let result;
           if (nextIndex < end) {
               result = { value: list[nextIndex], done: false }
               nextIndex += step;
               iterationCount++;
               return result;
           }
           return { value: list[iterationCount], done: true }
       }
    };
    return rangeIterator;
}


module.exports = {isValidArray, isDef, getArrayWithoutKey, consoleInfo, makeListIterator}
