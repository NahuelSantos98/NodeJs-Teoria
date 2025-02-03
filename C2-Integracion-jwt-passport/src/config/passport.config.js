import passport from 'passport';
import local from 'passport-local';
import jwt from 'passport-jwt';
import { createHash } from '../utils/configPassword.js';
import userModel from '../models/user.model.js';
import dotenv from 'dotenv'

dotenv.config()

const LocalStrategy = local.Strategy; // Crea estrategia local para registro
const JWTEstrategy = jwt.Strategy; // Crea estrategia con JWT.
const JWTExtract = jwt.ExtractJwt; // Crea para extraer el JWT.

const cookieExtractor = (req) => {
    let token = null;
    if (req && req.headers) {
        token = req.headers.authorization?.split(' ')[1]; // Usa optional chaining en lugar de condicional
        // El formato Authorization es: "Bearer <TOKEN>", por eso lo corta en el ' '
    }
    return token;
};

const initializePassport = () => {

    // Estrategia para el registro de usuario
    passport.use('register', new LocalStrategy({
        passReqToCallback: true, // Permite recibir el objeto req en la estrategia
        usernameField: 'email', // Usa 'email' como el campo para autenticación
    }, async (req, username, password, done) => {
        const { first_name, last_name, email, age } = req.body;

        try {
            let user = await userModel.findOne({ email: username });

            if (!user) { // Si el usuario no existe
                // Crear un nuevo usuario
                const newUser = {
                    first_name,
                    last_name,
                    email,
                    age,
                    password: createHash(password), // Crea el hash de la contraseña
                };

                let result = await userModel.create(newUser); // Guardar el nuevo usuario en la base de datos

                // Crea un token JWT para el nuevo usuario
                const token = jwt.sign({
                    email: result.email,
                    id: result._id,
                    role: result.role || 'user', // Asigna rol 'user' por defecto si no existe
                    password: result.password,
                }, process.env.JWT_SECRET, { expiresIn: '1h' });

                // Devuelve el usuario junto con el token
                return done(null, { user: result, token });
            }

            console.log('User exists'); // El usuario ya existe
            return done(null, false, { message: 'User already exists' });

        } catch (e) {
            return done("Error while registering the user" + e); // Manejo de errores
        }
    }));

    // Serializar usuario (solo guardar el ID para evitar problemas de memoria)
    passport.serializeUser((user, done) => {
        done(null, user._id); // Guarda solo el ID del usuario
    });

    // Deserializar usuario (recuperar el usuario de la base de datos por ID)
    passport.deserializeUser(async (id, done) => {
        let user = await userModel.findById(id); // Busca el usuario por su ID
        done(null, user); // Devuelve el usuario completo a req.user
    });

    // Estrategia JWT para rutas protegidas
    passport.use('jwt', new JWTEstrategy({
        jwtFromRequest: JWTExtract.fromExtractors([cookieExtractor]), // Extrae el JWT de los headers
        secretOrKey: process.env.JWT_SECRET, // Usar la misma clave secreta para la verificación
    }, async (jwt_payload, done) => {
        try {
            // Si el JWT es válido, lo pasa al siguiente middleware
            return done(null, jwt_payload);
        } catch (e) {
            return done(e); // Manejo de errores
        }
    }));
};

export default initializePassport;
