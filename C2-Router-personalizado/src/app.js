import express from 'express';
import { create } from 'express-handlebars';
import path from 'path';
import { __dirname } from './path.js';
import { Server } from 'socket.io';
import fs from 'fs/promises';
import Product from './entity/Product.js';
import connectionDataBase from './utils/connectDB.js';
import cors from 'cors'
import corsHandle from './utils/corsHandle.js';
import swaggerUI from 'swagger-ui-express';
import swaggerConfig from './swagger/swagger.js';
import { errorHandler } from './middlewares/error.middleware.js';
import initializePassport from './passport/passportConfig.js';
import passport from 'passport';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv'
import router from './routes/index.routes.js';
import { userCustomRouter } from './routes/customRouter/user.customRouter.js';

const app = express();
const PORT = process.env.PORT ?? 8080;
const hdbs = create();
dotenv.config()

const httpServer = app.listen(PORT, () => {
    console.log(`Server listening on port http://localhost:${PORT}/`);
    connectionDataBase();
});

const socketServer = new Server(httpServer);

app.use(express.json());

app.use(cors({
    origin: corsHandle
}));

//Session
app.use(session({ //Maneja las sesiones
    secret: process.env.COOKIE_KEY,
    store: MongoStore.create({
        mongoUrl: process.env.URL_DB,
        ttl: 60 * 60,
        crypto:{
            secret: process.env.COOKIE_KEY
        }
    }),
    cookie: { 
        maxAge: 60 * 60 * 1000, 
        httpOnly: true,
    },
    resave: true,
    saveUninitialized: true, 
}));


//Passport
initializePassport()
app.use(passport.initialize())
app.use(passport.session())

//Cookie parser
app.use(cookieParser(process.env.COOKIE_KEY));

app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerConfig));

app.use(express.urlencoded({ extended: true }));

app.engine('handlebars', hdbs.engine);
app.set('views', path.join(__dirname, '/views'));
app.set('view engine', 'handlebars');

app.use('/static', express.static(path.join(__dirname, 'public')));

app.use('/api', router);
app.use('/customRouter', userCustomRouter.getRouter());


app.use(errorHandler);

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

