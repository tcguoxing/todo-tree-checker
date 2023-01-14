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

module.exports = {isValidArray, isDef, getArrayWithoutKey, consoleInfo}
