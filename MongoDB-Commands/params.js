//Combina condiciones, tiene que cumplir con TODAS:
db.collection.find({$and: [{ color: "rojo" },{ precio: { $lt: 25 } }]})

//Combina condiciones. tiene que cumplir con alguna:
db.collection.find({$or: [{nombre: 'Juan'}, {nombre: 'Lucia'}]})

//Menor a:
db.collection.find({edad: {$lt: 30}})

//Menor o igual a:
db.collection.find({edad: {$lte: 30}})

//Mayor a:
db.collection.find({edad: {$gt: 30}})

//Mayor o igual.
db.collection.find({edad: {$gte: 23}})

//Entre dos valores:
db.collection.find({edad: {$gte: 26, $lte: 35}})

//Diferente a (!):
//Todos los que no tienen edad 23
db.collection.find({edad: {$ne: 23}})

//Equals
db.collection.find({nombre: 'Juan', edad: {$eq: 29}})

//Si existe:
//Si existe el campo edad, devolvelo
db.collection.find({ edad: { $exists: true } })

//Si el valor cumple con alguno de los params:
//Edades 20 y 27 nada mas
db.collection.find({ edad: { $in: [20, 27] } })

//Si no coincide con ninguno de los valores especificados:
//Todos menos los que tengan edad 25 o 29
db.collection.find({ edad: { $nin: [25, 29] } })

//Coincide con el length de un atributo array.
//Que en colores tenga 3 valores ["rojo", "azul", "verde"]
db.collection.find({ colores: { $size: 3 } })

//En el atributo Array, tenga los valores definidos dentro del array
//Que tenga "rojo" y "azul"
db.collection.find({ colores: { $all: ["rojo", "azul"] } })

//Al menos UN valor coincide con el param:
db.collection.find({caracteristicas: {$elemMatch:{ color: "rojo", tamaño: "M" }}})
