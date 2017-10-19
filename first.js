util = require('util')

function regexMatch(regex,aChar) {
  return RegExp(regex).test(aChar) 
}


function matcher(isNumeric, isAlphanumericOrUnderscore, isQuote, elseCase){
  var matcher = [
    { c : '^[0-9]$'     , f : (aChar, aReader, aConfig)=> isNumeric('^[0-9]$' ,aChar, aReader, aConfig)},
    { c : '^[a-zA-Z_]$' , f : (aChar, aReader, aConfig)=> isAlphanumericOrUnderscore('^[a-zA-Z_]$', aChar, aReader, aConfig)},
    { c : '^[\"\']$'    , f : (aChar, aReader, aConfig)=> isQuote('^[\"\']$', aChar, aReader, aConfig)}
  ]
  return (function(aChar){
    var match = matcher.find(x => RegExp(x.c).test(aChar) )
    return !!match ? match.f : elseCase
  })
}

function numericValue(regex, firstDigit, aReader){
  var startingPositionData = aReader.positionData()
  var array = []
  var next = firstDigit
  while (regexMatch(regex, next)){
    array.push(next)
    next = aReader.nextChar()
  }
  aReader.moveCursorBackward()
  return { type : 'number' , value : parseFloat(array.join("")),  context_info : { starting : startingPositionData , ending : aReader.positionData() }  }
}

function alphanumericOrUnderscoreValue(regex, firstChar, aReader, aConfig ){
  var startingPositionData = aReader.positionData()
  var array = []
  var next = firstChar
  while (regexMatch(regex, next)){
    array.push(next)
    next = aReader.nextChar()
  }
  aReader.moveCursorBackward()
  var value = array.join("") 
  return { type : aConfig.isKeyword(value) ?  'keyword' : 'literal', value : value, context_info : { starting : startingPositionData , ending : aReader.positionData() }  }
}

function stringValue(regex, quote, aReader){
  var startingPositionData = aReader.positionData()
  var array = []  
  var next = ''
  while (next !== quote){
    array.push(next)
    next = aReader.nextChar()
  }
  var value = array.join("") 
  return { type : 'string', value : value,  context_info : { starting : startingPositionData , ending : aReader.positionData() }  }
}

function elseCase(firstChar, aReader, aConfig){
  var startingPositionData = aReader.positionData()
  aReader.moveCursorBackward()
  if (undefined === firstChar) return {type : 'end_of_string', value : undefined,  context_info : { starting : startingPositionData , ending : aReader.positionData() }  }
  return {type : 'error', value : firstChar, context_info : { starting : startingPositionData , ending : aReader.positionData() } }
}

function nextToken(aReader, aConfig){
  var char = aReader.nextCharIgnoreWhiteSpace()
  var token = matcher(numericValue, alphanumericOrUnderscoreValue, stringValue, elseCase)(char)(char,aReader, aConfig)
  return token;
} 

function StringReader(source){
  var instance = {}

  var row = 0

  function nextChar(){
    return source[row++]
  }

  function nextCharIgnoreWhiteSpace(){
    var current = source[row]
    var whiteSpaceRegex = '^[\t\s ]$'
    while (regexMatch(whiteSpaceRegex, current)) current = source[++row] 
    return nextChar()
  }

  function moveCursorBackward(){ row -- }
  function positionData(){return {row : row}}

  instance.positionData = positionData
  instance.nextChar = nextChar
  instance.nextCharIgnoreWhiteSpace = nextCharIgnoreWhiteSpace
  instance.moveCursorBackward = moveCursorBackward
  return instance;
}

function BasicConfig(keywords){
  var instance = {}

  function isKeyword(maybeKeyword){
    return !!keywords.find(x=>x===maybeKeyword)
  }

  instance.isKeyword = isKeyword
  return instance;
}


function main(){
  var string = 'hello world "string" literal'
  var reader = StringReader(string)
  var config = BasicConfig(['hello'])

  var token = nextToken(reader, config)
  var tokens = [token]
  while (+!~['end_of_string', 'error'].indexOf(token.type)){
    token = nextToken(reader, config)
    tokens.push(token)
  }
  return tokens;
}

console.log(util.inspect(main(), false, null))

