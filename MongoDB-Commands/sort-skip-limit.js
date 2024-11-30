//Busca TODOS los registros y los devuelve ordenados de forma DESCENDENTE
db.collection.find({}).sort({ edad: -1 })

//Busca TODOS los registros y los devuelve ordenados de forma ASCENDENTE
db.collection.find({}).sort({ edad: 1 })

//Limita los resultados en torno al valor que se le pase:
db.collection.find({}).limit(1)

//Saltea la cantidad de registros indicada por parametro:
//Saltea el 1er registro, por lo que arranca desde el 2do
db.clase13.find({}).skip(1)


//Uso en conjunto:
//Trae el usuario con menor edad:
db.collection.find({}).sort({edad: 1}).limit(1)

//Devuelve el segundo argumento con menor edad.
db.clase13.find({}).sort({edad: 1}).skip(1).limit(1)
