import express from 'express';
import productRouter from './routes/producto.routes.js';
import cartRouter from './routes/cart.routes.js';
import { create } from 'express-handlebars';
import path from 'path';
import { __dirname } from './path.js';
import viewsRouter from './routes/views.routes.js';
import { Server } from 'socket.io';
import fs from 'fs/promises';
import Product from './entity/Product.js';
import connectionDataBase from './utils/connectDB.js';
import cors from 'cors'
import corsHandle from './utils/corsHandle.js';
import swaggerUI from 'swagger-ui-express';
import swaggerConfig from './swagger/swagger.js';
import {errorHandler} from './middlewares/error.handler.js';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import dotenv from 'dotenv';
import cookieRouter from './routes/cookie.routes.js';
import sessionRouter from './routes/session.routes.js';
import MongoStore from 'connect-mongo';

dotenv.config();

const app = express();
const PORT = process.env.PORT ?? 8080;
const hdbs = create();

const httpServer = app.listen(PORT, () => { //Levanta el servidor
    console.log(`Server listening on port http://localhost:${PORT}/`);
    connectionDataBase();
});

const socketServer = new Server(httpServer); //Crea el servidor de socket

app.use(express.json()); //Permite json

app.use(cors({ //Maneja cors
    origin: corsHandle,
    credentials: true //Permite intercambio de credenciales(cookies, headers)
}));

app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerConfig)); //Maneja la documentación de swagger

app.use(express.urlencoded({ extended: true })); //Permite recibir datos de formularios

app.engine('handlebars', hdbs.engine); //Setea el motor de plantillas
app.set('views', path.join(__dirname, '/views')); //Setea la carpeta de las plantillas
app.set('view engine', 'handlebars'); //Conecta el motor de plantillas con express

app.use('/static', express.static(path.join(__dirname, 'public'))); //Maneja los archivos estáticos

//COOKIE Y SESSION
app.use(cookieParser(process.env.COOKIE_KEY)); //Maneja las cookies

app.use(session({ //Maneja las sesiones
    secret: process.env.COOKIE_KEY,
    store: MongoStore.create({ //Guarda las sesiones en la base de datos
        mongoUrl: process.env.URL_DB, //URL de la base de datos
        ttl: 60, //Tiempo de vida de la sesión en segundos (1 minuto)
        crypto:{
            secret: process.env.COOKIE_KEY //Clave para cifrar el id de la cookie
        }
    }),
    cookie: { maxAge: 60000 }, // 60000 milisegundos son 1 minuto
    resave: true,
    saveUninitialized: true
}));

app.use('/api/products', productRouter);
app.use('/api/carts', cartRouter);
app.use('/views',viewsRouter);
app.use('/api/cookie', cookieRouter); //Maneja las rutas de cookies
app.use('/api/session', sessionRouter); //Maneja las rutas de sesiones


app.use((req, res) => { //Maneja errores 404 de no encontrar endpoint
    res.status(404).render('templates/errorPage');
}); 

app.use(errorHandler); //Utiliza el middleware de manejo de errores para los endpoints

//Manejo de WebSockets
const productsPath = path.resolve(__dirname, 'db/products.json'); //Ruta de los productos
let products = JSON.parse(await fs.readFile(productsPath, 'utf-8')); //Productos

//Escucha de eventos de conexión y actualización de productos en realtime
socketServer.on('connection', (socket) => {
    console.log(`Conexión id: ${socket.id}`);
    socket.emit('updateProducts', products); //Productos iniciales al conectarse
    socket.on('createProduct', async (data) => { //Escucha creacion del producto
        const productWithId = new Product(data)
        products.push(productWithId);
        await fs.writeFile(productsPath, JSON.stringify(products, null, 2)); 
        socketServer.emit('updateProducts', products); //Productos actualizados
        console.log('Product created with id:',productWithId.id);
    });
    socket.on('disconnect', () => {
        console.log('User desconectado, ID:', socket.id);
    });
});

