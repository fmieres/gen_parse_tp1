programa
| /* programa vacío */  => Fin
| comando programa      => Secuencia($1, $2)

comando
| "AVANZAR" NUM         => CmdAvanzar($2)
| "GIRAR" sentido       => CmdGirar($2)

sentido
| "IZQ"                 => Izquierda
| "DER"                 => Derecha

