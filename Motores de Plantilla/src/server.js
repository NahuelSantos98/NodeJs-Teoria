import express from 'express'
import { __dirname } from './path.js'
import productRouter from './routes/productos.routes.js'
import multerRouter from './routes/imagenes.routes.js'
import handlebars from 'express-handlebars'
import viewsRouter from './routes/views.routes.js'
import path from 'path'

const app = express()
const PORT = 8080


app.use(express.json()) 
app.use(express.urlencoded({extended: true}))

app.use('/static', express.static(__dirname + '/public'))

app.use('/api/productos', productRouter)
app.use('/upload', multerRouter)
app.use('/views', viewsRouter)

app.engine('handlebars', handlebars.engine()) //Inicializa el motor de handlbars.

app.set('views', path.join(__dirname, '/views')) //Asigna el lugar de donde va a sacar las vistas.

app.set('view engine', 'handlebars') //Setea el USO de handlebars. Se usa el alias designado previo a la ruta.


app.listen(PORT, () => {
    console.log("Server on port", PORT)
})
