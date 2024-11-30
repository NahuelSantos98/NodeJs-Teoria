//Crea un registro
//Recibe un objeto directo
db.collection.insertMany({ nombre: "Nahuel", apellido: "Santos", curso: 2, correo: "nahuel@gmail.com" })



//Crea varios registros
//Recibe un ARRAY de objetos
db.collection.insertMany([
    { nombre: "Nahuel", apellido: "Santos", curso: 2, correo: "nahuel@gmail.com" },
    { nombre: "Martin", apellido: "Gimenez", curso: 2, correo: "martin@gmail.com" },
    { nombre: "Sol", apellido: "Martinez", curso: 2, correo: "sol@gmail.com" },
    { nombre: "Rodrigo", apellido: "Fernandez", curso: 2, correo: "rodrigo@gmail.com" },
    { nombre: "Miguel", apellido: "Prado", curso: 2, correo: "miguel@gmail.com" },
])