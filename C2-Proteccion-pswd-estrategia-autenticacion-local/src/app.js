import express from 'express';
import productRouter from './routes/producto.routes.js';
import cartRouter from './routes/cart.routes.js';
import { create } from 'express-handlebars';
import path from 'path';
import { __dirname } from './path.js';
import viewsRouter from './routes/views.routes.js';
import connectionDataBase from './utils/connectDB.js';
import {errorHandler} from './middlewares/error.handler.js';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import dotenv from 'dotenv';
import cookieRouter from './routes/cookie.routes.js';
import sessionRouter from './routes/session.routes.js';
import MongoStore from 'connect-mongo';
import initializePassport from './config/passport.config.js';
import passport from 'passport';

dotenv.config();

const app = express();
const PORT = process.env.PORT ?? 8080;
const hdbs = create();

app.use(express.json());

app.use(express.urlencoded({ extended: true })); 

app.engine('handlebars', hdbs.engine);
app.set('views', path.join(__dirname, '/views')); 
app.set('view engine', 'handlebars');

app.use('/static', express.static(path.join(__dirname, 'public')));

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

initializePassport()
app.use(passport.initialize())
app.use(passport.session())

app.use('/api/products', productRouter);
app.use('/api/carts', cartRouter);
app.use('/views',viewsRouter);
app.use('/api/cookie', cookieRouter);
app.use('/api/session', sessionRouter);


app.use((req, res) => {
    res.status(404).render('templates/errorPage');
}); 

app.use(errorHandler); //Utiliza el middleware de manejo de errores para los endpoints

app.listen(PORT, () => {
    console.log(`Server listening on port http://localhost:${PORT}/`);
    connectionDataBase();
});
