{
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
}