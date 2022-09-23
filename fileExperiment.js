var fs = require('fs-extra')
// var path = require('pa')
var regex = /\/\/[ ]*(todos)/;
var target = 'notes'
// var a = new RegExp('/\/\/[ ]*(')
// var b = new RegExp(')/')
var c = new RegExp('\/\/[ ]*(' + target +')')
// import fs from 'fs-extra'

let result = fs.readFileSync('lib/index.js', "utf8");
// console.log('result: ', result)
let arrayList = result.split('\n')
// console.log('arrayList: ', Array.from(arrayList))
// console.log('arrayList length: ', arrayList.length)
console.log('type: ', typeof regex)
console.log('type: ', regex)
console.log('type: ', c)
