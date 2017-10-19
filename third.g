{
  moduleInclude : `
    // Can be "require" statments, or direct declarations.
  `, 

  lex : {
    macros: {
      identifier: `[a-zA-Z0-9_]`,
    },

    rules: [
      ["\\/\\/.*",                `/* skip comments */`],
      ["\/\\*(.|\\s)*?\\*\/",     `/* skip comments */`],
      [`\\s+`,                    `/* skip whitespace */`],

      // ------------------------------------------------
      // Keywords.

      [`\\_`,       `return 'KEY_UNDERSCORE'`],
      [`\\ID`,      `return 'KEY_ID'`],
      [`\\STRING`,  `return 'KEY_STRING'`],
      [`\\NUM`,     `return 'KEY_NUM'`],
      // ------------------------------------------------
      // Symbols.
      [`\\=>`,                    `return 'SYM_ARROW'`],
      [`\\|`,                    `return 'SYM_PIPE'`],
      [`\\$`,                    `return 'SYM_DOLLAR'`],
      [`\\(`,                     `return 'SYM_LPAREN'`],
      [`\\)`,                     `return 'SYM_RPAREN'`],
      [`\\[`,                     `return 'SYM_LBRACKET'`],
      [`\\]`,                     `return 'SYM_RBRACKET'`],

      [`,`,                       `return 'SYM_COMMA'`],
      // ------------------------------------------------

      [`(\\d+(\\.\\d+)?)`,        `return 'NUMBER'`],
      [`"[^"]*"`,                 `yytext = yytext.slice(1, -1); return 'STRING';`],
      [`'[^']*'`,                 `yytext = yytext.slice(1, -1); return 'STRING';`],
      [`{identifier}+`,           `return 'IDENTIFIER'`],
    ],
  },

  bnf : {
    grammar : [
      [ `ε` ,                       `$$ = []` ],
      [ `rule grammar` ,           `$2.unshift($1); $$ = $2` ]
    ],
    rule : [
      [ `IDENTIFIER productions`,  `$$ =  { type : 'rule', identifier : $1, productions : $2 }` ]
    ],
    productions : [
      [ `ε` ,                       `$$ = []` ],
      [ `production productions` , `$2.unshift($1) ; $$ = $2` ]
    ],
    production : [
      [ `SYM_PIPE expansion SYM_ARROW term`, `$$ = { type : 'production', expansion : $2, term : $4 }` ]
    ],
    expansion : [
      [ `ε` ,                       `$$ = []` ],
      [ `symbol expansion`,        `$2.unshift($1) ; $$ = $2` ]
    ],
    symbol : [
      [ `KEY_ID`      ],
      [ `KEY_STRING`  ],
      [ `KEY_NUM`     ],
      [ `STRING`,     `$$ = { type : 'string', value : $1 }` ],
      [ `IDENTIFIER`, `$$ = { type : 'identifier', value : $1 }` ]
    ],
    term : [
      [ `KEY_UNDERSCORE` ],
      [ `IDENTIFIER arguments` ,             `$$ = { type : 'identifier_arguments', identifier : $1, arguments : $2 }` ],
      [ `STRING` ,                           `$$ = { type : 'string', value : $1 }` ],
      [ `NUMBER` ,                           `$$ = { type : 'number', value : $1 }` ],
      [ `SYM_DOLLAR NUMBER substitution` ,   `$$ = { type : 'number_substitution', number : $2, substitution : $3 }` ]
    ], 
    arguments : [
      [ `ε` ,                                      `$$ = []`  ],
      [ `SYM_LPAREN arguments_list SYM_RPAREN` ,  `$$ = $2`  ]      
    ],
    arguments_list : [
      [ `ε` ,                                      `$$ = []` ],
      [ `term arguments_list_continuation`,       `$2.unshift($1); $$ = $2` ]
    ],
    arguments_list_continuation : [
      [ `ε` ,                                          `$$ = []` ],
      [`SYM_COMMA term arguments_list_continuation`,  `$3.unshift($2) ; $$ = $3` ]
    ],
    substitution : [
      [ `ε` ,                                          `$$ = []` ],
      [`SYM_LBRACKET term SYM_RBRACKET`,  `$$ = { 'type' : 'substitution', term : $2 }` ]
    ]
  }
}