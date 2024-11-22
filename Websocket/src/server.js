import express from 'express'
import { create } from 'express-handlebars'
import viewsRouter from './routes/views.routes.js'
import multerRouter from '../src/routes/imagenes.routes.js'
import chatRouter from '../src/routes/chat.routes.js'
import path from 'path'
import { __dirname, __filename } from './path.js'
import { Server } from 'socket.io' //Se importa para abrir el servidor


const app = express()
const PORT = 8080
const hdbs = create({
   layoutsDir: path.join(__dirname, '/views/layouts'), // Directorio de layouts
   defaultLayout: 'main', // Nombre del layout predeterminado (main.handlebars)
   partialsDir: path.join(__dirname, '/views/partials'), // Directorio de parciales opcional
})

//Se declara solo el servidor HTTP como una constante.
const httpServer = app.listen(PORT, () => {
   console.log(`Server listening on port http://localhost:${PORT}/`)
})


//Creamos un servidor para Sockets, este recibe por parametro el servidor HTTP.
//Es decir, vamos a tener un servidor websocket, DENTRO del servidor HTTP.
const socketServer = new Server(httpServer)

app.use(express.json())
app.use(express.urlencoded({ extended: true }))


app.engine('handlebars', hdbs.engine)
app.set('views', path.join(__dirname, '/views')) // Directorio base de vistas
app.set('view engine', 'handlebars')

//Cambiar el static por el public
app.use('/public', express.static(path.join(__dirname, '/public')));

app.use('/views', viewsRouter)
app.use('/upload', multerRouter)
app.use('/chat', chatRouter)

let mensajes = []

//Se conecta un usuario y sale el log de "nuevo cliente"
socketServer.on('connection', (socket) => {
   console.log(`Cliente con ID: ${socket.id}`);
   
   //Cuando el socket conectado envie un evento de tipo message, ejecutar este código.
   socket.on('mensaje', (data) => {
      console.log(data);
      mensajes.push(data); // Agrega el mensaje al array
      socket.emit('respuesta', mensajes); // Enviar solo el array de mensajes al cliente
   });

   //Detectar desconexión
   socket.on('disconnect', () => {
      console.log('User desconectado, ID:', socket.id);
   });
});
