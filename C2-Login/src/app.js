import express from 'express'
import userRoutes from './routes/user.routes.js'
import cookieRouter from './routes/cookie.routes.js'
import sessionRouter from './routes/session.routes.js'
import connectionDataBase from './utils/connectDB.js'
import cookieParser from 'cookie-parser'
import session from 'express-session'


const app = express()
const PORT = 8080 || process.env.PORT

app.use(express.json())
app.use(express.urlencoded({extended: true}))

//Config para cookieParser con session
app.use(cookieParser("Secret")) //Se setea el secret para firmar la cookie con ParseCookie

app.use(session({  //Se setea el secret para firmar la cookie con express-session
    secret: "Secret", //Secret es la clave con la que se firma la cookie (Hay que poner el mismo valor que en cookieParser)
    cookie: {maxAge: 60000}, //Duración de las cookies
    resave: true,   //Forza a que la sesión se guarde en el store
    saveUninitialized: true //Guarda la sesión aunque no haya sido inicializada
}))



app.use('/api/users', userRoutes)
app.use('/api/cookie', cookieRouter)
app.use('/api/session', sessionRouter)

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
    connectionDataBase()
})