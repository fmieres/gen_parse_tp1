const lleca = require('./lleca.js')
const util = require('util')
const fs = require('fs')

let parsedSimpleExample = lleca.parse('hello | ID => "World"')
console.log('log: ',util.inspect(parsedSimpleExample, false, null));

let test00Contents = fs.readFileSync('./tests_lleca/test00.input', 'utf8')

let parsedTest00 = lleca.parse(test00Contents)
console.log('log: ',util.inspect(parsedTest00, false, null));