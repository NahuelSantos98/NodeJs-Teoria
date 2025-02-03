import passport from 'passport'
import local from 'passport-local'
import jwt, { ExtractJwt } from 'passport-jwt'
import {createHash, isValidPassword} from '../utils/configPassword.js'
import userModel from '../models/user.model.js'

const LocalStrategy = local.Strategy //Crea estrategia local para register
const JWTEstrategy = jwt.Strategy //Crea estrategia con jwt.
const JWTExtract = jwt.ExtractJwt //Crea para obtener el jwt.

const cookieExtractor = (req)=>{
    let token = null
    if(req && req.headers){
        token = req.headers.authorization.split(' ')[1]
        //El formato Authorization es: "Bearer <TOKEN>", por eso lo corta en el  ' '
    }
    return token
}

const initializePassport = ()=>{

    passport.use('register', new LocalStrategy({
        passReqToCallback: true, //permite recibir el objeto req del enpoint en la configuración para poder obtener la info completa.\  
        usernameField: 'email' //Este parámetro especifica el nombre del campo en el formulario que se utilizará como "username" para la autenticación.
    }, async(req, username, password, done)=>{
        const {first_name, last_name, email, age } = req.body
    
        try {
            let user = await userModel.findOne({email: username})
    
            if(!user){ //Si el usuario no se encuentra
                const newUser = {
                    first_name,
                    last_name, 
                    email,
                    age,
                    password : createHash(password)
                }
    
                let result = await userModel.create(newUser) //Lo crea
    
                // Crea el token al haberse registrado
                // El rol está por default en "user"
                const token = jwt.sign({ email: result.email, id: result._id, role: result.role, password: result.password }, process.env.JWT_SECRET, { expiresIn: '1h' });
    
                // Ahora devuelves el token generado al usuario en la respuesta
                return done(null, { user: result, token }); // Devolvemos el usuario con el token
            }
    
            console.log('User Exists'); //Sino el usuario ya existe.
            return done(null, false, {message: 'User already exists'}) 
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

    passport.use('jwt', new JWTEstrategy({
        jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]), //Extrae el JWT de la cookie
        secretOrKey: process.env.JWT_SECRET
    }, async(jwt_payload, done)=>{
        try {
            return done(null, jwt_payload)
        } catch (e) {
            return done(e)
        }
    }))
}

export default initializePassport