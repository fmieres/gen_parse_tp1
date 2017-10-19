## TP 1 Parseo y generación de Códigos

### Dependencias

  * node.js

Para instalar depenendencia, hacer `npm install`
La librería usada para generar parseadores es [syntax-cli](https://www.npmjs.com/package/syntax-cli)

### Contenido

* first.js >>  contiene el tokenizador a partir del pseudocódigo del tp. Pero quedó deprecado con el uso de la librería
    * `node first.js` simplemente tokeniza la string en código
* second.* son la gramática y las cofigs del lexer de lleca. 
    * `node_modules/syntax-cli/bin/syntax -g second.bnf  -l second.lex -m slr1 -f tests_lleca/test00.input` Esto procesa, genera el parser y parsea el contenido de tests_lleca/test00.input y avisa si está o no en el lenguaje.
    * `node_modules/syntax-cli/bin/syntax -g second.bnf  -l second.lex -m ll1 -o file.js` Esto escribe un parser en javascript que puede ser usado para importar en otro programa.
* third.g es grammar y lexer en un solo archivo usando un estilo json para describir. 
    * `node_modules/syntax-cli/bin/syntax -g third.g -m slr1 -f tests_lleca/test03.input -o parsers/test3.js`  funciona de la misma manera que el anterior. al comando syntax se puede agregar `-t` para generar la tabla de ll1 o slr1, y también se puede usar `-s first/follow para generar esos conjuntos`