import express from 'express';
import handlebars from 'express-handlebars';
import viewsRouter from './routes/views.routes.js';
import { __dirname, __filename } from './utils/path.js';
import path from 'path';
import { Server } from 'socket.io'; // Se importa para abrir el servidor

const app = express();
const PORT = 8080;

// Se declara solo el servidor HTTP como una constante.
const httpServer = app.listen(PORT, () => {
    console.log(`Server listening on port http://localhost:${PORT}/`);
});

// Creamos un servidor para Sockets, este recibe por parámetro el servidor HTTP.
// Es decir, vamos a tener un servidor websocket, DENTRO del servidor HTTP.
const socketServer = new Server(httpServer);

// Recibe y maneja JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Inicializa el motor handlebars
app.engine('handlebars', handlebars.engine());

// Setea las views que se van a usar (de dónde las saca...)
app.set('views', path.join(__dirname, 'views'));

// Setea el USO de handlebars. Se usa el alias designado previo a la ruta.
app.set('view engine', 'handlebars');

// Defino la carpeta pública como destino de los archivos estáticos
app.use('/static', express.static(path.join(__dirname, 'public')));

// Trae el router de las vistas
app.use('/views', viewsRouter);

// Configuración del servidor de sockets
socketServer.on('connection', (socket) => {
    console.log('Nuevo cliente conectado');
});

export default app;
