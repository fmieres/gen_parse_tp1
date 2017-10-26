const llecaParser = require('./lleca.slr1.js')
const util = require('util')
const fs = require('fs')

// let parsedSimpleExample = llecaParser.parse('hello | ID => "World"')
// console.log('log: ',util.inspect(parsedSimpleExample, false, null));

// let alumnos = fs.readFileSync('./tests_lleca/alumnos.ll', 'utf8')
// let parsedAlumnos = llecaParser.parse(alumnos)
// console.log('log: ',util.inspect(parsedAlumnos, false, null));

// let robot = fs.readFileSync('./tests_lleca/robot.ll', 'utf8')
// let parsedRobot = llecaParser.parse(robot)

function parseFile(fileName){
  let read = fs.readFileSync(fileName, 'utf8')
  return llecaParser.parse(read)
}

/*function isVarTypeOf(_var, _type){
  try {
    return _var.constructor === _type
  } catch(ex) {
    return _var === _type
  }
}*/



/* 4.1 */
// let reservedRobot = discernReserved(parsedRobotReserved);
// let reservedAlumnos = discernReserved(parsedAlumnosReserved);
/* *********************** */

function Grammar(parsed){

  function findStrings(rules){
    let findInside = aProducton =>
      aProducton.expansion.reduce(
        (carry, item) => 
          item.type === 'string' ? carry.concat(item.value) : carry
      , [])

    return rules.map( 
      rule => rule.productions.map(findInside)
    )
  }

  let minFlat = anArray => typeof anArray === 'string' ? anArray : [].concat.apply([], anArray)
  let reFlat = resolve => minFlat(minFlat(resolve))

  let regexMatch = (regex,aString) => RegExp(regex).test(aString) 

  function discernReserved(anArray){
    return anArray.reduce(
      (carry, item) => {
        regexMatch('^[a-zA-Z_][a-zA-Z0-9_]*$', item) 
          ? carry.keywords.unshift(item) 
          : carry.symbols.unshift(item)
        return carry
      }
    , {keywords:[], symbols : []})
  }

  let getRule   = identifier => parsed.find( x => x.identifier === identifier)
  let whichRuleRefers = identifier => parsed.reduce(
    (carry, rule) => {
      let ruleProductions = rule.productions.filter(
        (production) => 
          production.expansion.find( expansion => expansion.type === 'identifier' && expansion.value === identifier )
      ).map( production => production.expansion )
      
      if (ruleProductions.length >= 1) carry[rule.identifier] = ruleProductions[0]
      return carry
    }
  , {})

  let isEpsilon  = production =>       0  === production.expansion.length
  let isTerminal = expansion  => 'string' === expansion.type  || 'keyword' === expansion.type

  let keywords = _ => reFlat(findStrings(parsed))
  let reserved = _ => discernReserved(keywords(parsed))

  let first = identifier => 
    getRule(identifier).productions.reduce(
      (carry, production) => carry.concat ((
        production => 
          isEpsilon(production)
            ? minFlat(follow(identifier))
            : isTerminal(production.expansion[0])
              ? production.expansion[0].value
              : first(production.expansion[0].value)
      ) (production) )
    , [])

  let follow = identifier => {
    let hasNextExpansion = (production, index) => production.expansion[index+1]

    let followSet = Object.keys(whichRuleRefers(identifier)).filter(x => x !== identifier)

    return followSet.length === 0
      ? '$'
      : minFlat(followSet.map( ruleName =>
          getRule(ruleName).productions.reduce(
            (carry, production) =>
              carry.concat(minFlat(production.expansion.map(
                (expansion, index) =>
                  expansion.value === identifier && 'identifier' === expansion.type ? index : -1
              ).filter(x => x >= 0).map(
                index => 
                  hasNextExpansion(production, index)
                    ? isTerminal(production.expansion[index+1]) 
                      ? production.expansion[index+1].value
                      : first(production.expansion[index+1].value)
                    : minFlat(follow(ruleName))
              )
              ))
          , [] )
      ))
  }


  
  let firsts   = _ => _

  return {
    reserved : reserved,
    keywords : keywords,
    first    : first,
    follow   : follow,

    whichRuleRefers : whichRuleRefers,
    parsed : parsed
  }
}


function main(source, step){
  let parsed  = parseFile(source)
  let grammar = Grammar(parsed)

  switch (step) {
    case "parse" :
      return parsed
    case "keywords" :
      return grammar.keywords()
    case "reserved" : /* 4.1 */
      return grammar.reserved()
    case "first" :
      return grammar.first()
    default : 
      return 'se requiere un paso válido'
  }
}

exports.grammar = Grammar
exports.parseFile = parseFile
// const argvs = process.argv
// console.log(util.inspect(main(argvs[2], argvs[3]), false, null))

