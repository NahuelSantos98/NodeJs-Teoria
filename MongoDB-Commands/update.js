//Parametros que recibe:
//1ero Query : Es el filtrado para que busque CUAL registro cambia
//2do Update: Qué atributo va a actualizar. Usa parametros:
    //$set, $unset, $inc, $rename, $mul, $min, $max
//3ero Option: Opciones a tomar en cuenta al actualizar (Ej:upsert, inserta el valor en caso de que el documento a actualizar ni siquiera exista).

//Setea la edad de Fede en 36: 
db.clase13.updateOne({nombre: 'Fede'}, {$set :{edad: 36}})

//Elimina el atributo directamente:
db.usuarios.updateOne({nombre: "Fede" },{ $unset: { edad: "" }})

//Incrementar en 1 a un valor:
db.usuarios.updateOne({ nombre: "Fede" },{ $inc: { edad: 1 }})

//Decrementar en 1 un valor:
db.usuarios.updateOne({ nombre: "Fede" },{ $inc: { edad: -1 }})

//Cambia el nombre de un atributo:
//Cambia edad a edad_actual
db.usuarios.updateOne({ nombre: "Fede" },{ $rename: { edad: "edad_actual" }})

//Multiplicar el valor por el numero pasado por param:
db.usuarios.updateOne({ nombre: "Fede" },{ $mul: { edad: 2 }})

//Actualiza solo si el valor actual es mayor que el valor proporcionado.
//Se actualiza solo si la edad es mayor que 35:
db.usuarios.updateOne({ nombre: "Fede" },{ $min: { edad: 35 }})

//Actualiza solo si el valor actual es menor que el valor proporcionado.
//Se actualiza la edad solo si es menor que 40
db.usuarios.updateOne({ nombre: "Fede" },{ $max: { edad: 40 }})

//Hace un update a varios:

