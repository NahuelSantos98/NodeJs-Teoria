import express from 'express';
import productRouter from './routes/product.routes.js';
import cartRouter from './routes/cart.routes.js';
import { create } from 'express-handlebars';
import path from 'path';
import { __dirname } from './path.js';
import viewsRouter from './routes/views.routes.js';
import { Server } from 'socket.io';
import fs from 'fs/promises';
import Product from './entity/Product.js';
import connectionDataBase from './utils/connectDb.js'; //Se importa para poder conectar al servidor con la BBDD

const app = express();
const PORT = 8080;
const hdbs = create();

const httpServer = app.listen(PORT, async() => {
    console.log(`Server listening on port http://localhost:${PORT}/`);
    connectionDataBase() //Se utiliza al levantar el servidor
});


const socketServer = new Server(httpServer);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.engine('handlebars', hdbs.engine);
app.set('views', path.join(__dirname, '/views'));
app.set('view engine', 'handlebars');

app.use('/static', express.static(path.join(__dirname, 'public')));

app.use('/api/products', productRouter);
app.use('/api/carts', cartRouter);
app.use(viewsRouter);

app.use((req, res) => {
    res.status(404).render('templates/errorPage');
});

const productsPath = path.resolve(__dirname, 'db/products.json');
let products = JSON.parse(await fs.readFile(productsPath, 'utf-8'));

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

