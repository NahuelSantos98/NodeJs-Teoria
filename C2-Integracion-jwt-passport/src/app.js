import express from 'express'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser';
import session from 'express-session';
import passport from 'passport';
import MongoStore from 'connect-mongo';
import connectionDataBase from '../../C2-Proteccion-pswd-estrategia-autenticacion-local/src/utils/connectDB.js';
import initializePassport from './config/passport.config.js';
import jwtRouter from './routes/jwtImplement.routes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT ?? 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true })); 

app.use(cookieParser(process.env.COOKIE_KEY)); //Maneja las cookies

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

initializePassport()
app.use(passport.initialize())
app.use(passport.session())


app.use('/api/jwt', jwtRouter)


app.listen(PORT, () => {
    console.log(`Server listening on port http://localhost:${PORT}/`);
    connectionDataBase();
});