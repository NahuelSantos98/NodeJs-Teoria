//Muestra TODOS los registros de una collection
db.collection.find()

//Muestra el 1er registro (Si no tiene (opt))
db.estudiantes.findOne()

//Mustra primer registro que cumpla con ese (opt)
db.estudiantes.findOne({curso: 1})

//Trae todos los registros que cumplen con que curso sea 1
db.estudiantes.find({curso: 1})
