import express from 'express'
import  handlebars from 'express-handlebars'
import viewsRouter from './routes/views.routes.js'
import path from 'path'
import {__dirname, __filename} from './utils/path.js'
import {Server} from 'socket.io' //Se importa para abrir el servidor
const app = express()
const PORT = 8080


//Se declara solo el servidor HTTP como una constante.
const httpServer = app.listen(PORT, ()=>{
   console.log(`Server listening on port http://localhost:${PORT}/`)
})


//Creamos un servidor para Sockets, este recibe por parametro el servidor HTTP.
//Es decir, vamos a tener un servidos websocket, DENTRO del servidor HTTP.
const socketServer = new Server(httpServer)


//Recibe y maneja JSON
app.use(express.json())
app.use(express.urlencoded({extended: true}))


//Inicializa el motor handlebars
app.engine('handlebars', handlebars.engine())
//Setea las views que se van a usar (De dónde las saca...)
app.set('views', path.join(__dirname, '../views'));
//Setea el USO de handlebars. Se usa el alias designado previo a la ruta.
app.set('view engine', 'handlebars')


//Defino la carpeta publica como destino de los archivos estáticos
app.use(express.static(__dirname + '/public'))


//Trae el router de las vistas
app.use('/views', viewsRouter)


//Se conecta un usuario y sale el log de "nuevo cliente"
socketServer.on('connection', (socket)=>{
   console.log('Nuevo cliente conectado');
   
   //Cuando el socket conectado envie un evento de tipo message, ejecutar este codigo. 
   //(Muestra el message enviado) 
   socket.on('message', (data)=>{
      console.log(data);
   })

   socket.emit('evento_para_socket_individual', 'Este mensaje lo recibe solo el socket individual')

   socket.emit('evento_para_todos_menos_el_socket_actual', 'Este evento lo veran todos los sockets conectados, menos el socket actual desde el que se envío el mensaje')

   socket.emit('evento_para_todos', 'Este mensaje lo reciben todos los sockets conectados')

})