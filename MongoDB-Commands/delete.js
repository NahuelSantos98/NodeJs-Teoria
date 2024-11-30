//Elimina sólo el primer elemento que cumpla con el criterio
db.collection.deleteOne({nombre: 'Juan'})

//Elimina TODOS los elementos que cumplan con el criterio:
db.collection.deleteMany({nombre: 'Juan'})

//Elimina si la edad NO existe:
db.collection.deleteMany({edad :{$exists: false}})
