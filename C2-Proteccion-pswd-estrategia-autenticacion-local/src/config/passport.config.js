import passport from 'passport'
import local from 'passport-local'
import {createHash, isValidPassword} from '../utils/configPassword.js'
import userModel from '../models/userModel.js'

const LocalStrategy = local.Strategy //Define la estrategia
//Al ser local permite la comparación de valores puestos en un input en relacion a valores almacenados en la BBDD

const initializePassport = ()=>{  //Inicializa Passport
    passport.use('register', new LocalStrategy(
        { 
        //Se le pasa primero el nombre de la estrategia y luego la estrategia con su configuración.
        passReqToCallback: true, //permite recibir el objeto req del enpoint en la configuración para poder obtener la info completa.
        usernameField: 'email' //Este parámetro especifica el nombre del campo en el formulario que se utilizará como "username" para la autenticación. Por defecto, passport-local espera un campo llamado username, pero si tu formulario usa otro nombre (como email), debes configurarlo aquí.
    }, async (req, username, password, done) => { // Lógica de verificación
        const {first_name, last_name, email, age } = req.body
        try {
            let user = await userModel.findOne({email: username}) //Busca en la BBDD
            if(user){
                console.log('User Exists');
                return done(null, false) 
                //done recibe parametros: done(error, user, info)
                //null = no hubo error      |  false: Proceso de registro fallido pq ya existe el usuario
            }

            const newUser = {
                first_name, last_name, email, age,
                password: createHash(password)
            } //Crea el nuevo usuario con toda la info y la pswd hasheada

            let result = await userModel.create(newUser) //Crea el user
            return done(null, result) //No hubo error, el result es el user creado.

        } catch (e) {
            return done("Error while registering the user" + e)
        }
    }))

    passport.serializeUser((user, done)=>{
        done(null, user._id) //Guarda SOLO el id del usuario en la sesión (Menos memoria que guardar el objeto completo).
    })

    passport.deserializeUser(async (id, done)=>{
        let user = await userModel.findById(id) //Busca el user
        done(null, user) //Guarda el usuario para poder tener acceso al mismo desde req.user
    })


    passport.use('login', new LocalStrategy({
        usernameField: 'email'
    }, async (username, password, done)=>{
        try {
            let user = await userModel.findOne({email: username})

            if(!user){
                console.log('User does not exist');
                return done(null, false)
            }

            if(!isValidPassword(user, password)){ //Si no es valido = error
                return done(null, false)
            }

            return done(null, user) //Es valido, retorna el usuario
        } catch (e) {
            return done(e)
        }
    }))
}

export default initializePassport