## TP 1 Parseo y generación de Códigos

### Dependencias

  * node.js

Para instalar depenendencia, hacer `npm install`
La librería usada para generar parseadores es [syntax-cli](https://www.npmjs.com/package/syntax-cli)

*solo instalar librería si se desea generar el parser de lleca (que ya está incluído en el repo)*

### Contenido

* third.g es grammar y lexer en un solo archivo usando un estilo json para describir. 
* main.js el programa principal que atiende las funcionalidades pedidas en el tp. 

### How To
```
  node main.js "{gramática}" {comando} {argumento}
    donde comando : first, follow, parsed, reserved, keywords
    ej :
  node main.js "tests_lleca/robot.ll" follow comando
```
