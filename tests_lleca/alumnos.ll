base_de_alumnos
| "begin" lista_alumnos "end" => $2

lista_alumnos
|                             => Nil
| alumno ";" lista_alumnos    => Cons($1, $3)

alumno
| "#" NUM ":=" STRING         => Alumno("nombre", $4, "legajo", $2)

